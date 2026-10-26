/**
 * Instagram Stories Bar & Viewer Modal
 * Renders a horizontal stories tray with gradient rings and an interactive story popup viewer.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Story {
  id: string;
  name: string;
  avatar: string;
  role: string;
  title: string;
  time: string;
  content: string;
}

export const StoriesBar: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const stories: Story[] = [
    {
      id: 's-1',
      name: 'Dr. Priya Sen',
      avatar: 'fa-user-tie',
      role: 'Faculty Mentor',
      title: 'Zero-Knowledge Cryptography Lab Today at 2 PM',
      time: '2h ago',
      content: 'All 6th semester CSE students are required to attend the advanced cryptographic passkey seminar in Hall 4.'
    },
    {
      id: 's-2',
      name: 'Amit Sharma',
      avatar: 'fa-graduation-cap',
      role: 'Student Creator',
      title: 'Smart India Hackathon Prototype Live!',
      time: '4h ago',
      content: 'Our sovereign identity credential verification prototype is successfully integrated with the 7-database SIS backend.'
    },
    {
      id: 's-3',
      name: 'Director GLBITM',
      avatar: 'fa-building-columns',
      role: 'Institute Governance',
      title: 'Accreditation SIF Walkthrough Notice',
      time: '6h ago',
      content: 'NAAC and AICTE peer review committee visit scheduled for next Monday. All department heads prepare compliance reports.'
    },
    {
      id: 's-4',
      name: 'Placement Cell',
      avatar: 'fa-briefcase',
      role: 'Career Services',
      title: 'Tier-1 Tech Drive Registration Open',
      time: '12h ago',
      content: 'Top product companies visiting campus next week. Register through your Career Pathways portal.'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl mb-6">
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-none">
        {/* Current User Story Add Button */}
        <div className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer group">
          <div className="relative w-16 h-16 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center text-blue-400 group-hover:border-blue-500 transition">
            <i className="fa-solid fa-plus text-lg"></i>
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border border-slate-900">+</span>
          </div>
          <span className="text-[11px] font-bold text-slate-300 truncate max-w-[70px]">Your Story</span>
        </div>

        {/* Stories List */}
        {stories.map(story => (
          <div
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center space-y-1.5 shrink-0 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-slate-200 border-2 border-slate-900">
                <i className={`fa-solid ${story.avatar} text-lg`}></i>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-300 truncate max-w-[70px]">{story.name}</span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-purple-400 font-bold border border-slate-700">
                  <i className={`fa-solid ${activeStory.avatar}`}></i>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">{activeStory.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{activeStory.role} · {activeStory.time}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
              <h3 className="text-sm font-extrabold text-purple-300">{activeStory.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{activeStory.content}</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Reply to ${activeStory.name}...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => {
                  alert(`Reply sent to ${activeStory.name}!`);
                  setActiveStory(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
