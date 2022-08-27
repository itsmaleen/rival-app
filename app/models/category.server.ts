import type { Category, Tag } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Category } from "@prisma/client";

export async function getCategoriesByIds(ids: Category["id"][]) {
  return prisma.category.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}
