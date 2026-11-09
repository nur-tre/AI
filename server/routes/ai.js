import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';

const router = express.Router();

// GET AI STATUS & API KEY INFO
router.get('/status', (req, res) => {
  const status = AIService.getStatus();
  res.json(status);
});

// AI TUTOR CHAT
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { prompt, subject = 'General Education', conversationId, language, learningLevel } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt message cannot be empty.' });
    }

    const lang = language || req.user.preferredLanguage || 'en';
    const level = learningLevel || req.user.learningLevel || 'intermediate';

    let threadId = conversationId;
    const aiConvs = db.collection('ai_conversations');

    let thread = threadId ? aiConvs.findById(threadId) : null;
    if (!thread) {
      thread = aiConvs.insert({
        userId: req.user.id,
        title: prompt.slice(0, 45) + (prompt.length > 45 ? '...' : ''),
        subject,
        messages: []
      });
      threadId = thread.id;
    }

    // Call AI Service
    const aiResponse = await AIService.generateChatResponse({
      prompt,
      subject,
      conversationHistory: thread.messages || [],
      language: lang,
      learningLevel: level
    });

    const userMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toISOString()
    };

    const botMessage = {
      id: `msg_b_${Date.now()}`,
      sender: 'assistant',
      text: aiResponse.reply,
      source: aiResponse.source,
      configured: aiResponse.configured,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...(thread.messages || []), userMessage, botMessage];
    aiConvs.update(thread.id, {
      messages: updatedMessages,
      lastMessageAt: new Date().toISOString()
    });

    // Reward XP for active learning
    const usersCol = db.collection('users');
    const user = usersCol.findById(req.user.id);
    if (user) {
      usersCol.update(user.id, { xp: (user.xp || 0) + 15 });
    }

    res.json({
      conversationId: thread.id,
      reply: botMessage.text,
      source: aiResponse.source,
      configured: aiResponse.configured,
      message: botMessage
    });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ message: 'Error processing AI chat query.' });
  }
});

// LIST USER CONVERSATIONS
router.get('/conversations', authenticateToken, (req, res) => {
  try {
    const list = db
      .collection('ai_conversations')
      .find({ userId: req.user.id })
      .map(c => ({
        id: c.id,
        title: c.title,
        subject: c.subject,
        messageCount: c.messages?.length || 0,
        createdAt: c.createdAt,
        lastMessageAt: c.lastMessageAt || c.createdAt
      }))
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

    res.json({ conversations: list });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve conversations.' });
  }
});

// GET CONVERSATION BY ID
router.get('/conversations/:id', authenticateToken, (req, res) => {
  try {
    const conv = db.collection('ai_conversations').findOne({ id: req.params.id, userId: req.user.id });
    if (!conv) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }
    res.json({ conversation: conv });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load conversation.' });
  }
});

// DELETE CONVERSATION
router.delete('/conversations/:id', authenticateToken, (req, res) => {
  try {
    const success = db.collection('ai_conversations').delete(req.params.id);
    res.json({ success, message: 'Conversation deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete conversation.' });
  }
});

// QUICK EXPLAIN IN SIMPLE LANGUAGE
router.post('/explain-simple', authenticateToken, async (req, res) => {
  try {
    const { topic, subject = 'General', language = 'en' } = req.body;
    const prompt = `Explain the following topic like I am 12 years old, using a simple real-world analogy: "${topic}".`;

    const result = await AIService.generateChatResponse({
      prompt,
      subject,
      language,
      learningLevel: 'beginner'
    });

    res.json({ explanation: result.reply });
  } catch (err) {
    res.status(500).json({ message: 'Error generating simple explanation.' });
  }
});

export default router;
