import { Card } from '@/components/ui';

export default function Header() {
  return (
    <Card variant="gradient" className="px-6 py-4 flex items-center gap-3 mb-2">
      <span className="h-10 w-10 rounded-full grid place-items-center bg-surface-tertiary text-2xl" aria-label="Membros">
        <span role="img" aria-label="Globo">🌍</span>
      </span>
      <h1 className="text-2xl md:text-3xl font-bold text-gold-light drop-shadow">Membros</h1>
    </Card>
  );
}
