import { Card } from '../ui';

export default function QuickLinks() {
  const items = [
    'Jogadores titulados',
    'Melhores Jogadores de Xadrez',
    'Treinadores',
    'Streamers',
    'Amigos',
    'Solicitações de amizade'
  ];
  
  return (
    <Card variant="bordered" className="p-0">
      <div className="px-4 py-3 flex items-center justify-between border-b border-gold/20">
        <h3 className="font-semibold text-gold-light">Membros</h3>
        <span className="text-gold-light/80">▸</span>
      </div>
      <ul className="p-2">
        {items.map(s => (
          <li key={s}>
            <a className="block px-2 py-2 rounded text-sm hover:bg-white/5 transition-colors" tabIndex={0}>
              {s}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
