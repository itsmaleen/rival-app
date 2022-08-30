import Card from "./card";
import type { Collectible } from "@prisma/client";
export default function Gallery(props: any) {
  const { collectibles, username } = props;
  return (
    <div className="grid grid-cols-2 gap-x-1 gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-4">
      {collectibles && collectibles.length > 0 ? (
        collectibles.map((collectible: Collectible) => (
          <Card
            key={collectible.id}
            id={collectible.id}
            src={collectible.imageUrl}
            name={collectible.name}
            grade={collectible.grade}
            description={collectible.description}
            username={username}
          />
        ))
      ) : (
        <></>
      )}
    </div>
  );
}
