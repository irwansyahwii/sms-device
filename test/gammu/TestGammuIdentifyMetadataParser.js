"use strict";
const chai_1 = require('chai');
const GammuIdentifyMetadataParser_1 = require('../../lib/gammu/GammuIdentifyMetadataParser');
describe('GammuIdentifyMetadataParser', function () {
    describe('parse', function () {
        it('parse device open error correctly', function (done) {
            let parser = new GammuIdentifyMetadataParser_1.GammuIdentifyMetadataParser();
            parser.parse("Error opening device, it doesn't exist.")
                .subscribe(r => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, err => {
                chai_1.assert.equal(err.message, "Error opening device, it doesn't exist.");
                done();
            });
        });
        it('parse timeout error correctly', function (done) {
            let parser = new GammuIdentifyMetadataParser_1.GammuIdentifyMetadataParser();
            parser.parse("No response in specified timeout. Probably phone not connected.")
                .subscribe(r => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, err => {
                chai_1.assert.equal(err.message, "No response in specified timeout. Probably phone not connected.");
                done();
            });
        });
        it('parse permission error correctly', function (done) {
            let parser = new GammuIdentifyMetadataParser_1.GammuIdentifyMetadataParser();
            parser.parse("Error opening device, you don't have permissions.")
                .subscribe(r => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            }, err => {
                chai_1.assert.equal(err.message, "Error opening device, you don't have permissions.");
                done();
            });
        });
        it('parse the metadata correctly', function (done) {
            let parser = new GammuIdentifyMetadataParser_1.GammuIdentifyMetadataParser();
            parser.parse(`

Device               : /dev/ttyUSB0
Manufacturer         : Wavecom
Model                : MULTIBAND  900E  1800 (MULTIBAND  900E  1800)
Firmware             : 652a09gg.Q2406B 428 112614 13:53
IMEI                 : 012345678901234
SIM IMSI             : 510109425739462                        

            `)
                .subscribe(deviceInfo => {
                chai_1.assert.equal(deviceInfo.device, '/dev/ttyUSB0');
                chai_1.assert.equal(deviceInfo.manufacturer, 'Wavecom');
                chai_1.assert.equal(deviceInfo.model, 'MULTIBAND  900E  1800 (MULTIBAND  900E  1800)');
                chai_1.assert.equal(deviceInfo.firmware, '652a09gg.Q2406B 428 112614 13:53');
                chai_1.assert.equal(deviceInfo.imei, '012345678901234');
                chai_1.assert.equal(deviceInfo.simIMSI, '510109425739462');
                done();
            }, err => {
                chai_1.assert.fail(null, null, 'Must not reached here');
            });
        });
    });
});
