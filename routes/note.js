import express from 'express';
import mongoose from 'mongoose';
import Note from '../models/Note.js';
import middleware from '../middleware/middleware.js'; // JWT auth

const router = express.Router();

/**
 * Helper: validate Mongo ObjectId
 */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * CREATE note
 * POST /api/note/add
 * Body: { title, description? }
 */
router.post('/add', middleware, async (req, res) => {
  try {
    let { title = '', description = '' } = req.body;
    title = title.trim();
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title required.' });
    }

    const newNote = await Note.create({
      title,
      description,
      userId: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: 'Note created successfully.',
      note: newNote
    });
  } catch (error) {
    console.error('Add note error:', error);
    return res.status(500).json({ success: false, message: 'Error adding note.' });
  }
});

/**
 * READ all notes for logged in user
 * GET /api/note
 */
router.get('/', middleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error('Get notes error:', error);
    return res.status(500).json({ success: false, message: "Can't retrieve notes." });
  }
});

/**
 * UPDATE note
 * PUT /api/note/:id
 * Body: { title?, description? }
 */
router.put('/:id', middleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid note ID.' });
    }

    const update = {};
    if (typeof req.body.title === 'string') {
      const trimmed = req.body.title.trim();
      if (!trimmed) {
        return res.status(400).json({ success: false, message: 'Title cannot be empty.' });
      }
      update.title = trimmed;
    }
    if (typeof req.body.description === 'string') {
      update.description = req.body.description;
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      update,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Note updated.',
      note: updatedNote
    });
  } catch (error) {
    console.error('Update note error:', error);
    return res.status(500).json({ success: false, message: "Can't update note." });
  }
});

/**
 * DELETE note
 * DELETE /api/note/:id
 */
router.delete('/:id', middleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid note ID.' });
    }

    const deletedNote = await Note.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedNote) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Note deleted.',
      note: deletedNote
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return res.status(500).json({ success: false, message: "Can't delete note." });
  }
});

export default router;
