/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />

import {assert} from 'chai';
import {ISmsDevice} from '../lib/ISmsDevice';
import {SmsDevice} from '../lib/SmsDevice';
import {IFileManager} from '../lib/IFileManager';
import {IModemDriver} from '../lib/IModemDriver';
import {IIdentifyMetadataParser} from '../lib/IIdentifyMetadataParser';
import {SmsDeviceInfo} from '../lib/SmsDeviceInfo';
import {SmsInfo} from '../lib/SmsInfo';
import {ISmsMetadataParser} from '../lib/ISmsMetadataParser';

import Rx = require('rxjs/Rx');

describe('SmsDevice', function(){
    describe('create', function(){
        it('create a new instance of ISmsDevice with default device implementations', function(done){
            let smsDevice:ISmsDevice = SmsDevice.create();

            assert.isNotNull(smsDevice);

            let smsDeviceInternal:any = smsDevice;

            assert.isNotNull(smsDeviceInternal.fileManager);
            assert.isNotNull(smsDeviceInternal.identifyMetadataParser);
            assert.isNotNull(smsDeviceInternal.smsMetadataParser);

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
            let smsDevice:ISmsDevice = new SmsDevice(fileManager, null, null, null);

            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err =>{
                    assert.fail(null, null, 'Must not reached here');
                }, ()=>{
                    assert.isTrue(isFileManagerCalled);
                    done();
                });
        });

        it('stored the config file path when the file exists', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice:ISmsDevice = new SmsDevice(fileManager, null, null, null);

            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err =>{
                    assert.fail(null, null, 'Must not reached here');
                }, ()=>{
                    assert.equal(smsDevice.getConfigFile(), 'config1.rc', 'Config file is incorrect');
                    done();
                });            
        })

        it('doesnt stored the config file path when the  file not exists', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(false);
                        s.complete();
                    });
                }
            };
            let smsDevice:ISmsDevice = new SmsDevice(fileManager, null, null, null);

            smsDevice.setConfigFile('config1.rc')
                .subscribe(null, err =>{
                    assert.equal(err.message, 'Config file not found: config1.rc');
                    done();
                }, ()=>{
                    assert.equal(smsDevice.getConfigFile(), '', 'Config file is incorrect');
                    done();
                });            
        })
    });

    describe('identify()', function(){
        it('checks if the config file has been set', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };
            let smsDevice:ISmsDevice = new SmsDevice(fileManager, null, null, null);

            smsDevice.identify()
                .subscribe(null, err =>{
                    assert.equal(err.message, 'Identify failed. No config file specified.', 'Must not reached here');
                    done();
                }, ()=>{
                    assert.fail(null, null, 'Must not reached here');
                });                    
        });

        it('calls IModemDriver.identify() properly', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };

            let isModemDriverIdentifyCalled = false;

            let modemDriver: IModemDriver = {
                identify: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        assert.equal(configFIle, 'config1.rc');

                        isModemDriverIdentifyCalled = true;
                        s.next('info1');
                        s.complete();
                    })
                },
                readAllSms(cf:string):Rx.Observable<string>{
                    return null;
                },
                deleteAllSms: function(configFIle:string, startLocation:number, endLocation:number): Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })                    
                },
                sendSms(configFIle:string, destinationPhone: string, message:string):Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })
                },
                getUSSD(configFile:string, ussdCommand:string):Rx.Observable<string>{
                    return null;
                }                                         
            }

            let identifyMetadataParser:IIdentifyMetadataParser = {
                parse: function(metadata:string): Rx.Observable<SmsDeviceInfo>{
                    return Rx.Observable.create(s =>{
                        assert.equal(metadata, 'info1', 'metadata different');

                        s.next(new SmsDeviceInfo());
                        s.complete();
                    })
                }
            }
            
            let smsDevice:ISmsDevice = new SmsDevice(fileManager, modemDriver, 
                identifyMetadataParser, null);

            smsDevice.setConfigFile('config1.rc')
                .concat(smsDevice.identify())
                .subscribe(null, err =>{
                    assert.fail(null, null, 'Must not reached here');
                }, () =>{
                    assert.isTrue(isModemDriverIdentifyCalled, 'Modem driver identify not called');
                    done();
                });
        });

        it('calls the identify metadata parser', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };

            let isModemDriverIdentifyCalled = false;

            let modemDriver: IModemDriver = {
                identify: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        s.next('info1');
                        s.complete();
                    })
                },
                readAllSms(cf:string):Rx.Observable<string>{
                    return null;
                },
                deleteAllSms: function(configFIle:string, startLocation:number, endLocation:number): Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })                    
                },
                sendSms(configFIle:string, destinationPhone: string, message:string):Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })
                },
                getUSSD(configFile:string, ussdCommand:string):Rx.Observable<string>{
                    return null;
                }                                                           
            }

            let identifyMetadataParser:IIdentifyMetadataParser = {
                parse: function(metadata:string): Rx.Observable<SmsDeviceInfo>{
                    return Rx.Observable.create(s =>{                        
                        assert.equal(metadata, 'info1', 'metadata different');

                        s.next(new SmsDeviceInfo());
                        s.complete();
                    })
                }
            }
            

            let smsDevice:ISmsDevice = new SmsDevice(fileManager, modemDriver, 
                identifyMetadataParser, null);

            
            smsDevice.setConfigFile('config1.rc')                
                .concat(smsDevice.identify())
                .skip(1)
                .subscribe(deviceInfo =>{
                    assert.isObject(deviceInfo, 'deviceInfo is not object');
                    assert.isTrue(deviceInfo instanceof SmsDeviceInfo, 'Not returning instance of SmsDeviceInfo');
                    done();
                }, err =>{
                    assert.fail(null, null, 'Must not reached here');
                }, () =>{
                    
                });
        });
    });

    describe('readAllSms()', function(){
        it('checks if the config file has been set', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };
            
            let smsDevice:ISmsDevice = new SmsDevice(fileManager, null, null, null);

            smsDevice.readAllSms()
                .subscribe(null, err =>{
                    assert.equal(err.message, 'readAllSms failed. No config file specified.', 'Must not reached here');
                    done();
                }, ()=>{
                    assert.fail(null, null, 'Must not reached here');
                });                    
        });

        it('calls IModemDriver.readAllSms()', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };

            let isModemDriverReadAllSmsCalled = false;

            let modemDriver: IModemDriver = {
                identify: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        s.next('info1');
                        s.complete();
                    })
                },
                readAllSms: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        assert.equal(configFIle, 'config1.rc');

                        isModemDriverReadAllSmsCalled = true;
                        s.next('info1');
                        s.complete();
                    })
                },
                deleteAllSms: function(configFIle:string, startLocation:number, endLocation:number): Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })                    
                },
                sendSms(configFIle:string, destinationPhone: string, message:string):Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })
                },
                getUSSD(configFile:string, ussdCommand:string):Rx.Observable<string>{
                    return null;
                }                                                                                                                           
            }
            
            let smsMetadataParser: ISmsMetadataParser = {
                parse(meta:string):Rx.Observable<Array<SmsInfo>>{
                    return Rx.Observable.create(s =>{

                        assert.equal(meta, 'info1');

                        s.next([new SmsInfo()]);
                        s.complete();
                    })
                }
            }
            

            let smsDevice:ISmsDevice = new SmsDevice(fileManager, modemDriver, null, 
                smsMetadataParser);

            smsDevice.setConfigFile('config1.rc').subscribe(null, null, ()=>{
                smsDevice.readAllSms()
                    .subscribe(smsInfos =>{
                        assert.isTrue(isModemDriverReadAllSmsCalled);
                        done();
                    }, err =>{
                        assert.fail(null, null, 'Must not reached here');
                    }, ()=>{
                        
                    });
            })
        });

        it('calls ISmsMetadataParser.parse()', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };

            let isSmsMetadataParseCalled = false;

            let modemDriver: IModemDriver = {
                identify: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        s.next('info1');
                        s.complete();
                    })
                },
                readAllSms: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        s.next('info1');
                        s.complete();
                    })
                },
                deleteAllSms: function(configFIle:string, startLocation:number, endLocation:number): Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })                    
                },
                sendSms(configFIle:string, destinationPhone: string, message:string):Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })
                },
                getUSSD(configFile:string, ussdCommand:string):Rx.Observable<string>{
                    return null;
                }                                                                                                                           
            }

            let smsMetadataParser: ISmsMetadataParser = {
                parse(meta:string):Rx.Observable<Array<SmsInfo>>{
                    return Rx.Observable.create(s =>{

                        assert.equal(meta, 'info1');

                        isSmsMetadataParseCalled = true;

                        s.next([new SmsInfo()]);
                        s.complete();
                    })
                }
            }
            
            let smsDevice:ISmsDevice = new SmsDevice(fileManager, modemDriver, null,
                smsMetadataParser);

            smsDevice.setConfigFile('config1.rc').subscribe(null, null, ()=>{
                smsDevice.readAllSms()
                    .subscribe(smsInfos =>{
                        assert.isTrue(isSmsMetadataParseCalled);
                        done();
                    }, err =>{
                        assert.fail(null, null, 'Must not reached here');
                    }, ()=>{
                        
                    });
            })
        });
    });

    describe('deleteAllSms', function(){
        it('checks if the config file has been set', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };
            
            let smsDevice:ISmsDevice = new SmsDevice(fileManager, null, null, null);

            smsDevice.deleteAllSms(1, 3)
                .subscribe(null, err =>{
                    assert.equal(err.message, 'deleteAllSms failed. No config file specified.', 'Must not reached here');
                    done();
                }, ()=>{
                    assert.fail(null, null, 'Must not reached here');
                });
        });

        it('calls IModemDriver.deleteAllSms()', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };

            let isModemDriverDeleteAllSmsCalled = false;

            let modemDriver: IModemDriver = {
                identify: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        s.next('info1');
                        s.complete();
                    })
                },
                readAllSms: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        s.next('info1');
                        s.complete();
                    })
                },
                deleteAllSms: function(configFIle:string, startLocation:number, endLocation:number): Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        isModemDriverDeleteAllSmsCalled = true;

                        assert.equal(configFIle, 'config1.rc');
                        assert.equal(startLocation, 1);
                        assert.equal(endLocation, 3);

                        s.next();
                        s.complete();
                    })                    
                },
                sendSms(configFIle:string, destinationPhone: string, message:string):Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })
                },
                getUSSD(configFile:string, ussdCommand:string):Rx.Observable<string>{
                    return null;
                }                                                                                           
            }
            
            let smsMetadataParser: ISmsMetadataParser = {
                parse(meta:string):Rx.Observable<Array<SmsInfo>>{
                    return Rx.Observable.create(s =>{

                        assert.equal(meta, 'info1');

                        s.next([new SmsInfo()]);
                        s.complete();
                    })
                }
            }
            

            let smsDevice:ISmsDevice = new SmsDevice(fileManager, modemDriver, null, 
                smsMetadataParser);

            smsDevice.setConfigFile('config1.rc').subscribe(null, null, ()=>{
                smsDevice.deleteAllSms(1, 3)
                    .subscribe(smsInfos =>{
                        assert.isTrue(isModemDriverDeleteAllSmsCalled);
                        done();
                    }, err =>{
                        assert.fail(null, null, 'Must not reached here');
                    }, ()=>{
                        
                    });
            })
        });        
    });

    describe('sendSms', function(){
        it('checks if the config file has been set', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };
            
            let smsDevice:ISmsDevice = new SmsDevice(fileManager, null, null, null);

            smsDevice.sendSms('08912812', 'helooo')
                .subscribe(null, err =>{
                    assert.equal(err.message, 'sendSms failed. No config file specified.', 'Error message is incorrect');
                    done();
                }, ()=>{
                    assert.fail(null, null, 'Must not reached here');
                });
        });

        it('calls IModemDriver.sendSms()', function(done){
            let fileManager:IFileManager = {
                isExists: function(filePath:string):Rx.Observable<boolean>{
                    return Rx.Observable.create(s =>{
                        s.next(true);
                        s.complete();
                    });
                }
            };

            let isModemDriverSendSmsCalled = false;

            let modemDriver: IModemDriver = {
                identify: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        s.next('info1');
                        s.complete();
                    })
                },
                readAllSms: function(configFIle:string): Rx.Observable<string>{
                    return Rx.Observable.create(s =>{
                        s.next('info1');
                        s.complete();
                    })
                },
                deleteAllSms: function(configFIle:string, startLocation:number, endLocation:number): Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        s.next();
                        s.complete();
                    })                    
                },
                sendSms(configFIle:string, destinationPhone: string, message:string):Rx.Observable<void>{
                    return Rx.Observable.create(s =>{
                        assert.equal(configFIle, 'config1.rc');
                        assert.equal(destinationPhone, '012345678');
                        assert.equal(message, 'heloo!');

                        isModemDriverSendSmsCalled = true;

                        s.next();
                        s.complete();
                    })
                },
                getUSSD(configFile:string, ussdCommand:string):Rx.Observable<string>{
                    return null;
                }                                                                           
            }
            
            let smsMetadataParser: ISmsMetadataParser = {
                parse(meta:string):Rx.Observable<Array<SmsInfo>>{
                    return Rx.Observable.create(s =>{
                        s.next([new SmsInfo()]);
                        s.complete();
                    })
                }
            }
            

            let smsDevice:ISmsDevice = new SmsDevice(fileManager, modemDriver, null, 
                smsMetadataParser);

            smsDevice.setConfigFile('config1.rc').subscribe(null, null, ()=>{
                smsDevice.sendSms('012345678', 'heloo!')
                    .subscribe(smsInfos =>{
                        assert.isTrue(isModemDriverSendSmsCalled);
                        done();
                    }, err =>{
                        assert.fail(null, null, 'Must not reached here');
                    }, ()=>{
                        
                    });
            })
        });        
    });

});