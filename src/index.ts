import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import open from 'open';
import healthRouter from './routes/health';
import usersRouter from './routes/users';
import uploadRouter from './routes/upload';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/health', healthRouter);
app.use('/api/users', usersRouter);
app.use('/api/upload', uploadRouter);

// Serve GUI on root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, async () => {
    const url = `http://localhost:${PORT}`;
    console.log('\n🚀 Notion Image Uploader is running!');
    console.log(`📱 Open in browser: ${url}`);
    console.log('\n💡 Opening browser automatically...\n');

    // Auto-open browser
    try {
      await open(url);
    } catch (error) {
      console.log('Could not auto-open browser. Please open manually.');
    }
  });
}

export default app;
