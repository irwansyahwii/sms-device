"use strict";
/**
 * Holds information of a device and the SIM card attached to it
 */
class SmsDeviceInfo {
    constructor() {
        /**
         * The device path
         *
         * @return {string} - The device path
         */
        this.device = '';
        /**
         * The device manufacturer
         *
         * @return {string} - The device manufacturer.
         */
        this.manufacturer = '';
        /**
         * The device model
         *
         * @return {string} - The device model
         */
        this.model = '';
        /**
         * The device firmware
         *
         * @return {string} - The device firmware
         */
        this.firmware = '';
        /**
         * The device IMEI. Seems to always return the same string 012345678901234 for multiport modem.
         *
         * @return {string} - The device IMEI
         */
        this.imei = '';
        /**
         * The SIM IMSI
         *
         * @return {string} - The SIM card IMSI
         */
        this.simIMSI = '';
    }
}
exports.SmsDeviceInfo = SmsDeviceInfo;
