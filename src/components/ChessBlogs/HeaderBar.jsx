import { FaBlog } from 'react-icons/fa';

export default function HeaderBar({ title }) {
  return (
    <div className="bg-gradient-to-r from-surface-secondary via-surface-card to-surface-secondary border-b-2 border-gold/30 shadow">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
        <span className="h-9 w-9 rounded-full bg-surface-secondary border-2 border-gold/40 grid place-items-center text-2xl text-gold-light shadow">
          <FaBlog />
        </span>
        <h1 className="text-3xl font-bold text-gold-light drop-shadow">{title}</h1>
      </div>
    </div>
  );
}
