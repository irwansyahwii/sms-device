import {USSDResponse} from './USSDResponse';
import Rx = require('rxjs/Rx');

/**
 * Defined the operations needed to parse a USSD response
 */
export interface IUSSDResponseParser{
    /**
     * Parse the USSD response
     * 
     * @return {USSDResponse} - A USSDResponse
     */
    parse(ussdResponseString:string) : Rx.Observable<USSDResponse>;
}