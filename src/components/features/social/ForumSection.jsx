import { Card } from "@/components/ui";

/**
 * ForumSection - Seção de tópicos do fórum
 */
export default function ForumSection({ section }) {
  return (
    <Card variant="default" className="overflow-hidden p-0">
      {/* Cabeçalho da seção */}
      <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-surface-secondary via-surface-primary to-surface-secondary border-b border-gold/10">
        <h2 className="font-semibold text-lg text-gold-light drop-shadow">
          {section.title}
        </h2>
        <span className="text-muted-foreground group inline-flex items-center gap-1 text-sm cursor-pointer hover:underline hover:text-gold">
          ver mais
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </span>
      </div>
      
      {/* Linhas */}
      <ul className="divide-y divide-gold/10">
        {section.threads.map((t) => (
          <ThreadRow key={t.id} thread={t} />
        ))}
      </ul>
    </Card>
  );
}

function ThreadRow({ thread }) {
  return (
    <li className="px-6 py-4 flex items-center gap-3 hover:bg-gold/5 transition-colors">
      <a className="flex-1 truncate hover:underline cursor-pointer text-base text-foreground hover:text-gold-light">
        {thread.title}
      </a>
      <span className="w-24 shrink-0 text-right text-sm text-muted-foreground">
        {thread.time}
      </span>
      <span className="w-10 shrink-0 inline-flex items-center justify-end gap-1 text-gold-light">
        💬
        <span className="tabular-nums font-bold">{thread.replies}</span>
      </span>
    </li>
  );
}
