import React, { useState } from 'react';
import { Check, Zap, Crown, CreditCard, ShieldCheck, Globe, Coins, Sparkles, Bot, Loader2, Ticket } from 'lucide-react';
import { SubscriptionTier, UserSubscription } from '../types';

interface Props {
  subscription: UserSubscription;
  onUpgrade: (tier: SubscriptionTier) => void;
  onRedeemVoucher: (code: string) => boolean;
  isProcessing: boolean;
}

const TIER_DATA = [
  {
    id: SubscriptionTier.BASIC,
    name: 'Free Plan',
    prices: { ZAR: 'R0', USD: '$0', EUR: '€0' },
    icon: <Zap size={20} className="text-gray-400" />,
    features: ['720p VR Previews', 'SHA3-256 Provenance', 'Standard Creation'],
    color: 'border-gray-500/30'
  },
  {
    id: SubscriptionTier.PRO,
    name: 'Pro Plan',
    prices: { ZAR: 'R450/mo', USD: '$25/mo', EUR: '€23/mo' },
    icon: <CreditCard size={20} className="text-blue-400" />,
    features: ['1080p High Quality', 'mTLS Priority Ingress', 'Advanced Agent Access'],
    color: 'border-blue-500/50'
  },
  {
    id: SubscriptionTier.SOVEREIGN,
    name: 'Sovereign Plan',
    prices: { ZAR: 'R1,800/mo', USD: '$99/mo', EUR: '€92/mo' },
    icon: <Crown size={20} className="text-emerald-400" />,
    features: ['4K VR Native Content', 'Exclusive AI Logic v1.41', 'Full Hyperledger SLA'],
    color: 'border-emerald-500/70'
  }
];

const SubscriptionManager: React.FC<Props> = ({ subscription, onUpgrade, onRedeemVoucher, isProcessing }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<'ZAR' | 'USD' | 'EUR'>(
    (subscription.currency === 'ZAR' || subscription.currency === 'USD' || subscription.currency === 'EUR') 
      ? subscription.currency 
      : 'USD'
  );
  const [voucherCode, setVoucherCode] = useState('');

  const handleVoucherRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRedeemVoucher(voucherCode)) {
      setVoucherCode('');
    }
  };

  return (
    <div className="glass rounded-2xl border border-white/10 flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-blue-400" />
          <h2 className="font-bold text-sm tracking-wide uppercase">Treasury & SLA Management</h2>
        </div>
        <div className="flex bg-black/50 p-1 rounded-xl border border-white/5 gap-1">
          {(['USD', 'ZAR', 'EUR'] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${selectedCurrency === curr ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 overflow-y-auto space-y-8 scrollbar-hide">
        {/* Voucher Redemption Section for Admin Testing */}
        <section className="glass p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20"><Ticket size={20} className="text-amber-500" /></div>
                <div>
                   <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest">Sovereign Voucher Override</h3>
                   <p className="text-[10px] text-gray-500 font-medium">Input administrator code for 100% discount verification.</p>
                </div>
             </div>
          </div>
          <form onSubmit={handleVoucherRedeem} className="flex gap-4">
            <input 
              type="text" 
              placeholder="ENTER ADMIN VOUCHER..." 
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-3 text-xs font-bold mono outline-none focus:border-amber-500/50 transition-all text-amber-400 placeholder:text-gray-700"
            />
            <button 
              type="submit"
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Redeem
            </button>
          </form>
        </section>

        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-500/10 rounded-full"><Bot size={20} className="text-emerald-400" /></div>
             <div>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Agentic Management Active</p>
                <p className="text-[10px] text-gray-500 font-medium">Chat assistant can autonomously process upgrades and SLA modifications.</p>
             </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
             <Sparkles size={12} className="text-blue-400 animate-pulse" />
             <span className="text-[9px] font-black uppercase text-blue-400">Logic Core v1.41</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TIER_DATA.map((tier) => {
            const isCurrent = subscription.tier === tier.id;
            return (
              <div 
                key={tier.id} 
                className={`relative glass p-6 rounded-3xl border transition-all duration-500 ${tier.color} ${isCurrent ? 'bg-blue-500/5 scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black text-center w-full max-w-[120px] py-1 rounded-full shadow-2xl uppercase tracking-tighter">
                    Active Node
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-tight uppercase">{tier.name}</h3>
                    <p className="text-2xl font-black text-white mt-1">{tier.prices[selectedCurrency as keyof typeof tier.prices]}</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[11px] text-gray-300">
                      <Check size={14} className="text-blue-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrent || isProcessing}
                  onClick={() => onUpgrade(tier.id)}
                  className={`w-full py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    isCurrent 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 active:scale-95'
                  }`}
                >
                  {isProcessing ? <Loader2 size={14} className="animate-spin" /> : isCurrent ? <ShieldCheck size={14} /> : <Zap size={14} />}
                  {isCurrent ? 'Sovereign Node' : 'Request Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;