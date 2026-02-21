export default function FriendItem({ avatar, name, username, flag, onWatch }) {
  return (
    <div className="flex items-center justify-between py-3 px-3 mb-1 rounded-xl bg-surface-secondary/60 border border-gold/20 shadow-lg hover:scale-[1.015] transition-all duration-200">
      <div className="flex items-center gap-3">
        <img src={avatar} alt={username} className="w-11 h-11 rounded-full border border-gold/30 bg-surface-secondary" />
        <div>
          <p className="font-bold flex items-center gap-1 text-foreground">
            {username} {flag && <img src={flag} alt="" className="w-4 h-4 rounded-sm border border-gold/40" />}
          </p>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {onWatch && (
          <button
            onClick={onWatch}
            className="bg-gradient-to-r from-surface-secondary to-surface-tertiary px-3 py-1 rounded-md text-sm font-bold text-foreground shadow hover:from-gold-light hover:to-gold hover:text-surface-primary transition-colors"
          >
            Assistir
          </button>
        )}
        <button className="bg-gradient-to-r from-surface-secondary to-surface-tertiary p-2 rounded-md text-lg text-gold-light border border-gold/30 shadow hover:bg-surface-tertiary hover:text-gold transition-colors">♟️</button>
        <button className="bg-gradient-to-r from-surface-secondary to-surface-tertiary p-2 rounded-md text-lg text-gold-light border border-gold/30 shadow hover:bg-surface-tertiary hover:text-gold transition-colors">📧</button>
      </div>
    </div>
  );
}
