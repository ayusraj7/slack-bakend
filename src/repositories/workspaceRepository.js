import { StatusCodes } from 'http-status-codes';

import User from '../schema/user.js';
import workspace from '../schema/workspace.js';
import ClientError from '../utils/errors/ClientError.js';
import channelRepository from './channelRepository.js';
import crudRepository from './crudRepository.js';

const workspaceRepository = {
  ...crudRepository(workspace),
  getWorkspaceDetailsById: async function (workspaceId) {
    const workspaceData = await workspace
      .findById(workspaceId)
      .populate('members.memberId', 'username email avatar')
      .populate('channels');
    return workspaceData;
  },
  getWorkspaceByName: async function (name) {
    const workspaceData = await workspace.findOne({
      name: name
    });
    if (!workspaceData) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'No workspace found with this name',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return workspaceData;
  },
  getWorkspaceByJoinCode: async function (joinCode) {
    const workspaceData = await workspace.findOne({
      joinCode: joinCode
    });
    if (!workspaceData) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return workspaceData;
  },
  addMemberToWorkspace: async function (workspaceId, memberId, role) {
    const workspaceData = await workspace.findById(workspaceId);
    if (!workspaceData) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isValidUser = await User.findById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMemberAlreadyPartyOfWorkspace = workspaceData.members.find(
      (member) => member.memberId === memberId
    );
    if (isMemberAlreadyPartyOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User is already a member of this workspace.',
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    workspaceData.members.push({ memberId, role });
    await workspaceData.save();
    return workspaceData;
  },
  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspaceData = await workspace
      .findById(workspaceId)
      .populate('channels');
    if (!workspaceData) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isChannelAlreadyPartOfWorkspace = workspaceData.channels.find(
      (channel) => channel.name === channelName
    );
    if (isChannelAlreadyPartOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Channel already part of workspace.',
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    //create new channel
    const channel = await channelRepository.create({
      name: channelName,
      workspaceId: workspaceId
    });

    workspaceData.channels.push(channel);
    await workspaceData.save();
    return workspaceData;
  },
  fetchAllWorkspaceByMemberId: async function (memberId) {
    const workspaces = await workspace
      .find({
        'members.memberId': memberId
      })
      .populate('members.memberId', 'username email avatar');
    return workspaces;
  }
};

export default workspaceRepository;
