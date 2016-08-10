"use strict";
const Rx = require('rxjs/Rx');
const SmsInfo_1 = require('../SmsInfo');
const moment = require('moment');
/**
 * A parser to parse sms metadata parser returned by gammu
 */
class WavecomSmsMetadataParser {
    constructor() {
    }
    /**
     * Retrieve the Status value
     *
     * @param {string} line - The line containing the Status value
     *
     * @return {string} - The Status value
     */
    _parseStatus(line) {
        let status = '';
        let lineArray = line.split(' : ');
        if (lineArray.length === 2) {
            status = lineArray[1].trim();
        }
        return status;
    }
    /**
     * Retrieve the Remote Number value
     *
     * @param {string} line - The line containing the Remote Number
     *
     * @return {string} - The Remote Number. Return empty when not found
     */
    _parseRemoteNumber(line) {
        let remoteNumber = '';
        let lineArray = line.split(' : ');
        if (lineArray.length === 2) {
            remoteNumber = lineArray[1].replace('"', '').replace('"', '');
        }
        return remoteNumber;
    }
    /**
     * Retrieve the Coding value
     *
     * @param {string} line - The line containing the Coding value
     *
     * @return {string} The Coding value. Return empty when not found.
     */
    _parseCoding(line) {
        let coding = '';
        let lineArray = line.split(':');
        if (lineArray.length === 2) {
            coding = lineArray[1].trim();
        }
        return coding;
    }
    /**
     * Retrieve the Sent value from a line
     *
     * @param {string} line - The line containings the Sent value
     *
     * @return {number} - The UNIX time of the Sent value. Return 0 when not found.
     */
    _parseSent(line) {
        let sent = 0;
        let lineArray = line.split(' : ');
        if (lineArray.length === 2) {
            sent = moment(lineArray[1].trim(), 'ddd DD MMM YYYY hh:mm:ss ZZ').unix();
        }
        return sent;
    }
    /**
     * Retrieve the SMSC number
     *
     * @param {string} line - The line containings the SMSC number
     *
     * @return {string} - The SMSC number. Empty when not found.
     */
    _parseSmscNumber(line) {
        let smscNumber = '';
        let lineArray = line.split(':');
        if (lineArray.length === 2) {
            smscNumber = lineArray[1].trim();
            smscNumber = smscNumber.replace('"', "");
            smscNumber = smscNumber.replace('"', "");
        }
        return smscNumber;
    }
    /**
     * Retrieve the location number and folder name from a location line:
     *
     * Location 1, folder "Inbox", SIM memory, Inbox folder
     *
     * @param {string} line - The Location line
     *
     * @return {[number, string]} - The first item will be the location number and the second item will be the folder name
     *
     * Location number will be -1 when not found
     *
     * Folder name will be empty when not found
     */
    _parseLocationAndFolder(line) {
        let lineArray = line.split(',');
        let locationNo = -1;
        let folder = '';
        let locationLine = lineArray[0].trim();
        if (locationLine.startsWith('Location')) {
            locationNo = parseInt(locationLine.replace('Location ', ''));
        }
        let folderLine = lineArray[1].trim();
        if (folderLine.startsWith('folder "')) {
            folder = folderLine.replace('folder "', "");
            folder = folder.substr(0, folder.length - 1);
        }
        return [locationNo, folder];
    }
    /**
     * Parse the metadata
     *
     * @return {Rx.Observable<Array<SmsInfo>>} An Observable containing an array of SmsInfo
     */
    parse(smsMetadata) {
        return Rx.Observable.create(s => {
            let results = [];
            let trimmedText = smsMetadata.trim();
            let textArray = trimmedText.split('\n');
            let currentResult = null;
            let mode = 'free';
            let smsContents = '';
            Rx.Observable.from(textArray)
                .subscribe(line => {
                line = line.trim();
                if (line.startsWith('AT+CMGL')) {
                }
                else if (line.startsWith('+CMGL')) {
                    let parts = line.split(',');
                    currentResult = new SmsInfo_1.SmsInfo();
                    results.push(currentResult);
                    if (parts.length !== 6) {
                        s.error(new Error('Invalid sms metadata line: ' + line));
                    }
                    else {
                        currentResult.folder = "";
                        currentResult.location = parseInt(parts[0].trim().replace('+CMGL: ', ''));
                        currentResult.remoteNumber = parts[2].trim().replace('"', '').replace('"', '');
                        let sentTimeString = parts[4].trim().replace('"', '') + ',' + parts[5].trim().replace('"', '');
                        currentResult.sent = moment(sentTimeString, 'YY/MM/DD,hh:mm:ssZ').unix();
                    }
                }
                else {
                    currentResult.text += line;
                }
            }, err => {
                s.error(err);
            }, () => {
                s.next(results);
                s.complete();
            });
        });
    }
}
exports.WavecomSmsMetadataParser = WavecomSmsMetadataParser;
