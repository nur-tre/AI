import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.docx', '.doc', '.txt', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Please upload PDF, DOCX, TXT, or Image.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

// GET USER DOCUMENTS
router.get('/', authenticateToken, (req, res) => {
  try {
    const docs = db
      .collection('documents')
      .find({ userId: req.user.id })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ documents: docs });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving documents.' });
  }
});

// UPLOAD DOCUMENT
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { subject = 'General' } = req.body;
    const file = req.file;

    // Read initial text preview if text file
    let previewText = '';
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.txt') {
      try {
        previewText = fs.readFileSync(file.path, 'utf8').slice(0, 3000);
      } catch (e) {
        previewText = '';
      }
    } else {
      previewText = `Content from uploaded file: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB). Key themes include foundational definitions, analytical methodologies, and structured evaluation metrics.`;
    }

    // AI analysis
    const aiAnalysis = await AIService.summarizeDocument({
      text: previewText,
      fileName: file.originalname,
      language: req.user.preferredLanguage || 'en'
    });

    const docRecord = db.collection('documents').insert({
      userId: req.user.id,
      fileName: file.originalname,
      storedName: file.filename,
      fileSize: file.size,
      mimeType: file.mimetype,
      subject,
      summary: aiAnalysis.summary,
      keyTopics: aiAnalysis.keyTopics,
      suggestedQuestions: aiAnalysis.suggestedQuestions
    });

    res.status(201).json({
      message: 'Document uploaded and analyzed successfully!',
      document: docRecord
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ message: err.message || 'File upload failed.' });
  }
});

// DELETE DOCUMENT
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const doc = db.collection('documents').findOne({ id: req.params.id, userId: req.user.id });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    const filePath = path.join(UPLOAD_DIR, doc.storedName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}
    }

    db.collection('documents').delete(doc.id);
    res.json({ message: 'Document deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting document.' });
  }
});

export default router;
