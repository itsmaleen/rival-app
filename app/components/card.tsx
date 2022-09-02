import { Link } from "@remix-run/react";
import { motion } from "framer-motion";

export default function Card(props: any) {
  const { id, src, name, grade, username, customImages, showcase } = props;

  const description = props.description
    ? props.description.split(/\n|\\n/)
    : [];

  let images = [];
  if (customImages && customImages.length > 0) {
    customImages.forEach((customImage: any) => {
      images.push({ url: customImage.url, custom: true });
    });
  }

  if (showcase) {
    images.push({ url: src, custom: false });
  } else {
    images.unshift({ url: src, custom: false });
  }

  const imageIdx = 0;

  return (
    <div className="relative bg-white border-2 border-neutral-250 rounded-lg flex flex-col overflow-hidden">
      <Link to={`/${username}/collection/${id}`} className="">
        <motion.img
          src={images[imageIdx].url}
          alt={name}
          className={`w-full h-full object-center object-contain ${
            images[imageIdx].custom ? "" : "p-4"
          }`}
          whileHover={{ scale: 0.95 }}
        />
      </Link>
      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between flex-col md:flex-row font-semibold">
          <h3 className="text-xs">{name}</h3>
          {grade && (
            <span className="items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 w-fit">
              PSA {grade}
            </span>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-end text-xs">
          {description.map((line: string, index: number) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
