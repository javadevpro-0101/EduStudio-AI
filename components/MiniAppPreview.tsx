
import React, { useState } from 'react';
import { MiniAppProject } from '../types';

interface Props {
  project: MiniAppProject;
}

const MiniAppPreview: React.FC<Props> = ({ project }) => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const activePage = project.pages[activePageIndex];

  return (
    <div className="w-full max-w-[380px] h-[760px] bg-[#f0f2f5] rounded-[3.5rem] border-[10px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col ring-8 ring-slate-100/50">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-20"></div>

      {/* Telegram Mini App Header */}
      <div className="bg-white px-6 pt-10 pb-4 flex items-center justify-between border-b shadow-sm">
        <div className="flex items-center space-x-3">
          <button className="text-[#24a1de] font-bold text-sm">Close</button>
          <div className="h-4 w-px bg-slate-200"></div>
          <h4 className="font-bold text-sm text-slate-800 truncate max-w-[120px]">{project.name}</h4>
        </div>
        <div className="flex space-x-3 text-slate-400">
          <i className="fa-solid fa-ellipsis"></i>
        </div>
      </div>

      {/* Mini App Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar" style={{ backgroundColor: '#ffffff' }}>
        <div className="animate-fadeIn">
          <h2 className="text-2xl font-black text-slate-900 mb-2">{activePage.title}</h2>
          <p className="text-sm text-slate-500 mb-8">{activePage.content}</p>

          <div className="space-y-4">
            {activePage.components.map((comp, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                  comp.type === 'button' ? 'bg-[#24a1de] text-white border-transparent' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    comp.type === 'button' ? 'bg-white/20' : 'bg-[#24a1de]/10 text-[#24a1de]'
                  }`}>
                    <i className={`fa-solid ${
                      comp.type === 'button' ? 'fa-bolt' : 
                      comp.type === 'card' ? 'fa-layer-group' : 
                      comp.type === 'input' ? 'fa-keyboard' : 
                      comp.type === 'list' ? 'fa-list-ul' : 'fa-chart-pie'
                    }`}></i>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${comp.type === 'button' ? 'text-white' : 'text-slate-800'}`}>
                      {comp.label}
                    </p>
                    <p className={`text-[10px] ${comp.type === 'button' ? 'text-white/70' : 'text-slate-400'}`}>
                      {comp.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dummy visual element to make it feel "app-like" */}
          <div className="mt-8 p-6 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
            <i className="fa-solid fa-wand-magic-sparkles text-2xl text-slate-300 mb-2"></i>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">AI Generated Dynamic Area</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mini App Standard) */}
      <div className="bg-white/80 backdrop-blur-md border-t px-4 py-3 pb-8 flex justify-around items-center">
        {project.pages.map((page, idx) => (
          <button 
            key={idx}
            onClick={() => setActivePageIndex(idx)}
            className={`flex flex-col items-center space-y-1 transition-all ${
              activePageIndex === idx ? 'text-[#24a1de]' : 'text-slate-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              activePageIndex === idx ? 'bg-[#24a1de]/10' : ''
            }`}>
              <i className={`fa-solid text-lg ${
                idx === 0 ? 'fa-house' : 
                idx === 1 ? 'fa-box' : 
                idx === 2 ? 'fa-user' : 'fa-gear'
              }`}></i>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{page.title.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MiniAppPreview;
