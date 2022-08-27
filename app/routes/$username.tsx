import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Gallery from "~/components/gallery";
import Profile from "~/components/profile";
import { getCategoriesByIds } from "~/models/category.server";
import { getCollectibles } from "~/models/collectible.server";
import { getUserByUsername } from "~/models/user.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.username, "username is required");

  const user = await getUserByUsername(params.username);
  if (!user) {
    throw new Error(`User ${params.username} not found`);
  }

  const collectibles = await getCollectibles(user.id);

  //   Get unique category ids from array of collectibles. Collectible has array of tags.
  let categoryIds: number[] = [];
  collectibles.forEach((collectible) => {
    collectible.tags.forEach((tag) => {
      if (!categoryIds.includes(tag.id)) {
        categoryIds.push(tag.id);
      }
    });
  });

  const categories = await getCategoriesByIds(categoryIds);

  // Create filters using categories name and collectible tags.
  let filters: any[] = [];
  categories.forEach((category) => {
    let options: any[] = [];
    collectibles.forEach((collectible) => {
      collectible.tags.forEach((tag) => {
        if (
          tag.categoryId === category.id &&
          !options.some((option) => option.label === tag.name)
        ) {
          options.push({
            value: tag.id,
            label: tag.name,
            checked: true,
          });
        }
      });
    });
    filters.push({
      id: category.id,
      name: category.name,
      options: options,
    });
  });

  return json({ user, collectibles, categories, filters });
}

export default function ProfilePage() {
  const data = useLoaderData<typeof loader>();

  const tabs = [
    { name: "Featured", href: "#", count: "52", current: false },
    {
      name: "Collection",
      href: "#",
      count: data.collectibles.length,
      current: true,
    },
    { name: "Wish List", href: "#", count: "4", current: false },
  ];
  return (
    <>
      <Profile username={data.user.username} name={null} />
      <Gallery
        filters={data.filters}
        tabs={tabs}
        collectibles={data.collectibles}
        className="max-w-7xl mx-auto px-2 sm:px-4 py-10"
      />
    </>
  );
}
