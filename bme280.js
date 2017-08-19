const BME280 = require('node-bme280');
const M2X = require('m2x');
const twit = require('twit');

const barometer = new BME280({ address: 0x76 });
const t = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

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
    const str = `temp:${temperature.toFixed(2)}℃  pressur${(pressure / 100).toFixed(2)}hPa  hum:${humidity.toFixed(2)}%`;
    console.info(str);

    // t.post('statuses/update', { status: str }, function(err, data) {
    //   console.log(data);
    // });

    m2x.devices.setStreamValue(deviceId, tempStreamId, { value: temperature.toFixed(2) }, function(response) {
      console.log(response.json);
    });

    m2x.devices.setStreamValue(deviceId, humidStreamId, { value: humidity.toFixed(2) }, function(response) {
      console.log(response.json);
    });
  });
});
