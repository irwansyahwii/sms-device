import Rx = require('rxjs/Rx');
import {ISmsDevice} from './ISmsDevice';
import {IFileManager} from './IFileManager';
import {FileManager} from './FileManager';
import {SmsDeviceInfo} from './SmsDeviceInfo';
import {IModemDriver} from './IModemDriver';
import {IIdentifyMetadataParser} from './IIdentifyMetadataParser';
import {SmsInfo} from './SmsInfo';
import {ISmsMetadataParser} from './ISmsMetadataParser';

/**
 * Provide a default implementation for ISmsDevice
 */
export class SmsDevice implements ISmsDevice{

    private _configFilePath:string = '';

    constructor(private fileManager:IFileManager, 
        private modemDriver: IModemDriver, 
        private identifyMetadataParser:IIdentifyMetadataParser,
        private smsMetadataParser: ISmsMetadataParser ){

    }

    static create():ISmsDevice{
        return new SmsDevice(new FileManager(), null, null, null);
    }

    setConfigFile(configFilePath:string):Rx.Observable<void>{
        return Rx.Observable.create(s =>{
            this.fileManager.isExists(configFilePath).subscribe(r =>{
                if(r){
                    this._configFilePath = configFilePath;
                }
                
                s.next(r);
                s.complete();   
            }, err =>{
                s.error(err);
            });
        });
    }

    getConfigFile():string{
        return this._configFilePath;
    }

    identify():Rx.Observable<SmsDeviceInfo>{
        return Rx.Observable.create(s =>{
            if(this._configFilePath.length <= 0){
                s.error(new Error('Identify failed. No config file specified.'));
            }
            else{
                this.modemDriver.identify(this._configFilePath)
                    .flatMap(identifyMetadata => {
                        return this.identifyMetadataParser.parse(identifyMetadata);
                    })
                    .subscribe(smsDeviceInfo =>{
                        s.next(smsDeviceInfo);
                    }, err =>{
                        s.error(err);
                    }, () =>{
                        s.complete();
                    });    
            }            
        });
    }

    readAllSms():Rx.Observable<Array<SmsInfo>>{
        return Rx.Observable.create(s => {
            if(this._configFilePath.length <= 0){
                s.error(new Error('readAllSms failed. No config file specified.'));
            }
            else{
                this.modemDriver.readAllSms(this._configFilePath)
                    .flatMap(smsMetadata => {
                        return this.smsMetadataParser.parse(smsMetadata);
                    })
                    .subscribe(smsInfos =>{
                        s.next(smsInfos);
                    }, err =>{
                        s.error(err);
                    }, () =>{
                        s.complete();
                    });
            }
        });
    }
    deleteAllSms(startLocation: number, endLocation: number):Rx.Observable<void>{
        return Rx.Observable.create(s =>{
            if(this._configFilePath.length <= 0){
                s.error(new Error('deleteAllSms failed. No config file specified.'));
            }
            else{
                this.modemDriver.deleteAllSms(this._configFilePath, startLocation, endLocation)
                    .subscribe(r =>{
                        s.next();
                    }, err => {
                        s.error(err)
                    }, 
                    ()=>{
                        s.complete();
                    })
            }
        });
    }
}