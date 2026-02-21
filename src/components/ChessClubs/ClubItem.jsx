import React from "react";

export default function ClubItem({ club, last }) {
  return (
    <div className={`grid grid-cols-[72px_1fr] gap-4 p-4 ${!last ? "border-b border-gold/10" : ""}`}>
      <img src={club.thumb} alt="" className="h-16 w-16 rounded bg-surface-card object-cover" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <a href="#" className="font-semibold text-foreground hover:underline">{club.name}</a>
          {club.verified && (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs" title="Verificado">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-label="Verificado"><path d="M9 12l2 2 4-4"/></svg>
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
          {club.description}
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-label="Membros"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M2 22a10 10 0 0 1 20 0H2Z"/></svg>
            {club.members.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-label="Online" /> {club.online}
          </span>
          <a href={club.url} className="text-gold hover:underline truncate" target="_blank" rel="noopener noreferrer">{club.url}</a>
        </div>
      </div>
    </div>
  );
}
