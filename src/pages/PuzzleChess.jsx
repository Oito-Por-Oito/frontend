import { PageLayout } from "@/components/layout";
import { Card, Button, Avatar, Container } from "@/components/ui";
import { FaFire, FaCalendarAlt, FaUsers, FaBook, FaChartBar } from "react-icons/fa";
import PuzzleChessBoard from "@/components/ChessPuzzle/PuzzleChessBoard";

function PuzzleSidebar() {
  return (
    <Card variant="gradient" className="w-full max-w-lg p-8 flex flex-col gap-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-gold/30 text-xs font-bold px-2 py-1 rounded-full text-gold-light">15</span>
        <h2 className="text-xl font-semibold text-gold-light drop-shadow">Problemas</h2>
      </div>

      {/* Avatar e frase */}
      <div className="flex items-start gap-3">
        <Avatar 
          src="https://www.chess.com/bundles/web/images/user-image.007dad08.svg"
          alt="avatar"
          size="lg"
        />
        <p className="text-sm text-muted-foreground">
          Problemas são ótimos para praticar e melhorar no xadrez - e também são muito divertidos!
        </p>
      </div>

      {/* Rating e barra */}
      <div className="mb-2">
        <div className="text-2xl font-bold text-foreground">2.393</div>
        <div className="bg-surface-tertiary rounded h-2 mt-1">
          <div className="bg-green-500 h-full w-[70%] rounded"></div>
        </div>
      </div>

      {/* Botão principal */}
      <Button variant="primary" size="lg" className="w-full">
        Resolva problemas
      </Button>

      {/* Lista de modos */}
      <div className="flex flex-col gap-2 mt-2">
        <Button variant="secondary" className="justify-start">
          <FaFire className="text-orange-500 mr-2" /> Corrida de Problemas
        </Button>
        <Button variant="secondary" className="justify-start">
          <FaCalendarAlt className="text-green-400 mr-2" /> Problema Diário
        </Button>
        <Button variant="secondary" className="justify-start">
          <FaUsers className="text-green-300 mr-2" /> Batalha de Problemas
        </Button>
        <Button variant="secondary" className="justify-start">
          <FaBook className="text-blue-400 mr-2" /> Problemas Personalizados
        </Button>
      </div>

      {/* Rodapé */}
      <div className="mt-auto text-center text-gold-light hover:underline cursor-pointer text-sm flex justify-center items-center gap-1 pt-4">
        <FaChartBar /> Estatísticas
      </div>
    </Card>
  );
}

export default function PuzzleChess() {
  return (
    <PageLayout showFooter={false}>
      <Container size="wide" className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Tabuleiro */}
          <div className="flex flex-col items-center w-full md:w-auto">
            <PuzzleChessBoard />
          </div>
          
          {/* Sidebar */}
          <div className="mt-8 md:mt-0">
            <PuzzleSidebar />
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
