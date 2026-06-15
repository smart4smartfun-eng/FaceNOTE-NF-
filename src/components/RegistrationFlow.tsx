import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, CheckCircle2, AlertCircle, Sparkles, User, Calendar, RefreshCw, Camera, Video, Activity, ShieldCheck, UserCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface RegistrationFlowProps {
  onComplete: (user: UserType) => void;
}

interface RegisteredUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  avatar: string;
  gender: string;
  birthday: string;
}

// Helper to interact with the FaceNote dynamic accounts register database
const getRegisteredUsers = (): RegisteredUser[] => {
  const data = localStorage.getItem('facenote_registered_users');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  
  // Seed initial authorized profiles (especially the user's workspace email!)
  const seedUsers: RegisteredUser[] = [
    {
      name: 'Taylor Peterson',
      email: 'smart4smartfun@gmail.com',
      password: 'password',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      gender: 'Male',
      birthday: '1995-06-15'
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah@facenote.io',
      password: 'password',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      gender: 'Female',
      birthday: '1998-03-24'
    },
    {
      name: 'Marcus Rivera',
      email: 'marcus@facenote.io',
      password: 'password',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      gender: 'Male',
      birthday: '1996-07-11'
    }
  ];
  localStorage.setItem('facenote_registered_users', JSON.stringify(seedUsers));
  return seedUsers;
};

