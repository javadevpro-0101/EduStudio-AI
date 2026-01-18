
import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- Ma'lumot turlari ---
interface LessonModule {
  title: string;
  duration: string;
  keyPoints: string[];
  activity: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface EducationalProject {
  subject: string;
  targetAge: string;
  curriculum: LessonModule[];
  quiz: QuizQuestion[];
  studentAppCode: string;
  themeColor: string;
  summary: string;
}

// --- Gemini API Xizmati ---
const generateContent = async (topic: string): Promise<EducationalProject> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Siz xalqaro darajadagi ta'lim metodistisiz. Quyidagi mavzu bo'yicha to'liq o'quv paketini yarating: "${topic}".
    
    Paket quyidagilarni o'z ichiga olishi shart:
    1. Mavzuning qisqacha mazmuni (summary) va maqsadli auditoriya.
    2. 3 ta mantiqiy dars moduli (title, duration, keyPoints, activity).
    3. 5 ta tanlovli test savoli (question, options, correctAnswer).
    4. Ushbu darsga oid ma'lumotlarni ko'rsatuvchi Talabalar uchun "Student Portal" kodi (React + Tailwind CSS yordamida, faqat bitta komponent).
    5. Brend rangi (hex formatida).

    Javobni FAQAT JSON formatida qaytaring.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          targetAge: { type: Type.STRING },
          summary: { type: Type.STRING },
          themeColor: { type: Type.STRING },
          curriculum: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                activity: { type: Type.STRING }
              },
              required: ["title", "duration", "keyPoints", "activity"]
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer"]
            }
          },
          studentAppCode: { type: Type.STRING }
        },
        required: ["subject", "targetAge", "summary", "themeColor", "curriculum", "quiz", "studentAppCode"]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text) as EducationalProject;
};

