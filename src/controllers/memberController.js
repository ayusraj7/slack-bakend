import { isMemberPartOfWorkspaceService } from '../services/member.sevice.js';

import { StatusCodes } from 'http-status-codes';
import { successResponse } from '../utils/common/responseObjects.js';
import {
  InternalServerErrorResponse,
  customErrorResponse
} from '../utils/common/responseObjects.js';
export const isMemberPartOfWorkspaceController = async (req, res) => {
  try {
    const response = await isMemberPartOfWorkspaceService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Member is part of workspace'));
  } catch (error) {
    console.log('error in isMemberPartOfWorkspaceController', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(InternalServerErrorResponse(error));
  }
};
