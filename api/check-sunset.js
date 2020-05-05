import { getPrediction, sendText } from './helpers';

const THRESHOLD = 50;

export default async (_req, res) => {
  const prediction = await getPrediction('sunset');
  const message = `Tonight's sunset will be ${prediction}% 🔥`;
  if (prediction >= THRESHOLD) await sendText(message);
  res.json({ prediction });
};
