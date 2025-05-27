import type { EventRelationResolvers, QueryResolvers } from "types/graphql";

import { UserInputError } from "@redwoodjs/graphql-server";

import { db } from "src/lib/db";

export const events: QueryResolvers['events'] = () => {
  return db.event.findMany()
}

export const event: QueryResolvers['event'] = async ({ id }) => {
  const event = await db.event.findUnique({
    where: { id },
  })
  if (event != null) {
    return event
  }
  throw new UserInputError("kein Event gefunden", { id });
}

export const currentEvent: QueryResolvers["findCurrentEvent"] = async () => {
  console.log(new Date(new Date().getFullYear(), 0, 1));
  return db.event.findFirst({
    where: {
      gte: new Date(new Date().getFullYear(), 0, 1)
    }
  });
};

export const Event: EventRelationResolvers = {
  Participation: (_obj, { root }) => {
    return db.event.findUnique({ where: { id: root?.id } }).Participation()
  },
}
