
import React from 'react';
import { BotPersonality, BotCommand } from '../types';

interface Props {
  personality: BotPersonality;
  setPersonality: React.Dispatch<React.SetStateAction<BotPersonality | null>>;
}

const BotDesigner: React.FC<Props> = ({ personality, setPersonality }) => {
  const updateField = (field: keyof BotPersonality, value: any) => {
    setPersonality(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateCommand = (index: number, field: keyof BotCommand, value: string) => {
    const newCommands = [...personality.commands];
    newCommands[index] = { ...newCommands[index], [field]: value };
    updateField('commands', newCommands);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center space-x-3 mb-8">
        <i className="fa-solid fa-gears text-[#24a1de] text-2xl"></i>
        <h2 className="text-2xl font-bold">Bot Configuration</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Bot Display Name</label>
          <input 
            type="text" 
            value={personality.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#24a1de] outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Short Description (Bio)</label>
          <textarea 
            value={personality.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#24a1de] outline-none transition-all h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Welcome Message (/start)</label>
          <textarea 
            value={personality.welcomeMessage}
            onChange={(e) => updateField('welcomeMessage', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#24a1de] outline-none transition-all h-32"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Menu Commands</label>
          <div className="space-y-3">
            {personality.commands.map((cmd, idx) => (
              <div key={idx} className="flex space-x-3 items-center group">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">/</span>
                  <input 
                    type="text" 
                    value={cmd.command}
                    onChange={(e) => updateCommand(idx, 'command', e.target.value.replace('/', ''))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#24a1de] outline-none transition-all"
                  />
                </div>
                <input 
                  type="text" 
                  value={cmd.description}
                  onChange={(e) => updateCommand(idx, 'description', e.target.value)}
                  placeholder="Command description..."
                  className="flex-[2] px-4 py-3 rounded-xl border border-gray-200 focus:border-[#24a1de] outline-none transition-all"
                />
                <button 
                  onClick={() => {
                    const newCmds = personality.commands.filter((_, i) => i !== idx);
                    updateField('commands', newCmds);
                  }}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))}
            <button 
              onClick={() => updateField('commands', [...personality.commands, { command: 'new', description: 'What this does' }])}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-[#24a1de] hover:border-[#24a1de] transition-all font-medium"
            >
              <i className="fa-solid fa-plus mr-2"></i> Add Command
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotDesigner;
