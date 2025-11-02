import express from 'express';
import { createNote, deleteNote, getNoteById, getNotes, updateNote } from "../controllers/notes.controller.js";
import { verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();


router.use(verifyToken);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:noteId', getNoteById);

router.put('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

export default router;