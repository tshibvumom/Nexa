
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Activity, ShieldAlert, Cpu, Globe, Zap } from 'lucide-react';
import { TelemetryData } from '../types';

interface Props {
  data: TelemetryData[];
}

const TelemetryOverlay: React.FC<Props> = ({ data }) => {
  const latest = data[data.length - 1] || { latency: 0, node_status: 'online', cpu_temp: 0, gpu_temp: 0, anomaly_score: 0, region: 'Local Node' };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className={`glass p-4 rounded-xl border-l-4 transition-all duration-500 ${latest.anomaly_score > 0.8 ? 'border-red-500 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-emerald-500'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold tracking-widest uppercase ${latest.anomaly_score > 0.8 ? 'text-red-400' : 'text-emerald-400'}`}>Anomaly Score</span>
          <Zap size={14} className={latest.anomaly_score > 0.8 ? 'text-red-500 animate-bounce' : 'text-emerald-500'} />
        </div>
        <div className="text-2xl font-bold mono">{(latest.anomaly_score * 100).toFixed(1)}%</div>
        <div className="text-[10px] text-gray-400 mt-1 uppercase font-black">{latest.anomaly_score > 0.8 ? 'Critical Alert' : 'System Stable'}</div>
      </div>

      <div className={`glass p-4 rounded-xl border-l-4 ${latest.latency > 500 ? 'border-red-500' : 'border-blue-500'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Latency</span>
          <ShieldAlert size={14} className={latest.latency > 500 ? 'text-red-500' : 'text-blue-500'} />
        </div>
        <div className="text-2xl font-bold mono">{latest.latency}ms</div>
        <div className="h-[40px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area type="monotone" dataKey="latency" stroke="#3b82f6" fill="#3b82f633" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-4 rounded-xl border-l-4 border-amber-500">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">GPU Thermal</span>
          <Cpu size={14} className="text-amber-500" />
        </div>
        <div className="text-2xl font-bold mono">{latest.gpu_temp || 45}°C</div>
        <div className="text-[10px] text-gray-400 mt-1">Status: {latest.gpu_temp > 90 ? 'THROTTLING' : 'Normal'}</div>
      </div>

      <div className="glass p-4 rounded-xl border-l-4 border-purple-500">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-purple-400 tracking-widest uppercase">Region</span>
          <Globe size={14} className="text-purple-500" />
        </div>
        <div className="text-xl font-bold mono truncate">{latest.region}</div>
        <div className="text-[10px] text-gray-400 mt-1">Uptime: Optimal</div>
      </div>
    </div>
  );
};

export default TelemetryOverlay;
