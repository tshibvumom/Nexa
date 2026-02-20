import React, { useState, useMemo } from 'react';
import { 
  Video, Cloud, Search, Languages, Globe, RefreshCw, ClipboardList, 
  Trash2, CheckCircle, Loader2, Download, Terminal, Fingerprint, 
  ShieldAlert, Cpu, Database, Activity, Waves, Headphones, 
  ShieldCheck, Link, Box, ArrowRight, Info, Mic2, Compass, Zap, Sparkles, Coins, MapPin, Gavel, PlayCircle, Clock, Eye
} from 'lucide-react';
import { RenderJob, AuditEntry, UserSubscription, ExportJob } from '../types';
import VRStudio from './VRStudio';
import ExportHub from './ExportHub';
import UniversalPlayer from './UniversalPlayer';
import { transcribeVideo } from '../services/geminiService';
import { OFFICIAL_LANGUAGES, ExportFormat, COMPUTE_COSTS } from '../constants';

interface Props {
  jobs: RenderJob[];
  exportJobs: ExportJob[];
  onNewRender: (prompt: string, options: any) => void;
  onGenerateImage: (prompt: string, options: any) => void;
  onUpload: (file: File) => void;
  onUpdateJob: (id: string, updates: Partial<RenderJob>) => void;
  onDeleteJob: (id: string) => void;
  onExportAsset: (assetId: string, format: ExportFormat, spatialSettings?: any) => void;
  onCancelExport: (id: string) => void;
  isRendering: boolean;
  notify: (text: string, type?: any) => void;
  hasPaidKey: boolean;
  onConnectKey: () => void;
  auditLog: AuditEntry[];
  addAuditEntry: (action: string, details: string, type: AuditEntry['type'], jobId?: string) => void;
  userSubscription: UserSubscription;
  onSendMessage: (msg: string) => void;
}

