import { FaUserFriends, FaFlag, FaComments, FaGlobe, FaBlog, FaChalkboardTeacher } from "react-icons/fa";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SocialHeader from '../components/ChessSocial/SocialHeader';
import SocialCardsGrid from '../components/ChessSocial/SocialCardsGrid';

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
    <div className="min-h-screen bg-[#1f1f1f] text-white overflow-x-hidden">
      <Navbar />
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl flex flex-col items-center justify-center mx-auto">
          <SocialHeader />
          <SocialCardsGrid cards={cards} />
        </div>
      </div>
      {/* Footer */}
        <div className="mt-10">
          <Footer />
        </div>
    </div>
  );
}
