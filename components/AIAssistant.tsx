
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI, speakText, decodeAndPlayAudio, connectLiveAI, createBlob, decode, decodeAudioData } from '../services/geminiService';
import { Message } from '../types';

interface MessageExtended extends Message {
  sources?: any[];
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [input, setInput] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState<MessageExtended[]>([
    { 
      role: 'assistant', 
      content: "Hello! I am Pankaj's AI assistant. I can help you navigate the portfolio or answer questions about his experience. Try 'Live Voice' mode for a chat!",
      timestamp: new Date() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const liveSessionRef = useRef<any>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleFunctionCall = (fc: any) => {
    const { action, target } = fc.args;
    switch (action) {
      case 'scroll_to':
        document.getElementById(target?.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'filter_projects':
        window.dispatchEvent(new CustomEvent('filterProjects', { detail: target }));
        break;
      case 'download_cv':
        window.open("https://drive.google.com/uc?export=download&id=1FyOlK9FpdVwd79QaYyWZbNOEG8EDhjai", "_blank");
        break;
      case 'open_social':
        const links: any = { linkedin: "https://linkedin.com/in/pankajkapri", github: "https://github.com/pankrulez" };
        if (links[target?.toLowerCase()]) window.open(links[target.toLowerCase()], "_blank");
        break;
    }
  };

  const stopLiveMode = () => {
    setIsLiveMode(false);
    liveSessionRef.current = null;
    inputAudioCtxRef.current?.close();
    outputAudioCtxRef.current?.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  const startLiveMode = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;

      const sessionPromise = connectLiveAI({
        onopen: () => {
          setIsLoading(false);
          setIsLiveMode(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0);
            sessionPromise.then(session => session.sendRealtimeInput({ media: createBlob(data) }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          if (msg.toolCall) msg.toolCall.functionCalls.forEach(handleFunctionCall);
          const audioBase64 = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioBase64 && outputAudioCtxRef.current) {
            const ctx = outputAudioCtxRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const buffer = await decodeAudioData(decode(audioBase64), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
        },
        onerror: () => stopLiveMode(),
        onclose: () => stopLiveMode()
      });
      liveSessionRef.current = sessionPromise;
    } catch {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMsg: MessageExtended = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    const result = await chatWithAI(input, messages.map(m => ({ role: m.role, text: m.content })));
    if (result.functionCalls) result.functionCalls.forEach(handleFunctionCall);
    setMessages(prev => [...prev, { role: 'assistant', content: result.text, sources: result.sources, timestamp: new Date() }]);
    setIsLoading(false);
    if (isVoiceEnabled && result.text) {
      const audio = await speakText(result.text);
      if (audio) await decodeAndPlayAudio(audio);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative z-[60] ${isOpen ? 'bg-rose-500 rotate-90 scale-90' : 'bg-indigo-600 hover:scale-110 pulse-btn'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth={2}/></svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-4 right-0 w-[calc(100vw-2rem)] sm:w-[380px] h-[75vh] max-h-[500px] glass rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 border border-white/10">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-xs text-white flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-rose-500 animate-ping' : 'bg-indigo-500 animate-pulse'}`}></div>
              {isLiveMode ? "Live Voice" : "AI Assistant"}
            </h3>
            <div className="flex gap-2">
              <button onClick={isLiveMode ? stopLiveMode : startLiveMode} className={`p-1.5 rounded-full ${isLiveMode ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" strokeWidth={2}/></svg>
              </button>
              <button onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} className={`p-1.5 rounded-full ${isVoiceEnabled ? 'bg-indigo-500' : 'bg-white/5'}`}>
                 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeWidth={2}/></svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
            {isLiveMode ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex gap-1 h-10 items-center">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1 bg-indigo-500 rounded-full animate-voice-bar" style={{ animationDelay: `${i*0.1}s` }}></div>
                  ))}
                </div>
                <p className="text-gray-400 text-xs">Live Mode Active</p>
                <button onClick={stopLiveMode} className="px-5 py-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider">End Session</button>
              </div>
            ) : (
              <>
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/10'}`}>{m.content}</div>
                  </div>
                ))}
                {isLoading && <div className="flex gap-1.5 p-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div></div>}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {!isLiveMode && (
            <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 shrink-0">
              <div className="relative">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="w-full bg-black/40 border border-white/10 rounded-full py-2.5 px-4 pr-10 focus:border-indigo-500 text-xs text-white outline-none" />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeWidth={2}/></svg></button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
