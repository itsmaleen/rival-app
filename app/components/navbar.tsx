import { Link } from "react-router-dom";
import Logo from "./logo";

export default function Navbar(props: { isMobileView: boolean }) {
  const { isMobileView } = props;
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
            <a
              href={`https://s80o7xdqcu7.typeform.com/to/lUEhS3bd?utm_source=app.withrival.com&utm_medium=${
                isMobileView ? "mobile" : "web"
              }`}
              className="uppercase font-bold inline-flex items-center px-9 py-3.5 border border-transparent text-sm rounded text-white bg-black hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
            >
              Request Access
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
