import Logo from "./logo";

export default function Navbar() {
  return (
    <header className="bg-white border-b-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="relative h-20 flex justify-between">
          <div className="relative z-10 px-2 flex lg:px-0">
            <div className="flex-shrink-0 flex items-center">
              <Logo className="block h-8 w-auto" />
            </div>
          </div>
          <div className="relative z-10 flex items-center">
            <a
              href="#"
              className="uppercase font-bold inline-flex items-center px-9 py-3.5 border border-transparent text-sm rounded text-black bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
            >
              Request Access
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
