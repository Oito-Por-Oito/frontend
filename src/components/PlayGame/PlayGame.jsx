
import React from "react";
import { motion } from "framer-motion";
import PlayerInfoPlay from "./PlayerInfoPlay";
import ChessBoardStatic from "./ChessBoardStatic";
import PlaySidebarMenu from "./PlaySidebarMenu";

export default function ChessHome() {
  const menuItems = [
    { title: "Jogue online", desc: "Jogar contra uma pessoa com habilidades parecidas", icon: "⚡" },
    { title: "Jogar Com Bots", desc: "Desafie um bot de Fácil até Mestre", icon: "🤖" },
    { title: "Jogar contra o Treinador", desc: "Aprenda enquanto joga com o Treinador", icon: "👨‍🏫" },
    { title: "Jogar com um amigo", desc: "Convide um amigo para uma partida de xadrez", icon: "🤝" },
    { title: "Torneios", desc: "Entre em uma Arena onde qualquer um pode vencer", icon: "🏅" },
    { title: "Variantes de Xadrez", desc: "Encontre novas formas divertidas de jogar xadrez", icon: "🎲" },
  ];

  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-0 md:gap-12 px-2 md:px-8">
      {/* Coluna do tabuleiro e infos */}
      <div className="flex flex-col items-center w-full md:w-auto">
        {/* Header do bot */}
        <PlayerInfoPlay
          avatar={"/assets/logo-oitoporoito.png"}
          name={"Gust"}
          rating={"2200"}
          flagUrl={"/assets/img/hikaru-nakamura.jpg"}
          flagAlt={"Brasil"}
          isBot={true}
        />
        {/* Tabuleiro */}
        <ChessBoardStatic />
        {/* Footer do usuário */}
        <PlayerInfoPlay
          avatar={"/assets/img/puzzle1.png"}
          name={"Guest"}
          rating={"0"}
          flagUrl={null}
          flagAlt={"Indefinida"}
          isBot={false}
        />
      </div>
      {/* Sidebar/menu */}
      <div className="flex justify-center md:justify-start w-full md:w-auto mt-8 md:mt-0 md:ml-8">
        <PlaySidebarMenu menuItems={menuItems} />
      </div>
    </div>
  );
}
