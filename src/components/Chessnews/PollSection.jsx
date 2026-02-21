import { Card } from '../ui';

export default function PollSection() {
  return (
    <Card variant="gradient" className="p-5">
      <h4 className="text-sm font-semibold mb-2 text-gold">Enquete</h4>
      <p className="text-sm mb-2 text-white/80">Qual ensinamento mais te ajudou no xadrez?</p>
      <ul className="space-y-1 text-sm text-white/90">
        <li>🔘 Atacar o centro</li>
        <li>🔘 Desenvolvimento rápido</li>
        <li>🔘 Roque rápido</li>
      </ul>
    </Card>
  );
}
