import Navbar from "~/components/navbar";
import Profile from "~/components/profile";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Navbar />
      <Profile />
    </div>
  );
}
