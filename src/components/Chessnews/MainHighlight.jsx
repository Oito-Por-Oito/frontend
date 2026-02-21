import React from "react";

export default function MainHighlight() {
  return (
    <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 shadow-xl border border-[#c29d5d]/20">
      <img
        src="assets/img/chess-highlight.png"
        alt="Destaque"
        className="rounded-xl mb-4 w-full max-h-72 object-cover border border-[#c29d5d]/20 shadow"
      />
      <h2 className="text-lg sm:text-2xl font-bold text-[#e7c27d] mb-2">
        Aronian derrota Niemann e conquista o prêmio de $200.000 em Las Vegas
      </h2>
    </section>
  );
}
