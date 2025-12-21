
import { GoogleGenAI } from "@google/genai";

export const generateHeroImage = async (): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = "A cinematic, wide-angle 3D visualization of advanced Data Science and Machine Learning. Complex holographic neural networks with glowing synaptic connections, floating mathematical structures, and dynamic data streams. A professional dark laboratory aesthetic with deep charcoal, electric cyan, and soft gold accents. High-tech, futuristic, photorealistic digital art, 8k, ultra-wide aspect ratio.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
