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
}