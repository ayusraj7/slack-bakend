import workspaceRepository from '../repositories/workspaceRepository.js';
import { isUserMemberOfWorkspace } from './workspace.service.js';
import userRepository from '../repositories/userRepository.js';

export const isMemberPartOfWorkspaceService = async (workspaceId, memberId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Workspace not found',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isUserAMember = isUserMemberOfWorkspace(workspace, memberId);
    if (!isUserAMember) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const user = await userRepository.getById(memberId);
    if (!user) {
      throw new ClientError({
        explanation: 'User not found',
        message: 'User not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return user;
  } catch (error) {
    console.log('error in isMemberPartOfWorkspaceService', error);
    throw error;
  }
};
