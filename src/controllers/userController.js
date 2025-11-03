import { StatusCodes } from 'http-status-codes';

import { signupService } from '../services/userService.js';
import {
  customErrorResponse,
  InternalServerErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export const signUp = async (req, res) => {
  try {
    const user = await signupService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(user, 'User created Successfully'));
  } catch (error) {
    console.log('User controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(InternalServerErrorResponse(error));
  }
};
