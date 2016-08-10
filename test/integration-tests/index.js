// import './IntegrationTestFileManager';
// import './IntegrationTestSmsDevice';
let SerialPort = require('serialport');
let port = new SerialPort("/dev/ttyUSB0", {});
