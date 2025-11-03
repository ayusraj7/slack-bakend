import { StatusCodes } from 'http-status-codes';

class ValidationError extends Error {
  constructor(errorDetails, message) {
    super(message);
    this.name = 'ValidationError';
    let explanatoin = [];
    Object.keys(errorDetails.error).forEach((key) => {
      explanatoin.push(errorDetails.error[key]);
    });
    this.explanation = this.explanatoin;
    this.message = message;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default ValidationError;
