import { getPrediction, sendText } from './helpers';

const THRESHOLD = 60;

export default async (_req, res) => {
  const prediction = await getPrediction('sunrise');
  const message = `Tomorrow's sunrise will be ${prediction}% 🔥`;
  if (prediction >= THRESHOLD) await sendText(message);
  res.json({ prediction });
};
