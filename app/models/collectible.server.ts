import type { User, Collectible } from "@prisma/client";

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
