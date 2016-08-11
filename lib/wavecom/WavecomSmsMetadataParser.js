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
            Rx.Observable.from(textArray, Rx.Scheduler.async)
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
