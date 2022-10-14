import { prisma } from "~/db.server";
import type { User } from "@prisma/client";

export async function getRefreshToken(userId: User["id"]) {
  return prisma.ebayRefreshToken.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function saveRefreshToken(
  userId: User["id"],
  token: string,
  expiresIn: number
) {
  // create datetime by adding now + expiresIn (in seconds)
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

  return prisma.ebayRefreshToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
}
