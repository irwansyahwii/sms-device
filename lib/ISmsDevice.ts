import Rx = require('rxjs/Rx');

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
}