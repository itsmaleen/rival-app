import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useOutletContext } from "@remix-run/react";
import invariant from "tiny-invariant";
import Card from "~/components/card";
import type { CollectibleUser } from "~/models/collectible_user.server";
import { getAllCollectiblesWithTags } from "~/models/collectible_user.server";
import type { Tag } from "~/models/tag.server";
import { getUserByUsername } from "~/models/user.server";
import type { FilterContextType } from "../../$username";

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.username, "username is required");

  const username = params.username;

  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  const url = new URL(request.url);
  const tags = url.searchParams.getAll("filter");

  let collectibles: (CollectibleUser & { tags: Tag[] })[];
  const allCollectibles = await getAllCollectiblesWithTags(user.id);

  if (tags && tags.length > 0) {
    collectibles = allCollectibles.filter((collectible) => {
      const collectibleTags = collectible.tags.map((tag) => tag.name);
      return tags.some((tag) => {
        return collectibleTags.includes(tag);
      });
    });
  } else {
    collectibles = allCollectibles;
  }

  return json({ collectibles, username, tags });
}

export default function Collection() {
  const data = useLoaderData<typeof loader>();
  const { setHideFilter, activeViewOption } =
    useOutletContext<FilterContextType>();
  setHideFilter(false);

  const { collectibles, username } = data;
  return (
    <div
      className={`grid ${
        activeViewOption === "GRID"
          ? "grid-cols-1 gap-4 sm:grid-cols-3"
          : "grid-cols-2 gap-x-1 gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-4"
      }`}
    >
      {collectibles.map((collectible) =>
        activeViewOption === "GRID" ? (
          <div
            key={collectible.id}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="flex-shrink-0">
              <img
                className="h-12 rounded-sm"
                src={collectible.imageUrl}
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                to={`/${username}/collection/${collectible.id}`}
                className="focus:outline-none"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  {collectible.name}
                </p>
                {collectible.description &&
                  collectible.description.split(/\n|\\n/).map((line, idx) => (
                    <p key={idx} className="text-sm text-gray-500">
                      {line}
                    </p>
                  ))}
              </Link>
            </div>
          </div>
        ) : (
          <Card
            key={collectible.id}
            id={collectible.id}
            src={collectible.imageUrl}
            name={collectible.name}
            grade={collectible.grade}
            description={collectible.description}
            username={username}
          />
        )
      )}
    </div>
  );
}
