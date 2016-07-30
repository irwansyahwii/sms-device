/**
 * Holds information of a device and the SIM card attached to it
 */
export class SmsDeviceInfo{
    constructor(){

    }

    /**
     * The device path
     * 
     * @return {string} - The device path
     */
    public device: string = '';

    /**
     * The device manufacturer
     * 
     * @return {string} - The device manufacturer.
     */
    public manufacturer: string = '';

    /**
     * The device model
     * 
     * @return {string} - The device model
     */
    public model: string = '';

    /**
     * The device firmware
     * 
     * @return {string} - The device firmware
     */
    public firmware:string = '';

    /**
     * The device IMEI. Seems to always return the same string 012345678901234 for multiport modem.
     * 
     * @return {string} - The device IMEI
     */
    public imei:string = '';

    /**
     * The SIM IMSI
     * 
     * @return {string} - The SIM card IMSI
     */
    public simIMSI:string = '';

}