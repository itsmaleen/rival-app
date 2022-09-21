import type { Collectible, Tag, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Tag } from "@prisma/client";

// const SET_SERIES_CATEGORY = 4;
const SET_NAME_CATEGORY = 5;

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
  distinct t.name as tag, c.name as category from collectible_user
  inner join collectibles on collectible_user."collectibleId" = collectibles.id
  inner join tags t on collectible_user.id = t."collectibleUserId" or collectibles.id = t."collectibleId"
  inner join categories c on c.id = t."categoryId"
  where "ownerId" = ${ownerId}`;
}

export async function getUniqueTagsFromUserSetName(ownerId: User["id"]) {
  return prisma.$queryRaw<TagCategory[]>`SELECT 
  distinct t.name as tag, c.name as category from collectible_user
  inner join collectibles on collectible_user."collectibleId" = collectibles.id
  inner join tags t on collectible_user.id = t."collectibleUserId" or collectibles.id = t."collectibleId"
  inner join categories c on c.id = t."categoryId"
  where "ownerId" = ${ownerId} and c.id = ${SET_NAME_CATEGORY}`;
}

// TODO: Move to collectibles model and FIX IT to use collectible_user
export async function getCollectibleFromUserBySetName(
  ownerId: User["id"],
  setName: string
) {
  return prisma.collectibleUser.findMany({
    include: {
      tags: true,
    },
    where: {
      ownerId,
      wishlist: false,
      tags: {
        some: {
          name: setName,
          categoryId: SET_NAME_CATEGORY,
        },
      },
    },
  });
}
