sms-device
[![Build Status](https://travis-ci.org/irwansyahwii/sms-device.svg?branch=master)](https://travis-ci.org/irwansyahwii/sms-device)
==========

A library that provides an abstraction to send/receive sms through a modem. This library also provided an implementation that using `gammu` command line to communicate with the modem.

The library is designed to easily customized where each class has a single responsibility that easily interchangeable with another class.

## Installation

NOT READY YET! STILL IN DEVELOPMENT

`npm install sms-device`

## Usage

### Gammu

This library is using `gammu` to communicate with the modem. So first make sure that you had installed `gammu` in your machine. Read the manual [here](http://wammu.eu/docs/manual/index.html).

### Using in Code

```javascript
    import {SmsDevice} from 'sms-device';
    
    //Create a new instance with default implementation using gammu
    let smsDevice = SmsDevice.create();

    //This library is using Rxjs instead of Promise because 
    //it is more reliable so all the methods that run 
    //asynchronously will return an Observable

    smsDevice.setConfigFile('./phone1.rc')
        .subscribe(null, err =>{
            console.log('Error probably file not exists, error:', error);
        }, ()=>{
            console.log('setConfigFile completed!');
        });



    //To send an sms to a number
    smsDevice.sendSms('088121232', 'helooo world!')
        .subscribe(null, err =>{
            console.log('sendSms error:', err);
        }, () =>{
            console.log('sendSms completed!');
        });


    //To read all sms from a SIM card
    //It will return a list of SmsData instance
    smsDevice.readAllSms().subscribe(smsList =>{
        console.log(smsList[0].text);
    }, err =>{
        console.log('readAllSms error:', err)
    }, ()=>{
        console.log('readAllSms completed!');
    });

    //To delete one or more sms sequentially
    //from start position to end position
    smsDevice.deleteAllSms(1, 3)
        .subscribe(result =>{
            if(result){
                console.log('All sms from 1 to 3 deleted');
            }
        }, err =>{
            console.log('deleteAllSms error:', err);
        }, ()=>{
            console.log('deleteAllSms completed!');
        })
```

### Customization

You can implement your own `IConfigBasedSmsDeviceManager, ISmsMetadataParser, and IIdentifyMetadataParser` if you decided to roll your own device manager. Once you have the implementation then you can assign them to an `SmsDevice` instance without ever changing the client code.


## Contributions

All contributions are welcome

## License

MIT