import { FaTwitch } from "react-icons/fa";

export default function StreamersList() {
  const streamers = [
    { name: "rachangel", viewers: 1291, img: "/assets/img/rachangel.jpg" },
    { name: "SpeedChessTwitch", viewers: 213, img: "/assets/img/SpeedChessSTR.png" },
    { name: "Zurability", viewers: 98, img: "/assets/img/Zurability.jpeg" },
    { name: "GothamChess", viewers: 350, img: "/assets/img/GothamChess.png" },
    { name: "dinabelenkaya", viewers: 185, img: "/assets/img/dina.png" },
  ];

  return (
    <div className="bg-[#181818]/90 border border-[#c29d5d]/20 shadow-lg p-6 rounded-2xl">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#c29d5d]">Streamers <span className="text-white">({streamers.length})</span></h2>
        <span className="cursor-pointer text-[#c29d5d]">▶</span>
      </div>

      {/* Lista de Streamers */}
      {streamers.map((s, i) => (
        <div key={i} className="flex items-center justify-between py-2 hover:bg-[#232526] px-3 rounded transition-colors">
          <div className="flex items-center gap-3">
            <img src={s.img} alt={s.name} className="w-7 h-7 rounded-full object-cover border border-[#c29d5d]/40" />
            <span className="font-medium text-white">{s.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 font-semibold">{s.viewers}</span>
            <FaTwitch className="w-4 h-4 text-[#9147ff]" title="Twitch" />
          </div>
        </div>
      ))}

      {/* Botão Mais */}
      <div className="text-center mt-3">
        <button className="text-gray-400 text-sm hover:text-[#c29d5d] transition-colors">Mais ▼</button>
      </div>
    </div>
  );
}
