import { Router } from 'express';
import { getAllElements, getElementById, getElementsByChemist } from '../services/elementService';

const router = Router();

router.get('/', (_req, res) => {
  const elements = getAllElements();
  res.json(elements);
});

router.get('/:id', (req, res) => {
  const element = getElementById(req.params.id);
  if (!element) {
    res.status(404).json({ error: 'Element not found' });
    return;
  }
  res.json(element);
});

router.get('/chemist/:chemistId', (req, res) => {
  const elements = getElementsByChemist(req.params.chemistId);
  res.json(elements);
});

export default router;
