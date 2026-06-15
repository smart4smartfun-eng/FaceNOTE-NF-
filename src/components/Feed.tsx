import React, { useState, useRef } from 'react';
import { Send, Image, Video as VideoIcon, Heart, MessageSquare, Flame, Sparkles, Share2, Eye, ShieldCheck, X, MapPin, Compass, Navigation, Info, Globe, Play, ExternalLink, ThumbsUp, Briefcase, Award, Plus, Trash2, Facebook, Instagram, Twitter, Linkedin, Check } from 'lucide-react';
import { Post, Story, User, Comment, WalletState } from '../types';
import SocialAdsHub, { AdPlatformConfig } from './SocialAdsHub';

interface MockSocialAd {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'Twitter' | 'LinkedIn';
  authorName: string;
  authorAvatar: string;
  content: string;
  mediaUrl: string;
  ctaText: string;
  tag: string;
  rewardUSD: number;
  rewardCoins: number;
  isVideo?: boolean;
}

const MOCK_SOCIAL_ADS: MockSocialAd[] = [
  {
    id: 'shad_fb_masterclass',
    platform: 'Facebook',
    authorName: 'MasterClass Sponsored',
    authorAvatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100',
    content: '🎓 Unleash your creativity. Learn screenwriting from Aaron Sorkin, scientific negotiation skills from Chris Voss, or gourmet cooking from Gordon Ramsay. Access 180+ courses. Access is limited so click below to claim your standard startup code today! 🌟',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-curry-being-prepared-in-a-gourmet-kitchen-39912-large.mp4',
    isVideo: true,
    ctaText: 'Learn More',
    tag: 'CPC $4.50',
    rewardUSD: 4.50,
    rewardCoins: 45
  },
  {
    id: 'shad_insta_airbnb',
    platform: 'Instagram',
    authorName: 'airbnb_destinations',
    authorAvatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100',
    content: '🌴 Secluded beach views, rustic forest retreats, or modern glass penthouses. Wherever you feel like heading, airbnb has a cozy, vetted host ready to hand over the keys. Find yours! #travelblogger #sunsetcoast',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-by-the-pool-looking-at-sea-view-40032-large.mp4',
    isVideo: true,
    ctaText: 'Book Now',
    tag: 'CTR 3.4%',
    rewardUSD: 6.80,
    rewardCoins: 68
  },
  {
    id: 'shad_tiktok_gymshark',
    platform: 'TikTok',
    authorName: 'gymshark_official',
    authorAvatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100',
    content: '🔥 Engineered with ultra-light fabrics, seamless breathable fits, and premium zero-frictional seams. The Gymshark Essential collection is made to survive your heaviest workouts. Tap "Shop Now" with code FACENOTE15 for checkout discount. 🏆🏋️ #gymshark',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-running-on-the-treadmill-34440-large.mp4',
    isVideo: true,
    ctaText: 'Shop Now',
    tag: 'CPM $7.25',
    rewardUSD: 7.25,
    rewardCoins: 85
  },
  {
    id: 'shad_twitter_openai',
    platform: 'Twitter',
    authorName: 'OpenAI Developer Hub',
    authorAvatar: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=100',
    content: '🤖 Streamline agent workflows natively. The new Google GenAI Node SDK provides fully async real-time tool calling routing, direct multimodal audio input, and low-latency system-instruction presets out of the box. ⚡ #OpenAI #BuildAgent',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-keyboard-typing-in-the-dark-866-large.mp4',
    isVideo: true,
    ctaText: 'Try API Now',
    tag: 'CPC $5.50',
    rewardUSD: 5.50,
    rewardCoins: 60
  },
  {
    id: 'shad_linkedin_google',
    platform: 'LinkedIn',
    authorName: 'Google Cloud Careers',
    authorAvatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100',
    content: '🚀 Google is expanding cloud engineering teams globally! We are seeking Senior Software Engineers & DevOps Architect Champions to scale multi-region server databases. Click to view open opportunities and salary ranges! #LifeAtGoogle',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    isVideo: true,
    ctaText: 'Apply Job',
    tag: 'CPM $8.40',
    rewardUSD: 8.40,
    rewardCoins: 100
  }
];


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
  onStartChat?: (authorName: string, authorAvatar?: string) => void;
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
  onUpdatePosts,
  onStartChat
}: FeedProps) {
  const [inputText, setInputText] = useState('');
  const [showAdsMonetizer, setShowAdsMonetizer] = useState(false);
  const [adConfig, setAdConfig] = useState<AdPlatformConfig>({
    facebookEnabled: true,
    instagramEnabled: true,
    tiktokEnabled: true,
    twitterEnabled: false,
    linkedinEnabled: false,
    density: 'medium'
  });
  const [claimedAds, setClaimedAds] = useState<Record<string, boolean>>({});
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

  // Geolocation and Reverse-Geocoding states
  const [isLocating, setIsLocating] = useState(false);
  const [postLocation, setPostLocation] = useState('');
  const [postLat, setPostLat] = useState<number | undefined>(undefined);
  const [postLng, setPostLng] = useState<number | undefined>(undefined);
  const [showLocationList, setShowLocationList] = useState(false);
  const [locErr, setLocErr] = useState('');

  // Primary User identification state for Feed banner identification
  const [userLocName, setUserLocName] = useState<string>('Silicon Valley, CA');
  const [userLat, setUserLat] = useState<number>(37.4220); // Google HQ near lat
  const [userLng, setUserLng] = useState<number>(-122.0841); // Google HQ near lng
  const [isRefreshingUserLoc, setIsRefreshingUserLoc] = useState(false);

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

  const POPULAR_PLACES = [
    { name: '🗼 Shibuya Crossing, Tokyo', lat: 35.6595, lng: 139.7005 },
    { name: '🗽 Times Square, New York', lat: 40.7580, lng: -73.9855 },
    { name: '🎡 London Eye, London', lat: 51.5033, lng: -0.1195 },
    { name: '🌋 Silicon Valley Tech Campus', lat: 37.4220, lng: -122.0841 },
    { name: '🌊 Bondi Beach, Sydney', lat: -33.8915, lng: 151.2767 },
    { name: '☕ Starbucks Reserve, Seattle', lat: 47.6140, lng: -122.3270 }
  ];

  const getDistanceKM = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocateUser = () => {
    setIsRefreshingUserLoc(true);
    setLocErr('');
    if (!navigator.geolocation) {
      setLocErr('Geolocation is not supported by your browser.');
      setIsRefreshingUserLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLat(latitude);
        setUserLng(longitude);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'FaceNoteHub/1.0'
            }
          });
          const data = await res.json();
          if (data && data.display_name) {
            const address = data.address;
            const city = address.city || address.town || address.village || address.suburb || 'Selected Location';
            const state = address.state || address.country || '';
            setUserLocName(`${city}, ${state}`.trim().slice(0, 36));
            onTriggerFloatingDollar('📍 LOCATED VIA GPS');
          } else {
            setUserLocName(`${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);
          }
        } catch (e) {
          console.error(e);
          setUserLocName(`${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);
        } finally {
          setIsRefreshingUserLoc(false);
        }
      },
      (err) => {
        console.warn('Geolocation failed inside secure sandboxed container:', err.message);
        setLocErr('Iframe sandbox security blocked direct GPS. Please check selection below.');
        setIsRefreshingUserLoc(false);
        setShowLocationList(true);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleLocatePost = () => {
    setIsLocating(true);
    setLocErr('');
    if (!navigator.geolocation) {
      setLocErr('Geolocation not available.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setPostLat(latitude);
        setPostLng(longitude);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'FaceNoteHub/1.0'
            }
          });
          const data = await res.json();
          if (data && data.display_name) {
            const address = data.address;
            const road = address.road || '';
            const amenity = address.amenity || address.shop || address.tourism || '';
            const city = address.city || address.town || address.suburb || 'Local area';
            
            let label = amenity ? `${amenity}, ` : '';
            if (road && !label.includes(road)) label += `${road}, `;
            label += city;

            setPostLocation(label.trim().slice(0, 42));
          } else {
            setPostLocation(`${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);
          }
        } catch (e) {
          setPostLocation(`${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Post GPS permission blocked:', err.message);
        setLocErr('GPS access blocked by sandbox. Choose a landmark or type manually below.');
        setIsLocating(false);
        setShowLocationList(true);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
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
      unlockedByMe: isGatingEnabled ? true : undefined,
      location: postLocation || undefined,
      latitude: postLat,
      longitude: postLng
    };

    onAddPost(newPost);
    setInputText('');
    setIsGatingEnabled(false);
    setGatingPriceInput('0.99');
    setPostLocation('');
    setPostLat(undefined);
    setPostLng(undefined);
    setShowLocationList(false);
    setLocErr('');
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

  const handleClaimAdProfit = (ad: MockSocialAd) => {
    if (claimedAds[ad.id]) return;
    
    // Set ad ID as claimed so they don't click it again
    setClaimedAds(prev => ({ ...prev, [ad.id]: true }));

    // Calculate profit
    const finalRevenue = +(ad.rewardUSD * wallet.adDensityMultiplier).toFixed(2);
    const finalCoins = Math.round(ad.rewardCoins * wallet.adDensityMultiplier);

    // Update wallet
    onUpdateWallet(prev => {
      // Update stats inside localstorage as well for social suite consistency
      const statsSaved = localStorage.getItem('facenote_ad_stats');
      if (statsSaved) {
        try {
          const statsObj = JSON.parse(statsSaved);
          statsObj.clicks += 1;
          statsObj.earnings = +(statsObj.earnings + finalRevenue).toFixed(2);
          localStorage.setItem('facenote_ad_stats', JSON.stringify(statsObj));
        } catch (e) {}
      }

      return {
        ...prev,
        balanceUSD: +(prev.balanceUSD + finalRevenue).toFixed(2),
        fnCoins: prev.fnCoins + finalCoins
      };
    });

    onTriggerFloatingDollar(`+$${finalRevenue.toFixed(2)} ${ad.platform} Ad Payout!`);
  };

  // Filter active mock social ads based on what networks are enabled in adConfig
  const activeSocialAds = MOCK_SOCIAL_ADS.filter(ad => {
    if (ad.platform === 'Facebook') return adConfig.facebookEnabled;
    if (ad.platform === 'Instagram') return adConfig.instagramEnabled;
    if (ad.platform === 'TikTok') return adConfig.tiktokEnabled;
    if (ad.platform === 'Twitter') return adConfig.twitterEnabled;
    if (ad.platform === 'LinkedIn') return adConfig.linkedinEnabled;
    return false;
  });

  const renderList: (
    | { type: 'post'; data: Post }
    | { type: 'socialAd'; data: MockSocialAd }
  )[] = [];

  let adInterval = 3;
  if (adConfig.density === 'low') adInterval = 5;
  if (adConfig.density === 'high') adInterval = 2;
  if (adConfig.density === 'extreme') adInterval = 1;

  let adIdx = 0;
  posts.forEach((post, i) => {
    renderList.push({ type: 'post', data: post });
    if (activeSocialAds.length > 0 && (i + 1) % adInterval === 0) {
      const selectedAd = activeSocialAds[adIdx % activeSocialAds.length];
      renderList.push({ type: 'socialAd', data: selectedAd });
      adIdx++;
    }
  });

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

      {/* Geospace & Coordinates Tracker Hub */}
      <div className="mx-4 mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg relative overflow-hidden">
        {/* Subtle radial atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/15 border border-blue-500/35 text-blue-400 rounded-xl">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </span>
            <div>
              <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider">FaceNOTE Geospace Tracker</h3>
              <p className="text-[9px] text-slate-500 font-semibold">Sat-GPS Satellite Location Telemetry</p>
            </div>
          </div>
          <button
            id="gps-scan-recalculate"
            type="button"
            onClick={handleLocateUser}
            disabled={isRefreshingUserLoc}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-[9.5px] px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-md shadow-blue-600/10"
          >
            <Navigation className={`w-3 h-3 ${isRefreshingUserLoc ? 'animate-bounce' : ''}`} />
            {isRefreshingUserLoc ? 'Scanning...' : 'Identify GPS'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 relative z-10">
          {/* Identified Position detail */}
          <div className="space-y-1.5">
            <span className="text-[8.5px] text-slate-500 font-extrabold uppercase tracking-widest block">Landmark / Country Point</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-[11px] text-slate-200 font-bold leading-tight truncate max-w-[190px]">
                  {userLocName}
                </p>
                <code className="text-[8.5px] text-slate-500 font-mono block mt-1 bg-slate-950 px-1 py-0.5 rounded border border-slate-850 w-fit">
                  LAT: {userLat.toFixed(4)}° / LNG: {userLng.toFixed(4)}°
                </code>
              </div>
            </div>
            
            {/* Quick-Change GPS Teleport Sandbox selector */}
            <div className="pt-1.5 pb-0.5">
              <label className="text-[8.5px] text-slate-600 font-extrabold uppercase tracking-widest block mb-1">Sandbox Teleport Simulation:</label>
              <div className="flex flex-wrap gap-1">
                {POPULAR_PLACES.map((place) => (
                  <button
                    key={place.name}
                    id={`teleport-city-${place.name.replace(/\s+/g, '-').toLowerCase()}`}
                    type="button"
                    onClick={() => {
                      setUserLocName(place.name.replace(/[🗼🗽🎡🌋🌊☕]\s+/, ''));
                      setUserLat(place.lat);
                      setUserLng(place.lng);
                      onTriggerFloatingDollar(`📍 Teleported to ${place.name.split(',')[0]}!`);
                    }}
                    className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-400 hover:text-white rounded px-1.5 py-0.5 text-[8px] transition-all cursor-pointer font-bold leading-none"
                  >
                    {place.name.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Haversine distance tracking and mock compass needle visual */}
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between gap-1.5">
            <div className="space-y-1">
              <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-widest block">Geodesic Telemetry</span>
              <p className="text-[9.5px] text-slate-400 font-medium leading-none">
                Distance to <span className="text-blue-400">Valley Server</span>:
              </p>
              <p className="text-xs font-black text-emerald-400 font-mono">
                {getDistanceKM(userLat, userLng, 37.4220, -122.0841).toLocaleString(undefined, { maximumFractionDigits: 1 })} km
              </p>
              <span className="text-[8.5px] text-slate-500 block leading-tight">
                Directional Bearing: <span className="text-slate-350 font-bold">{-Math.round((userLng + 122.0841) * 0.8) % 360}° NW</span>
              </span>
            </div>
            
            {/* Visual compass ring */}
            <div className="w-11 h-11 rounded-full border border-slate-850 bg-slate-950 flex items-center justify-center relative shrink-0 shadow-inner select-none">
              <span className="absolute text-[6px] text-slate-650 top-0.5 font-extrabold">N</span>
              <span className="absolute text-[6px] text-slate-650 bottom-0.5 font-extrabold">S</span>
              {/* Spinning needle */}
              <div 
                className="w-0.5 h-6 bg-gradient-to-t from-transparent via-rose-500 to-rose-600 rounded-full transition-transform duration-700"
                style={{ transform: `rotate(${-Math.round((userLng + 122) * 2.2) % 360}deg)` }}
              />
              <div className="absolute w-1 h-1 bg-slate-200 rounded-full" />
            </div>
          </div>
        </div>

        {locErr && (
          <p className="text-[9px] text-amber-500/90 bg-amber-500/5 border border-amber-500/15 p-2 rounded-xl font-medium leading-normal flex items-start gap-1 relative z-10 animate-fade-in">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{locErr}</span>
          </p>
        )}
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

        {/* Selected Location Pill Display */}
        {postLocation && (
          <div className="bg-slate-950/50 border border-slate-850 p-2.5 rounded-xl flex items-center justify-between text-[10.5px] animate-fade-in">
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0 animate-pulse" />
              <span>Checked in: <span className="text-white font-bold">{postLocation}</span></span>
              {postLat && <span className="text-[9.5px] font-mono text-slate-500">({postLat.toFixed(3)}, {postLng?.toFixed(3)})</span>}
            </span>
            <button
              type="button"
              onClick={() => {
                setPostLocation('');
                setPostLat(undefined);
                setPostLng(undefined);
              }}
              className="text-slate-500 hover:text-white font-bold text-xs px-1.5 hover:bg-slate-900 rounded"
              title="Clear attached location"
            >
              ✕
            </button>
          </div>
        )}

        {isLocating && (
          <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850 text-center text-slate-400 text-[10px] flex items-center justify-center gap-2 font-medium">
            <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            📡 Contacting satellites... identifying geographic location...
          </div>
        )}

        {/* Popular check-in select picker */}
        {showLocationList && (
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 space-y-2.5 animate-fade-in text-left">
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 animate-spin-slow" />
                GPS Landmark Sandbox Select
              </span>
              <button
                type="button"
                onClick={() => setShowLocationList(false)}
                className="text-[9px] text-slate-500 hover:text-white font-bold"
              >
                ✕ Close
              </button>
            </div>
            
            {locErr && (
              <p className="text-[9px] text-amber-500 bg-amber-500/5 border border-amber-500/15 p-1.5 rounded leading-relaxed font-semibold">
                ⚠️ {locErr}
              </p>
            )}

            {/* Custom address manual input */}
            <div className="space-y-1">
              <label className="text-[8.5px] text-slate-500 font-bold uppercase block">Enter Custom Address / Landmark:</label>
              <input
                id="geo-manual-address-input"
                type="text"
                placeholder="Starbucks, Paris, Central Park..."
                className="w-full bg-slate-900 border border-slate-850 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
                value={postLocation}
                onChange={e => {
                  setPostLocation(e.target.value);
                  if (!postLat) {
                    setPostLat(37.7749 + Math.random() * 0.1);
                    setPostLng(-122.4194 - Math.random() * 0.1);
                  }
                }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8.5px] text-slate-500 font-bold uppercase block">Or Fast Check-In nearby places:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {POPULAR_PLACES.map((place) => (
                  <button
                    key={place.name}
                    type="button"
                    onClick={() => {
                      setPostLocation(place.name.replace(/[🗼🗽🎡🌋🌊☕]\s+/, ''));
                      setPostLat(place.lat);
                      setPostLng(place.lng);
                      setShowLocationList(false);
                      onTriggerFloatingDollar('📍 Sandbox landmark tagged!');
                    }}
                    className="text-left bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg p-1.5 text-[9.5px] text-slate-300 hover:text-white transition-all truncate cursor-pointer"
                  >
                    {place.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions bar for file trigger triggers */}
        <div className="flex items-center justify-between border-t border-slate-950 pt-3">
          <div className="flex gap-2 flex-wrap">
            <button
              id="feed-upload-image"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg border border-slate-850 text-[10.5px] transition-all font-semibold"
            >
              <Image className="w-3.5 h-3.5 text-emerald-400" />
              Photo
            </button>
            <button
              id="feed-upload-video"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg border border-slate-850 text-[10.5px] transition-all font-semibold"
            >
              <VideoIcon className="w-3.5 h-3.5 text-blue-400" />
              Video Clip
            </button>
            <button
              id="feed-upload-location"
              type="button"
              onClick={handleLocatePost}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg border border-slate-850 text-[10.5px] transition-all font-semibold"
              title="Detect physical location using satellite telemetry GPS"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              Check In
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

      {/* Active Social Ads Monetisation Suite banner */}
      <div className="mx-4 mb-4 bg-gradient-to-r from-emerald-950/45 via-blue-950/45 to-slate-900 border border-emerald-500/15 rounded-2xl p-3.5 space-y-3 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-bold flex items-center justify-center text-sm animate-pulse">
              🪙
            </span>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider flex items-center gap-1">
                Social Ads Ad-Revenue Core
              </h4>
              <p className="text-[10px] text-zinc-400 font-medium">
                Monetization active • <span className="text-emerald-400 font-bold">{(wallet.adDensityMultiplier).toFixed(1)}x yield booster</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAdsMonetizer(!showAdsMonetizer)}
            className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] px-3 py-1.5 rounded-xl transition-all shadow-md shadow-blue-600/10 active:scale-95 cursor-pointer leading-none"
          >
            {showAdsMonetizer ? 'Hide Control Panel' : 'Expand Setup Config'}
          </button>
        </div>

        {showAdsMonetizer && (
          <div className="mt-1 pb-1 border-t border-slate-800 pt-3">
            <SocialAdsHub
              wallet={wallet}
              onUpdateWallet={onUpdateWallet}
              onTriggerFloatingDollar={onTriggerFloatingDollar}
              onAdConfigChange={(c) => setAdConfig(c)}
            />
          </div>
        )}
      </div>

      {/* Main Feed Posts & Integrated Social Ads List */}
      <div className="space-y-4 px-4 pb-4">
        {renderList.map((item, idx) => {
          if (item.type === 'socialAd') {
            const ad = item.data;
            const isClaimed = claimedAds[ad.id];
            
            // Design colors and icons based on the ad provider channel
            let platColor = 'bg-blue-600';
            let platBadge = 'Facebook Sponsor';
            let platIcon = <Facebook className="w-3.5 h-3.5" />;
            let platBorder = 'border-blue-500/20';

            if (ad.platform === 'Instagram') {
              platColor = 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600';
              platBadge = 'Instagram Carousel';
              platIcon = <Instagram className="w-3.5 h-3.5" />;
              platBorder = 'border-pink-500/20';
            } else if (ad.platform === 'TikTok') {
              platColor = 'bg-slate-950';
              platBadge = 'TikTok Spark Ad';
              platIcon = <Play className="w-3.5 h-3.5 text-teal-400" />;
              platBorder = 'border-teal-500/25';
            } else if (ad.platform === 'Twitter') {
              platColor = 'bg-zinc-950';
              platBadge = 'Twitter / X Promoted';
              platIcon = <Twitter className="w-3.5 h-3.5 text-slate-300" />;
              platBorder = 'border-slate-800';
            } else if (ad.platform === 'LinkedIn') {
              platColor = 'bg-blue-800';
              platBadge = 'LinkedIn Enterprise';
              platIcon = <Linkedin className="w-3.5 h-3.5" />;
              platBorder = 'border-blue-700/20';
            }

            return (
              <div 
                key={`ad-item-${ad.id}-${idx}`} 
                className={`bg-slate-900 border-2 ${isClaimed ? 'border-emerald-500/30' : platBorder} rounded-2xl p-4 space-y-3.5 shadow-lg relative overflow-hidden`}
              >
                {/* Visual highlight aura */}
                <div className={`absolute -top-12 -right-12 w-28 h-28 ${isClaimed ? 'bg-emerald-500/5' : 'bg-blue-500/5'} rounded-full blur-2xl pointer-events-none`} />

                {/* Ad Header */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={ad.authorAvatar}
                      alt={ad.authorName}
                      className="w-8.5 h-8.5 rounded-full object-cover border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1">
                        <span>{ad.authorName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      </h4>
                      <p className="text-[8px] text-zinc-500 font-extrabold uppercase tracking-wide flex items-center gap-1">
                        {platIcon} {platBadge}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[8.5px] font-mono font-black ${isClaimed ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'} px-2 py-0.5 rounded-full inline-flex items-center gap-1`}>
                    <Sparkles className="w-2.5 h-2.5" /> 
                    {isClaimed ? 'REWARD SETTLED' : `BOOST +${(ad.rewardUSD * wallet.adDensityMultiplier).toFixed(2)} USD`}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-300 leading-normal text-left">
                  {ad.content}
                </p>

                {/* Graphic Banner */}
                <div className="rounded-xl overflow-hidden border border-slate-950 max-h-[220px] relative group select-none bg-slate-950">
                  {ad.isVideo ? (
                    <video
                      src={ad.mediaUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full min-h-[170px] max-h-[225px] object-cover group-hover:scale-101 duration-300"
                    />
                  ) : (
                    <img
                      src={ad.mediaUrl}
                      alt="Sponsor visual"
                      className="w-full h-full object-cover group-hover:scale-101 duration-300"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {/* Subtle platform watermark */}
                  <div className="absolute bottom-2 left-2 bg-slate-950/85 px-2.5 py-1.5 rounded-lg border border-slate-850 flex items-center gap-1.5 text-[8.5px] font-bold text-slate-300 shadow bg-slate-950/90 gap-1 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block shrink-0" />
                    <span>{ad.platform} Live Ad {ad.isVideo ? 'Stream' : 'Service'}</span>
                  </div>

                  {/* Dynamic hovering action button simulated over image */}
                  <div className="absolute inset-0 bg-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-blue-600 text-white font-extrabold text-[10.5px] px-4 py-2 rounded-xl shadow-lg flex items-center gap-1 text-[10px]">
                      {ad.ctaText} <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Interface buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between border-t border-slate-950 pt-3">
                  <div className="flex items-center gap-2.5 text-[9px] text-slate-500 font-bold font-mono">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Est. CPM: <span className="text-slate-300">{(ad.rewardUSD * wallet.adDensityMultiplier * 1000).toFixed(0)}</span>
                    </span>
                    <span>•</span>
                    <span className="text-zinc-500">Tag: {ad.tag}</span>
                  </div>

                  {isClaimed ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl w-full sm:w-auto justify-center select-none animate-pulse">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Earnings Credited
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleClaimAdProfit(ad)}
                      className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white shadow-md active:scale-97 cursor-pointer transition-all ${platColor} hover:brightness-110`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 shrink-0" />
                      Engage & Claim +${(ad.rewardUSD * wallet.adDensityMultiplier).toFixed(2)} USD
                    </button>
                  )}
                </div>

              </div>
            );
          }

          // Render normal post
          const post = item.data;
          return (
          <div key={post.id} className={`bg-slate-900 border ${post.isSponsored ? 'border-amber-500/30 ring-1 ring-amber-500/15' : 'border-slate-800'} rounded-2xl p-4 space-y-3.5 shadow-md relative`}>
            
            {/* Sponsored Badge Indicator inside Ad space container */}
            {post.isSponsored && (
              <span className="absolute top-4 right-4 bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[8px] font-bold font-mono px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AD UNIT CPM +$0.10
              </span>
            )}

            {/* Profile Header */}
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2.5 items-center">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1 flex-wrap">
                    <span>{post.authorName}</span>
                    {!post.isSponsored && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 cursor-pointer inline shrink-0" />}
                    {post.location && (
                      <span className="text-[8.5px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 ml-1 leading-none select-none">
                        <MapPin className="w-2.5 h-2.5" />
                        {post.location}
                      </span>
                    )}
                  </h4>
                  <p className="text-[9.5px] text-slate-500">{post.timestamp}</p>
                </div>
              </div>

              {!post.isSponsored && user.name !== post.authorName && onStartChat && (
                <button
                  id={`chat-post-author-${post.id}`}
                  onClick={() => onStartChat(post.authorName, post.authorAvatar)}
                  className="bg-slate-950 hover:bg-slate-800 text-blue-400 hover:text-blue-300 border border-slate-850 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 active:scale-95 shadow-sm"
                  title={`Start secure P2P chat with ${post.authorName}`}
                >
                  💬 Message
                </button>
              )}
            </div>

            {/* Post Content */}
            <p className="text-xs text-slate-300 leading-normal font-sans text-left">
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
          );
        })}
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
