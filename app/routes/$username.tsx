import { Fragment, useRef, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  FunnelIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DeviceTabletIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Profile from "~/components/profile";
import { getCollectibleCounts } from "~/models/collectible.server";
import { getUserByUsername } from "~/models/user.server";
import { getUniqueTagsByCollector } from "~/models/tag.server";
import { getExternalLinks } from "~/models/links.server";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.username, "username is required");

  const username = params.username;

  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }
  const links = await getExternalLinks(user.id);

  const url = new URL(request.url);
  const inCollection = url.pathname.includes("/collection");

  const tags = url.searchParams.getAll("filter");

  const counts = getCollectibleCounts(user.id);
  const allCollectiblesCount = await counts.allCollectiblesCount;
  const featuredCollectiblesCount = await counts.featuredCollectiblesCount;

  const tagCategories = await getUniqueTagsByCollector(user.id);
  let filters: {
    id: number;
    name: String;
    options: { id: String; value: String; label: String; checked: boolean }[];
    defaultOpen: boolean;
  }[] = [];
  tagCategories.forEach((tagCategory, tagCategoryIdx) => {
    const isChecked = tags.includes(tagCategory.tag.toString());
    if (!filters.some((filter) => filter.name === tagCategory.category)) {
      filters.push({
        id: tagCategoryIdx,
        name: tagCategory.category,
        options: [
          {
            id: tagCategory.tag,
            value: tagCategory.tag,
            label: tagCategory.tag,
            checked: isChecked,
          },
        ],
        defaultOpen: isChecked,
      });
    } else {
      filters.forEach((filter) => {
        if (filter.name === tagCategory.category) {
          filter.defaultOpen = filter.defaultOpen || isChecked;
          filter.options.push({
            id: tagCategory.tag,
            value: tagCategory.tag,
            label: tagCategory.tag,
            checked: isChecked,
          });
        }
      });
    }
  });

  return json({
    user,
    filterOptions: filters,
    username,
    allCollectiblesCount,
    featuredCollectiblesCount,
    links,
    inCollection,
    filters,
  });
}

type ViewOption = "GRID" | "CARD";

export type FilterContextType = {
  setHideFilter: (hideFilter: boolean) => void;
  activeViewOption: ViewOption;
};

