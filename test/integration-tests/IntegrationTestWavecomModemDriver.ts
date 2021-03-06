import {WavecomModemDriver} from '../../lib/wavecom/WavecomModemDriver';


describe('WavecomModemDriver', function(){
    describe('identify()', function(){
        it('return the correct result', function(done){
            this.timeout(4000);
            let driver = new WavecomModemDriver();

            driver.identify('/dev/ttyUSB2')
                .subscribe(r =>{
                    console.log(r);
                }, err => {
                    console.log(err);
                }, ()=>{
                    done();
                })
        });
    })
    describe('getUSSD()', function(){
        it('return the correct result', function(done){
            this.timeout(9000);
            let driver = new WavecomModemDriver();

            driver.getUSSD('/dev/ttyUSB2', '*770*5577#')
                .subscribe(r =>{
                    console.log('USSD response:');
                    console.log(r);
                }, err =>{
                    console.log(err);
                }, () =>{
                    done();
                })
        });
    })    
});

