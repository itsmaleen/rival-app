import FacebookIcon from "./icons/fb";
import InstagramIcon from "./icons/instagram";
import TwitchIcon from "./icons/twitch";
import TwitterIcon from "./icons/twitter";

export default function Profile(props: {
  name: string | null;
  username: string;
  description: string | null;
}) {
  const { name, username, description } = props;
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
      icon: TwitterIcon,
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
        {description && <p className="max-w-xl mt-5 mx-auto">{description}</p>}
      </div>
    </div>
  );
}
