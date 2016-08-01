import {IModemDriver} from '../IModemDriver';
import Rx = require('rxjs/Rx');

declare let require:any;
const spawn = require('child_process').spawn;

export class GammuModemDriver implements IModemDriver{
    constructor(){

    }

    identify(configFile:string): Rx.Observable<string>{
        return Rx.Observable.create(s =>{
                        
            const gammu = spawn(`gammu`, [`-c`, configFile, `--identify`]);

            gammu.stderr.on('data', data =>{
                s.error(new Error(String(data)));
            });

            gammu.stdout.on('data', data =>{
                s.next(String(data));
            })
            
            gammu.on('close', code =>{
                s.complete();
            });
        });
    }
    readAllSms(configFile:string): Rx.Observable<string>{
        return Rx.Observable.create(s =>{
            let completeText = '';
            const gammu = spawn(`gammu`, [`-c`, configFile, `getallsms`]);

            gammu.stderr.on('data', data =>{

                s.error(new Error(String(data)));
            });

            gammu.stdout.on('data', data =>{
                completeText = completeText + String(data);
            })
            
            gammu.on('close', code =>{
                s.next(completeText);
                s.complete();
            });
        });
    }
    deleteAllSms(configFile:string, startLocation:number, endLocation:number):Rx.Observable<void>{
        return Rx.Observable.create(s =>{
            const gammu = spawn(`gammu`, [`-c`, configFile, `deletesms`, startLocation, endLocation]);

            gammu.stderr.on('data', data =>{
                s.error(String(data));
            });

            gammu.stdout.on('data', data =>{
                let message = String(data);
                if(message.length > 0){
                    s.error(new Error(message));
                }
                else{
                    s.next(true);   
                }
            })
            
            gammu.on('close', code =>{
                s.complete();
            });
        });
    }    

    sendSms(configFile:string, destinationPhone:string, message: string): Rx.Observable<void>{
        return Rx.Observable.create(s =>{
            const gammu = spawn(`gammu`, [`-c`, configFile, `sendsms`, 'TEXT', destinationPhone, '-text', message]);

            gammu.stderr.on('data', data =>{
                let message:string = data.toString().trim();

                if(message.startsWith("If you want break")
                    || message.startsWith("Sending SMS")){
                        s.next(true);
                    }
                else{
                    s.error(new Error(message));
                }
            });

            gammu.stdout.on('data', data =>{
                let message = String(data);
                if(message.startsWith("Sending SMS")
                    || message.startsWith("....waiting for network answer")){
                    // s.next(true);
                }
                else if(message.startsWith("..OK")){
                    s.next(true);
                }
                else{
                    s.error(new Error(message));
                }
                   
            })
            
            gammu.on('close', code =>{
                s.complete();
            });
        });        
    }
}