export default function ForumHeader() {
  return (
    <div className="border-b border-[#c29d5d]/20 bg-[#232526]/80 shadow">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7c27d]/10 border border-[#c29d5d]/30 text-2xl">💬</span>
        <h1 className="text-xl sm:text-3xl font-bold text-[#e7c27d] drop-shadow">Fóruns</h1>
      </div>
    </div>
  );
}
