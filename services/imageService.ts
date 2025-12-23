
import { GoogleGenAI } from "@google/genai";

export const generateHeroImage = async (): Promise<string | null> => {
  try {
    // Fix: initialize GoogleGenAI inside function to follow SDK guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = "A breathtaking 3D split-view composition. The left side represents 'Software Engineering': clean crystalline structures, intricate glowing electric-blue circuit patterns, and floating snippets of elegant source code. The right side represents 'Data Science': fluid holographic neural networks, vibrant violet and magenta probability clouds, and dynamic 3D data visualizations. The two sides are separated by a subtle vertical beam of pulsating white light. Cinematic dark background, high-tech, futuristic, photorealistic digital art, 8k, ultra-wide aspect ratio.";
    
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
    // Fix: initialize GoogleGenAI inside function
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let prompt = "";
    
    if (projectId === 'finsight') {
      prompt = "Professional 3D isometric visualization of financial growth. Holographic stock market candles, golden currency symbols, and glowing emerald green data nodes on a dark tech background. High-fidelity investment analyst concept, 4k, cinematic lighting.";
    } else if (projectId === 'dieselgate') {
      prompt = "Cinematic 3D art of a modern car exhaust pipe. The smoke coming out is composed of complex mathematical formulas and data charts (causal inference). Deep blue and carbon grey color palette with glowing red accents. Atmospheric, dramatic lighting, 8k resolution.";
    } else if (projectId === 'adw') {
      prompt = "A high-tech 3D visualization of an automated data warehouse. Intricate networks of glowing translucent pipelines carrying streams of binary data into a central crystalline server core. Deep indigo and cyan lighting, metallic architectural details, futuristic ETL infrastructure, 8k resolution.";
    } else if (projectId === 'legal-eagle') {
      prompt = "Professional 3D visualization of AI legal document analysis. A sophisticated holographic eagle interface scanning floating digital contracts and legal scrolls. Critical clauses highlighted with a soft amber glow. Sleek dark law firm aesthetic, charcoal and deep blue palette, 4k, cinematic focus.";
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
