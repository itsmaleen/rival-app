import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Collectible } from "@prisma/client";

export function getCollectibles(ownerId: User["id"]) {
  return prisma.collectible.findMany({
    include: {
      tags: true,
    },
    where: {
      ownerId,
    },
  });
}

export function getCollectibleCounts(ownerId: User["id"]) {
  return prisma.collectible.count({
    where: {
      ownerId,
    },
  });
}
