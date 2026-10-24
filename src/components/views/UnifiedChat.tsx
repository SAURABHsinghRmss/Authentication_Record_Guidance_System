import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const UnifiedChat: React.FC = () => {
  const { chatMessages, addChatMessage, currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'GLOBAL' | 'PERSONAL' | 'EDUMENTOR'>('EDUMENTOR');
  const [inputText, setInputText] = useState('');

  const filteredMessages = chatMessages.filter(m => {
    if (activeCategory === 'EDUMENTOR') return m.isAi || m.recipient === 'edumentor_ai';
    if (activeCategory === 'GLOBAL') return m.channel === 'campus_global';
    return !m.isAi && m.channel !== 'campus_global';
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addChatMessage({
      sender: 'user',
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: inputText,
      channel: activeCategory === 'GLOBAL' ? 'campus_global' : undefined,
      recipient: activeCategory === 'EDUMENTOR' ? 'edumentor_ai' : 'faculty',
      isAi: false
    });

    setInputText('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 text-xl font-bold">
            <i className="fa-solid fa-comments"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">Unified Agora & Chat</h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Sarvam AI Meta Core
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              3-Category Communication Matrix: Sovereign Campus Agora, Direct Mentorship, & AI Guidance
            </p>
          </div>
        </div>

        {/* 3-Category Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          {[
            { id: 'EDUMENTOR', label: 'EduMentor AI', icon: 'fa-robot', color: 'text-purple-400' },
            { id: 'GLOBAL', label: 'Campus Agora', icon: 'fa-globe', color: 'text-blue-400' },
            { id: 'PERSONAL', label: 'Direct Messages', icon: 'fa-user-group', color: 'text-emerald-400' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-2 ${
                activeCategory === cat.id ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${cat.icon} ${cat.color} text-xs`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl overflow-y-auto space-y-4">
        {filteredMessages.map(msg => {
          const isMe = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono mb-1">
                <span className="font-bold text-slate-200">{msg.senderName}</span>
                {msg.senderRole && <span>({msg.senderRole})</span>}
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : msg.isAi
                    ? 'bg-purple-950/40 border border-purple-500/30 text-purple-100 rounded-tl-none shadow-lg'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div>{msg.text}</div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-purple-500/20 text-[10px] font-mono text-purple-300 space-y-0.5">
                    <span className="font-bold uppercase tracking-wider block text-purple-400">Verified Citations:</span>
                    {msg.citations.map((c, i) => (
                      <div key={i}>✓ {c}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-3 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={
            activeCategory === 'EDUMENTOR'
              ? 'Ask EduMentor AI about APAAR credits, exam regulations, or syllabus policies...'
              : activeCategory === 'GLOBAL'
              ? 'Post message to campus-wide agora...'
              : 'Message direct contact / faculty mentor...'
          }
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center space-x-2"
        >
          <i className="fa-solid fa-paper-plane"></i>
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
