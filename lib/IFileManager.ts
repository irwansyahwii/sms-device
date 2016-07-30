import Rx = require('rxjs/Rx');


/**
 * Abstracted the files related operations
 */
export interface IFileManager{
    /**
     * Check for file existence
     * 
     * @return {boolean} True when the file exists, false otherwise.
     */
    isExists(filePath:string): Rx.Observable<boolean>;
}