import { StatusCodes } from 'http-status-codes';
import { v4 as uuidV4 } from 'uuid';

import { addEmailToMailQueue } from '../producer/mailQueueProducer.js';
import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import { workspaceJoinMail } from '../utils/common/mailObject.js';
import ClientError from '../utils/errors/ClientError.js';
import ValidationError from '../utils/errors/validationError.js';

export const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
  return workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
  );
};

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

export const isUserAdminOfWorkspace = (workspace, userId) => {
  const isAdmin = workspace.members.find((item) => {
    const memberId =
      typeof item.memberId === 'object'
        ? item.memberId._id.toString()
        : item.memberId.toString();

    return memberId === userId && item.role === 'admin';
  });

  return Boolean(isAdmin);
};

export const isUserMemberOfWorkspace = (workspace, userId) => {
  const isUser = workspace.members.find(
    (member) => member.memberId._id.toString() === userId
  );

  return Boolean(isUser);
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
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    // const channelIds = workspace.channels.map(channel => channel._id);
    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channels);
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

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const response = await workspaceRepository.getById(workspaceId);
    if (!response) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAllowed = isUserMemberOfWorkspace(response, userId);
    if (!isAllowed) {
      throw new ClientError({
        explanation:
          'User is either not a member or an admin for the workspace',
        message: 'User is not authorized to view this workspace.',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return response;
  } catch (error) {
    console.log('get workspace service error', error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const response = await workspaceRepository.getWorkspaceByJoinCode(joinCode);
    if (!response) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorkspace(response, userId);
    if (!isMember) {
      throw new ClientError({
        explanation:
          'User is either not a member or an admin for the workspace',
        message: 'User is not authorized to view this workspace.',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return response;
  } catch (error) {
    console.log('get workspace by join code service error', error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation:
          'User is either not a member or an admin for the workspace',
        message: 'User is not authorized to update this workspace.',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const response = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );
    return response;
  } catch (error) {
    console.log('update workspace service error', error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is already a member of the workspace',
        message: 'User is not the admin of workspace.',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const isMember = isUserMemberOfWorkspace(workspace, memberId);
    if (isMember) {
      throw new ClientError({
        explanation: 'User is already a member of the workspace',
        message: 'User is already a member of the workspace.',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isValidUser = await userRepository.getById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );

    addEmailToMailQueue({
      ...workspaceJoinMail(workspace),
      to: isValidUser.email
    });
    return response;
  } catch (error) {
    console.log('add member to workspace service error', error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is either not a admin for the workspace',
        message: 'User is not authorized to add channel to this workspace.',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const ischannelalreadypartofworkspace = isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );
    if (ischannelalreadypartofworkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Channel with same name already exists in this workspace.',
        statusCode: StatusCodes.CONFLICT
      });
    }
    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return response;
  } catch (error) {
    console.log('add channel to workspace service error', error);
    throw error;
  }
};
