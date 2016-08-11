"use strict";
const WavecomUSSDResponseParser_1 = require('../../lib/wavecom/WavecomUSSDResponseParser');
const chai_1 = require('chai');
const USSDResponse_1 = require('../../lib/USSDResponse');
describe('WavecomUSSDResponseParser', function () {
    describe('parse', function () {
        it('can parse a USSD response from regular Telkomsel card', function (done) {
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
                done();
            }, null, () => { });
        });
        it('can parse a USSD response from a Telkomsel SD card', function (done) {
            let ussdResponse = `
AT+CUSD=1,"*776#",15
OK

+CUSD: 2,"Maaf, operasi gagal karena format pesan yang tidak valid.",15

            `;
            let parser = new WavecomUSSDResponseParser_1.WavecomUSSDResponseParser();
            parser.parse(ussdResponse)
                .subscribe(responseInfo => {
                chai_1.assert.isNotNull(responseInfo);
                console.log(responseInfo);
                chai_1.assert.equal(responseInfo.responseType, USSDResponse_1.USSDResponseType.Terminated, 'responseType is wrong');
                chai_1.assert.equal(responseInfo.text, `Maaf, operasi gagal karena format pesan yang tidak valid.`, 'text is wrong');
                done();
            }, null, () => { });
        });
        it('can parse a USSD response telling masa tenggang', function (done) {
            let ussdResponse = `
AT+CUSD=1,"*888#",15
OK

+CUSD: 2,"Masa tenggang kartu Anda akan berakhir pada 26/08/2016. Silakan lakukan pengisian ulang.",0

            `;
            let parser = new WavecomUSSDResponseParser_1.WavecomUSSDResponseParser();
            parser.parse(ussdResponse)
                .subscribe(responseInfo => {
                chai_1.assert.isNotNull(responseInfo);
                console.log(responseInfo);
                chai_1.assert.equal(responseInfo.responseType, USSDResponse_1.USSDResponseType.Terminated, 'responseType is wrong');
                chai_1.assert.equal(responseInfo.text, `Masa tenggang kartu Anda akan berakhir pada 26/08/2016. Silakan lakukan pengisian ulang.`, 'text is wrong');
                done();
            }, null, () => { });
        });
    });
});
