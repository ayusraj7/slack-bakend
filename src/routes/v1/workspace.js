import express from 'express';

import {
  createWorkspaceController,
  deleteWorkSpaceController,
  getWorkspacesUserIsMemberOfController} from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middleware/authMiddleware.js';
import { createWorkspaceSchema } from '../../validation/workspaceSchema.js';
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

export default router;
