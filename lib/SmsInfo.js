"use strict";
/**
 * Represents an SMS from a SIM card
 */
class SmsInfo {
    constructor() {
        /**
         * The location number
         */
        this.location = -1;
        /**
         * The SMS folder
         **/
        this.folder = '';
        /**
         * SMS Center number
         **/
        this.smscNumber = '';
        /**
         * The sent date (probably the received date) in UNIX time
         **/
        this.sent = 0;
        /**
         * The encoding of the SMS
         **/
        this.coding = '';
        /**
         * The sender number
         **/
        this.remoteNumber = '';
        /**
         * Read status
         **/
        this.status = '';
        /**
         * The SMS message
         **/
        this.text = '';
    }
}
exports.SmsInfo = SmsInfo;
