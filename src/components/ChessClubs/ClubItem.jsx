import React from "react";

export default function ClubItem({ club, last }) {
  return (
    <div className={`grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr] gap-3 sm:gap-4 p-3 sm:p-4 ${!last ? "border-b border-white/10" : ""}`}>
      <img src={club.thumb} alt="" className="h-12 w-12 sm:h-16 sm:w-16 rounded bg-black/20 object-cover" />
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <a href="#" className="font-semibold hover:underline text-sm sm:text-base truncate">{club.name}</a>
          {club.verified && (
            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs flex-shrink-0" title="Verificado">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-label="Verificado"><path d="M9 12l2 2 4-4"/></svg>
            </span>
          )}
        </div>
        <p className="mt-1 text-xs sm:text-sm text-gray-300 line-clamp-2">
          {club.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-label="Membros"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M2 22a10 10 0 0 1 20 0H2Z"/></svg>
            {club.members.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-label="Online" /> {club.online}
          </span>
          <a href={club.url} className="text-[#c29d5d] hover:underline truncate max-w-[120px] sm:max-w-none" target="_blank" rel="noopener noreferrer">{club.url}</a>
        </div>
      </div>
    </div>
  );
}
