import { Router } from 'express';
import { processPeriodicAnswer } from '../services/periodicGameService';
import type { SubmitPeriodicAnswerRequest } from '../../shared/types';

const router = Router();

router.post('/submit-answer', (req, res) => {
  const { questionId, selectedIndex, elementId } = req.body as SubmitPeriodicAnswerRequest;
  
  if (typeof questionId !== 'string' || typeof selectedIndex !== 'number' || typeof elementId !== 'string') {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const result = processPeriodicAnswer(questionId, selectedIndex, elementId);
  res.json(result);
});

export default router;
