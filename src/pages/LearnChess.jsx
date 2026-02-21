
import Navbar from "../components/Navbar";
import ChessBoard from "../components/LearnChess/ChessBoard";
import InstructorSpeech from "../components/LearnChess/InstructorSpeech";
import LessonList from "../components/LearnChess/LessonList";
import NextLessonButton from "../components/LearnChess/NextLessonButton";

export default function LearnChess() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center w-full py-8">
        <div className="w-full max-w-[1600px] flex flex-col lg:flex-row items-center justify-center gap-0 lg:gap-16 px-2 md:px-12">
          {/* Coluna do tabuleiro */}
          <div className="flex flex-col items-center w-full lg:w-auto">
            <ChessBoard />
          </div>
          {/* Sidebar */}
          <div className="mt-8 lg:mt-0 lg:ml-8 flex-shrink-0 w-full lg:w-auto">
            <aside className="w-full max-w-lg mx-auto bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] p-6 md:p-8 flex flex-col gap-8 rounded-2xl shadow-2xl border border-[#c29d5d]/30">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#5b3f19] text-xs font-bold px-2 py-1 rounded-full">Aula</span>
                <h2 className="text-xl font-semibold text-[#e7c27d] drop-shadow">Lição de Xadrez</h2>
              </div>

              {/* Avatar e fala do instrutor */}
              <div className="flex items-start gap-3">
                <InstructorSpeech
                  avatar="/assets/instructor.png"
                  text="O que acontece quando você fica sem lances, mas não está em xeque?"
                />
              </div>

              {/* Lista de lições */}
              <LessonList />

              {/* Botão principal */}
              <NextLessonButton />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
