import React from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { Card, Button } from "@/components/ui";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <Card variant="gradient" className="max-w-lg w-full flex flex-col items-center text-center p-6 sm:p-8 border-t-2 border-b-2 border-gold/30">
          <img
            src="/assets/logo-oitoporoito.png"
            alt="OitoPorOito Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 mb-4 drop-shadow-lg"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold mb-4">
            404
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            Página não encontrada
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8">
            Ops! Parece que você se perdeu no tabuleiro.{" "}
            <br className="hidden sm:block" />
            A página que você procura não existe ou foi movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto"
            >
              Voltar para o início
            </Button>
            <Button
              variant="outline"
              size="lg"
              as="a"
              href="mailto:suporte@oitoporoito.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              Contatar suporte
            </Button>
          </div>
        </Card>
      </main>
    </PageLayout>
  );
}
