import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import ClientError from '../utils/errors/ClientError.js';
import { isUserMemberOfWorkspace } from './workspace.service.js';

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelwithWorkspaceDetails(channelId);
    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        message: 'Channel not found with provided Id',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isUserPartOfWorkspace = isUserMemberOfWorkspace(
      channel.workspaceId,
      userId
    );
    if (!isUserPartOfWorkspace) {
      throw new ClientError({
        message: 'User is not part of the workspace',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return channel;
  } catch (error) {
    console.log('error in getChannelId service', error);
    throw error;
  }
};
