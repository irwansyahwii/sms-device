"use strict";
const USSDResponse_1 = require('../USSDResponse');
const Rx = require('rxjs/Rx');
class WavecomUSSDResponseParser {
    constructor() {
    }
    parse(ussdResponseString) {
        return Rx.Observable.create(s => {
            let lines = ussdResponseString.split('\n');
            console.log(lines);
            let result = new USSDResponse_1.USSDResponse();
            Rx.Observable.from(lines, Rx.Scheduler.async)
                .subscribe(line => {
                let lineTrimmed = line.trim();
                if (lineTrimmed.startsWith('AT+CUSD') || lineTrimmed.startsWith('OK')) {
                }
                else if (lineTrimmed.startsWith('+CUSD')) {
                    line = lineTrimmed;
                    let parts = line.split(',"');
                    if (parts.length !== 2) {
                        s.error(new Error('+CUSD line is not valid:' + line));
                    }
                    else {
                        let responseTypeString = parts[0].replace('+CUSD:', '').trim();
                        let responseType = USSDResponse_1.USSDResponseType.NoFurtherActionRequired;
                        switch (responseTypeString) {
                            case '1':
                                responseType = USSDResponse_1.USSDResponseType.WaitingReply;
                                break;
                            case '2':
                                responseType = USSDResponse_1.USSDResponseType.Terminated;
                                break;
                            case '4':
                                responseType = USSDResponse_1.USSDResponseType.NotSupported;
                        }
                        result.responseType = responseType;
                        let textTrimmed = parts[1].trim();
                        if (textTrimmed.endsWith('",0') || textTrimmed.endsWith('",15')) {
                            let substractionValue = 3;
                            if (textTrimmed.endsWith('",15')) {
                                substractionValue = 4;
                            }
                            textTrimmed = textTrimmed.substr(0, textTrimmed.length - substractionValue);
                            result.text = textTrimmed;
                            s.next(result);
                            s.complete();
                        }
                        else {
                            result.text += parts[1];
                        }
                    }
                }
                else if (lineTrimmed.startsWith('",')) {
                    s.next(result);
                    s.complete();
                }
                else {
                    if (result.text.length > 0) {
                        result.text += '\n';
                    }
                    result.text += line;
                }
            }, null);
        });
    }
}
exports.WavecomUSSDResponseParser = WavecomUSSDResponseParser;
