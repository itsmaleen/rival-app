import type { UserLink } from "@prisma/client";
import FacebookIcon from "./icons/fb";
import InstagramIcon from "./icons/instagram";
import TwitchIcon from "./icons/twitch";
import TwitterIcon from "./icons/twitter";
import YoutubeIcon from "./icons/youtube";
import EbayIcon from "./icons/ebay";

function getIcon(name: string) {
  if (name === "facebook") {
    return FacebookIcon;
  } else if (name === "instagram") {
    return InstagramIcon;
  } else if (name === "twitch") {
    return TwitchIcon;
  } else if (name === "twitter") {
    return TwitterIcon;
  } else if (name === "youtube") {
    return YoutubeIcon;
  } else if (name === "ebay") {
    return EbayIcon;
  } else {
    return null;
  }
}

export default function Profile(props: {
  name: string | null;
  username: string;
  description: string | null;
  imageUrl: string | null;
  links: UserLink[] | null;
}) {
  const { name, username, description, links } = props;
  console.log(links);
  const social = links
    ? links.map((link) => ({
        name: link.name,
        href: link.url,
        icon: getIcon(link.name),
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-10">
      <div className="flex justify-end">
        <div className="flex space-x-6 md:order-2">
          {social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              className="text-gray-400 hover:text-gray-300"
              rel="noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
        <div className="flex">
          {props.imageUrl ? (
            <img
              className="h-24 w-24 mx-auto rounded-full ring-4 ring-white sm:h-28 sm:w-28"
              src={props.imageUrl}
              alt={props.username}
            />
          ) : (
            <div className="h-24 w-24 mx-auto rounded-full bg-primary-dark sm:h-28 sm:w-28"></div>
          )}
        </div>
        <p className="mt-3 text-2xl tracking-tight font-bold text-gray-900 sm:text-3xl sm:tracking-tight lg:tracking-tight">
          {name || username}
        </p>
        {description && <p className="max-w-xl mt-5 mx-auto">{description}</p>}
      </div>
    </div>
  );
}
