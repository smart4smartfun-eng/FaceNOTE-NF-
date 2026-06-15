import React from 'react';
import { User2, Calendar, ShieldCheck, Mail, Phone, LogOut, CheckCircle, RefreshCw, Layers } from 'lucide-react';
import { User, Post, WalletState } from '../types';

interface ProfileViewProps {
  user: User;
  posts: Post[];
  wallet?: WalletState;
  onLogOut: () => void;
}

export default function ProfileView({ user, posts, wallet, onLogOut }: ProfileViewProps) {
  // Filter timeline items authored specifically by logged-in user
  const myPosts = posts.filter(p => p.authorName === user.name);

  return (
    <div className="w-full h-full bg-slate-950 text-white overflow-y-auto no-scrollbar pb-20 animate-fade-in font-sans">
      
      {/* Banner styling placeholder */}
      <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-650 to-indigo-800 relative">
        {/* Floating Verified Badge */}
        <div className="absolute -bottom-10 left-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-slate-950 object-cover bg-slate-900"
              referrerPolicy="no-referrer"
            />
            {user.isFaceVerified && (
              <span className="absolute bottom-0.5 right-0.5 bg-blue-500 border-2 border-slate-950 rounded-full p-0.5 text-white animate-scale-up" title="Verified Account">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Margin shift for avatar layout alignment */}
      <div className="pt-12 px-6 pb-4 space-y-4">
        
        {/* Username */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-lg font-bold tracking-tight text-white">{user.name}</h3>
            {user.isFaceVerified && (
              <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[8.5px] font-semibold uppercase px-2 py-0.5 rounded-full font-mono">
                Verified Profile
              </span>
            )}
          </div>
          <p className="text-[10px] text-zinc-500">Member ID: FN_UID_29381A</p>
        </div>

        {/* Biometric Credentials Certificate Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
          <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            Account Details
          </h4>
          
          <div className="space-y-2.5 font-mono text-[10.5px]">
            <div className="flex items-center justify-between border-b border-slate-950 pb-2">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email address
              </span>
              <span className="text-slate-300 font-medium truncate max-w-[180px]">{user.email || 'N/A'}</span>
            </div>

            {user.phoneNumber && (
              <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Mobile number
                </span>
                <span className="text-slate-300 font-medium">{user.phoneNumber}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Server Pass
              </span>
              <span className="text-blue-400 font-bold">FN_CREDENTIALS_SECURE</span>
            </div>
          </div>
        </div>

        {/* Self Timeline Feed list */}
        <div className="space-y-3.5">
          <h4 className="text-[10.5px] text-slate-500 uppercase tracking-wider font-bold">
            My Timeline Posts ({myPosts.length})
          </h4>

          {myPosts.length === 0 ? (
            <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-900 text-center">
              <p className="text-[10px] text-slate-500">You haven't posted any status updates yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPosts.map(post => (
                <div key={post.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>{post.timestamp}</span>
                    <span className="bg-blue-600/15 border border-blue-600/25 text-blue-400 px-1.5 rounded text-[8px] font-mono">
                      {post.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{post.content}</p>
                  
                  {post.mediaUrl && (
                    <div className="rounded-lg overflow-hidden border border-slate-950 max-h-[140px] bg-slate-950">
                      <img src={post.mediaUrl} className="w-full h-full object-cover" alt="Attachment" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear/Log Out options */}
        <button
          id="profile-logout-btn"
          onClick={onLogOut}
          className="w-full bg-rose-950/40 hover:bg-rose-900/30 border border-rose-900/40 text-rose-400 hover:text-rose-300 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out of FaceNOTE
        </button>

      </div>
    </div>
  );
}
