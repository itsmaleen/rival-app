import { Link } from "@remix-run/react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Logo from "./logo";
import { useMatches } from "@remix-run/react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Navbar(props: { isMobileView: boolean }) {
  const { isMobileView } = props;

  const rootData = useMatches()[0].data as { user: any };
  const user = rootData.user;
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
            {user ? (
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <a
                    href="https://s80o7xdqcu7.typeform.com/to/SNISnduU"
                    className="relative inline-flex items-center rounded-md border border-transparent px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <PlusIcon className="text-black my-auto ml-1 h-6 w-6" />
                  </a>
                </div>
                <div className="ml-0 md:ml-4 flex flex-shrink-0 items-center">
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
                        <Menu.Item>
                          <Link
                            to={`/${user.username}`}
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Your Collection
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link
                            to="/logout"
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Sign out
                          </Link>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2 sm:space-x-4">
                <Link
                  to="/login"
                  className="font-medium inline-flex items-center px-3 py-2 sm:px-9 sm:py-3.5 border-2 text-xs sm:text-sm rounded-full border-black text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                >
                  Log In
                </Link>
                <a
                  href={`https://s80o7xdqcu7.typeform.com/to/lUEhS3bd?utm_source=app.withrival.com&utm_medium=${
                    isMobileView ? "mobile" : "web"
                  }`}
                  className="font-medium inline-flex items-center px-3 py-2 sm:px-9 sm:py-3.5 border border-transparent text-xs sm:text-sm rounded-full text-white bg-black hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
                >
                  Join Waitlist
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
