"use strict";
const Rx = require('rxjs/Rx');
const FileManager_1 = require('./FileManager');
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
        return new SmsDevice(new FileManager_1.FileManager(), null, null, null);
    }
    setConfigFile(configFilePath) {
        return Rx.Observable.create(s => {
            this.fileManager.isExists(configFilePath).subscribe(r => {
                if (r) {
                    this._configFilePath = configFilePath;
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
                    .subscribe(identifyMetadata => {
                    this.identifyMetadataParser.parse(identifyMetadata)
                        .subscribe(smsDeviceInfo => {
                        s.next(smsDeviceInfo);
                    }, err => {
                        s.error(err);
                    }, () => {
                        s.complete();
                    });
                }, err => {
                    s.error(err);
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
                    .subscribe(smsMetadata => {
                    this.smsMetadataParser.parse(smsMetadata)
                        .subscribe(smsInfos => {
                        s.next(smsInfos);
                    }, err => {
                        s.error(err);
                    }, () => {
                        s.complete();
                    });
                }, err => {
                    s.error(err);
                });
            }
        });
    }
}
exports.SmsDevice = SmsDevice;
