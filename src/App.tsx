import React, { useState, useEffect } from 'react';
import { INITIAL_POSTS, INITIAL_STORIES, INITIAL_FRIENDS } from './mockData';
import { User, Post, Story, Friend, WalletState, CallSession } from './types';
import DeviceSimulator from './components/DeviceSimulator';
import RegistrationFlow from './components/RegistrationFlow';
import Feed from './components/Feed';
import Messenger from './components/Messenger';
import WalletDashboard from './components/WalletDashboard';
import ProfileView from './components/ProfileView';
import ActiveCallOverlay from './components/ActiveCallOverlay';

// Lucide Icons
import { Heart, MessageCircle, Landmark, UserCheck, Sparkles, BellRing } from 'lucide-react';

interface FloatingCoin {
  id: string;
  x: number;
  y: number;
  label: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [selectedFriendId, setSelectedFriendId] = useState<string>(INITIAL_FRIENDS[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'feed' | 'messenger' | 'wallet' | 'profile'>('feed');

  // Monetization and Earnings State
  const [wallet, setWallet] = useState<WalletState>({
    balanceUSD: 142.8251, // Starts with seed earnings for high conversion satisfaction
    totalWithdrawn: 1480.00,
    fnCoins: 85,
    adDensityMultiplier: 2.5,
    trafficMiningActive: true,
    miningRatePerSecond: 0.025, // Pays $0.025 per second when active
    withdrawals: [
      { id: 'w_p1', amount: 500, method: 'PayPal', status: 'Processed', timestamp: '2 days ago' },
      { id: 'w_p2', amount: 980, method: 'Crypto (Solana/USDT)', status: 'Processed', timestamp: '5 days ago' }
    ]
  });

  // Call overlay configurations
  const [callSession, setCallSession] = useState<CallSession>({
    status: 'none',
    mode: 'voice',
    peer: INITIAL_FRIENDS[0],
    durationSeconds: 0,
    localStreamActive: true,
    audioMuted: false
  });

  // Floating money effect particles for gamification
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  
  // Custom social alert push notification state
  const [activeAdNotification, setActiveAdNotification] = useState<string | null>(null);

  // Trigger floating dollar reward indicator
  const triggerFloatingDollar = (customLabel = '+$0.15 AD VALUE') => {
    const id = 'coin_' + Date.now() + Math.random().toString(36).substr(2, 5);
    const newCoin: FloatingCoin = {
      id,
      x: 30 + Math.random() * 40, // percentage from left
      y: 70 - Math.random() * 20, // percentage from top
      label: customLabel
    };
    
    setFloatingCoins(prev => [...prev, newCoin]);

    // Also increase balance directly as user acts!
    setWallet(prev => ({
      ...prev,
      balanceUSD: prev.balanceUSD + 0.15,
      fnCoins: prev.fnCoins + 1
    }));

    // Generate random notification for high active vibe
    const sponsors = ['NordVPN', 'Shopify Plus', 'Coursera Premium', 'Solana Pay', 'Stripe Developer Bundle'];
    const selectedSponsorByChance = sponsors[Math.floor(Math.random() * sponsors.length)];
    setActiveAdNotification(`Sponsored Action verified by ${selectedSponsorByChance}!`);
    setTimeout(() => setActiveAdNotification(null), 3500);

    setTimeout(() => {
      setFloatingCoins(prev => prev.filter(c => c.id !== id));
    }, 2000);
  };

  // Central global Traffic Mining monetization ticker - persists across all tabs and views!
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (user && wallet.trafficMiningActive) {
      interval = setInterval(() => {
        setWallet(prev => ({
          ...prev,
          balanceUSD: prev.balanceUSD + prev.miningRatePerSecond
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, wallet.trafficMiningActive, wallet.miningRatePerSecond]);

  // Feed Operations
  const handleAddPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const liked = !p.isLikedByMe;
          return {
            ...p,
            isLikedByMe: liked,
            likes: liked ? p.likes + 1 : p.likes - 1,
            impressions: p.impressions + 2
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: 'c_u_' + Math.floor(1000 + Date.now() % 9000),
                authorName: user?.name || 'Taylor Peterson',
                authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                text,
                timestamp: 'Just now'
              }
            ],
            impressions: p.impressions + 1
          };
        }
        return p;
      })
    );
  };

  // Messenger Operations
  const handleSendMessage = (friendId: string, text: string) => {
    setFriends(prev =>
      prev.map(f => {
        if (f.id === friendId) {
          const newMsg = {
            id: 'm_chat_' + Math.floor(1000 + Math.random() * 9000),
            senderId: 'me' as const,
            text,
            timestamp: 'Just now'
          };
          return {
            ...f,
            messages: [...f.messages, newMsg],
            lastMessage: text
          };
        }
        return f;
      })
    );

    // Simulate reactive friend output answers in 1.4 seconds for high-converting feel!
    setTimeout(() => {
      setFriends(prev =>
        prev.map(f => {
          if (f.id === friendId) {
            const replies = [
              'Wow, that sounds fantastic! Chatting on FaceNOTE is so rewarding.',
              'Absolutely count me in! Did you check your wallet earnings ticker today?',
              'That is incredible. Reconnecting with my old buddy on here has made my day!',
              'Face NOTE feels so fast and sleek compared to other networks. Let’s dial up a video call!'
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const replyMsg = {
              id: 'm_chat_' + Math.floor(1000 + Math.random() * 9000),
              senderId: 'them' as const,
              text: randomReply,
              timestamp: 'Just now'
            };
            return {
              ...f,
              messages: [...f.messages, replyMsg],
              lastMessage: randomReply
            };
          }
          return f;
        })
      );
    }, 1400);
  };

  // Dial call triggered
  const handleInitiateCall = (peer: Friend, mode: 'voice' | 'video') => {
    setCallSession({
      status: 'dialing',
      mode,
      peer,
      durationSeconds: 0,
      localStreamActive: true,
      audioMuted: false
    });

    // Simulate peer answering call in 3 seconds
    setTimeout(() => {
      setCallSession(prev => {
        if (prev.status === 'dialing') {
          return { ...prev, status: 'connected' };
        }
        return prev;
      });
    }, 3000);
  };

  const handleHangUp = () => {
    setCallSession(prev => ({ ...prev, status: 'none' }));
    triggerFloatingDollar('+$0.50 CALL BONUS');
  };

  const handleStartChat = (authorName: string, authorAvatar?: string) => {
    let existingFriend = friends.find(f => f.name.toLowerCase() === authorName.toLowerCase());
    
    if (!existingFriend) {
      const newFriendId = 'f_dyn_' + Date.now();
      const newFriend = {
        id: newFriendId,
        name: authorName,
        avatar: authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        isOnline: true,
        lastActive: 'Active now',
        messages: [
          { 
            id: 'm_init_' + Math.random(), 
            senderId: 'them' as const, 
            text: `Hey! Thanks for messaging me about my FaceNOTE content. Let's chat!`, 
            timestamp: 'Just now' 
          }
        ],
        lastMessage: "Hey! Thanks for messaging me about my FaceNOTE content. Let's chat!"
      };
      setFriends(prev => [newFriend, ...prev]);
      setSelectedFriendId(newFriendId);
    } else {
      setSelectedFriendId(existingFriend.id);
    }
    
    setActiveTab('messenger');
  };

  return (
    <DeviceSimulator>
      
      {/* Upper Global social layout header */}
      <header className="h-14 shrink-0 bg-slate-900 border-b border-slate-850 px-4 flex items-center justify-between select-none z-30">
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('feed')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-blue-500/20">
            fN
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none text-white">FaceNOTE</h1>
            <p className="text-[8.5px] text-slate-500 tracking-wider">RECONNECT NETWORK</p>
          </div>
        </div>

        {/* REQUIRED LOGO AT THE RIGHT HAND: "FN" */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/20 rounded-xl font-bold cursor-pointer hover:indigo-505 duration-200 active:scale-95 shadow-md shadow-blue-600/10"
          onClick={() => {
            if (user) setActiveTab('wallet');
          }}
        >
          <span className="text-[10px] text-blue-200 uppercase tracking-widest font-extrabold select-none">Coin Hub</span>
          <div className="w-5.5 h-5.5 bg-white text-indigo-700 rounded-full flex items-center justify-center text-[10.5px] font-black shadow-lg">
            FN
          </div>
        </div>
      </header>

      {/* Main viewport workspaces */}
      <div className="flex-1 min-h-0 relative w-full overflow-hidden flex flex-col bg-slate-950">
        
        {/* If user hasn't registered, force the registration options */}
        {!user ? (
          <RegistrationFlow onComplete={(registeredUser) => setUser(registeredUser)} />
        ) : (
          /* Render designated viewport content tabs */
          <div className="flex-1 min-h-0 relative w-full flex flex-col">
            
            {activeTab === 'feed' && (
              <Feed
                user={user}
                posts={posts}
                stories={stories}
                wallet={wallet}
                onAddPost={handleAddPost}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                onTriggerFloatingDollar={triggerFloatingDollar}
                onUpdateWallet={setWallet}
                onUpdatePosts={setPosts}
                onStartChat={handleStartChat}
              />
            )}

            {activeTab === 'messenger' && (
              <Messenger
                friends={friends}
                onSendMessage={handleSendMessage}
                onInitiateCall={handleInitiateCall}
                selectedFriendId={selectedFriendId}
                onSelectFriend={setSelectedFriendId}
                onStartChat={handleStartChat}
              />
            )}

            {activeTab === 'wallet' && (
              <WalletDashboard
                wallet={wallet}
                onUpdateWallet={setWallet}
                onTriggerFloatingDollar={triggerFloatingDollar}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                posts={posts}
                wallet={wallet}
                onLogOut={() => {
                  setUser(null);
                  setActiveTab('feed');
                }}
              />
            )}

            {/* In-App Floating ad metrics alert push banner */}
            {activeAdNotification && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur border border-amber-500/30 rounded-xl px-4 py-2 shadow-2xl z-40 flex items-center gap-2 max-w-[90%] text-center select-none animate-bounce">
                <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-[10px] text-amber-200 font-medium truncate">
                  {activeAdNotification}
                </p>
              </div>
            )}

            {/* Float rewards coin particle effect when user conducts transactions */}
            {floatingCoins.map(coin => (
              <div
                key={coin.id}
                className="absolute text-emerald-400 font-mono text-[10.5px] font-extrabold z-45 bg-slate-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30 select-none pointer-events-none shadow-xl flex items-center gap-1.5"
                style={{
                  left: `${coin.x}%`,
                  bottom: `${coin.y}%`,
                  animation: 'scan 1.8s infinite ease-out',
                  transition: 'all 1.5s ease-out'
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                {coin.label}
              </div>
            ))}

            {/* Active video / audio communication dial overlays */}
            <ActiveCallOverlay
              session={callSession}
              onHangUp={handleHangUp}
              onUpdateSession={setCallSession}
            />

            {/* Bottom Floating Navigation deck tab-row */}
            <footer className="absolute bottom-0 inset-x-0 h-[60px] bg-slate-900 border-t border-slate-850 flex justify-around items-center z-30 px-3 select-none">
              
              <button
                id="footer-tab-feed"
                onClick={() => setActiveTab('feed')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  activeTab === 'feed' ? 'text-blue-500 scale-105' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg">🏠</span>
                <span className="text-[8.5px] font-bold tracking-wider uppercase">Feed</span>
              </button>

              <button
                id="footer-tab-messenger"
                onClick={() => setActiveTab('messenger')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-all relative ${
                  activeTab === 'messenger' ? 'text-blue-500 scale-105' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg">💬</span>
                <span className="text-[8.5px] font-bold tracking-wider uppercase">Chats</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-slate-900" />
              </button>

              <button
                id="footer-tab-wallet"
                onClick={() => setActiveTab('wallet')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  activeTab === 'wallet' ? 'text-emerald-500 scale-105' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg">💼</span>
                <span className="text-[8.5px] font-mono font-black text-emerald-400">
                  ${wallet.balanceUSD.toFixed(2)}
                </span>
              </button>

              <button
                id="footer-tab-profile"
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  activeTab === 'profile' ? 'text-blue-500 scale-105' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg">👤</span>
                <span className="text-[8.5px] font-bold tracking-wider uppercase">Profile</span>
              </button>

            </footer>

          </div>
        )}

      </div>
      
    </DeviceSimulator>
  );
}
