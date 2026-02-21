import { Card } from './ui';

export default function CardItem({ icon, title, description, bgColor }) {
  return (
    <Card
      variant="bordered"
      className={`flex flex-col items-start p-4 cursor-pointer hover:scale-105 transition-transform ${bgColor || ''}`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </Card>
  );
}
