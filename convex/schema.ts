import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@convex-dev/auth/server';
import { v } from 'convex/values';

const applicationTables = {
  rooms: defineTable({
    name: v.optional(v.string()),
    uuid: v.string(),
    createdAt: v.number(),
  }).index('by_uuid', ['uuid']),

  messages: defineTable({
    roomId: v.id('rooms'),
    type: v.union(v.literal('text'), v.literal('image'), v.literal('file')),
    content: v.string(),
    fileName: v.optional(v.string()),
    fileId: v.optional(v.id('_storage')),
    sender: v.string(),
    createdAt: v.number(),
  })
    .index('by_room', ['roomId'])
    .index('by_creation_for_cleanup', ['createdAt']),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
