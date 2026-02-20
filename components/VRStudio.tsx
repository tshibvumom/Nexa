
import React, { useState, useMemo } from 'react';
import { 
  Globe, Zap, Loader2, Headphones, Compass, Sparkles, AudioLines, Coins, TestTube, Video, Image, Volume2, Layers, Target, Eye, ShieldCheck
} from 'lucide-react';
import { RenderJob, UserSubscription } from '../types';
import { GLOBAL_REGISTRY, COUNTRY_CODES, HRTF_PROFILES, AUDIO_FOCUS_MODES, AMBIENT_MOODS, COMPUTE_COSTS, ASPECT_RATIOS, IMAGE_SIZES } from '../constants';

interface Props {
  jobs: RenderJob[];
  onNewRender: (prompt: string, options: any) => void;
  onGenerateImage: (prompt: string, options: any) => void;
  onUpload: (file: File, metadata?: any) => void;
  onUpdateJob: (id: string, updates: Partial<RenderJob>) => void;
  onDeleteJob?: (id: string) => void;
  isRendering: boolean;
  notify?: (text: string, type?: any) => void;
  hasPaidKey: boolean;
  onConnectKey: () => void;
  addAuditEntry: (action: string, details: string, type: any, extra?: any) => void;
  userSubscription: UserSubscription;
}

