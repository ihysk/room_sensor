const BME280 = require('node-bme280');
const M2X = require('m2x');

const barometer = new BME280({ address: 0x76 });

const key = process.env.M2X_KEY;
const deviceId = process.env.M2X_DEVICEID;
const tempStreamId = 'hysk-room-temp';
const humidStreamId = 'hysk-room-humidity';
const m2x = new M2X(key);

barometer.begin(function(err) {
  if (err) {
    console.info('error initializing barometer', err);
    return;
  }

  console.info('barometer running');

  barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {
    console.info(
      'temp:', temperature.toFixed(2),
      '℃  pressur', (pressure / 100).toFixed(2),
      'hPa  hum:', humidity.toFixed(2), '%');

    m2x.devices.setStreamValue(deviceId, tempStreamId, { value: temperature.toFixed(2) }, function(response) {
      console.log(response.json);
    });

    m2x.devices.setStreamValue(deviceId, humidStreamId, { value: humidity.toFixed(2) }, function(response) {
      console.log(response.json);
    });
  });
});
