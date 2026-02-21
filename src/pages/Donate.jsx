import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Crown, Star, Shield, Zap, Users,
  Copy, Check, CreditCard, Globe, Lock, ExternalLink,
  ChevronDown, ChevronUp, Info,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import Card from '@/components/ui/Card';

// ─── Constantes (fora do componente para evitar recriação a cada render) ──────

const RECENT_PATRONS = [
  { name: 'GrandMaster_BR', emoji: '♟️', time: '2 min atrás' },
  { name: 'XadrezLover99', emoji: '⚡', time: '8 min atrás' },
  { name: 'TorreDoRei', emoji: '🏰', time: '15 min atrás' },
  { name: 'PeaoCoroado', emoji: '👑', time: '22 min atrás' },
  { name: 'BishopMaster', emoji: '🎯', time: '34 min atrás' },
  { name: 'KnightRider_42', emoji: '🐴', time: '41 min atrás' },
  { name: 'QueenGambit', emoji: '♛', time: '55 min atrás' },
  { name: 'RookDefender', emoji: '🛡️', time: '1h atrás' },
  { name: 'CheckMateKing', emoji: '🔥', time: '1h atrás' },
  { name: 'SicilianDragon', emoji: '🐉', time: '2h atrás' },
  { name: 'EndgameExpert', emoji: '🏆', time: '2h atrás' },
  { name: 'BlitzWarrior', emoji: '💨', time: '3h atrás' },
  { name: 'TacticsWizard', emoji: '🧙', time: '3h atrás' },
  { name: 'OpeningTheory', emoji: '📚', time: '4h atrás' },
  { name: 'FischerFan', emoji: '⭐', time: '5h atrás' },
  { name: 'CarlsenCopy', emoji: '🇳🇴', time: '5h atrás' },
  { name: 'PuzzleHunter', emoji: '🧩', time: '6h atrás' },
  { name: 'AlphaZeroFan', emoji: '🤖', time: '7h atrás' },
  { name: 'XadrezBrasil', emoji: '🇧🇷', time: '8h atrás' },
  { name: 'MateIn3', emoji: '✅', time: '9h atrás' },
];

const AMOUNTS = [10, 25, 50, 100, 250];

const FREQUENCIES = [
  { id: 'once', label: 'Uma vez' },
  { id: 'monthly', label: '✓ Mensal' },
  { id: 'yearly', label: 'Anual' },
];

const PAYMENT_METHODS = [
  { id: 'pix',      label: 'PIX',          icon: '🏦', desc: 'Instantâneo, sem taxas',    colorBg: 'bg-teal-500/10',   colorBorder: 'border-teal-500/40',   colorRing: 'ring-teal-500/30' },
  { id: 'card',     label: 'Cartão',        icon: '💳', desc: 'Crédito ou débito',         colorBg: 'bg-blue-500/10',   colorBorder: 'border-blue-500/40',   colorRing: 'ring-blue-500/30' },
  { id: 'paypal',   label: 'PayPal',        icon: '🅿️', desc: 'Pagamento seguro',          colorBg: 'bg-indigo-500/10', colorBorder: 'border-indigo-500/40', colorRing: 'ring-indigo-500/30' },
  { id: 'crypto',   label: 'Cripto',        icon: '₿',  desc: 'Bitcoin, ETH, USDT',        colorBg: 'bg-orange-500/10', colorBorder: 'border-orange-500/40', colorRing: 'ring-orange-500/30' },
  { id: 'boleto',   label: 'Boleto',        icon: '📄', desc: 'Vencimento em 3 dias',      colorBg: 'bg-gray-500/10',   colorBorder: 'border-gray-500/40',   colorRing: 'ring-gray-500/30' },
  { id: 'transfer', label: 'Transferência', icon: '🏛️', desc: 'TED / DOC bancário',        colorBg: 'bg-purple-500/10', colorBorder: 'border-purple-500/40', colorRing: 'ring-purple-500/30' },
];

