import CardItem from "./CardItem";

export default function Section({ title, items }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <CardItem key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
