import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Gallery from "~/components/gallery";
import Navbar from "~/components/navbar";
import Profile from "~/components/profile";
import Sidebar from "~/components/sidebar";
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

  const filters = [
    {
      id: "collectibleType",
      name: "Collectible Type",
      options: [
        { value: "white", label: "Trading Cards", checked: false },
        { value: "beige", label: "Coins", checked: false },
        { value: "blue", label: "Video Games", checked: true },
        { value: "brown", label: "Figurines", checked: false },
      ],
    },
    {
      id: "franchise",
      name: "Franchise",
      options: [
        { value: "new-arrivals", label: "New Arrivals", checked: false },
        { value: "sale", label: "Sale", checked: false },
        { value: "travel", label: "Travel", checked: true },
        { value: "organization", label: "Organization", checked: false },
        { value: "accessories", label: "Accessories", checked: false },
      ],
    },
    {
      id: "grading",
      name: "Grading",
      options: [
        { value: "2l", label: "2L", checked: false },
        { value: "6l", label: "6L", checked: false },
        { value: "12l", label: "12L", checked: false },
        { value: "18l", label: "18L", checked: false },
        { value: "20l", label: "20L", checked: false },
        { value: "40l", label: "40L", checked: true },
      ],
    },
  ];
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Navbar isMobileView={isMobileView} />
      <Profile />
      <Gallery
        filters={filters}
        tabs={tabs}
        className="max-w-7xl mx-auto px-2 sm:px-4 py-10"
      />
      {/* <div className="max-w-7xl mx-auto px-2 sm:px-4 py-10 flex space-x-2">
        <Sidebar />
        <Gallery />
      </div> */}
    </div>
  );
}
