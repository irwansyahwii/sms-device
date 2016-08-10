import {WavecomModemDriver} from '../../lib/wavecom/WavecomModemDriver';


describe('WavecomModemDriver', function(){
    describe('identify()', function(){
        it('return the correct result', function(done){
            this.timeout(4000);
            let driver = new WavecomModemDriver();

            driver.identify('/dev/ttyUSB0')
                .subscribe(r =>{
                    console.log(r);
                    done();
                })
        });
    })
});

