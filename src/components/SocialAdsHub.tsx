import React, { useState, useEffect } from 'react';
import { 
  Globe, Sparkles, TrendingUp, DollarSign, Facebook, Instagram, Twitter, 
  Linkedin, Play, Award, Eye, Shield, RefreshCw, Check, CheckCircle2, 
  Tv, Zap, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { WalletState } from '../types';

interface SocialAdsHubProps {
  wallet: WalletState;
  onUpdateWallet: (updater: (prev: WalletState) => WalletState) => void;
  onTriggerFloatingDollar: (label: string) => void;
  onAdConfigChange: (config: AdPlatformConfig) => void;
}

export interface AdPlatformConfig {
  facebookEnabled: boolean;
  instagramEnabled: boolean;
  tiktokEnabled: boolean;
  twitterEnabled: boolean;
  linkedinEnabled: boolean;
  density: 'low' | 'medium' | 'high' | 'extreme';
}

export default function SocialAdsHub({ 
  wallet, 
  onUpdateWallet, 
  onTriggerFloatingDollar,
  onAdConfigChange
}: SocialAdsHubProps) {
  // Load initial settings
  const [config, setConfig] = useState<AdPlatformConfig>(() => {
    const saved = localStorage.getItem('facenote_ad_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      facebookEnabled: true,
      instagramEnabled: true,
      tiktokEnabled: true,
      twitterEnabled: false,
      linkedinEnabled: false,
      density: 'medium'
    };
  });

  const [adStats, setAdStats] = useState({
    impressions: 142,
    clicks: 18,
    earnings: 3.45,
    ctr: 12.6
  });

  // Watch to earn video state
  const [watchAdActive, setWatchAdActive] = useState(false);
  const [activeWatchPlatform, setActiveWatchPlatform] = useState<'TikTok' | 'Instagram' | 'Facebook' | 'YouTube'>('TikTok');
  const [countdown, setCountdown] = useState(5);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // Auto-sync config to parent
  useEffect(() => {
    localStorage.setItem('facenote_ad_config', JSON.stringify(config));
    onAdConfigChange(config);
  }, [config, onAdConfigChange]);

  // Load accumulated stats or randomize slightly to look alive
  useEffect(() => {
    const saved = localStorage.getItem('facenote_ad_stats');
    if (saved) {
      try { setAdStats(JSON.parse(saved)); } catch (e) {}
    } else {
      const stats = {
        impressions: Math.floor(100 + Math.random() * 200),
        clicks: Math.floor(10 + Math.random() * 25),
        earnings: +(5.50 + Math.random() * 4).toFixed(2),
        ctr: 11.4
      };
      setAdStats(stats);
      localStorage.setItem('facenote_ad_stats', JSON.stringify(stats));
    }
  }, []);

  const handleTogglePlatform = (platform: keyof AdPlatformConfig) => {
    setConfig(prev => {
      const updated = {
        ...prev,
        [platform]: !prev[platform]
      };
      return updated;
    });
  };

  const handleChangeDensity = (density: AdPlatformConfig['density']) => {
    setConfig(prev => ({ ...prev, density }));
    
    let multiplier = 1.0;
    if (density === 'low') multiplier = 0.5;
    if (density === 'medium') multiplier = 1.2;
    if (density === 'high') multiplier = 2.5;
    if (density === 'extreme') multiplier = 5.0;

    onUpdateWallet(prev => ({
      ...prev,
      adDensityMultiplier: multiplier
    }));

    onTriggerFloatingDollar(`📡 AD DENSITY: ${density.toUpperCase()}`);
  };

  const triggerWatchAd = (platform: 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube') => {
    if (watchAdActive) return;
    setActiveWatchPlatform(platform);
    setWatchAdActive(true);
    setCountdown(5);
    setRewardClaimed(false);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClaimReward = () => {
    if (countdown > 0 || rewardClaimed) return;
    setRewardClaimed(true);

    const bonusUSD = +(4.50 + Math.random() * 4.00).toFixed(2);
    const bonusCoins = Math.floor(45 + Math.random() * 35);

    onUpdateWallet(prev => ({
      ...prev,
      balanceUSD: +(prev.balanceUSD + bonusUSD).toFixed(2),
      fnCoins: prev.fnCoins + bonusCoins
    }));

    // Save local statistics
    setAdStats(prev => {
      const updated = {
        ...prev,
        impressions: prev.impressions + 1,
        clicks: prev.clicks + 1,
        earnings: +(prev.earnings + bonusUSD).toFixed(2),
        ctr: +(((prev.clicks + 1) / (prev.impressions + 1)) * 100).toFixed(1)
      };
      localStorage.setItem('facenote_ad_stats', JSON.stringify(updated));
      return updated;
    });

    onTriggerFloatingDollar(`+$${bonusUSD} Payout Cleared!`);
    
    setTimeout(() => {
      setWatchAdActive(false);
      setRewardClaimed(false);
    }, 1500);
  };

  // Predefined platforms metadata
  const platforms_info = [
    { 
      key: 'facebookEnabled' as const, 
      label: 'Facebook Sponsor Core', 
      desc: 'Native post wrappers & site linkouts', 
      icon: <Facebook className="w-4 h-4 text-blue-500" />,
      tag: 'CPC $4.50' 
    },
    { 
      key: 'instagramEnabled' as const, 
      label: 'Instagram Carousel Feed', 
      desc: 'Elegant sliding picture promotions', 
      icon: <Instagram className="w-4 h-4 text-pink-500" />,
      tag: 'CTR $6.80' 
    },
    { 
      key: 'tiktokEnabled' as const, 
      label: 'TikTok Video Spark Ads', 
      desc: 'Auto-playing interactive product clips', 
      icon: <Play className="w-4 h-4 text-teal-400 fill-teal-400" />,
      tag: 'CPM $7.25' 
    },
    { 
      key: 'twitterEnabled' as const, 
      label: 'Twitter / X Promoted Trends', 
      desc: 'High-frequency short professional trends', 
      icon: <Twitter className="w-4 h-4 text-slate-300" />,
      tag: 'CPC $5.50' 
    },
    { 
      key: 'linkedinEnabled' as const, 
      label: 'LinkedIn Executive Career Talent', 
      desc: 'Promoted enterprise jobs & connections', 
      icon: <Linkedin className="w-4 h-4 text-blue-600" />,
      tag: 'CPM $8.40' 
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 space-y-4 shadow-xl text-left relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Header Grid */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 rounded-xl relative">
            <Globe className="w-4.5 h-4.5 animate-spin-slow text-blue-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </span>
          <div>
            <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
              Social Ad Monetization Suite
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </h3>
            <p className="text-[9px] text-zinc-500 font-bold">Earn passive dollars for each social ad placement served</p>
          </div>
        </div>

        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <Zap className="w-3 h-3 text-emerald-400 animate-pulse" /> CPM Active
        </span>
      </div>

      {/* Real-time statistics readout */}
      <div className="grid grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
        <div className="text-center space-y-0.5">
          <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Served Ads</span>
          <span className="text-xs font-mono font-black text-slate-200">
            {adStats.impressions}
          </span>
        </div>
        <div className="text-center space-y-0.5">
          <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Ad Clicks</span>
          <span className="text-xs font-mono font-black text-slate-200">
            {adStats.clicks}
          </span>
        </div>
        <div className="text-center space-y-0.5">
          <span className="text-[8px] text-slate-500 font-extrabold uppercase block tracking-wider">Avg CTR</span>
          <span className="text-xs font-mono font-black text-blue-400">
            {adStats.ctr}%
          </span>
        </div>
        <div className="text-center space-y-0.5 bg-blue-950/20 rounded-lg p-0.5 border border-blue-500/10">
          <span className="text-[8px] text-blue-400 font-extrabold uppercase block tracking-wider">My Profit</span>
          <span className="text-xs font-mono font-black text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-2.5 h-2.5 -mr-0.5 text-emerald-400" />{(wallet.balanceUSD).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Watch and Earn Instant Simulator */}
      {watchAdActive ? (
        <div className="bg-slate-950 border border-amber-500/20 p-3 rounded-xl space-y-2.5 animate-fade-in relative">
          <div className="flex justify-between items-center">
            <span className="text-[8.5px] uppercase font-black text-amber-400 font-mono flex items-center gap-1">
              <Tv className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Video Ad Streaming Sandbox
            </span>
            <span className="text-[10px] font-bold font-mono text-zinc-400">
              Platform: <span className="text-white font-extrabold">{activeWatchPlatform} Ad</span>
            </span>
          </div>

          <div className="h-36 bg-slate-950 rounded-xl border border-slate-850 relative overflow-hidden">
            {/* Real video playback tag matching platform! */}
            <video
              src={
                activeWatchPlatform === 'TikTok' 
                  ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  : activeWatchPlatform === 'Instagram'
                  ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                  : activeWatchPlatform === 'Facebook'
                  ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
                  : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
              }
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-full object-cover opacity-80"
            />
            
            {/* Dark glass overlay for stats readout during watch */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col justify-between p-3 text-left select-none">
              <div className="flex justify-between items-center">
                <span className="text-[8px] bg-red-600 border border-red-500/25 text-white font-black font-mono uppercase px-1.5 py-0.5 rounded animate-pulse">
                  ● Live Ad Stream
                </span>
                <span className="text-[9px] font-bold text-slate-400">
                  Buffer: <span className="text-emerald-400 font-mono font-bold">100%</span>
                </span>
              </div>

              {countdown > 0 ? (
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-white ml-0.5">Streaming real high-yield sponsored offer...</p>
                  <p className="text-[9.5px] text-zinc-300">Reward unlocks in <span className="text-emerald-400 font-mono font-bold bg-slate-950/80 border border-slate-800 px-1 py-0.5 rounded ml-0.5">{countdown}s</span></p>
                </div>
              ) : (
                <div className="space-y-0.5 animate-fade-in">
                  <p className="text-xs font-black text-emerald-400 flex items-center gap-1">
                    ✓ Video Verification Successful!
                  </p>
                  <p className="text-[9px] text-slate-200">The ad profit is ready to be credited to your real wallet balance.</p>
                </div>
              )}
            </div>

            {/* Simulated progress tracker */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000" 
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>

          {countdown === 0 && !rewardClaimed ? (
            <button
              onClick={handleClaimReward}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl text-xs transition-all cursor-pointer select-none active:scale-98 shadow-md flex items-center justify-center gap-1.5 animate-pulse"
            >
              <span>🎁</span>
              <span>Claim Real Payout Reward & Coins!</span>
            </button>
          ) : countdown > 0 ? (
            <div className="w-full bg-slate-900 border border-slate-850 h-8 rounded-xl flex items-center justify-center text-[10px] text-slate-500 font-semibold italic">
              Please watch advertisement to qualify for payout...
            </div>
          ) : (
            <div className="w-full bg-emerald-950/25 text-emerald-400 border border-emerald-900/30 h-8 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-wider animate-pulse">
              Transferring payout payload... OK
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[8.5px] uppercase font-bold text-slate-500 tracking-wider">Watch-to-Earn Ad Placement Sandbox:</span>
            <span className="text-[8px] font-mono text-zinc-600">Active pool: 4 networks</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'TikTok Video', icon: <Play className="w-3.5 h-3.5 text-teal-400 shrink-0" />, plat: 'TikTok' as const },
              { label: 'Insta Reels', icon: <Instagram className="w-3.5 h-3.5 text-pink-500 shrink-0" />, plat: 'Instagram' as const },
              { label: 'FB Watch', icon: <Facebook className="w-3.5 h-3.5 text-blue-500 shrink-0" />, plat: 'Facebook' as const },
              { label: 'YT Shorts', icon: <Tv className="w-3.5 h-3.5 text-rose-500 shrink-0" />, plat: 'YouTube' as const }
            ].map(v => (
              <button
                key={v.label}
                onClick={() => triggerWatchAd(v.plat)}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-850 p-2 rounded-xl text-center space-y-1 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center group"
              >
                <div className="p-1 bg-slate-900 rounded-lg group-hover:scale-105 transition-transform">
                  {v.icon}
                </div>
                <span className="text-[8px] font-bold text-slate-400 block truncate w-full">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Choose active ad provider channels */}
      <div className="space-y-2">
        <span className="text-[8.5px] uppercase font-bold text-slate-500 tracking-wider block">Activate Social Feeder Channels:</span>
        <div className="space-y-1.5">
          {platforms_info.map(plat => {
            const isEnabled = config[plat.key];
            return (
              <div 
                key={plat.key} 
                onClick={() => handleTogglePlatform(plat.key)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                  isEnabled 
                    ? 'bg-slate-950 border-blue-500/20 hover:bg-slate-900' 
                    : 'bg-slate-950/40 border-slate-900 hover:bg-slate-950 text-slate-550'
                }`}
              >
                <div className="flex gap-2 items-center min-w-0">
                  <div className={`p-1.5 rounded-lg ${isEnabled ? 'bg-slate-900 border border-slate-800' : 'bg-slate-950 border border-slate-950 opacity-40'}`}>
                    {plat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10.5px] font-bold leading-none ${isEnabled ? 'text-white' : 'text-slate-500'}`}>
                      {plat.label}
                    </p>
                    <p className="text-[8px] text-zinc-500 truncate leading-tight mt-0.5">{plat.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-mono leading-none font-bold px-1.5 py-0.5 rounded ${isEnabled ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' : 'bg-slate-900 text-slate-650'}`}>
                    {plat.tag}
                  </span>
                  
                  {/* Digital toggle key */}
                  <div className={`w-7 h-4 rounded-full transition-colors relative ${isEnabled ? 'bg-blue-600' : 'bg-slate-800'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ad delivery Density / Frequency select picker */}
      <div className="space-y-2 border-t border-slate-800 pt-3">
        <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Ad Feed Density (Frequency Multiplier)</span>
          <span className="text-amber-500 font-mono font-bold flex items-center gap-0.5">
            Rate: {wallet.adDensityMultiplier.toFixed(1)}x Profit Booster
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {[
            { id: 'low' as const, label: 'Low', desc: '1 Ad per 5 posts', mult: '0.5x' },
            { id: 'medium' as const, label: 'Med', desc: '1 Ad per 3 posts', mult: '1.2x' },
            { id: 'high' as const, label: 'High', desc: '1 Ad per 2 posts', mult: '2.5x' },
            { id: 'extreme' as const, label: 'Max', desc: '1 Ad per post', mult: '5.0x' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => handleChangeDensity(d.id)}
              className={`py-1.5 px-1 rounded-xl border text-[10.5px] font-black transition-all cursor-pointer ${
                config.density === d.id 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/10 scale-102' 
                  : 'bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-400'
              }`}
            >
              <div>{d.label}</div>
              <div className="text-[7.5px] font-mono opacity-80 mt-0.5">{d.mult}</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
