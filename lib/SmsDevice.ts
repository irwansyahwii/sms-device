import Rx = require('rxjs/Rx');
import {ISmsDevice} from './ISmsDevice';
import {IFileManager} from './IFileManager';
import {FileManager} from './FileManager';

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
}