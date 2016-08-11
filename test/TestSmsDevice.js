/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
"use strict";
const chai_1 = require('chai');
const SmsDevice_1 = require('../lib/SmsDevice');
const SmsDeviceInfo_1 = require('../lib/SmsDeviceInfo');
const SmsInfo_1 = require('../lib/SmsInfo');
const Rx = require('rxjs/Rx');
describe('SmsDevice', function () {
    describe('create', function () {
        it('create a new instance of ISmsDevice with default device implementations', function (done) {
            let smsDevice = SmsDevice_1.SmsDevice.create();
            chai_1.assert.isNotNull(smsDevice);
            let smsDeviceInternal = smsDevice;
            chai_1.assert.isNotNull(smsDeviceInternal.fileManager);
            chai_1.assert.isNotNull(smsDeviceInternal.identifyMetadataParser);
            chai_1.assert.isNotNull(smsDeviceInternal.smsMetadataParser);
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
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null, null);
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
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null, null);
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
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null, null);
            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err => {
                chai_1.assert.equal(err.message, 'Config file not found: config1.rc');
                done();
            }, () => {
                chai_1.assert.equal(smsDevice.getConfigFile(), '', 'Config file is incorrect');
                done();
            });
        });
    });
    describe('identify()', function () {
        it('checks if the config file has been set', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null, null);
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
                },
                readAllSms(cf) {
                    return null;
                },
                deleteAllSms: function (configFIle, startLocation, endLocation) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                sendSms(configFIle, destinationPhone, message) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                getUSSD(configFile, ussdCommand) {
                    return null;
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
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, modemDriver, identifyMetadataParser, null);
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
                },
                readAllSms(cf) {
                    return null;
                },
                deleteAllSms: function (configFIle, startLocation, endLocation) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                sendSms(configFIle, destinationPhone, message) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                getUSSD(configFile, ussdCommand) {
                    return null;
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
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, modemDriver, identifyMetadataParser, null);
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
    describe('readAllSms()', function () {
        it('checks if the config file has been set', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null, null);
            smsDevice.readAllSms()
                .subscribe(null, err => {
                chai_1.assert.equal(err.message, 'readAllSms failed. No config file specified.', 'Must not reached here');
                done();
            }, () => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            });
        });
        it('calls IModemDriver.readAllSms()', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let isModemDriverReadAllSmsCalled = false;
            let modemDriver = {
                identify: function (configFIle) {
                    return Rx.Observable.create(s => {
                        s.next('info1');
                        s.complete();
                    });
                },
                readAllSms: function (configFIle) {
                    return Rx.Observable.create(s => {
                        chai_1.assert.equal(configFIle, 'config1.rc');
                        isModemDriverReadAllSmsCalled = true;
                        s.next('info1');
                        s.complete();
                    });
                },
                deleteAllSms: function (configFIle, startLocation, endLocation) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                sendSms(configFIle, destinationPhone, message) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                getUSSD(configFile, ussdCommand) {
                    return null;
                }
            };
            let smsMetadataParser = {
                parse(meta) {
                    return Rx.Observable.create(s => {
                        chai_1.assert.equal(meta, 'info1');
                        s.next([new SmsInfo_1.SmsInfo()]);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, modemDriver, null, smsMetadataParser);
            smsDevice.setConfigFile('config1.rc').subscribe(null, null, () => {
                smsDevice.readAllSms()
                    .subscribe(smsInfos => {
                    chai_1.assert.isTrue(isModemDriverReadAllSmsCalled);
                    done();
                }, err => {
                    chai_1.assert.fail(null, null, 'Must not reached here');
                }, () => {
                });
            });
        });
        it('calls ISmsMetadataParser.parse()', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let isSmsMetadataParseCalled = false;
            let modemDriver = {
                identify: function (configFIle) {
                    return Rx.Observable.create(s => {
                        s.next('info1');
                        s.complete();
                    });
                },
                readAllSms: function (configFIle) {
                    return Rx.Observable.create(s => {
                        s.next('info1');
                        s.complete();
                    });
                },
                deleteAllSms: function (configFIle, startLocation, endLocation) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                sendSms(configFIle, destinationPhone, message) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                getUSSD(configFile, ussdCommand) {
                    return null;
                }
            };
            let smsMetadataParser = {
                parse(meta) {
                    return Rx.Observable.create(s => {
                        chai_1.assert.equal(meta, 'info1');
                        isSmsMetadataParseCalled = true;
                        s.next([new SmsInfo_1.SmsInfo()]);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, modemDriver, null, smsMetadataParser);
            smsDevice.setConfigFile('config1.rc').subscribe(null, null, () => {
                smsDevice.readAllSms()
                    .subscribe(smsInfos => {
                    chai_1.assert.isTrue(isSmsMetadataParseCalled);
                    done();
                }, err => {
                    chai_1.assert.fail(null, null, 'Must not reached here');
                }, () => {
                });
            });
        });
    });
    describe('deleteAllSms', function () {
        it('checks if the config file has been set', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null, null);
            smsDevice.deleteAllSms(1, 3)
                .subscribe(null, err => {
                chai_1.assert.equal(err.message, 'deleteAllSms failed. No config file specified.', 'Must not reached here');
                done();
            }, () => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            });
        });
        it('calls IModemDriver.deleteAllSms()', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let isModemDriverDeleteAllSmsCalled = false;
            let modemDriver = {
                identify: function (configFIle) {
                    return Rx.Observable.create(s => {
                        s.next('info1');
                        s.complete();
                    });
                },
                readAllSms: function (configFIle) {
                    return Rx.Observable.create(s => {
                        s.next('info1');
                        s.complete();
                    });
                },
                deleteAllSms: function (configFIle, startLocation, endLocation) {
                    return Rx.Observable.create(s => {
                        isModemDriverDeleteAllSmsCalled = true;
                        chai_1.assert.equal(configFIle, 'config1.rc');
                        chai_1.assert.equal(startLocation, 1);
                        chai_1.assert.equal(endLocation, 3);
                        s.next();
                        s.complete();
                    });
                },
                sendSms(configFIle, destinationPhone, message) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                getUSSD(configFile, ussdCommand) {
                    return null;
                }
            };
            let smsMetadataParser = {
                parse(meta) {
                    return Rx.Observable.create(s => {
                        chai_1.assert.equal(meta, 'info1');
                        s.next([new SmsInfo_1.SmsInfo()]);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, modemDriver, null, smsMetadataParser);
            smsDevice.setConfigFile('config1.rc').subscribe(null, null, () => {
                smsDevice.deleteAllSms(1, 3)
                    .subscribe(smsInfos => {
                    chai_1.assert.isTrue(isModemDriverDeleteAllSmsCalled);
                    done();
                }, err => {
                    chai_1.assert.fail(null, null, 'Must not reached here');
                }, () => {
                });
            });
        });
    });
    describe('sendSms', function () {
        it('checks if the config file has been set', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, null, null, null);
            smsDevice.sendSms('08912812', 'helooo')
                .subscribe(null, err => {
                chai_1.assert.equal(err.message, 'sendSms failed. No config file specified.', 'Error message is incorrect');
                done();
            }, () => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            });
        });
        it('calls IModemDriver.sendSms()', function (done) {
            let fileManager = {
                isExists: function (filePath) {
                    return Rx.Observable.create(s => {
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let isModemDriverSendSmsCalled = false;
            let modemDriver = {
                identify: function (configFIle) {
                    return Rx.Observable.create(s => {
                        s.next('info1');
                        s.complete();
                    });
                },
                readAllSms: function (configFIle) {
                    return Rx.Observable.create(s => {
                        s.next('info1');
                        s.complete();
                    });
                },
                deleteAllSms: function (configFIle, startLocation, endLocation) {
                    return Rx.Observable.create(s => {
                        s.next();
                        s.complete();
                    });
                },
                sendSms(configFIle, destinationPhone, message) {
                    return Rx.Observable.create(s => {
                        chai_1.assert.equal(configFIle, 'config1.rc');
                        chai_1.assert.equal(destinationPhone, '012345678');
                        chai_1.assert.equal(message, 'heloo!');
                        isModemDriverSendSmsCalled = true;
                        s.next();
                        s.complete();
                    });
                },
                getUSSD(configFile, ussdCommand) {
                    return null;
                }
            };
            let smsMetadataParser = {
                parse(meta) {
                    return Rx.Observable.create(s => {
                        s.next([new SmsInfo_1.SmsInfo()]);
                        s.complete();
                    });
                }
            };
            let smsDevice = new SmsDevice_1.SmsDevice(fileManager, modemDriver, null, smsMetadataParser);
            smsDevice.setConfigFile('config1.rc').subscribe(null, null, () => {
                smsDevice.sendSms('012345678', 'heloo!')
                    .subscribe(smsInfos => {
                    chai_1.assert.isTrue(isModemDriverSendSmsCalled);
                    done();
                }, err => {
                    chai_1.assert.fail(null, null, 'Must not reached here');
                }, () => {
                });
            });
        });
    });
});
