"use strict";
const Rx = require('rxjs/Rx');
const FileManager_1 = require('./FileManager');
/**
 * Provide a default implementation for ISmsDevice
 */
class SmsDevice {
    constructor(fileManager) {
        this.fileManager = fileManager;
        this._configFilePath = '';
    }
    static create() {
        return new SmsDevice(new FileManager_1.FileManager());
    }
    setConfigFile(configFilePath) {
        return Rx.Observable.create(s => {
            this.fileManager.isExists(configFilePath).subscribe(r => {
                if (r) {
                    this._configFilePath = configFilePath;
                }
                s.next(r);
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
            }
        });
    }
}
exports.SmsDevice = SmsDevice;
