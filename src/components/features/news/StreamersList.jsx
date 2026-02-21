import { FaTwitch } from "react-icons/fa";
import { Card, Avatar, Button } from "@/components/ui";

const DEFAULT_STREAMERS = [
  { name: "rachangel", viewers: 1291, img: "/assets/img/rachangel.jpg" },
  { name: "SpeedChessTwitch", viewers: 213, img: "/assets/img/SpeedChessSTR.png" },
  { name: "Zurability", viewers: 98, img: "/assets/img/Zurability.jpeg" },
  { name: "GothamChess", viewers: 350, img: "/assets/img/GothamChess.png" },
  { name: "dinabelenkaya", viewers: 185, img: "/assets/img/dina.png" },
];

/**
 * StreamersList - Lista de streamers ao vivo
 */
export default function StreamersList({ streamers = DEFAULT_STREAMERS }) {
  return (
    <Card variant="elevated">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gold">
          Streamers <span className="text-foreground">({streamers.length})</span>
        </h2>
        <span className="cursor-pointer text-gold hover:text-gold-light transition-colors">▶</span>
      </div>

      {/* Lista de Streamers */}
      <div className="space-y-1">
        {streamers.map((s, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between py-2 hover:bg-surface-secondary px-3 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Avatar src={s.img} alt={s.name} size="sm" />
              <span className="font-medium text-foreground">{s.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-semibold">{s.viewers}</span>
              <FaTwitch className="w-4 h-4 text-[#9147ff]" title="Twitch" />
            </div>
          </div>
        ))}
      </div>

      {/* Botão Mais */}
      <div className="text-center mt-3">
        <Button variant="ghost" size="sm">
          Mais ▼
        </Button>
      </div>
    </Card>
  );
}
