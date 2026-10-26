/**
 * Unified Chat - Instagram Direct Messages (DM) Style Interface
 * Features a 2-column conversation list and active chat window with rich messaging.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StoriesBar } from '../common/StoriesBar';

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: 'ai' | 'group' | 'direct';
}

export const UnifiedChat: React.FC = () => {
  const { chatMessages, addChatMessage, currentUser } = useAuth();
  
  const conversations: Conversation[] = [
    {
      id: 'edumentor_ai',
      name: 'EduMentor AI',
      role: 'Sovereign RAG Advisor',
      avatar: 'fa-robot',
      lastMessage: 'Your APAAR credits and 6th sem syllabus are verified.',
      time: 'Active now',
      unread: 0,
      online: true,
      type: 'ai'
    },
    {
      id: 'campus_global',
      name: 'Campus Global Agora',
      role: 'Institution-Wide Channel',
      avatar: 'fa-globe',
      lastMessage: 'Notice: Capstone project submission deadline updated.',
      time: '10m ago',
      unread: 3,
      online: true,
      type: 'group'
    },
    {
      id: 'faculty_priya',
      name: 'Dr. Priya Sen',
      role: 'Department Head & Mentor',
      avatar: 'fa-user-tie',
      lastMessage: 'Please review your zero-knowledge cryptography lab report.',
      time: '1h ago',
      unread: 1,
      online: true,
      type: 'direct'
    },
    {
      id: 'director_glbitm',
      name: 'Director GLBITM',
      role: 'Institute Governance',
      avatar: 'fa-building-columns',
      lastMessage: 'Accreditation SIF compliance walkthrough scheduled for Friday.',
      time: 'Yesterday',
      unread: 0,
      online: false,
      type: 'direct'
    }
  ];

  const [activeChatId, setActiveChatId] = useState<string>('edumentor_ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [callActive, setCallActive] = useState<string | null>(null);

  const activeConversation = conversations.find(c => c.id === activeChatId) || conversations[0];

  const filteredMessages = chatMessages.filter(m => {
    if (activeChatId === 'edumentor_ai') return m.isAi || m.recipient === 'edumentor_ai';
    if (activeChatId === 'campus_global') return m.channel === 'campus_global';
    return m.recipient === activeChatId || m.senderName.includes(activeConversation.name);
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addChatMessage({
      sender: 'user',
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: inputText,
      channel: activeChatId === 'campus_global' ? 'campus_global' : undefined,
      recipient: activeChatId,
      isAi: activeChatId === 'edumentor_ai'
    });

    setInputText('');
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Instagram DM Layout Header / Top Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-rose-400 font-bold">
              <i className="fa-brands fa-instagram text-lg"></i>
            </div>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>{currentUser.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Direct Messages</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">Sovereign Encrypted Campus Direct & Group Chat</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCallActive('audio')}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition shadow"
            title="Start Audio Call"
          >
            <i className="fa-solid fa-phone"></i>
          </button>
          <button
            onClick={() => setCallActive('video')}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow shadow-blue-600/30"
            title="Start Video Call"
          >
            <i className="fa-solid fa-video"></i>
          </button>
        </div>
      </div>

      {/* Main 2-Column Instagram DM Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Conversations List */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-slate-500 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {conversations
              .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setActiveChatId(conv.id)}
                  className={`p-4 flex items-center space-x-3 cursor-pointer transition ${
                    activeChatId === conv.id ? 'bg-slate-800/80 border-l-4 border-blue-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold border border-slate-700">
                      <i className={`fa-solid ${conv.avatar} text-lg`}></i>
                    </div>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{conv.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{conv.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>

                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow">
                      {conv.unread}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Right Active Chat Window */}
        <div className="flex-1 flex flex-col bg-slate-950">
          {/* Active Chat Header */}
          <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold border border-slate-700">
                <i className={`fa-solid ${activeConversation.avatar}`}></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{activeConversation.name}</span>
                  <i className="fa-solid fa-circle-check text-blue-400 text-xs" title="Verified Sovereign Node"></i>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">{activeConversation.role} · {activeConversation.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-slate-400">
              <button className="w-8 h-8 rounded-lg hover:bg-slate-800 hover:text-white flex items-center justify-center transition">
                <i className="fa-solid fa-phone-volume text-xs"></i>
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-800 hover:text-white flex items-center justify-center transition">
                <i className="fa-solid fa-video text-xs"></i>
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-800 hover:text-white flex items-center justify-center transition">
                <i className="fa-solid fa-circle-info text-xs"></i>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl text-slate-400">
                  <i className={`fa-solid ${activeConversation.avatar}`}></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-300">Say hello to {activeConversation.name}!</h4>
                  <p className="text-xs font-mono mt-1">End-to-end encrypted academic messaging channel.</p>
                </div>
              </div>
            ) : (
              filteredMessages.map(msg => {
                const isMe = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono mb-1">
                      <span>{msg.senderName}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                        isMe
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                          : msg.isAi
                          ? 'bg-purple-950/60 border border-purple-500/30 text-purple-100 rounded-tl-none shadow-purple-900/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <div>{msg.text}</div>

                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 border-t border-purple-500/20 text-[10px] font-mono text-purple-300 space-y-0.5 mt-2">
                          <span className="font-bold uppercase tracking-wider block text-purple-400">Verified Citations:</span>
                          {msg.citations.map((c, i) => (
                            <div key={i}>✓ {c}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Instagram DM Input Bar */}
          <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3 shrink-0">
            <button type="button" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition">
              <i className="fa-solid fa-plus text-xs"></i>
            </button>
            <button type="button" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition">
              <i className="fa-regular fa-image text-xs"></i>
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message ${activeConversation.name}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />

            {inputText.trim() ? (
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition"
              >
                Send
              </button>
            ) : (
              <button type="button" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition">
                <i className="fa-solid fa-microphone text-xs"></i>
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Simulated Call Modal */}
      {callActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 mx-auto flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl animate-pulse">
              <i className={`fa-solid ${activeConversation.avatar}`}></i>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">{activeConversation.name}</h3>
              <p className="text-xs text-emerald-400 font-mono mt-1">Connecting secure {callActive} call...</p>
            </div>
            <div className="flex justify-center space-x-4 pt-4">
              <button
                onClick={() => setCallActive(null)}
                className="px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center space-x-2"
              >
                <i className="fa-solid fa-phone-slash"></i>
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
