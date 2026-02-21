import { PageLayout } from "@/components/layout";
import { Card, Container } from "@/components/ui";
import ChessBoard from "@/components/LearnChess/ChessBoard";
import InstructorSpeech from "@/components/LearnChess/InstructorSpeech";
import LessonList from "@/components/LearnChess/LessonList";
import NextLessonButton from "@/components/LearnChess/NextLessonButton";

function LearnSidebar() {
  return (
    <Card variant="gradient" className="w-full max-w-lg p-8 flex flex-col gap-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-gold/30 text-xs font-bold px-2 py-1 rounded-full text-gold-light">Aula</span>
        <h2 className="text-xl font-semibold text-gold-light drop-shadow">Lição de Xadrez</h2>
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
    </Card>
  );
}

export default function LearnChess() {
  return (
    <PageLayout showFooter={false}>
      <Container size="wide" className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Tabuleiro */}
          <div className="flex flex-col items-center w-full md:w-auto">
            <ChessBoard />
          </div>
          
          {/* Sidebar */}
          <div className="mt-8 md:mt-0">
            <LearnSidebar />
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
