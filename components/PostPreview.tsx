
import React from 'react';
import { GeneratedPost } from '../types';

interface Props {
  post: GeneratedPost | null;
  loading: boolean;
}

const PostPreview: React.FC<Props> = ({ post, loading }) => {
  return (
    <div className="w-full max-w-[450px] space-y-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">Live Channel Preview</h3>
      
      <div className="bg-[#f0f2f5] rounded-[2.5rem] border-[8px] border-gray-900 shadow-2xl relative overflow-hidden h-[700px] flex flex-col">
        {/* Header */}
        <div className="bg-[#517da2] text-white p-4 pt-10 flex items-center justify-between shadow-md">
          <div className="flex items-center">
            <i className="fa-solid fa-arrow-left mr-4"></i>
            <div className="w-10 h-10 rounded-full bg-[#24a1de] flex items-center justify-center font-bold mr-3 border-2 border-white/20">
              <i className="fa-solid fa-users text-sm"></i>
            </div>
            <div>
              <h4 className="font-bold text-sm">My Awesome Channel</h4>
              <p className="text-[10px] text-blue-100 opacity-80">1,234 subscribers</p>
            </div>
          </div>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>

        {/* Post Area */}
        <div className="flex-1 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat p-3 space-y-4">
          {loading && !post && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl flex flex-col items-center">
                <i className="fa-solid fa-wand-sparkles text-3xl text-[#24a1de] mb-4 animate-pulse"></i>
                <p className="text-gray-600 font-medium text-sm">AI is writing your post...</p>
              </div>
            </div>
          )}

          {!post && !loading && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400/60 font-medium text-sm italic">Nothing generated yet</p>
            </div>
          )}

          {post && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn max-w-[95%] mx-auto">
              {/* Image Section */}
              <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt="AI Generated" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <i className="fa-solid fa-image text-3xl mb-2 animate-pulse"></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Generating Image...</span>
                  </div>
                )}
              </div>

              {/* Text Section */}
              <div className="p-4 space-y-3">
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {post.text}
                </p>
                
                <div className="flex flex-wrap gap-1.5">
                  {post.hashtags.map((tag, i) => (
                    <span key={i} className="text-[#24a1de] text-sm hover:underline cursor-pointer">
                      #{tag.replace('#', '')}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <i className="fa-solid fa-eye mr-1"></i> 842
                    </span>
                    <span>11:42 AM</span>
                  </div>
                  <div className="flex space-x-3">
                    <i className="fa-solid fa-share"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-3 flex items-center justify-center border-t">
          <button className="text-[#24a1de] font-bold text-sm uppercase tracking-widest py-1 px-8">
            Mute
          </button>
        </div>
      </div>
      
      {post && (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium italic truncate max-w-[200px]">Prompt: {post.imagePrompt}</span>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(post.text + '\n\n' + post.hashtags.map(h => '#' + h).join(' '));
              alert('Copied to clipboard!');
            }}
            className="text-[#24a1de] text-xs font-bold hover:underline ml-4 whitespace-nowrap"
          >
            COPY TEXT
          </button>
        </div>
      )}
    </div>
  );
};

export default PostPreview;
