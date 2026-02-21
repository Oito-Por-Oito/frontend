import ActionButton from "../../components/ChessFriends/ActionButton";
import { FaUserFriends } from "react-icons/fa";
import SearchBar from "../../components/ChessFriends/SearchBar";
import FriendList from "../../components/ChessFriends/FriendList";
import RankingPanel from "../../components/ChessFriends/RankingPanel";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";

export default function ChessFriends() {
  const [search, setSearch] = useState("");
  const friends = [
    { avatar: "/avatars/kasparov.png", name: "aurelio halkida", username: "kasparovjn", flag: "/flags/gr.png" },
    { avatar: "/avatars/magpie.png", name: "Yaki", username: "Magpie_0-0", flag: "/flags/eng.png" },
    { avatar: "/avatars/spenderw.png", name: "Spender W.", username: "spenderw", flag: "/flags/br.png" }
  ];
  const rankings = [
    {
      title: "Blitz",
      players: [
        { username: "spenderw", points: 146, avatar: "/avatars/spenderw.png" },
        { username: "kasparovjn", points: 100, avatar: "/avatars/kasparov.png" }
      ]
    },
    {
      title: "Bullet",
      players: [
        { username: "Magpie_0-0", points: 120, avatar: "/avatars/magpie.png" }
      ]
    },
    {
      title: "Rápida",
      players: [
        { username: "kasparovjn", points: 180, avatar: "/avatars/kasparov.png" },
        { username: "spenderw", points: 150, avatar: "/avatars/spenderw.png" }
      ]
    },
    {
      title: "Xadrez Diário",
      players: [
        { username: "Magpie_0-0", points: 200, avatar: "/avatars/magpie.png" },
        { username: "kasparovjn", points: 170, avatar: "/avatars/kasparov.png" }
      ]
    },
    {
      title: "Problemas",
      players: [
        { username: "spenderw", points: 95, avatar: "/avatars/spenderw.png" },
        { username: "Magpie_0-0", points: 80, avatar: "/avatars/magpie.png" }
      ]
    }
  ];

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col lg:flex-row gap-8 px-2 sm:px-4 md:px-8 lg:px-16 py-8 max-w-7xl w-full mx-auto">
        {/* Coluna esquerda */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="bg-[#181818]/90 border border-[#c29d5d]/20 shadow-lg p-6 rounded-2xl">
            <div className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] rounded-2xl shadow-xl border-t-2 border-b-2 border-[#c29d5d]/30 px-6 py-4 flex items-center gap-3 mb-6">
              <span className="bg-[#444] p-2 rounded-full border border-[#c29d5d]/40 flex items-center justify-center">
                <FaUserFriends className="w-7 h-7 text-[#e7c27d] drop-shadow" />
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-[#e7c27d] drop-shadow">Amigos</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <ActionButton icon="🔗" text="Link de Amizade" />
              <ActionButton icon="📘" text="Encontre Amigos do Facebook" />
              <ActionButton icon="✉️" text="Enviar Email de Convite" />
              <ActionButton icon="🎯" text="Criar Link de Desafio" />
            </div>
            <SearchBar value={search} onChange={e => setSearch(e.target.value)} />
            <FriendList friends={filteredFriends} onWatch={() => alert("Assistindo...")} />
          </div>
        </div>
        {/* Coluna direita (Sidebar) */}
        <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-8">
          <RankingPanel rankings={rankings} />
        </aside>
      </main>
      <Footer />
    </div>
  );
}
