
import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ForumHeader from "../../components/ChessForum/ForumHeader";
import ForumSection from "../../components/ChessForum/ForumSection";
import ForumSidebar from "../../components/ChessForum/ForumSidebar";

// Mock de categorias e tópicos
const categories = [
  {
    id: "geral",
    title: "Discussão Geral sobre Xadrez",
    threads: [
      { id: 1, title: "the intellectuals of chess.com", time: "há 4 mins", replies: 2 },
      { id: 2, title: "Why when I click F...", time: "há 14 mins", replies: 50 },
      { id: 3, title: "How long until AI...", time: "há 18 mins", replies: 63 },
    ],
  },
  {
    id: "iniciantes",
    title: "Para Iniciantes",
    threads: [
      { id: 4, title: "Primeiros passos no xadrez", time: "há 2 mins", replies: 1 },
      { id: 5, title: "Como não cair em armadilhas?", time: "há 10 mins", replies: 7 },
      { id: 6, title: "Livros recomendados", time: "há 20 mins", replies: 3 },
    ],
  },
  {
    id: "partidas",
    title: "Análise de Partidas",
    threads: [
      { id: 7, title: "Minha partida contra o Stockfish", time: "há 8 mins", replies: 12 },
      { id: 8, title: "Erro no final de torre", time: "há 15 mins", replies: 5 },
      { id: 9, title: "Como melhorar cálculo?", time: "há 25 mins", replies: 9 },
    ],
  },
];

const recent = [
  { title: "why is Chess.com giving so easy puzzles?", author: "marinkatomab", time: "há 4 mins" },
  { title: "I am so bad at chess! Can someone gimme tips?", author: "ARAVARCHESS001", time: "há 5 mins" },
  { title: "Chess960: vale a pena?", author: "lucasfischer", time: "há 7 mins" },
];

export default function ChessForum() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white overflow-x-hidden">
      <Navbar />
      <ForumHeader />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 w-full">
        {/* Coluna principal */}
        <section className="space-y-6">
          {categories.map((cat) => (
            <ForumSection key={cat.id} section={cat} />
          ))}
        </section>
        {/* Sidebar */}
        <aside className="space-y-6">
          <ForumSidebar recent={recent} />
        </aside>
      </main>
      <Footer />
    </div>
  );
}
