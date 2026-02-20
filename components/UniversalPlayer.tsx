
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import { Globe, MousePointer2, ShieldCheck } from 'lucide-react';

interface Props {
  src: string;
  type?: string;
  isVR?: boolean;
  projection?: string;
}

export default function UniversalPlayer({ src, type = "video/mp4", isVR = true, projection }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Audit: In ESM, we must ensure videojs is global for certain plugins
    (window as any).videojs = videojs;

    const initPlayer = async () => {
      if (!playerRef.current && videoRef.current) {
        // Dynamically import VR plugin to avoid race condition with the global assignment
        await import('videojs-vr');

        const player = playerRef.current = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          fluid: true,
          responsive: true,
          preload: 'auto',
          sources: [{ src, type }]
        });

        // Initialize VR plugin logic
        if (isVR || src.includes('360')) {
          let vjsProjection = '360';
          if (projection === 'STEREOSCOPIC_3D') vjsProjection = '360_LR';
          
          if (typeof player.vr === 'function') {
            player.vr({ 
              projection: vjsProjection,
              debug: false,
              forceCardboard: false
            });
          }
        }
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, type, isVR, projection]);

  return (
    <div className="h-full w-full bg-[#050505] relative group cursor-move overflow-hidden rounded-[2.5rem]">
      <div data-vjs-player className="h-full w-full">
        <video ref={videoRef} className="video-js vjs-big-play-centered vjs-theme-city h-full w-full" crossOrigin="anonymous" />
      </div>
      
      <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-10">
        <div className="flex justify-between items-start">
           <div className="glass px-5 py-2.5 rounded-2xl border border-blue-500/20 flex items-center gap-3 animate-in slide-in-from-top duration-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Sovereign Stream: Active</span>
           </div>
           <div className="glass px-4 py-1.5 rounded-xl border border-emerald-500/20 text-[9px] font-black text-emerald-400 flex items-center gap-2 uppercase tracking-widest">
              <ShieldCheck size={12} /> {projection || 'Auto-Sync'}
           </div>
        </div>
        
        <div className="flex justify-center items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-4 group-hover:translate-y-0">
           <div className="glass px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 text-white/50 text-[10px] font-black uppercase tracking-widest">
              <MousePointer2 size={14} className="animate-bounce" /> Drag for perspective
           </div>
        </div>
        
        <div className="flex justify-end">
           <div className="glass px-4 py-2 rounded-xl border border-white/5 text-[9px] font-black text-gray-500 flex items-center gap-3 uppercase tracking-widest">
              <Globe size={12} className="text-blue-500" /> Nexa Spherical v2.1
           </div>
        </div>
      </div>
    </div>
  );
}
