// components/Footer.jsx
import {
  FaApple,
  FaAndroid,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
  FaTwitch,
  FaInstagram,
  FaDiscord,
} from 'react-icons/fa6';
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] text-gray-300 text-[15px] py-10 px-4 sm:px-6 flex flex-col items-center space-y-7 shadow-xl border-gray-800 w-full"
    >
      <div className="flex justify-center mb-2">
        <img src="/assets/logo.png" alt="Logo OitoPorOito" className="h-12 w-auto drop-shadow-lg rounded-full bg-[#232526] p-1 border border-[#c29d5d]" />
      </div>

      <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400">
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Suporte</a>
        <span className="mx-1 text-gray-600">•</span>
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Idioma</a>
        <span className="mx-1 text-gray-600">•</span>
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Vagas</a>
        <span className="mx-1 text-gray-600">•</span>
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Desenvolvedores</a>
        <span className="mx-1 text-gray-600">•</span>
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Contrato de Usuário</a>
        <span className="mx-1 text-gray-600">•</span>
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Política de privacidade</a>
        <span className="mx-1 text-gray-600">•</span>
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Configurações de Privacidade</a>
        <span className="mx-1 text-gray-600">•</span>
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Jogo Limpo</a>
        <span className="mx-1 text-gray-600">•</span>
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Parceiros</a>
        <span className="mx-1 text-gray-600">•</span>
        <a href="#" className="hover:text-[#c29d5d] transition-colors">Conformidade</a>
        <span className="mx-1 text-gray-600">•</span>
        <span className="font-semibold text-[#c29d5d]">OitoPorOito.com © 2025</span>
      </div>

      <div className="flex space-x-5 text-2xl text-gray-300">
        <FaApple className="hover:text-[#c29d5d] hover:scale-110 hover:bg-[#232526] hover:shadow-md transition-all cursor-pointer rounded-full p-1" />
        <FaAndroid className="hover:text-[#c29d5d] hover:scale-110 hover:bg-[#232526] hover:shadow-md transition-all cursor-pointer rounded-full p-1" />
        <FaTiktok className="hover:text-[#c29d5d] hover:scale-110 hover:bg-[#232526] hover:shadow-md transition-all cursor-pointer rounded-full p-1" />
        <FaXTwitter className="hover:text-[#c29d5d] hover:scale-110 hover:bg-[#232526] hover:shadow-md transition-all cursor-pointer rounded-full p-1" />
        <FaYoutube className="hover:text-[#c29d5d] hover:scale-110 hover:bg-[#232526] hover:shadow-md transition-all cursor-pointer rounded-full p-1" />
        <FaTwitch className="hover:text-[#c29d5d] hover:scale-110 hover:bg-[#232526] hover:shadow-md transition-all cursor-pointer rounded-full p-1" />
        <FaInstagram className="hover:text-[#c29d5d] hover:scale-110 hover:bg-[#232526] hover:shadow-md transition-all cursor-pointer rounded-full p-1" />
        <FaDiscord className="hover:text-[#c29d5d] hover:scale-110 hover:bg-[#232526] hover:shadow-md transition-all cursor-pointer rounded-full p-1" />
      </div>
    </motion.footer>
  );
}
