/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
"use strict";
const chai_1 = require('chai');
const SmsDevice_1 = require('../lib/SmsDevice');
const Rx = require('rxjs/Rx');
describe('SmsDevice', function () {
    describe('create', function () {
        it('create a new instance of ISmsDevice with default device implementations', function (done) {
            let smsDevice = SmsDevice_1.SmsDevice.create();
            chai_1.assert.isNotNull(smsDevice);
            done();
        });
    });
    describe('setConfigFile', function () {
        it('calls the IFileManager instance to check for the file existence', function (done) {
            let isFileManagerCalled = false;
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        isFileManagerCalled = true;
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager);
            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, () => {
                chai_1.assert.isTrue(isFileManagerCalled);
                done();
            });
        });
        it('stored the config file path when the file exists', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager);
            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, () => {
                chai_1.assert.equal(smsDevice.getConfigFile(), 'config1.rc', 'Config file is incorrect');
                done();
            });
        });
        it('doesnt stored the config file path when the file exists', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(false);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager);
            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, () => {
                chai_1.assert.equal(smsDevice.getConfigFile(), '', 'Config file is incorrect');
                done();
            });
        });
    });
});
