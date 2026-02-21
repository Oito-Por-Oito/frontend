export default function NextLessonButton() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        className="w-full bg-gradient-to-r from-gold-light to-gold text-surface-primary font-bold py-3 rounded-xl shadow-lg border-2 border-gold/60 hover:from-gold-lighter hover:to-gold-light hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold"
      >
        Começar Aula
      </button>
      <button
        className="w-full bg-gradient-to-r from-gold-light to-gold text-surface-primary font-bold py-3 rounded-xl shadow-lg border-2 border-gold/60 hover:from-gold-lighter hover:to-gold-light hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold"
      >
        Próxima Aula
      </button>
    </div>
  );
}
