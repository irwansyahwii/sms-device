/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
"use strict";
const chai_1 = require('chai');
const SmsDevice_1 = require('../lib/SmsDevice');
const SmsDeviceInfo_1 = require('../lib/SmsDeviceInfo');
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
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null);
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
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null);
            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, () => {
                chai_1.assert.equal(smsDevice.getConfigFile(), 'config1.rc', 'Config file is incorrect');
                done();
            });
        });
        it('doesnt stored the config file path when the  file not exists', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(false);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null);
            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, () => {
                chai_1.assert.equal(smsDevice.getConfigFile(), '', 'Config file is incorrect');
                done();
            });
        });
    });
    describe('identify', function () {
        it('checks if the config file has been set', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null);
            smsDevice.identify()
                .subscribe(null, err => {
                chai_1.assert.equal(err.message, 'Identify failed. No config file specified.', 'Must not reached here');
                done();
            }, () => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            });
        });
        it('calls IModemDriver.identify() properly', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let isModemDriverIdentifyCalled = false;
            let modemDriver = {
                identify: function (configFIle) {
                    return Rx.Observable.create(s => {
                        chai_1.assert.equal(configFIle, 'config1.rc');
                        isModemDriverIdentifyCalled = true;
                        s.next('info1');
                        s.complete();
                    });
                }
            };
            let identifyMetadataParser = {
                parse: function (metadata) {
                    return Rx.Observable.create(s => {
                        chai_1.assert.equal(metadata, 'info1', 'metadata different');
                        s.next(new SmsDeviceInfo_1.SmsDeviceInfo());
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, modemDriver, identifyMetadataParser);
            smsDevice.setConfigFile('config1.rc')
                .concat(smsDevice.identify())
                .subscribe(null, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, () => {
                chai_1.assert.isTrue(isModemDriverIdentifyCalled, 'Modem driver identify not called');
                done();
            });
        });
        it('calls the identify metadata parser', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let isModemDriverIdentifyCalled = false;
            let modemDriver = {
                identify: function (configFIle) {
                    return Rx.Observable.create(s => {
                        s.next('info1');
                        s.complete();
                    });
                }
            };
            let identifyMetadataParser = {
                parse: function (metadata) {
                    return Rx.Observable.create(s => {
                        chai_1.assert.equal(metadata, 'info1', 'metadata different');
                        s.next(new SmsDeviceInfo_1.SmsDeviceInfo());
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, modemDriver, identifyMetadataParser);
            smsDevice.setConfigFile('config1.rc')
                .concat(smsDevice.identify())
                .skip(1)
                .subscribe(deviceInfo => {
                chai_1.assert.isObject(deviceInfo, 'deviceInfo is not object');
                chai_1.assert.isTrue(deviceInfo instanceof SmsDeviceInfo_1.SmsDeviceInfo, 'Not returning instance of SmsDeviceInfo');
                done();
            }, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, () => {
            });
        });
    });
});
