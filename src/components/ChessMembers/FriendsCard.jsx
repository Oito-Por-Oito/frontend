export default function FriendsCard(){
	return (
		<div className="rounded-xl bg-[#232526]/80 border border-[#c29d5d]/20">
			<div className="px-4 py-3 flex items-center justify-between border-b border-[#c29d5d]/20">
				<h3 className="font-semibold text-[#e7c27d]">Amigos <span className="text-[#e7c27d]/60 text-sm">(0)</span></h3>
				<span className="text-[#e7c27d]/80">▸</span>
			</div>
			<div className="p-3 grid grid-cols-2 gap-3">
				<button className="rounded bg-[#181818] border border-[#c29d5d]/20 py-2 text-[#e7c27d] font-semibold hover:bg-[#232526]">Encontrar</button>
				<button className="rounded bg-[#181818] border border-[#c29d5d]/20 py-2 text-[#e7c27d] font-semibold hover:bg-[#232526]">Convidar</button>
			</div>
		</div>
	);
}