// --- Asosiy Komponent ---
const App = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<EducationalProject | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'quiz' | 'app'>('plan');

  const handleCreate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await generateContent(input);
      setProject(data);
      setActiveTab('plan');
    } catch (error) {
      console.error("Generatsiya xatosi:", error);
      alert("Kechirasiz, ma'lumotlarni yaratishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigatsiya */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setProject(null)}>
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200 transform group-hover:rotate-12 transition-transform">
              <i className="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">EduStudio AI</h1>
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest mt-1 block">Ta'lim Texnologiyasi</span>
            </div>
          </div>
          
          {project && (
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {(['plan', 'quiz', 'app'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide ${
                    activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'plan' ? 'Reja' : tab === 'quiz' ? 'Testlar' : 'Portal'}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {!project ? (
          <div className="max-w-3xl mx-auto py-24 text-center animate-in">
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-[1.1]">
              Darsingizni <span className="text-indigo-600 italic">zamonaviy</span> ko'rinishga keltiring.
            </h2>
            <p className="text-slate-500 text-lg lg:text-xl mb-12 max-w-2xl mx-auto font-medium">
              Mavzuni yozing, biz bir necha soniyada dars rejasi, quizlar va talabalar portalini yaratamiz.
            </p>
            
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative custom-shadow">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <i className="fa-solid fa-wand-magic-sparkles text-9xl text-indigo-600"></i>
              </div>
              <div className="relative z-10">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="Masalan: Inson genomining sirlari..."
                  className="w-full p-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-xl mb-8 shadow-inner"
                />
                <button
                  onClick={handleCreate}
                  disabled={loading || !input.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black py-6 rounded-3xl shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-4 text-xl"
                >
                  {loading ? (
                    <><i className="fa-solid fa-dna fa-spin"></i><span>Metodika tuzilmoqda...</span></>
                  ) : (
                    <><i className="fa-solid fa-bolt-lightning"></i><span>Loyihani Generatsiya Qilish</span></>
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
              <div className="flex flex-col items-center"><i className="fa-solid fa-list-check text-2xl mb-2"></i><span className="text-[10px] font-black uppercase">Struktura</span></div>
              <div className="flex flex-col items-center"><i className="fa-solid fa-puzzle-piece text-2xl mb-2"></i><span className="text-[10px] font-black uppercase">Interaktiv</span></div>
              <div className="flex flex-col items-center"><i className="fa-solid fa-code text-2xl mb-2"></i><span className="text-[10px] font-black uppercase">Dasturlash</span></div>
              <div className="flex flex-col items-center"><i className="fa-solid fa-chart-line text-2xl mb-2"></i><span className="text-[10px] font-black uppercase">Natija</span></div>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in">
            {/* Sarlavha Paneli */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center space-x-8">
                 <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-white text-4xl shadow-2xl transform -rotate-3" style={{ backgroundColor: project.themeColor }}>
                    <i className="fa-solid fa-lightbulb"></i>
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">{project.subject}</h3>
                    <div className="flex items-center space-x-4">
                      <span className="bg-indigo-50 text-indigo-600 font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">
                        Auditoriya: {project.targetAge}
                      </span>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => setProject(null)}
                className="bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 px-8 py-4 rounded-2xl font-black text-sm transition-all border border-slate-100"
              >
                <i className="fa-solid fa-rotate-left mr-2"></i> Yangi Dars
              </button>
            </div>

            {/* Content Tabs */}
            {activeTab === 'plan' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {project.curriculum.map((module, i) => (
                  <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        0{i + 1}-Darslik
                      </span>
                      <span className="text-indigo-600 text-xs font-black bg-indigo-50 px-3 py-1 rounded-lg">
                        <i className="fa-regular fa-clock mr-2"></i>{module.duration}
                      </span>
                    </div>
                    <h4 className="text-2xl font-black mb-6 group-hover:text-indigo-600 transition-colors leading-tight">{module.title}</h4>
                    <ul className="space-y-4 mb-8">
                      {module.keyPoints.map((point, pi) => (
                        <li key={pi} className="text-sm text-slate-600 flex items-start leading-relaxed font-medium">
                          <i className="fa-solid fa-circle-check text-indigo-500 mt-1 mr-4 text-[12px]"></i>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-8 border-t border-slate-50">
                      <p className="text-[10px] font-black text-slate-300 uppercase mb-3 tracking-[0.2em]">Metodik Tavsiya</p>
                      <p className="text-sm text-slate-500 italic leading-relaxed bg-slate-50 p-4 rounded-2xl">{module.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="bg-white rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-indigo-600 p-10 lg:p-14 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h4 className="font-black text-3xl mb-2 italic">Bilimlarni Mustahkamlash</h4>
                    <p className="text-indigo-100 text-sm font-bold uppercase tracking-[0.2em] opacity-70">O'quvchilar uchun interaktiv test</p>
                  </div>
                  <div className="bg-white/20 px-8 py-3 rounded-2xl text-lg font-black uppercase backdrop-blur-md">
                    {project.quiz.length} Savol
                  </div>
                </div>
                <div className="p-10 lg:p-20 space-y-16">
                  {project.quiz.map((q, i) => (
                    <div key={i} className="pb-16 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="flex items-start space-x-6 mb-10">
                         <span className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center font-black flex-shrink-0 text-xl shadow-inner">{i + 1}</span>
                         <p className="font-black text-slate-800 text-2xl lg:text-3xl leading-snug">{q.question}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-16">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`group p-6 rounded-[2rem] border-2 transition-all flex justify-between items-center cursor-default ${opt === q.correctAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-100'}`}>
                            <span className="text-base font-semibold">{opt}</span>
                            {opt === q.correctAnswer && (
                              <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                <i className="fa-solid fa-check"></i>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'app' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-7 bg-slate-900 rounded-[3rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                      <i className="fa-brands fa-react text-[15rem] text-white"></i>
                   </div>
                   <div className="flex justify-between items-center mb-10 relative z-10">
                     <div>
                        <h3 className="text-white font-black text-2xl mb-1">Student Portal Code</h3>
                        <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-[0.3em]">Frontend Source (React)</p>
                     </div>
                     <button 
                        onClick={() => {
                          navigator.clipboard.writeText(project.studentAppCode);
                          alert("Kod clipboardga nusxalandi!");
                        }}
                        className="bg-white/10 hover:bg-white text-white hover:text-slate-900 text-xs font-black px-6 py-3 rounded-2xl transition-all border border-white/5 shadow-xl"
                     >
                        <i className="fa-regular fa-copy mr-2"></i> NUSXA OLISH
                     </button>
                   </div>
                   <div className="bg-black/40 rounded-[2rem] p-8 border border-white/5 relative z-10">
                     <pre className="text-indigo-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px] no-scrollbar">
                       <code>{project.studentAppCode}</code>
                     </pre>
                   </div>
                </div>
                
                <div className="lg:col-span-5 space-y-8">
                   <div className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                     <div className="bg-indigo-50 w-20 h-20 rounded-[2rem] flex items-center justify-center text-indigo-600 text-3xl mb-8 shadow-inner transform rotate-6">
                        <i className="fa-solid fa-mobile-button"></i>
                     </div>
                     <h3 className="text-3xl font-black mb-6">Portal Dizayni</h3>
                     <p className="text-slate-500 text-base leading-relaxed mb-10 font-medium">
                       Ushbu portal o'quvchilar uchun mavzu bo'yicha konspektlar va testlarni o'z ichiga oladi. 
                       Dizayn akademik standartlar asosida generatsiya qilingan.
                     </p>
                     
                     <div className="relative mx-auto w-full max-w-[300px] aspect-[9/19] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl p-3 ring-8 ring-slate-100">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-800 rounded-b-2xl z-20"></div>
                        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
                           <div className="h-14 border-b flex items-center px-6 justify-between bg-white/50 backdrop-blur-sm">
                              <span className="text-[10px] font-black text-slate-800">9:41</span>
                              <div className="flex space-x-1.5">
                                 <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                                 <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                              </div>
                           </div>
                           <div className="flex-1 p-6 space-y-4">
                              <div className="h-6 w-3/4 rounded-xl bg-slate-100"></div>
                              <div className="h-40 w-full rounded-[2rem] shadow-inner" style={{ backgroundColor: project.themeColor + '15', border: `2px dashed ${project.themeColor}33` }}></div>
                              <div className="space-y-3">
                                 <div className="h-3 w-full rounded-full bg-slate-50"></div>
                                 <div className="h-3 w-full rounded-full bg-slate-50"></div>
                                 <div className="h-3 w-2/3 rounded-full bg-slate-50"></div>
                              </div>
                              <div className="h-12 w-full rounded-2xl mt-4 flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: project.themeColor }}>
                                 Darsni boshlash
                              </div>
                           </div>
                           <div className="h-16 border-t flex justify-around items-center opacity-40">
                              <i className="fa-solid fa-house-user text-sm"></i>
                              <i className="fa-solid fa-book-open-reader text-sm"></i>
                              <i className="fa-solid fa-circle-user text-sm"></i>
                           </div>
                        </div>
                     </div>
                     
                     <div className="mt-12 flex justify-center">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] bg-slate-50 px-6 py-3 rounded-full border border-slate-100">Preview Simulator 1.0</span>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-slate-100 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-slate-200 w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400">
            <i className="fa-solid fa-code text-lg"></i>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">EduStudio AI &copy; 2024 — Powered by Gemini 3</p>
        </div>
      </footer>
    </div>
  );
};

// --- Renderlash ---
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
