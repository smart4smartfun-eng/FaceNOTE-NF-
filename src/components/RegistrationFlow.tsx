import React, { useState, useEffect } from 'react';
import { Mail, Lock, CheckCircle2, AlertCircle, Sparkles, User, Calendar, RefreshCw } from 'lucide-react';
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
  const [method, setMethod] = useState<'login' | 'signup' | 'success'>('login');
  
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

  // Initialize and load registered database
  useEffect(() => {
    getRegisteredUsers();
  }, []);

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

    // Success Authentication
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

    // Save active authentication context
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
        isOnline: true
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
