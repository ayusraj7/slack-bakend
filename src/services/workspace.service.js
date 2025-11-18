import { StatusCodes } from 'http-status-codes';
import { v4 as uuidV4 } from 'uuid';

import channelRepository from '../repositories/channelRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import ClientError from '../utils/errors/ClientError.js';
import ValidationError from '../utils/errors/ValidationError.js';

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidV4().substring(0, 6).toUpperCase();

    const response = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });

    //there should be some basic channel in the workspace when we create it.
    // also who created the workspace should be added as a admin of it.

    await workspaceRepository.addMemberToWorkspace(
      response._id,
      workspaceData.owner,
      'admin'
    );
    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      response._id,
      'general'
    );

    return updatedWorkspace;
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        {
          error: ['A workspace with same details already exists']
        },
        'A workspace with same details already exists'
      );
    }
    console.log('create workspace service error', error.code);
    throw error;
  }
};

export const getWorkspacesUserIsMemberOfService = async (userId) => {
  try {
    const response =
      await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
    return response;
  } catch (error) {
    console.log('get workspaces user is member of service error', error);
    throw error;
  }
};

export const deleteworkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAllowed = workspace.members.find(
      (member) => member.memberId.toString() === userId && member.role === 'admin'
    );
    // const channelIds = workspace.channels.map(channel => channel._id);
    if (isAllowed) {
      await channelRepository.deleteMany(
        workspace.channels
      );
      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }
    throw new ClientError({
      explanation: 'User is either not a member or an admin for the workspace',
      message: 'User is not authorized to delete this workspace.',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  } catch (error) {
    console.log('delete workspace service error', error);
    throw error;
  }
};
