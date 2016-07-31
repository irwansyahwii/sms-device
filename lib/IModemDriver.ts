import Rx = require('rxjs/Rx');

/**
 * Defined the operations to communicate with the GSM modem
 */
export interface IModemDriver{
    /**
     * Send identify command to the modem
     * 
     * @return {string} The identify metadata from the modem
     */
    identify(configFile:string): Rx.Observable<string>;

    /**
     * Send read all sms command to the modem
     * 
     * @param {string} configFile - The confg file path for the modem
     * 
     * @return {Rx.Observable<string>} An Observable containing the sms metada from the modem
     */
    readAllSms(configFIle:string): Rx.Observable<string>;
}