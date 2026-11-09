import express from 'express';
import { db } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';

const router = express.Router();

// GET ALL FLASHCARD DECKS
router.get('/decks', authenticateToken, (req, res) => {
  try {
    const decks = db
      .collection('flashcard_decks')
      .find(d => d.userId === req.user.id || d.isPublic === true);

    const decksWithCount = decks.map(d => {
      const cardCount = db.collection('flashcards').find({ deckId: d.id }).length;
      return { ...d, cardCount };
    });

    res.json({ decks: decksWithCount });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving flashcard decks.' });
  }
});

// CREATE FLASHCARD DECK
router.post('/decks', authenticateToken, (req, res) => {
  try {
    const { title, subject, description, isPublic = false } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Deck title is required.' });
    }

    const newDeck = db.collection('flashcard_decks').insert({
      userId: req.user.id,
      title: title.trim(),
      subject: subject || 'General',
      description: description || '',
      isPublic: Boolean(isPublic)
    });

    res.status(201).json({ deck: newDeck });
  } catch (err) {
    res.status(500).json({ message: 'Error creating deck.' });
  }
});

// GET DECK WITH CARDS
router.get('/decks/:deckId', authenticateToken, (req, res) => {
  try {
    const deck = db.collection('flashcard_decks').findById(req.params.deckId);
    if (!deck) {
      return res.status(404).json({ message: 'Flashcard deck not found.' });
    }

    const cards = db.collection('flashcards').find({ deckId: deck.id });
    res.json({ deck, cards });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deck cards.' });
  }
});

// ADD CARD TO DECK
router.post('/decks/:deckId/cards', authenticateToken, (req, res) => {
  try {
    const { front, back, difficulty = 'medium' } = req.body;

    if (!front || !back) {
      return res.status(400).json({ message: 'Front and back card content are required.' });
    }

    const newCard = db.collection('flashcards').insert({
      deckId: req.params.deckId,
      front: front.trim(),
      back: back.trim(),
      difficulty,
      isFavorite: false
    });

    res.status(201).json({ card: newCard });
  } catch (err) {
    res.status(500).json({ message: 'Error adding card.' });
  }
});

// UPDATE CARD (FAVORITE / DIFFICULTY)
router.put('/cards/:cardId', authenticateToken, (req, res) => {
  try {
    const { isFavorite, difficulty, front, back } = req.body;
    const updates = {};
    if (isFavorite !== undefined) updates.isFavorite = Boolean(isFavorite);
    if (difficulty) updates.difficulty = difficulty;
    if (front) updates.front = front;
    if (back) updates.back = back;

    const updated = db.collection('flashcards').update(req.params.cardId, updates);
    res.json({ card: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating card.' });
  }
});

// DELETE CARD
router.delete('/cards/:cardId', authenticateToken, (req, res) => {
  try {
    const success = db.collection('flashcards').delete(req.params.cardId);
    res.json({ success, message: 'Flashcard deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting card.' });
  }
});

// AI GENERATE FLASHCARDS
router.post('/decks/:deckId/generate-ai', authenticateToken, async (req, res) => {
  try {
    const { topic, count = 5 } = req.body;
    const deck = db.collection('flashcard_decks').findById(req.params.deckId);

    if (!deck) {
      return res.status(404).json({ message: 'Deck not found.' });
    }

    const generated = await AIService.generateFlashcards({
      topic: topic || deck.title,
      subject: deck.subject,
      count: Number(count) || 5
    });

    const insertedCards = generated.map(c =>
      db.collection('flashcards').insert({
        deckId: deck.id,
        front: c.front,
        back: c.back,
        difficulty: c.difficulty || 'medium',
        isFavorite: false
      })
    );

    res.json({
      message: `${insertedCards.length} AI flashcards generated!`,
      cards: insertedCards
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating AI flashcards.' });
  }
});

export default router;
