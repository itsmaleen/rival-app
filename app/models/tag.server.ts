import type { Collectible, Tag, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Tag } from "@prisma/client";

type TagCategory = {
  tag: String;
  category: String;
};

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

export async function getUniqueTagsByCollector(ownerId: User["id"]) {
  return prisma.$queryRaw<TagCategory[]>`SELECT 
  distinct t.name as tag, c.name as category from collectibles 
  inner join tags t on collectibles.id = t."collectibleId" 
  inner join categories c on c.id = t."categoryId" 
  where "ownerId" = ${ownerId}`;
}
