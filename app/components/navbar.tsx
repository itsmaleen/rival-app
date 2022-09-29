import { Link } from "react-router-dom";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Logo from "./logo";
import { useMatches, useSubmit } from "@remix-run/react";
import { classNames } from "~/utils/helpers";
import { useUserContext } from "~/useUser";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Sign out", href: "/logout" },
];

export default function Navbar(props: { isMobileView: boolean }) {
  const { isMobileView } = props;

  const submit = useSubmit();
  const values = useUserContext();
  const supabase = values?.supabase;

  const handleSignOut = () => {
    supabase?.auth.signOut().then(() => {
      submit(null, { method: "post", action: "/logout" });
    });
  };

  const rootData = useMatches()[0].data as { user: any };
  return (
    <header className="bg-white border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="relative h-20 flex justify-between">
          <div className="relative z-10 px-2 flex lg:px-0">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo className="block h-8 w-auto" />
            </Link>
          </div>
          <div className="relative z-10 flex items-center">
            {rootData.user ? (
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span>New</span>
                  </button>
                </div>
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  {/* TODO: Bring this back when notifications exist */}
                  {/* <button
                    type="button"
                    className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {/* {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))} */}
                        {supabase?.auth.session() && (
                          <Menu.Item>
                            <button
                              onClick={handleSignOut}
                              className="block px-4 py-2 text-sm text-gray-700"
                            >
                              Sign out
                            </button>
                          </Menu.Item>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            ) : (
              <a
                href={`https://s80o7xdqcu7.typeform.com/to/lUEhS3bd?utm_source=app.withrival.com&utm_medium=${
                  isMobileView ? "mobile" : "web"
                }`}
                className="uppercase font-bold inline-flex items-center px-9 py-3.5 border border-transparent text-sm rounded text-white bg-black hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
              >
                Request Access
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
