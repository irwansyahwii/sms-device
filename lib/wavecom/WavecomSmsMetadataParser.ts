import Rx = require('rxjs/Rx');
import {ISmsMetadataParser} from '../ISmsMetadataParser';
import {SmsInfo} from '../SmsInfo';
import moment = require('moment');


/**
 * A parser to parse sms metadata parser returned by gammu
 */
export class WavecomSmsMetadataParser implements ISmsMetadataParser {
    constructor(){

    }

    /**
     * Parse the metadata
     * 
     * @return {Rx.Observable<Array<SmsInfo>>} An Observable containing an array of SmsInfo
     */
    parse(smsMetadata:string):Rx.Observable<Array<SmsInfo>>{
        return Rx.Observable.create(s =>{
            let results: Array<SmsInfo> = [];
            let trimmedText = smsMetadata.trim();

            let textArray:Array<string> = trimmedText.split('\n');

            let currentResult:SmsInfo = null;
            let mode = 'free';

            
            let smsContents = '';
            Rx.Observable.from(textArray, Rx.Scheduler.async)
                .subscribe(line =>{
                    
                    let lineTrimmed = line.trim();

                    if(lineTrimmed.startsWith('AT+CMGL')){

                    }     
                    else if(lineTrimmed.startsWith('+CMGL')){
                        let parts = lineTrimmed.split(',');
                        currentResult = new SmsInfo();
                        results.push(currentResult);

                        if(parts.length !== 6){
                            s.error(new Error('Invalid sms metadata line: ' + lineTrimmed));
                        }
                        else{

                            currentResult.folder = "";
                            currentResult.location = parseInt(parts[0].trim().replace('+CMGL: ', ''));
                            currentResult.remoteNumber = parts[2].trim().replace('"', '').replace('"', '');

                            let sentTimeString = parts[4].trim().replace('"', '') + ',' + parts[5].trim().replace('"', '');
                            currentResult.sent = moment(sentTimeString, 'YY/MM/DD,hh:mm:ssZ').unix();
                        }       
                    }
                    else{
                        currentResult.text += line;
                    }
             
                }, err =>{
                    s.error(err);
                }, () =>{
                    s.next(results);
                    s.complete();
                })
        })
    }
}