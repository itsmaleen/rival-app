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

// Get api key for env
const APP_ID = process.env.EBAY_CLIENT_ID;
// X-Api-Key header for fetch requests
const headers = new Headers();
headers.append("X-EBAY-SOA-RESPONSE-DATA-FORMAT", "JSON");
if (APP_ID) {
  headers.append("X-EBAY-SOA-SECURITY-APPNAME", APP_ID);
}

export async function findItemsByKeywords(keywords: string) {
  const url = new URL(
    "https://svcs.ebay.com/services/search/FindingService/v1"
  );
  url.searchParams.set("OPERATION-NAME", "findItemsByKeywords");
  url.searchParams.set("keywords", keywords);
  url.searchParams.set("outputSelector", "PictureURLSuperSize");

  const response = await fetch(url.toString(), {
    headers,
  });
  const data = await response.json();

  return data;
}
