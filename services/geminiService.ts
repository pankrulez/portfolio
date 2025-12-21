
import { GoogleGenAI, Modality, Type, FunctionDeclaration, LiveServerMessage } from "@google/genai";
import { BIO_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Audio Utilities
export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createBlob(data: Float32Array): any {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// Function Declarations
const controlUIFunctionDeclaration: FunctionDeclaration = {
  name: 'controlUI',
  parameters: {
    type: Type.OBJECT,
    description: 'Control the website UI based on user requests like scrolling, opening links, or filtering projects.',
    properties: {
      action: {
        type: Type.STRING,
        description: 'The action to perform: "scroll_to", "filter_projects", "download_cv", "open_social"',
      },
      target: {
        type: Type.STRING,
        description: 'The target element or value (e.g., "projects", "Data Science", "linkedin")',
      },
    },
    required: ['action'],
  },
};

export const chatWithAI = async (message: string, history: { role: 'user' | 'assistant', text: string }[]) => {
  try {
    const contents = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: BIO_PROMPT + "\nYou have the ability to control the UI. Use controlUI tool for site navigation.",
        tools: [{ googleSearch: {} }, { functionDeclarations: [controlUIFunctionDeclaration] }]
      },
    });

    return {
      text: response.text || (response.functionCalls ? "Executing your request..." : "I'm sorry, I couldn't process that."),
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
      functionCalls: response.functionCalls
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Connection trouble. Please try again.", sources: [] };
  }
};

export const connectLiveAI = (callbacks: any) => {
  const liveAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return liveAI.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
      },
      systemInstruction: BIO_PROMPT + " You are now in LIVE VOICE mode. Be concise and conversational. If the user asks to see something, use your tools.",
      tools: [{ functionDeclarations: [controlUIFunctionDeclaration] }]
    },
  });
};

export const speakText = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say naturally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    return null;
  }
};

export const decodeAndPlayAudio = async (base64Audio: string) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const bytes = decode(base64Audio);
  const buffer = await decodeAudioData(bytes, audioContext, 24000, 1);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
  return source;
};
