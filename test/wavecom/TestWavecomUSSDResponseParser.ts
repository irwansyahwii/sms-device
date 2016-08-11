import Rx = require('rxjs/Rx');
import {WavecomUSSDResponseParser} from '../../lib/wavecom/WavecomUSSDResponseParser';
import {assert} from 'chai';
import {USSDResponseType} from '../../lib/USSDResponse';


describe('WavecomUSSDResponseParser', function(){
    describe('parse', function(){
        it('can parse a USSD response', function(done){
            let ussdResponse = `
AT+CUSD=1,"*888#",15
OK

+CUSD: 1,"Sisa pulsa Rp.24025.Aktif sd 28/08/2016.
BBMan makin asik dgn stiker Mas Bewok! Beli skrg di http://tsel.me/msbewok

2.Info Kartu
",0            
            `;

            let parser = new WavecomUSSDResponseParser();
            parser.parse(ussdResponse)
                .subscribe(responseInfo =>{
                    assert.isNotNull(responseInfo);
                    assert.equal(responseInfo.responseType, USSDResponseType.WaitingReply, 'responseType is wrong');
                    assert.equal(responseInfo.text, `Sisa pulsa Rp.24025.Aktif sd 28/08/2016.
BBMan makin asik dgn stiker Mas Bewok! Beli skrg di http://tsel.me/msbewok

2.Info Kartu`, 'text is wrong');
                }, null, () => done());
        })
    })
})