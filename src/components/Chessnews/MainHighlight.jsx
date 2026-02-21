import React from "react";
import { Card } from '../ui';

export default function MainHighlight() {
  return (
    <Card variant="gradient" className="p-5">
      <img
        src="assets/img/chess-highlight.png"
        alt="Destaque"
        className="rounded-xl mb-4 w-full max-h-72 object-cover border border-gold/20 shadow"
      />
      <h2 className="text-2xl font-bold text-gold-light mb-2">
        Aronian derrota Niemann e conquista o prêmio de $200.000 em Las Vegas
      </h2>
    </Card>
  );
}
