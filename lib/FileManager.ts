import {IFileManager} from './IFileManager';
import Rx = require('rxjs/Rx');

declare let require:any;


const fs = require('fs');

export class FileManager implements IFileManager {
    constructor(){

    }

    isExists(filePath:string): Rx.Observable<boolean>{
        return Rx.Observable.create(s =>{
            fs.stat(filePath, (err, stats)=>{
                if(err){
                    s.next(false);
                }
                else{
                    s.next(true);
                }
            });
        });
    }
}