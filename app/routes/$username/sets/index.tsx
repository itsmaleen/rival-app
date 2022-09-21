import { Dialog, Transition } from "@headlessui/react";
import type { Collectible, CollectibleSet } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { Fragment, useState } from "react";
import invariant from "tiny-invariant";
import {
  getCollectiblesFromSet,
  getOwnedCardsInSet,
  getSetsOwned,
} from "~/models/set.server";
import { getUserByUsername } from "~/models/user.server";
import type { FilterContextType } from "~/routes/$username";
import { classNames } from "~/utils/helpers";

export async function loader({ params }: LoaderArgs) {
  invariant(params.username, "username is required");

  const username = params.username;

  const user = await getUserByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }
  const collectiblesFromSet = await getCollectiblesFromSet("Astral Radiance");
  const sets = await getSetsOwned(user.id);

  let collectiblesInSets: {
    [key: string]: (CollectibleSet & { collectible: Collectible })[];
  } = {};
  for (const set of sets) {
    collectiblesInSets[set.name] = await getCollectiblesFromSet(set.name);
  }

  const ownedCollectiblesInSet = await getOwnedCardsInSet(user.id);

  return json({
    collectiblesFromSet,
    sets,
    collectiblesInSets,
    ownedCollectiblesInSet,
  });
}

