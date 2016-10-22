"use strict";
const Rx = require('rxjs/Rx');
const spawn = require('child_process').spawn;
class GammuModemDriver {
    constructor() {
    }
    identify(configFile) {
        return Rx.Observable.create(s => {
            const gammu = spawn(`gammu`, [`-c`, configFile, `--identify`]);
            gammu.stderr.on('data', data => {
                s.error(new Error(String(data)));
            });
            gammu.stdout.on('data', data => {
                s.next(String(data));
            });
            gammu.on('close', code => {
                s.complete();
            });
        });
    }
    readAllSms(configFile) {
        return Rx.Observable.create(s => {
            let completeText = '';
            const gammu = spawn(`gammu`, [`-c`, configFile, `getallsms`]);
            gammu.stderr.on('data', data => {
                s.error(new Error(String(data)));
            });
            gammu.stdout.on('data', data => {
                completeText = completeText + String(data);
            });
            gammu.on('close', code => {
                s.next(completeText);
                s.complete();
            });
        });
    }
    deleteAllSms(configFile, startLocation, endLocation) {
        return Rx.Observable.create(s => {
            const gammu = spawn(`gammu`, [`-c`, configFile, `deletesms`, startLocation, endLocation]);
            gammu.stderr.on('data', data => {
                s.error(String(data));
            });
            gammu.stdout.on('data', data => {
                let message = String(data);
                if (message.length > 0) {
                    s.error(new Error(message));
                }
                else {
                    s.next(true);
                }
            });
            gammu.on('close', code => {
                s.complete();
            });
        });
    }
    sendSms(configFile, destinationPhone, message) {
        return Rx.Observable.create(s => {
            const gammu = spawn(`gammu`, [`-c`, configFile, `sendsms`, 'TEXT', destinationPhone, '-text', message]);
            gammu.stderr.on('data', data => {
                let message = data.toString().trim();
                if (message.startsWith("If you want break")
                    || message.startsWith("Sending SMS")) {
                }
                else {
                    s.error(new Error(message));
                }
            });
            gammu.stdout.on('data', data => {
                let message = String(data);
                if (message.startsWith("Sending SMS")
                    || message.startsWith("....waiting for network answer")
                    || message.startsWith("..error")) {
                }
                else if (message.startsWith("..OK")) {
                    s.next(true);
                }
                else {
                    s.error(new Error(message));
                }
            });
            gammu.on('close', code => {
                s.complete();
            });
        });
    }
    getUSSD(configFile, ussdCommand) {
        return Rx.Observable.create(s => {
            const gammu = spawn(`gammu`, [`-c`, configFile, `getussd`]);
            gammu.stderr.on('data', data => {
                s.error(new Error(String(data)));
            });
            gammu.stdout.on('data', data => {
                s.next(String(data));
            });
            gammu.on('close', code => {
                s.complete();
            });
        });
    }
    getUSSDWithCallback(configFile, ussdCommand, callback) {
        return this.getUSSD(configFile, ussdCommand)
            .flatMap((response) => callback(null, response));
    }
}
exports.GammuModemDriver = GammuModemDriver;
