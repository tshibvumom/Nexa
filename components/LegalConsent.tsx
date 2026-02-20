
import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';

interface Props {
  onAccept: () => void;
}

const LegalConsent: React.FC<Props> = ({ onAccept }) => {
  return (
    <div className="glass p-8 rounded-[2.5rem] border-2 border-amber-500/50 bg-amber-500/5 animate-in fade-in zoom-in duration-500 text-center">
      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
        <ShieldAlert className="text-amber-500" size={32} />
      </div>
      <h3 className="font-black text-amber-500 uppercase tracking-widest mb-4">Immutable Audit Warning</h3>
      <p className="text-xs text-gray-400 leading-relaxed font-medium mb-8 max-w-sm mx-auto">
        By proceeding, you consent to your identity hash being recorded on the 
        <strong className="text-amber-400"> Global Audit Ledger</strong>. 
        This record is permanent and cryptographically anchored under the 
        <strong className="text-amber-400"> 2026 AI Transparency Framework</strong>.
      </p>
      <button 
        onClick={onAccept} 
        className="w-full py-5 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] transition-all active:scale-95 shadow-xl shadow-amber-900/20 flex items-center justify-center gap-3"
      >
        <Check size={18} strokeWidth={3} />
        I Accept & Verify Identity
      </button>
      <p className="mt-6 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
        Zero Trust Handshake: Pending
      </p>
    </div>
  );
};

export default LegalConsent;
