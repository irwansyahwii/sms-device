"use strict";
const raw_modem_1 = require('raw-modem');
const Rx = require('rxjs/Rx');
class WavecomModemDriver {
    constructor() {
    }
    identify(configFile) {
        return Rx.Observable.create(s => {
            let serialPort = new raw_modem_1.DefaultSerialPort();
            let modemOptions = new raw_modem_1.ModemOptions();
            modemOptions.autoOpen = false;
            modemOptions.baudRate = 115200;
            modemOptions.deviceName = configFile;
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
                result.model = response.trim();
                return modem.send('AT+CGMI\r');
            })
                .flatMap((response) => {
                result.manufacturer = response.trim();
                return modem.send('AT+CGMR\r');
            })
                .flatMap((response) => {
                result.firmware = response.trim();
                return modem.send('AT+CGSN\r');
            })
                .flatMap((response) => {
                result.imei = response.trim();
                return modem.send('AT+CIMI\r');
            })
                .subscribe(response => {
                result.sim_imsi = response.trim();
                let resultString = resultToString(result);
                s.next(resultString);
            }, err => s.error(err), () => s.complete());
        });
    }
    readAllSms(configFile) {
        return null;
    }
    deleteAllSms(configFile, startLocation, endLocation) {
        return null;
    }
    sendSms(configFile, destinationPhone, message) {
        return null;
    }
}
exports.WavecomModemDriver = WavecomModemDriver;
