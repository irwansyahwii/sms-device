/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />

import {assert} from 'chai';
import {ISmsDevice} from '../lib/ISmsDevice';
import {SmsDevice} from '../lib/SmsDevice';
import {IFileManager} from '../lib/IFileManager';

import Rx = require('rxjs/Rx');

describe('SmsDevice', function(){
    describe('create', function(){
        it('create a new instance of ISmsDevice with default device implementations', function(done){
            let smsDevice:ISmsDevice = SmsDevice.create();

            assert.isNotNull(smsDevice);

            done();
        });
    });

    describe('setConfigFile', function(){
        it('calls the IFileManager instance to check for the file existence', function(done){
            let isFileManagerCalled = false;
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        isFileManagerCalled = true;
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice:ISmsDevice = new SmsDevice(fileManager);

            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err =>{
                    assert.fail(null, null, 'Must not reached here');
                }, ()=>{
                    assert.isTrue(isFileManagerCalled);
                    done();
                });
        });
    });
});