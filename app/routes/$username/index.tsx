import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import invariant from "tiny-invariant";
import Gallery from "~/components/gallery";
import { getFeaturedCollectibles } from "~/models/collectible_user.server";
import { getUserByUsername } from "~/models/user.server";
import type { FilterContextType } from "../$username";

export async function loader({ params }: LoaderArgs) {
  invariant(params.username, "username is required");

  const username = params.username;

  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  const collectibles = await getFeaturedCollectibles(user.id);

  return json({ collectibles, username });
}

export default function ProfilePage() {
  const data = useLoaderData<typeof loader>();

  const { setHideFilter } = useOutletContext<FilterContextType>();
  setHideFilter(true);

  return <Gallery collectibles={data.collectibles} username={data.username} />;
}
