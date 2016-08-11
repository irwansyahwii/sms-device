import Rx = require('rxjs/Rx');

/**
 * Defined the operations to communicate with the GSM modem
 */
export interface IModemDriver{
    /**
     * Sends an identify command to the modem
     * 
     * @return {string} The identify metadata from the modem
     */
    identify(configFile:string): Rx.Observable<string>;

    /**
     * Sends a read all sms command to the modem
     * 
     * @param {string} configFile - The config file path for the modem
     * 
     * @return {Rx.Observable<string>} An Observable containing the sms metada from the modem
     */
    readAllSms(configFile:string): Rx.Observable<string>;

    /**
     * Sends a delete all sms command to the modem
     * 
     * @param {string} configFile - The config file path for the the modem
     * @param {number} startLocation - The start location of the sms
     * @param {number} endLocation - The end location of the sms
     * 
     * @return {Rx.Observable} An Observable
     */
    deleteAllSms(configFile:string, startLocation:number, endLocation:number):Rx.Observable<void>;

    /**
     * Sends a send sms command to the modem
     * 
     * @param {string} configFile - The config file path for the the modem
     * @param {string} destinationPhone - The destination phone number
     * @param {string} message - The sms message
     */
    sendSms(configFile:string, destinationPhone:string, message: string): Rx.Observable<void>;

    /**
     * Send a USSD command to the modem
     * 
     * @param {string} ussdCommand - The USSD code
     * 
     * @return {Rx.Observable<string>} An Observable containing the response string
     */
    getUSSD(configFile:string, ussdCommand:string):Rx.Observable<string>;
}