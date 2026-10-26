/**
 * Video / Reels Studio - Instagram Reels & Video Feed Style Interface
 * Features immersive video cards, like/comment/share overlay actions, and reel upload capabilities.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StoriesBar } from '../common/StoriesBar';

interface ReelItem {
  id: string;
  title: string;
  duration: string;
  resolution: string;
  size: string;
  thumbnail: string;
  category: 'education' | 'employment' | 'experience';
  visibleRoles: ('student' | 'faculty' | 'parent' | 'institute' | 'admin')[];
  uploader: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  audioTrack: string;
}

export const VideoEditStudio: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [reels, setReels] = useState<ReelItem[]>([
    {
      id: 'r-1',
      title: 'Lecture 14: Advanced Zero-Knowledge Cryptography & FIDO2 Passkeys',
      duration: '45:20',
      resolution: '4K 60FPS',
      size: '1.4 GB',
      thumbnail: 'fa-shield-halved',
      category: 'education',
      visibleRoles: ['student', 'faculty', 'parent', 'institute', 'admin'],
      uploader: 'Dr. Priya Sen',
      timestamp: '2026-10-24',
      likes: 342,
      commentsCount: 28,
      audioTrack: 'Original Audio - Dr. Priya Sen'
    },
    {
      id: 'r-2',
      title: 'Campus Placement & Tier-1 Tech Recruitment Orientation 2026',
      duration: '32:10',
      resolution: '4K 30FPS',
      size: '1.1 GB',
      thumbnail: 'fa-briefcase',
      category: 'employment',
      visibleRoles: ['student', 'faculty', 'parent', 'admin'],
      uploader: 'Placement Cell GLBITM',
      timestamp: '2026-10-22',
      likes: 890,
      commentsCount: 64,
      audioTrack: 'Trending Lo-Fi - EduIdentity Beats'
    },
    {
      id: 'r-3',
      title: 'Industrial R&D Internship Showcase & Autonomous Drone Defense',
      duration: '28:15',
      resolution: '1080P 60FPS',
      size: '850 MB',
      thumbnail: 'fa-graduation-cap',
      category: 'experience',
      visibleRoles: ['student', 'faculty', 'institute', 'admin'],
      uploader: 'Amit Sharma (CS-2022-04)',
      timestamp: '2026-10-20',
      likes: 512,
      commentsCount: 41,
      audioTrack: 'Tech Innovation Theme'
    },
    {
      id: 'r-4',
      title: 'AICTE SIF Governance & Institutional Compliance Walkthrough',
      duration: '18:40',
      resolution: '1080P 30FPS',
      size: '520 MB',
      thumbnail: 'fa-building-columns',
      category: 'education',
      visibleRoles: ['institute', 'admin', 'faculty'],
      uploader: 'Director GLBITM',
      timestamp: '2026-10-18',
      likes: 215,
      commentsCount: 12,
      audioTrack: 'Institutional Bulletin Audio'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'education' | 'employment' | 'experience'>('all');
  const [activeReel, setActiveReel] = useState<ReelItem>(reels[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Record<string, string[]>>({
    'r-1': ['Brilliant explanation of zero-knowledge proofs!', 'Will this be tested in mid-sems?'],
    'r-2': ['Very helpful guidance for placement prep.', 'Thanks for sharing!']
  });

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'education' | 'employment' | 'experience'>('education');

  const currentRole = currentUser.role || 'student';

  const filteredReels = reels.filter(r => {
    if (activeTab !== 'all' && r.category !== activeTab) return false;
    if (currentRole !== 'admin' && !r.visibleRoles.includes(currentRole as any)) return false;
    return true;
  });

  const handleLike = (id: string) => {
    setLikedReels(prev => ({ ...prev, [id]: !prev[id] }));
    setReels(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + (likedReels[id] ? -1 : 1) } : r));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments(prev => ({
      ...prev,
      [activeReel.id]: [...(prev[activeReel.id] || []), commentText]
    }));
    setCommentText('');
    setReels(prev => prev.map(r => r.id === activeReel.id ? { ...r, commentsCount: r.commentsCount + 1 } : r));
  };

  const handleUploadReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReel: ReelItem = {
      id: `r-${Date.now()}`,
      title: newTitle,
      duration: '15:00',
      resolution: '4K 60FPS',
      size: '640 MB',
      thumbnail: newCategory === 'employment' ? 'fa-briefcase' : newCategory === 'experience' ? 'fa-award' : 'fa-graduation-cap',
      category: newCategory,
      visibleRoles: ['student', 'faculty', 'parent', 'institute', 'admin'],
      uploader: currentUser.name || 'Sovereign Creator',
      timestamp: new Date().toISOString().split('T')[0],
      likes: 1,
      commentsCount: 0,
      audioTrack: 'Original Audio - ' + (currentUser.name || 'Creator')
    };

    setReels(prev => [newReel, ...prev]);
    setActiveReel(newReel);
    setShowUploadModal(false);
    setNewTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Instagram Reels Style Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-rose-400 text-xl font-bold">
              <i className="fa-brands fa-instagram"></i>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>Instagram Reels & Video Feed</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">Live Feed</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Sovereign Academic Lectures, Placement Reels & R&D Showcases</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            {(['all', 'education', 'employment', 'experience'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-xl font-bold capitalize transition ${
                  activeTab === tab ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center space-x-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Upload Reel</span>
          </button>
        </div>
      </div>

      {/* Main Instagram Reels Grid / Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReels.map(reel => {
          const isLiked = likedReels[reel.id];
          return (
            <div
              key={reel.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col group hover:border-slate-700 transition"
            >
              {/* Video Thumbnail / Player Mock */}
              <div className="relative aspect-[9/16] bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>
                
                {/* Background glow & Icon */}
                <div className="absolute inset-0 bg-radial from-purple-600/20 via-transparent to-transparent opacity-50"></div>
                <div className="w-20 h-20 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-3xl text-rose-400 shadow-2xl relative z-20 group-hover:scale-110 transition duration-300">
                  <i className={`fa-solid ${reel.thumbnail}`}></i>
                </div>

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {reel.resolution}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-rose-600/80 backdrop-blur-md text-white">
                    {reel.duration}
                  </span>
                </div>

                {/* Right Side Instagram Action Buttons Overlay */}
                <div className="absolute right-4 bottom-20 z-20 flex flex-col items-center space-y-4">
                  <button
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center space-y-1 text-white group/btn"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition ${isLiked ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50' : 'bg-black/50 text-white hover:bg-black/70'}`}>
                      <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart text-lg`}></i>
                    </div>
                    <span className="text-[11px] font-mono font-bold">{reel.likes}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveReel(reel);
                      setShowCommentModal(true);
                    }}
                    className="flex flex-col items-center space-y-1 text-white"
                  >
                    <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition">
                      <i className="fa-regular fa-comment text-lg"></i>
                    </div>
                    <span className="text-[11px] font-mono font-bold">{reel.commentsCount}</span>
                  </button>

                  <button
                    onClick={() => alert(`Copied share link for: ${reel.title}`)}
                    className="flex flex-col items-center space-y-1 text-white"
                  >
                    <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition">
                      <i className="fa-solid fa-share text-lg"></i>
                    </div>
                    <span className="text-[11px] font-mono font-bold">Share</span>
                  </button>
                </div>

                {/* Bottom Reel Metadata */}
                <div className="absolute bottom-4 left-4 right-16 z-20 text-left space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                      {reel.uploader.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-white">{reel.uploader}</span>
                    <i className="fa-solid fa-circle-check text-blue-400 text-[10px]"></i>
                  </div>
                  <h3 className="text-xs font-extrabold text-white line-clamp-2">{reel.title}</h3>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-300 font-mono pt-1">
                    <i className="fa-solid fa-music text-rose-400 animate-pulse"></i>
                    <span className="truncate">{reel.audioTrack}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Reel Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold border border-rose-500/30">
                  <i className="fa-brands fa-instagram"></i>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Upload Instagram Reel / Video</h3>
                  <p className="text-xs text-slate-400 font-mono">Publish academic or placement video to campus feed</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleUploadReel} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 mb-1 block">Reel / Video Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Advanced AI System Architecture Presentation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 mb-1 block">Category:</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="education">Education & Lectures</option>
                  <option value="employment">Employment & Placements</option>
                  <option value="experience">Experience & R&D Projects</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
                >
                  Publish Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showCommentModal && activeReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white">Comments</h3>
                <p className="text-xs text-slate-400 font-mono truncate max-w-sm">{activeReel.title}</p>
              </div>
              <button
                onClick={() => setShowCommentModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {(comments[activeReel.id] || []).length === 0 ? (
                <p className="text-xs text-slate-500 font-mono text-center py-6">No comments yet. Be the first to comment!</p>
              ) : (
                (comments[activeReel.id] || []).map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <div className="font-bold text-slate-200 mb-0.5">Verified Peer</div>
                    <div>{c}</div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment as verified user..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
