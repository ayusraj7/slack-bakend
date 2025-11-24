import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Workspace name is required' })
    .max(50, { message: 'Workspace name must be at most 50 characters long' }),
  description: z.string().optional()
});

export const addMemberToWorkspaceSchema = z.object({
  memberId: z.string().min(1, { message: 'Member Id is required' })
});

export const addChannelToWorkspaceSchema = z.object({
  channelName: z.string().min(1, { message: 'Channel Name is required' })
});
