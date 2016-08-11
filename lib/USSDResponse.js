"use strict";
/**
 * USSD response type
 */
(function (USSDResponseType) {
    USSDResponseType[USSDResponseType["NoFurtherActionRequired"] = 0] = "NoFurtherActionRequired";
    USSDResponseType[USSDResponseType["WaitingReply"] = 1] = "WaitingReply";
    USSDResponseType[USSDResponseType["Terminated"] = 2] = "Terminated";
    USSDResponseType[USSDResponseType["NotSupported"] = 4] = "NotSupported";
})(exports.USSDResponseType || (exports.USSDResponseType = {}));
var USSDResponseType = exports.USSDResponseType;
/**
 * Represents a response of a USSD command
 */
class USSDResponse {
    constructor() {
        /**
         * The response type
         */
        this.responseType = null;
        /**
         * The response text
         */
        this.text = '';
    }
}
exports.USSDResponse = USSDResponse;
