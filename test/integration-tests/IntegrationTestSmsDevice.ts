import {ISmsDevice, SmsDevice} from '../../index';
import {assert} from 'chai';



describe('SmsDevice', function(){
    describe('identify()', function(){
        it('identify the device', function(done){
            this.timeout(9000);

            let smsDevice = SmsDevice.create();

            let configFilePath = __dirname + '/smsd.rc';

            smsDevice.setConfigFile(configFilePath)
                .flatMap(v => {                    
                    return smsDevice.identify()
                })
                .subscribe(r =>{
                    assert.isNotNull(r);
                    console.log(r);

                    done();
                }, err =>{
                    console.log(err);
                    done();
                })

        });        
    });

    describe('readAllSms()', function(){
        it('read all sms from the device', function(done){
            this.timeout(9000);

            let smsDevice = SmsDevice.create();

            let configFilePath = __dirname + '/smsd.rc';

            smsDevice.setConfigFile(configFilePath)
                .flatMap(v => {                    
                    return smsDevice.readAllSms();
                })
                .subscribe(r =>{
                    assert.isNotNull(r);
                    console.log(r);

                    done();
                }, err =>{
                    console.log(err);
                    done();
                })
        });
    });

    describe('sendSms()', function(){
        it('send an sms to the device', function(done){
            this.timeout(9000);

            let smsDevice = SmsDevice.create();

            let configFilePath = __dirname + '/smsd.rc';

            smsDevice.setConfigFile(configFilePath)
                .flatMap(v => {                    
                    return smsDevice.sendSms('08891366079', 'from integration test');
                })
                .subscribe(r =>{
                    assert.isNotNull(r);
                    console.log(r);

                    done();
                }, err =>{
                    console.log('ERROR:');
                    console.log(err);
                    done();
                })
        });
    });

})
