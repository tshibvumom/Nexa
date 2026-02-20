
export enum SubscriptionTier {
  BASIC = 'BASIC',
  PRO = 'PRO',
  SOVEREIGN = 'SOVEREIGN'
}

export enum UserRole {
  OPERATOR = 'OPERATOR',
  CREATOR = 'CREATOR',
  RESELLER = 'RESELLER'
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  role: UserRole;
  status: 'active' | 'pending' | 'suspended';
  currency: 'ZAR' | 'USD' | 'EUR' | 'INR' | 'CHF';
  computeCredits: number;
  paymentMethod?: 'Paystack' | 'Stripe';
  location?: {
    latitude: number;
    longitude: number;
    countryCode?: string;
    subRegion?: string;
  };
}

export interface TelemetryData {
  timestamp: string;
  latency: number;
  node_status: 'online' | 'offline';
  cpu_temp: number;
  gpu_temp: number;
  anomaly_score: number;
  region: string;
  uptime: string; 
  mtls_status: 'REJECT_INVALID' | 'PERMISSIVE' | 'DISABLED';
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'info' | 'success' | 'warning' | 'error';
  integrityHash?: string;
  complianceStandard?: string;
  blockchainTx?: string;
  jurisdictionCode?: string;
  userCertId?: string;
  contentHash?: string;
  spatialMetadata?: {
    hrtf: string;
    order: number;
    focus: string;
    projection: string;
    maxOrderSupported?: number;
    reverb?: number;
    reverbDecay?: number;
    echoFeedback?: number;
    directivity?: number;
    ambientMood?: string;
  };
}

export interface ExportJob {
  id: string;
  assetId: string;
  format: 'mp4' | 'webm' | 'mov' | 'mkv';
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  downloadUrl?: string;
  timestamp: string;
  spatialSettings?: {
    order: number;
    hrtf: string;
    focus: string;
  };
}

export interface RenderJob {
  id: string;
  timestamp: string;
  prompt: string;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress?: number; 
  videoUri?: string;
  blockchainHash?: string;
  tags: string[];
  sharedUrl?: string;
  transcription?: string;
  detectedLanguage?: string;
  groundingSources?: GroundingSource[];
  auditTrail: AuditEntry[];
  spatialMetadata?: {
    hrtf: string;
    order: number;
    focus: string;
    projection: string;
    maxOrderSupported?: number;
    reverb?: number;
    reverbDecay?: number;
    echoFeedback?: number;
    directivity?: number;
    ambientMood?: string;
  };
  details?: {
    resolution: string;
    size: string;
    duration: string;
    type: string;
    model?: string;
    projection?: 'STEREOSCOPIC_3D' | 'EQUIRECTANGULAR_360' | 'perspective';
    countryCode?: string;
    subRegion?: string;
    compliance?: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  sources?: GroundingSource[];
}