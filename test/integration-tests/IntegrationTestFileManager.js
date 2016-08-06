/// <reference path="../../typings/index.d.ts" />
"use strict";
const FileManager_1 = require('../../lib/FileManager');
const chai_1 = require('chai');
describe('FileManager', function () {
    describe('isExist(filePath)', function () {
        it('Returns true when the file exists', function (done) {
            let fileManager = new FileManager_1.FileManager();
            fileManager.isExists(`${__dirname}/IntegrationTestFileManager.ts`).subscribe(r => {
                chai_1.assert.isTrue(r);
                done();
            });
        });
        it('Returns false when the file not exists', function (done) {
            let fileManager = new FileManager_1.FileManager();
            fileManager.isExists(`${__dirname}/NOEXISTS.ts`).subscribe(r => {
                chai_1.assert.isFalse(r);
                done();
            });
        });
    });
});
