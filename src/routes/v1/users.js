import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { signIn, signUp } from '../../controllers/userController.js';
import {
  userSignInSchema,
  userSignupSchema
} from '../../validation/userSchema.js';
import { validate } from '../../validation/zodValidator.js';

const router = express.Router();

router.post('/signup', validate(userSignupSchema), signUp);
router.post('/signin', validate(userSignInSchema), signIn);
router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Users fetched successfully'
  });
});

export default router;
