
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHeroImage = async (): Promise<string | null> => {
  try {
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
    console.error("Hero Image Generation Error:", error);
    return null;
  }
};

export const generateProjectImage = async (projectId: string): Promise<string | null> => {
  try {
    let prompt = "";
    
    if (projectId === 'finsight') {
      prompt = "Professional 3D isometric visualization of financial growth. Holographic stock market candles, golden currency symbols, and glowing emerald green data nodes on a dark tech background. High-fidelity investment analyst concept, 4k, cinematic lighting.";
    } else if (projectId === 'dieselgate') {
      prompt = "Cinematic 3D art of a modern car exhaust pipe. The smoke coming out is composed of complex mathematical formulas and data charts (causal inference). Deep blue and carbon grey color palette with glowing red accents. Atmospheric, dramatic lighting, 8k resolution.";
    } else if (projectId === 'adw') {
      prompt = "Futuristic 3D data warehouse infrastructure. Glowing purple and deep blue fiber optic pipelines connecting massive glass data silos. Shimmering binary code particles floating in a digital void. High-tech ETL pipeline visualization, 8k, cinematic lighting.";
    } else if (projectId === 'mobile-games-ab-testing') {
      prompt = "Professional 3D isometric gaming dashboard. A mobile phone screen showing two different game UI variants side by side. Statistical charts and bar graphs floating above with glowing data points. Vibrant game-style aesthetic with soft rounded edges, 4k, clean composition.";
    } else {
      return null;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "4:3"
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
    console.error(`Project Image Generation Error (${projectId}):`, error);
    return null;
  }
};
