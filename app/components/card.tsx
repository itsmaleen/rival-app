import { Link } from "@remix-run/react";

export default function Card(props: any) {
  const imageOnly = props.imageOnly || false;
  const src = props.src || "https://images.pokemontcg.io/sm115/7_hires.png";
  const name = props.name || "";

  const description = props.description
    ? props.description.split(/\n|\\n/)
    : ["Plasma Storm • Holo", "2012 Pokemon B&W #136"];

  return (
    <>
      {imageOnly ? (
        <div className="group-hover:opacity-75 sm:aspect-none sm:h-80">
          <img
            src={src}
            alt={name}
            className="w-full h-full object-center object-contain sm:w-full sm:h-full"
          />
        </div>
      ) : (
        <div className="group relative bg-white border-2 border-neutral-250 rounded-lg flex flex-col overflow-hidden p-6 divide-y-2 space-y-4 divide-neutral-150">
          <Link
            to={`/${props.username}/collection/${props.id}`}
            className="group-hover:opacity-75 sm:aspect-none sm:h-80"
          >
            <img
              src={src}
              alt={name}
              className="w-full h-full object-center object-contain sm:w-full sm:h-full"
            />
          </Link>
          <div className="flex-1 flex flex-col pt-4">
            <div className="flex justify-between flex-col md:flex-row font-semibold">
              <h3 className="text-base">{name}</h3>
              {props.grade && (
                <span className="items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 w-fit">
                  PSA {props.grade}
                </span>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-end text-sm">
              {description.map((line: string, index: number) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
