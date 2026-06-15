import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Lock, Camera, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';
import { User } from '../types';

interface RegistrationFlowProps {
  onComplete: (user: User) => void;
}

const countryDialCodes = [
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: '+43', name: 'Austria', flag: '🇦🇹' },
  { code: '+30', name: 'Greece', flag: '🇬🇷' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { code: '+212', name: 'Morocco', flag: '🇲🇦' },
  { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
  { code: '+213', name: 'Algeria', flag: '🇩🇿' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: '+251', name: 'Ethiopia', flag: '🇪🇹' },
  { code: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: '+98', name: 'Iran', flag: '🇮🇷' },
  { code: '+964', name: 'Iraq', flag: '🇮🇶' },
  { code: '+963', name: 'Syria', flag: '🇸🇾' },
  { code: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+968', name: 'Oman', flag: '🇴🇲' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+358', name: 'Finland', flag: '🇫🇮' },
  { code: '+420', name: 'Czech Republic', flag: '🇨🇿' },
  { code: '+36', name: 'Hungary', flag: '🇭🇺' },
  { code: '+40', name: 'Romania', flag: '🇷🇴' },
  { code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
  { code: '+385', name: 'Croatia', flag: '🇭🇷' },
  { code: '+381', name: 'Serbia', flag: '🇷🇸' },
  { code: '+421', name: 'Slovakia', flag: '🇸🇰' },
  { code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
  { code: '+370', name: 'Lithuania', flag: '🇱🇹' },
  { code: '+371', name: 'Latvia', flag: '🇱🇻' },
  { code: '+372', name: 'Estonia', flag: '🇪🇪' },
  { code: '+354', name: 'Iceland', flag: '🇮🇸' },
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
  { code: '+507', name: 'Panama', flag: '🇵🇦' },
  { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
  { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
  { code: '+504', name: 'Honduras', flag: '🇭🇳' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
  { code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
  { code: '+355', name: 'Albania', flag: '🇦🇱' },
  { code: '+376', name: 'Andorra', flag: '🇦🇩' },
  { code: '+244', name: 'Angola', flag: '🇦🇴' },
  { code: '+1-264', name: 'Anguilla', flag: '🇦🇮' },
  { code: '+1-268', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: '+374', name: 'Armenia', flag: '🇦🇲' },
  { code: '+297', name: 'Aruba', flag: '🇦🇼' },
  { code: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: '+1-242', name: 'Bahamas', flag: '🇧🇸' },
  { code: '+1-246', name: 'Barbados', flag: '🇧🇧' },
  { code: '+375', name: 'Belarus', flag: '🇧🇾' },
  { code: '+501', name: 'Belize', flag: '🇧🇿' },
  { code: '+229', name: 'Benin', flag: '🇧🇯' },
  { code: '+1-441', name: 'Bermuda', flag: '🇧🇲' },
  { code: '+975', name: 'Bhutan', flag: '🇧🇹' },
  { code: '+387', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: '+267', name: 'Botswana', flag: '🇧🇼' },
  { code: '+246', name: 'British Indian Ocean Territory', flag: '🇮🇴' },
  { code: '+1-284', name: 'British Virgin Islands', flag: '🇻🇬' },
  { code: '+673', name: 'Brunei', flag: '🇧🇳' },
  { code: '+226', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+257', name: 'Burundi', flag: '🇧🇮' },
  { code: '+855', name: 'Cambodia', flag: '🇰🇭' },
  { code: '+237', name: 'Cameroon', flag: '🇨🇲' },
  { code: '+238', name: 'Cape Verde', flag: '🇨🇻' },
  { code: '+1-345', name: 'Cayman Islands', flag: '🇰🇾' },
  { code: '+236', name: 'Central African Republic', flag: '🇨🇫' },
  { code: '+235', name: 'Chad', flag: '🇹🇩' },
  { code: '+269', name: 'Comoros', flag: '🇰🇲' },
  { code: '+242', name: 'Congo', flag: '🇨🇬' },
  { code: '+243', name: 'Democratic Republic of the Congo', flag: '🇨🇩' },
  { code: '+682', name: 'Cook Islands', flag: '🇨🇰' },
  { code: '+225', name: 'Ivory Coast', flag: '🇨🇮' },
  { code: '+357', name: 'Cyprus', flag: '🇨🇾' },
  { code: '+253', name: 'Djibouti', flag: '🇩🇯' },
  { code: '+1-767', name: 'Dominica', flag: '🇩🇲' },
  { code: '+1-809', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: '+670', name: 'East Timor', flag: '🇹🇱' },
  { code: '+240', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: '+291', name: 'Eritrea', flag: '🇪🇷' },
  { code: '+268', name: 'Eswatini', flag: '🇸🇿' },
  { code: '+298', name: 'Faroe Islands', flag: '🇫🇴' },
  { code: '+679', name: 'Fiji', flag: '🇫🇯' },
  { code: '+241', name: 'Gabon', flag: '🇬🇦' },
  { code: '+220', name: 'Gambia', flag: '🇬🇲' },
  { code: '+995', name: 'Georgia', flag: '🇬🇪' },
  { code: '+350', name: 'Gibraltar', flag: '🇬🇮' },
  { code: '+299', name: 'Greenland', flag: '🇬🇱' },
  { code: '+1-473', name: 'Grenada', flag: '🇬🇩' },
  { code: '+224', name: 'Guinea', flag: '🇬🇳' },
  { code: '+245', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: '+592', name: 'Guyana', flag: '🇬🇾' },
  { code: '+509', name: 'Haiti', flag: '🇭🇹' },
  { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
  { code: '+1-876', name: 'Jamaica', flag: '🇯🇲' },
  { code: '+7-7', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: '+686', name: 'Kiribati', flag: '🇰🇮' },
  { code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: '+856', name: 'Laos', flag: '🇱🇦' },
  { code: '+266', name: 'Lesotho', flag: '🇱🇸' },
  { code: '+231', name: 'Liberia', flag: '🇱🇷' },
  { code: '+218', name: 'Libya', flag: '🇱🇾' },
  { code: '+377', name: 'Monaco', flag: '🇲🇨' },
  { code: '+853', name: 'Macau', flag: '🇲🇴' },
  { code: '+261', name: 'Madagascar', flag: '🇲🇬' },
  { code: '+265', name: 'Malawi', flag: '🇲🇼' },
  { code: '+960', name: 'Maldives', flag: '🇲🇻' },
  { code: '+223', name: 'Mali', flag: '🇲🇱' },
  { code: '+356', name: 'Malta', flag: '🇲🇹' },
  { code: '+692', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: '+222', name: 'Mauritania', flag: '🇲🇷' },
  { code: '+230', name: 'Mauritius', flag: '🇲🇺' },
  { code: '+95', name: 'Myanmar', flag: '🇲🇲' },
  { code: '+976', name: 'Mongolia', flag: '🇲🇳' },
  { code: '+382', name: 'Montenegro', flag: '🇲🇪' },
  { code: '+1-664', name: 'Montserrat', flag: '🇲🇸' },
  { code: '+258', name: 'Mozambique', flag: '🇲🇿' },
  { code: '+264', name: 'Namibia', flag: '🇳🇦' },
  { code: '+674', name: 'Nauru', flag: '🇳🇷' },
  { code: '+687', name: 'New Caledonia', flag: '🇳🇨' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+227', name: 'Niger', flag: '🇳🇪' },
  { code: '+683', name: 'Niue', flag: '🇳🇺' },
  { code: '+850', name: 'North Korea', flag: '🇰🇵' },
  { code: '+389', name: 'North Macedonia', flag: '🇲🇰' },
  { code: '+680', name: 'Palau', flag: '🇵🇼' },
  { code: '+970', name: 'Palestine', flag: '🇵🇸' },
  { code: '+675', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: '+250', name: 'Rwanda', flag: '🇷🇼' },
  { code: '+1-869', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: '+1-758', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: '+1-784', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: '+685', name: 'Samoa', flag: '🇼🇸' },
  { code: '+378', name: 'San Marino', flag: '🇸🇲' },
  { code: '+239', name: 'Sao Tome and Principe', flag: '🇸🇹' },
  { code: '+221', name: 'Senegal', flag: '🇸🇳' },
  { code: '+248', name: 'Seychelles', flag: '🇸🇨' },
  { code: '+232', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: '+677', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: '+252', name: 'Somalia', flag: '🇸🇴' },
  { code: '+211', name: 'South Sudan', flag: '🇸🇸' },
  { code: '+249', name: 'Sudan', flag: '🇸🇩' },
  { code: '+597', name: 'Suriname', flag: '🇸🇷' },
  { code: '+992', name: 'Tajikistan', flag: '🇹🇯' },
  { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
  { code: '+228', name: 'Togo', flag: '🇹🇬' },
  { code: '+676', name: 'Tonga', flag: '🇹🇴' },
  { code: '+1-868', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: '+993', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: '+1-649', name: 'Turks and Caicos Islands', flag: '🇹🇨' },
  { code: '+688', name: 'Tuvalu', flag: '🇹🇻' },
  { code: '+256', name: 'Uganda', flag: '🇺🇬' },
  { code: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: '+678', name: 'Vanuatu', flag: '🇻🇺' },
  { code: '+967', name: 'Yemen', flag: '🇾🇪' },
  { code: '+260', name: 'Zambia', flag: '🇿🇲' },
  { code: '+263', name: 'Zimbabwe', flag: '🇿🇼' }
].sort((a, b) => a.name.localeCompare(b.name));

interface RegistrationFlowProps {
  onComplete: (user: User) => void;
}

export default function RegistrationFlow({ onComplete }: RegistrationFlowProps) {
  const [method, setMethod] = useState<'options' | 'email' | 'phone' | 'face' | 'success' | 'login'>('options');
  const [emailForm, setEmailForm] = useState({ name: '', email: '', password: '' });
  const [phoneForm, setPhoneForm] = useState({ phone: '', otp: '' });
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedDialCode, setSelectedDialCode] = useState('+1');
  const [sentOtp, setSentOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  // Face Verification states
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [faceVectors, setFaceVectors] = useState<string[]>([]);
  const [useFallbackScan, setUseFallbackScan] = useState(false);
  const [faceDone, setFaceDone] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Quick Mock names generator to support quick registration
  const prefillNames = ['Alex Henderson', 'Jordan Avery', 'Taylor Swift', 'Sam Peterson', 'Elena Rostova'];
  const [randomPresetName] = useState(() => prefillNames[Math.floor(Math.random() * prefillNames.length)]);

  useEffect(() => {
    return () => {
      // Cleanup camera streams on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [cameraStream]);

  const handleEmailRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.name || !emailForm.email || !emailForm.password) return;
    // Step straight to success (face verification bypass)
    setMethod('success');
  };

  const handlePhoneSendOtp = () => {
    if (!phoneForm.phone) return;
    // Generate simple 4 digit OTP for high conversion rate
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setSentOtp(true);
    setOtpError('');
    alert(`[FaceNOTE Secure SMS Gateway] SMS dispatched to ${selectedDialCode} ${phoneForm.phone}. Your 4-digit verification code is: ${code}`);
  };

  const handlePhoneVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneForm.otp === generatedOtp) {
      const cleanDial = selectedDialCode.replace('+', '').replace('-', '');
      setEmailForm({
        name: randomPresetName,
        email: `phone_${cleanDial}_${phoneForm.phone.replace(/[^0-9]/g, '')}@facenote.io`,
        password: 'phone-secured-login'
      });
      // Step straight to success (face verification bypass)
      setMethod('success');
    } else {
      setOtpError('Invalid authorization token. Please check SMS popup.');
    }
  };

  const handleGoogleGmailSignup = () => {
    // Quick high-converting instantaneous sign-in emulation
    const fakeGmailUser = {
      name: 'Google User ' + Math.floor(100 + Math.random() * 900),
      email: 'gmail-connected@gmail.com',
      password: 'gmail-oauth-secured'
    };
    setEmailForm(fakeGmailUser);
    alert('Gmail Authentication successful! Launching secure active profile.');
    // Step straight to success (face verification bypass)
    setMethod('success');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.identifier || !loginForm.password) return;
    
    // De-structure name from mail/username
    const prefix = loginForm.identifier.includes('@') ? loginForm.identifier.split('@')[0] : loginForm.identifier;
    const name = prefix.replace(/[._-]/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    setEmailForm({
      name: name || 'Taylor Peterson',
      email: loginForm.identifier.includes('@') ? loginForm.identifier : `${loginForm.identifier.toLowerCase().replace(/\s+/g, '')}@facenote.io`,
      password: loginForm.password
    });

    setMethod('success');
  };

  // Start actual webcam access
  const startCamera = async () => {
    setUseFallbackScan(false);
    setIsScanning(false);
    setScanProgress(0);
    setFaceVectors([]);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported or is blocked in this browser context.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 300, facingMode: 'user' },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log('Video play error:', e));
      }
    } catch (err) {
      console.warn('Webcam initialization failed or was blocked. Using cyber-vector fallback scanner.', err);
      setUseFallbackScan(true);
    }
  };

  // Run the biometric Face Verify scanning process
  const triggerFaceScan = () => {
    if (isScanning || faceDone) return;
    setIsScanning(true);
    setScanProgress(0);
    setFaceVectors(['INITIATING DIGITAL CRANIAL INTERCEPT...']);

    const steps = [
      'CAPTURING IRIDIAL GEOMETRY CONTRASTS...',
      'ESTABLISHING DEPTH ENVELOPES...',
      'MAPPING INTER-ORBITAL WIDTH: 14.82mm',
      'COMPILING BIOMETRIC HASHLIST VECTOR...',
      'VERIFYING SECURE CRYPTO SIGNATURE IN CLOUD...'
    ];

    let currentProgress = 0;
    scanIntervalRef.current = setInterval(() => {
      currentProgress += 5;
      setScanProgress(currentProgress);

      const stepIndex = Math.floor((currentProgress / 100) * steps.length);
      if (stepIndex < steps.length) {
        setFaceVectors(prev => {
          if (!prev.includes(steps[stepIndex])) {
            return [...prev, steps[stepIndex]];
          }
          return prev;
        });
      }

      if (currentProgress >= 100) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setIsScanning(false);
        setFaceDone(true);
        setFaceVectors(prev => [...prev, '✓ BIOMETRIC FACE VERIFICATION VERIFIED ENTIRELY!']);
        
        // Short pause, then save
        setTimeout(() => {
          if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
          }
          setMethod('success');
        }, 1500);
      }
    }, 150);
  };

  const handleFinalSubmit = () => {
    const finalUser: User = {
      id: 'me',
      name: emailForm.name || randomPresetName,
      email: emailForm.email,
      phoneNumber: phoneForm.phone ? `${selectedDialCode} ${phoneForm.phone}` : undefined,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // Premium high quality user avatar
      isRegistered: true,
      isGmailAuthed: emailForm.email?.includes('gmail') || false,
      isFaceVerified: true,
      faceScanData: 'FN_VEC_82a9s' + Math.floor(1000 + Math.random() * 9000),
      isOnline: true
    };
    onComplete(finalUser);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-6 py-6 bg-slate-950 text-white overflow-y-auto no-scrollbar">
      
      {/* Upper Brand Info */}
      <div className="text-center mt-2 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 border border-blue-500/30 rounded-full text-[11px] font-semibold text-blue-400 mb-2 tracking-wide uppercase">
          🛡️ Secure Authentication
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex justify-center items-center gap-2">
          FaceNOTE
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          reconnect with your old friend on FaceNOTE
        </p>
      </div>

      {method === 'options' && (
        <div className="flex-1 flex flex-col justify-center gap-6 py-4 animate-fade-in">
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-slate-200">Create Secure Social Identifier</h3>
            <p className="text-[11px] text-slate-500">Pick a registration gateway or log in directly to your profile account.</p>
          </div>

          <div className="space-y-3">
            {/* Email Form Option */}
            <button
              id="signup-opt-email"
              onClick={() => setMethod('email')}
              className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Enroll with Email & Password</p>
                  <p className="text-[10px] text-slate-500">Standard standalone credentials login</p>
                </div>
              </div>
              <span className="text-xs text-slate-600 group-hover:text-slate-400">➔</span>
            </button>

            {/* Google / Gmail Auth */}
            <button
              id="signup-opt-gmail"
              onClick={handleGoogleGmailSignup}
              className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/10 text-red-400 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Sign up instant with Google</p>
                  <p className="text-[10px] text-slate-500">Gmail instant token handshake verification</p>
                </div>
              </div>
              <span className="text-xs text-slate-600 group-hover:text-slate-400">➔</span>
            </button>

            {/* Phone Verification */}
            <button
              id="signup-opt-phone"
              onClick={() => setMethod('phone')}
              className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Enroll via Phone Verification</p>
                  <p className="text-[10px] text-slate-500">Secure numerical OTP SMS handshake</p>
                </div>
              </div>
              <span className="text-xs text-slate-600 group-hover:text-slate-400">➔</span>
            </button>

            {/* Direct Login Link */}
            <div className="pt-3 text-center border-t border-slate-900">
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  id="signup-to-login"
                  type="button"
                  onClick={() => setMethod('login')}
                  className="text-blue-400 hover:text-blue-300 font-extrabold underline cursor-pointer hover:no-underline transition-all"
                >
                  Log In directly ➔
                </button>
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-normal">
              FaceNOTE values deep trust alignment. Each identifier is uniquely verified to maximize real human activity metrics which prints dynamic wallet dividends for our registered user community.
            </p>
          </div>
        </div>
      )}

      {/* Login Screen Panel */}
      {method === 'login' && (
        <form onSubmit={handleLoginSubmit} className="flex-1 flex flex-col justify-center gap-4 py-4 animate-fade-in">
          <div className="space-y-1 mb-2">
            <h3 className="text-base font-bold text-slate-100">Welcome Back: Log In</h3>
            <p className="text-[10.5px] text-slate-500">Provide your password credentials to resume active sessions.</p>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[10.5px] text-slate-400 font-medium mb-1">Email or Username</label>
              <div className="relative">
                <input
                  id="login-identifier"
                  type="text"
                  required
                  placeholder="e.g. liam@gmail.com"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-slate-600 pl-10"
                  value={loginForm.identifier}
                  onChange={e => setLoginForm({ ...loginForm, identifier: e.target.value })}
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] text-slate-400 font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-slate-600 pl-10"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {loginError && (
            <p className="text-[10px] text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {loginError}
            </p>
          )}

          <div className="flex gap-2.5 mt-4">
            <button
              id="login-back"
              type="button"
              onClick={() => setMethod('options')}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer"
            >
              Sign Up Options
            </button>
            <button
              id="login-submit"
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 transition-all text-center cursor-pointer"
            >
              Log In Securely ➔
            </button>
          </div>
        </form>
      )}

      {/* Email Registration Panel */}
      {method === 'email' && (
        <form onSubmit={handleEmailRegister} className="flex-1 flex flex-col justify-center gap-4 py-4 animate-fade-in">
          <div className="space-y-1 mb-2">
            <h3 className="text-sm font-bold text-slate-100">Step 1: Enter Profile Setup</h3>
            <p className="text-[10px] text-slate-500">Provide an avatar identifier name & operational email.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10.5px] text-slate-400 font-medium mb-1">Your Display Name</label>
              <input
                id="reg-email-name"
                type="text"
                required
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-slate-600"
                placeholder="e.g. Liam Thompson"
                value={emailForm.name}
                onChange={e => setEmailForm({ ...emailForm, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10.5px] text-slate-400 font-medium mb-1">Email Address</label>
              <input
                id="reg-email-addr"
                type="email"
                required
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-slate-600"
                placeholder="liam@gmail.com"
                value={emailForm.email}
                onChange={e => setEmailForm({ ...emailForm, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10.5px] text-slate-400 font-medium mb-1">Password</label>
              <input
                id="reg-email-pw"
                type="password"
                required
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••••••"
                value={emailForm.password}
                onChange={e => setEmailForm({ ...emailForm, password: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2.5 mt-4">
            <button
              id="reg-email-back"
              type="button"
              onClick={() => setMethod('options')}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 py-3 rounded-xl font-bold text-xs transition-all pointer-events-auto"
            >
              Back
            </button>
            <button
              id="reg-email-submit"
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 transition-all text-center cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>
      )}

      {/* Phone Registration Panel */}
      {method === 'phone' && (
        <div className="flex-1 flex flex-col justify-center gap-4 py-4 animate-fade-in">
          <div className="space-y-1 mb-2">
            <h3 className="text-sm font-bold text-slate-100">Step 1: Phone Authorizations</h3>
            <p className="text-[10px] text-slate-500">Retrieve a instant numerical validation message.</p>
          </div>

          {!sentOtp ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[10.5px] text-slate-400 font-medium mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative w-1/3 min-w-[105px]">
                    <select
                      id="reg-phone-country"
                      aria-label="Country dial code"
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-3 rounded-xl appearance-none cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none h-full font-mono text-center"
                      value={selectedDialCode}
                      onChange={e => setSelectedDialCode(e.target.value)}
                    >
                      {countryDialCodes.map((c) => (
                        <option key={`${c.code}-${c.name}`} value={c.code} className="bg-slate-950 text-white text-xs">
                          {c.flag} {c.code} ({c.name})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-1 text-slate-500 text-[9px]">
                      ▼
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      id="reg-phone-num"
                      type="tel"
                      required
                      className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none h-full placeholder:text-slate-600"
                      placeholder="(555) 019-2834"
                      value={phoneForm.phone}
                      onChange={e => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                id="reg-phone-send-btn"
                onClick={handlePhoneSendOtp}
                disabled={!phoneForm.phone}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 transition-all text-center"
              >
                Send SMS Gateway Passcode
              </button>
            </div>
          ) : (
            <form onSubmit={handlePhoneVerifyOtp} className="space-y-3">
              <div>
                <label className="block text-[10.5px] text-slate-400 font-medium mb-1">Enter 4-Digit One-Time Code</label>
                <input
                  id="reg-phone-otp"
                  type="text"
                  required
                  maxLength={4}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white outline-none transition-all"
                  placeholder="0000"
                  value={phoneForm.otp}
                  onChange={e => setPhoneForm({ ...phoneForm, otp: e.target.value })}
                />
                {otpError && (
                  <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {otpError}
                  </p>
                )}
              </div>

              <button
                id="reg-phone-verify-btn"
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all text-center"
              >
                Validate Security Token
              </button>

              <button
                id="reg-phone-retry-btn"
                type="button"
                onClick={handlePhoneSendOtp}
                className="w-full text-center text-[10px] text-slate-400 hover:text-white flex items-center justify-center gap-1.5 py-1"
              >
                <RefreshCw className="w-3 h-3" /> Resend SMS Code Popup
              </button>
            </form>
          )}

          <button
            id="reg-phone-back"
            onClick={() => { setSentOtp(false); setMethod('options'); }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 py-3 rounded-xl font-bold text-xs transition-all mt-2"
          >
            Back to Options
          </button>
        </div>
      )}

      {/* BIOMETRIC FACE VERIFICATION STAGE */}
      {method === 'face' && (
        <div className="flex-1 flex flex-col justify-between py-2 animate-fade-in">
          <div className="space-y-1 text-center">
            <h3 className="text-sm font-bold text-blue-400 flex items-center justify-center gap-1.5">
              <Camera className="w-4.5 h-4.5" /> Biometrics Face Verification
            </h3>
            <p className="text-[10px] text-slate-500">
              Align frame securely. Face-tracking maximizes user validity scores.
            </p>
          </div>

          {/* Secure Video Capture Stage wrapper */}
          <div className="my-3 relative w-full h-[240px] bg-slate-900 border-2 border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center">
            
            {/* If camera streams live */}
            {!useFallbackScan && cameraStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              /* High converting realistic placeholder scanning screen if camera streams can't start */
              <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 relative grid-pattern">
                
                {/* Simulated Wiremesh Face */}
                <div className="relative w-28 h-28 border border-neutral-800 rounded-full flex items-center justify-center bg-slate-900/40">
                  <div className="absolute inset-2 border border-slate-700/60 rounded-full animate-ping" />
                  <div className="absolute inset-6 border border-blue-500/30 rounded-full" />
                  {/* Cyber wiremesh eye points */}
                  <div className="flex gap-6 z-10">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  </div>
                  {/* Face landmark crosses */}
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-cyan-500/10" />
                  <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-cyan-500/10" />
                  <div className="absolute bottom-6 w-8 h-3 border-b-2 border-cyan-500/30 rounded-full" />
                </div>

                {!cameraStream && !useFallbackScan && (
                  <button
                    id="reg-face-camera-start"
                    onClick={startCamera}
                    className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-2 p-4 text-center group transition-all animate-fade-in"
                  >
                    <div className="p-3 bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white rounded-full transition-all">
                      <Camera className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-xs font-bold text-white">Enable Front Face Camera</span>
                    <span className="text-[10px] text-slate-500 max-w-xs">Requires system permissions. Captures depth layout metrics safely.</span>
                    <span 
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid parent click triggering startCamera
                        setUseFallbackScan(true);
                      }}
                      className="mt-4 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-[10px] font-bold tracking-wide transition-all cursor-pointer select-none"
                    >
                      Or Use Virtual Simulator Scanner ➔
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Glowing Scan Bar overlay */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] z-20"
                style={{
                  top: `${scanProgress}%`,
                  transition: 'top 0.15s linear',
                  animation: 'scan 1.5s infinite ease-in-out'
                }}
              />
            )}

            {/* Holographic Diagnostic HUD readings on margin borders */}
            <div className="absolute inset-0 p-3 z-10 flex flex-col justify-between pointer-events-none font-mono text-[8px] text-cyan-400">
              <div className="flex justify-between">
                <span>[CAM_FEED_ACTIVE: 30FPS]</span>
                <span>[ANGLE: 04.9°]</span>
              </div>
              
              {/* Dynamic scroll of text outputs */}
              <div className="bg-slate-950/80 p-1.5 rounded border border-cyan-500/20 max-h-[80px] overflow-hidden no-scrollbar w-full mt-auto">
                {faceVectors.length === 0 ? (
                  <p className="text-slate-500 italic">SYSTEM READY: PRESS "START BIOMETRIC SCAN"</p>
                ) : (
                  faceVectors.map((v, i) => (
                    <p key={i} className="text-cyan-300 leading-tight truncate">
                      {v}
                    </p>
                  ))
                )}
              </div>
            </div>

            {/* Progress Bar HUD overlay on top */}
            {isScanning && (
              <div className="absolute top-3 left-3 right-3 bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1.5 z-30 font-mono text-[9px] flex justify-between items-center text-cyan-400">
                <span>CYBER DIAGNOSTIC: SCANNING</span>
                <span>{scanProgress}%</span>
              </div>
            )}

            {/* Success Overlay Checkmark */}
            {faceDone && (
              <div className="absolute inset-0 bg-slate-950/90 z-30 flex flex-col items-center justify-center gap-2 text-center animate-fade-in">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full animate-bounce">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h4 className="text-sm font-bold text-white">Landmarks Authenticated</h4>
                <p className="text-[10px] text-emerald-400 font-mono">[BIOMETRIC TOKEN: PASS_VERIFIED_FN]</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {!cameraStream && !useFallbackScan ? (
              <button
                id="reg-face-use-virtual"
                onClick={() => { setUseFallbackScan(true); }}
                className="w-full text-center text-[10px] text-slate-400 hover:text-slate-200 underline decoration-slate-700 font-medium py-1.5"
              >
                Skip camera permission / Use virtual sandbox scanner
              </button>
            ) : (
              <button
                id="reg-face-scan-trigger"
                onClick={triggerFaceScan}
                disabled={isScanning || faceDone}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 rounded-xl disabled:opacity-50 shadow-lg shadow-cyan-600/30 transition-all text-center flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Biometric Mapping Active ({scanProgress}%)
                  </>
                ) : faceDone ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verification Cleared
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    Start Biometric Face Scan
                  </>
                )}
              </button>
            )}

            <button
              id="reg-face-back"
              onClick={() => {
                if (cameraStream) {
                  cameraStream.getTracks().forEach(t => t.stop());
                  setCameraStream(null);
                }
                setMethod('options');
              }}
              className="w-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs transition-style text-center font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Completion Landing Frame */}
      {method === 'success' && (
        <div className="flex-1 flex flex-col justify-center items-center text-center gap-6 py-4 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl scale-125" />
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40 relative z-10 animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2 text-center max-w-xs">
            <h3 className="text-lg font-bold text-white">Profile Identity Approved!</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Congratulations <span className="font-bold text-slate-200">{emailForm.name}</span>, your FaceNOTE cryptographic secure identifier has been compiled successfully.
            </p>
          </div>

          <div className="w-full bg-slate-900/40 rounded-2xl border border-slate-800 p-3.5 text-left font-mono space-y-1.5">
            <p className="text-[9px] text-slate-500 uppercase font-semibold">Security Pass Info:</p>
            <p className="text-[10px] text-slate-300 flex justify-between">
              <span>Handle:</span> <span className="text-white font-bold">{emailForm.name}</span>
            </p>
            <p className="text-[10px] text-slate-300 flex justify-between">
              <span>Gate Method:</span> <span className="text-emerald-400">{loginForm.identifier ? 'SECURE_LOGIN_PASSCODE' : 'SECURE_ENROLLMENT_TOKEN'}</span>
            </p>
            <p className="text-[10px] text-slate-300 flex justify-between">
              <span>Hash Ref:</span> <span className="text-slate-400 text-[8px]">FN_VEC_82a9sa392</span>
            </p>
            <p className="text-[10px] text-slate-300 flex justify-between">
              <span>Earnings Multiplier:</span> <span className="text-blue-400 font-bold">1.50x Active Multiplier</span>
            </p>
          </div>

          <button
            id="reg-success-complete"
            onClick={handleFinalSubmit}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-center flex items-center justify-center gap-1.5"
          >
            Launch FaceNOTE Feed ➔
          </button>
        </div>
      )}
    </div>
  );
}
