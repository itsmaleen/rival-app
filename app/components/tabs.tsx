function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs(props: { className?: string; tabs: any[] }) {
  const { className, tabs } = props;
  if (!tabs || !tabs.length || tabs.length === 0) {
    return <></>;
  }
  return (
    <div className={className}>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          defaultValue={tabs.find((tab) => tab.current).name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href="#"
                className={classNames(
                  tab.current
                    ? "border-black font-bold"
                    : "border-transparent hover:text-gray-700 hover:border-gray-200",
                  "whitespace-nowrap flex py-4 px-1 border-b-2 text-sm text-black"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.current ? "font-bold" : "",
                      "hidden md:inline-block"
                    )}
                  >
                    <span className="px-2">•</span>
                    {tab.count}
                  </span>
                ) : null}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
