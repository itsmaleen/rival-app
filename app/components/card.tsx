export default function Card(props: any) {
  // Get imageOnly from props
  const imageOnly = props.imageOnly || false;
  const src = props.src || "https://images.pokemontcg.io/sm115/7_hires.png";
  return (
    <>
      {imageOnly ? (
        <div className="aspect-w-3 aspect-h-4 group-hover:opacity-75 sm:aspect-none sm:h-96">
          <img
            src={src}
            alt="Blastoise"
            className="w-full h-full object-center object-contain sm:w-full sm:h-full"
          />
        </div>
      ) : (
        <div className="group relative bg-white border-2 border-neutral-250 rounded-lg flex flex-col overflow-hidden p-6 divide-y-2 space-y-4 divide-neutral-150">
          <div className="aspect-w-3 aspect-h-4 group-hover:opacity-75 sm:aspect-none sm:h-96">
            <img
              src={src}
              alt="Blastoise"
              className="w-full h-full object-center object-contain sm:w-full sm:h-full"
            />
          </div>
          <div className="flex-1 flex flex-col pt-4">
            <div className="flex justify-between text-base font-semibold">
              <h3 className="">Blastoise</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                PSA 9.0
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-end text-sm">
              <p>Plasma Storm • Holo</p>
              <p>2012 Pokemon B&W #136</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