const PATRON_PERKS = [
  { icon: Crown,  title: 'Ícone de Patrono',       desc: 'Ícone exclusivo de asas douradas no seu perfil.' },
  { icon: Star,   title: 'Destaque na Comunidade', desc: 'Seu nome aparece na lista de patronos recentes.' },
  { icon: Shield, title: 'Badge Especial',          desc: 'Badge exclusivo visível em todos os seus jogos.' },
  { icon: Zap,    title: 'Acesso Antecipado',       desc: 'Seja o primeiro a testar novos recursos da plataforma.' },
];

const FAQS = [
  { q: 'Para onde vai o dinheiro?',            a: 'Primeiro, servidores de alta performance. Em seguida, pagamos desenvolvedores para manter e melhorar a plataforma. Todo centavo é investido em manter o xadrez gratuito e acessível para todos.' },
  { q: 'A OitoPorOito é sem fins lucrativos?', a: 'Sim! Somos uma plataforma independente sem fins lucrativos. Não temos anúncios, não vendemos dados e não cobramos assinaturas. Seu apoio é o que nos mantém vivos.' },
  { q: 'Posso cancelar meu suporte mensal?',   a: 'Sim, a qualquer momento. Basta acessar as configurações da sua conta e cancelar a doação recorrente sem burocracia.' },
  { q: 'Patronos têm recursos exclusivos?',    a: 'Patronos recebem um ícone especial de asas no perfil e aparecem na lista de patronos recentes. Mas todos os recursos do xadrez são gratuitos para todos — essa é nossa promessa.' },
  { q: 'Outros métodos de doação?',            a: 'Além dos métodos listados, aceitamos transferências bancárias diretas. Entre em contato com nossa equipe para mais detalhes.' },
];

// Endereços de carteiras cripto (definidos fora do componente para evitar recriação)
const WALLETS = {
  BTC:  { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf',              symbol: '₿', color: 'text-orange-400' },
  ETH:  { address: '0x742d35Cc6634C0532925a3b8D4C9C3E5e4a8b2f1', symbol: 'Ξ', color: 'text-blue-400' },
  USDT: { address: 'TN3W4H6rK2ce4vX9YnFQHwKx8Vj7Ld6Ue',            symbol: '₮', color: 'text-green-400' },
  BNB:  { address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',   symbol: 'B', color: 'text-yellow-400' },
};

// Dados bancários (definidos fora do componente)
const BANK_DATA = [
  { label: 'Banco',        value: 'Nubank (260)' },
  { label: 'Agência',      value: '0001' },
  { label: 'Conta',        value: '12345678-9' },
  { label: 'CNPJ',         value: '00.000.000/0001-00' },
  { label: 'Beneficiário', value: 'OitoPorOito Xadrez' },
];

const STATS = [
  { label: 'Patronos ativos',   value: '4.821', icon: Crown },
  { label: 'Países apoiadores', value: '87',    icon: Globe },
  { label: 'Partidas por dia',  value: '48K+',  icon: Zap },
  { label: 'Plataforma gratuita', value: '100%', icon: Heart },
];

// Variantes de animação reutilizáveis
const PANEL_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

// ─── Hook para copiar para a área de transferência ────────────────────────────

function useCopyToClipboard(resetDelay = 2000) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copy = useCallback(async (text, key = 'default') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), resetDelay);
    } catch {
      // Fallback para ambientes sem suporte à Clipboard API (ex: HTTP)
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      try { document.execCommand('copy'); } catch { /* silencioso */ }
      document.body.removeChild(el);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), resetDelay);
    }
  }, [resetDelay]);

  return { copiedKey, copy };
}

// ─── Subcomponentes memoizados ────────────────────────────────────────────────

