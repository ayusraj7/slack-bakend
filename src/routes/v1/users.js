import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { signUp } from '../../controllers/userController.js';
import { validate } from '../../validation/zodValidator.js';
import { userSignupSchema } from '../../validation/userSchema.js';

const router = express.Router();

router.post('/signup',validate(userSignupSchema), signUp);

router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Users fetched successfully'
  });
});

export default router;
