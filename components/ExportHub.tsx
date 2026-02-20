
import React, { useState } from 'react';
import { Download, Film, Loader2, HardDrive, CheckCircle, Globe, Cpu, ShieldCheck, Zap, Music, Volume2, Monitor, Star, Settings2, Waves, Compass, Headphones, XCircle, FileVideo, Archive, FileEdit } from 'lucide-react';
import { RenderJob, ExportJob, UserSubscription } from '../types';
import { SUPPORTED_EXPORTS, COMPUTE_COSTS, ExportFormat, GLOBAL_REGISTRY, PLATFORM_PRESETS, HRTF_PROFILES, AUDIO_FOCUS_MODES } from '../constants';

interface Props {
  jobs: RenderJob[];
  exportJobs: ExportJob[];
  onExport: (assetId: string, format: ExportFormat, spatialSettings?: { order: number, hrtf: string, focus: string }) => void;
  onCancel: (id: string) => void;
  isProcessing: boolean;
  userSubscription: UserSubscription;
}

const ExportHub: React.FC<Props> = ({ jobs, exportJobs, onExport, onCancel, isProcessing, userSubscription }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('mp4');
  const [useSpatialAudio, setUseSpatialAudio] = useState(true);
  const [spatialOrder, setSpatialOrder] = useState<1 | 2 | 3>(1);
  const [hrtfProfile, setHrtfProfile] = useState(HRTF_PROFILES[0].id);
  const [audioFocus, setAudioFocus] = useState(AUDIO_FOCUS_MODES[0].id);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const exportableAssets = jobs.filter(j => j.status === 'completed' && (j.details?.type.toLowerCase().includes('vr') || j.details?.type.toLowerCase().includes('video')));

  const applyPreset = (preset: typeof PLATFORM_PRESETS[number]) => {
    setSelectedFormat(preset.format as ExportFormat);
    setUseSpatialAudio(preset.spatial);
    setActivePreset(preset.id);
    if (preset.id === 'archive') {
        setSpatialOrder(3);
        setHrtfProfile('cinematic');
    }
    else if (preset.id === 'social') {
        setSpatialOrder(1);
        setHrtfProfile('universal');
    }
  };

  const handleExportClick = () => {
    if (selectedAssetId) {
      onExport(selectedAssetId, selectedFormat, useSpatialAudio ? { 
        order: spatialOrder, 
        hrtf: hrtfProfile, 
        focus: audioFocus 
      } : undefined);
    }
  };

  const currentAsset = jobs.find(j => j.id === selectedAssetId);

  return (
    <div className="glass rounded-[2.5rem] border border-white/10 h-full flex flex-col p-8 overflow-y-auto space-y-8 scrollbar-hide shadow-inner">
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div className="flex items-center gap-5">
          <div className="p-3.5 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-xl"><Download size={24} className="text-blue-400" /></div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight uppercase">Export & Transcode Hub</h2>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Ambisonic Soundfield Synthesis via Community Nodes.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Star size={14} className="text-amber-400" /> 1. Platform Presets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {PLATFORM_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`glass p-5 rounded-[2rem] border transition-all text-left space-y-2 group relative overflow-hidden ${activePreset === preset.id ? 'border-blue-500/50 bg-blue-500/5 shadow-2xl scale-[1.02]' : 'border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex justify-between items-start">
                    {/* Fix: Changed 'prores' to 'visionpro' to match valid preset IDs and resolve the intentional comparison error. */}
                    {preset.id === 'visionpro' ? <FileEdit size={16} className="text-purple-400" /> : 
                     preset.id === 'archive' ? <Archive size={16} className="text-emerald-400" /> : 
                     <Zap size={16} className="text-blue-400" />}
                    {activePreset === preset.id && <Zap size={10} className="text-blue-400 animate-pulse" />}
                  </div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-tight truncate">{preset.label}</h4>
                  <p className="text-[8px] text-gray-500 font-bold uppercase leading-tight">{preset.format.toUpperCase()} • {preset.quality}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
               <FileVideo size={14} className="text-blue-400" /> 2. Granular Format
             </h3>
             <div className="flex flex-wrap gap-4">
                {(Object.keys(SUPPORTED_EXPORTS) as ExportFormat[]).map(format => (
                  <button
                    key={format}
                    onClick={() => { setSelectedFormat(format); setActivePreset(null); }}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedFormat === format ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/10'}`}
                  >
                    {format}
                  </button>
                ))}
             </div>
             <p className="text-[9px] text-gray-600 font-bold uppercase ml-1 italic">{SUPPORTED_EXPORTS[selectedFormat].desc}</p>
          </div>

          {useSpatialAudio && (
            <div className="space-y-6 animate-in slide-in-from-top duration-500">
               <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                 <Waves size={14} /> 3. Spatial Refinement
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <Headphones size={12} className="text-blue-400" /> HRTF Mapping
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                       {HRTF_PROFILES.map(profile => (
                         <button key={profile.id} onClick={() => setHrtfProfile(profile.id)} className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${hrtfProfile === profile.id ? 'bg-blue-600 border-blue-400 text-white shadow-md' : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/10'}`}>
                            <span className="text-[10px] font-black uppercase tracking-tight">{profile.label}</span>
                            {hrtfProfile === profile.id && <CheckCircle size={14} />}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       <Compass size={12} className="text-amber-400" /> Audio-Visual Focus
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                       {AUDIO_FOCUS_MODES.map(mode => (
                         <button key={mode.id} onClick={() => setAudioFocus(mode.id)} className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${audioFocus === mode.id ? 'bg-amber-600 border-amber-400 text-white shadow-md' : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/10'}`}>
                            <span className="text-[10px] font-black uppercase tracking-tight">{mode.label}</span>
                            {audioFocus === mode.id && <CheckCircle size={14} />}
                         </button>
                       ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <Film size={14} /> 4. Source Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportableAssets.map(job => (
                <button
                  key={job.id}
                  onClick={() => setSelectedAssetId(job.id)}
                  className={`text-left glass p-4 rounded-2xl border transition-all flex gap-4 items-center group ${selectedAssetId === job.id ? 'border-blue-500/50 bg-blue-500/5 shadow-lg' : 'border-white/5 hover:border-white/10'}`}
                >
                  <div className="w-14 h-14 bg-black rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-inner">
                    <video src={job.videoUri} className="w-full h-full object-cover" muted />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-white truncate uppercase tracking-tight">{job.prompt}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">{job.details?.resolution} • {job.details?.projection || '360°'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={14} /> Synthesis Node
          </h3>
          <div className="glass p-6 rounded-[2rem] border border-white/5 bg-black/20 space-y-6 shadow-2xl">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Projection Link</span>
                <span className="text-[10px] mono text-blue-400 font-black uppercase">{currentAsset?.details?.projection || 'SYNCED'}</span>
              </div>
              <button 
                onClick={() => setUseSpatialAudio(!useSpatialAudio)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${useSpatialAudio ? 'border-blue-500/30 bg-blue-500/5 text-blue-400' : 'border-white/5 text-gray-500'}`}
              >
                 <div className="flex items-center gap-3"><Volume2 size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Spatial Synthesis</span></div>
                 <div className={`w-8 h-4 rounded-full relative transition-colors ${useSpatialAudio ? 'bg-blue-600' : 'bg-gray-800'}`}><div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${useSpatialAudio ? 'right-1' : 'left-1'}`} /></div>
              </button>
            </div>

            <button
              onClick={handleExportClick}
              disabled={!selectedAssetId || isProcessing || userSubscription.computeCredits < COMPUTE_COSTS.TRANSCODE_EXPORT}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] transition-all disabled:opacity-50 shadow-xl shadow-blue-900/40 active:scale-95 border border-blue-400/20"
            >
              {isProcessing ? <Loader2 className="animate-spin mx-auto" size={20} /> : `Execute Export (${COMPUTE_COSTS.TRANSCODE_EXPORT}cr)`}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-white/5">
        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <HardDrive size={14} /> Active Export Ledger
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exportJobs.map(job => {
            const asset = jobs.find(j => j.id === job.assetId);
            return (
              <div key={job.id} className="glass p-5 rounded-[2rem] border border-white/5 space-y-4 hover:border-blue-500/20 transition-all shadow-md overflow-hidden relative group">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${job.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : job.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                    {job.status}
                  </span>
                  <div className="flex items-center gap-2 text-[9px] mono text-gray-600 uppercase font-black">
                     {job.format}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-xl border border-white/10 shrink-0 overflow-hidden shadow-inner"><video src={asset?.videoUri} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0"><p className="text-[10px] font-black text-white truncate uppercase tracking-tight">{asset?.prompt || 'Archived Asset'}</p></div>
                </div>

                {job.status === 'processing' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase">
                      <span className="mono">{job.progress}%</span>
                      <button onClick={() => onCancel(job.id)} className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"><XCircle size={10} /> Abort</button>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${job.progress}%` }} />
                    </div>
                  </div>
                )}

                {job.status === 'completed' && job.downloadUrl && (
                  <a href={job.downloadUrl} download={`nexa_export_${job.id}.${job.format}`} className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                    <CheckCircle size={14} className="text-emerald-400" /> Download Synthesis
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExportHub;
