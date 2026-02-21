export default function Header() {
	return (
		<div className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] rounded-2xl shadow-xl border-t-2 border-b-2 border-[#c29d5d]/30 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 mb-2">
			<span className="h-10 w-10 rounded-full grid place-items-center bg-white/10 text-2xl" aria-label="Membros"><span role="img" aria-label="Globo">🌍</span></span>
			<h1 className="text-2xl md:text-3xl font-bold text-[#e7c27d] drop-shadow">Membros</h1>
		</div>
	);
}
