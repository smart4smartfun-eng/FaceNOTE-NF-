import React, { useState, useEffect } from 'react';
import { DollarSign, Cpu, TrendingUp, RefreshCw, Layers, ArrowUpRight, Send, Coins, Shield } from 'lucide-react';
import { WalletState, WithdrawalRecord } from '../types';
import PaymentMentor from './PaymentMentor';

interface WalletDashboardProps {
  wallet: WalletState;
  onUpdateWallet: (updater: (prev: WalletState) => WalletState) => void;
  onTriggerFloatingDollar: (label?: string) => void;
}


export default function WalletDashboard({ wallet, onUpdateWallet, onTriggerFloatingDollar }: WalletDashboardProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('50');
  const [withdrawMethod, setWithdrawMethod] = useState<'PayPal' | 'Bank Transfer' | 'Crypto (Solana/USDT)' | 'Apple Pay'>('PayPal');
  const [withdrawTarget, setWithdrawTarget] = useState('smart4smartfun@gmail.com');
  const [showPayoutStatus, setShowPayoutStatus] = useState(false);

  // Tick up balance in real-time when Traffic Mining is active!
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (wallet.trafficMiningActive) {
      interval = setInterval(() => {
        onUpdateWallet(prev => ({
          ...prev,
          balanceUSD: prev.balanceUSD + prev.miningRatePerSecond
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [wallet.trafficMiningActive, wallet.miningRatePerSecond, onUpdateWallet]);

  const handleToggleMining = () => {
    onUpdateWallet(prev => {
      const isNowActive = !prev.trafficMiningActive;
      return {
        ...prev,
        trafficMiningActive: isNowActive,
        // Calculate dynamic reward multiplier rate based on ad density selection
        miningRatePerSecond: isNowActive ? (0.01 * prev.adDensityMultiplier) : 0
      };
    });
  };

  const handleChangeMultiplier = (rate: number) => {
    onUpdateWallet(prev => ({
      ...prev,
      adDensityMultiplier: rate,
      miningRatePerSecond: prev.trafficMiningActive ? (0.01 * rate) : 0
    }));
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > wallet.balanceUSD) {
      alert("Insufficient Balance. Engagement earnings have not crossed the threshold yet!");
      return;
    }

    // Process secure simulated withdrawal
    onUpdateWallet(prev => {
      const newRecord: WithdrawalRecord = {
        id: 'w_' + Math.floor(1000 + Math.random() * 9000),
        amount: amount,
        method: withdrawMethod,
        status: 'Pending',
        timestamp: 'Just now'
      };

      return {
        ...prev,
        balanceUSD: prev.balanceUSD - amount,
        totalWithdrawn: prev.totalWithdrawn + amount,
        withdrawals: [newRecord, ...prev.withdrawals]
      };
    });

    setShowPayoutStatus(true);
    setTimeout(() => {
      setShowPayoutStatus(false);
    }, 4000);
  };

  return (
    <div className="w-full h-full bg-slate-950 p-4 overflow-y-auto no-scrollbar pb-16 animate-fade-in">
      
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <DollarSign className="w-5.5 h-5.5 text-emerald-400" /> Wallet & Monetization
        </h2>
        <p className="text-[10.5px] text-slate-400">
          The more people engage, comment, and scroll, the more passive ad-dividends you earn.
        </p>
      </div>

      {/* Main Account Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden mb-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              Active Engagement Yield
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                ${wallet.balanceUSD.toFixed(4)}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono animate-pulse">USD</span>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-full p-2.5 flex items-center gap-1.5 shadow-md">
            <Coins className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-xs font-bold font-mono text-amber-400">{wallet.fnCoins} FNC</span>
          </div>
        </div>

        {/* Real-time ticker status line */}
        <div className="bg-slate-950/70 border border-slate-900 rounded-xl px-3 py-2 mt-4 flex justify-between items-center text-[10.5px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${wallet.trafficMiningActive ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
            {wallet.trafficMiningActive ? 'TRAFFIC HARVESTER ONLINE' : 'TRAFFIC HARVESTER STANDBY'}
          </span>
          <span className="text-emerald-400 font-semibold">
            +${(wallet.miningRatePerSecond * 60).toFixed(2)}/min
          </span>
        </div>
      </div>

      {/* Sub-Metrics grid banner */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-905 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold text-slate-500">Ad Multiplier</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-base font-extrabold text-white mt-1.5 font-mono">
            {wallet.adDensityMultiplier}x Rate
          </p>
          <span className="text-[9px] text-slate-500 leading-tight">Increases value of shares</span>
        </div>

        <div className="bg-slate-905 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold text-slate-500">Settled Cash</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-base font-extrabold text-white mt-1.5 font-mono">
            ${wallet.totalWithdrawn.toFixed(2)}
          </p>
          <span className="text-[9px] text-slate-500 leading-tight">Total lifetime payout</span>
        </div>
      </div>

      {/* Interactive Miner Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" /> Auto Traffic Monetizer
            </h3>
            <p className="text-[10px] text-slate-400">Leverage peer node cycles to farm passive social dividends.</p>
          </div>
          <button
            id="wallet-mining-toggle"
            onClick={handleToggleMining}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              wallet.trafficMiningActive ? 'bg-emerald-600' : 'bg-slate-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                wallet.trafficMiningActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Visual packet mining stream simulation when toggled */}
        {wallet.trafficMiningActive && (
          <div className="bg-slate-950 rounded-xl p-2 border border-emerald-500/10 relative overflow-hidden flex flex-col items-center">
            <div className="flex gap-2 items-center justify-between w-full px-2 font-mono text-[8px] text-emerald-400 mb-1">
              <span>[PACKET_IP: 142.250.190.46]</span>
              <span>[BUFFERING STREAMING CPM...]</span>
            </div>
            {/* Pulsing neon data packets bar */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative">
              <div className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"
                style={{ width: '85%', animationDuration: '0.8s' }} />
            </div>
          </div>
        )}

        {/* Ad Space Rate Adjustment Selection */}
        <div className="space-y-1.5">
          <label className="block text-[10px] text-slate-400 font-semibold uppercase">
            Sponsor Density Configuration
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2.5, 5, 10].map(multiplier => (
              <button
                id={`wallet-mult-${multiplier}`}
                key={multiplier}
                onClick={() => handleChangeMultiplier(multiplier)}
                className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  wallet.adDensityMultiplier === multiplier
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {multiplier}x
              </button>
            ))}
          </div>
          <p className="text-[9.5px] text-slate-500 italic text-center">
            Aggressive densities display sponsored ads every 2 posts inside Feed.
          </p>
        </div>
      </div>

      {/* FaceNote Marketplace & Payment Setup Mentor */}
      <div className="mb-4">
        <PaymentMentor 
          wallet={wallet} 
          onUpdateWallet={onUpdateWallet} 
          onTriggerFloatingDollar={(label) => onTriggerFloatingDollar(label || '+$1.00')} 
        />
      </div>

      {/* Instant Settlement Withdrawal Panel / Cashout */}
      <form onSubmit={handleWithdraw} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 mb-4">
        <div>
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Send className="w-4 h-4 text-indigo-400" /> Settled Settlement Transfers
          </h3>
          <p className="text-[10px] text-slate-400">Withdraw generated social dividends instantly to real-world processors.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[9.5px] text-slate-400 font-medium mb-1">Payout Gateway</label>
            <select
              id="wallet-payout-method"
              value={withdrawMethod}
              onChange={e => setWithdrawMethod(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-white outline-none focus:border-indigo-500 transition-all font-semibold"
            >
              <option value="PayPal">PayPal Email</option>
              <option value="Bank Transfer">Bank Wire Transfer</option>
              <option value="Crypto (Solana/USDT)">Crypto Token (USDT)</option>
              <option value="Apple Pay">Apple Pay ID</option>
            </select>
          </div>

          <div>
            <label className="block text-[9.5px] text-slate-400 font-medium mb-1">Target Account</label>
            <input
              id="wallet-payout-target"
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-white outline-none focus:border-indigo-500 transition-all font-mono"
              placeholder={withdrawMethod === 'PayPal' ? 'name@gmail.com' : 'Destination code'}
              value={withdrawTarget}
              onChange={e => setWithdrawTarget(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[9.5px] text-slate-400 font-medium mb-1">Amount to Transfer ($ USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">$</span>
            <input
              id="wallet-payout-amount"
              type="number"
              step="any"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-4 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500 transition-all"
              placeholder="50"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
            />
          </div>
        </div>

        <button
          id="wallet-withdraw-submit"
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-1.5"
        >
          Initiate settlement transfer ➔
        </button>

        {showPayoutStatus && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2.5 animate-bounce">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">Transfer Initiated!</p>
              <p className="text-[9.5.px] text-slate-400 leading-tight">
                Transfer verified successfully under biometrics hash. Settling in network queues.
              </p>
            </div>
          </div>
        )}
      </form>

      {/* Historically Withdrawals Statement Log */}
      <div className="space-y-2">
        <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          Settlement Logs History
        </h4>
        
        {wallet.withdrawals.length === 0 ? (
          <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-900 text-center">
            <p className="text-[10px] text-slate-500">No previous settlements record found.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {wallet.withdrawals.map((withdraw, idx) => (
              <div key={idx} className="bg-slate-910 border border-slate-900 rounded-xl px-3 py-2 flex justify-between items-center text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-200">${withdraw.amount.toFixed(2)} USD</p>
                  <p className="text-[9px] text-slate-500">{withdraw.method} • {withdraw.timestamp}</p>
                </div>
                <span className="bg-yellow-500/10 text-yellow-400 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {withdraw.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
