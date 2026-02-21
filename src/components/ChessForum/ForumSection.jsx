export default function ForumSection({ section }) {
  return (
    <div className="rounded-2xl bg-surface-secondary/80 border border-gold/20 shadow-lg overflow-hidden">
      {/* Cabeçalho da seção */}
      <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-surface-secondary via-surface-card to-surface-secondary border-b border-gold/10">
        <h2 className="font-semibold text-lg text-gold-light drop-shadow">{section.title}</h2>
        <span className="text-muted-foreground group inline-flex items-center gap-1 text-sm cursor-pointer hover:underline">
          ver mais
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18l6-6-6-6"/></svg>
        </span>
      </div>
      {/* Linhas */}
      <ul className="divide-y divide-gold/10">
        {section.threads.map((t) => (
          <ThreadRow key={t.id} thread={t} />
        ))}
      </ul>
    </div>
  );
}

function ThreadRow({ thread }) {
  return (
    <li className="px-6 py-4 flex items-center gap-3 hover:bg-gold/5 transition-colors">
      <a className="flex-1 truncate hover:underline cursor-pointer text-base text-foreground">{thread.title}</a>
      <span className="w-24 shrink-0 text-right text-sm text-muted-foreground">{thread.time}</span>
      <span className="w-10 shrink-0 inline-flex items-center justify-end gap-1 text-gold-light">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/></svg>
        <span className="tabular-nums font-bold">{thread.replies}</span>
      </span>
    </li>
  );
}
