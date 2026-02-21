import { Avatar, Button } from "@/components/ui";

/**
 * FriendItem - Item de lista de amigos
 */
export default function FriendItem({ avatar, name, username, flag, onWatch }) {
  return (
    <div className="flex items-center justify-between py-3 px-3 mb-1 rounded-xl bg-surface-secondary/60 border border-gold/20 shadow-lg hover:scale-[1.015] transition-all duration-200">
      <div className="flex items-center gap-3">
        <Avatar src={avatar} alt={username} size="lg" />
        <div>
          <p className="font-bold flex items-center gap-1 text-foreground">
            {username}
            {flag && (
              <img 
                src={flag} 
                alt="" 
                className="w-4 h-4 rounded-sm border border-gold/40" 
              />
            )}
          </p>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {onWatch && (
          <Button variant="secondary" size="sm" onClick={onWatch}>
            Assistir
          </Button>
        )}
        <Button variant="secondary" size="icon" className="text-lg">
          ♟️
        </Button>
        <Button variant="secondary" size="icon" className="text-lg">
          📧
        </Button>
      </div>
    </div>
  );
}
