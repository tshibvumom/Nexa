
import React from 'react';
import { TrendingUp, Users, DollarSign, Share2, Award, ArrowUpRight, Copy, MousePointer2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const SALES_DATA = [
  { name: 'Jan', value: 4200 },
  { name: 'Feb', value: 5100 },
  { name: 'Mar', value: 6800 },
  { name: 'Apr', value: 9200 },
  { name: 'May', value: 12500 },
];

const ResellerDashboard: React.FC = () => {
  return (
    <div className="glass rounded-2xl border border-white/10 flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-amber-400" />
          <h2 className="font-semibold text-sm tracking-widest uppercase">Channel Partner Portal</h2>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-bold text-emerald-400 uppercase">Partner Active</span>
        </div>
      </div>

      <div className="p-6 overflow-y-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Earnings', val: '$12,450.00', icon: <DollarSign size={16} className="text-emerald-500" /> },
            { label: 'Active Referrals', val: '1,284', icon: <Users size={16} className="text-blue-500" /> },
            { label: 'Conversion Rate', val: '8.4%', icon: <TrendingUp size={16} className="text-purple-500" /> }
          ].map((stat, i) => (
            <div key={i} className="glass p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                {stat.icon}
              </div>
              <p className="text-xl font-bold mono">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass p-5 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Revenue Growth (Usd)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALES_DATA}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: '#111', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {SALES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === SALES_DATA.length - 1 ? '#3b82f6' : '#1d4ed833'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/5 space-y-6">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Marketing Assets</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-500 uppercase ml-1">Universal Referral Link</label>
                <div className="flex gap-2">
                  <input readOnly value="https://nexa.ai/ref/sovereign-01" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] mono text-blue-400" />
                  <button className="p-2 glass border border-white/10 rounded-xl hover:text-blue-400 transition-colors"><Copy size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95">
                  <Share2 size={12} />
                  Share Campaign
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase transition-all active:scale-95">
                  <MousePointer2 size={12} />
                  Media Kit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-dashed border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase">Gold Tier Partner</h4>
              <p className="text-[10px] text-gray-500 mono">Eligible for 15% revenue share on all sovereign nodes.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-bold uppercase transition-all">
            View Milestones
            <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResellerDashboard;
