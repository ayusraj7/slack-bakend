export const InternalServerErrorResponse = (error) => {
  return {
    success: false,
    err: error,
    data: {},
    message: 'Internal Server error'
  };
};

export const customErrorResponse = (error) => {
  if (!error.message && !error.explanation) {
    return InternalServerErrorResponse(error);
  }
  return {
    success: false,
    err: error.explanation,
    data: {},
    message: error.message
  };
};

export const successResponse = (data, message) => {
  return {
    success: true,
    message,
    data,
    err: {}
  };
};
