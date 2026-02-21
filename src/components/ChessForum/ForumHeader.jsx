export default function ForumHeader() {
  return (
    <div className="border-b border-gold/20 bg-surface-secondary/80 shadow">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-light/10 border border-gold/30 text-2xl">
          💬
        </span>
        <h1 className="text-3xl font-bold text-gold-light drop-shadow">Fóruns</h1>
      </div>
    </div>
  );
}
