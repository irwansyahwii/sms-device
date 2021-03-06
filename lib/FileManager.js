"use strict";
const Rx = require('rxjs/Rx');
const fs = require('fs');
/**
 * Provide IFileManager implementation using fs.stat()
 */
class FileManager {
    constructor() {
    }
    isExists(filePath) {
        return Rx.Observable.create(s => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    s.next(false);
                }
                else {
                    s.next(true);
                }
            });
        });
    }
}
exports.FileManager = FileManager;
