export default function RankingPanel({ rankings }) {
  return (
    <div className="bg-[#232526] rounded-2xl p-4 w-full md:w-96 border-2 border-[#d4af37]/30 shadow-xl text-white">
      <h2 className="text-xl font-bold mb-4 text-[#d4af37]">Ranking dos Amigos</h2>
      {rankings.map((section) => (
        <div key={section.title} className="mb-7">
          <h3 className="font-bold mb-3 text-[#d4af37] text-lg drop-shadow">{section.title}</h3>
          <div className="rounded-xl bg-[#232526]/60 shadow-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#d4af37]">
                  <th>#</th>
                  <th>Jogador</th>
                  <th className="text-right">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(section.players) && section.players.length > 0 ? (
                  section.players.slice(0, 10).map((player, i) => (
                    <tr key={player.username} className="hover:bg-[#232526]/40 transition-colors border-b border-[#d4af37]/10 last:border-b-0">
                      <td className="py-1 px-2 font-bold text-[#d4af37]">{i + 1}</td>
                      <td className="py-1 px-2 flex items-center gap-2">
                        <img src={player.avatar} alt={player.username} className="w-7 h-7 rounded-full border border-[#d4af37]/30 bg-[#232526]" />
                        <span className="text-white font-semibold">{player.username}</span>
                      </td>
                      <td className="py-1 px-2 text-right font-bold text-[#d4af37]">{player.points}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">
                      Sem dados para esta categoria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-4">
        <button
          className="text-[#d4af37] font-semibold px-4 rounded hover:underline focus:outline-none"
          style={{ background: 'none', border: 'none' }}
        >
          Ver todos
        </button>
      </div>
    </div>
  );
}
