import { Router, Request, Response } from 'express';
import multer from 'multer';
import { NotionService } from '../services/notionService';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

// Check connection endpoint
router.get('/check-connection', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      return res.json({
        success: false,
        error: 'Notion API credentials not configured. Please set NOTION_API_KEY and NOTION_DATABASE_ID in your .env file.',
      });
    }

    const notionService = new NotionService({ apiKey, databaseId });
    const result = await notionService.verifyConnection();

    res.json(result);
  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Upload single image endpoint
router.post('/image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const apiKey = process.env.NOTION_API_KEY;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!apiKey || !databaseId) {
      return res.status(500).json({
        success: false,
        error: 'Notion API credentials not configured',
      });
    }

    const notionService = new NotionService({ apiKey, databaseId });

    // Get file details
    const fileName = req.file.originalname;
    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Upload to Notion using the service method
    const result = await notionService.uploadImageFromBuffer(fileName, imageBuffer, mimeType);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
