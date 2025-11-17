import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import userRepository from '../repositories/userRepository.js';
import { createJWT } from '../utils/common/authUtils.js';
import ClientError from '../utils/errors/ClientError.js';
import ValidationError from '../utils/errors/validationError.js';

export const signupService = async (data) => {
  try {
    const newUser = await userRepository.create(data);
    return newUser;
  } catch (error) {
    console.error('User service error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        { error: Object.values(error.errors).map((err) => err.message) },
        'Invalid user input'
      );
    }

    // Handle duplicate key (email/username) errors specifically
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // Extract which field caused the duplication (e.g., email or username)
      const duplicateField = Object.keys(error.keyPattern || {})[0];

      let message = 'Duplicate user entry';
      if (duplicateField === 'email') {
        message = 'Email already exists';
      } else if (duplicateField === 'username') {
        message = 'Username already exists';
      }

      throw new ValidationError({ error: [message] }, message);
    }

    // Re-throw any unhandled errors
    throw error;
  }
};

export const signInService = async (data) => {
  try {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'No registered user found with this email',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    // match the incoming password with the hashed password
    const isMatch = await bcrypt.compareSync(data.password, user.password);
    if (!isMatch) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Incorrect password',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
    return {
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      id: user._id,
      token: createJWT({ id: user._id, email: user.email })
    };
  } catch (error) {
    console.log('User service error', error);
    throw error;
  }
};
