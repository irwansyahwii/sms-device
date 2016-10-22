"use strict";
const Rx = require('rxjs/Rx');
const WavecomSmsMetadataParser_1 = require('./wavecom/WavecomSmsMetadataParser');
const GammuIdentifyMetadataParser_1 = require('./gammu/GammuIdentifyMetadataParser');
const WavecomModemDriver_1 = require('./wavecom/WavecomModemDriver');
const WavecomUSSDResponseParser_1 = require('./wavecom/WavecomUSSDResponseParser');
/**
 * Provide a default implementation for ISmsDevice
 */
class SmsDevice {
    constructor(fileManager, modemDriver, identifyMetadataParser, smsMetadataParser, ussdResponseParser) {
        this.fileManager = fileManager;
        this.modemDriver = modemDriver;
        this.identifyMetadataParser = identifyMetadataParser;
        this.smsMetadataParser = smsMetadataParser;
        this.ussdResponseParser = ussdResponseParser;
        this._configFilePath = '';
    }
    static create() {
        return new SmsDevice({
            isExists: function (path) {
                return Rx.Observable.create(s => {
                    s.next(true);
                    s.complete();
                });
            }
        }, new WavecomModemDriver_1.WavecomModemDriver(), new GammuIdentifyMetadataParser_1.GammuIdentifyMetadataParser(), new WavecomSmsMetadataParser_1.WavecomSmsMetadataParser(), new WavecomUSSDResponseParser_1.WavecomUSSDResponseParser());
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
    getUSSD(ussdCode) {
        return Rx.Observable.create(s => {
            if (this._configFilePath.length <= 0) {
                s.error(new Error('getUSSD failed. No config file specified.'));
            }
            else {
                this.modemDriver.getUSSD(this._configFilePath, ussdCode)
                    .flatMap(responseString => {
                    return this.ussdResponseParser.parse(responseString);
                })
                    .subscribe(r => {
                    s.next(r);
                }, err => {
                    s.error(err);
                }, () => {
                    s.complete();
                });
            }
        });
    }
    getUSSDWithCallback(configFile, ussdCode, callback) {
        return Rx.Observable.create(s => {
            if (this._configFilePath.length <= 0) {
                s.error(new Error('getUSSD failed. No config file specified.'));
            }
            else {
                this.modemDriver.getUSSDWithCallback(this._configFilePath, ussdCode, callback)
                    .subscribe(r => {
                    s.next(r);
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
