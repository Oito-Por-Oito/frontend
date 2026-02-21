import { FaUniversity, FaCompass, FaChessPawn, FaBullseye, FaCheck, FaMobileAlt, FaChild, FaVideo, FaChessRook, FaFont, FaChessQueen, FaStopwatch, FaShoppingCart, FaGift, FaTshirt, FaTrophy } from "react-icons/fa";
import { PageLayout, MainLayout } from "@/components/layout";
import SocialHeader from "@/components/ChessMore/MoreHeader";
import SocialCardsGrid from "@/components/ChessMore/MoreCardsGrid";

const cards = [
  { icon: <FaUniversity size={40} />, title: "Biblioteca", description: "Salve partidas em coleções para estudar depois", color: "bg-yellow-600" },
  { icon: <FaCompass size={40} />, title: "Explorador", description: "Explore lances de mestres ou os seus", color: "bg-gray-600" },
  { icon: <FaChessPawn size={40} />, title: "Xadrez Solo", description: "Capture peças na ordem correta para vencer", color: "bg-green-700" },
  { icon: <FaBullseye size={40} />, title: "Visão", description: "Melhore sua leitura do tabuleiro", color: "bg-orange-700" },
  { icon: <FaCheck size={40} />, title: "Xadrez por Votação", description: "Vote com sua equipe para fazer um lance", color: "bg-green-600" },
  { icon: <FaMobileAlt size={40} />, title: "Aplicativos de Celular", description: "Jogue no Chess.com em qualquer lugar", color: "bg-blue-700" },
  { icon: <FaChild size={40} />, title: "ChessKid", description: "O maior app de xadrez para crianças", color: "bg-green-500" },
  { icon: <FaVideo size={40} />, title: "Vídeos", description: "Assista aos vídeos dos melhores treinadores", color: "bg-gray-700" },
  { icon: <FaChessRook size={40} />, title: "Partidas de Mestres", description: "Explore milhões de partidas históricas", color: "bg-yellow-600" },
  { icon: <FaFont size={40} />, title: "Termos de Xadrez", description: "Aprenda a terminologia do xadrez", color: "bg-gray-500" },
  { icon: <FaChessQueen size={40} />, title: "Regras e Fundamentos", description: "Aprenda as regras básicas", color: "bg-purple-700" },
  { icon: <FaStopwatch size={40} />, title: "Ferramentas", description: "Acesse mais ferramentas e apps", color: "bg-blue-600" },
  { icon: <FaShoppingCart size={40} />, title: "Loja", description: "Compre conjuntos e acessórios", color: "bg-green-700" },
  { icon: <FaGift size={40} />, title: "Presentear", description: "Dê um presente do Chess.com", color: "bg-green-500" },
  { icon: <FaTshirt size={40} />, title: "Produtos", description: "Produtos com o visual do Chess.com", color: "bg-blue-500" },
  { icon: <FaTrophy size={40} />, title: "Campeonato de Computadores", description: "Assista máquinas lutando", color: "bg-gray-700" },
];

export default function ChessMore() {
  return (
    <PageLayout>
      <MainLayout.Centered maxWidth="default">
        <SocialHeader />
        <SocialCardsGrid cards={cards} />
      </MainLayout.Centered>
    </PageLayout>
  );
}