const PixPanel = memo(function PixPanel({ amount }) {
  const { copiedKey, copy } = useCopyToClipboard();
  const pixKey = 'oitoporoito@gmail.com';

  return (
    <motion.div {...PANEL_VARIANTS} className="space-y-4">
      <div className="flex flex-col items-center gap-3">
        {/* QR Code simulado — em produção, substituir por biblioteca qrcode.react */}
        <div
          className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center border-4 border-gold/30 shadow-lg p-3"
          role="img"
          aria-label="QR Code para pagamento via PIX"
        >
          <div className="grid grid-cols-7 gap-0.5 w-full h-full" aria-hidden="true">
            {Array.from({ length: 49 }, (_, i) => (
              <div
                key={i}
                className={`rounded-sm ${[0,1,2,3,4,5,6,7,14,21,28,35,42,43,44,45,46,47,48,8,15,10,12,17,19,24,26,31,33,38,40].includes(i) ? 'bg-gray-900' : 'bg-white'}`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">Escaneie o QR Code ou copie a chave PIX</p>
      </div>

      <div className="flex gap-2">
        <div
          className="flex-1 bg-surface-tertiary border border-gold/20 rounded-xl px-3 py-2.5 text-sm text-muted-foreground font-mono truncate"
          aria-label={`Chave PIX: ${pixKey}`}
        >
          {pixKey}
        </div>
        <button
          onClick={() => copy(pixKey)}
          aria-label={copiedKey ? 'Chave PIX copiada' : 'Copiar chave PIX'}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gold text-surface-primary rounded-xl text-sm font-bold hover:bg-gold/90 transition-all shrink-0"
        >
          {copiedKey ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copiedKey ? 'Copiado!' : 'Copiar'}
        </button>
      </div>

      <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 flex items-start gap-2" role="note">
        <Info size={14} className="text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-teal-300">
          Valor: <strong>R$ {amount},00</strong> — Após o pagamento, envie o comprovante para{' '}
          <strong>oitoporoito@gmail.com</strong> com seu usuário para ativar o Patrono.
        </p>
      </div>
    </motion.div>
  );
});

const CardPanel = memo(function CardPanel({ amount, frequency }) {
  const freqLabel = frequency === 'monthly' ? ' / mês' : frequency === 'yearly' ? ' / ano' : '';

  return (
    <motion.div {...PANEL_VARIANTS} className="space-y-4">
      {/* AVISO: Em produção, este formulário deve ser substituído por um SDK de
          gateway de pagamento (ex: Stripe Elements, PagSeguro, Mercado Pago).
          NUNCA transmita dados de cartão diretamente para o seu backend. */}
      <div className="space-y-3">
        <div>
          <label htmlFor="card-number" className="text-xs text-muted-foreground mb-1.5 block font-medium">
            Número do cartão
          </label>
          <div className="relative">
            <input
              id="card-number"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full pl-4 pr-10 py-2.5 bg-surface-tertiary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
            <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="card-expiry" className="text-xs text-muted-foreground mb-1.5 block font-medium">
              Validade
            </label>
            <input
              id="card-expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              maxLength={5}
              className="w-full px-4 py-2.5 bg-surface-tertiary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div>
            <label htmlFor="card-cvv" className="text-xs text-muted-foreground mb-1.5 block font-medium">
              CVV
            </label>
            <div className="relative">
              <input
                id="card-cvv"
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="•••"
                maxLength={4}
                className="w-full pl-4 pr-10 py-2.5 bg-surface-tertiary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="card-name" className="text-xs text-muted-foreground mb-1.5 block font-medium">
            Nome no cartão
          </label>
          <input
            id="card-name"
            type="text"
            autoComplete="cc-name"
            placeholder="NOME COMPLETO"
            className="w-full px-4 py-2.5 bg-surface-tertiary border border-gold/20 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>
      </div>

      <button
        type="button"
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
      >
        <Lock size={14} aria-hidden="true" />
        Pagar R$ {amount},00{freqLabel}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock size={11} aria-hidden="true" /> Pagamento seguro com criptografia SSL
      </p>
    </motion.div>
  );
});

const PayPalPanel = memo(function PayPalPanel({ amount, frequency }) {
  const freqLabel = frequency === 'monthly' ? 'Mensal' : 'Anual';

  return (
    <motion.div {...PANEL_VARIANTS} className="space-y-4 text-center">
      <div className="bg-[#003087]/20 border border-[#009cde]/30 rounded-2xl p-6">
        <div className="text-4xl mb-3" aria-hidden="true">🅿️</div>
        <h3 className="font-bold text-foreground">PayPal</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Você será redirecionado para o PayPal para concluir o pagamento de forma segura.
        </p>
        <dl className="mt-4 bg-surface-tertiary rounded-xl p-3 text-left space-y-1.5">
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Valor</dt>
            <dd className="font-bold text-foreground">R$ {amount},00</dd>
          </div>
          {frequency !== 'once' && (
            <div className="flex justify-between text-sm">
              <dt className="text-muted-foreground">Frequência</dt>
              <dd className="font-bold text-gold">{freqLabel}</dd>
            </div>
          )}
        </dl>
      </div>
      <button
        type="button"
        className="w-full py-3 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
      >
        <ExternalLink size={14} aria-hidden="true" /> Continuar com PayPal
      </button>
    </motion.div>
  );
});

const CryptoPanel = memo(function CryptoPanel({ amount }) {
  const [coin, setCoin] = useState('BTC');
  const { copiedKey, copy } = useCopyToClipboard();
  const wallet = WALLETS[coin];

  return (
    <motion.div {...PANEL_VARIANTS} className="space-y-4">
      <div className="flex gap-2 flex-wrap" role="group" aria-label="Selecionar criptomoeda">
        {Object.keys(WALLETS).map(c => (
          <button
            key={c}
            onClick={() => setCoin(c)}
            aria-pressed={coin === c}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${coin === c ? 'bg-gold text-surface-primary border-gold' : 'bg-surface-tertiary text-muted-foreground border-gold/10 hover:border-gold/30'}`}
          >
            {WALLETS[c].symbol} {c}
          </button>
        ))}
      </div>

      <div className="bg-surface-tertiary border border-gold/20 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Endereço {coin}</span>
          <span className={`text-xl font-bold ${wallet.color}`} aria-hidden="true">{wallet.symbol}</span>
        </div>
        <p
          className="bg-surface-primary rounded-lg p-2.5 font-mono text-xs text-foreground break-all border border-gold/10 select-all"
          aria-label={`Endereço ${coin}: ${wallet.address}`}
        >
          {wallet.address}
        </p>
        <button
          onClick={() => copy(wallet.address, coin)}
          aria-label={copiedKey === coin ? `Endereço ${coin} copiado` : `Copiar endereço ${coin}`}
          className="w-full flex items-center justify-center gap-2 py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-lg text-xs font-bold transition-all"
        >
          {copiedKey === coin ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
          {copiedKey === coin ? 'Copiado!' : 'Copiar endereço'}
        </button>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-start gap-2" role="note">
        <Info size={14} className="text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-orange-300">
          Envie o equivalente a <strong>R$ {amount},00</strong>. Após confirmação, envie o hash da transação para{' '}
          <strong>oitoporoito@gmail.com</strong>.
        </p>
      </div>
    </motion.div>
  );
});

const BoletoPanel = memo(function BoletoPanel({ amount }) {
  return (
    <motion.div {...PANEL_VARIANTS} className="space-y-4 text-center">
      <div className="bg-surface-tertiary border border-gold/20 rounded-2xl p-6">
        <div className="text-4xl mb-3" aria-hidden="true">📄</div>
        <h3 className="font-bold text-foreground">Boleto Bancário</h3>
        <p className="text-sm text-muted-foreground mt-1">Vencimento em 3 dias úteis. Disponível apenas para doações únicas.</p>
        <dl className="mt-4 bg-surface-primary rounded-xl p-3 text-left space-y-1.5">
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Valor</dt>
            <dd className="font-bold text-foreground">R$ {amount},00</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Beneficiário</dt>
            <dd className="font-bold text-foreground">OitoPorOito</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-muted-foreground">Vencimento</dt>
            <dd className="font-bold text-gold">3 dias úteis</dd>
          </div>
        </dl>
      </div>
      <button
        type="button"
        className="w-full py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
      >
        <ExternalLink size={14} aria-hidden="true" /> Gerar Boleto
      </button>
      <p className="text-xs text-muted-foreground">Após o pagamento, o Patrono é ativado em até 2 dias úteis.</p>
    </motion.div>
  );
});

const TransferPanel = memo(function TransferPanel({ amount }) {
  const { copiedKey, copy } = useCopyToClipboard();

  return (
    <motion.div {...PANEL_VARIANTS} className="space-y-3">
      <dl>
        {BANK_DATA.map(d => (
          <div
            key={d.label}
            className="flex items-center justify-between bg-surface-tertiary border border-gold/10 rounded-xl px-4 py-2.5 gap-3 mb-2 last:mb-0"
          >
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{d.label}</dt>
              <dd className="text-sm font-semibold text-foreground">{d.value}</dd>
            </div>
            <button
              onClick={() => copy(d.value, d.label)}
              aria-label={copiedKey === d.label ? `${d.label} copiado` : `Copiar ${d.label}`}
              className="shrink-0 p-1.5 rounded-lg hover:bg-gold/10 text-muted-foreground hover:text-gold transition-all"
            >
              {copiedKey === d.label
                ? <Check size={13} className="text-green-400" aria-hidden="true" />
                : <Copy size={13} aria-hidden="true" />
              }
            </button>
          </div>
        ))}
      </dl>

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex items-start gap-2" role="note">
        <Info size={14} className="text-purple-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-purple-300">
          Após transferir <strong>R$ {amount},00</strong>, envie o comprovante para{' '}
          <strong>oitoporoito@gmail.com</strong> com seu usuário.
        </p>
      </div>
    </motion.div>
  );
});

const FaqItem = memo(function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${q.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="border border-gold/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        aria-controls={id}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-tertiary transition-all gap-3"
      >
        <span className="font-semibold text-sm text-foreground">{q}</span>
        {open
          ? <ChevronUp size={15} className="text-gold shrink-0" aria-hidden="true" />
          : <ChevronDown size={15} className="text-muted-foreground shrink-0" aria-hidden="true" />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ─── Mapa de painéis de pagamento ─────────────────────────────────────────────

const PAYMENT_PANELS = {
  pix:      (props) => <PixPanel      amount={props.amount} />,
  card:     (props) => <CardPanel     amount={props.amount} frequency={props.frequency} />,
  paypal:   (props) => <PayPalPanel   amount={props.amount} frequency={props.frequency} />,
  crypto:   (props) => <CryptoPanel   amount={props.amount} />,
  boleto:   (props) => <BoletoPanel   amount={props.amount} />,
  transfer: (props) => <TransferPanel amount={props.amount} />,
};

// ─── Página principal ─────────────────────────────────────────────────────────

export default function Donate() {
  const [frequency, setFrequency]       = useState('monthly');
  const [amount, setAmount]             = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom]         = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [coverFee, setCoverFee]         = useState(false);

  // Cálculo memoizado do valor final para evitar recálculo desnecessário
  const finalAmount = useMemo(() => {
    const base = isCustom ? (parseInt(customAmount, 10) || 0) : amount;
    return base + (coverFee ? 2 : 0);
  }, [isCustom, customAmount, amount, coverFee]);

  const freqSuffix = useMemo(() => {
    if (frequency === 'monthly') return ' / mês';
    if (frequency === 'yearly')  return ' / ano';
    return '';
  }, [frequency]);

  // Handlers memoizados com useCallback para evitar recriação em cada render
  const handleAmountClick = useCallback((v) => {
    setAmount(v);
    setIsCustom(false);
    setCustomAmount('');
  }, []);

  const handleCustomAmountChange = useCallback((e) => {
    // Sanitização: aceita apenas dígitos inteiros positivos
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
  }, []);

  const handleCustomToggle = useCallback(() => {
    setIsCustom(true);
  }, []);

  const handleCoverFeeToggle = useCallback(() => {
    setCoverFee(prev => !prev);
  }, []);

  // Renderização do painel de pagamento via mapa (evita switch com re-renders)
  const PaymentPanel = PAYMENT_PANELS[paymentMethod];

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gold/20 via-surface-secondary to-surface-primary border-b border-gold/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,157,93,0.15),transparent_70%)]" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl mb-4" aria-hidden="true">🕊️</div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gold mb-3 leading-tight">
              Xadrez gratuito, para todos,<br className="hidden sm:block" /> para sempre!
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Sem anúncios, sem assinaturas — apenas xadrez de qualidade com código aberto e paixão.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Coluna esquerda: Patronos + Benefícios ── */}
          <aside className="lg:col-span-1 space-y-4">
            <Card variant="gradient" className="border border-gold/20">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-gold" aria-hidden="true" />
                <h2 className="font-bold text-foreground">Novos Patronos</h2>
              </div>
              <ul className="space-y-1.5" aria-label="Lista de novos patronos">
                {RECENT_PATRONS.map((p, i) => (
                  <motion.li
                    key={p.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2 py-1.5 border-b border-gold/5 last:border-0"
                  >
                    <span className="text-base" aria-hidden="true">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.time}</p>
                    </div>
                    <Crown size={11} className="text-gold shrink-0" aria-hidden="true" />
                  </motion.li>
                ))}
              </ul>
            </Card>

            <Card variant="gradient" className="border border-gold/20">
              <div className="flex items-center gap-2 mb-4">
                <Crown size={18} className="text-gold" aria-hidden="true" />
                <h2 className="font-bold text-foreground">Benefícios do Patrono</h2>
              </div>
              <ul className="space-y-3" aria-label="Benefícios do Patrono">
                {PATRON_PERKS.map((perk) => {
                  const Icon = perk.icon;
                  return (
                    <li key={perk.title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0" aria-hidden="true">
                        <Icon size={14} className="text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{perk.title}</p>
                        <p className="text-xs text-muted-foreground">{perk.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </aside>

          {/* ── Coluna central + direita: Formulário ── */}
          <main className="lg:col-span-2 space-y-5">

            {/* Texto intro */}
            <Card variant="gradient" className="border border-gold/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Somos uma plataforma sem fins lucrativos porque acreditamos que todos devem ter acesso ao xadrez de nível mundial.
                Contamos com o apoio de pessoas como você para tornar isso possível. Se você gosta de usar a OitoPorOito,
                considere apoiar-nos doando e se tornando um Patrono!
              </p>
            </Card>

            {/* Frequência */}
            <Card variant="gradient" className="border border-gold/20">
              <h2 className="font-bold text-foreground mb-3 text-sm">Frequência</h2>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Frequência da doação">
                {FREQUENCIES.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFrequency(f.id)}
                    aria-pressed={frequency === f.id}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${frequency === f.id ? 'bg-gold text-surface-primary border-gold shadow-lg shadow-gold/20' : 'bg-surface-tertiary text-muted-foreground border-gold/10 hover:border-gold/40'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Valor */}
            <Card variant="gradient" className="border border-gold/20">
              <h2 className="font-bold text-foreground mb-3 text-sm">Valor da doação</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3" role="group" aria-label="Valores pré-definidos">
                {AMOUNTS.map(v => (
                  <button
                    key={v}
                    onClick={() => handleAmountClick(v)}
                    aria-pressed={!isCustom && amount === v}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${!isCustom && amount === v ? 'bg-gold text-surface-primary border-gold shadow-lg shadow-gold/20' : 'bg-surface-tertiary text-muted-foreground border-gold/10 hover:border-gold/40'}`}
                  >
                    R$ {v}
                  </button>
                ))}
                <button
                  onClick={handleCustomToggle}
                  aria-pressed={isCustom}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${isCustom ? 'bg-gold text-surface-primary border-gold shadow-lg shadow-gold/20' : 'bg-surface-tertiary text-muted-foreground border-gold/10 hover:border-gold/40'}`}
                >
                  Outro
                </button>
              </div>

              <AnimatePresence>
                {isCustom && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-3"
                  >
                    <label htmlFor="custom-amount" className="sr-only">Valor personalizado em reais</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold" aria-hidden="true">R$</span>
                      <input
                        id="custom-amount"
                        type="text"
                        inputMode="numeric"
                        placeholder="Digite o valor"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-tertiary border border-gold/30 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cobrir taxa */}
              <div className="flex items-start gap-3">
                <button
                  role="checkbox"
                  aria-checked={coverFee}
                  onClick={handleCoverFeeToggle}
                  className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${coverFee ? 'bg-gold border-gold' : 'border-gold/30 hover:border-gold/60'}`}
                >
                  {coverFee && <Check size={10} className="text-surface-primary" aria-hidden="true" />}
                  <span className="sr-only">{coverFee ? 'Remover cobertura de taxa' : 'Cobrir taxa de processamento de R$ 2,00'}</span>
                </button>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Adicionar <strong className="text-foreground">R$ 2,00</strong> para ajudar a cobrir o custo de processamento desta transação.
                </p>
              </div>

              {/* Resumo */}
              {finalAmount > 0 && (
                <div
                  className="mt-3 bg-gold/5 border border-gold/20 rounded-xl px-4 py-2.5 flex items-center justify-between"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="text-sm text-muted-foreground">Total da doação</span>
                  <span className="text-lg font-extrabold text-gold">
                    R$ {finalAmount},00{freqSuffix}
                  </span>
                </div>
              )}
            </Card>

            {/* Método de pagamento */}
            <Card variant="gradient" className="border border-gold/20">
              <h2 className="font-bold text-foreground mb-3 text-sm">Forma de pagamento</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5" role="group" aria-label="Forma de pagamento">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    aria-pressed={paymentMethod === m.id}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all ${m.colorBg} ${paymentMethod === m.id ? `${m.colorBorder} ring-2 ${m.colorRing} scale-[1.02]` : 'border-gold/10 hover:border-gold/30'}`}
                  >
                    <span className="text-xl" aria-hidden="true">{m.icon}</span>
                    <span className="text-xs font-bold text-foreground">{m.label}</span>
                    <span className="text-xs text-muted-foreground text-center leading-tight">{m.desc}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-gold/10 pt-5">
                <AnimatePresence mode="wait">
                  <motion.div key={paymentMethod}>
                    {PaymentPanel && <PaymentPanel amount={finalAmount} frequency={frequency} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Card>

            <p className="text-center text-sm text-muted-foreground italic py-2">
              "Somos uma equipe pequena — então o seu apoio faz uma <strong className="text-gold">enorme diferença</strong>!"
            </p>
          </main>
        </div>

        {/* ── FAQ ── */}
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-foreground text-center mb-6 flex items-center justify-center gap-2">
            <Info size={22} className="text-gold" aria-hidden="true" /> Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-2">
            {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Estatísticas da plataforma">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <Card variant="gradient" className="text-center py-5 border border-gold/20">
                  <Icon size={22} className="text-gold mx-auto mb-2" aria-hidden="true" />
                  <div className="text-2xl font-extrabold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </section>
      </div>
    </PageLayout>
  );
}
