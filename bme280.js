'use strict';

var BME280 = require('node-bme280');
var M2X = require('m2x')

var barometer = new BME280({address: 0x76});

var key = process.env.M2X_KEY;
var deviceId = process.env.M2X_DEVICEID;
var tempStreamId = 'hysk-room-temp';
var humidStreamId = 'hysk-room-humidity';
var m2x = new M2X(key);

barometer.begin(function(err) {
    if (err) {
	console.info('error initializing barometer', err);
	return;
    }

    console.info('barometer running');

    barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {

	console.info(
	    'temp:',
	    temperature.toFixed(2),
	    '℃  pressure:',
	    (pressure / 100).toFixed(2),
	    'hPa  hum:',
	    humidity.toFixed(2),
	    '%'
	);

	m2x.devices.setStreamValue(deviceId, tempStreamId, {"value":temperature.toFixed(2)}, function(response) {
    	    console.log(response.json);
	});

	m2x.devices.setStreamValue(deviceId, humidStreamId, {"value":humidity.toFixed(2)}, function(response) {
    	    console.log(response.json);
	});
    });
});
