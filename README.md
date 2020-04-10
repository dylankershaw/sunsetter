# Sunsetter

Uses [SunsetWx](https://sunsetwx.com/) to get daily sunset quality predictions and sends a text if it's predicted to be above a predefined threshold.

### Useful firebase-tools CLI commands
- deploy: `firebase deploy --only functions`
- set env vars: `firebase functions:config:set env.geolocation="57.2314222,90.5467432"`
- pull down env vars locally: `firebase functions:config:get > .runtimeconfig.json`

### Triggering this daily
This works best when triggered via a daily cron job. I recommend [Easy Cron](https://www.easycron.com).
