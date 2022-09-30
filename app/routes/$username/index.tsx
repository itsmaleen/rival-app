import { Fragment, useRef, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  DeviceTabletIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from "@heroicons/react/20/solid";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Card from "~/components/card";
import type { CollectibleUser } from "~/models/collectible_user.server";
import { getAllCollectiblesWithTags } from "~/models/collectible_user.server";
import type { Tag } from "~/models/tag.server";
import { getUniqueTagsByCollector } from "~/models/tag.server";
import { getUserByUsername } from "~/models/user.server";
import FilterIcon from "~/components/filterIcon";

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
    collectibles,
    username,
    tags,
    filterOptions: filters,
    filters,
  });
}

type ViewOption = "GRID" | "CARD" | "TABLE";

export default function Collection() {
  const data = useLoaderData<typeof loader>();

  const { filterOptions, username, collectibles, filters } = data;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [webFiltersOpen, setWebFiltersOpen] = useState(
    filters && filters.length > 0
  );
  const [activeViewOption, setActiveViewOption] = useState<ViewOption>("TABLE");

  const filterFormRef = useRef<HTMLFormElement>(null);

  const [query, setQuery] = useState("");

  const filteredCollectibles =
    query === ""
      ? collectibles
      : collectibles.filter((collectible) => {
          return collectible.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
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
                    action={`/${username}`}
                    ref={filterFormRef}
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
                                  name="filter"
                                  defaultValue={option.value.toString()}
                                  type="checkbox"
                                  onChange={() =>
                                    filterFormRef.current?.submit()
                                  }
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
      {/* Filter, search and views */}
      <div className="mx-auto grid grid-cols-5 sm:grid-cols-11 gap-x-8 gap-y-6 pb-6">
        <div className="hidden sm:flex items-center mr-8 ">
          <button
            type="button"
            className="p-2 border-2 rounded hover:bg-gray-100"
            onClick={() => setWebFiltersOpen(!webFiltersOpen)}
          >
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="relative border-2 rounded col-span-5 sm:col-span-6 md:col-span-7 lg:col-span-8">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <input
            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            type="search"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            className="pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-3 group"
            onClick={() => setQuery("")}
          >
            <XCircleIcon
              className="h-5 w-5 text-gray-400 hover:bg-gray-100 rounded-full"
              aria-hidden="true"
            />
          </button>
        </div>
        <span className="isolate inline-flex rounded col-span-3 sm:col-auto">
          <button
            type="button"
            onClick={() => setActiveViewOption("CARD")}
            className={`relative inline-flex items-center rounded-l border border-gray-200 px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500${
              activeViewOption === "CARD"
                ? "bg-white shadow-sm"
                : "hover:bg-white hover:shadow-sm  bg-gray-200"
            }`}
          >
            <DeviceTabletIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Use card view</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveViewOption("GRID")}
            className={`relative -ml-px inline-flex items-center border border-gray-200 px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              activeViewOption === "GRID"
                ? "bg-white shadow-sm"
                : "hover:bg-white hover:shadow-sm bg-gray-200"
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Use grid view</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveViewOption("TABLE")}
            className={`relative -ml-px inline-flex items-center rounded-r border border-gray-200 px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              activeViewOption === "TABLE"
                ? "bg-white shadow-sm"
                : "hover:bg-white hover:shadow-sm bg-gray-200"
            }`}
          >
            <TableCellsIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Use table view</span>
          </button>
        </span>

        <div className="flex items-end justify-end sm:hidden col-span-2 my-auto">
          <button
            type="button"
            className="p-2 border-2 rounded"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-10">
        {/* Filters */}
        {filterOptions && filterOptions.length > 0 && (
          <Form
            reloadDocument
            action={`/${username}`}
            ref={filterFormRef}
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
                                    filterFormRef.current?.submit()
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
                                onChange={() => filterFormRef.current?.submit()}
                                defaultChecked={section.options[0].checked}
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
        <div className={webFiltersOpen ? "lg:col-span-4" : "lg:col-span-5"}>
          {activeViewOption === "GRID" || activeViewOption === "CARD" ? (
            <div
              className={`grid ${
                activeViewOption === "GRID"
                  ? "grid-cols-1 gap-4 sm:grid-cols-3"
                  : "grid-cols-2 gap-x-1 gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-4"
              }`}
            >
              {filteredCollectibles.map((collectible) =>
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
                          collectible.description
                            .split(/\n|\\n/)
                            .map((line, idx) => (
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
          ) : (
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                  >
                    <span className="sr-only">Image</span>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                  >
                    Collectible
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                  >
                    Condition
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
                  >
                    Est. Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredCollectibles.map((collectible) => (
                  <tr key={collectible.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-12 flex-shrink-0">
                          <img
                            className="h-12"
                            src={collectible.imageUrl}
                            alt=""
                          />
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap py-4 text-sm">
                      <div className="flex items-center">
                        <div>
                          <div className="text-gray-700">
                            {collectible.description?.split("\n")[0]}
                          </div>
                          <div className="font-medium">{collectible.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      {collectible.condition || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ">
                      $30.50
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
