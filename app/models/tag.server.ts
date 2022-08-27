import type { Collectible, Tag } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Tag } from "@prisma/client";

export async function getTagsByCollectibleId(collectibleId: Collectible["id"]) {
  return prisma.tag.findMany({
    include: {
      category: true,
    },
    where: {
      collectibleId,
    },
  });
}
