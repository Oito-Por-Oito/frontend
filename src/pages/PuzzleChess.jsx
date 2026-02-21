
import Navbar from "../components/Navbar";
import { FaFire, FaCalendarAlt, FaUsers, FaBook, FaChartBar } from "react-icons/fa";
import PuzzleChessBoard from "../components/ChessPuzzle/PuzzleChessBoard";



export default function PuzzleChess() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] text-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center w-full py-8">
        <div className="w-full max-w-[1600px] flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-16 px-2 md:px-12">
          {/* Coluna do tabuleiro e infos */}
          <div className="flex flex-col items-center w-full lg:w-auto">
            {/* Tabuleiro */}
            <PuzzleChessBoard />
          </div>
          {/* Sidebar */}
          <div className="mt-8 lg:mt-0 lg:ml-8 flex-shrink-0 w-full lg:w-auto">
            <aside className="w-full max-w-lg mx-auto bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] p-6 md:p-8 flex flex-col gap-8 rounded-2xl shadow-2xl border border-[#c29d5d]/30">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#5b3f19] text-xs font-bold px-2 py-1 rounded-full">15</span>
                <h2 className="text-xl font-semibold text-[#e7c27d] drop-shadow">Problemas</h2>
              </div>

              {/* Avatar e frase */}
              <div className="flex items-start gap-3">
                <img
                  src="https://www.chess.com/bundles/web/images/user-image.007dad08.svg"
                  alt="avatar"
                  className="w-12 h-12 rounded-full border border-[#c29d5d]/40 bg-[#232526] shadow"
                />
                <p className="text-sm text-gray-300">
                  Problemas são ótimos para praticar e melhorar no xadrez - e também são muito divertidos!
                </p>
              </div>

              {/* Rating e barra */}
              <div className="mb-2">
                <div className="text-2xl font-bold text-white">2.393</div>
                <div className="bg-gray-700 rounded h-2 mt-1">
                  <div className="bg-green-500 h-full w-[70%] rounded"></div>
                </div>
              </div>

              {/* Botão principal */}
              <button className="bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] hover:from-[#ffe7b3] hover:to-[#e7c27d] transition-colors text-black font-semibold py-2 rounded-xl text-center shadow-lg">
                Resolva problemas
              </button>

              {/* Lista de modos */}
              <div className="flex flex-col gap-2 mt-2">
                <button className="bg-[#232526] hover:bg-[#333] flex items-center gap-2 p-2 rounded-xl text-left border border-[#c29d5d]/20 shadow">
                  <FaFire className="text-orange-500" /> Corrida de Problemas
                </button>
                <button className="bg-[#232526] hover:bg-[#333] flex items-center gap-2 p-2 rounded-xl text-left border border-[#c29d5d]/20 shadow">
                  <FaCalendarAlt className="text-green-400" /> Problema Diário
                </button>
                <button className="bg-[#232526] hover:bg-[#333] flex items-center gap-2 p-2 rounded-xl text-left border border-[#c29d5d]/20 shadow">
                  <FaUsers className="text-green-300" /> Batalha de Problemas
                </button>
                <button className="bg-[#232526] hover:bg-[#333] flex items-center gap-2 p-2 rounded-xl text-left border border-[#c29d5d]/20 shadow">
                  <FaBook className="text-blue-400" /> Problemas Personalizados
                </button>
              </div>

              {/* Rodapé */}
              <div className="mt-auto text-center text-[#e7c27d] hover:underline cursor-pointer text-sm flex justify-center items-center gap-1 pt-4">
                <FaChartBar /> Estatísticas
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
