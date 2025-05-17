import { v } from 'convex/values';
import { mutation, action, internalMutation } from './_generated/server';
import { internal } from './_generated/api';

export const sendMessage = mutation({
  args: {
    roomId: v.id('rooms'),
    content: v.string(),
    sender: v.string(),
    type: v.union(v.literal('text'), v.literal('image'), v.literal('file')),
    fileName: v.optional(v.string()),
    fileId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const deleteOldMessages = internalMutation({
  handler: async (ctx) => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const oldMessages = await ctx.db
      .query('messages')
      .withIndex('by_creation_for_cleanup', (q) =>
        q.lt('createdAt', oneHourAgo),
      )
      .collect();

    for (const message of oldMessages) {
      if (message.fileId) {
        await ctx.storage.delete(message.fileId);
      }
      await ctx.db.delete(message._id);
    }
  },
});
