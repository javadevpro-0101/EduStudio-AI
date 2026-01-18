
import React, { useState } from 'react';
import { EducationalProject } from './types';
import { generateEducationalContent } from './geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<EducationalProject | null>(null);
  const [tab, setTab] = useState<'plan' | 'quiz' | 'app'>('plan');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await generateEducationalContent(topic);
      setProject(data);
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <i className="fa-solid fa-graduation-cap text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-black text-indigo-900 tracking-tight">EduStudio AI</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">O'qituvchilar Markazi</p>
          </div>
        </div>

        {project && (
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['plan', 'quiz', 'app'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${
                  tab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t === 'plan' ? 'Dars Rejasi' : t === 'quiz' ? 'Testlar' : 'Student App'}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {!project ? (
          <div className="max-w-3xl mx-auto py-16 text-center animate-fadeIn">
            <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
              Darsingizni <span className="text-indigo-600">mukammal</span> qiling.
            </h2>
            <p className="text-slate-500 text-lg mb-10">
              Mavzuni kiriting, biz dars rejasi, testlar va o'quvchilar uchun portalni tayyorlab beramiz.
            </p>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-indigo-50">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Masalan: Quyosh tizimi, Trigonometriya asoslari yoki Ingliz tili grammatikasi..."
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg mb-6"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3 text-lg"
              >
                {loading ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i><span>Tayyorlanmoqda...</span></>
                ) : (
                  <><i className="fa-solid fa-magic"></i><span>Dars Paketini Yaratish</span></>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Subject Overview */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-black text-slate-900">{project.subject}</h3>
                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-1">Maqsad: {project.targetAge}</p>
              </div>
              <button 
                onClick={() => setProject(null)}
                className="text-slate-400 hover:text-red-500 font-bold text-sm"
              >
                <i className="fa-solid fa-rotate-right mr-2"></i> Yangi dars
              </button>
            </div>

            {tab === 'plan' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.curriculum.map((module, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                        Modul {i + 1}
                      </span>
                      <span className="text-slate-400 text-xs font-bold"><i className="fa-regular fa-clock mr-1"></i>{module.duration}</span>
                    </div>
                    <h4 className="text-lg font-black mb-3">{module.title}</h4>
                    <ul className="space-y-2 mb-4">
                      {module.keyPoints.map((point, pi) => (
                        <li key={pi} className="text-sm text-slate-600 flex items-start">
                          <i className="fa-solid fa-check text-indigo-500 mt-1 mr-2 text-[10px]"></i>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">Amaliy mashg'ulot:</p>
                      <p className="text-sm text-slate-700 italic">{module.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'quiz' && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                  <h4 className="font-black text-xl">Bilimlarni tekshirish testi</h4>
                  <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase">{project.quiz.length} Savol</span>
                </div>
                <div className="p-8 space-y-8">
                  {project.quiz.map((q, i) => (
                    <div key={i} className="pb-8 border-b border-slate-100 last:border-0">
                      <p className="font-bold text-slate-800 text-lg mb-4">{i + 1}. {q.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`p-4 rounded-xl border text-sm flex justify-between items-center ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                            {opt}
                            {opt === q.correctAnswer && <i className="fa-solid fa-circle-check"></i>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'app' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div className="bg-[#1e1e1e] rounded-3xl p-8 shadow-2xl">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-white font-bold">Portal Code (React)</h3>
                     <button 
                        onClick={() => navigator.clipboard.writeText(project.studentAppCode)}
                        className="bg-white/10 text-white text-xs px-4 py-2 rounded-xl"
                     >Nusxa olish</button>
                   </div>
                   <pre className="text-indigo-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
                     <code>{project.studentAppCode}</code>
                   </pre>
                </div>
                
                <div className="space-y-6">
                   <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                     <h3 className="text-xl font-black mb-4">Talabalar Portali</h3>
                     <p className="text-slate-600 text-sm leading-relaxed mb-6">
                       Ushbu kod yordamida o'quvchilaringiz uchun mobil platforma yaratishingiz mumkin. 
                       Unda barcha dars materiallari va testlar jamlangan bo'ladi.
                     </p>
                     <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
                        <i className="fa-solid fa-mobile-screen text-4xl text-slate-200 mb-4"></i>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Portal Preview Simulyatsiyasi</p>
                        <p className="text-xs text-slate-400 mt-2">Dizayn rang kodi: {project.themeColor}</p>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
