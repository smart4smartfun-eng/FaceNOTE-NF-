import React, { useState, useEffect } from 'react';
import { INITIAL_POSTS, INITIAL_STORIES, INITIAL_FRIENDS } from './mockData';
import { User, Post, Story, Friend, WalletState, CallSession } from './types';
import DeviceSimulator from './components/DeviceSimulator';
import RegistrationFlow from './components/RegistrationFlow';
import Feed from './components/Feed';
import Messenger from './components/Messenger';
import ProfileView from './components/ProfileView';
import ActiveCallOverlay from './components/ActiveCallOverlay';
import PaymentMentor from './components/PaymentMentor';

// Lucide Icons
import { Heart, MessageCircle, Landmark, UserCheck, Sparkles, BellRing } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('facenote_active_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [selectedFriendId, setSelectedFriendId] = useState<string>(INITIAL_FRIENDS[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'feed' | 'messenger' | 'profile' | 'withdrawal'>('feed');

  // Helper to load or initialize wallet based on current logged in user
  const getInitialWallet = (userEmail?: string): WalletState => {
    const key = userEmail ? `facenote_wallet_${userEmail.trim().toLowerCase()}` : 'facenote_wallet_guest';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      balanceUSD: 15.45, // Decent starting earnings to facilitate immediate testing!
      totalWithdrawn: 0,
      fnCoins: 85,
      adDensityMultiplier: 1.0,
      trafficMiningActive: false,
      miningRatePerSecond: 0,
      withdrawals: [],
      founderBalanceUSD: 145.50 // Pre-filled seed for demonstration
    };
  };

  // Monetization state
  const [wallet, setWallet] = useState<WalletState>(() => {
    const savedUser = localStorage.getItem('facenote_active_session');
    let email = undefined;
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        email = u.email;
      } catch (e) {}
    }
    return getInitialWallet(email);
  });

  // Automatically compute and route 3% of any positive money generated to founder wallet
  const handleUpdateWallet = (updater: WalletState | ((prev: WalletState) => WalletState)) => {
    setWallet(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      
      // Calculate how much the user's balance increased
      const diff = next.balanceUSD - prev.balanceUSD;
      
      // Get previous or existing founder balance (default to 145.50 if not specified yet)
      const prevFounderBalance = prev.founderBalanceUSD !== undefined ? prev.founderBalanceUSD : 145.50;
      
      // If the updater explicitly edited founderBalanceUSD (e.g. founder withdraw transaction),
      // we use that target amount. otherwise, we carry it over.
      let targetFounderBalance = next.founderBalanceUSD !== undefined ? next.founderBalanceUSD : prevFounderBalance;
      
      if (diff > 0) {
        // Generate extra 3% of newly generated user earnings for the founder wallet!
        const fee = diff * 0.03;
        targetFounderBalance = +(targetFounderBalance + fee);
      }
      
      return {
        ...next,
        founderBalanceUSD: +(targetFounderBalance).toFixed(4)
      };
    });
  };

  // Automatically persist user session state and update wallet when active user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('facenote_active_session', JSON.stringify(user));
      setWallet(getInitialWallet(user.email));

      // Also persist profile tweaks to the registered users roster
      const usersData = localStorage.getItem('facenote_registered_users');
      if (usersData) {
        try {
          const usersList = JSON.parse(usersData);
          const updatedList = usersList.map((u: any) => {
            if (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()) {
              return {
                ...u,
                name: user.name,
                phone: user.phoneNumber,
                avatar: user.avatar,
                bio: user.bio,
                workplace: user.workplace,
                education: user.education,
                currentCity: user.currentCity,
                hometown: user.hometown,
                relationshipStatus: user.relationshipStatus,
                website: user.website,
                hobbies: user.hobbies
              };
            }
            return u;
          });
          localStorage.setItem('facenote_registered_users', JSON.stringify(updatedList));
        } catch (e) {
          console.error("Failed to sync updated profile to registered database:", e);
        }
      }
    } else {
      localStorage.removeItem('facenote_active_session');
      setWallet(getInitialWallet(undefined));
    }
  }, [user]);

  // Automatically persist any wallet changes
  useEffect(() => {
    const key = user?.email ? `facenote_wallet_${user.email.trim().toLowerCase()}` : 'facenote_wallet_guest';
    localStorage.setItem(key, JSON.stringify(wallet));
  }, [wallet, user?.email]);

  // Call overlay configurations
  const [callSession, setCallSession] = useState<CallSession>({
    status: 'none',
    mode: 'voice',
    peer: INITIAL_FRIENDS[0],
    durationSeconds: 0,
    localStreamActive: true,
    audioMuted: false
  });
  
  // Custom social alert push notification state for campaigns
  const [activeAdNotification, setActiveAdNotification] = useState<string | null>(null);

  // Trigger generic high-fidelity social alert notifications
  const triggerFloatingDollar = (customLabel = '') => {
    // Generate notification for native social engagement
    const campaigns = ['Nike Running Hub', 'Xbox Game Pass', 'Disney+ Premium', 'Apple Music', 'Google Developer Group'];
    const selectedCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    setActiveAdNotification(`New Campaign Action: Verified by ${selectedCampaign}!`);
    setTimeout(() => setActiveAdNotification(null), 3500);
  };

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

        {/* Profile indicator links to profile */}
        <div 
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-755 border border-slate-700/60 rounded-xl cursor-pointer duration-200 active:scale-95 shadow-sm"
          onClick={() => {
            if (user) setActiveTab('profile');
          }}
        >
          <img 
            src={user ? user.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="" 
            className="w-5.5 h-5.5 rounded-full object-cover border border-slate-600"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] text-slate-300 font-bold max-w-[80px] truncate select-none">
            {user ? user.name.split(' ')[0] : 'Log In'}
          </span>
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
                onUpdateWallet={handleUpdateWallet}
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

            {activeTab === 'profile' && user && (
              <ProfileView
                user={user}
                onUpdateUser={setUser}
                posts={posts}
                wallet={wallet}
                onLogOut={() => {
                  localStorage.removeItem('facenote_active_session');
                  setUser(null);
                  setActiveTab('feed');
                }}
              />
            )}

            {activeTab === 'withdrawal' && (
              <PaymentMentor
                user={user}
                wallet={wallet}
                onUpdateWallet={handleUpdateWallet}
                onTriggerFloatingDollar={triggerFloatingDollar}
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
                id="footer-tab-profile"
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  activeTab === 'profile' ? 'text-blue-500 scale-105' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg">👤</span>
                <span className="text-[8.5px] font-bold tracking-wider uppercase">Profile</span>
              </button>

              <button
                id="footer-tab-withdrawal"
                onClick={() => setActiveTab('withdrawal')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  activeTab === 'withdrawal' ? 'text-blue-500 scale-105' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-lg">🏛️</span>
                <span className="text-[8.5px] font-bold tracking-wider uppercase text-center truncate w-full">Payouts</span>
              </button>

            </footer>

          </div>
        )}

      </div>
      
    </DeviceSimulator>
  );
}
