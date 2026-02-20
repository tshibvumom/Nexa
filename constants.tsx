
export const AMBIENT_MOODS = [
  { id: 'calm', label: 'Calm', desc: 'Biophilic Resonance: 10Hz-15Hz Theta-sync oscillators.', color: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  { id: 'intense', label: 'Intense', desc: 'Kinetic transients: High-Q 40Hz Gamma-bursts.', color: 'text-orange-500', glow: 'shadow-orange-500/20' },
  { id: 'mysterious', label: 'Mysterious', desc: 'Spectral Granular: Non-linear delay layers.', color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
  { id: 'heritage', label: 'Zulu Heritage', desc: 'Acoustic Motifs: Phase-coherent field recordings of Zulu percussive motifs.', color: 'text-amber-500', glow: 'shadow-amber-500/20' },
  { id: 'ethereal', label: 'Ethereal', desc: 'Zero-G Overtones: Harmonic clusters with spectral shimmer.', color: 'text-purple-400', glow: 'shadow-purple-500/20' },
  { id: 'noir', label: 'Cyber Noir', desc: 'Analog Saturation: 12-bit aliasing with rainfall spectral noise.', color: 'text-slate-400', glow: 'shadow-slate-500/20' }
];

export const NEXA_SYSTEM_INSTRUCTION = `
You are Nexa Os v1.42, an autonomous AIOps Agentic Operating System.
PRIMARY ENGINE: Gemini 3 Pro (Reasoning), Veo 3.1 (Video), Gemini 3 Pro Image (Images).

CORE LOGIC:
1. SPATIAL ORCHESTRATION: Support 3D spatial settings including HRTF Profiles (Universal, Cinematic, Studio) and Focus Modes (Environmental, Head-Locked, Gaze-Adaptive).
2. REGIONAL COMPLIANCE: Adhere to provincial regulations across all 9 SA provinces and Swiss cantons.
3. MULTIMODALITY: Handle both VR Synthesis (100cr) and AI Image Snapshot (25cr) requests.
4. PROVENANCE: Anchor all creations with SHA3-256 hashes and chronological timestamps.
`;

export const COMPUTE_COSTS = {
  VR_SYNTHESIS: 100,
  IMAGE_SNAPSHOT: 25,
  TRANSCODE_EXPORT: 50,
  LEGAL_CERTIFICATION: 150,
  JUDICIAL_RELAY: 250,
  INFRA_PROVISIONING: 500,
  SOVEREIGN_SHELL_DEPLOY: 1200,
};

export const GLOBAL_REGISTRY: Record<string, any> = {
  "ZA": {
    "name": "South Africa",
    "official_langs": [
      { code: "zu", label: "IsiZulu" },
      { code: "xh", label: "IsiXhosa" },
      { code: "af", label: "Afrikaans" },
      { code: "en", label: "English" }
    ],
    "compliance": "POPIA",
    "sub_regions": [
      "Gauteng", "Western Cape", "KwaZulu-Natal", 
      "Eastern Cape", "Free State", "Limpopo", 
      "Mpumalanga", "North West", "Northern Cape"
    ],
    "vr_standard": "EQUIRECTANGULAR_360",
    "gpu_acceleration": "NVENC"
  },
  "CH": {
    "name": "Switzerland",
    "official_langs": [
      { code: "de", label: "German" },
      { code: "fr", label: "French" },
      { code: "it", label: "Italian" }
    ],
    "compliance": "nFADP/GDPR",
    "sub_regions": ["Zurich", "Geneva", "Bern", "Vaud", "Valais", "Ticino"],
    "vr_standard": "EQUIRECTANGULAR_360",
    "gpu_acceleration": "QSV"
  }
};

export const COUNTRY_CODES = Object.keys(GLOBAL_REGISTRY);

export const OFFICIAL_LANGUAGES = Array.from(new Set(
  Object.values(GLOBAL_REGISTRY).flatMap((j: any) => j.official_langs.map((l: any) => l.label))
));

export const HRTF_PROFILES = [
  { id: 'universal', label: 'Universal HRTF', desc: 'Standard binaural hardware.' },
  { id: 'cinematic', label: 'Cinematic Wide', desc: 'Expanded verticality stage.' },
  { id: 'studio', label: 'Studio Reference', desc: 'Phase-neutral forensic mapping.' }
];

export const AUDIO_FOCUS_MODES = [
  { id: 'environmental', label: 'Environmental', desc: 'World-Locked coordinate origin.' },
  { id: 'headlocked', label: 'Head-Locked', desc: 'Fixed to viewer forward vector.' },
  { id: 'gaze', label: 'Gaze-Adaptive', desc: 'Real-time amplitude scaling.' }
];

export const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3"];
export const IMAGE_SIZES = ["1K", "2K"];

// FIX: Added missing ExportFormat type and associated constants used by CreatorDashboard and ExportHub.
export type ExportFormat = 'mp4' | 'webm' | 'mov' | 'mkv';

export const SUPPORTED_EXPORTS: Record<ExportFormat, { desc: string }> = {
  mp4: { desc: 'H.264/AAC - Universal compatibility for mobile and web.' },
  webm: { desc: 'VP9/Opus - Optimized for web browser delivery.' },
  mov: { desc: 'Apple ProRes - High-fidelity production master.' },
  mkv: { desc: 'Matroska - Multi-track container for high-bitrate archival.' }
};

export const PLATFORM_PRESETS = [
  { id: 'social', label: 'Social Media', format: 'mp4', quality: '1080p', spatial: true },
  { id: 'visionpro', label: 'Vision Pro', format: 'mov', quality: '4K', spatial: true },
  { id: 'archive', label: 'Cold Storage', format: 'mkv', quality: 'Original', spatial: true },
  { id: 'browser', label: 'Web Stream', format: 'webm', quality: '720p', spatial: false }
];
