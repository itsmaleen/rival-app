import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getCollectible } from "~/models/collectible.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderArgs) {
  invariant(params.collectibleId, "collectible id is required");
  const collectible = await getCollectible(Number(params.collectibleId));
  console.log(collectible);
  if (!collectible) {
    console.log("test");
    return redirect("/");
  }
  return json({ collectible });
}

export default function Collectible() {
  const data = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      // go back to previous page
      window.history.back();
    }
  }, [open]);

  const { collectible } = data;

  const description = collectible.description
    ? collectible.description.split(/\n|\\n/)
    : [];
  return (
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
              <Dialog.Panel className="transform rounded-lg bg-white shadow-xl transition-all  flex flex-col overflow-hidden p-6 divide-y-2 space-y-4">
                <div>
                  <div className="group-hover:opacity-75 sm:aspect-none sm:h-96">
                    <img
                      src={collectible.imageUrl}
                      alt={collectible.name}
                      className="w-full h-full object-center object-contain sm:w-full sm:h-full"
                    />
                  </div>
                  <div className="flex-1 flex flex-col pt-4">
                    <div className="flex justify-between flex-row sm:flex-col md:flex-row font-semibold">
                      <Dialog.Title as="h3" className="text-base">
                        {collectible.name}
                      </Dialog.Title>
                      {collectible.grade && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          PSA {collectible.grade}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-end text-sm text-left">
                      {description.map((line: string, index: number) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}