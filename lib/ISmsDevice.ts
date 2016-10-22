import Rx = require('rxjs/Rx');
import {SmsDeviceInfo} from './SmsDeviceInfo';
import {SmsInfo} from './SmsInfo';
import {USSDResponse} from './USSDResponse';
import {RawModem} from 'raw-modem';

/**
 * Defined a set of operations for an Sms device.
 */
export interface ISmsDevice{
    /**
     * Set the config file to use for communicating with the modem.
     */
    setConfigFile(configFilePath:string):Rx.Observable<void>;

    /**
     * Retrieve the current config file path
     * 
     * @return {string} - The config file path or an empty string.
     */
    getConfigFile():string;

    /**
     * Identify the SIM card specified by the config file
     * 
     * @return {Rx.Observable<SmsDeviceInfo>} - An Observable containing an SmsDeviceInfo
     */
    identify():Rx.Observable<SmsDeviceInfo>;    

    /**
     * Read all sms in a SIM card
     * 
     * @return {Rx.Observable<Array<SmsInfo>>} - An Observable containing an array of SmsInfo
     */
    readAllSms():Rx.Observable<Array<SmsInfo>>;

    /**
     * Delete all sms in a SIM card starting from a location to an end location
     * 
     * @return {Rx.Observable<void>} - An Observable
     */
    deleteAllSms(startLocation: number, endLocation: number):Rx.Observable<void>;

    /**
     * Send an sms to a phone number
     * 
     * @return {Rx.Observable<void>} An Observable
     */
    sendSms(destinationPhone:string, message:string):Rx.Observable<void>;

    /**
     * Send USSD command to the modem
     * 
     * @return {Rx.Observable<USSDResponse>} - An Observable containing the USSD response
     */
    getUSSD(ussdCode:string): Rx.Observable<USSDResponse>;

    /**
     * Send USSD command to the modem and wait until the callback finish then close the modem
     * 
     * @param {string} ussdCommand
     * @param {(modem:RawModem, responseString:string) => Rx.Observable<string>} callback
     * @returns {Rx.Observable<string>}
     * 
     * @memberOf ISmsDevice
     */
    getUSSDWithCallback(ussdCommand:string, callback:(modem:RawModem, responseString:string) => Rx.Observable<string>):Rx.Observable<string>;
}