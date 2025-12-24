import { GoogleGenAI, Type } from "@google/genai";
import { EventType, AISuggestionResponse, LiturgyData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Cache simples para evitar chamadas excessivas
const CACHE_KEY_PREFIX = 'parish_liturgy_cache_';

export const refineEventDetails = async (rawInput: string): Promise<AISuggestionResponse | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o seguinte texto bruto sobre um evento paroquial e estruture-o. 
      Se o texto for vago, infira detalhes baseados no contexto católico comum.
      Texto: "${rawInput}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedTitle: { type: Type.STRING },
            refinedDescription: { type: Type.STRING },
            suggestedType: { type: Type.STRING, enum: Object.values(EventType) },
          },
          required: ["refinedTitle", "refinedDescription", "suggestedType"],
        },
      },
    });
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error: any) {
    console.error("Error refining event:", error);
    return null;
  }
};

export const suggestHomilyTheme = async (readings: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Com base nestas leituras ou tema: "${readings}", sugira um tema curto e inspirador para a homilia (máximo 2 frases).`,
    });
    return response.text || "Inspirai-nos, Senhor.";
   } catch (error) {
       return "Reflexão em oração.";
   }
};

export const fetchDailyLiturgy = async (date: Date): Promise<LiturgyData | null> => {
  const dateKey = date.toISOString().split('T')[0];
  const cached = localStorage.getItem(CACHE_KEY_PREFIX + dateKey);
  
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      localStorage.removeItem(CACHE_KEY_PREFIX + dateKey);
    }
  }

  try {
    const dateStr = date.toLocaleDateString('pt-BR');
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Forneça a Liturgia Diária Católica para o dia ${dateStr}. 
      Você deve retornar o nome oficial da celebração litúrgica, o texto da 1ª Leitura, o Salmo Responsorial (com refrão), a 2ª Leitura (obrigatória em domingos e solenidades) e o Evangelho completo. 
      Adicione também um campo "reflection" com uma breve meditação de 3 frases sobre o Evangelho.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            celebrationName: { type: Type.STRING },
            firstReading: { type: Type.STRING },
            psalm: { type: Type.STRING },
            secondReading: { type: Type.STRING },
            gospel: { type: Type.STRING },
            reflection: { type: Type.STRING }
          },
          required: ["celebrationName", "firstReading", "psalm", "gospel"],
        },
      },
    });
    
    const text = response.text;
    if (text) {
      const data = JSON.parse(text);
      localStorage.setItem(CACHE_KEY_PREFIX + dateKey, JSON.stringify(data));
      return data;
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching liturgy:", error);
    
    // Tratamento específico de erro de cota
    if (error?.message?.includes('429') || error?.status === 429) {
       // Retorna um objeto indicando erro de limite para que a UI possa reagir
       throw new Error('QUOTA_EXCEEDED');
    }
    
    return null;
  }
};