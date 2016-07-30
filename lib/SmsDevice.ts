import Rx = require('rxjs/Rx');
import {ISmsDevice} from './ISmsDevice';
import {IFileManager} from './IFileManager';
import {FileManager} from './FileManager';
import {SmsDeviceInfo} from './SmsDeviceInfo';

/**
 * Provide a default implementation for ISmsDevice
 */
export class SmsDevice implements ISmsDevice{

    private _configFilePath:string = '';

    constructor(private fileManager:IFileManager){

    }

    static create():ISmsDevice{
        return new SmsDevice(new FileManager());
    }

    setConfigFile(configFilePath:string):Rx.Observable<void>{
        return Rx.Observable.create(s =>{
            this.fileManager.isExists(configFilePath).subscribe(r =>{
                if(r){
                    this._configFilePath = configFilePath;
                }
                
                s.next(r);
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
            }            
        });
    }
}