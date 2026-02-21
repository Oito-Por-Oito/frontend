import { useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { PageLayout, MainLayout } from "@/components/layout";
import { Card } from "@/components/ui";
import ActionButton from "@/components/ChessFriends/ActionButton";
import SearchBar from "@/components/ChessFriends/SearchBar";
import FriendList from "@/components/ChessFriends/FriendList";
import RankingPanel from "@/components/ChessFriends/RankingPanel";

const FRIENDS_DATA = [
  { avatar: "/avatars/kasparov.png", name: "aurelio halkida", username: "kasparovjn", flag: "/flags/gr.png" },
  { avatar: "/avatars/magpie.png", name: "Yaki", username: "Magpie_0-0", flag: "/flags/eng.png" },
  { avatar: "/avatars/spenderw.png", name: "Spender W.", username: "spenderw", flag: "/flags/br.png" }
];

const RANKINGS_DATA = [
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

function FriendsHeader() {
  return (
    <div className="bg-gradient-to-r from-surface-secondary via-surface-primary to-surface-secondary rounded-2xl shadow-xl border-t-2 border-b-2 border-gold/30 px-6 py-4 flex items-center gap-3 mb-6">
      <span className="bg-surface-tertiary p-2 rounded-full border border-gold/40 flex items-center justify-center">
        <FaUserFriends className="w-7 h-7 text-gold-light drop-shadow" />
      </span>
      <h1 className="text-2xl md:text-3xl font-bold text-gold-light drop-shadow">Amigos</h1>
    </div>
  );
}

export default function ChessFriends() {
  const [search, setSearch] = useState("");

  const filteredFriends = FRIENDS_DATA.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout>
      <MainLayout sidebar={<RankingPanel rankings={RANKINGS_DATA} />}>
        <Card variant="elevated">
          <FriendsHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <ActionButton icon="🔗" text="Link de Amizade" />
            <ActionButton icon="📘" text="Encontre Amigos do Facebook" />
            <ActionButton icon="✉️" text="Enviar Email de Convite" />
            <ActionButton icon="🎯" text="Criar Link de Desafio" />
          </div>
          <SearchBar value={search} onChange={e => setSearch(e.target.value)} />
          <FriendList friends={filteredFriends} onWatch={() => alert("Assistindo...")} />
        </Card>
      </MainLayout>
    </PageLayout>
  );
}
