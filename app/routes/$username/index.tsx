import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Gallery from "~/components/gallery";
import { getCategoriesByIds } from "~/models/category.server";
import { getCollectibles } from "~/models/collectible.server";
import { getUserByUsername } from "~/models/user.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.username, "username is required");

  const username = params.username;

  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  const collectibles = await getCollectibles(user.id);

  return json({ collectibles });
}

export default function ProfilePage() {
  const data = useLoaderData<typeof loader>();

  return <Gallery collectibles={data.collectibles} />;
}
