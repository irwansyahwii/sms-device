"use strict";
const Rx = require('rxjs/Rx');
const SmsDeviceInfo_1 = require('../SmsDeviceInfo');
/**
 * A parses to parse identify metadata returned by gammu
 */
class GammuIdentifyMetadataParser {
    constructor() {
    }
    /**
     * Parse values separated by a semicolon.
     *
     * @param {string} line - The semicolon line
     *
     * @return {[string, string]} - Return a tuple containing left and right value.
     */
    _parseSemicolonValues(line) {
        let lineArray = line.split(' : ');
        let leftValue = '';
        let rightValue = '';
        if (lineArray.length === 2) {
            leftValue = lineArray[0].trim();
            rightValue = lineArray[1].trim();
        }
        return [leftValue, rightValue];
    }
    /**
     * Parse the metadata
     *
     * @return {Rx.Observable<SmsDeviceInfo>} An Observable containing an SmsDeviceInfo
     */
    parse(metadataString) {
        return Rx.Observable.create(s => {
            let result = new SmsDeviceInfo_1.SmsDeviceInfo();
            if (metadataString.startsWith('Error opening device')
                || metadataString.startsWith('No response in specified timeout')) {
                s.error(new Error(metadataString));
            }
            else {
                let lineArray = metadataString.split('\n');
                Rx.Observable.from(lineArray)
                    .observeOn(Rx.Scheduler.async)
                    .subscribe(line => {
                    line = line.trim();
                    let rightValue = this._parseSemicolonValues(line)[1];
                    if (line.startsWith('Device')) {
                        result.device = rightValue;
                    }
                    if (line.startsWith('Manufacturer')) {
                        result.manufacturer = rightValue;
                    }
                    if (line.startsWith('Model')) {
                        result.model = rightValue;
                    }
                    if (line.startsWith('Firmware')) {
                        result.firmware = rightValue;
                    }
                    if (line.startsWith('IMEI')) {
                        result.imei = rightValue;
                    }
                    if (line.startsWith('SIM IMSI')) {
                        result.simIMSI = rightValue;
                    }
                }, err => {
                    s.error(err);
                }, () => {
                    s.next(result);
                    s.complete();
                });
            }
        });
    }
}
exports.GammuIdentifyMetadataParser = GammuIdentifyMetadataParser;
