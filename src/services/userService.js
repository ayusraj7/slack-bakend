import userRepository from '../repositories/userRepository.js';
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

      throw new ValidationError(
        { error: [message] },
        message
      );
    }

    // Re-throw any unhandled errors
    throw error;
  }
};

