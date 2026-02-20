import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { NEXA_SYSTEM_INSTRUCTION } from "../constants";

export const getNexaTools = (): FunctionDeclaration[] => [
  {
    name: 'initiate_secure_checkout',
    description: "Routes the user to the correct payment gateway (Paystack for ZAR, Stripe for USD) and triggers the welcome packet.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        user_email: { type: Type.STRING },
        location: { type: Type.STRING, enum: ["South Africa", "International"] },
        plan_tier: { type: Type.STRING, enum: ["Professional", "Sovereign_Legal"] }
      },
      required: ["user_email", "location", "plan_tier"]
    }
  },
  {
    name: 'execute_subscription_workflow',
    description: "Processes payment, creates account, and emails secure login credentials.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        email: { type: Type.STRING },
        currency: { type: Type.STRING, enum: ["ZAR", "USD"] },
        plan: { type: Type.STRING, enum: ["Professional", "Sovereign_Legal"] },
        language: { type: Type.STRING, description: "Preferred language for the onboarding email.", default: "English" }
      },
      required: ["email", "currency", "plan"]
    }
  },
  {
    name: 'provision_sovereign_shell',
    description: "Orchestrates the full Terraform infrastructure stack (VPC, Cloud Run, Vertex AI) in africa-south1.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        project_id: { type: Type.STRING },
        environment: { type: Type.STRING, enum: ["production", "staging", "development"] },
        enable_vpc_service_controls: { type: Type.BOOLEAN, default: true },
        billing_gateways: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING, enum: ["Stripe", "Paystack"] }
        }
      },
      required: ["project_id", "environment"]
    }
  },
  {
    name: 'diagnose_system_log',
    description: 'Analyzes raw infrastructure logs to pinpoint hardware failures like GPU_THERMAL_FAILURE.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        logs: { type: Type.STRING, description: 'Raw or base64 log data.' }
      },
      required: ['logs'],
    },
  },
  {
    name: 'trigger_failover',
    description: "Autonomously migrates workloads to a healthy node in the africa-south1-b target region.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        reason: { type: Type.STRING, description: "The diagnosed cause (e.g., GPU_THERMAL_FAILURE)" },
        target_region: { type: Type.STRING, default: "africa-south1-b" }
      },
      required: ["reason"]
    }
  },
  {
    name: 'process_new_subscription',
    description: "Finalizes a payment, updates the database, and sends a multi-language confirmation email.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        user_id: { type: Type.STRING },
        currency: { type: Type.STRING, enum: ["ZAR", "USD", "EUR"] },
        plan_id: { type: Type.STRING },
        email_template: { type: Type.STRING, description: "e.g., 'welcome_legal_zu'" }
      },
      required: ["user_id", "currency", "plan_id"]
    }
  },
  {
    name: 'legal_discovery_engine',
    description: "Transcribes and translates legal video evidence with certified accuracy.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        video_id: { type: Type.STRING },
        mode: { type: Type.STRING, enum: ["verbatim", "clean_verbatim"] },
        target_language: { type: Type.STRING }
      },
      required: ["video_id", "mode"]
    }
  }
];

export const createGenAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export async function transcribeVideo(prompt: string): Promise<string> {
  const ai = createGenAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Narrate VR script for: "${prompt}". Return ONLY the text.`,
  });
  return response.text?.trim() || "Linguistic synthesis unavailable.";
}

export async function detectLanguage(text: string): Promise<string> {
  const ai = createGenAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify the primary language used in this text: "${text}". Return ONLY the language name (e.g., "English", "IsiZulu", "Afrikaans"). If unsure, return "Unknown".`,
    });
    return response.text?.trim() || "Unknown";
  } catch (e) {
    return "Unknown";
  }
}
