const titled = [
	{ id:1, title:'NM', user:'Coach_Fearless_King2', country:'🇵🇰', badges:['♟️'], real:'Yousaf Azeem Makhdoomi', online:true, avatar:'/assets/u1.jpg' },
	{ id:2, title:'FM', user:'ChessMaster123', country:'🇧🇷', badges:['🏆'], real:'Carlos Silva', online:true, avatar:'/assets/u2.jpg' },
	{ id:3, title:'IM', user:'QueenAttack', country:'🇺🇸', badges:['♟️'], real:'Anna Smith', online:false, avatar:'/assets/u3.jpg' },
	{ id:4, title:'GM', user:'KingCrusher', country:'🇷🇺', badges:['🏆'], real:'Ivan Petrov', online:true, avatar:'/assets/u4.jpg' },
	{ id:5, title:'WGM', user:'ChessQueen', country:'🇮🇳', badges:['♟️'], real:'Priya Patel', online:false, avatar:'/assets/u5.jpg' },
	{ id:6, title:'CM', user:'KnightRider', country:'🇫🇷', badges:['♟️'], real:'Jean Dupont', online:true, avatar:'/assets/u6.jpg' },
	{ id:7, title:'NM', user:'BishopBlitz', country:'🇩🇪', badges:['♟️'], real:'Hans Müller', online:true, avatar:'/assets/u7.jpg' },
	{ id:8, title:'FM', user:'PawnStorm', country:'🇪🇸', badges:['🏆'], real:'Miguel Torres', online:false, avatar:'/assets/u8.jpg' },
	{ id:9, title:'IM', user:'RookRoller', country:'🇬🇧', badges:['♟️'], real:'Emily Clark', online:true, avatar:'/assets/u9.jpg' },
	{ id:10, title:'GM', user:'EndgameKing', country:'🇨🇳', badges:['🏆'], real:'Li Wei', online:true, avatar:'/assets/u10.jpg' },
	{ id:11, title:'WGM', user:'QueenGambit', country:'🇺🇦', badges:['♟️'], real:'Olga Ivanova', online:false, avatar:'/assets/u11.jpg' },
	{ id:12, title:'CM', user:'CheckmatePro', country:'🇮🇹', badges:['♟️'], real:'Luca Rossi', online:true, avatar:'/assets/u12.jpg' },
];

function PlayerRow({p}) {
	return (
		<li className="flex items-start gap-3 py-3">
			<img src={p.avatar} alt={p.user} className="h-10 w-10 rounded object-cover" />
			<div className="min-w-0">
				<div className="flex items-center gap-2">
					<span className="px-1.5 py-0.5 text-[11px] rounded bg-black/30">{p.title}</span>
					<a className="font-semibold hover:underline truncate" tabIndex={0}>{p.user}</a>
					<span className="text-sm">{p.country}</span>
					{p.badges?.map((b,i)=><span key={i}>{b}</span>)}
					{p.online && <span className="ml-1 h-2 w-2 rounded-full bg-emerald-400" aria-label="Online" />}
				</div>
				<div className="text-sm text-gray-300 truncate">{p.real}</div>
			</div>
		</li>
	);
}

export default function TitledPlayers(){
	return (
		<div className="rounded-2xl bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] border-t-2 border-b-2 border-[#c29d5d]/30 overflow-hidden shadow-xl">
			<div className="px-4 py-3 flex items-center justify-between bg-black/20">
				<h2 className="font-semibold text-[#e7c27d] text-lg">Jogadores titulados</h2>
				<span className="text-sm text-[#e7c27d]/80">(359 Online)</span>
			</div>

			<div className="grid md:grid-cols-2 gap-x-8 px-4">
				<ul className="divide-y divide-white/10">
					{titled.slice(0,6).map(p => <PlayerRow key={p.id} p={p} />)}
				</ul>
				<ul className="divide-y divide-white/10">
					{titled.slice(6,12).map(p => <PlayerRow key={p.id} p={p} />)}
				</ul>
			</div>

			<div className="px-4 py-2 border-t border-[#c29d5d]/20 text-right">
				<button className="text-sm text-[#e7c27d] hover:text-white">Ver mais ▸</button>
			</div>
		</div>
	);
}
