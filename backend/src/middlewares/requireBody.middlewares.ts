import { Request, Response, NextFunction } from 'express';

export const requireBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({ error: 'Missing or invalid request body' });
  }
  next();
};