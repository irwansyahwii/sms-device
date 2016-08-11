"use strict";
const WavecomUSSDResponseParser_1 = require('../../lib/wavecom/WavecomUSSDResponseParser');
const chai_1 = require('chai');
const USSDResponse_1 = require('../../lib/USSDResponse');
describe('WavecomUSSDResponseParser', function () {
    describe('parse', function () {
        it('can parse a USSD response', function (done) {
            let ussdResponse = `
AT+CUSD=1,"*888#",15
OK

+CUSD: 1,"Sisa pulsa Rp.24025.Aktif sd 28/08/2016.
BBMan makin asik dgn stiker Mas Bewok! Beli skrg di http://tsel.me/msbewok

2.Info Kartu
",0            
            `;
            let parser = new WavecomUSSDResponseParser_1.WavecomUSSDResponseParser();
            parser.parse(ussdResponse)
                .subscribe(responseInfo => {
                chai_1.assert.isNotNull(responseInfo);
                chai_1.assert.equal(responseInfo.responseType, USSDResponse_1.USSDResponseType.WaitingReply, 'responseType is wrong');
                chai_1.assert.equal(responseInfo.text, `Sisa pulsa Rp.24025.Aktif sd 28/08/2016.
BBMan makin asik dgn stiker Mas Bewok! Beli skrg di http://tsel.me/msbewok

2.Info Kartu`, 'text is wrong');
            }, null, () => done());
        });
    });
});
