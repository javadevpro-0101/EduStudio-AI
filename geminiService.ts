
import { GoogleGenAI, Type } from "@google/genai";
import { EducationalProject, BotPersonality } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates structured educational content including curriculum and a quiz using Gemini 3 Pro.
 */
export const generateEducationalContent = async (prompt: string): Promise<EducationalProject> => {
  const response = await ai.models.generateContent({
    // Using gemini-3-pro-preview for complex reasoning and content generation
    model: 'gemini-3-pro-preview',
    contents: `Siz professional metodistsiz. Quyidagi mavzu bo'yicha o'qituvchi uchun to'liq dars paketi yarating: "${prompt}".
               Paket quyidagilardan iborat bo'lsin:
               1. Mavzuning qisqacha mazmuni va maqsadli yosh guruhi.
               2. 3 ta asosiy dars moduli (title, duration, keyPoints, activity).
               3. 5 ta savoldan iborat quiz (question, options, correctAnswer).
               4. Talabalar uchun ushbu darsga moslashtirilgan React + Tailwind CSS mobil ilovasi kodi.
               5. Ilova uchun mos akademik rang (hex formatida).

               Ma'lumotlarni JSON formatida qaytaring.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          targetAge: { type: Type.STRING },
          themeColor: { type: Type.STRING },
          curriculum: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                activity: { type: Type.STRING }
              },
              required: ["title", "duration", "keyPoints", "activity"]
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer"]
            }
          },
          studentAppCode: { type: Type.STRING }
        },
        required: ["subject", "targetAge", "themeColor", "curriculum", "quiz", "studentAppCode"]
      }
    }
  });

  const jsonStr = response.text?.trim() || '{}';
  return JSON.parse(jsonStr) as EducationalProject;
};

/**
 * Simulates a response from a Telegram bot based on its defined personality and user input.
 */
export const simulateBotResponse = async (userText: string, personality: BotPersonality): Promise<string> => {
  const response = await ai.models.generateContent({
    // Using gemini-3-flash-preview for fast and cost-effective chat simulation
    model: 'gemini-3-flash-preview',
    contents: `Siz quyidagi personajsiz:
               Ism: ${personality.name}
               Tavsif: ${personality.description}
               
               Foydalanuvchi xabari: "${userText}"
               
               Ushbu personaj nomidan qisqa va mos javob qaytaring.`,
  });

  return response.text || "Kechirasiz, xatolik yuz berdi.";
};
