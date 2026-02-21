import CardItem from "./CardItem";

export default function Section({ title, items }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gold-light">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <CardItem key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