export default function ProfilePage() {
  const data = useLoaderData<typeof loader>();

  const { filterOptions, username, user, inCollection, filters } = data;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [webFiltersOpen, setWebFiltersOpen] = useState(
    filters && filters.length > 0
  );
  const [hideFilter, setHideFilter] = useState(!inCollection);
  const [activeViewOption, setActiveViewOption] = useState<ViewOption>("GRID");

  const context: FilterContextType = { setHideFilter, activeViewOption };

  const formRef = useRef<HTMLFormElement>(null);

  const tabs = [
    {
      name: "Showcase",
      href: `/${username}`,
      count: data.featuredCollectiblesCount,
    },
    {
      name: "Collection",
      href: `/${username}/collection`,
      count: data.allCollectiblesCount,
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
          {/* Mobile filter dialog */}
          {filterOptions && filterOptions.length > 0 && (
            <Transition.Root show={mobileFiltersOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-40 lg:hidden"
                onClose={setMobileFiltersOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 flex z-40">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                      <div className="px-4 flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">
                          Filters
                        </h2>
                        <button
                          type="button"
                          className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                          onClick={() => setMobileFiltersOpen(false)}
                        >
                          <span className="sr-only">Close menu</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Filters */}
                      <Form
                        reloadDocument
                        action={`/${username}/collection#tabs`}
                        ref={formRef}
                        method="get"
                        className="mt-4 border-t border-gray-200"
                      >
                        <h3 className="sr-only">Categories</h3>

                        {filterOptions.map((section) => (
                          <Disclosure
                            as="div"
                            key={section.id}
                            className="border-t border-gray-200 px-4 py-6"
                            defaultOpen={section.defaultOpen}
                          >
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                                <span className="font-bold text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  <ChevronDownIcon
                                    className="h-5 w-5 ui-open:rotate-180 ui-open:transform"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={optionIdx}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name="filter[]"
                                      defaultValue={option.value.toString()}
                                      type="checkbox"
                                      onChange={() => formRef.current?.submit()}
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </Disclosure>
                        ))}
                      </Form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>
          )}
          <main className="max-w-7xl mx-auto px-2 sm:px-4 py-10">
            <div className="relative z-10 flex items-baseline justify-between pb-6 sm:pb-0 border-b border-gray-200">
              {/* Tabs */}
              <div id="tabs" className="flex items-center">
                {!hideFilter && (
                  <div className="hidden sm:flex items-center mr-8">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setWebFiltersOpen(!webFiltersOpen)}
                    >
                      <span className="sr-only">Filters</span>
                      <FunnelIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                )}
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
              {/* End of Tabs */}

              {!hideFilter && (
                <div className="flex items-center">
                  <button
                    type="button"
                    className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <span className="sr-only">Filters</span>
                    <FunnelIcon className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              )}
              {/* View options */}
              {!hideFilter && (
                <div className="ml-6 items-center rounded-lg bg-gray-100 p-0.5 flex">
                  <button
                    type="button"
                    onClick={() => setActiveViewOption("CARD")}
                    className={`ml-0.5 rounded-md p-1.5 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ${
                      activeViewOption === "CARD"
                        ? "bg-white shadow-sm"
                        : "hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <DeviceTabletIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Use list view</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewOption("GRID")}
                    className={`ml-0.5 rounded-md p-1.5 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ${
                      activeViewOption === "GRID"
                        ? "bg-white shadow-sm"
                        : "hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Use grid view</span>
                  </button>
                </div>
              )}
            </div>

            <section className="pt-6 pb-24">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-10">
                {/* Filters */}
                {filterOptions && filterOptions.length > 0 && (
                  <Form
                    reloadDocument
                    action={`/${username}/collection#tabs`}
                    ref={formRef}
                    method="get"
                    className={`hidden ${webFiltersOpen ? "lg:block" : ""}`}
                  >
                    {filterOptions.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-b border-gray-200 py-6"
                        defaultOpen={section.defaultOpen}
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-my-3 flow-root">
                              <Disclosure.Button className="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500">
                                <span className="font-bold text-black">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <ChevronUpIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <ChevronDownIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-4">
                                {section.options.length > 1 ? (
                                  section.options.map(
                                    (option: any, optionIdx: number) => (
                                      <div
                                        key={option.value}
                                        className="flex items-center"
                                      >
                                        <input
                                          id={`filter-${section.id}-${optionIdx}`}
                                          name="filter"
                                          defaultValue={option.value}
                                          type="checkbox"
                                          onChange={() =>
                                            formRef.current?.submit()
                                          }
                                          defaultChecked={option.checked}
                                          className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary-dark"
                                        />
                                        <label
                                          htmlFor={`filter-${section.id}-${optionIdx}`}
                                          className="ml-3 text-sm text-gray-600"
                                        >
                                          {option.label}
                                        </label>
                                      </div>
                                    )
                                  )
                                ) : (
                                  <>
                                    <div className="flex items-center">
                                      <input
                                        id={`filter-${section.id}`}
                                        name="filter[]"
                                        defaultValue={section.options[0].value.toString()}
                                        type="checkbox"
                                        onChange={() =>
                                          formRef.current?.submit()
                                        }
                                        defaultChecked={
                                          section.options[0].checked
                                        }
                                        className="h-4 w-4 border-gray-300 rounded text-primary focus:ring-primary-dark"
                                        disabled
                                      />
                                      <label
                                        htmlFor={`filter-${section.id}`}
                                        className="ml-3 text-sm text-gray-600"
                                      >
                                        {section.options[0].label}
                                      </label>
                                    </div>
                                  </>
                                )}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </Form>
                )}
                <div
                  className={webFiltersOpen ? "lg:col-span-4" : "lg:col-span-5"}
                >
                  <Outlet context={context} />
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
