import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, Search, ShieldCheck } from 'lucide-react';
import { Friend, Message } from '../types';

interface MessengerProps {
  friends: Friend[];
  onSendMessage: (friendId: string, text: string) => void;
  onInitiateCall: (friend: Friend, mode: 'voice' | 'video') => void;
}

export default function Messenger({ friends, onSendMessage, onInitiateCall }: MessengerProps) {
  const [selectedFriendId, setSelectedFriendId] = useState<string>(friends[0]?.id || '');
  const [inputText, setInputText] = useState('');
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

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden pb-16 animate-fade-in text-white font-sans">
      
      {/* Top Search / Filter banner */}
      <div className="px-4 py-3 bg-slate-905 border-b border-slate-900 flex items-center justify-between gap-3 select-none">
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            id="chat-search-input"
            type="text"
            placeholder="Search FaceNOTE friends..."
            className="w-full bg-transparent text-xs text-white border-none outline-none placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Main split grid layout inside phone viewport */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden">
        
        {/* Friends left-rail sidebar strip */}
        <div className="w-1/3 border-r border-slate-900 overflow-y-auto no-scrollbar pb-4 select-none">
          <div className="p-2 space-y-1">
            {friends.map(friend => {
              const isSelected = friend.id === selectedFriendId;
              return (
                <button
                  id={`chat-friend-tab-${friend.id}`}
                  key={friend.id}
                  onClick={() => setSelectedFriendId(friend.id)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all hover:bg-slate-900/60 text-left ${
                    isSelected ? 'bg-slate-900 border border-slate-800/80' : 'border border-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-950 rounded-full ${
                      friend.isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                    }`} />
                  </div>
                  
                  {/* Text meta values on large frame only */}
                  <div className="hidden sm:block md:block lg:block xl:block text-left truncate">
                    <h5 className="text-[11px] font-bold text-slate-100 truncate flex items-center gap-0.5 leading-tight">
                      {friend.name.split(' ')[0]}
                    </h5>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">{friend.lastMessage}</p>
                  </div>
                </button>
              );
            })}
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
