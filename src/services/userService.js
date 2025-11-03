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

    // Handle duplicate key (email/username) errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        { error: ['A user with the same email or username already exists'] },
        'Duplicate user entry'
      );
    }

    // Re-throw any unhandled errors
    throw error;
  }
};
