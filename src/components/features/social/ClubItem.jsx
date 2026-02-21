import React from "react";
import { Avatar, Badge } from "@/components/ui";

/**
 * ClubItem - Item de lista de clubes
 */
export default function ClubItem({ club, last }) {
  return (
    <div className={`grid grid-cols-[72px_1fr] gap-4 p-4 ${!last ? "border-b border-white/10" : ""}`}>
      <img 
        src={club.thumb} 
        alt={club.name} 
        className="h-16 w-16 rounded bg-black/20 object-cover border border-gold/20" 
      />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <a href="#" className="font-semibold text-foreground hover:underline hover:text-gold-light">
            {club.name}
          </a>
          {club.verified && (
            <Badge variant="success" size="sm">
              ✓
            </Badge>
          )}
        </div>
        <p 
          className="mt-1 text-sm text-muted-foreground line-clamp-2"
        >
          {club.description}
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            👥 {club.members?.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {club.online}
          </span>
          {club.url && (
            <a 
              href={club.url} 
              className="text-gold hover:underline truncate" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {club.url}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
