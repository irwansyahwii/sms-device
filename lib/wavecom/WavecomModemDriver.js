"use strict";
const raw_modem_1 = require('raw-modem');
const Rx = require('rxjs/Rx');
class WavecomModemDriver {
    constructor() {
    }
    _getModemOptions(configFile) {
        let modemOptions = new raw_modem_1.ModemOptions();
        modemOptions.autoOpen = false;
        modemOptions.baudRate = 115200;
        modemOptions.deviceName = configFile;
        return modemOptions;
    }
    identify(configFile) {
        return Rx.Observable.create(s => {
            let serialPort = new raw_modem_1.DefaultSerialPort();
            let modemOptions = this._getModemOptions(configFile);
            let modem = new raw_modem_1.RawModem(serialPort);
            let result = {
                deviceName: configFile,
                model: '',
                manufacturer: '',
                firmware: '',
                imei: '',
                sim_imsi: ''
            };
            let resultToString = resultObject => {
                let resultString = `
Device               : ${result.deviceName}
Manufacturer         : ${result.manufacturer}
Model                : ${result.model}
Firmware             : ${result.firmware}
IMEI                 : ${result.imei}
SIM IMSI             : ${result.sim_imsi}                                            
                `;
                return resultString;
            };
            modem.open(modemOptions)
                .flatMap(() => modem.send('AT+CGMM\r'))
                .flatMap((response) => {
                let responseTrimmed = response.trim().replace('AT+CGMM', '');
                result.model = responseTrimmed.trim();
                return modem.send('AT+CGMI\r');
            })
                .flatMap((response) => {
                let responseTrimmed = response.trim().replace('AT+CGMI', '');
                result.manufacturer = responseTrimmed.trim();
                return modem.send('AT+CGMR\r');
            })
                .flatMap((response) => {
                let responseTrimmed = response.trim().replace('AT+CGMR', '');
                result.firmware = responseTrimmed.trim();
                return modem.send('AT+CGSN\r');
            })
                .flatMap((response) => {
                let responseTrimmed = response.trim().replace('AT+CGSN', '');
                result.imei = responseTrimmed.trim();
                return modem.send('AT+CIMI\r');
            })
                .flatMap((response) => {
                let responseTrimmed = response.trim().replace('AT+CIMI', '');
                result.sim_imsi = responseTrimmed.trim();
                return modem.close();
            })
                .subscribe(response => {
                let resultString = resultToString(result);
                s.next(resultString);
            }, err => s.error(err), () => s.complete());
        });
    }
    readAllSms(configFile) {
        return Rx.Observable.create(s => {
            let serialPort = new raw_modem_1.DefaultSerialPort();
            let modemOptions = this._getModemOptions(configFile);
            let modem = new raw_modem_1.RawModem(serialPort);
            modem.open(modemOptions)
                .flatMap(() => modem.send('AT+CMGF=1\r'))
                .flatMap((response) => {
                return modem.send('AT+CMGL="ALL"\r');
            })
                .flatMap((response) => {
                s.next(response);
                return modem.close();
            })
                .subscribe(response => {
            }, err => s.error(err), () => s.complete());
        });
    }
    deleteAllSms(configFile, startLocation, endLocation) {
        return Rx.Observable.create(s => {
            let serialPort = new raw_modem_1.DefaultSerialPort();
            let modemOptions = this._getModemOptions(configFile);
            let modem = new raw_modem_1.RawModem(serialPort);
            modem.open(modemOptions)
                .flatMap(() => {
                return Rx.Observable.range(startLocation, (endLocation - startLocation) + 1);
            })
                .flatMap((messageIndex) => {
                let command = `AT+CMGD=${messageIndex},0\r`;
                return modem.send(command);
            })
                .skipWhile((value, index) => {
                return index !== (endLocation - startLocation);
            })
                .flatMap(() => {
                console.log('all finished closing modem');
                s.next();
                return modem.close();
            })
                .subscribe(response => {
            }, err => s.error(err), () => s.complete());
        });
    }
    sendSms(configFile, destinationPhone, message) {
        return Rx.Observable.create(s => {
            let serialPort = new raw_modem_1.DefaultSerialPort();
            let modemOptions = this._getModemOptions(configFile);
            let modem = new raw_modem_1.RawModem(serialPort);
            modem.open(modemOptions)
                .flatMap(() => modem.send('AT+CSCS="GSM"\r'))
                .flatMap(() => modem.send('AT+CSMP=1,173,0,7\r'))
                .flatMap(() => modem.send('AT+CMGF=1\r'))
                .flatMap(response => {
                return modem.send(`AT+CMGS="${destinationPhone}"\r`, (buffer, subscriber) => {
                    let responseString = buffer.toString().trim();
                    if (responseString === ">") {
                        subscriber.next("");
                        subscriber.complete();
                    }
                });
            })
                .flatMap(response => {
                return modem.send(`${message}\x1A\r`);
            })
                .flatMap((response) => {
                s.next();
                return modem.close();
            })
                .subscribe(response => {
            }, err => s.error(err), () => s.complete());
        });
    }
    getUSSD(configFile, ussdCommand) {
        return Rx.Observable.create(s => {
            let serialPort = new raw_modem_1.DefaultSerialPort();
            let modemOptions = this._getModemOptions(configFile);
            modemOptions.commandTimeout = 8000;
            let modem = new raw_modem_1.RawModem(serialPort);
            modem.open(modemOptions)
                .flatMap(() => {
                let completeString = '';
                return modem.send(`AT+CUSD=1,"${ussdCommand}",15\r`, (buffer, subscriber) => {
                    completeString += buffer.toString();
                    let trimmedCompleteString = completeString.trim();
                    if (trimmedCompleteString.endsWith('",0')
                        || (trimmedCompleteString.startsWith('+CUSD') && trimmedCompleteString.endsWith('",15'))) {
                        subscriber.next(trimmedCompleteString);
                        subscriber.complete();
                    }
                });
            })
                .subscribe(r => {
                s.next(r);
            }, err => s.error(err), () => {
                s.complete();
            });
        });
    }
}
exports.WavecomModemDriver = WavecomModemDriver;
