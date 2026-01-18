
import React from 'react';
import { Course, Lesson } from '../types';

interface Props {
  course: Course;
}

const ChannelPreview: React.FC<Props> = ({ course }) => {
  return (
    <div className="w-full max-w-[500px] flex flex-col items-center">
      <div className="w-full bg-[#e7ebf0] rounded-[2.5rem] border-[10px] border-slate-900 shadow-2xl relative overflow-hidden h-[800px] flex flex-col">
        {/* Telegram Header */}
        <div className="bg-[#517da2] text-white p-4 pt-10 flex items-center justify-between shadow-md">
          <div className="flex items-center">
            <i className="fa-solid fa-arrow-left mr-4 opacity-80"></i>
            <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center font-bold mr-3 border-2 border-white/20">
              <i className="fa-solid fa-book-open text-sm"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm truncate max-w-[180px]">{course.topic}</h4>
              <p className="text-[10px] text-blue-100 opacity-80">Channel Course</p>
            </div>
          </div>
          <div className="flex space-x-4 opacity-80 text-lg">
            <i className="fa-solid fa-magnifying-glass"></i>
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </div>
        </div>

        {/* Post Feed */}
        <div className="flex-1 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat p-4 space-y-6 no-scrollbar pb-10">
          
          {/* Welcome Post */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn">
            <div className="p-4 space-y-2">
              <h5 className="font-bold text-[#0088cc]">Welcome to {course.topic}! 👋</h5>
              <p className="text-sm text-slate-800 leading-relaxed">{course.description}</p>
              <div className="pt-2 flex items-center text-[10px] text-slate-400">
                <span>12:00 PM</span>
              </div>
            </div>
          </div>

          {/* Lessons */}
          {course.lessons.map((lesson, lIdx) => (
            <React.Fragment key={lIdx}>
              {/* Lesson Post */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn" style={{ animationDelay: `${lIdx * 0.1}s` }}>
                <div className="relative aspect-video bg-slate-100 flex items-center justify-center">
                  {lesson.imageUrl ? (
                    <img src={lesson.imageUrl} alt={lesson.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      <i className="fa-solid fa-palette text-3xl mb-2 animate-pulse"></i>
                      <span className="text-[9px] font-black uppercase tracking-widest">Rendering Header...</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <h5 className="font-black text-slate-900 text-lg">Lesson {lIdx + 1}: {lesson.title}</h5>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{lesson.content}</p>
                  <div className="pt-1 flex items-center text-[10px] text-slate-400">
                    <span>12:0{lIdx + 1} PM</span>
                  </div>
                </div>
              </div>

              {/* Quiz Post */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn" style={{ animationDelay: `${lIdx * 0.1 + 0.05}s` }}>
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-2 text-[#0088cc]">
                    <i className="fa-solid fa-square-poll-vertical"></i>
                    <span className="text-xs font-black uppercase tracking-widest">Knowledge Check</span>
                  </div>
                  <h6 className="font-bold text-slate-900 text-sm">{lesson.quiz.question}</h6>
                  <div className="space-y-2">
                    {lesson.quiz.options.map((opt, oIdx) => (
                      <button 
                        key={oIdx}
                        className="w-full text-left p-3 rounded-xl border border-slate-100 text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-between"
                      >
                        <span>{opt.text}</span>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
                      </button>
                    ))}
                  </div>
                  <div className="pt-1 flex items-center text-[10px] text-slate-400">
                    <span>Anonymous Poll • 12:0{lIdx + 2} PM</span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Channel Footer */}
        <div className="bg-white p-3 flex items-center justify-center border-t">
          <button className="text-[#0088cc] font-black text-xs uppercase tracking-widest py-1.5 px-10 bg-blue-50 rounded-full">
            Join Channel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelPreview;
