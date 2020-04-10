const functions = require('firebase-functions');
const twilio = require('twilio');
const axios = require('axios');
const qs = require('qs');

const {
  twilio_account_sid,
  twilio_auth_token,
  twilio_to_number,
  twilio_from_number,
  sunburst_email,
  sunburst_password,
  geolocation
} = functions.config().env;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

async function getSunburstToken() {
  const data = {
    grant_type: 'password',
    username: sunburst_email,
    password: sunburst_password
  };

  try {
    const response = await axios.post('https://sunburst.sunsetwx.com/v1/login', qs.stringify(data));
    return response.data.access_token;
  } catch (error) {
    console.error(error);
  }
}

async function getPrediction() {
  const token = await getSunburstToken();
  const headers = { Authorization: 'Bearer ' + token };
  const params = { geo: geolocation, type: 'sunset' };

  try {
    const response = await axios.get('https://sunburst.sunsetwx.com/v1/quality', { params, headers });
    return response.data.features[0].properties.quality_percent;
  } catch (error) {
    console.error(error);
  }
}

async function sendText(prediction) {
  const client = new twilio(twilio_account_sid, twilio_auth_token);

  try {
    const response = await client.messages.create({
      body: `Tonight's sunset will be ${prediction}% 🔥`,
      to: twilio_to_number,
      from: twilio_from_number
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}

const THRESHOLD = 60;

exports.checkSunset = functions.https.onRequest(async (request, response) => {
  const prediction = await getPrediction();
  if (prediction >= THRESHOLD) sendText(prediction);
  response.send({ prediction });
});
