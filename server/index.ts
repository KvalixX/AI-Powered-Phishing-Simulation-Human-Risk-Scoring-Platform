import express, { Request, Response } from 'express';
import emailRoutes from './routes.js';

const app = express();
app.use(express.json());

// Main email routes
app.use('/api', emailRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
