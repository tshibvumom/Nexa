import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Shield, LogOut, ShieldCheck, Coins, Lock, Activity, ShieldAlert, Sparkles, Zap, Heart, Gavel, Box, UserPlus, CloudIcon, Server, Cpu as CpuIcon, Database, Layers, CreditCard, TestTube, Users, LayoutDashboard, Globe, Info
} from 'lucide-react';
import TelemetryOverlay from './components/TelemetryOverlay';
import ChatInterface from './components/ChatInterface';
import CreatorDashboard from './components/CreatorDashboard';
import SubscriptionManager from './components/SubscriptionManager';
import SystemDashboard from './components/SystemDashboard';
import SettingsView from './components/SettingsView';
import ResellerDashboard from './components/ResellerDashboard';
import LegalConsent from './components/LegalConsent';
import { TelemetryData, ChatMessage, RenderJob, SubscriptionTier, UserSubscription, UserRole, AuditEntry, ExportJob } from './types';
import { NEXA_SYSTEM_INSTRUCTION, COMPUTE_COSTS } from './constants';
import { detectLanguage } from './services/geminiService';

const ADMIN_VOUCHER_CODE = "NEXA-ADMIN-FREE-2025";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'main' | 'subscription' | 'settings' | 'system' | 'partner'>('main');
  const [hasPaidKey, setHasPaidKey] = useState<boolean>(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [notifications, setNotifications] = useState<{id: number, text: string, type?: 'error' | 'success' | 'info' | 'warning'}[]>([]);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription>({
    userId: 'SECURE_ID_X7',
    tier: SubscriptionTier.BASIC,
    role: UserRole.CREATOR,
    status: 'active',
    currency: 'USD',
    computeCredits: 1000
  });
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', content: "Nexa v1.42 Online. Multimodal Synthesis & Spatial Hub: ARMED." }
  ]);
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemRegion, setSystemRegion] = useState('africa-south1');

  useEffect(() => {
    const checkKey = async () => {
      try {
        const anyWindow = window as any;
        if (anyWindow.aistudio && typeof anyWindow.aistudio.hasSelectedApiKey === 'function') {
          const selected = await anyWindow.aistudio.hasSelectedApiKey();
          setHasPaidKey(selected);
        }
      } catch (e) { console.debug("Key check skipped."); }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    try {
      const anyWindow = window as any;
      if (anyWindow.aistudio && typeof anyWindow.aistudio.openSelectKey === 'function') {
        await anyWindow.aistudio.openSelectKey();
        setHasPaidKey(true);
      }
    } catch (e) { console.debug("Selector fault."); }
  };

  const handleTestLogin = (role: UserRole) => {
    setIsSimulationMode(true);
    setLegalAccepted(true);
    setIsLoggedIn(true);
    setUserSubscription(prev => ({
      ...prev,
      role,
      tier: role === UserRole.OPERATOR ? SubscriptionTier.SOVEREIGN : SubscriptionTier.PRO,
      computeCredits: 99999
    }));
    setActiveTab(role === UserRole.OPERATOR ? 'system' : role === UserRole.RESELLER ? 'partner' : 'main');
    addNotification(`Simulation Active: ${role} Profile`, "info");
    addAuditEntry('Sandbox Session Started', `Chronological trace initiated for ${role}.`, 'success');
  };

  const handleRedeemVoucher = (code: string) => {
    if (code === ADMIN_VOUCHER_CODE) {
      setUserSubscription(prev => ({
        ...prev,
        tier: SubscriptionTier.SOVEREIGN,
        role: UserRole.OPERATOR,
        computeCredits: prev.computeCredits + 10000
      }));
      addAuditEntry('Manual SLA Override', `100% Admin Discount applied via code ${code.slice(0, 4)}***`, 'success');
      addNotification("Sovereign Access Activated: 100% Discount Applied", "success");
      return true;
    }
    addNotification("Invalid Voucher Code", "error");
    return false;
  };

  const addAuditEntry = (action: string, details: string, type: AuditEntry['type'] = 'info') => {
    const entry: AuditEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      details,
      type,
      integrityHash: Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10),
    };
    setAuditLog(prev => [entry, ...prev].slice(0, 100));
  };

  const addNotification = (text: string, type: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const onSendMessage = async (msg: string) => {
    setChatHistory(prev => [...prev, { role: 'user', content: msg }]);
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: msg,
        config: { systemInstruction: NEXA_SYSTEM_INSTRUCTION }
      });
      setChatHistory(prev => [...prev, { role: 'model', content: response.text || "Communication timeout." }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', content: "Gateway error. Simulated agent response active." }]);
    } finally { setIsProcessing(false); }
  };

  const onNewRender = async (prompt: string, options: any) => {
    setIsProcessing(true);
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();
    
    setJobs(prev => [{ 
      id, prompt, status: 'rendering', progress: 0, timestamp, tags: ['Sovereign', options.subRegion], auditTrail: [], 
      spatialMetadata: options.spatial,
      details: { 
        resolution: '1080p', 
        duration: '5s', 
        size: '12MB', 
        type: 'VR Render', 
        subRegion: options.subRegion,
        projection: options.spatial?.projection || 'EQUIRECTANGULAR_360'
      } 
    }, ...prev]);

    if (isSimulationMode || userSubscription.tier === SubscriptionTier.SOVEREIGN) {
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(r => setTimeout(r, 600));
        onUpdateJob(id, { progress: i });
      }
      onUpdateJob(id, { 
        status: 'completed', 
        videoUri: 'https://vjs.zencdn.net/v/oceans.mp4'
      });
      addAuditEntry('Synthesis Complete', `Asset ${id} anchored at ${timestamp}`, 'success');
      addNotification("Synthesis Complete", "success");
      setIsProcessing(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({ 
        model: 'veo-3.1-generate-preview', 
        prompt, 
        config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' } 
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        onUpdateJob(id, { status: 'completed', progress: 100, videoUri: `${downloadLink}&key=${process.env.API_KEY}` });
        addAuditEntry('Sovereign Synthesis Anchored', `Task ${id} verified.`, 'success');
      }
    } catch (err: any) {
      onUpdateJob(id, { status: 'failed' });
      addNotification("Infrastructure Fault", "error");
    } finally { setIsProcessing(false); }
  };

  const onGenerateImage = async (prompt: string, options: any) => {
    setIsProcessing(true);
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();

    setJobs(prev => [{
      id, prompt, status: 'rendering', progress: 0, timestamp, tags: ['AI-Image', options.subRegion], auditTrail: [],
      details: { resolution: options.imageSize, duration: 'N/A', size: '2.4MB', type: 'AI Image', subRegion: options.subRegion }
    }, ...prev]);

    if (isSimulationMode) {
      for (let i = 0; i <= 100; i += 33) {
        await new Promise(r => setTimeout(r, 400));
        onUpdateJob(id, { progress: i });
      }
      onUpdateJob(id, { 
        status: 'completed', 
        videoUri: 'https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=800',
        progress: 100 
      });
      addNotification("Image Synthesis Complete", "success");
      setIsProcessing(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: options.aspectRatio, imageSize: options.imageSize } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          onUpdateJob(id, { status: 'completed', progress: 100, videoUri: imageUrl });
          addAuditEntry('Image Anchored', `Snapshot ${id} verified.`, 'success');
          break;
        }
      }
    } catch (err: any) {
      onUpdateJob(id, { status: 'failed' });
      addNotification("Image Engine Error", "error");
    } finally { setIsProcessing(false); }
  };

  const onUpdateJob = (id: string, updates: Partial<RenderJob>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  const handleExportAsset = async (assetId: string, format: any, spatialSettings: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();
    
    // Find the original job to detect language
    const originalJob = jobs.find(j => j.id === assetId);
    
    setExportJobs(prev => [{ id, assetId, format, status: 'processing', progress: 0, timestamp, spatialSettings }, ...prev]);
    
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 500));
      setExportJobs(prev => prev.map(ej => ej.id === id ? { ...ej, progress: i } : ej));
    }

    let detectedLang = "Unknown";
    if (originalJob?.prompt) {
      detectedLang = await detectLanguage(originalJob.prompt);
    }

    setExportJobs(prev => prev.map(ej => ej.id === id ? { ...ej, status: 'completed', progress: 100, downloadUrl: '#' } : ej));
    
    // Update the original job with detected language in details
    if (originalJob) {
      onUpdateJob(assetId, { 
        detectedLanguage: detectedLang,
        details: { ...originalJob.details!, detectedLanguage: detectedLang } as any
      });
    }

    addAuditEntry('Export & Linguistic Analysis', `Asset ${assetId} transcoded to ${format}. Detected Language: ${detectedLang}`, 'success');
    addNotification("Export & Language Detection Complete", "success");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        // FIX: Removed duplicate cpu_temp property in object literal to resolve syntax error.
        const newData: TelemetryData = {
          timestamp: new Date().toISOString(), latency: Math.floor(Math.random() * 12) + 6,
          node_status: 'online', cpu_temp: 38, gpu_temp: 41, anomaly_score: 0.01,
          region: systemRegion, uptime: '100%', mtls_status: 'REJECT_INVALID'
        };
        return [...prev.slice(-19), newData];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [systemRegion]);

  return (
    <div className={`h-screen flex flex-col bg-[#050505] relative overflow-hidden text-gray-200 font-inter ${isSimulationMode || userSubscription.tier === SubscriptionTier.SOVEREIGN ? 'border-4 border-dashed border-blue-500/20' : ''}`}>
      {isLoggedIn && (
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 glass z-20 shrink-0">
          <div className="flex items-center gap-4">
            <Shield size={20} className="text-blue-500" />
            <h1 className="text-sm font-black tracking-tighter uppercase">Nexa v1.42</h1>
          </div>
          <nav className="flex items-center gap-8">
            {['main', 'system', 'partner', 'subscription'].map(tab => (
              (tab === 'system' && userSubscription.role !== UserRole.OPERATOR) ? null :
              (tab === 'partner' && userSubscription.role !== UserRole.RESELLER) ? null :
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === tab ? 'text-blue-400' : 'text-gray-500 hover:text-white'}`}>
                {tab === 'main' ? 'Synthesis' : tab === 'system' ? 'SOC Oversight' : tab === 'partner' ? 'Partners' : 'Treasury'}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] mono">Credits: {userSubscription.computeCredits}</div>
            <button onClick={() => {setIsLoggedIn(false); setIsSimulationMode(false);}}><LogOut size={18} className="text-gray-500 hover:text-red-400" /></button>
          </div>
        </header>
      )}

      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {isLoggedIn ? (
          <>
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
              <TelemetryOverlay data={telemetry} />
              {activeTab === 'main' && (
                <CreatorDashboard jobs={jobs} exportJobs={exportJobs} onNewRender={onNewRender} onGenerateImage={onGenerateImage} onUpload={() => {}} onUpdateJob={onUpdateJob} onDeleteJob={(id) => setJobs(prev => prev.filter(j => j.id !== id))} onExportAsset={handleExportAsset} onCancelExport={(id) => setExportJobs(prev => prev.filter(ej => ej.id !== id))} isRendering={isProcessing} notify={addNotification} hasPaidKey={isSimulationMode || hasPaidKey} onConnectKey={handleConnectKey} auditLog={auditLog} addAuditEntry={addAuditEntry} userSubscription={userSubscription} onSendMessage={onSendMessage} />
              )}
              {activeTab === 'system' && <SystemDashboard telemetry={telemetry} auditLog={auditLog} subscription={userSubscription} />}
              {activeTab === 'partner' && <ResellerDashboard />}
              {activeTab === 'subscription' && <SubscriptionManager subscription={userSubscription} onUpgrade={() => {}} onRedeemVoucher={handleRedeemVoucher} isProcessing={isProcessing} />}
            </div>
            <div className="w-[350px] shrink-0 hidden xl:block"><ChatInterface messages={chatHistory} onSendMessage={onSendMessage} isProcessing={isProcessing} /></div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
              <div className="glass p-12 rounded-[3rem] border border-white/10 text-center space-y-8 flex flex-col items-center shadow-2xl">
                <Shield size={48} className="text-blue-600 shadow-2xl" />
                <h2 className="text-3xl font-black uppercase tracking-tight">Sovereign Cluster</h2>
                <p className="text-xs text-gray-500">mTLS Verification required for production synthesis.</p>
                {!legalAccepted ? <LegalConsent onAccept={() => setLegalAccepted(true)} /> : (
                  <button onClick={() => setIsLoggedIn(true)} className="w-full py-4 bg-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 active:scale-95 transition-all">Authenticate Node</button>
                )}
              </div>
              <div className="glass p-12 rounded-[3rem] border border-amber-500/30 bg-amber-500/5 text-center space-y-8 flex flex-col items-center">
                <TestTube size={48} className="text-amber-500" />
                <h2 className="text-3xl font-black uppercase tracking-tight">Simulation Node</h2>
                <p className="text-xs text-amber-500/70 uppercase font-bold tracking-widest">Zero-Auth Validation Environment.</p>
                <div className="grid grid-cols-1 gap-3 w-full">
                  <button onClick={() => handleTestLogin(UserRole.OPERATOR)} className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"><Shield size={14} className="text-blue-400" /> Admin Context</button>
                  <button onClick={() => handleTestLogin(UserRole.CREATOR)} className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"><Zap size={14} className="text-emerald-400" /> Creator Context</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;