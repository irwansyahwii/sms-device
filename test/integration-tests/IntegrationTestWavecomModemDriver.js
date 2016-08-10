"use strict";
const WavecomModemDriver_1 = require('../../lib/wavecom/WavecomModemDriver');
describe('WavecomModemDriver', function () {
    describe('identify()', function () {
        it('return the correct result', function (done) {
            this.timeout(4000);
            let driver = new WavecomModemDriver_1.WavecomModemDriver();
            driver.identify('/dev/ttyUSB0')
                .subscribe(r => {
                console.log(r);
                done();
            });
        });
    });
});
