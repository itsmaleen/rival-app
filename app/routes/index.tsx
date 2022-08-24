import Gallery from "~/components/gallery";
import Navbar from "~/components/navbar";
import Profile from "~/components/profile";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Navbar />
      <Profile />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-10">
        <Gallery />
      </div>
    </div>
  );
}
