
import React, { useState } from 'react';
import { BotPersonality } from '../types';

interface Props {
  code: string;
  personality: BotPersonality;
}

const CodeExporter: React.FC<Props> = ({ code, personality }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
      <div className="bg-[#2d2d2d] px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-xs font-mono ml-4">bot.js — {personality.suggestedFramework}</span>
        </div>
        <button 
          onClick={handleCopy}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center ${copied ? 'bg-green-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {copied ? <><i className="fa-solid fa-check mr-2"></i> Copied!</> : <><i className="fa-regular fa-copy mr-2"></i> Copy Code</>}
        </button>
      </div>

      <div className="p-6">
        <div className="mb-6 bg-blue-900/30 border border-blue-500/30 p-4 rounded-xl">
          <h4 className="text-blue-400 text-sm font-bold mb-2 flex items-center">
            <i className="fa-solid fa-circle-info mr-2"></i> Next Steps:
          </h4>
          <ol className="text-gray-300 text-sm list-decimal list-inside space-y-1">
            <li>Create a new folder and run <code className="bg-black/30 px-1.5 rounded text-[#24a1de]">npm init -y</code></li>
            <li>Install the framework: <code className="bg-black/30 px-1.5 rounded text-[#24a1de]">npm install {personality.suggestedFramework}</code></li>
            <li>Create <code className="bg-black/30 px-1.5 rounded text-[#24a1de]">bot.js</code> and paste the code below</li>
            <li>Get your token from <a href="https://t.me/BotFather" target="_blank" className="text-[#24a1de] underline">@BotFather</a></li>
            <li>Run with <code className="bg-black/30 px-1.5 rounded text-[#24a1de]">node bot.js</code></li>
          </ol>
        </div>

        <pre className="text-[#d4d4d4] font-mono text-sm overflow-x-auto p-4 bg-black/20 rounded-xl leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeExporter;
