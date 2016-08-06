"use strict";
const Rx = require('rxjs/Rx');
const FileManager_1 = require('./FileManager');
const GammuSmsMetadataParser_1 = require('./gammu/GammuSmsMetadataParser');
const GammuIdentifyMetadataParser_1 = require('./gammu/GammuIdentifyMetadataParser');
const GammuModemDriver_1 = require('./gammu/GammuModemDriver');
/**
 * Provide a default implementation for ISmsDevice
 */
class SmsDevice {
    constructor(fileManager, modemDriver, identifyMetadataParser, smsMetadataParser) {
        this.fileManager = fileManager;
        this.modemDriver = modemDriver;
        this.identifyMetadataParser = identifyMetadataParser;
        this.smsMetadataParser = smsMetadataParser;
        this._configFilePath = '';
    }
    static create() {
        return new SmsDevice(new FileManager_1.FileManager(), new GammuModemDriver_1.GammuModemDriver(), new GammuIdentifyMetadataParser_1.GammuIdentifyMetadataParser(), new GammuSmsMetadataParser_1.GammuSmsMetadataParser());
    }
    setConfigFile(configFilePath) {
        return Rx.Observable.create(s => {
            this.fileManager.isExists(configFilePath).subscribe(r => {
                if (r) {
                    this._configFilePath = configFilePath;
                }
                else {
                    s.error(new Error('Config file not found: ' + configFilePath));
                }
                s.next(r);
                s.complete();
            }, err => {
                s.error(err);
            });
        });
    }
    getConfigFile() {
        return this._configFilePath;
    }
    identify() {
        return Rx.Observable.create(s => {
            if (this._configFilePath.length <= 0) {
                s.error(new Error('Identify failed. No config file specified.'));
            }
            else {
                this.modemDriver.identify(this._configFilePath)
                    .flatMap(identifyMetadata => {
                    return this.identifyMetadataParser.parse(identifyMetadata);
                })
                    .subscribe(smsDeviceInfo => {
                    s.next(smsDeviceInfo);
                }, err => {
                    s.error(err);
                }, () => {
                    s.complete();
                });
            }
        });
    }
    readAllSms() {
        return Rx.Observable.create(s => {
            if (this._configFilePath.length <= 0) {
                s.error(new Error('readAllSms failed. No config file specified.'));
            }
            else {
                this.modemDriver.readAllSms(this._configFilePath)
                    .flatMap(smsMetadata => {
                    return this.smsMetadataParser.parse(smsMetadata);
                })
                    .subscribe(smsInfos => {
                    s.next(smsInfos);
                }, err => {
                    s.error(err);
                }, () => {
                    s.complete();
                });
            }
        });
    }
    deleteAllSms(startLocation, endLocation) {
        return Rx.Observable.create(s => {
            if (this._configFilePath.length <= 0) {
                s.error(new Error('deleteAllSms failed. No config file specified.'));
            }
            else {
                this.modemDriver.deleteAllSms(this._configFilePath, startLocation, endLocation)
                    .subscribe(r => {
                    s.next();
                }, err => {
                    s.error(err);
                }, () => {
                    s.complete();
                });
            }
        });
    }
    sendSms(destinationPhone, message) {
        return Rx.Observable.create(s => {
            if (this._configFilePath.length <= 0) {
                s.error(new Error('sendSms failed. No config file specified.'));
            }
            else {
                this.modemDriver.sendSms(this._configFilePath, destinationPhone, message)
                    .subscribe(r => {
                    s.next();
                }, err => {
                    s.error(err);
                }, () => {
                    s.complete();
                });
            }
        });
    }
}
exports.SmsDevice = SmsDevice;
