import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getAllCollectibles } from "~/models/collectible.server";
import { getUserByUsername } from "~/models/user.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.username, "username is required");

  const username = params.username;

  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  const collectibles = await getAllCollectibles(user.id);

  return json({ collectibles, username });
}

export default function Collection() {
  const data = useLoaderData<typeof loader>();
  const { collectibles, username } = data;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {collectibles.map((collectible) => (
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
              <p className="truncate text-sm text-gray-500">
                {collectible.description}
              </p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
