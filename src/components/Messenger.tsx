import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, Search, ShieldCheck, Plus, MessageSquare } from 'lucide-react';
import { Friend, Message } from '../types';

interface MessengerProps {
  friends: Friend[];
  onSendMessage: (friendId: string, text: string) => void;
  onInitiateCall: (friend: Friend, mode: 'voice' | 'video') => void;
  selectedFriendId: string;
  onSelectFriend: (friendId: string) => void;
  onStartChat: (authorName: string, authorAvatar?: string) => void;
}

export default function Messenger({ 
  friends, 
  onSendMessage, 
  onInitiateCall, 
  selectedFriendId, 
  onSelectFriend,
  onStartChat
}: MessengerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const selectedFriend = friends.find(f => f.id === selectedFriendId);

  useEffect(() => {
    // Scroll chat threads bottom on select or messages count update
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedFriendId, selectedFriend?.messages?.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedFriendId) return;

    onSendMessage(selectedFriendId, inputText);
    setInputText('');
  };

  const [inputText, setInputText] = useState('');

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (friend.lastMessage && friend.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatName.trim()) return;
    
    onStartChat(newChatName.trim());
    setNewChatName('');
    setShowNewChatModal(false);
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden pb-16 animate-fade-in text-white font-sans">
      
      {/* Top Search / Filter banner with interactive New Chat trigger */}
      <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-850 flex items-center justify-between gap-2.5 select-none relative">
        <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <input
            id="chat-search-input"
            type="text"
            placeholder="Search chats..."
            className="w-full bg-transparent text-xs text-white border-none outline-none placeholder:text-slate-600 font-medium"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button
          id="chat-trigger-new-modal"
          onClick={() => setShowNewChatModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-8.5 px-2.5 rounded-xl transition-all flex items-center gap-1 active:scale-95 text-[10.5px] cursor-pointer shadow-md shadow-blue-600/10"
          title="Start dynamic direct chat room"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>

        {/* Dynamic creation modal centered overlay */}
        {showNewChatModal && (
          <div className="absolute top-13 right-3 left-3 bg-slate-900 border border-slate-850 rounded-2xl p-3.5 shadow-2xl z-50 animate-fade-in space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">Start Real Chat Channel</h4>
              <button 
                id="close-new-chat-modal"
                onClick={() => setShowNewChatModal(false)}
                className="text-slate-500 hover:text-white font-extrabold text-xs"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateNewChat} className="space-y-2.5">
              <input
                id="modal-new-chat-input"
                type="text"
                required
                autoFocus
                placeholder="Enter creator, buddy, or friend name..."
                className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2 text-xs text-white outline-none focus:border-blue-500"
                value={newChatName}
                onChange={e => setNewChatName(e.target.value)}
              />
              <button
                id="modal-submit-new-chat"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10.5px] py-1.5 rounded-xl font-bold transition-all shadow-md cursor-pointer"
              >
                Create Direct Message Room ➜
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main split grid layout inside phone viewport */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden">
        
        {/* Friends left-rail sidebar strip */}
        <div className="w-1/3 border-r border-slate-900 overflow-y-auto no-scrollbar pb-4 select-none">
          <div className="p-1.5 space-y-1">
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => {
                const isSelected = friend.id === selectedFriendId;
                return (
                  <button
                    id={`chat-friend-tab-${friend.id}`}
                    key={friend.id}
                    onClick={() => onSelectFriend(friend.id)}
                    className={`w-full flex items-center gap-2 p-2 rounded-xl transition-all hover:bg-slate-900/60 text-left ${
                      isSelected ? 'bg-slate-900 border border-slate-800/80 shadow-inner' : 'border border-transparent'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-slate-950 rounded-full ${
                        friend.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                      }`} />
                    </div>
                    
                    {/* Text meta values on large frame only */}
                    <div className="hidden sm:block text-left truncate flex-1 min-w-0">
                      <h5 className="text-[10.5px] font-bold text-slate-100 truncate leading-tight">
                        {friend.name.split(' ')[0]}
                      </h5>
                      <p className="text-[8.5px] text-slate-500 truncate mt-0.5">{friend.lastMessage}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center">
                <p className="text-[9px] text-slate-600 font-medium">No chats found.</p>
                <button
                  id="chat-sidebar-add-btn"
                  onClick={() => setShowNewChatModal(true)}
                  className="mt-2 text-[9px] text-blue-500 underline font-semibold"
                >
                  Create one
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messaging window workspace panels */}
        {selectedFriend ? (
          <div className="flex-1 flex flex-col justify-between bg-slate-950 min-h-0">
            
            {/* Upper active thread title bar with voice/video call buttons */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative select-none pointer-events-none">
                  <img
                    src={selectedFriend.avatar}
                    alt={selectedFriend.name}
                    className="w-7.5 h-7.5 rounded-full object-cover border border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border border-slate-950 rounded-full ${
                    selectedFriend.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                  }`} />
                </div>
                <div>
                  <h4 className="text-[11.5px] font-bold text-white flex items-center gap-0.5 leading-tight select-none pointer-events-none">
                    {selectedFriend.name}
                  </h4>
                  <p className="text-[8.5px] text-slate-500 leading-none select-none pointer-events-none">
                    {selectedFriend.isOnline ? 'Active now' : 'Standby'}
                  </p>
                </div>
              </div>

              {/* Call dialing shortcuts */}
              <div className="flex gap-1.5">
                <button
                  id="chat-btn-voice-call"
                  onClick={() => onInitiateCall(selectedFriend, 'voice')}
                  className="bg-slate-950 hover:bg-slate-800 p-2 rounded-xl text-blue-400 hover:text-white border border-slate-850 cursor-pointer"
                  title="Voice Call Over FaceNOTE Network"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  id="chat-btn-video-call"
                  onClick={() => onInitiateCall(selectedFriend, 'video')}
                  className="bg-blue-600/10 hover:bg-blue-600 hover:text-white p-2 rounded-xl text-blue-400 border border-blue-500/15 cursor-pointer"
                  title="Secure HD Video Call Room"
                >
                  <Video className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chat conversation thread scrolls */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 no-scrollbar min-h-0 bg-slate-950/60">
              <div className="text-center py-2 border-b border-slate-900 select-none pointer-events-none">
                <span className="text-[8.5px] font-mono text-slate-600 flex items-center justify-center gap-1.5 uppercase tracking-widest leading-none">
                  🔒 P2P SSL Authenticated Cipher Block
                </span>
              </div>

              {selectedFriend.messages.map(msg => {
                const isMe = msg.senderId === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} text-xs`}>
                    <div className="max-w-[80%] flex flex-col gap-0.5">
                      <div className={`px-3.5 py-2.5 rounded-2xl ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-900 text-slate-250 rounded-tl-none border border-slate-850'
                      }`}>
                        <p className="text-[11.5px] leading-relaxed break-words font-sans selection:bg-indigo-300">
                          {msg.text}
                        </p>
                      </div>
                      <span className={`text-[8px] font-semibold text-slate-500 font-mono ${isMe ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Keyboard post messages bar form */}
            <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-850 flex gap-2">
              <input
                id="chat-input-message"
                type="text"
                placeholder={`Encrypt message for ${selectedFriend.name.split(' ')[0]}...`}
                className="flex-1 bg-slate-950 text-xs text-white outline-none rounded-xl px-3.5 py-2 placeholder:text-slate-600 focus:border-blue-500 border border-slate-850"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button
                id="chat-submit-btn"
                type="submit"
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-35 text-white p-2 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-6 text-slate-500">
            <p className="text-xs">No secure conversation selected.</p>
          </div>
        )}

      </div>

    </div>
  );
}
