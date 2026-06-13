import React, { useState, useRef } from 'react';
import { Send, Image, Video as VideoIcon, Heart, MessageSquare, Flame, Sparkles, Share2, Eye, ShieldCheck, X } from 'lucide-react';
import { Post, Story, User, Comment, WalletState } from '../types';

interface FeedProps {
  user: User;
  posts: Post[];
  stories: Story[];
  wallet: WalletState;
  onAddPost: (newPost: Post) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onTriggerFloatingDollar: (label?: string) => void;
  onUpdateWallet: (updater: (prev: WalletState) => WalletState) => void;
  onUpdatePosts: (updater: (prev: Post[]) => Post[]) => void;
}

export default function Feed({
  user,
  posts,
  stories,
  wallet,
  onAddPost,
  onLikePost,
  onAddComment,
  onTriggerFloatingDollar,
  onUpdateWallet,
  onUpdatePosts
}: FeedProps) {
  const [inputText, setInputText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  
  // Comments input mapped by post id
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  // Stories modal viewer state
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  // Gated premium posting states
  const [isGatingEnabled, setIsGatingEnabled] = useState(false);
  const [gatingPriceInput, setGatingPriceInput] = useState('0.99');

  // File Upload refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const isVideo = file.type.startsWith('video/');
      setMediaType(isVideo ? 'video' : 'image');
      setMediaPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearSelectedMedia = () => {
    setMediaFile(null);
    setMediaType(null);
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl);
      setMediaPreviewUrl(null);
    }
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !mediaPreviewUrl) return;

    const price = parseFloat(gatingPriceInput) || 0.99;
    const newPost: Post = {
      id: 'p_user_' + Math.floor(1000 + Math.random() * 9000),
      authorName: user.name,
      authorAvatar: user.avatar,
      content: inputText,
      type: mediaType || 'text',
      mediaUrl: mediaPreviewUrl || undefined,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      impressions: 1,
      isGated: isGatingEnabled,
      gatePrice: isGatingEnabled ? price : undefined,
      unlockedByMe: isGatingEnabled ? true : undefined
    };

    onAddPost(newPost);
    setInputText('');
    setIsGatingEnabled(false);
    setGatingPriceInput('0.99');
    clearSelectedMedia();
    
    // Add ad profit to user
    onTriggerFloatingDollar('+$0.25 POST CREATED Bonus');
  };

  const handlePostLikeLocal = (postId: string) => {
    onLikePost(postId);
    onTriggerFloatingDollar();
  };

  const handlePublishComment = (postId: string) => {
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    onAddComment(postId, commentText);
    
    // Reset comment field for post
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    // Trigger floating dollar dividend
    onTriggerFloatingDollar();
  };

  const handleUnlockPost = (postId: string, method: 'coins' | 'card') => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    if (method === 'coins') {
      if (wallet.fnCoins < 10) {
        alert("Insufficient FaceNote Coins! Visit the Coin Hub wallet and purchase a Coins Chest Bundle, or active auto-mining to gather coins.");
        return;
      }
      onUpdateWallet(prev => ({
        ...prev,
        fnCoins: prev.fnCoins - 10
      }));
    } else {
      // Simulate Stripe instant element auth
      alert("Payment authorized via Stripe Secure Gateway! $ " + (targetPost.gatePrice || 0.99).toFixed(2) + " USD has been successfully transferred to " + targetPost.authorName);
    }

    // Update posts
    onUpdatePosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, unlockedByMe: true };
        }
        return p;
      })
    );

    // Add revenue earnings directly to content creator / balance
    onUpdateWallet(prev => ({
      ...prev,
      balanceUSD: prev.balanceUSD + (targetPost.gatePrice || 0.9)
    }));

    onTriggerFloatingDollar(`+$${(targetPost.gatePrice || 0.99).toFixed(2)} CONTENT GAIN`);
  };

  return (
    <div className="w-full h-full bg-slate-950 overflow-y-auto no-scrollbar pb-20 animate-fade-in relative">
      
      {/* Slogan Banner Block */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 px-4 py-3 border-b border-blue-900/50 flex flex-col items-center justify-center text-center">
        <span className="text-white text-xs font-bold leading-normal tracking-wide">
          reconnect with your old friend on FaceNOTE
        </span>
      </div>

      {/* Stories Carousel Section */}
      <div className="py-4 border-b border-slate-900 bg-slate-950 px-4">
        <h3 className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2.5 flex items-center justify-between">
          <span>Active Moments</span>
          <span className="text-blue-500 flex items-center gap-1 leading-none text-[9.5px]">
            <Flame className="w-3 h-3 text-amber-500 animate-pulse" /> 100% Genuine
          </span>
        </h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {/* Stories list rendering */}
          {stories.map(story => (
            <button
              id={`story-btn-${story.id}`}
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex-shrink-0 w-16 flex flex-col items-center gap-1.5 focus:outline-none focus:scale-105 duration-100"
            >
              <div className="relative w-14 h-14 bg-gradient-to-tr from-blue-500 via-indigo-500 to-emerald-500 rounded-full p-0.5 shadow-md">
                <div className="w-full h-full rounded-full border-2 border-slate-950 overflow-hidden bg-slate-900">
                  <img
                    src={story.userAvatar}
                    alt={story.userName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {story.isVideo && (
                  <span className="absolute -bottom-1 -right-1 bg-blue-600 border border-slate-950 p-1 rounded-full text-[8px]">
                    ▶
                  </span>
                )}
              </div>
              <span className="text-[9.5px] font-medium text-slate-300 truncate max-w-[64px] text-center leading-tight">
                {story.userName.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Write a Post Section */}
      <form onSubmit={handlePublishPost} className="m-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="flex gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-800 shrink-0"
            referrerPolicy="no-referrer"
          />
          <textarea
            id="feed-post-text"
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none resize-none placeholder:text-slate-500"
            placeholder={`What's on your mind today, ${user.name.split(' ')[0]}?`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
        </div>

        {/* Selected Media Preview Drawer */}
        {mediaPreviewUrl && (
          <div className="relative rounded-xl border border-slate-800 overflow-hidden max-h-[180px] bg-slate-950">
            {mediaType === 'video' ? (
              <video src={mediaPreviewUrl} className="w-full h-full object-cover" autoPlay muted loop />
            ) : (
              <img src={mediaPreviewUrl} className="w-full h-full object-cover" alt="Upload Preview" referrerPolicy="no-referrer" />
            )}
            <button
              id="feed-media-clear"
              type="button"
              onClick={clearSelectedMedia}
              className="absolute top-2 right-2 bg-slate-950/80 p-1.5 rounded-full hover:bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Premium Gating Toggles */}
        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between gap-3 text-[10.5px]">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold select-none">
            <input
              id="feed-toggle-gating"
              type="checkbox"
              checked={isGatingEnabled}
              onChange={e => setIsGatingEnabled(e.target.checked)}
              className="rounded accent-blue-500 scale-105"
            />
            ⭐ Set Unlock Price to View Post
          </label>
          {isGatingEnabled && (
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-mono font-bold">$</span>
              <input
                id="feed-gating-price"
                type="number"
                step="0.01"
                className="w-16 bg-slate-900 border border-slate-850 rounded text-center text-white py-1 font-mono text-[10.5px] outline-none focus:border-blue-500"
                value={gatingPriceInput}
                onChange={e => setGatingPriceInput(e.target.value)}
              />
              <span className="text-slate-500 font-medium">USD</span>
            </div>
          )}
        </div>

        {/* Actions bar for file trigger triggers */}
        <div className="flex items-center justify-between border-t border-slate-950 pt-3">
          <div className="flex gap-2">
            <button
              id="feed-upload-image"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg border border-slate-850 text-[10.5px] transition-all font-semibold"
            >
              <Image className="w-3.5 h-3.5 text-emerald-400" />
              Photo
            </button>
            <button
              id="feed-upload-video"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg border border-slate-850 text-[10.5px] transition-all font-semibold"
            >
              <VideoIcon className="w-3.5 h-3.5 text-blue-400" />
              Video Clip
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            id="feed-post-submit"
            type="submit"
            disabled={!inputText.trim() && !mediaPreviewUrl}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            Publish
          </button>
        </div>
      </form>

      {/* Main Feed Posts List */}
      <div className="space-y-4 px-4 pb-4">
        {posts.map(post => (
          <div key={post.id} className={`bg-slate-900 border ${post.isSponsored ? 'border-amber-500/30 ring-1 ring-amber-500/15' : 'border-slate-800'} rounded-2xl p-4 space-y-3.5 shadow-md relative`}>
            
            {/* Sponsored Badge Indicator inside Ad space container */}
            {post.isSponsored && (
              <span className="absolute top-4 right-4 bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[8px] font-bold font-mono px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AD UNIT CPM +$0.10
              </span>
            )}

            {/* Profile Header */}
            <div className="flex gap-2.5 items-center">
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-9 h-9 rounded-full object-cover border border-slate-800"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  {post.authorName}
                  {!post.isSponsored && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 cursor-pointer" />}
                </h4>
                <p className="text-[9.5px] text-slate-500">{post.timestamp}</p>
              </div>
            </div>

            {post.isGated && !post.unlockedByMe ? (
              <div className="bg-slate-950/80 border border-amber-500/25 rounded-2xl p-4.5 text-center space-y-4 relative overflow-hidden my-1 shadow-inner">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="text-xl animate-bounce">🔒</div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">Premium Content Gated</h4>
                  <p className="text-[10px] text-zinc-300 leading-relaxed max-w-[90%] mx-auto font-medium">
                    This selection is gated by the creator. Pay <span className="text-emerald-400 font-bold font-mono">${(post.gatePrice || 0.99).toFixed(2)} USD</span> to instantly unlock media, details, comments & likes.
                  </p>
                </div>
                
                <div className="flex gap-2 justify-center max-w-[90%] mx-auto">
                  <button
                    id={`unlock-coins-${post.id}`}
                    onClick={() => handleUnlockPost(post.id, 'coins')}
                    className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-amber-400 font-bold py-2 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-md"
                  >
                    🪙 10 Coins
                  </button>
                  <button
                    id={`unlock-stripe-${post.id}`}
                    onClick={() => handleUnlockPost(post.id, 'card')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-505 text-white font-extrabold py-2 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-lg shadow-indigo-600/15"
                  >
                    💳 Card • ${(post.gatePrice || 0.99).toFixed(2)}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Post Content */}
                <p className="text-xs text-slate-300 leading-normal font-sans">
                  {post.content}
                </p>

                {/* Post Media Rendering */}
                {post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-800/60 bg-slate-950">
                    {post.type === 'video' ? (
                      <video
                        src={post.mediaUrl}
                        controls
                        loop
                        playsInline
                        className="w-full max-h-[280px] object-cover"
                      />
                    ) : (
                      <img
                        src={post.mediaUrl}
                        alt="Timeline Attachment"
                        className="w-full max-h-[280px] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                )}
              </>
            )}

            {/* Interaction Stats and Ads Trigger buttons */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium border-y border-slate-950 py-2.5 px-1">
              <button
                id={`post-like-btn-${post.id}`}
                onClick={() => handlePostLikeLocal(post.id)}
                className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors ${post.isLikedByMe ? 'text-rose-500 font-bold' : ''}`}
              >
                <Heart className={`w-4 h-4 ${post.isLikedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{post.likes} Likes</span>
              </button>

              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>{post.comments.length} Comments</span>
              </span>

              <span className="flex items-center gap-1 font-mono text-[9px] text-slate-500">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.impressions} Views</span>
              </span>
            </div>

            {/* Inline Comments Thread Display */}
            {post.comments.length > 0 && (
              <div className="bg-slate-950/65 rounded-xl p-3 border border-slate-950 space-y-2.5">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex gap-2 items-start text-xs">
                    <img
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      className="w-6 h-6 rounded-full shrink-0 border border-slate-900"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 bg-slate-900/90 rounded-xl px-3 py-2 border border-slate-900">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-white text-[10.5px]">{comment.authorName}</span>
                        <span className="text-[8px] text-slate-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Write Comment text-field inside Card thread */}
            <div className="flex gap-2.5 items-center">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={user.name}
                className="w-6.5 h-6.5 rounded-full object-cover border border-slate-950 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 flex gap-1.5 bg-slate-950 border border-slate-850 rounded-xl px-3 py-1 text-xs">
                <input
                  id={`comment-input-${post.id}`}
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full bg-transparent text-white border-none outline-none text-xs h-7 placeholder:text-slate-600"
                  value={commentInputs[post.id] || ''}
                  onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') handlePublishComment(post.id); }}
                />
                <button
                  id={`comment-submit-${post.id}`}
                  onClick={() => handlePublishComment(post.id)}
                  disabled={!(commentInputs[post.id] || '').trim()}
                  className="text-blue-500 hover:text-white disabled:opacity-20 text-[10px] font-black uppercase tracking-wider pl-1 cursor-pointer"
                >
                  Post
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* STORY EXPANSION POPUP MODAL */}
      {activeStory && (
        <div className="absolute inset-0 bg-slate-950/98 z-50 flex flex-col justify-between p-4 animate-fade-in text-white">
          <div className="flex justify-between items-center z-25 mt-2">
            <div className="flex gap-2.5 items-center">
              <img
                src={activeStory.userAvatar}
                alt={activeStory.userName}
                className="w-8 h-8 rounded-full border border-blue-500"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-bold">{activeStory.userName}</span>
            </div>
            <button
              id="story-modal-close"
              onClick={() => setActiveStory(null)}
              className="bg-slate-900 border border-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Core Media */}
          <div className="flex-1 flex items-center justify-center my-6 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
            {activeStory.isVideo ? (
              <video
                src={activeStory.mediaUrl}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <img
                src={activeStory.mediaUrl}
                alt="Story Graphic Close-up"
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          <div className="text-center text-[10px] text-slate-500 py-1.5 border-t border-slate-900 uppercase tracking-widest">
            Moment from {activeStory.userName.split(' ')[0]} • Tap anywhere to pause
          </div>
        </div>
      )}

    </div>
  );
}
