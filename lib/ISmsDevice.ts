import Rx = require('rxjs/Rx');
import {SmsDeviceInfo} from './SmsDeviceInfo';
import {SmsInfo} from './SmsInfo';

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
}