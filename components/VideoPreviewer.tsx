
/* DEPRECATED: Use UniversalPlayer.tsx for high-performance Video.js + VR support. 
   This file remains for legacy three.js mesh-specific previews if needed. */
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Globe, MousePointer2 } from 'lucide-react';

function VRVideoSphere({ url }: { url: string }) {
  const video = useMemo(() => {
    const v = document.createElement('video');
    v.src = url;
    v.crossOrigin = 'Anonymous';
    v.loop = true;
    v.muted = false;
    v.playsInline = true;
    v.play().catch(err => console.warn("Auto-play blocked by browser. User interaction required."));
    return v;
  }, [url]);

  const texture = useMemo(() => new THREE.VideoTexture(video), [video]);
  
  return (
    // @ts-ignore
    <mesh scale={[-1, 1, 1]}>
      {/* @ts-ignore */}
      <sphereGeometry args={[500, 60, 40]} />
      {/* @ts-ignore */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    {/* @ts-ignore */}
    </mesh>
  );
}

export default function VideoPreviewer({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="h-full w-full bg-[#050505] relative group cursor-move">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 0.1]} />
          <VRVideoSphere url={videoUrl} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            rotateSpeed={-0.4}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
      
      {/* Dynamic Overlay HUD */}
      <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
           <div className="glass px-5 py-2.5 rounded-2xl border border-blue-500/20 flex items-center gap-3 animate-in slide-in-from-top duration-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Legacy Three.js Preview active</span>
           </div>
        </div>
        
        <div className="flex justify-center items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-4 group-hover:translate-y-0">
           <div className="glass px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 text-white/50 text-[10px] font-black uppercase tracking-widest">
              <MousePointer2 size={14} className="animate-bounce" /> Drag to modularize view
           </div>
        </div>
        
        <div className="flex justify-end">
           <div className="glass px-4 py-2 rounded-xl border border-white/5 text-[9px] font-black text-gray-500 flex items-center gap-3 uppercase tracking-widest">
              <Globe size={12} className="text-blue-500" /> Spherical Engine V2.1
           </div>
        </div>
      </div>
    </div>
  );
}
