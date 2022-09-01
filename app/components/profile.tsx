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
  const { name, username, links } = props;
  const social = links
    ? links.map((link) => ({
        name: link.name,
        href: link.url,
        icon: getIcon(link.name),
      }))
    : [];

  const description = props.description
    ? props.description.split(/\n|\\n/)
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
      <div className="mt-8 sm:grid sm:grid-cols-7">
        <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-12 sm:space-y-0 lg:gap-x-4 mt-8 text-center sm:text-left sm:col-start-2 sm:col-end-6">
          <div className="flex justify-center sm:justify-end space-x-4 lg:space-x-6 my-auto">
            {props.imageUrl ? (
              <img
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-36 sm:w-36"
                src={props.imageUrl}
                alt={props.username}
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary-dark sm:h-36 sm:w-36"></div>
            )}
          </div>
          <div className="flex space-y-0.5 justify-center flex-col">
            <p className="text-2xl font-bold sm:text-3xl">{name}</p>
            <p className="text-sm sm:text-base font-semibold pt-1 pb-2">
              <span className="bg-gray-300 rounded-sm py-1 px-2">
                @{username}
              </span>
            </p>
            {description &&
              description.length > 0 &&
              description.map((line, idx) => (
                <p key={idx} className="text-sm sm:text-base">
                  {line}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
