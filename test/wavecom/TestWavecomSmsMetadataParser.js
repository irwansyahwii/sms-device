"use strict";
const chai_1 = require('chai');
const WavecomSmsMetadataParser_1 = require('../../lib/wavecom/WavecomSmsMetadataParser');
const moment = require('moment');
describe('WavecomSmsMetadataParser', function () {
    describe('parse', function () {
        // it('parse device open error correctly', function(done){
        //     let parser:ISmsMetadataParser = new GammuSmsMetadataParser();
        //     parser.parse("Error opening device, it doesn't exist.")
        //         .subscribe(r =>{
        //             assert.fail(null, null, 'Must not reached here');
        //         }, err =>{
        //             assert.equal(err.message, "Error opening device, it doesn't exist.");
        //             done()
        //         })
        // })
        // it('parse timeout error correctly', function(done){
        //     let parser:ISmsMetadataParser = new GammuSmsMetadataParser();
        //     parser.parse("No response in specified timeout. Probably phone not connected.")
        //         .subscribe(r =>{
        //             assert.fail(null, null, 'Must not reached here');
        //         }, err =>{
        //             assert.equal(err.message, "No response in specified timeout. Probably phone not connected.");
        //             done()
        //         })
        // })
        // it('parse permission error correctly', function(done){
        //     let parser:ISmsMetadataParser = new GammuSmsMetadataParser();
        //     parser.parse("Error opening device, you don't have permissions.")
        //         .subscribe(r =>{
        //             assert.fail(null, null, 'Must not reached here');
        //         }, err =>{
        //             assert.equal(err.message, "Error opening device, you don't have permissions.");
        //             done()
        //         })
        // })
        it('can parse 1 message', function (done) {
            let parser = new WavecomSmsMetadataParser_1.WavecomSmsMetadataParser();
            parser.parse(`
AT+CMGL="ALL"
+CMGL: 1,"REC READ","+6288923778906",,"16/08/06,19:20:56+28"
Test
            `)
                .subscribe(gammuSmsArray => {
                chai_1.assert.equal(gammuSmsArray.length, 1, 'Array length must be 1');
                chai_1.assert.equal(gammuSmsArray[0].coding, '', 'Coding is wrong');
                chai_1.assert.equal(gammuSmsArray[0].location, 1, 'location is wrong');
                chai_1.assert.equal(gammuSmsArray[0].folder, "", 'folder is wrong');
                chai_1.assert.equal(gammuSmsArray[0].smscNumber, "", 'smscNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[0].sent, moment('16/08/06,19:20:56+28', 'YY/MM/DD,hh:mm:ssZ').unix(), 'sent is wrong');
                chai_1.assert.equal(gammuSmsArray[0].remoteNumber, '+6288923778906', 'remoteNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[0].status, '', 'status is wrong');
                chai_1.assert.equal(gammuSmsArray[0].text, 'Test', 'Text is wrong');
                done();
            }, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            });
        });
        it('can parse 2 messages', function (done) {
            let parser = new WavecomSmsMetadataParser_1.WavecomSmsMetadataParser();
            parser.parse(`
AT+CMGL="ALL"
+CMGL: 1,"REC READ","+6288923778906",,"16/08/06,19:20:56+28"
Test
+CMGL: 2,"REC READ","+6288923778906",,"16/08/10,13:26:32+28"
Dari hape biru
            `)
                .subscribe(gammuSmsArray => {
                chai_1.assert.equal(gammuSmsArray.length, 2, 'Array length must be 2');
                chai_1.assert.equal(gammuSmsArray[0].coding, '', 'Coding is wrong');
                chai_1.assert.equal(gammuSmsArray[0].location, 1, 'location is wrong');
                chai_1.assert.equal(gammuSmsArray[0].folder, "", 'folder is wrong');
                chai_1.assert.equal(gammuSmsArray[0].smscNumber, "", 'smscNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[0].sent, moment('16/08/06,19:20:56+28', 'YY/MM/DD,hh:mm:ssZ').unix(), 'sent is wrong');
                chai_1.assert.equal(gammuSmsArray[0].remoteNumber, '+6288923778906', 'remoteNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[0].status, '', 'status is wrong');
                chai_1.assert.equal(gammuSmsArray[0].text, 'Test', 'Text is wrong');
                chai_1.assert.equal(gammuSmsArray[1].coding, '', 'Coding is wrong');
                chai_1.assert.equal(gammuSmsArray[1].location, 2, 'location is wrong');
                chai_1.assert.equal(gammuSmsArray[1].folder, "", 'folder is wrong');
                chai_1.assert.equal(gammuSmsArray[1].smscNumber, "", 'smscNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[1].sent, moment('16/08/10,13:26:32+28', 'YY/MM/DD,hh:mm:ssZ').unix(), 'sent is wrong');
                chai_1.assert.equal(gammuSmsArray[1].remoteNumber, '+6288923778906', 'remoteNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[1].status, '', 'status is wrong');
                chai_1.assert.equal(gammuSmsArray[1].text, 'Dari hape biru', 'Text is wrong');
                done();
            }, err => {
                console.log(err);
                chai_1.assert.fail(null, null, 'Must not reached here');
            });
        });
        it('can parse 3 messages', function (done) {
            let parser = new WavecomSmsMetadataParser_1.WavecomSmsMetadataParser();
            parser.parse(`
AT+CMGL="ALL"
+CMGL: 1,"REC READ","+6288923778906",,"16/08/06,19:20:56+28"
Test
+CMGL: 2,"REC READ","+6288923778906",,"16/08/10,13:26:32+28"
Dari hape biru
+CMGL: 3,"REC READ","+6288923778906",,"16/08/10,13:47:03+28"
Test 3

            `)
                .subscribe(gammuSmsArray => {
                chai_1.assert.equal(gammuSmsArray.length, 3, 'Array length must be 3');
                chai_1.assert.equal(gammuSmsArray[0].coding, '', 'Coding is wrong');
                chai_1.assert.equal(gammuSmsArray[0].location, 1, 'location is wrong');
                chai_1.assert.equal(gammuSmsArray[0].folder, "", 'folder is wrong');
                chai_1.assert.equal(gammuSmsArray[0].smscNumber, "", 'smscNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[0].sent, moment('16/08/06,19:20:56+28', 'YY/MM/DD,hh:mm:ssZ').unix(), 'sent is wrong');
                chai_1.assert.equal(gammuSmsArray[0].remoteNumber, '+6288923778906', 'remoteNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[0].status, '', 'status is wrong');
                chai_1.assert.equal(gammuSmsArray[0].text, 'Test', 'Text is wrong');
                chai_1.assert.equal(gammuSmsArray[1].coding, '', 'Coding is wrong');
                chai_1.assert.equal(gammuSmsArray[1].location, 2, 'location is wrong');
                chai_1.assert.equal(gammuSmsArray[1].folder, "", 'folder is wrong');
                chai_1.assert.equal(gammuSmsArray[1].smscNumber, "", 'smscNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[1].sent, moment('16/08/10,13:26:32+28', 'YY/MM/DD,hh:mm:ssZ').unix(), 'sent is wrong');
                chai_1.assert.equal(gammuSmsArray[1].remoteNumber, '+6288923778906', 'remoteNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[1].status, '', 'status is wrong');
                chai_1.assert.equal(gammuSmsArray[1].text, 'Dari hape biru', 'Text is wrong');
                chai_1.assert.equal(gammuSmsArray[2].coding, '', 'Coding is wrong');
                chai_1.assert.equal(gammuSmsArray[2].location, 3, 'location is wrong');
                chai_1.assert.equal(gammuSmsArray[2].folder, "", 'folder is wrong');
                chai_1.assert.equal(gammuSmsArray[2].smscNumber, "", 'smscNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[2].sent, moment('16/08/10,13:47:03+28', 'YY/MM/DD,hh:mm:ssZ').unix(), 'sent is wrong');
                chai_1.assert.equal(gammuSmsArray[2].remoteNumber, '+6288923778906', 'remoteNumber is wrong');
                chai_1.assert.equal(gammuSmsArray[2].status, '', 'status is wrong');
                chai_1.assert.equal(gammuSmsArray[2].text, 'Test 3', 'Text is wrong');
            }, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, () => {
                done();
            });
        });
    });
});
