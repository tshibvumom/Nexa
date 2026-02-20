
import React from 'react';
/* Added Activity to the list of imported icons from lucide-react */
import { ShieldCheck, Lock, MapPin, Fingerprint, Heart, Box, Cloud, Database, Cpu, Layers, Terminal, CheckCircle, Activity } from 'lucide-react';
import { TelemetryData, UserSubscription, AuditEntry } from '../types';

interface Props {
  telemetry: TelemetryData[];
  auditLog: AuditEntry[];
  subscription: UserSubscription;
}

const SystemDashboard: React.FC<Props> = ({ telemetry, auditLog, subscription }) => {
  const latest = telemetry[telemetry.length - 1] || { latency: 0, node_status: 'online', cpu_temp: 0, gpu_temp: 0, anomaly_score: 0, region: 'africa-south1', mtls_status: 'REJECT_INVALID' };

  return (
    <div className="glass rounded-2xl border border-white/10 flex flex-col overflow-hidden h-full">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" />
          <h2 className="font-bold text-sm tracking-wide uppercase">SOC Oversight [AIOps v1.35]</h2>
        </div>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <Heart size={12} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase text-emerald-400">Homeostasis: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Lock size={12} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase text-blue-400">{latest.mtls_status} Policy</span>
            </div>
        </div>
      </div>

      <div className="p-6 overflow-y-auto space-y-8 scrollbar-hide">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-3xl border border-white/5 bg-black/40 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white tracking-widest uppercase">Cluster Geometry</h3>
                <MapPin size={18} className="text-blue-500" />
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-[11px] mono">
                   <span className="text-gray-500">Active Node</span>
                   <span className="text-white uppercase font-black">{latest.region}</span>
                </div>
                <div className="flex justify-between text-[11px] mono">
                   <span className="text-gray-500">Node Status</span>
                   <span className={`font-black uppercase ${latest.anomaly_score > 0.8 || latest.latency > 100 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                      {latest.anomaly_score > 0.8 || latest.latency > 100 ? 'CRITICAL' : 'HEALTHY'}
                   </span>
                </div>
                <div className="flex justify-between text-[11px] mono">
                   <span className="text-gray-500">Failover Capability</span>
                   <span className="text-emerald-400 font-black uppercase">Active (africa-south1-b)</span>
                </div>
             </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 space-y-4">
            <h3 className="text-xs font-bold text-blue-200 tracking-widest uppercase flex items-center gap-2">
              <Box size={16} /> Sovereign Shell Stack
            </h3>
            <div className="space-y-3">
               <div className="flex items-center justify-between text-[10px] font-black uppercase">
                  <span className="text-gray-500 flex items-center gap-2"><Cloud size={10} /> VPC Network</span>
                  <span className="text-emerald-400">nexa-sovereign-network</span>
               </div>
               <div className="flex items-center justify-between text-[10px] font-black uppercase">
                  <span className="text-gray-500 flex items-center gap-2"><Cpu size={10} /> Cloud Run Backend</span>
                  <span className="text-emerald-400">nexa-backend</span>
               </div>
               <div className="flex items-center justify-between text-[10px] font-black uppercase">
                  <span className="text-gray-500 flex items-center gap-2"><Database size={10} /> Vertex AI Endpoint</span>
                  <span className="text-emerald-400">nexa-gemini-3-flash</span>
               </div>
               <p className="text-[9px] text-gray-600 font-bold uppercase leading-tight italic border-t border-white/5 pt-2">
                  Terraform Infrastructure Synchronized (SHA3 Anchored)
               </p>
            </div>
          </div>
        </section>

        <section className="glass p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 space-y-6">
            <h3 className="text-xs font-bold text-emerald-200 tracking-widest uppercase flex items-center gap-2">
              <Terminal size={16} /> Cloud Build Pipeline Status
            </h3>
            <div className="space-y-4">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle size={14} /></div>
                  <div className="flex-1">
                     <p className="text-[10px] font-black uppercase text-white tracking-widest">Step 1: Build Multimodal Backend</p>
                     <p className="text-[9px] text-gray-500 mono">gcr.io/$PROJECT_ID/nexa-backend:latest</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle size={14} /></div>
                  <div className="flex-1">
                     <p className="text-[10px] font-black uppercase text-white tracking-widest">Step 2: Build WebXR Frontend</p>
                     <p className="text-[9px] text-gray-500 mono">gcr.io/$PROJECT_ID/nexa-frontend:latest</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse"><Activity size={14} /></div>
                  <div className="flex-1">
                     <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Step 3: Zero-Trust Deploy [nexa-app]</p>
                     <p className="text-[9px] text-gray-500 mono">region: africa-south1 | mTLS: REJECT_INVALID</p>
                  </div>
               </div>
            </div>
        </section>

        <section className="glass p-6 rounded-3xl border border-purple-500/20 bg-purple-500/5 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-purple-200 tracking-widest uppercase flex items-center gap-2">
                  <Fingerprint size={16} /> Autonomous Ledger [v1.35]
                </h3>
            </div>
            <div className="space-y-2">
               {auditLog.slice(0, 8).map(a => (
                 <div key={a.id} className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                    <div className="flex justify-between text-[9px] mono uppercase">
                       <span className={`font-black ${a.type === 'error' ? 'text-red-400' : a.type === 'warning' ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {a.action}
                       </span>
                       <span className="text-gray-600 font-bold">{new Date(a.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[10px] mono text-gray-400 leading-tight">{a.details}</p>
                 </div>
               ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default SystemDashboard;
