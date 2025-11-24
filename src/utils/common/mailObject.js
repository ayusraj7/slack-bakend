import { EMAIL_ID } from '../../config/serverConfig.js';

export default {
  from: EMAIL_ID
};

export const workspaceJoinMail = (workspace) => {
  return {
    from: EMAIL_ID,
    subject: 'You are added to a workspace',
    text: `Congratulations! You have been added to the workspace ${workspace.name}`
  };
};
