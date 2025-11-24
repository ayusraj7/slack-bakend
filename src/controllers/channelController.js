import { StatusCodes } from 'http-status-codes';

import { getChannelByIdService } from '../services/channel.service.js';
import {
  customErrorResponse,
  InternalServerErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export const getChannelByIdController = async (req, res) => {
  try {
    const response = await getChannelByIdService(
      req.params.channelId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Channel fetched successfully'));
  } catch (error) {
    console.log('error in getChannelByIdController', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(InternalServerErrorResponse(error));
  }
};
