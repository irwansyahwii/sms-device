import Rx = require('rxjs/Rx');
import {SmsInfo} from './SmsInfo';


/**
 * Defined operations to parse Sms metadata
 */
export interface ISmsMetadataParser{
    /**
     * Parse sms metadata
     * 
     * @return {Rx.Observable<Array<SmsInfo>>} An Observable containing an array of SmsInfo
     */
    parse(smsMetadata:string):Rx.Observable<Array<SmsInfo>>;
}