import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/serverConfig.js';
import userRepository from '../repositories/userRepository.js';
import {
  customErrorResponse,
  InternalServerErrorResponse
} from '../utils/common/responseObjects.js';
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new Error('Authorization header missing or malformed'));
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent from the client',
          message: 'No auth token provided'
        })
      );
    }
    const response = jwt.verify(token, JWT_SECRET);

    if (!response) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent from the client',
          message: 'Invalid auth token provided'
        })
      );
    }

    const user = await userRepository.getById(response.id);
    req.user = user.id;
    next();
  } catch (error) {
    console.log('auth middleware error', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent from the client',
          message: 'Invalid auth token provided'
        })
      );
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(InternalServerErrorResponse(error));
  }
};
