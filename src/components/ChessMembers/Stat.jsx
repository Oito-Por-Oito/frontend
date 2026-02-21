import { Card } from '../ui';

export default function Stat({ label, value }) {
  return (
    <Card variant="bordered" className="p-4 flex flex-col">
      <div className="flex items-center gap-2 text-text-secondary">
        <span className="h-8 w-8 rounded bg-black/30 grid place-items-center text-lg">👥</span>
        <span className="text-sm">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums text-gold-light">{value}</div>
    </Card>
  );
}
