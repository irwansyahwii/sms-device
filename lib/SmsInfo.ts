/**
 * Represents an SMS from a SIM card
 */
export class SmsInfo{
	/**
	 * The location number
	 */
	public location : number = -1;
	/** 
	 * The SMS folder
	 **/
	public folder: string = '';
	/**
	 * SMS Center number
	 **/
	public smscNumber: string = '';
	/**
	 * The sent date (probably the received date) in UNIX time
	 **/
	public sent: number = 0;
	/**
	 * The encoding of the SMS
	 **/
	public coding: string = '';
	/**
	 * The sender number
	 **/
	public remoteNumber: string = '';
	/**
	 * Read status
	 **/
	public status: string = '';
	/**
	 * The SMS message
	 **/
	public text: string = '';
}