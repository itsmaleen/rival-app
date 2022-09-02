import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUsersWithCollectiblesCount } from "~/models/user.server";

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

  return json({ users });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const { users } = data;
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl py-16">
        <ul role="list" className="divide-y divide-gray-200">
          {users.map((user, userIdx) => (
            <li key={user.username} className="py-4">
              <Link to={`/${user.username}`}>
                <div className="flex space-x-3">
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: colors[userIdx % colors.length] }}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">{user.username}</h3>
                      {/* <p className="text-sm text-gray-500">1h</p> */}
                    </div>
                    <p className="text-sm text-gray-500">
                      Added {user._count.collectibles} collectibles to their
                      collection
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
