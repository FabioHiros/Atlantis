
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;