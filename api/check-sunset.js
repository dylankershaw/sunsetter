const twilio = require('twilio');
const axios = require('axios');
const qs = require('qs');

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
  TWILIO_TO_NUMBER,
  SUNBURST_EMAIL,
  SUNBURST_PASSWORD,
  GEOLOCATION,
} = process.env;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

async function getSunburstToken() {
  const data = {
    grant_type: 'password',
    username: SUNBURST_EMAIL,
    password: SUNBURST_PASSWORD,
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
  const params = { geo: GEOLOCATION, type: 'sunset' };

  try {
    const response = await axios.get('https://sunburst.sunsetwx.com/v1/quality', { params, headers });
    return response.data.features[0].properties.quality_percent;
  } catch (error) {
    console.error(error);
  }
}

async function sendText(prediction) {
  const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  try {
    const response = await client.messages.create({
      body: `Tonight's sunset will be ${prediction}% 🔥`,
      to: TWILIO_TO_NUMBER,
      from: TWILIO_FROM_NUMBER,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}

const THRESHOLD = 50;

export default async (_req, res) => {
  const prediction = await getPrediction();
  if (prediction >= THRESHOLD) await sendText(prediction);
  res.json({ prediction });
};
