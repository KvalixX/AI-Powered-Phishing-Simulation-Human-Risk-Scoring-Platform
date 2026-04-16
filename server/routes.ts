import { Router, Request, Response } from 'express';
import { sendEmail } from './services/email.js';

const router = Router();

router.post('/send-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { to, subject, text, html } = req.body;
    
    if (!to || !subject) {
      res.status(400).json({ error: 'Missing required fields: to, subject' });
      return;
    }

    const info = await sendEmail({ to, subject, text, html });
    res.json({ success: true, messageId: info.messageId, previewUrl: info.previewUrl });
  } catch (error: any) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

export default router;
