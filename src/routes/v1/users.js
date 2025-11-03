import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { signUp } from '../../controllers/userController.js';

const router = express.Router();

router.post('/signup', signUp);

router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Users fetched successfully'
  });
});

export default router;