export default function SetsPage() {
  const data = useLoaderData<typeof loader>();
  const { setHideFilter } = useOutletContext<FilterContextType>();
  setHideFilter(true);
  const [activeSet, setActiveSet] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Collected");

  return (
    <>
      {data.sets.map(
        (set) =>
          set && (
            <div
              key={set.name}
              className="flex flex-col mt-4 rounder border-2 border-gray-100 p-6 hover:border-gray-200"
              onClick={() => {
                setActiveSet(set.name);
                setOpen(true);
              }}
            >
              <div className="flex flex-row">
                <h3 className="font-bold">
                  Pokemon {/* Add set series here */}
                </h3>
                <span className="font-bold mx-2">•</span>
                <span>{set.name}</span>
              </div>

              <div className="flex flex-row mt-2">
                <div className="bg-gray-200 h-6 flex-grow rounded">
                  <div className="relative">
                    <div
                      className="absolute h-6 rounded bg-primary-dark z-10 overflow-visible"
                      style={{
                        width: `${(
                          data.ownedCollectiblesInSet.filter(
                            (ownedSet) => ownedSet.setId === set.id
                          ).length / data.collectiblesInSets[set.name].length
                        ).toFixed(2)}%`,
                      }}
                    />
                    <span className="absolute pl-4 z-20">
                      {`${(
                        data.ownedCollectiblesInSet.filter(
                          (ownedSet) => ownedSet.setId === set.id
                        ).length / data.collectiblesInSets[set.name].length
                      ).toFixed(2)}%`}{" "}
                      Complete
                    </span>
                  </div>
                </div>
                <div className="text-gray-500 ml-4">
                  {
                    data.ownedCollectiblesInSet.filter(
                      (ownedSet) => ownedSet.setId === set.id
                    ).length
                  }{" "}
                  / {data.collectiblesInSets[set.name].length} Cards
                </div>
              </div>
            </div>
          )
      )}

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="img"
                        className="text-gray-900 mx-auto mb-2"
                        alt={activeSet}
                        src={
                          data.sets.find((set) => set.name === activeSet)
                            ?.imageUrl ||
                          "https://assets.pokemon.com/assets/cms2/img/misc/gus/buttons/logo-pokemon-79x45.png"
                        }
                      />
                      <div id="tabs" className="hidden sm:flex items-center">
                        <nav
                          className="-mb-px flex space-x-8"
                          aria-label="Tabs"
                        >
                          <div
                            className={classNames(
                              activeTab === "Collected"
                                ? "border-black font-bold"
                                : "border-transparent hover:text-gray-700 hover:border-gray-200",
                              "whitespace-nowrap flex py-4 px-1 border-b-2 text-sm text-black"
                            )}
                            onClick={() => setActiveTab("Collected")}
                          >
                            {"Collected"}

                            <span className="inline-block">
                              <span className="px-2">•</span>
                              {
                                data.ownedCollectiblesInSet.filter(
                                  (ownedSet) =>
                                    ownedSet.setId ===
                                    data.sets.find(
                                      (set) => set.name === activeSet
                                    )?.id
                                ).length
                              }
                            </span>
                          </div>
                          <div
                            className={classNames(
                              activeTab === "Missing"
                                ? "border-black font-bold"
                                : "border-transparent hover:text-gray-700 hover:border-gray-200",
                              "whitespace-nowrap flex py-4 px-1 border-b-2 text-sm text-black"
                            )}
                            onClick={() => setActiveTab("Missing")}
                          >
                            {"Missing"}

                            <span className="inline-block">
                              <span className="px-2">•</span>

                              {data.collectiblesInSets[activeSet]?.length -
                                data.ownedCollectiblesInSet.filter(
                                  (ownedSet) =>
                                    ownedSet.setId ===
                                    data.sets.find(
                                      (set) => set.name === activeSet
                                    )?.id
                                ).length}
                            </span>
                          </div>
                          <div
                            className={classNames(
                              activeTab === "Total Set"
                                ? "border-black font-bold"
                                : "border-transparent hover:text-gray-700 hover:border-gray-200",
                              "whitespace-nowrap flex py-4 px-1 border-b-2 text-sm text-black"
                            )}
                            onClick={() => setActiveTab("Total Set")}
                          >
                            {"Total Set"}

                            <span className="inline-block">
                              <span className="px-2">•</span>
                              {data.collectiblesInSets[activeSet]?.length}
                            </span>
                          </div>
                        </nav>
                      </div>
                      <div className="mt-2">
                        <div className="grid grid-cols-2 gap-4">
                          {data.collectiblesInSets[activeSet]?.map(
                            (collectible) => {
                              if (
                                activeTab === "Collected" &&
                                data.ownedCollectiblesInSet
                                  .filter(
                                    (ownedSet) =>
                                      ownedSet.setId ===
                                      data.sets.find(
                                        (set) => set.name === activeSet
                                      )?.id
                                  )
                                  .map((ownedSet) => ownedSet.collectibleId)
                                  .includes(collectible.collectibleId)
                              ) {
                                return (
                                  <div
                                    key={`${collectible.setId}-${collectible.collectibleId}`}
                                    className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                  >
                                    <div className="flex-shrink-0">
                                      <img
                                        src={collectible.collectible.imageUrl}
                                        alt={collectible.collectible.name}
                                        className="h-12 rounded-sm"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div>
                                        <span
                                          className="absolute inset-0"
                                          aria-hidden="true"
                                        />
                                        <p className="text-sm font-medium text-gray-900">
                                          {collectible.collectible.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (
                                activeTab === "Missing" &&
                                !data.ownedCollectiblesInSet
                                  .filter(
                                    (ownedSet) =>
                                      ownedSet.setId ===
                                      data.sets.find(
                                        (set) => set.name === activeSet
                                      )?.id
                                  )
                                  .map((ownedSet) => ownedSet.collectibleId)
                                  .includes(collectible.collectibleId)
                              ) {
                                return (
                                  <div
                                    key={`${collectible.setId}-${collectible.collectibleId}`}
                                    className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                  >
                                    <div className="flex-shrink-0">
                                      <img
                                        src={collectible.collectible.imageUrl}
                                        alt={collectible.collectible.name}
                                        className="h-12 rounded-sm"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div>
                                        <span
                                          className="absolute inset-0"
                                          aria-hidden="true"
                                        />
                                        <p className="text-sm font-medium text-gray-900">
                                          {collectible.collectible.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (activeTab === "Total Set") {
                                return (
                                  <div
                                    key={`${collectible.setId}-${collectible.collectibleId}`}
                                    className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                  >
                                    <div className="flex-shrink-0">
                                      <img
                                        src={collectible.collectible.imageUrl}
                                        alt={collectible.collectible.name}
                                        className="h-12 rounded-sm"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div>
                                        <span
                                          className="absolute inset-0"
                                          aria-hidden="true"
                                        />
                                        <p className="text-sm font-medium text-gray-900">
                                          {collectible.collectible.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else {
                                return <></>;
                              }
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
