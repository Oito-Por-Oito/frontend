import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeart, FaGithub, FaPaypal, FaCreditCard, FaCheck, FaCoffee, FaDollarSign } from "react-icons/fa";

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  const donationAmounts = [5, 10, 25, 50, 100];

  const donationMethods = [
    { 
      icon: <FaGithub size={32} />, 
      name: "GitHub Sponsors", 
      description: "Apoie através do GitHub Sponsors",
      link: "https://github.com/sponsors/oitoporoito",
      color: "from-gray-700 to-gray-800",
      hoverColor: "hover:from-gray-600 hover:to-gray-700"
    },
    { 
      icon: <FaHeart size={32} />, 
      name: "Patreon", 
      description: "Seja um Patron e receba recompensas",
      link: "#",
      color: "from-orange-600 to-red-600",
      hoverColor: "hover:from-orange-500 hover:to-red-500"
    },
    { 
      icon: <FaCoffee size={32} />, 
      name: "Ko-fi", 
      description: "Compre um café para nós",
      link: "#",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-400 hover:to-blue-500"
    },
    { 
      icon: <FaPaypal size={32} />, 
      name: "PayPal", 
      description: "Doação via PayPal",
      link: "#",
      color: "from-blue-600 to-blue-700",
      hoverColor: "hover:from-blue-500 hover:to-blue-600"
    },
    { 
      icon: <FaDollarSign size={32} />, 
      name: "PIX", 
      description: "Doação via PIX (Brasil)",
      link: "#",
      color: "from-teal-500 to-teal-600",
      hoverColor: "hover:from-teal-400 hover:to-teal-500"
    },
    { 
      icon: <FaCreditCard size={32} />, 
      name: "Cartão de Crédito", 
      description: "Doação com cartão",
      link: "#",
      color: "from-purple-600 to-purple-700",
      hoverColor: "hover:from-purple-500 hover:to-purple-600"
    },
  ];

  const benefits = [
    "Ajuda a manter o projeto gratuito e open-source",
    "Suporta o desenvolvimento de novas funcionalidades",
    "Contribui para melhorias de infraestrutura",
    "Incentiva a comunidade de xadrez brasileira",
    "Garante atualizações constantes e suporte"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="flex items-center gap-3 mb-4">
            <FaHeart className="text-red-500 animate-pulse" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold text-[#e7c27d] drop-shadow-lg">
              Apoie o Oito Por Oito
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl">
            Sua contribuição ajuda a manter este projeto vivo e acessível para todos os amantes de xadrez.
          </p>
        </header>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Métodos de Doação */}
          <div className="lg:col-span-2 space-y-8">
            {/* Seleção de Valor */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-8 shadow-2xl border border-[#c29d5d]/20">
              <h2 className="text-2xl font-bold text-[#e7c27d] mb-6">Escolha um Valor</h2>
              
              {/* Valores Predefinidos */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-6">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                      selectedAmount === amount
                        ? "bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black shadow-lg scale-105"
                        : "bg-[#1f1f1f] text-[#c29d5d] hover:bg-[#2c2c2c] border border-[#c29d5d]/30"
                    }`}
                  >
                    R$ {amount}
                  </button>
                ))}
              </div>

              {/* Valor Customizado */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#c29d5d] mb-2">
                  Ou insira um valor personalizado:
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#c29d5d] font-bold text-lg">
                    R$
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 bg-[#1f1f1f] border border-[#c29d5d]/30 rounded-xl text-white text-lg focus:outline-none focus:border-[#e7c27d] transition-all"
                  />
                </div>
              </div>

              {/* Mensagem de Valor Selecionado */}
              {(selectedAmount || customAmount) && (
                <div className="bg-[#c29d5d]/10 border border-[#c29d5d]/30 rounded-xl p-4 text-center">
                  <p className="text-[#e7c27d] font-semibold">
                    Valor selecionado: R$ {selectedAmount || customAmount}
                  </p>
                </div>
              )}
            </div>

            {/* Métodos de Doação */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-8 shadow-2xl border border-[#c29d5d]/20">
              <h2 className="text-2xl font-bold text-[#e7c27d] mb-6">Escolha o Método de Pagamento</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {donationMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gradient-to-br ${method.color} ${method.hoverColor} rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-200 hover:scale-105 shadow-lg cursor-pointer`}
                  >
                    <div className="text-white">
                      {method.icon}
                    </div>
                    <h3 className="text-white font-bold text-lg text-center">
                      {method.name}
                    </h3>
                    <p className="text-gray-200 text-sm text-center">
                      {method.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            {/* Outras Formas de Contribuir */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-8 shadow-2xl border border-[#c29d5d]/20">
              <h2 className="text-2xl font-bold text-[#e7c27d] mb-4">Outras Formas de Contribuir</h2>
              <div className="space-y-3 text-gray-300">
                <p>💻 <strong className="text-[#e7c27d]">Contribua com código:</strong> Ajude no desenvolvimento através do GitHub</p>
                <p>📢 <strong className="text-[#e7c27d]">Divulgue o projeto:</strong> Compartilhe com amigos e nas redes sociais</p>
                <p>🐛 <strong className="text-[#e7c27d]">Reporte bugs:</strong> Ajude a melhorar a plataforma reportando problemas</p>
                <p>📝 <strong className="text-[#e7c27d]">Melhore a documentação:</strong> Contribua com tutoriais e guias</p>
                <p>⭐ <strong className="text-[#e7c27d]">Dê uma estrela no GitHub:</strong> Apoio simples mas valioso!</p>
              </div>
            </div>
          </div>

          {/* Sidebar Direita - Benefícios */}
          <div className="space-y-8">
            {/* Por que Doar */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-6 shadow-2xl border border-[#c29d5d]/20">
              <h3 className="text-xl font-bold text-[#e7c27d] mb-4 flex items-center gap-2">
                <FaHeart className="text-red-500" />
                Por que Doar?
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Estatísticas do Projeto */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-6 shadow-2xl border border-[#c29d5d]/20">
              <h3 className="text-xl font-bold text-[#e7c27d] mb-4">Impacto do Projeto</h3>
              <div className="space-y-4">
                <div className="bg-[#1f1f1f] rounded-lg p-4 border border-[#c29d5d]/20">
                  <div className="text-3xl font-bold text-[#e7c27d]">10k+</div>
                  <div className="text-sm text-gray-400">Usuários Ativos</div>
                </div>
                <div className="bg-[#1f1f1f] rounded-lg p-4 border border-[#c29d5d]/20">
                  <div className="text-3xl font-bold text-[#e7c27d]">50k+</div>
                  <div className="text-sm text-gray-400">Partidas Jogadas</div>
                </div>
                <div className="bg-[#1f1f1f] rounded-lg p-4 border border-[#c29d5d]/20">
                  <div className="text-3xl font-bold text-[#e7c27d]">100%</div>
                  <div className="text-sm text-gray-400">Open Source</div>
                </div>
              </div>
            </div>

            {/* Transparência */}
            <div className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-6 shadow-2xl border border-[#c29d5d]/20">
              <h3 className="text-xl font-bold text-[#e7c27d] mb-4">Transparência</h3>
              <p className="text-gray-300 text-sm mb-4">
                Todas as doações são utilizadas exclusivamente para:
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Hospedagem e infraestrutura</li>
                <li>• Desenvolvimento de features</li>
                <li>• Manutenção e suporte</li>
                <li>• Materiais educacionais</li>
              </ul>
            </div>

            {/* Agradecimento */}
            <div className="bg-gradient-to-br from-[#c29d5d]/20 to-[#e7c27d]/10 rounded-2xl p-6 shadow-2xl border border-[#c29d5d]/30 text-center">
              <FaHeart className="text-red-500 mx-auto mb-3 animate-pulse" size={32} />
              <h3 className="text-xl font-bold text-[#e7c27d] mb-2">Muito Obrigado!</h3>
              <p className="text-gray-300 text-sm">
                Cada contribuição faz a diferença e ajuda a construir uma comunidade de xadrez mais forte.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
