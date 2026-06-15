import { Router } from 'express';
import { getElementFactByElementId, getRandomElementFact } from '../services/elementFactService';

const router = Router();

router.get('/element/:elementId', (req, res) => {
  const fact = getElementFactByElementId(req.params.elementId);
  if (!fact) {
    res.status(404).json({ error: 'Element fact not found' });
    return;
  }
  res.json(fact);
});

router.get('/random', (req, res) => {
  const chemistId = req.query.chemistId as string | undefined;
  const fact = getRandomElementFact(chemistId);
  if (!fact) {
    res.status(404).json({ error: 'No element facts available' });
    return;
  }
  res.json(fact);
});

export default router;
