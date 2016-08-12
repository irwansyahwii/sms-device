import {ISmsDevice, SmsDevice} from '../../index';
// import {ISmsDevice, SmsDevice} from 'sms-device';
import {assert} from 'chai';



describe('SmsDevice', function(){
    // describe('deleteAllSms()', function(){
    //     it('delete all sms from the device', function(done){
    //         this.timeout(9000);

    //         let smsDevice = SmsDevice.create();

    //         let configFilePath = '/dev/ttyUSB0';

    //         smsDevice.setConfigFile(configFilePath)
    //             .flatMap(v => {                    
    //                 return smsDevice.deleteAllSms(3, 3);
    //             })
    //             .subscribe(r =>{
    //                 assert.isNotNull(r);
    //                 console.log(r);

    //             }, err =>{
    //                 console.log(err);
    //             }, () =>{
    //                 done();
    //             })
    //     });
    // });
    
    describe('identify()', function(){
        it('identify the device', function(done){
            this.timeout(9000);

            let smsDevice = SmsDevice.create();

            let configFilePath = '/dev/ttyUSB2';

            smsDevice.setConfigFile(configFilePath)
                .flatMap(v => {                    
                    return smsDevice.identify()
                })
                .subscribe(r =>{
                    assert.isNotNull(r);
                    console.log(r);

                }, err =>{
                    console.log(err);
                }, () =>{
                    done();
                })

        });        
    });

    describe('readAllSms()', function(){
        it('read all sms from the device', function(done){
            this.timeout(9000);

            let smsDevice = SmsDevice.create();

            let configFilePath = '/dev/ttyUSB2';

            smsDevice.setConfigFile(configFilePath)
                .flatMap(v => {                    
                    return smsDevice.readAllSms();
                })
                .subscribe(r =>{
                    assert.isNotNull(r);
                    console.log(r);

                }, err =>{
                    console.log(err);
                }, () =>{
                    done();
                })
        });
    });

    // describe('sendSms()', function(){
    //     it('send an sms to the device', function(done){
    //         this.timeout(9000);

    //         let smsDevice = SmsDevice.create();

    //         let configFilePath = '/dev/ttyUSB0';

    //         smsDevice.setConfigFile(configFilePath)
    //             .flatMap(v => {                    
    //                 return smsDevice.sendSms('08891366079', 'from integration test');
    //             })
    //             .subscribe(r =>{
    //                 assert.isNotNull(r);
    //             }, err =>{
    //                 console.log('ERROR:');
    //                 console.log(err);
    //             }, () =>{
    //                 done();
    //             })
    //     });
    // });

    describe('getUSSD()', function(){
        it('getUSSD() response', function(done){
            this.timeout(9000);

            let smsDevice = SmsDevice.create();

            let configFilePath = '/dev/ttyUSB3';

            smsDevice.setConfigFile(configFilePath)
                .flatMap(v => {                    
                    return smsDevice.getUSSD('*776*1*664041#');
                })
                .subscribe(r =>{
                    assert.isNotNull(r);
                    console.log(r);

                }, err =>{
                    console.log(err);
                }, () =>{
                    done();
                })
        });
    });

})
