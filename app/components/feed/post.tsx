import type { Item } from "~/utils/types";

export default function Post(item: Item) {
  return (
    <div>
      <h1 className="font-bold text-base">{item.title}</h1>
      <img src={item.pictureURLSuperSize} alt={item.title} />
    </div>
  );
}
