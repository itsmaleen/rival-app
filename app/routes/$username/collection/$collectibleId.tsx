import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getCollectible } from "~/models/collectible_user.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// TODO: Look into reducing bundle size
import { motion, useMotionValue, useTransform } from "framer-motion";

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.collectibleId, "collectible id is required");

  // TODO: get this value using useMatches
  const isMobileView = (
    request ? request.headers.get("user-agent") : navigator.userAgent
  ).match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);

  const collectible = await getCollectible(Number(params.collectibleId));
  console.log(collectible);
  if (!collectible) {
    console.log("test");
    return redirect("/");
  }
  return json({ collectible, isMobileView });
}

export default function Collectible() {
  const data = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 sm:bg-opacity-95 transition-opacity" />
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
              <Dialog.Panel className="transform rounded-lg bg-white shadow-xl transition-all  flex flex-col p-6 divide-y-2 space-y-4">
                <div>
                  <div
                    className="group-hover:opacity-75 sm:aspect-none sm:w-96"
                    style={{ perspective: 2000 }}
                  >
                    <motion.img
                      src={collectible.imageUrl}
                      alt={collectible.name}
                      className="w-full h-full object-center object-contain sm:w-full sm:h-full"
                      style={{ x, y, rotateX, rotateY, z: 100 }}
                      drag
                      dragElastic={data.isMobileView ? 0.4 : 0.16}
                      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95, cursor: "grabbing" }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col pt-4 sm:pt-8">
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
