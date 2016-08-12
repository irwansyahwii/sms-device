import Rx = require('rxjs/Rx');
import {WavecomUSSDResponseParser} from '../../lib/wavecom/WavecomUSSDResponseParser';
import {assert} from 'chai';
import {USSDResponseType} from '../../lib/USSDResponse';


describe('WavecomUSSDResponseParser', function(){
    describe('parse', function(){
        it('can parse a USSD response from regular Telkomsel card', function(done){
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
                    done();
                }, null, () => {});
        })

        it('can parse a USSD response from a Telkomsel SD card', function(done){
            let ussdResponse = `
AT+CUSD=1,"*776#",15
OK

+CUSD: 2,"Maaf, operasi gagal karena format pesan yang tidak valid.",15

            `;

            let parser = new WavecomUSSDResponseParser();
            parser.parse(ussdResponse)
                .subscribe(responseInfo =>{
                    assert.isNotNull(responseInfo);
                    assert.equal(responseInfo.responseType, USSDResponseType.Terminated, 'responseType is wrong');
                    assert.equal(responseInfo.text, `Maaf, operasi gagal karena format pesan yang tidak valid.`, 'text is wrong');
                    done();
                }, null, () => {});
        })

        it('can parse a USSD response telling masa tenggang', function(done){
            let ussdResponse = `
AT+CUSD=1,"*888#",15
OK

+CUSD: 2,"Masa tenggang kartu Anda akan berakhir pada 26/08/2016. Silakan lakukan pengisian ulang.",0

            `;

            let parser = new WavecomUSSDResponseParser();
            parser.parse(ussdResponse)
                .subscribe(responseInfo =>{
                    assert.isNotNull(responseInfo);
                    assert.equal(responseInfo.responseType, USSDResponseType.Terminated, 'responseType is wrong');
                    assert.equal(responseInfo.text, `Masa tenggang kartu Anda akan berakhir pada 26/08/2016. Silakan lakukan pengisian ulang.`, 'text is wrong');
                    done();
                }, null, () => {});
        })

        it('can parse not supported response', function(done){
            let ussdResponse = `
AT+CUSD=1,"*676#",15
OK

+CUSD: 4

            `;

            let parser = new WavecomUSSDResponseParser();
            parser.parse(ussdResponse)
                .subscribe(responseInfo =>{
                    assert.isNotNull(responseInfo);
                    assert.equal(responseInfo.responseType, USSDResponseType.NotSupported, 'responseType is wrong');
                    assert.equal(responseInfo.text, ``, 'text is wrong');
                    done();
                }, null, () => {});
        })

    })

})


