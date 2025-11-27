import express from 'express';

const router = express.Router();
import { isAuthenticated } from '../../middleware/authMiddleware.js';
import getMessagesController from '../../controllers/messageController.js';

router.get('/:channelId', isAuthenticated, getMessagesController);

export default router;
