import express from 'express';
import cors from 'cors';
import connectToMongoDB from './db/db.js';
import authRouter from './routes/auth.js';
import noteRouter from './routes/note.js';

const app = express();
app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (_req, res) => res.send('API running'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/note', noteRouter);

const PORT = 5001;

// Start server function
const start = async () => {
  try {
    console.log('Starting server...');
    await connectToMongoDB(); // Connect to MongoDB
    console.log('DB connection successful');
  } catch (error) {
    console.error('DB connection failed:', error.message);
    console.warn('Continuing without DB connection...');
  }

  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
};

start();
