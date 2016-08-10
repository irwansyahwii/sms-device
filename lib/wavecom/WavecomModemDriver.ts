import {RawModem, DefaultSerialPort, ModemOptions} from 'raw-modem';

import {IModemDriver} from '../IModemDriver';
import Rx = require('rxjs/Rx');

export class WavecomModemDriver implements IModemDriver{
    constructor(){

    }

    _getModemOptions(configFile:string){
        let modemOptions = new ModemOptions();
        modemOptions.autoOpen = false;
        modemOptions.baudRate = 115200;
        modemOptions.deviceName = configFile;
        
        return modemOptions;
    }

    identify(configFile:string): Rx.Observable<string>{
        return Rx.Observable.create(s =>{

            let serialPort = new DefaultSerialPort();

            let modemOptions = this._getModemOptions(configFile);
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
                .flatMap((response)=>{
                    result.sim_imsi = response.trim();
                    return modem.close();
                })                
                .subscribe(response =>{
                    
                    let resultString = resultToString(result);

                    s.next(resultString);

                }, err => s.error(err), () => s.complete())
        })
    }

    readAllSms(configFile:string): Rx.Observable<string>{
        return Rx.Observable.create(s =>{

            let serialPort = new DefaultSerialPort();

            let modemOptions = this._getModemOptions(configFile);

            let modem = new RawModem(serialPort);
            
            modem.open(modemOptions)
                .flatMap(() => modem.send('AT+CMGF=1\r'))
                .flatMap((response)=>{
                    return modem.send('AT+CMGL="ALL"\r')
                })
                .flatMap((response) => {
                    s.next(response);

                    return modem.close()
                })
                .subscribe(response =>{
                    
                }, err => s.error(err), () => s.complete())
        })    
    }

    deleteAllSms(configFile:string, startLocation:number, endLocation:number):Rx.Observable<void>{
        return null;
    }

    sendSms(configFile:string, destinationPhone:string, message: string): Rx.Observable<void>{
        return Rx.Observable.create(s =>{

            let serialPort = new DefaultSerialPort();

            let modemOptions = this._getModemOptions(configFile);

            let modem = new RawModem(serialPort);
            
            modem.open(modemOptions)
                .flatMap(() => modem.send('AT+CSCS="GSM"\r'))
                .flatMap(() => modem.send('AT+CSMP=1,173,0,7\r'))
                .flatMap(() => modem.send('AT+CMGF=1\r'))
                .flatMap(response =>{
                    return modem.send(`AT+CMGS="${destinationPhone}"\r`, 
                        (buffer:any, subscriber: Rx.Subscriber<string>)=>{

                            let responseString = buffer.toString().trim();
                            if(responseString === ">"){
                                subscriber.next("");
                                subscriber.complete();
                            }
                        })
                })                             
                .flatMap(response =>{
                    return modem.send(`${message}\x1A\r`)
                })                         
                .flatMap((response) => {
                    s.next();
                    
                    return modem.close()
                })                
                .subscribe(response =>{

                }, 
                err => s.error(err), 
                () => s.complete());
        })    
    }    
}