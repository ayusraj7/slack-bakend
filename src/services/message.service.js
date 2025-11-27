import channelRepository from '../repositories/channelRepository.js';
import messageRepository from '../repositories/messageRepository.js';
import { isUserMemberOfWorkspace } from './workspace.service.js';

import ClientError from '../utils/errors/ClientError.js';

export const getMessagesService = async (
  userId,
  messageParams,
  page,
  limit
) => {
  try {
    const channelDetails =
      await channelRepository.getChannelwithWorkspaceDetails(
        messageParams.channelId
      );
    const workspace = channelDetails.workspaceId;

    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new ClientError({
        message: 'User is not part of the workspace',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const messages = await messageRepository.getPaginatedMessages(
      messageParams,
      page,
      limit
    );
    return messages;
  } catch (error) {
    console.log('error in get messages service', error);
    throw error;
  }
};

// client ----> server
// <--------- server
// in all these someone has to initiate the request
// like in chat's app we use websocket (full duplex communication)
// in this we make a main server which will handle the communication between the client and the server.
// and we will use the websocket to send and receive the messages.
// server broadcasts the message to all the clients who are connected to the server.

export const createMessageService = async (message) => {
  try {
    const response = await messageRepository.create(message);
    return response;
  } catch (error) {
    console.log('error in create message service', error);
    throw error;
  }
};
