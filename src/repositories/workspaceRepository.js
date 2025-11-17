import { StatusCodes } from 'http-status-codes';

import User from '../schema/user.js';
import workspace from '../schema/workspace.js';
import ClientError from '../utils/errors/ClientError.js';
import channelRepository from './channelRepository.js';
import crudRepository from './crudRepository.js';

const workspaceRepository = {
  ...crudRepository(workspace),
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
    const workspace = await workspace.findById(workspaceId);
    if (!workspace) {
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

    const isMemberAlreadyPartyOfWorkspace = workspace.members.find(
      (member) => member.memberId === memberId
    );
    if (isMemberAlreadyPartyOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'User is already a member of this workspace.',
        statusCode: StatusCodes.FORBIDDEN
      });
    }
    workspace.members.push({ memberId, role });
    await workspace.save();
    return workspace;
  },
  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspace = await workspace
      .findById(workspaceId)
      .populate('channels');
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
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
      name: channelName
    });

    workspace.channels.push(channel);
    await workspace.save();
    return workspace;
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