const CreatorDashboard: React.FC<Props> = ({ 
  jobs, exportJobs, onNewRender, onGenerateImage, onUpdateJob, 
  onDeleteJob, onExportAsset, onCancelExport, isRendering, notify, 
  hasPaidKey, onConnectKey, auditLog, addAuditEntry, userSubscription, onSendMessage 
}) => {
  const [activeTool, setActiveTool] = useState<'studio' | 'transcription' | 'vault' | 'export' | 'audit'>('studio');
  const [vaultSearch, setVaultSearch] = useState('');
  const [vaultFilter, setVaultFilter] = useState<'all' | 'vr' | 'image'>('all');
  const [selectedPreviewJob, setSelectedPreviewJob] = useState<RenderJob | null>(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState<RenderJob | null>(null);

  const filteredVaultJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch = j.prompt.toLowerCase().includes(vaultSearch.toLowerCase());
      const matchesType = vaultFilter === 'all' || 
                          (vaultFilter === 'vr' && j.details?.type === 'VR Render') ||
                          (vaultFilter === 'image' && j.details?.type === 'AI Image');
      return matchesSearch && matchesType;
    });
  }, [jobs, vaultSearch, vaultFilter]);

  return (
    <div className="flex-1 flex flex-col h-full gap-5 overflow-hidden">
      {/* Navigation */}
      <div className="flex gap-3 shrink-0 overflow-x-auto scrollbar-hide">
        {[
          { id: 'studio', label: 'Synthesis Studio', icon: <Video size={16} /> },
          { id: 'export', label: 'Export Hub', icon: <Download size={16} /> },
          { id: 'vault', label: 'Vault', icon: <Cloud size={16} /> },
          { id: 'audit', label: 'Audit Ledger', icon: <ClipboardList size={16} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTool(tab.id as any)} className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all flex items-center gap-3 active:scale-95 shrink-0 ${activeTool === tab.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'glass border-white/10 text-gray-500'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* Full Details Modal */}
        {selectedJobDetails && (
          <div className="fixed inset-0 z-[110] glass backdrop-blur-3xl flex items-center justify-center p-12">
            <div className="w-full max-w-2xl glass p-8 rounded-[3rem] border border-white/10 space-y-8 animate-in zoom-in duration-300">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black uppercase tracking-widest text-blue-400">Synthetic DNA Report</h2>
                  <button onClick={() => setSelectedJobDetails(null)} className="p-2 bg-white/5 rounded-full hover:bg-red-500 transition-colors"><Trash2 size={20} /></button>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div className="glass p-4 rounded-2xl border border-white/5 space-y-1">
                        <label className="text-[8px] font-black text-gray-500 uppercase">Provenance Hash</label>
                        <p className="text-[10px] mono text-white truncate uppercase">{selectedJobDetails.id.toUpperCase()}</p>
                     </div>
                     <div className="glass p-4 rounded-2xl border border-white/5 space-y-1">
                        <label className="text-[8px] font-black text-gray-500 uppercase">Jurisdiction</label>
                        <p className="text-[10px] font-bold text-white uppercase">{selectedJobDetails.details?.subRegion || 'Nexa-Global'}</p>
                     </div>
                     <div className="glass p-4 rounded-2xl border border-white/5 space-y-1">
                        <label className="text-[8px] font-black text-gray-500 uppercase">Detected Language</label>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase">{selectedJobDetails.detectedLanguage || 'Pending Export'}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="glass p-4 rounded-2xl border border-white/5 space-y-1">
                        <label className="text-[8px] font-black text-gray-500 uppercase">Resolution</label>
                        <p className="text-[10px] font-bold text-white">{selectedJobDetails.details?.resolution}</p>
                     </div>
                     <div className="glass p-4 rounded-2xl border border-white/5 space-y-1">
                        <label className="text-[8px] font-black text-gray-500 uppercase">Spatial Profile</label>
                        <p className="text-[10px] font-bold text-white uppercase">{selectedJobDetails.spatialMetadata?.hrtf || 'N/A'}</p>
                     </div>
                  </div>
               </div>
               <div className="p-6 bg-black/50 rounded-2xl border border-white/10">
                  <p className="text-xs text-gray-400 mono italic leading-relaxed">"{selectedJobDetails.prompt}"</p>
               </div>
            </div>
          </div>
        )}

        {/* Video Preview */}
        {selectedPreviewJob && (
          <div className="fixed inset-0 z-[100] glass backdrop-blur-3xl flex items-center justify-center p-12">
             <div className="w-full max-w-6xl aspect-video bg-black rounded-[3rem] overflow-hidden border border-white/10 relative shadow-2xl">
                {selectedPreviewJob.details?.type === 'AI Image' ? (
                  <img src={selectedPreviewJob.videoUri} className="w-full h-full object-contain" />
                ) : (
                  <UniversalPlayer src={selectedPreviewJob.videoUri!} projection={selectedPreviewJob.details?.projection} />
                )}
                <button onClick={() => setSelectedPreviewJob(null)} className="absolute top-8 right-8 z-50 p-4 bg-red-600 rounded-full text-white shadow-2xl active:scale-90">
                   <Trash2 size={24} />
                </button>
             </div>
          </div>
        )}

        {activeTool === 'studio' && (
          <div className="h-full flex flex-col gap-6">
            <div className="flex-1">
              <VRStudio jobs={jobs} onNewRender={onNewRender} onGenerateImage={onGenerateImage} onUpload={() => {}} onUpdateJob={onUpdateJob} onDeleteJob={onDeleteJob} isRendering={isRendering} notify={notify} hasPaidKey={hasPaidKey} onConnectKey={onConnectKey} addAuditEntry={addAuditEntry} userSubscription={userSubscription} />
            </div>
            {/* Active Ledger */}
            <div className="glass rounded-[2rem] border border-white/10 p-6 space-y-4 shadow-xl">
               <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                 <Activity size={14} className="text-blue-400" /> Active Transaction Ledger
               </h3>
               <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {jobs.map(job => (
                    <div key={job.id} className="min-w-[260px] glass p-4 rounded-2xl border border-white/5 space-y-3 group hover:border-blue-500/30 transition-all">
                       <div className="flex justify-between items-start">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : job.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400 animate-pulse'}`}>
                             {job.details?.type} • {job.status}
                          </span>
                          <button onClick={() => setSelectedJobDetails(job)} className="p-1 hover:text-blue-400 transition-colors"><Eye size={12} /></button>
                       </div>
                       <p className="text-[10px] font-black text-white truncate uppercase tracking-tight">{job.prompt}</p>
                       {job.status === 'rendering' && (
                         <div className="space-y-1.5">
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${job.progress || 0}%` }} />
                            </div>
                            <div className="flex justify-between text-[8px] mono text-gray-600 font-black uppercase">
                               <span>Synthesizing...</span>
                               <span>{job.progress || 0}%</span>
                            </div>
                         </div>
                       )}
                       {job.status === 'completed' && (
                         <button onClick={() => setSelectedPreviewJob(job)} className="w-full py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-[9px] font-black uppercase rounded-xl border border-blue-500/20 transition-all">
                            Playback Immersion
                         </button>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTool === 'export' && <ExportHub jobs={jobs} exportJobs={exportJobs} onExport={onExportAsset} onCancel={onCancelExport} isProcessing={isRendering} userSubscription={userSubscription} />}
        {activeTool === 'vault' && (
          <div className="glass rounded-[2.5rem] border border-white/10 h-full flex flex-col overflow-hidden">
             <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 gap-8">
                <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase">Temporal Vault</h3>
                <div className="relative flex-1 max-w-sm">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                   <input type="text" placeholder="Search prompts..." value={vaultSearch} onChange={e => setVaultSearch(e.target.value)} className="bg-black/50 border border-white/10 rounded-full pl-12 pr-6 py-3 text-[11px] font-bold outline-none w-full text-white" />
                </div>
                <div className="flex gap-2">
                   {['all', 'vr', 'image'].map(f => (
                     <button key={f} onClick={() => setVaultFilter(f as any)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${vaultFilter === f ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>{f}</button>
                   ))}
                </div>
             </div>
             <div className="flex-1 p-8 overflow-y-auto scrollbar-hide grid grid-cols-1 md:grid-cols-4 gap-6">
                {filteredVaultJobs.map(job => (
                  <div key={job.id} className="glass p-4 rounded-[2rem] border border-white/5 flex flex-col gap-3 group hover:border-blue-500/30 transition-all">
                    <div className="aspect-square bg-black rounded-[1.5rem] overflow-hidden relative border border-white/10">
                      {job.videoUri ? (
                        <>
                          {job.details?.type === 'AI Image' ? <img src={job.videoUri} className="w-full h-full object-cover" /> : <video src={job.videoUri} className="w-full h-full object-cover" muted />}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button onClick={() => setSelectedPreviewJob(job)} className="p-3 bg-blue-600 rounded-xl"><PlayCircle size={20} /></button>
                            <button onClick={() => setSelectedJobDetails(job)} className="p-3 bg-white/10 rounded-xl"><Eye size={20} /></button>
                          </div>
                        </>
                      ) : <Loader2 className="animate-spin text-blue-500 mx-auto my-auto" />}
                    </div>
                    <p className="text-[10px] font-black text-white truncate uppercase">{job.prompt}</p>
                    <div className="flex justify-between text-[8px] mono text-gray-600 uppercase">
                       <span>{new Date(job.timestamp).toLocaleDateString()}</span>
                       <span className="text-blue-400">{job.id.slice(0, 6).toUpperCase()}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
