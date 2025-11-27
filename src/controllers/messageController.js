import { getMessagesService } from '../services/message.service.js';
import { StatusCodes } from 'http-status-codes';
import {
  InternalServerErrorResponse,
  successResponse,
  customErrorResponse
} from '../utils/common/responseObjects.js';
export const getMessagesController = async (req, res) => {
  try {
    if (req.query.channelId) {
      throw new ClientError({
        message: 'Channel ID and Workspace ID are required',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
    const messages = await getMessagesService(
      {
        channelId: req.params.channelId
      },
      req.query.page || 1,
      req.query.limit || 10,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, 'Messages fetched successfully'));
  } catch (error) {
    console.log('error in get messages controller', error);
    if (error.StatusCode) {
      return res.status(error.StatusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(InternalServerErrorResponse(error));
  }
};

export default getMessagesController;
