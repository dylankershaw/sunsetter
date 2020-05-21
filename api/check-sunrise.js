import { getPrediction, sendText } from './helpers';

const THRESHOLD = 75;

export default async (_req, res) => {
  const prediction = await getPrediction('sunrise');
  const message = `Tomorrow's sunrise will be ${prediction}% 🔥`;
  if (prediction >= THRESHOLD) await sendText(message);
  res.json({ prediction });
};
