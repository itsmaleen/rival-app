import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Profile from "~/components/profile";
import { getCollectibleCounts } from "~/models/collectible_user.server";
import { getUserByUsername } from "~/models/user.server";
import { getUniqueTagsByCollector } from "~/models/tag.server";
import { getExternalLinks } from "~/models/links.server";
import { classNames } from "~/utils/helpers";

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  // let nav = formData.get("nav");
  console.log(formData);

  return redirect(formData.get("tabs")?.toString() || "/");
}

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.username, "username is required");

  const username = params.username;

  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }
  const links = await getExternalLinks(user.id);

  const counts = getCollectibleCounts(user.id);
  const allCollectiblesCount = await counts.allCollectiblesCount;
  const featuredCollectiblesCount = await counts.featuredCollectiblesCount;

  return json({
    user,
    username,
    allCollectiblesCount,
    featuredCollectiblesCount,
    links,
  });
}

export type FilterContextType = {
  userId: number;
};

export default function ProfilePage() {
  const data = useLoaderData<typeof loader>();

  const { username, user } = data;

  const context: FilterContextType = {
    userId: user.id,
  };

  const tabs = [
    // {
    //   name: "Showcase",
    //   href: `/${username}/showcase`,
    //   count: data.featuredCollectiblesCount,
    // },
    {
      name: "Collection",
      href: `/${username}`,
      count: data.allCollectiblesCount,
    },
    {
      name: "Sets",
      href: `/${username}/sets`,
    },
    // { name: "Wish List", href: "#", count: "4", current: false },
  ];
  return (
    <>
      <Profile
        links={data.links}
        imageUrl={user.imageUrl}
        username={user.username}
        name={user.name}
        description={user.description}
      />

      <div className="bg-white">
        <div>
          <main className="max-w-7xl mx-auto px-2 sm:px-4 py-10">
            <div className="relative z-10 flex items-baseline justify-between pb-6 sm:pb-0 border-b border-gray-200">
              {/* Tabs - Web */}
              <div id="tabs" className="flex items-center">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <NavLink
                      key={tab.name}
                      to={tab.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "border-black font-bold"
                            : "border-transparent hover:text-gray-700 hover:border-gray-200",
                          "whitespace-nowrap flex py-4 px-1 border-b-2 text-sm text-black"
                        )
                      }
                      end
                    >
                      {tab.name}
                      {tab.count ? (
                        <span className="inline-block">
                          <span className="px-2">•</span>
                          {tab.count}
                        </span>
                      ) : null}
                    </NavLink>
                  ))}
                </nav>
              </div>
              {/* End of Tabs - Web */}
            </div>

            <section className="pt-6 pb-24">
              <Outlet context={context} />
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
