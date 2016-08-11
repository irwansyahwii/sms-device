/**
 * USSD response type
 */
export enum USSDResponseType{
    NoFurtherActionRequired = 0,
    WaitingReply = 1,
    Terminated = 2,
    NotSupported = 4
}

/**
 * Represents a response of a USSD command
 */
export class USSDResponse{
    /**
     * The response type
     */
    responseType: USSDResponseType = null;

    /**
     * The response text
     */
    text:string = '';
}