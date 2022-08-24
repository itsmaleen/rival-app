import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Gallery from "~/components/gallery";
import Navbar from "~/components/navbar";
import Profile from "~/components/profile";
import Tabs from "~/components/tabs";

export const loader: LoaderFunction = async ({ request }) => {
  let isMobileView = (
    request ? request.headers.get("user-agent") : navigator.userAgent
  ).match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);

  //Returning the isMobileView as a prop to the component for further use.
  return {
    isMobileView: Boolean(isMobileView),
  };
};

export default function Index() {
  const { isMobileView } = useLoaderData();
  const tabs = [
    { name: "Featured", href: "#", count: "52", current: false },
    { name: "Collection", href: "#", count: "6", current: true },
    { name: "Wish List", href: "#", count: "4", current: false },
    { name: "Activity", href: "#", current: false },
  ];
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Navbar isMobileView={isMobileView} />
      <Profile />
      <Tabs className="max-w-7xl mx-auto px-2 sm:px-4 py-10" tabs={tabs} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-10">
        <Gallery />
      </div>
    </div>
  );
}
