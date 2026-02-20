
import React, { useState } from 'react';
import { Settings, User, Bell, Lock, Shield, Eye, EyeOff, RefreshCw, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { UserSubscription } from '../types';

interface Props {
  subscription: UserSubscription;
  onUpdate: () => void;
  onUpdateKey: () => void;
}

const SettingsView: React.FC<Props> = ({ subscription, onUpdate, onUpdateKey }) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="glass rounded-2xl border border-white/10 flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-gray-400" />
          <h2 className="font-bold text-sm tracking-wide">Account Settings</h2>
        </div>
      </div>

      <div className="p-8 overflow-y-auto space-y-10 scrollbar-hide">
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <User size={16} className="text-blue-500" />
            <h3 className="text-xs font-bold text-gray-400 tracking-widest">My Profile</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">User Id</label>
              <input 
                type="text" 
                value={subscription.userId} 
                disabled 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm mono text-gray-400 cursor-not-allowed shadow-inner" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">Membership Tier</label>
              <input 
                type="text" 
                value={subscription.tier} 
                disabled 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm mono text-gray-400 cursor-not-allowed shadow-inner" 
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} className="text-amber-500" />
            <h3 className="text-xs font-bold text-gray-400 tracking-widest">Ai Cloud Connection</h3>
          </div>
          
          <div className="glass p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 mb-6 space-y-3">
             <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-amber-400" />
                <h4 className="text-xs font-bold text-amber-200">Payment Connection</h4>
             </div>
             <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
               High-quality VR and Image creations require a connected Google Cloud account for processing. 
               Please ensure your cloud account has billing active.
             </p>
             <a 
               href="https://ai.google.dev/gemini-api/docs/billing" 
               target="_blank" 
               className="inline-flex items-center gap-2 py-2 px-4 bg-amber-400 text-black text-[10px] font-bold uppercase rounded-lg hover:bg-amber-300 transition-all shadow-lg"
             >
               <ExternalLink size={12} />
               Billing Support
             </a>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">Cloud Connection Key</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input 
                    type={showKey ? 'text' : 'password'} 
                    value="••••••••••••••••••••••••••••••••" 
                    disabled 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm mono text-gray-400 shadow-inner" 
                  />
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button 
                  onClick={onUpdateKey}
                  className="px-5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl flex items-center gap-2 transition-all active:scale-95 text-[10px] font-bold uppercase tracking-widest shadow-xl"
                >
                  <RefreshCw size={14} />
                  Update
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-6">
            <Bell size={16} className="text-emerald-500" />
            <h3 className="text-xs font-bold text-gray-400 tracking-widest">Preferences</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div>
                <p className="text-xs font-bold text-gray-200">System Notifications</p>
                <p className="text-[10px] text-gray-500 font-medium">Receive alerts when your creations are finished.</p>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer active:scale-95 transition-all shadow-[0_0_15px_#2563eb55]">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
          <button 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-2xl text-white"
            onClick={onUpdate}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
