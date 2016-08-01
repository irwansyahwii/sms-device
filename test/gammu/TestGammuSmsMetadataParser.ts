import {assert} from 'chai';
import Rx = require('rxjs/Rx');
import {ISmsMetadataParser} from '../../lib/ISmsMetadataParser';
import {GammuSmsMetadataParser} from '../../lib/gammu/GammuSmsMetadataParser';
import moment = require('moment');

describe('GammuSmsMetadataParser', function(){
    describe('parse', function(){
        it('parse device open error correctly', function(done){
            let parser:ISmsMetadataParser = new GammuSmsMetadataParser();

            parser.parse("Error opening device, it doesn't exist.")
                .subscribe(r =>{
                    assert.fail(null, null, 'Must not reached here');
                }, err =>{
                    assert.equal(err.message, "Error opening device, it doesn't exist.");
                    done()
                })
        })
        it('parse timeout error correctly', function(done){
            let parser:ISmsMetadataParser = new GammuSmsMetadataParser();

            parser.parse("No response in specified timeout. Probably phone not connected.")
                .subscribe(r =>{
                    assert.fail(null, null, 'Must not reached here');
                }, err =>{
                    assert.equal(err.message, "No response in specified timeout. Probably phone not connected.");
                    done()
                })
        })
        it('parse permission error correctly', function(done){
            let parser:ISmsMetadataParser = new GammuSmsMetadataParser();

            parser.parse("Error opening device, you don't have permissions.")
                .subscribe(r =>{
                    assert.fail(null, null, 'Must not reached here');
                }, err =>{
                    assert.equal(err.message, "Error opening device, you don't have permissions.");
                    done()
                })
        })
        it('can parse 1 message', function(done){
            let parser:ISmsMetadataParser = new GammuSmsMetadataParser();

            parser.parse(`

Location 1, folder "Inbox", SIM memory, Inbox folder
SMS message
SMSC number          : "+628880000800"
Sent                 : Thu 21 Jul 2016 11:47:02 AM  +0700
Coding               : Default GSM alphabet (no compression)
Remote number        : "+628891366079"
Status               : UnRead

Barunih

1 SMS parts in 1 SMS sequences           

            `)
                .subscribe(gammuSmsArray =>{
                    assert.equal(gammuSmsArray.length, 1, 'Array length must be 1');

                    assert.equal(gammuSmsArray[0].coding, 'Default GSM alphabet (no compression)', 'Coding is wrong');
                    assert.equal(gammuSmsArray[0].location, 1, 'location is wrong');
                    assert.equal(gammuSmsArray[0].folder, "Inbox", 'folder is wrong');
                    assert.equal(gammuSmsArray[0].smscNumber, "+628880000800", 'smscNumber is wrong');
                    assert.equal(gammuSmsArray[0].sent, moment('Thu 21 Jul 2016 11:47:02 AM  +0700', 'ddd DD MMM YYYY hh:mm:ss ZZ').unix(), 'sent is wrong');
                    assert.equal(gammuSmsArray[0].remoteNumber, '+628891366079', 'remoteNumber is wrong');
                    assert.equal(gammuSmsArray[0].status, 'UnRead', 'status is wrong');

                    assert.equal(gammuSmsArray[0].text, 'Barunih', 'Text is wrong');
                    done();
                }, err =>{
                    assert.fail(null, null, 'Must not reached here');
                })            
        })   

        it('can parse 2 messages', function(done){
            let parser:ISmsMetadataParser = new GammuSmsMetadataParser();

            parser.parse(`

Location 1, folder "Inbox", SIM memory, Inbox folder
SMS message
SMSC number          : "+628880000800"
Sent                 : Thu 21 Jul 2016 11:47:02 AM  +0700
Coding               : Default GSM alphabet (no compression)
Remote number        : "+628891366079"
Status               : UnRead

Barunih

Location 2, folder "Inbox", SIM memory, Inbox folder
SMS message
SMSC number          : "+628880000800"
Sent                 : Thu 21 Jul 2016 11:20:38 AM  +0700
Coding               : Default GSM alphabet (no compression)
Remote number        : "+628891366079"
Status               : Read

Heloo



2 SMS parts in 2 SMS sequences   
            `)
                .subscribe(gammuSmsArray =>{
                    assert.equal(gammuSmsArray.length, 2, 'Array length must be 2');
                    assert.equal(gammuSmsArray[0].coding, 'Default GSM alphabet (no compression)', 'Coding is wrong');
                    assert.equal(gammuSmsArray[0].location, 1, 'location is wrong');
                    assert.equal(gammuSmsArray[0].folder, "Inbox", 'folder is wrong');
                    assert.equal(gammuSmsArray[0].smscNumber, "+628880000800", 'smscNumber is wrong');
                    assert.equal(gammuSmsArray[0].sent, moment('Thu 21 Jul 2016 11:47:02 AM  +0700', 'ddd DD MMM YYYY hh:mm:ss ZZ').unix(), 'sent is wrong');
                    assert.equal(gammuSmsArray[0].remoteNumber, '+628891366079', 'remoteNumber is wrong');
                    assert.equal(gammuSmsArray[0].status, 'UnRead', 'status is wrong');
                    assert.equal(gammuSmsArray[0].text, 'Barunih', 'Text is wrong');

                    assert.equal(gammuSmsArray[1].coding, 'Default GSM alphabet (no compression)', 'Coding is wrong');
                    assert.equal(gammuSmsArray[1].location, 2, 'location is wrong');
                    assert.equal(gammuSmsArray[1].folder, "Inbox", 'folder is wrong');
                    assert.equal(gammuSmsArray[1].smscNumber, "+628880000800", 'smscNumber is wrong');
                    assert.equal(gammuSmsArray[1].sent, moment('Thu 21 Jul 2016 11:20:38 AM  +0700', 'ddd DD MMM YYYY hh:mm:ss ZZ').unix(), 'sent is wrong');
                    assert.equal(gammuSmsArray[1].remoteNumber, '+628891366079', 'remoteNumber is wrong');
                    assert.equal(gammuSmsArray[1].status, 'Read', 'status is wrong');
                    assert.equal(gammuSmsArray[1].text, 'Heloo', 'Text is wrong');

                    done();
                }, err =>{
                    assert.fail(null, null, 'Must not reached here');
                })            
        })    

        it('can parse splitted messages', function(done){
            let parser:ISmsMetadataParser = new GammuSmsMetadataParser();

            parser.parse(`

Location 1, folder "Inbox", SIM memory, Inbox folder
SMS message
SMSC number          : "+6281100000"
Sent                 : Mon 25 Jul 2016 02:42:13 PM  +0700
Class                : 1
Coding               : Default GSM alphabet (no compression)
Remote number        : "TELKOMSEL"
Status               : UnRead

Terimakasih telah melakukan pengisian ulang dgn SN 41000774991981 senilai 25000.

Location 2, folder "Inbox", SIM memory, Inbox folder
SMS message
SMSC number          : "+6281100000"
Sent                 : Mon 25 Jul 2016 02:43:17 PM  +0700
Class                : 1
Coding               : Default GSM alphabet (no compression)
Remote number        : "TELKOMSEL"
Status               : UnRead
User Data Header     : User UDH

Terima kasih telah melakukan isi ulang. Beli Paket Combo Mania 100mnt+50SMS+5MB dg cara ketik CM ON kirim ke 8999. Harga mulai Rp 2500 kec. Papua 

Location 3, folder "Inbox", SIM memory, Inbox folder
SMS message
SMSC number          : "+6281100000"
Sent                 : Mon 25 Jul 2016 02:43:17 PM  +0700
Class                : 1
Coding               : Default GSM alphabet (no compression)
Remote number        : "TELKOMSEL"
Status               : UnRead
User Data Header     : User UDH

Maluku. Info:188



3 SMS parts in 3 SMS sequences 
            `)
                .subscribe(gammuSmsArray =>{
                    assert.equal(gammuSmsArray.length, 3, 'Array length must be 3');

                    assert.equal(gammuSmsArray[0].coding, 'Default GSM alphabet (no compression)', 'Coding is wrong');
                    assert.equal(gammuSmsArray[0].location, 1, 'location is wrong');
                    assert.equal(gammuSmsArray[0].folder, "Inbox", 'folder is wrong');
                    assert.equal(gammuSmsArray[0].smscNumber, "+6281100000", 'smscNumber is wrong');
                    assert.equal(gammuSmsArray[0].sent, moment('Mon 25 Jul 2016 02:42:13 PM  +0700', 'ddd DD MMM YYYY hh:mm:ss ZZ').unix(), 'sent is wrong');
                    assert.equal(gammuSmsArray[0].remoteNumber, 'TELKOMSEL', 'remoteNumber is wrong');
                    assert.equal(gammuSmsArray[0].status, 'UnRead', 'status is wrong');
                    assert.equal(gammuSmsArray[0].text, 'Terimakasih telah melakukan pengisian ulang dgn SN 41000774991981 senilai 25000.', 'Text is wrong');

                    assert.equal(gammuSmsArray[1].coding, 'Default GSM alphabet (no compression)', 'Coding is wrong');
                    assert.equal(gammuSmsArray[1].location, 2, 'location is wrong');
                    assert.equal(gammuSmsArray[1].folder, "Inbox", 'folder is wrong');
                    assert.equal(gammuSmsArray[1].smscNumber, "+6281100000", 'smscNumber is wrong');
                    assert.equal(gammuSmsArray[1].sent, moment('Mon 25 Jul 2016 02:43:17 PM  +0700', 'ddd DD MMM YYYY hh:mm:ss ZZ').unix(), 'sent is wrong');
                    assert.equal(gammuSmsArray[1].remoteNumber, 'TELKOMSEL', 'remoteNumber is wrong');
                    assert.equal(gammuSmsArray[1].status, 'UnRead', 'status is wrong');
                    assert.equal(gammuSmsArray[1].text, 'Terima kasih telah melakukan isi ulang. Beli Paket Combo Mania 100mnt+50SMS+5MB dg cara ketik CM ON kirim ke 8999. Harga mulai Rp 2500 kec. Papua', 'Text is wrong');

                    assert.equal(gammuSmsArray[2].coding, 'Default GSM alphabet (no compression)', 'Coding is wrong');
                    assert.equal(gammuSmsArray[2].location, 3, 'location is wrong');
                    assert.equal(gammuSmsArray[2].folder, "Inbox", 'folder is wrong');
                    assert.equal(gammuSmsArray[2].smscNumber, "+6281100000", 'smscNumber is wrong');
                    assert.equal(gammuSmsArray[2].sent, moment('Mon 25 Jul 2016 02:43:17 PM  +0700', 'ddd DD MMM YYYY hh:mm:ss ZZ').unix(), 'sent is wrong');
                    assert.equal(gammuSmsArray[2].remoteNumber, 'TELKOMSEL', 'remoteNumber is wrong');
                    assert.equal(gammuSmsArray[2].status, 'UnRead', 'status is wrong');
                    assert.equal(gammuSmsArray[2].text, 'Maluku. Info:188', 'Text is wrong');

                    
                    done();
                }, err =>{
                    assert.fail(null, null, 'Must not reached here');
                })            
        })                        
    }) 
});