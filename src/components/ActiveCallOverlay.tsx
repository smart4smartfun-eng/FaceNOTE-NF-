import React, { useEffect, useRef, useState } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, ShieldCheck, Heart } from 'lucide-react';
import { CallSession } from '../types';

interface ActiveCallOverlayProps {
  session: CallSession;
  onHangUp: () => void;
  onUpdateSession: (updater: (prev: CallSession) => CallSession) => void;
}

export default function ActiveCallOverlay({ session, onHangUp, onUpdateSession }: ActiveCallOverlayProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [seconds, setSeconds] = useState(0);

  // High quality timer ticks
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (session.status === 'connected') {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [session.status]);

  // Request/Toggle video camera streams
  useEffect(() => {
    async function startLocalFeed() {
      if (session.status === 'connected' && session.mode === 'video' && session.localStreamActive && !localStream) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 160, height: 210, facingMode: 'user' },
            audio: false
          });
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.play().catch(e => console.log('Camera call play failure:', e));
          }
        } catch (err) {
          console.warn('Call video local feedback block or inaccessible.', err);
        }
      }
    }

    startLocalFeed();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    };
  }, [session.status, session.mode, session.localStreamActive]);

  const handleToggleMute = () => {
    onUpdateSession(prev => ({ ...prev, audioMuted: !prev.audioMuted }));
  };

  const handleToggleCamera = () => {
    onUpdateSession(prev => {
      const activeState = !prev.localStreamActive;
      if (!activeState && localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      return { ...prev, localStreamActive: activeState };
    });
  };

  // Turn duration seconds to MM:SS format
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (session.status === 'none' || session.status === 'ended') return null;

  return (
    <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-6 overflow-hidden animate-fade-in text-white font-sans">
      
      {/* Upper Encryption security ticker */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          FaceNOTE P2P SECURED
        </span>
        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
          {session.mode === 'video' ? 'UDP VIDEO' : 'PCM VOIP'}
        </span>
      </div>

      {session.status === 'dialing' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-pulse">
          <img
            src={session.peer.avatar}
            alt={session.peer.name}
            className="w-24 h-24 rounded-full border-4 border-blue-500/20 shadow-2xl relative z-10"
            referrerPolicy="no-referrer"
          />
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white">{session.peer.name}</h3>
            <p className="text-xs text-blue-400 animate-bounce">Ringing outgoing line...</p>
          </div>
        </div>
      )}

      {session.status === 'incoming' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-125 animate-ping" />
            <img
              src={session.peer.avatar}
              alt={session.peer.name}
              className="w-24 h-24 rounded-full border-4 border-blue-500 relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white">{session.peer.name}</h3>
            <p className="text-xs text-blue-400">Incoming FaceNOTE {session.mode === 'video' ? 'Video' : 'Voice'} Call</p>
          </div>
        </div>
      )}

      {session.status === 'connected' && (
        <div className="flex-1 flex flex-col relative w-full h-full min-h-0 justify-between py-4">
          
          {/* Main Visual Block */}
          <div className="flex-1 relative rounded-3xl border border-slate-800 overflow-hidden bg-slate-900 group">
            {session.mode === 'video' ? (
              <div className="w-full h-full relative">
                
                {/* Peer background visual loop */}
                <div className="w-full h-full flex items-center justify-center bg-slate-900/80 relative">
                  <img
                    src={session.peer.avatar}
                    alt={session.peer.name}
                    className="w-20 h-20 rounded-full border border-blue-500/40 relative z-10 blur-sm brightness-75 scale-125 select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Real simulated loop */}
                  <div className="absolute inset-0 z-0 flex items-center justify-center text-xs text-slate-500 bg-slate-950 font-mono bg-radial from-slate-900 via-slate-950">
                    <div className="text-center space-y-2 select-none pointer-events-none">
                      <Volume2 className="w-6 h-6 text-blue-400 mx-auto animate-bounce" />
                      <p className="text-[10px] text-blue-400/80 uppercase font-bold tracking-wider">[FEED LIVE HANDSHAKE]</p>
                    </div>
                  </div>
                </div>

                {/* Local user stream mirror: Float in top/bottom right */}
                {session.localStreamActive && localStream ? (
                  <div className="absolute right-3.5 bottom-3.5 w-28 h-36 bg-black rounded-xl border border-blue-400 overflow-hidden shadow-2xl z-20">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  </div>
                ) : (
                  <div className="absolute right-3.5 bottom-3.5 w-28 h-36 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-2 text-center text-[9px] text-slate-400 z-20">
                    <VideoOff className="w-4 h-4 text-rose-500 mb-1" />
                    No Mirror
                  </div>
                )}
              </div>
            ) : (
              /* Voice Mode interactive sound waves */
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-slate-950 to-slate-900 grid-pattern">
                <img
                  src={session.peer.avatar}
                  alt={session.peer.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-500/30"
                  referrerPolicy="no-referrer"
                />
                
                {/* Voice sound waves indicator animation */}
                <div className="flex gap-1 h-8 items-end justify-center">
                  {[1, 2, 3, 4, 5, 4, 3, 2, 1, 3, 5, 2].map((heightMultiplier, idx) => (
                    <div
                      key={idx}
                      className="w-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full"
                      style={{
                        height: `${heightMultiplier * 5}px`,
                        animation: `scan ${0.5 + Math.random() * 0.5}s infinite ease-in-out`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Float duration header */}
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 z-10 text-xs font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>{session.peer.name}</span>
              <span className="text-slate-400 font-mono font-medium">{formatTime(seconds)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Control Dials Toolbar Section */}
      <div className="space-y-4">
        
        {/* Call actions grid for incoming calls */}
        {session.status === 'incoming' ? (
          <div className="flex justify-around items-center">
            <button
              id="call-incoming-decline"
              onClick={onHangUp}
              className="bg-red-500 hover:bg-red-600 p-4 rounded-full text-white transition-all shadow-lg shadow-red-500/20 active:scale-90"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <button
              id="call-incoming-accept"
              onClick={() => {
                onUpdateSession(prev => ({ ...prev, status: 'connected' }));
              }}
              className="bg-emerald-500 hover:bg-emerald-600 p-4 rounded-full text-white transition-all shadow-lg shadow-emerald-500/20 animate-bounce active:scale-90"
            >
              <Video className="w-6 h-6" />
            </button>
          </div>
        ) : (
          /* Call actions when connected/dialing */
          <div className="flex justify-around items-center max-w-sm mx-auto bg-slate-900 border border-slate-800 rounded-2xl py-3.5 px-6 shadow-xl">
            {/* Audio Toggle */}
            <button
              id="call-control-audio"
              onClick={handleToggleMute}
              className={`p-3 rounded-xl transition-all ${
                session.audioMuted
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {session.audioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Main Red End Call Trigger */}
            <button
              id="call-control-hangup"
              onClick={onHangUp}
              className="bg-red-500 hover:bg-red-600 p-4 rounded-full text-white transition-all shadow-xl shadow-red-500/20 hover:scale-110 active:scale-95 duration-150"
            >
              <PhoneOff className="w-6 h-6" />
            </button>

            {/* Video Toggle */}
            {session.mode === 'video' ? (
              <button
                id="call-control-video"
                onClick={handleToggleCamera}
                className={`p-3 rounded-xl transition-all ${
                  !session.localStreamActive
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {session.localStreamActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
            ) : (
              <div className="p-3 bg-slate-950/20 border border-slate-900/60 rounded-xl text-slate-600 select-none">
                <VideoOff className="w-5 h-5" />
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <p className="text-[10px] text-slate-500">
            Ad-Network Monetizer pays out +$0.15 for every minute spent on FaceNOTE Video Rooms.
          </p>
        </div>
      </div>

    </div>
  );
}
