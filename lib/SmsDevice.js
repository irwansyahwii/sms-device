"use strict";
const Rx = require('rxjs/Rx');
const FileManager_1 = require('./FileManager');
/**
 * Provide a default implementation for ISmsDevice
 */
class SmsDevice {
    constructor(fileManager, modemDriver, identifyMetadataParser) {
        this.fileManager = fileManager;
        this.modemDriver = modemDriver;
        this.identifyMetadataParser = identifyMetadataParser;
        this._configFilePath = '';
    }
    static create() {
        return new SmsDevice(new FileManager_1.FileManager(), null, null);
    }
    setConfigFile(configFilePath) {
        return Rx.Observable.create(s => {
            this.fileManager.isExists(configFilePath).subscribe(r => {
                if (r) {
                    this._configFilePath = configFilePath;
                }
                s.next(r);
                // s.next(['haloo']);
                s.complete();
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
}
exports.SmsDevice = SmsDevice;
