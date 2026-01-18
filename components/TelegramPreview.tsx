
import React, { useState, useEffect, useRef } from 'react';
import { BotPersonality, Message } from '../types';
import { simulateBotResponse } from '../geminiService';

interface Props {
  personality: BotPersonality;
}

const TelegramPreview: React.FC<Props> = ({ personality }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'start',
        text: personality.welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, [personality.welcomeMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await simulateBotResponse(userMsg.text, personality);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] h-[780px] bg-[#f0f2f5] rounded-[3.5rem] border-[12px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col ring-8 ring-slate-100/50">
      {/* Dynamic Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-900 rounded-b-2xl z-20"></div>

      {/* Top Bar */}
      <div className="bg-[#517da2] text-white p-4 pt-12 flex items-center shadow-lg">
        <i className="fa-solid fa-arrow-left mr-5 text-lg opacity-70"></i>
        <div className="w-12 h-12 rounded-full bg-[#24a1de] flex items-center justify-center text-xl font-black mr-4 border-2 border-white/20 shadow-sm">
          {personality.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold truncate text-base tracking-tight">{personality.name}</h3>
          <p className="text-[11px] text-blue-100 opacity-70 font-medium">
            {isTyping ? 'bot is typing...' : 'bot'}
          </p>
        </div>
        <div className="flex space-x-4 ml-2 opacity-70">
          <i className="fa-solid fa-magnifying-glass"></i>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat no-scrollbar"
      >
        <div className="flex justify-center my-6">
          <span className="bg-black/10 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm uppercase tracking-widest">
            Simulated Session
          </span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-md relative transition-all ${
              msg.sender === 'user' 
                ? 'bg-[#effdde] text-slate-800 rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <div className="flex items-center justify-end space-x-1 mt-1 opacity-40 text-[9px] font-bold">
                <span>{msg.timestamp.getHours()}:{msg.timestamp.getMinutes().toString().padStart(2, '0')}</span>
                {msg.sender === 'user' && <i className="fa-solid fa-check-double text-[8px] text-blue-600"></i>}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* Command Shortcuts */}
      <div className="bg-white/80 backdrop-blur-md py-3 px-4 flex items-center space-x-2 border-t overflow-x-auto no-scrollbar">
        {personality.commands.map((cmd, idx) => (
          <button 
            key={idx}
            onClick={() => setInputText(`/${cmd.command}`)}
            className="whitespace-nowrap bg-blue-50 px-4 py-2 rounded-full text-[11px] font-black text-[#24a1de] hover:bg-[#24a1de] hover:text-white transition-all shadow-sm border border-blue-100"
          >
            /{cmd.command}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white flex items-center space-x-3 border-t pb-8">
        <button className="text-slate-400 p-1 hover:text-[#24a1de] transition-colors">
          <i className="fa-regular fa-face-smile text-2xl"></i>
        </button>
        <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-2 flex items-center border border-slate-100">
          <input 
            type="text" 
            placeholder="Message"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full bg-transparent outline-none text-sm font-medium text-slate-700"
          />
        </div>
        {inputText.trim() ? (
          <button 
            onClick={handleSendMessage}
            className="w-11 h-11 bg-[#24a1de] text-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-all shadow-blue-500/30"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        ) : (
          <button className="w-11 h-11 text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-microphone text-xl"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default TelegramPreview;
