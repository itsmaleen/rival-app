import Card from "./card";

export default function Gallery() {
  return (
    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
      <Card imageOnly={true} />
      <Card />
      <Card imageOnly={true} />
      <Card imageOnly={true} />
      <Card />
      <Card />
      <Card />
      <Card imageOnly={true} />
      <Card />
      <Card />
    </div>
  );
}
