import {RawModem, DefaultSerialPort, ModemOptions} from 'raw-modem';

import {IModemDriver} from '../IModemDriver';
import Rx = require('rxjs/Rx');

export class WavecomModemDriver implements IModemDriver{
    constructor(){

    }

    identify(configFile:string): Rx.Observable<string>{
        return Rx.Observable.create(s =>{

            let serialPort = new DefaultSerialPort();

            let modemOptions = new ModemOptions();
            modemOptions.autoOpen = false;
            modemOptions.baudRate = 115200;
            modemOptions.deviceName = configFile;
            let modem = new RawModem(serialPort);

            let result = {
                deviceName: configFile,
                model: '',
                manufacturer: '',
                firmware: '',
                imei:'',
                sim_imsi:''
            }

            let resultToString = resultObject =>{
                let resultString = `
Device               : ${result.deviceName}
Manufacturer         : ${result.manufacturer}
Model                : ${result.model}
Firmware             : ${result.firmware}
IMEI                 : ${result.imei}
SIM IMSI             : ${result.sim_imsi}                                            
                `;

                return resultString;
            }
            
            modem.open(modemOptions)
                .flatMap(() => modem.send('AT+CGMM\r'))
                .flatMap((response)=>{
                    result.model = response.trim();
                    return modem.send('AT+CGMI\r')
                })
                .flatMap((response)=>{
                    result.manufacturer = response.trim();
                    return modem.send('AT+CGMR\r')
                })                
                .flatMap((response)=>{
                    result.firmware = response.trim();
                    return modem.send('AT+CGSN\r')
                })                
                .flatMap((response)=>{
                    result.imei = response.trim();
                    return modem.send('AT+CIMI\r')
                })                
                .subscribe(response =>{
                    result.sim_imsi = response.trim();
                    let resultString = resultToString(result);

                    s.next(resultString);

                }, err => s.error(err), () => s.complete())
        })
    }

    readAllSms(configFile:string): Rx.Observable<string>{
        return null;
    }

    deleteAllSms(configFile:string, startLocation:number, endLocation:number):Rx.Observable<void>{
        return null;
    }

    sendSms(configFile:string, destinationPhone:string, message: string): Rx.Observable<void>{
        return null;
    }    
}