import FacebookIcon from "./icons/fb";
import InstagramIcon from "./icons/instagram";
import TwitchIcon from "./icons/twitch";

export default function Profile(props: {
  name: string | null;
  username: string;
}) {
  const { name, username } = props;
  const social = [
    {
      name: "Facebook",
      href: "#",
      icon: FacebookIcon,
    },
    {
      name: "Twitch",
      href: "#",
      icon: TwitchIcon,
    },
    {
      name: "Instagram",
      href: "#",
      icon: InstagramIcon,
    },
    {
      name: "Twitter",
      href: "#",
      icon: (props: { className?: string }) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-10">
      <div className="flex justify-end">
        <div className="flex space-x-6 md:order-2">
          {social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-300"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
        <div className="flex">
          <img
            className="h-24 w-24 mx-auto rounded-full ring-4 ring-white sm:h-28 sm:w-28"
            src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
            alt=""
          />
        </div>
        <p className="mt-3 text-2xl tracking-tight font-bold text-gray-900 sm:text-3xl sm:tracking-tight lg:tracking-tight">
          {name || username}
        </p>
        <p className="max-w-xl mt-5 mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          dignissim dui sed tellus venenatis, vel consequat sapien vehicula.
          Quisque iaculis non dolor nec mollis. Nullam a tempor magna.
        </p>
      </div>
    </div>
  );
}
