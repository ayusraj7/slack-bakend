import express from 'express';

import {
  addChannelToWorkspaceController,
  addMemeberToWorkspaceController,
  createWorkspaceController,
  deleteWorkSpaceController,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  getWorkspacesUserIsMemberOfController,
  updateWorkspaceController
} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middleware/authMiddleware.js';
import {
  addChannelToWorkspaceSchema,
  addMemberToWorkspaceSchema,
  createWorkspaceSchema
} from '../../validation/workspaceSchema.js';
import { validate } from '../../validation/zodValidator.js';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  validate(createWorkspaceSchema),
  createWorkspaceController
);
router.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);
router.delete('/:workspaceId', isAuthenticated, deleteWorkSpaceController);
router.get('/:workspaceId', isAuthenticated, getWorkspaceController);
router.get(
  '/join/:joinCode',
  isAuthenticated,
  getWorkspaceByJoinCodeController
);
router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);
router.put(
  '/:workspaceId/members',
  isAuthenticated,
  validate(addMemberToWorkspaceSchema),
  addMemeberToWorkspaceController
);
router.put(
  '/:workspaceId/channel',
  isAuthenticated,
  validate(addChannelToWorkspaceSchema),
  addChannelToWorkspaceController
);

export default router;
