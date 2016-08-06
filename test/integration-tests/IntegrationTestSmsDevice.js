"use strict";
const index_1 = require('../../index');
const chai_1 = require('chai');
describe('SmsDevice', function () {
    describe('identify()', function () {
        it('identify the device', function (done) {
            this.timeout(9000);
            let smsDevice = index_1.SmsDevice.create();
            let configFilePath = __dirname + '/smsd.rc';
            smsDevice.setConfigFile(configFilePath)
                .flatMap(v => {
                return smsDevice.identify();
            })
                .subscribe(r => {
                chai_1.assert.isNotNull(r);
                console.log(r);
                done();
            }, err => {
                console.log(err);
                done();
            });
        });
    });
    describe('readAllSms()', function () {
        it('read all sms from the device', function (done) {
            this.timeout(9000);
            let smsDevice = index_1.SmsDevice.create();
            let configFilePath = __dirname + '/smsd.rc';
            smsDevice.setConfigFile(configFilePath)
                .flatMap(v => {
                return smsDevice.readAllSms();
            })
                .subscribe(r => {
                chai_1.assert.isNotNull(r);
                console.log(r);
                done();
            }, err => {
                console.log(err);
                done();
            });
        });
    });
    describe('sendSms()', function () {
        it('send an sms to the device', function (done) {
            this.timeout(9000);
            let smsDevice = index_1.SmsDevice.create();
            let configFilePath = __dirname + '/smsd.rc';
            smsDevice.setConfigFile(configFilePath)
                .flatMap(v => {
                return smsDevice.sendSms('08891366079', 'from integration test');
            })
                .subscribe(r => {
                chai_1.assert.isNotNull(r);
                console.log(r);
                done();
            }, err => {
                console.log('ERROR:');
                console.log(err);
                done();
            });
        });
    });
});
