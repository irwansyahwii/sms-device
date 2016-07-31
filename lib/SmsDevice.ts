import Rx = require('rxjs/Rx');
import {ISmsDevice} from './ISmsDevice';
import {IFileManager} from './IFileManager';
import {FileManager} from './FileManager';
import {SmsDeviceInfo} from './SmsDeviceInfo';
import {IModemDriver} from './IModemDriver';
import {IIdentifyMetadataParser} from './IIdentifyMetadataParser';

/**
 * Provide a default implementation for ISmsDevice
 */
export class SmsDevice implements ISmsDevice{

    private _configFilePath:string = '';

    constructor(private fileManager:IFileManager, private modemDriver: IModemDriver, 
        private identifyMetadataParser:IIdentifyMetadataParser){

    }

    static create():ISmsDevice{
        return new SmsDevice(new FileManager(), null, null);
    }

    setConfigFile(configFilePath:string):Rx.Observable<void>{
        return Rx.Observable.create(s =>{
            this.fileManager.isExists(configFilePath).subscribe(r =>{
                if(r){
                    this._configFilePath = configFilePath;
                }
                
                s.next(r);
                // s.next(['haloo']);
                s.complete();
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
                    .subscribe(identifyMetadata =>{
                        this.identifyMetadataParser.parse(identifyMetadata)
                            .subscribe(smsDeviceInfo =>{
                                s.next(smsDeviceInfo);
                            }, err =>{
                                s.error(err);
                            }, () =>{
                                s.complete();
                            });
                    }, err =>{
                        s.error(err);
                    });    
            }            
        });
    }
}