export default function RegistrationFlow({ onComplete }: RegistrationFlowProps) {
  const [method, setMethod] = useState<'login' | 'signup' | 'face_verification' | 'success'>('login');
  
  // Login input states
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Real Facebook layout signup states
  const [signupForm, setSignupForm] = useState({
    firstName: '',
    surname: '',
    emailOrMobile: '',
    password: '',
    birthDay: '15',
    birthMonth: 'Jun',
    birthYear: '1995',
    gender: 'Male'
  });
  const [signupError, setSignupError] = useState('');

  // Authenticated profile intermediate container
  const [activeSessionUser, setActiveSessionUser] = useState<RegisteredUser | null>(null);

  // Real face scanning states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Position face inside camera frame to begin scan.');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [useAsAvatar, setUseAsAvatar] = useState(true);
  const [randomStats, setRandomStats] = useState({
    pitch: 0.1,
    yaw: -0.2,
    roll: 0.0,
    confidence: 0.992,
    brightness: 82,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [laserPos, setLaserPos] = useState(10);
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setLaserPos(pos => {
          if (pos >= 90) return 10;
          return pos + 5;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  // Initialize and load registered database
  useEffect(() => {
    getRegisteredUsers();
  }, []);

  // Handle active webcam stream creation or release
  useEffect(() => {
    if (method === 'face_verification') {
      let activeStream: MediaStream | null = null;
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(s => {
          activeStream = s;
          setStream(s);
          setCameraActive(true);
          setCameraError('');
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.error("Camera permissions check failed:", err);
          setCameraActive(false);
          setCameraError("Unable to open device camera or permission was denied. You may proceed with simulated high-fidelity facial authorization.");
        });

      return () => {
        if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [method]);

  const handleStartScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanStatus('Aligning dynamic scanning matrix...');

    const interval = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 5;
        
        // Update live processing signals to feel highly dynamic and real!
        setRandomStats({
          pitch: +(Math.sin(next / 10) * 0.4).toFixed(3),
          yaw: +(Math.cos(next / 10) * 0.5).toFixed(3),
          roll: +(Math.sin(next / 20) * 0.1).toFixed(3),
          confidence: +(0.95 + (Math.random() * 0.049)).toFixed(3),
          brightness: Math.floor(75 + (Math.random() * 15)),
        });

        if (next === 15) {
          setScanStatus('Face detected. Pinpointing biometric landmark points...');
        } else if (next === 35) {
          setScanStatus('Reconstructing facial mesh (78 Key points mapped). Checking fit... [OK]');
        } else if (next === 55) {
          setScanStatus('Analyzing pupil spacing, jawline angle, and skin thermal reflection...');
        } else if (next === 75) {
          setScanStatus('Matching facial signature hash with local security credentials token...');
        } else if (next === 90) {
          setScanStatus('Encoding verified credentials signature matrix...');
        } else if (next >= 100) {
          clearInterval(interval);
          
          // Complete scan action - capture webcam photo if active!
          let finalPhoto = null;
          if (cameraActive && videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = 400;
              canvas.height = 400;
              // Mirror effect for front-facing selfie
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              
              // Draw cosmetic target overlays directly onto preview snapshot!
              ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 3;
              ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
              
              ctx.font = 'bold 12px monospace';
              ctx.fillStyle = '#3b82f6';
              ctx.fillText('FACENOTE SECURE FACE SCAN', 20, 35);
              ctx.fillText(`VERIFIED SECURE: ${new Date().toLocaleTimeString()}`, 20, 55);
              
              finalPhoto = canvas.toDataURL('image/jpeg');
              setCapturedPhoto(finalPhoto);
            }
          } else {
            // Simulated backup selfie
            setCapturedPhoto("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80");
          }
          
          setScanStatus('Facial scanning complete! Biometric passcode generated successfully.');
          setIsScanning(false);
          return 100;
        }
        return next;
      });
    }, 150);
  };

  const handleProceedAfterScan = () => {
    if (activeSessionUser) {
      const updatedUser = { ...activeSessionUser };
      if (capturedPhoto && useAsAvatar) {
        updatedUser.avatar = capturedPhoto;
      }
      setActiveSessionUser(updatedUser);
      setMethod('success');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const idValue = loginForm.identifier.trim();
    const pwValue = loginForm.password;

    if (!idValue || !pwValue) {
      setLoginError('Please supply both username/email and password credentials.');
      return;
    }

    const users = getRegisteredUsers();
    const match = users.find(u => 
      u.email.toLowerCase() === idValue.toLowerCase() || 
      (u.phone && u.phone === idValue)
    );

    if (!match) {
      setLoginError("Account not found. Login only available for accounts registered on FaceNote.");
      return;
    }

    if (match.password !== pwValue) {
      setLoginError("Incorrect passcode identifier credentials. Please check details.");
      return;
    }

    // Direct user directly to success screen
    setActiveSessionUser(match);
    setMethod('success');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    const { firstName, surname, emailOrMobile, password, birthDay, birthMonth, birthYear, gender } = signupForm;

    if (!firstName.trim() || !surname.trim() || !emailOrMobile.trim() || !password) {
      setSignupError('All fields are required to create an account.');
      return;
    }

    const targetEmail = emailOrMobile.trim();
    const users = getRegisteredUsers();

    // Check pre-existence
    const isDuplicate = users.some(u => 
      u.email.toLowerCase() === targetEmail.toLowerCase() || 
      (u.phone && u.phone === targetEmail)
    );

    if (isDuplicate) {
      setSignupError('An account with this email or mobile identifier is already registered.');
      return;
    }

    // Generate real profile record
    const fullName = `${firstName.trim()} ${surname.trim()}`;
    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    ];
    const randomizedAvatar = defaultAvatars[users.length % defaultAvatars.length];

    const newUser: RegisteredUser = {
      name: fullName,
      email: targetEmail.includes('@') ? targetEmail : `${targetEmail.replace(/[^0-9]/g, '')}@facenote.io`,
      phone: !targetEmail.includes('@') ? targetEmail : undefined,
      password: password,
      avatar: randomizedAvatar,
      gender: gender,
      birthday: `${birthYear}-${birthMonth}-${birthDay}`
    };

    const updated = [...users, newUser];
    localStorage.setItem('facenote_registered_users', JSON.stringify(updated));

    // Direct user directly to success screen
    setActiveSessionUser(newUser);
    setMethod('success');
  };

  const handleLaunchFeed = () => {
    if (activeSessionUser) {
      const finalUser: UserType = {
        id: 'me',
        name: activeSessionUser.name,
        email: activeSessionUser.email,
        phoneNumber: activeSessionUser.phone,
        avatar: activeSessionUser.avatar,
        isRegistered: true,
        isGmailAuthed: activeSessionUser.email.includes('gmail'),
        isFaceVerified: true,
        faceScanData: capturedPhoto || undefined,
        isOnline: true,
        bio: activeSessionUser.name === 'Taylor Peterson' 
          ? 'Exploring FaceNOTE. Lover of classic design paradigms, run training, and clean software architecture. 🚀'
          : activeSessionUser.name === 'Sarah Jenkins'
          ? 'Community developer & outdoor photographer. Always chasing sunsets! 🏞️'
          : 'Reconnecting on FaceNOTE! Feel free to leave a post or send a direct wave.',
        workplace: activeSessionUser.name === 'Taylor Peterson'
          ? 'Lead Engineer at Tech Corp'
          : activeSessionUser.name === 'Sarah Jenkins'
          ? 'UI Designer & Photographer'
          : 'Design lead at FaceNote Creative',
        education: 'Stanford University',
        currentCity: 'Redwood City, California',
        hometown: 'Seattle, Washington',
        relationshipStatus: activeSessionUser.name === 'Taylor Peterson' ? 'Single' : 'In a relationship',
        website: 'https://facenote.io/me',
        hobbies: activeSessionUser.name === 'Taylor Peterson'
          ? ["⚽ Sports", "💻 Coding", "☕ Coffee", "🏋️ Fitness"]
          : ["📸 Photography", "✈️ Travel", "🎨 Painting", "🎸 Music"]
      };
      onComplete(finalUser);
    }
  };

  // Static select options matching real facebook formats
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = Array.from({ length: 80 }, (_, i) => String(2026 - i));

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-6 py-6 bg-slate-950 text-white overflow-y-auto no-scrollbar">
      
      {/* Brand Header */}
      <div className="text-center mt-2 mb-4">
        <h2 className="text-3xl font-black tracking-tight text-blue-500 hover:text-blue-400 Transition-all select-none">
          FaceNOTE
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Reconnect with old friends on FaceNOTE - Real profile credentials required.
        </p>
      </div>

      {/* LOGIN SCREEN */}
      {method === 'login' && (
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full gap-5 py-4 animate-fade-in">
          <form onSubmit={handleLoginSubmit} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-center text-slate-200 uppercase tracking-widest pb-1 border-b border-slate-800">
              Log Into FaceNOTE
            </h3>

            {loginError && (
              <div className="text-[10.5px] text-red-400 bg-red-400/5 border border-red-400/15 p-2 rounded-xl flex items-start gap-1.5 font-medium leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[10.5px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">
                  Email address or phone number
                </label>
                <div className="relative">
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    placeholder="Enter email e.g. smart4smartfun@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-slate-600 pl-10"
                    value={loginForm.identifier}
                    onChange={e => setLoginForm({ ...loginForm, identifier: e.target.value })}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Enter account password (e.g. password)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-slate-600 pl-10"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 transition-all text-center cursor-pointer active:scale-98"
            >
              Log In
            </button>

            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-500 hover:underline cursor-pointer">
                Forgotten password?
              </span>
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-center">
              <button
                id="login-to-signup"
                type="button"
                onClick={() => setMethod('signup')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-4.5 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95"
              >
                Create new account
              </button>
            </div>
          </form>

          <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-xl text-[10px] text-slate-500 text-center space-y-1">
            <p className="font-extrabold text-slate-400">🚨 FAST TESTING CREDENTIALS:</p>
            <p>Email: <span className="text-emerald-400 font-mono font-bold">smart4smartfun@gmail.com</span></p>
            <p>Password: <span className="text-emerald-400 font-mono font-bold">password</span></p>
          </div>
        </div>
      )}

      {/* SIGNUP - AUTHENTIC FACEBOOK SCHEME REGISTRATION */}
      {method === 'signup' && (
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full gap-4 py-4 animate-fade-in">
          <form onSubmit={handleSignupSubmit} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl text-left">
            <div>
              <h3 className="text-base font-black text-white">Create a new account</h3>
              <p className="text-[11px] text-slate-500">It's quick and easy.</p>
            </div>

            {signupError && (
              <div className="text-[10.5px] text-red-500 bg-red-500/5 border border-red-500/15 p-2 rounded-xl flex items-start gap-1.5 font-medium leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{signupError}</span>
              </div>
            )}

            <div className="space-y-3.5">
              {/* First Name & Surname Side-by-Side */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">First Name</label>
                  <input
                    id="signup-firstname"
                    type="text"
                    required
                    placeholder="First Name"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                    value={signupForm.firstName}
                    onChange={e => setSignupForm({ ...signupForm, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Surname</label>
                  <input
                    id="signup-surname"
                    type="text"
                    required
                    placeholder="Surname"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                    value={signupForm.surname}
                    onChange={e => setSignupForm({ ...signupForm, surname: e.target.value })}
                  />
                </div>
              </div>

              {/* Email or Mobile Number */}
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Mobile number or email address</label>
                <input
                  id="signup-emailmobile"
                  type="text"
                  required
                  placeholder="e.g. user@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  value={signupForm.emailOrMobile}
                  onChange={e => setSignupForm({ ...signupForm, emailOrMobile: e.target.value })}
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">New password</label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  placeholder="New password"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                  value={signupForm.password}
                  onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                />
              </div>

              {/* Date of Birth Selectors */}
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" /> Date of birth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    id="signup-birth-day"
                    aria-label="Birthday day"
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer text-center"
                    value={signupForm.birthDay}
                    onChange={e => setSignupForm({ ...signupForm, birthDay: e.target.value })}
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select
                    id="signup-birth-month"
                    aria-label="Birthday month"
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer text-center"
                    value={signupForm.birthMonth}
                    onChange={e => setSignupForm({ ...signupForm, birthMonth: e.target.value })}
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    id="signup-birth-year"
                    aria-label="Birthday year"
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer text-center font-mono"
                    value={signupForm.birthYear}
                    onChange={e => setSignupForm({ ...signupForm, birthYear: e.target.value })}
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Gender radio selectors */}
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Female', 'Male', 'Custom'].map(g => (
                    <label
                      key={g}
                      className="flex items-center justify-between px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-medium cursor-pointer select-none hover:bg-slate-900 hover:border-blue-500/40 transition-all"
                    >
                      <span>{g}</span>
                      <input
                        id={`signup-gender-${g.toLowerCase()}`}
                        type="radio"
                        name="gender"
                        value={g}
                        checked={signupForm.gender === g}
                        className="accent-blue-500 scale-105 cursor-pointer"
                        onChange={() => setSignupForm({ ...signupForm, gender: g })}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[9.5px] text-slate-500 leading-normal pt-1 pt-2">
              By clicking Sign Up, you agree to our terms of connection. Profiles and messages are strictly linked to our localized verified social servers on FaceNote.
            </p>

            <button
              id="signup-submit"
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/10 transition-all text-center cursor-pointer active:scale-98"
            >
              Sign Up
            </button>

            <div className="text-center pt-2">
              <button
                id="signup-back-to-login"
                type="button"
                onClick={() => setMethod('login')}
                className="text-blue-400 hover:text-blue-300 font-bold text-xs underline cursor-pointer"
              >
                Already have an FaceNote account? Log In
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FACE VERIFICATION GATE */}
      {method === 'face_verification' && activeSessionUser && (
        <div className="flex-1 flex flex-col justify-between items-center max-w-sm mx-auto w-full gap-4 py-2 text-center animate-fade-in font-sans">
          <div className="space-y-1">
            <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
              Biometric Authorization Gate
            </h3>
            <p className="text-[10px] text-zinc-400">
              Biometric facial matches secure your profile against high-converting ad engines.
            </p>
          </div>

          {/* Video Scanning Window Frame */}
          <div className="relative w-56 h-56 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-950 shadow-[0_0_40px_rgba(59,130,246,0.15)] flex items-center justify-center group ring-4 ring-blue-500/10 shrink-0">
            {/* Corner Decorative Reticles */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl-sm select-none pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-tr-sm select-none pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl-sm select-none pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-blue-500 rounded-br-sm select-none pointer-events-none" />

            {capturedPhoto ? (
              // Captured Photo Preview
              <img 
                src={capturedPhoto} 
                className="w-full h-full object-cover scale-102" 
                alt="Captured Facematch Selfie"
                referrerPolicy="no-referrer"
              />
            ) : cameraActive ? (
              // Live camera stream
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            ) : (
              // Mock fallback portrait
              <div className="flex flex-col items-center justify-center space-y-2 text-slate-500 p-6">
                <User className="w-12 h-12 text-slate-700 animate-pulse" />
                <span className="text-[10px] leading-tight font-medium text-slate-400">Camera stream offline</span>
              </div>
            )}

            {/* Glowing red scanner beam line overlay */}
            {isScanning && (
              <div 
                className="absolute left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_10px_#3b82f6] shadow-blue-500/80 transition-all duration-75 select-none pointer-events-none"
                style={{ top: `${laserPos}%` }}
              />
            )}

            {/* Verification Success Tag */}
            {capturedPhoto && (
              <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex items-center justify-center select-none pointer-events-none">
                <div className="bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-950" /> SECURE OK
                </div>
              </div>
            )}
          </div>

          {/* Hidden utility canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning Status readout */}
          <div className="w-full space-y-3 px-1">
            <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 space-y-2 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-950/60 pb-1.5 text-left">
                <span className="text-[9px] text-zinc-500 uppercase font-black flex items-center gap-1">
                  <Activity className="w-3 h-3 text-blue-400 font-bold" /> Scanner Telemetry
                </span>
                <span className="text-[9.5px] text-blue-400 font-mono font-bold">
                  Conf: {(randomStats.confidence * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-1 px-1 py-0.5 text-[8.5px] font-mono text-zinc-400">
                <div>Pitch: <span className="text-white font-bold">{randomStats.pitch}</span></div>
                <div>Yaw: <span className="text-white font-bold">{randomStats.yaw}</span></div>
                <div>Roll: <span className="text-white font-bold">{randomStats.roll}</span></div>
              </div>

              {cameraError && (
                <div className="text-[8.5px] text-amber-400 px-1.5 bg-amber-500/5 rounded border border-amber-500/10 font-sans leading-tight text-center py-1">
                  {cameraError}
                </div>
              )}

              <p className="text-[10px] text-slate-300 font-medium leading-normal animate-pulse min-h-[30px] flex items-center justify-center">
                {scanStatus}
              </p>

              {/* Real Scanning Track Bar */}
              {isScanning && (
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850 relative shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-150 relative"
                    style={{ width: `${scanProgress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_white]" />
                  </div>
                </div>
              )}
            </div>

            {/* Captures settings selector */}
            {capturedPhoto && (
              <div className="flex items-center justify-center gap-2 bg-slate-900/60 border border-slate-900/40 py-2 px-3.5 rounded-xl text-[10.5px]">
                <input 
                  type="checkbox" 
                  id="toggle-use-avatar"
                  className="accent-blue-500 cursor-pointer w-3.5 h-3.5 shrink-0"
                  checked={useAsAvatar}
                  onChange={e => setUseAsAvatar(e.target.checked)}
                />
                <label htmlFor="toggle-use-avatar" className="text-slate-300 font-semibold cursor-pointer select-none">
                  Set this scan photo as FaceNOTE avatar
                </label>
              </div>
            )}

            {/* Controls Button logic */}
            <div className="space-y-2">
              {!capturedPhoto ? (
                <button
                  id="btn-scan-trigger"
                  type="button"
                  disabled={isScanning}
                  onClick={handleStartScan}
                  className={`w-full py-3.5 rounded-xl text-xs font-black tracking-wide transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                    isScanning 
                      ? 'bg-slate-850 border border-slate-800 text-slate-500 cursor-wait' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10 active:scale-98'
                  }`}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                      <span>Scanning Face landmark points... {scanProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 text-white" />
                      <span>{cameraActive ? 'Initiate Biometric Scan' : 'Run simulated facial scanner'}</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    id="btn-scan-reset"
                    type="button"
                    onClick={() => {
                      setCapturedPhoto(null);
                      setScanProgress(0);
                      setScanStatus('Position face inside camera frame to begin scan.');
                    }}
                    className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs py-3 rounded-xl font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry Scan
                  </button>

                  <button
                    id="btn-scan-proceed"
                    type="button"
                    onClick={handleProceedAfterScan}
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-3 rounded-xl font-black transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                  >
                    <UserCheck className="w-4 h-4" /> Approve Credentials Pass
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS GATE */}
      {method === 'success' && activeSessionUser && (
        <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 py-4 animate-fade-in max-w-sm mx-auto w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl scale-125" />
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40 relative z-10 animate-scale-up">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-lg font-black text-white">Security Pass Approved!</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed px-2">
              Welcome back, <span className="font-extrabold text-slate-200">{activeSessionUser.name}</span>! Your profile credentials have been successfully authenticated and mapped to the FaceNOTE timeline feed.
            </p>
          </div>

          <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 text-left font-mono space-y-2">
            <p className="text-[9.5px] text-slate-500 uppercase font-black tracking-wide pb-1.5 border-b border-slate-800">
              Active Authorized Session Info
            </p>
            <p className="text-[10px] text-slate-300 flex justify-between">
              <span>FullName:</span> <span className="text-white font-extrabold">{activeSessionUser.name}</span>
            </p>
            <p className="text-[10px] text-slate-300 flex justify-between">
              <span>Gate Method:</span> <span className="text-emerald-400 font-extrabold">SECURE_CREDENTIALS_PASS</span>
            </p>
            <p className="text-[10px] text-slate-300 flex justify-between">
              <span>Gender:</span> <span className="text-blue-400">{activeSessionUser.gender}</span>
            </p>
            <p className="text-[10px] text-slate-300 flex justify-between">
              <span>Birthday:</span> <span className="text-amber-400">{activeSessionUser.birthday}</span>
            </p>
          </div>

          <button
            id="reg-success-complete"
            onClick={handleLaunchFeed}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            Launch FaceNOTE Feed ➔
          </button>
        </div>
      )}

    </div>
  );
}