const VRStudio: React.FC<Props> = ({ jobs, onNewRender, onGenerateImage, isRendering, hasPaidKey, onConnectKey, userSubscription }) => {
  const [mode, setMode] = useState<'video' | 'image'>('video');
  const [prompt, setPrompt] = useState('');
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [subRegion, setSubRegion] = useState(GLOBAL_REGISTRY[COUNTRY_CODES[0]].sub_regions[0]);
  
  // Spatial Settings
  const [spatialOrder, setSpatialOrder] = useState<1 | 2 | 3>(1);
  const [hrtfProfile, setHrtfProfile] = useState(HRTF_PROFILES[0].id);
  const [audioFocus, setAudioFocus] = useState(AUDIO_FOCUS_MODES[0].id);
  const [ambientMood, setAmbientMood] = useState<string>('heritage');

  // Image Settings
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');

  const jurisdiction = useMemo(() => GLOBAL_REGISTRY[countryCode], [countryCode]);

  const handleProcess = () => {
    if (!hasPaidKey && !process.env.API_KEY) {
      onConnectKey();
      return;
    }
    if (!prompt.trim()) return;
    
    if (mode === 'video') {
      onNewRender(prompt, { 
        countryCode, subRegion,
        spatial: { 
          order: spatialOrder, hrtf: hrtfProfile, focus: audioFocus,
          projection: jurisdiction.vr_standard, ambientMood
        }
      });
    } else {
      onGenerateImage(prompt, {
        subRegion, aspectRatio, imageSize
      });
    }
    setPrompt('');
  };

  return (
    <div className="glass rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden h-full relative shadow-inner">
      <div className="p-4 border-b border-white/5 flex gap-4 bg-white/5">
        <button onClick={() => setMode('video')} className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>
          <Video size={14} /> VR Synthesis
        </button>
        <button onClick={() => setMode('image')} className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'image' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>
          <Image size={14} /> AI Image Snapshot
        </button>
      </div>

      <div className="p-8 flex-1 flex flex-col gap-8 overflow-y-auto scrollbar-hide">
        <div className={`grid grid-cols-1 ${mode === 'video' ? 'xl:grid-cols-3' : 'xl:grid-cols-2'} gap-8`}>
           <div className="glass p-6 rounded-[2rem] border border-blue-500/20 bg-blue-500/5 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-blue-400 tracking-[0.2em] flex items-center gap-3 uppercase"><Globe size={14} /> Regional Anchor</h4>
                {mode === 'video' && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    <ShieldCheck size={10} className="text-emerald-400" />
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">{jurisdiction.vr_standard}</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-gray-500 uppercase">Country</label>
                    <select value={countryCode} onChange={e => { setCountryCode(e.target.value); setSubRegion(GLOBAL_REGISTRY[e.target.value].sub_regions[0]); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none text-white">
                       {COUNTRY_CODES.map(c => <option key={c} value={c}>{GLOBAL_REGISTRY[c].name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-gray-500 uppercase">Province / Canton</label>
                    <select value={subRegion} onChange={e => setSubRegion(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none text-white">
                       {jurisdiction.sub_regions?.map((sr: string) => <option key={sr} value={sr}>{sr}</option>)}
                    </select>
                 </div>
              </div>
           </div>
           
           {mode === 'video' ? (
             <>
               <div className="glass p-6 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 space-y-6">
                  <h4 className="text-[10px] font-black text-emerald-400 tracking-[0.2em] flex items-center gap-3 uppercase"><AudioLines size={14} /> Spatial DNA</h4>
                  <div className="grid grid-cols-1 gap-y-4">
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-500 uppercase">Ambisonic Order: {spatialOrder}</label>
                        <input type="range" min="1" max="3" step="1" value={spatialOrder} onChange={e => setSpatialOrder(Number(e.target.value) as any)} className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-500 uppercase">HRTF Profile</label>
                        <select value={hrtfProfile} onChange={e => setHrtfProfile(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white uppercase outline-none">
                           {HRTF_PROFILES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                     </div>
                  </div>
               </div>

               <div className="glass p-6 rounded-[2rem] border border-amber-500/20 bg-amber-500/5 space-y-4">
                  <h4 className="text-[10px] font-black text-amber-400 tracking-[0.2em] flex items-center gap-3 uppercase"><Compass size={14} /> Audio Focus</h4>
                  <div className="grid grid-cols-1 gap-2">
                     {AUDIO_FOCUS_MODES.map(fmode => (
                       <button 
                         key={fmode.id} 
                         onClick={() => setAudioFocus(fmode.id)} 
                         className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left group ${audioFocus === fmode.id ? 'bg-amber-600 border-amber-400 text-white shadow-lg' : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/10'}`}
                       >
                         <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-tight truncate">{fmode.label}</p>
                            <p className={`text-[7px] font-bold uppercase leading-tight mt-0.5 ${audioFocus === fmode.id ? 'text-white/70' : 'text-gray-600'}`}>{fmode.desc}</p>
                         </div>
                         {audioFocus === fmode.id && <Zap size={10} className="text-white animate-pulse shrink-0 ml-2" />}
                       </button>
                     ))}
                  </div>
               </div>
             </>
           ) : (
             <div className="glass p-6 rounded-[2rem] border border-indigo-500/20 bg-indigo-500/5 space-y-6">
                <h4 className="text-[10px] font-black text-indigo-400 tracking-[0.2em] flex items-center gap-3 uppercase"><Layers size={14} /> Layout Params</h4>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[8px] font-black text-gray-500 uppercase">Aspect Ratio</label>
                      <div className="flex gap-2">
                        {ASPECT_RATIOS.map(r => (
                          <button key={r} onClick={() => setAspectRatio(r)} className={`flex-1 py-2 rounded-lg text-[9px] font-black border transition-all ${aspectRatio === r ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/40 border-white/5 text-gray-600'}`}>{r}</button>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[8px] font-black text-gray-500 uppercase">Fidelity</label>
                      <div className="flex gap-2">
                        {IMAGE_SIZES.map(s => (
                          <button key={s} onClick={() => setImageSize(s)} className={`flex-1 py-2 rounded-lg text-[9px] font-black border transition-all ${imageSize === s ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-black/40 border-white/5 text-gray-600'}`}>{s}</button>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
           )}
        </div>

        <div className="glass p-6 rounded-[2rem] border border-white/10 bg-black/20 space-y-4">
           <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-3"><Sparkles size={14} /> Heritage Soundscapes</h4>
           <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {AMBIENT_MOODS.map(mood => (
                <button key={mood.id} onClick={() => setAmbientMood(mood.id)} className={`glass p-3 rounded-2xl border transition-all text-left flex flex-col gap-1 relative overflow-hidden group ${ambientMood === mood.id ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/5 opacity-50'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${ambientMood === mood.id ? 'text-white' : 'text-gray-500'}`}>{mood.label}</span>
                  {ambientMood === mood.id && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981]" />}
                </button>
              ))}
           </div>
        </div>

        <div className="space-y-6 pt-4 border-t border-white/5">
          <textarea 
            value={prompt} 
            onChange={e => setPrompt(e.target.value)} 
            placeholder={mode === 'video' ? "Describe immersive VR fragment..." : "Describe a high-fidelity sovereign snapshot..."} 
            className="w-full bg-black/40 border border-white/10 rounded-[2rem] p-6 text-sm focus:outline-none focus:border-blue-500/50 min-h-[140px] resize-none mono shadow-inner text-white leading-relaxed" 
          />
          
          <button 
            onClick={handleProcess} 
            disabled={isRendering || userSubscription.computeCredits < (mode === 'video' ? COMPUTE_COSTS.VR_SYNTHESIS : COMPUTE_COSTS.IMAGE_SNAPSHOT)} 
            className={`w-full py-5 ${mode === 'video' ? 'bg-blue-600' : 'bg-indigo-600'} shadow-xl text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-[0.99] disabled:opacity-50 relative overflow-hidden`}
          >
            {isRendering ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
            <span className="flex flex-col items-center">
               <span className="text-[12px]">{isRendering ? "Pulse Active..." : `Execute ${mode === 'video' ? 'VR' : 'Image'} Synthesis`}</span>
               <span className="text-[8px] font-bold text-white/50 mt-0.5">
                  <Coins size={10} className="inline mr-1" /> {mode === 'video' ? COMPUTE_COSTS.VR_SYNTHESIS : COMPUTE_COSTS.IMAGE_SNAPSHOT} cr (PROVENANCE LOGGED)
               </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VRStudio;
