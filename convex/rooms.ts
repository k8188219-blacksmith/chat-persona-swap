import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { internal } from './_generated/api';

export const createRoom = mutation({
  args: {
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const uuid = crypto.randomUUID();
    const roomId = await ctx.db.insert('rooms', {
      name: args.name,
      uuid,
      createdAt: Date.now(),
    });
    return { roomId, uuid };
  },
});

export const getRoom = query({
  args: { uuid: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query('rooms')
      .withIndex('by_uuid', (q) => q.eq('uuid', args.uuid))
      .unique();
    return room;
  },
});

export const getRoomById = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const getRoomMessages = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .order('desc')
      .collect();

    return Promise.all(
      messages.map(async (message) => ({
        ...message,
        url: message.fileId
          ? await ctx.storage.getUrl(message.fileId)
          : undefined,
      })),
    );
  },
});
