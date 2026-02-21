import { FaUserFriends, FaFlag, FaComments, FaGlobe, FaBlog, FaChalkboardTeacher } from "react-icons/fa";
import { PageLayout, MainLayout } from "@/components/layout";
import SocialHeader from "@/components/ChessSocial/SocialHeader";
import SocialCardsGrid from "@/components/ChessSocial/SocialCardsGrid";

const cards = [
  {
    title: "Amigos",
    description: "Encontre e adicione amigos",
    icon: <FaUserFriends size={40} />,
    color: "bg-yellow-200",
  },
  {
    title: "Clubes",
    description: "Inscreva-se e jogue nos clubes",
    icon: <FaFlag size={40} />,
    color: "bg-green-700",
  },
  {
    title: "Fóruns",
    description: "Encontre respostas com a comunidade",
    icon: <FaComments size={40} />,
    color: "bg-cyan-700",
  },
  {
    title: "Membros",
    description: "Busque e encontre jogadores ao redor do mundo",
    icon: <FaGlobe size={40} />,
    color: "bg-blue-800",
  },
  {
    title: "Blogs",
    description: "Leia e melhore na sua jornada pelo xadrez",
    icon: <FaBlog size={40} />,
    color: "bg-yellow-500",
  },
  {
    title: "Treinadores",
    description: "Encontre um treinador para te ajudar a melhorar",
    icon: <FaChalkboardTeacher size={40} />,
    color: "bg-blue-400",
  },
];

export default function ChessSocial() {
  return (
    <PageLayout>
      <MainLayout.Centered maxWidth="default">
        <SocialHeader />
        <SocialCardsGrid cards={cards} />
      </MainLayout.Centered>
    </PageLayout>
  );
}
