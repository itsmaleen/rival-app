import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Post from "~/components/feed/post";
import { findItemsByKeywords } from "~/models/ebay.server";
import { getUsersWithCollectiblesCount } from "~/models/user.server";
import type { Item } from "~/utils/types";

const colors = [
  "#B0AC93",
  "#8E8CFC",
  "#205B4D",
  "#00B3FF",
  "#FFDBEC",
  "#367AFF",
];

export async function loader() {
  const users = await getUsersWithCollectiblesCount();
  const ebayItemsResponse = await findItemsByKeywords("pokemon card");

  const ebayFeed =
    ebayItemsResponse.findItemsByKeywordsResponse[0].searchResult[0].item;

  return json({ users, ebayFeed });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const { ebayFeed } = data;
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl py-16">
        <ul role="list" className="divide-y divide-gray-200">
          {ebayFeed.map((item: any, index: number) => (
            <Post
              itemId={item.itemId[0]}
              title={item.title[0]}
              pictureURLSuperSize={
                item.pictureURLSuperSize?.[0] || item.galleryURL?.[0]
              }
              key={index}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
