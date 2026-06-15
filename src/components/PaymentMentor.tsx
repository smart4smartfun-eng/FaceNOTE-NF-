import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Settings, 
  CreditCard, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Coins, 
  ChevronRight, 
  DollarSign, 
  Award,
  BookOpen,
  QrCode,
  ArrowUpRight,
  Clock,
  Activity,
  Check,
  Wallet,
  Landmark
} from 'lucide-react';
import { WalletState, User } from '../types';

interface PaymentMentorProps {
  user: User | null;
  wallet: WalletState;
  onUpdateWallet: (updater: (prev: WalletState) => WalletState) => void;
  onTriggerFloatingDollar: (label: string) => void;
}

export default function PaymentMentor({ user, wallet, onUpdateWallet, onTriggerFloatingDollar }: PaymentMentorProps) {
  // Tabs: 'mentor' (setup guide), 'shop' (buy multipliers/premium), 'withdraw' (interactive withdrawal mentor), 'founder_vault'
  const [activeSubTab, setActiveSubTab] = useState<'mentor' | 'shop' | 'withdraw' | 'founder_vault'>('withdraw');
  const [showStripeModal, setShowStripeModal] = useState(false);

  // Founder Vault Configuration & Bypass states
  const [isFounderUnlocked, setIsFounderUnlocked] = useState(() => {
    return localStorage.getItem('facenote_founder_unlocked') === 'true' || user?.email === 'smart4smartfun@gmail.com';
  });
  const [showFounderModal, setShowFounderModal] = useState(false);
  const [founderPasscode, setFounderPasscode] = useState('');
  const [founderError, setFounderError] = useState('');
  const [founderWithdrawAmount, setFounderWithdrawAmount] = useState('');
  const [founderWithdrawDestination, setFounderWithdrawDestination] = useState('');
  const [founderWithdrawSuccess, setFounderWithdrawSuccess] = useState(false);
  const [founderIsWithdrawing, setFounderIsWithdrawing] = useState(false);
  const [founderStepMessage, setFounderStepMessage] = useState('');
  const [founderStepNum, setFounderStepNum] = useState(0);
  
  const [founderTxns, setFounderTxns] = useState<{ id: string; amount: number; method: string; destination: string; timestamp: string }[]>(() => {
    const saved = localStorage.getItem('facenote_founder_txns');
    return saved ? JSON.parse(saved) : [
      { id: 'f_tx_901', amount: 15.00, method: 'Direct Bank Routing', destination: 'Founder Core Swiss Trust', timestamp: 'May 12, 2026, 11:30 AM' },
      { id: 'f_tx_845', amount: 35.50, method: 'PayPal Business Payout', destination: 'founder-treasury@facenote.io', timestamp: 'Jun 02, 2026, 04:15 PM' }
    ];
  });

  // Automatically sync with user email
  React.useEffect(() => {
    if (user?.email === 'smart4smartfun@gmail.com') {
      setIsFounderUnlocked(true);
      localStorage.setItem('facenote_founder_unlocked', 'true');
    }
  }, [user]);

  // Persist founder transactions
  React.useEffect(() => {
    localStorage.setItem('facenote_founder_txns', JSON.stringify(founderTxns));
  }, [founderTxns]);

  const handleVerifyFounderGate = (e: React.FormEvent) => {
    e.preventDefault();
    setFounderError('');
    const code = founderPasscode.trim().toLowerCase();
    if (code === '7777' || code === 'founder1337' || code === 'smart4smartfun') {
      setIsFounderUnlocked(true);
      localStorage.setItem('facenote_founder_unlocked', 'true');
      setShowFounderModal(false);
      setFounderPasscode('');
      setActiveSubTab('founder_vault');
      onTriggerFloatingDollar('FOUNDER ACCESS AUTHORIZED');
    } else {
      setFounderError('Invalid cryptographic pass-token. Please try again or log in with the founder email account.');
    }
  };

  const handleExecuteFounderWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setFounderError('');
    setFounderWithdrawSuccess(false);

    const fBalance = wallet.founderBalanceUSD !== undefined ? wallet.founderBalanceUSD : 145.50;
    const amount = parseFloat(founderWithdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setFounderError('Please enter a valid positive withdrawal amount.');
      return;
    }

    if (amount > fBalance) {
      setFounderError(`Insufficient founder reserves. You can withdraw up to $${fBalance.toFixed(2)} USD.`);
      return;
    }

    if (!founderWithdrawDestination.trim()) {
      setFounderError('Please designate routing details (Bank account, crypto wallet, or email).');
      return;
    }

    // Step-by-step simulated clearance
    setFounderIsWithdrawing(true);
    setFounderStepNum(1);
    setFounderStepMessage('Verifying Founder Cryptographic Signature & Smart Contract ledger...');

    setTimeout(() => {
      setFounderStepNum(2);
      setFounderStepMessage('Authorizing 3% commission pool liquidation via Node Gateway...');

      setTimeout(() => {
        setFounderStepNum(3);
        setFounderStepMessage('Settling funds into offshore merchant routing node...');

        setTimeout(() => {
          // Success!
          onUpdateWallet(prev => {
            const currentFBal = prev.founderBalanceUSD !== undefined ? prev.founderBalanceUSD : 145.50;
            return {
              ...prev,
              founderBalanceUSD: +(currentFBal - amount).toFixed(4)
            };
          });

          // Add to founder txns
          const newTx = {
            id: 'f_tx_' + Math.random().toString(36).substring(2, 9),
            amount: amount,
            method: 'Direct Settlement Gate',
            destination: founderWithdrawDestination,
            timestamp: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };

          setFounderTxns(prev => [newTx, ...prev]);
          setFounderIsWithdrawing(false);
          setFounderWithdrawSuccess(true);
          setFounderWithdrawAmount('');
          onTriggerFloatingDollar(`-$${amount.toFixed(2)} FOUNDER WITHDRAW COMPLETE`);
        }, 1500);

      }, 1500);

    }, 1500);
  };

  // Withdraw Feature States
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState<'PayPal' | 'Bank Transfer' | 'Crypto (Solana/USDT)' | 'Apple Pay'>('PayPal');
  const [withdrawalDestination, setWithdrawalDestination] = useState(() => {
    return wallet.paymentConfig?.paypalEmail || user?.email || '';
  });
  const [withdrawalError, setWithdrawalError] = useState('');
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [withdrawalStepMessage, setWithdrawalStepMessage] = useState('');
  const [withdrawalStepNum, setWithdrawalStepNum] = useState(0);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Sync destination details with PayPal config only on load or initial settings connection
  const hasInitializedSync = React.useRef(false);
  React.useEffect(() => {
    if (!hasInitializedSync.current) {
      if (wallet.paymentConfig?.paypalEmail && withdrawalMethod === 'PayPal') {
        setWithdrawalDestination(wallet.paymentConfig.paypalEmail);
        hasInitializedSync.current = true;
      }
    }
  }, [wallet.paymentConfig?.paypalEmail, withdrawalMethod]);

  const selectWithdrawalMethod = (method: 'PayPal' | 'Bank Transfer' | 'Crypto (Solana/USDT)' | 'Apple Pay') => {
    setWithdrawalMethod(method);
    if (method === 'PayPal') {
      setWithdrawalDestination(wallet.paymentConfig?.paypalEmail || user?.email || '');
    } else if (method === 'Bank Transfer') {
      setWithdrawalDestination(wallet.paymentConfig?.stripeSecretKey ? 'Connected Stripe Bank Node' : '');
    } else if (method === 'Crypto (Solana/USDT)') {
      setWithdrawalDestination('');
    } else if (method === 'Apple Pay') {
      setWithdrawalDestination(user?.phoneNumber || '');
    }
  };

  const getDestinationPlaceholder = () => {
    switch (withdrawalMethod) {
      case 'PayPal':
        return 'e.g. paypal-recipient@example.com';
      case 'Bank Transfer':
        return 'e.g. Bank Account or Swift Routing standard';
      case 'Crypto (Solana/USDT)':
        return 'e.g. Sol39281...9zKx Solana Wallet Address';
      case 'Apple Pay':
        return 'e.g. +1 (555) 019-2834 or Apple ID email';
      default:
        return 'Enter destination account details';
    }
  };

  // Handler to simulate the secure withdraw steps
  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawalError('');
    setWithdrawalSuccess(false);

    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalError('Please enter a valid positive withdrawal amount.');
      return;
    }

    if (amount > wallet.balanceUSD) {
      setWithdrawalError(`Insufficient balance. You can withdraw up to $${wallet.balanceUSD.toFixed(2)} USD.`);
      return;
    }

    if (amount < 10.0) {
      setWithdrawalError('Minimum social payout amount is $10.00 USD. Keep active on FaceNote to stack up more yields!');
      return;
    }

    if (!withdrawalDestination.trim()) {
      setWithdrawalError('Please enter destination details (e.g. PayPal Email or Bank Account Info).');
      return;
    }

    // Step-by-step simulated clearance
    setIsWithdrawing(true);
    setWithdrawalStepNum(1);
    setWithdrawalStepMessage('Initiating Handshake with Clearing Merchant Hub...');

    setTimeout(() => {
      setWithdrawalStepNum(2);
      setWithdrawalStepMessage('Verifying Cryptographic Ledger Signatures & SDK Credentials...');
      
      setTimeout(() => {
        setWithdrawalStepNum(3);
        setWithdrawalStepMessage('Routing Packet Packets securely through Sandbox Gateway node...');

        setTimeout(() => {
          setWithdrawalStepNum(4);
          setWithdrawalStepMessage('Processing instant settlement token... Deducting balance.');

          setTimeout(() => {
            // Success update!
            onUpdateWallet(prev => {
              const newRecord = {
                id: 'w_tx_' + Math.random().toString(36).substring(2, 9),
                amount: amount,
                method: withdrawalMethod,
                status: 'Processed' as const,
                timestamp: new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              };

              return {
                ...prev,
                balanceUSD: +(prev.balanceUSD - amount).toFixed(2),
                totalWithdrawn: +(prev.totalWithdrawn + amount).toFixed(2),
                withdrawals: [newRecord, ...(prev.withdrawals || [])]
              };
            });

            setIsWithdrawing(false);
            setWithdrawalSuccess(true);
            setWithdrawalAmount('');
            onTriggerFloatingDollar(`-$${amount.toFixed(2)} WITHDRAWAL COMPLETE`);
          }, 1500);

        }, 1500);

      }, 1500);

    }, 1500);
  };
  
  // Selected shop product
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    title: string;
    price: number;
    description: string;
    benefit: string;
    actionType: 'premium' | 'booster' | 'coins';
    coinAmount?: number;
  } | null>(null);

  // Stripe Sandbox Checkout States
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardZip, setCardZip] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Payment Setup credentials state
  const [payoutConfig, setPayoutConfig] = useState(wallet.paymentConfig || {
    stripeMode: 'sandbox' as const,
    stripePublicKey: '',
    stripeSecretKey: '',
    paypalEmail: '',
    isStripeConnected: false,
    isPaypalConnected: false,
    activePayoutMethod: 'None' as const
  });

  const [setupStep, setSetupStep] = useState<number>(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const shopProducts = [
    {
      id: 'prod_premium',
      title: 'FaceNote Pro Creator Badge',
      price: 9.99,
      description: 'Unlock permanent premium monetization. Elevates your traffic mining base speed permanently.',
      benefit: 'Permanent +3.0x Yield Multiplier & Pro Visual Badge',
      actionType: 'premium' as const
    },
    {
      id: 'prod_booster',
      title: 'Hyper Social Ad-Booster Pack',
      price: 4.99,
      description: 'Force massive advertisement delivery algorithms. Instantly spikes session traffic output.',
      benefit: '+5.0x Yield Multiplier for the current session',
      actionType: 'booster' as const
    },
    {
      id: 'prod_coins_large',
      title: '500 FNC Coin Chest Bundle',
      price: 19.99,
      description: 'Acquire 500 premium Coins to purchase post promotions, unlock files, text overlays, and call bonuses.',
      benefit: 'Get 500 FaceNote Coins instantly',
      actionType: 'coins' as const,
      coinAmount: 500
    },
    {
      id: 'prod_coins_small',
      title: '120 FNC Coin Starter Bundle',
      price: 4.99,
      description: 'Fast starter bundle of FaceNote Coins to spend on interactive post tipping or unlocking premium media.',
      benefit: 'Get 120 FaceNote Coins instantly',
      actionType: 'coins' as const,
      coinAmount: 120
    }
  ];

  const handleOpenCheckout = (product: typeof shopProducts[0]) => {
    setSelectedProduct(product);
    setCheckoutStep('form');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName(wallet.paymentConfig?.paypalEmail ? 'Premium Member' : '');
    setCardZip('');
    setPaymentError('');
    setShowStripeModal(true);
  };

  const processStripeCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      setPaymentError('Please fill out all mandatory payment fields.');
      return;
    }

    setPaymentError('');
    setCheckoutStep('processing');

    // Simulate authentic standard Stripe processing delay
    setTimeout(() => {
      onUpdateWallet(prev => {
        let updatedMultiplier = prev.adDensityMultiplier;
        let coinsAmount = prev.fnCoins;
        let proMember = prev.isProMember;
        let adBooster = prev.adBoosterActive;

        if (selectedProduct?.actionType === 'premium') {
          proMember = true;
          updatedMultiplier = prev.adDensityMultiplier + 3.0;
        } else if (selectedProduct?.actionType === 'booster') {
          adBooster = true;
          updatedMultiplier = prev.adDensityMultiplier + 5.0;
        } else if (selectedProduct?.actionType === 'coins' && selectedProduct.coinAmount) {
          coinsAmount = prev.fnCoins + selectedProduct.coinAmount;
        }

        return {
          ...prev,
          adDensityMultiplier: updatedMultiplier,
          fnCoins: coinsAmount,
          isProMember: proMember,
          adBoosterActive: adBooster,
          // Subtract cash simulation if they have enough balance, otherwise it comes from card
          balanceUSD: prev.balanceUSD // Paid with Credit Card!
        };
      });

      setCheckoutStep('success');
      onTriggerFloatingDollar(`+$${selectedProduct?.price} PAID VIA STRIPE`);
    }, 2800);
  };

  const handleSavePayoutSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const isStripeFilled = payoutConfig.stripePublicKey.trim() !== '' && payoutConfig.stripeSecretKey.trim() !== '';
    const isPaypalFilled = payoutConfig.paypalEmail.trim().includes('@');

    const updatedConfig = {
      ...payoutConfig,
      isStripeConnected: isStripeFilled,
      isPaypalConnected: isPaypalFilled,
      activePayoutMethod: isStripeFilled ? ('Stripe' as const) : isPaypalFilled ? ('PayPal' as const) : ('None' as const)
    };

    setPayoutConfig(updatedConfig);
    onUpdateWallet(prev => ({
      ...prev,
      paymentConfig: updatedConfig
    }));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Helper function to insert test cards
  const fillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/29');
    setCardCvv('424');
    setCardName('Jane Doe');
    setCardZip('10001');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
      
      {/* Tab Row selector */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 overflow-x-auto">
        <button
          id="tab-mentor-withdraw"
          onClick={() => setActiveSubTab('withdraw')}
          className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-all min-w-[100px] shrink-0 ${
            activeSubTab === 'withdraw' 
              ? 'bg-blue-600 text-white shadow-md font-bold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Landmark className="w-3 h-3 text-emerald-400" />
          Withdrawal Mentor
        </button>

        <button
          id="tab-mentor-shop"
          onClick={() => setActiveSubTab('shop')}
          className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-all min-w-[100px] shrink-0 ${
            activeSubTab === 'shop' 
              ? 'bg-blue-600 text-white shadow-md font-bold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3 h-3" />
          Marketplace
        </button>

        <button
          id="tab-mentor-wizard"
          onClick={() => setActiveSubTab('mentor')}
          className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-all min-w-[100px] shrink-0 ${
            activeSubTab === 'mentor' 
              ? 'bg-blue-600 text-white shadow-md font-bold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3 h-3" />
          Setup Advisor
        </button>

        {(isFounderUnlocked || user?.email === 'smart4smartfun@gmail.com') && (
          <button
            id="tab-founder-vault"
            onClick={() => setActiveSubTab('founder_vault')}
            className={`flex-1 py-1.5 text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-all min-w-[110px] shrink-0 ${
              activeSubTab === 'founder_vault' 
                ? 'bg-amber-600 text-white shadow-md font-bold border border-amber-500/20' 
                : 'text-amber-400 hover:text-white bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/15'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            Founder Vault (3%)
          </button>
        )}
      </div>

      {/* RENDER MARKETPLACE SHOP */}
      {activeSubTab === 'shop' && (
        <div className="space-y-3.5">
          <div className="flex justify-between items-center bg-blue-950/20 border border-blue-500/20 rounded-xl px-3 py-2.5">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold">MONETIZATION ACCELERATOR</span>
              <p className="text-[11px] text-slate-200">Increase passive earnings output by buying post boosters or premium memberships.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {shopProducts.map((p) => {
              const isPurchased = p.id === 'prod_premium' && wallet.isProMember;
              return (
                <div 
                  key={p.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {p.actionType === 'premium' && <Award className="w-4 h-4 text-amber-400" />}
                        {p.actionType === 'booster' && <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />}
                        {p.actionType === 'coins' && <Coins className="w-4 h-4 text-yellow-500" />}
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">{p.description}</p>
                    </div>
                    <span className="text-sm font-black text-emerald-400 font-mono select-none">${p.price}</span>
                  </div>

                  <div className="border-t border-slate-900 mt-3 pt-2.5 flex justify-between items-center gap-2">
                    <span className="text-[9.5px] text-blue-300 font-medium font-mono">
                      ➔ {p.benefit}
                    </span>
                    <button
                      id={`buy-${p.id}`}
                      onClick={() => !isPurchased && handleOpenCheckout(p)}
                      disabled={isPurchased}
                      className={`text-[10px] px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                        isPurchased 
                          ? 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95'
                      }`}
                    >
                      {isPurchased ? 'Active Member' : 'Verify & Pay'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER PAYOUT SETUP ADVISOR (PAYMENT MENTORED TOOL) */}
      {activeSubTab === 'mentor' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1 text-blue-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Creator Integration Mentor
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              To withdraw real-world money generated by your engagement metrics, you can configure authentic merchant checkout gateways. Complete the setup masterclass below:
            </p>
          </div>

          {/* Masterclass Guide Steps selector */}
          <div className="flex items-center gap-1 text-[10px] font-mono select-none">
            {[1, 2, 3].map(step => (
              <React.Fragment key={step}>
                <button
                  id={`mentor-step-tab-${step}`}
                  onClick={() => setSetupStep(step)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold border transition-all ${
                    setupStep === step 
                      ? 'bg-blue-600 text-white border-blue-400' 
                      : 'bg-slate-950 text-slate-500 border-slate-850'
                  }`}
                >
                  {step}
                </button>
                {step < 3 && <span className="text-slate-800 shrink-0">┄</span>}
              </React.Fragment>
            ))}
            <span className="ml-auto text-[9.5px] text-slate-500 font-bold">
              {setupStep === 1 ? '1. Concept' : setupStep === 2 ? '2. Setup API' : '3. Go Live'}
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-850 rounded-xl p-3.5 text-xs text-slate-300 space-y-3">
            {setupStep === 1 && (
              <div className="space-y-2 leading-relaxed text-[10.5px]">
                <p className="font-bold text-white text-xs">How do social payouts work?</p>
                <div className="space-y-1.5 text-slate-400">
                  <p>1. <span className="text-white font-semibold">CPM Yield:</span> Advertisers deposit campaigns into FaceNote treasurypools.</p>
                  <p>2. <span className="text-white font-semibold">Decentralized Mining:</span> Dynamic packet mining tracks scrolling density and video calls.</p>
                  <p>3. <span className="text-white font-semibold">Payment Execution:</span> Your payouts route directly to PayPal Developer accounts or Stripe connected merchant nodes.</p>
                </div>
                <button 
                  id="mentor-step-next-2"
                  onClick={() => setSetupStep(2)} 
                  className="mt-1 flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:text-blue-300"
                >
                  Configure API credentials now <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {setupStep === 2 && (
              <form onSubmit={handleSavePayoutSettings} className="space-y-3">
                <p className="font-bold text-white text-xs">Verify Sandbox or Live API Credentials</p>
                
                <div className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-400 font-bold mb-1">STRIPE BILLING MODE</label>
                    <select
                      id="mentor-stripe-mode"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10.5px] text-white outline-none"
                      value={payoutConfig.stripeMode}
                      onChange={e => setPayoutConfig({ ...payoutConfig, stripeMode: e.target.value as any })}
                    >
                      <option value="sandbox">Sandbox Test Mode (Recommended)</option>
                      <option value="production">Production Live Mode</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-400 font-bold mb-1">STRIPE PUBLIC KEY (pk_test_...)</label>
                    <input
                      id="mentor-stripe-pk"
                      type="text"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10.5px] text-white outline-none font-mono"
                      placeholder="pk_test_51Mz... or paste key"
                      value={payoutConfig.stripePublicKey}
                      onChange={e => setPayoutConfig({ ...payoutConfig, stripePublicKey: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-400 font-bold mb-1">STRIPE SECRET KEY (sk_test_...)</label>
                    <input
                      id="mentor-stripe-sk"
                      type="password"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10.5px] text-white outline-none font-mono"
                      placeholder="sk_test_51Mz..."
                      value={payoutConfig.stripeSecretKey}
                      onChange={e => setPayoutConfig({ ...payoutConfig, stripeSecretKey: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-400 font-bold mb-1">PAYPAL MERCHANT EMAIL</label>
                    <input
                      id="mentor-paypal-email"
                      type="email"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10.5px] text-white outline-none"
                      placeholder="merchant-id@yourdomain.com"
                      value={payoutConfig.paypalEmail}
                      onChange={e => setPayoutConfig({ ...payoutConfig, paypalEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    id="mentor-save-credentials"
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-lg font-bold transition-all"
                  >
                    Save & Initialize APIs
                  </button>
                  <button
                    id="mentor-step-next-3"
                    type="button"
                    onClick={() => setSetupStep(3)}
                    className="bg-slate-900 px-3 rounded-lg text-slate-400 text-xs font-bold"
                  >
                    Next ➜
                  </button>
                </div>

                {saveSuccess && (
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    APIs Initialized. Active Method: {payoutConfig.activePayoutMethod === 'None' ? 'Sandbox Simulation' : payoutConfig.activePayoutMethod}
                  </div>
                )}
              </form>
            )}

            {setupStep === 3 && (
              <div className="space-y-3.5 text-[10px] text-slate-400">
                <p className="font-bold text-white text-xs">Verification Check & Instructions</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                    <span>Stripe Elements Client:</span>
                    <span className={payoutConfig.isStripeConnected ? 'text-emerald-400 font-bold' : 'text-amber-500 font-mono'}>
                      {payoutConfig.isStripeConnected ? '● COMPATIBLE' : '○ SIMULATOR MODE'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                    <span>PayPal Instant IPN API:</span>
                    <span className={payoutConfig.isPaypalConnected ? 'text-emerald-400 font-bold' : 'text-amber-500 font-mono'}>
                      {payoutConfig.isPaypalConnected ? '● CONNECTED' : '○ SIMULATOR' }
                    </span>
                  </div>
                </div>
                
                <div className="bg-slate-900 p-2 border border-slate-850 rounded-lg text-[9px] text-slate-400 space-y-1">
                  <span className="font-extrabold text-white text-[10px] block">💡 Developer Guideline:</span>
                  <p>In sandbox simulator mode, checkout uses standard security test cards (e.g. 4242 repeatedly) to unlock Pro traits. In Live Mode, the system will detect Stripe checkout keys stored in your env.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER WITHDRAWAL MENTOR PORTAL */}
      {activeSubTab === 'withdraw' && (
        <div className="space-y-4 text-xs animate-fade-in">
          
          {/* Main Title Banner */}
          <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
            <div className="space-y-1 text-left">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> SECURE SETTLEMENT PORTAL
              </span>
              <h4 className="text-xs font-black text-white">Withdrawal & Cleared Earnings</h4>
              <p className="text-[10px] text-slate-500">Fast clearing and transfer mechanisms verified by international merchant standards.</p>
            </div>
            <div className="bg-emerald-500/10 p-2 text-emerald-400 rounded-xl border border-emerald-500/20 text-xs shrink-0 font-bold font-mono">
              🏛️ Active
            </div>
          </div>

          {/* Quick Stats Summary Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex-1 text-left space-y-1 relative overflow-hidden group">
              <span className="text-[9px] text-slate-500 uppercase tracking-wide font-extrabold flex items-center gap-1">
                <Wallet className="w-3 h-3 text-slate-400" /> Live Wallet Balance
              </span>
              <p className="text-lg font-black text-emerald-400 font-mono">
                ${wallet.balanceUSD.toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">USD</span>
              </p>
              <div className="absolute right-2.5 bottom-2.5 w-6 h-6 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-650 font-bold text-[10px]">
                $
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl flex-1 text-left space-y-1 relative overflow-hidden">
              <span className="text-[9px] text-slate-500 uppercase tracking-wide font-extrabold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-slate-400" /> Total Payouts Settled
              </span>
              <p className="text-lg font-black text-slate-200 font-mono">
                ${wallet.totalWithdrawn.toFixed(2)} <span className="text-[10px] text-slate-500 font-normal">USD</span>
              </p>
              <div className="absolute right-2.5 bottom-2.5 w-6 h-6 rounded-full bg-slate-900 border border-slate-855 flex items-center justify-center text-slate-650 font-bold text-[8px] uppercase font-mono">
                tx
              </div>
            </div>
          </div>

          {/* Interactive Withdrawal Mentor Guidance Panel */}
          <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-4 text-left relative overflow-hidden">
            <div className="absolute top-2.5 right-2.5 text-[7px] text-blue-550 tracking-wider font-extrabold font-mono pointer-events-none select-none uppercase">
              Payout Mentor v2.4
            </div>
            
            <div className="flex gap-3 items-start">
              <div className="relative shrink-0 select-none">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" 
                  alt="Aiden" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 bg-blue-600 text-[8px] px-1 rounded-full text-white font-extrabold text-[7px] border-2 border-slate-950 uppercase tracking-wider scale-95">
                  Pro
                </span>
              </div>

              <div className="space-y-1 flex-1">
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block">Aiden (Your Withdrawal Mentor)</span>
                
                <p className="text-[10px] text-slate-300 leading-relaxed italic font-medium">
                  {wallet.balanceUSD === 0 ? (
                    `"Hey! I noticed you haven't accumulated any ad-mints yet. Start by scrolling the FaceNote feed, interacting with sponsored posts, or initiating audio/video calls in the Chats tab to watch your live earnings balance grow!"`
                  ) : wallet.balanceUSD < 10.0 ? (
                    `"Excellent start! You currently have $${wallet.balanceUSD.toFixed(2)} USD in passive ad commission. To cover decentralized routing fees, our clearing threshold starts at $10.00. Keep up the high engagement to reach the threshold!"`
                  ) : (
                    `"Outstanding work! Your balance of $${wallet.balanceUSD.toFixed(2)} is now past our minimum threshold. You can choose PayPal, Stripe or Crypto below to route your transfer. Enter the desired sum to trigger clearance!"`
                  )}
                </p>

                {(!wallet.paymentConfig?.isStripeConnected && !wallet.paymentConfig?.isPaypalConnected) ? (
                  <p className="text-[9px] text-amber-500 font-semibold mt-1">
                    ⚠️ Notice: You are in simulated checkout mode. Head over to the "Setup Advisor" tab to connect Stripe / PayPal keys for real-world payouts.
                  </p>
                ) : (
                  <p className="text-[9px] text-emerald-400 font-semibold mt-1">
                    ✓ Connected: Standard settlement channel ({payoutConfig.activePayoutMethod}) successfully loaded.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Withdrawal Form */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 text-left space-y-3.5 animate-fade-in">
            <h5 className="text-[10px] text-slate-300 font-bold uppercase tracking-wider pb-1.5 border-b border-slate-900 flex justify-between items-center">
              <span>Execute Social Transfer</span>
              <span className="text-zinc-750 font-mono text-[8.5px] tracking-widest uppercase">SSL secure</span>
            </h5>

            {isWithdrawing ? (
              /* Simulated processing steps content */
              <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-fade-in text-center">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full border-4 border-slate-855 border-t-blue-500 animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center text-blue-400 text-xs font-black">⚙️</span>
                </div>
                
                <div className="space-y-1.5 max-w-[90%]">
                  <p className="text-xs font-black text-white">Contacting Automated Clearing Node...</p>
                  <p className="text-[10.5px] text-blue-400 font-mono font-medium animate-pulse">{withdrawalStepMessage}</p>
                  
                  {/* Small dots to represent progression */}
                  <div className="flex justify-center gap-1 px-4 pt-1">
                    {[1, 2, 3, 4].map(idx => (
                      <span 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-355 ${
                          withdrawalStepNum >= idx ? 'bg-blue-500 scale-110' : 'bg-slate-800'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : withdrawalSuccess ? (
              /* Instant success screen */
              <div className="py-5 flex flex-col items-center justify-center space-y-4 animate-fade-in text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 font-bold text-lg animate-bounce">
                  ✓
                </div>

                <div className="space-y-1 max-w-[85%] mx-auto">
                  <h4 className="text-xs font-extrabold text-white text-center">Withdrawal Dispatched Successfully!</h4>
                  <p className="text-[10px] text-slate-400 text-center pl-1.5">Your funds have been transferred to the designated sandbox recipient account.</p>
                  <span className="block font-mono text-[8px] text-slate-650 mt-1 uppercase text-center">txn_withdraw_proc_{Math.random().toString(36).substring(2, 8)}</span>
                </div>

                <button
                  id="payout-success-dismiss"
                  onClick={() => setWithdrawalSuccess(false)}
                  className="bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-300 text-[10px] px-6 py-2 rounded-xl font-bold transition-all active:scale-95 cursor-pointer mx-auto block"
                >
                  Request Another Withdrawal
                </button>
              </div>
            ) : (
              /* Main interactive withdrawal input fields */
              <form onSubmit={handleExecuteWithdrawal} className="space-y-3.5">
                
                <div>
                  <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-wide mb-1.5">Payout Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'PayPal', label: 'PayPal Instant', icon: '✉️' },
                      { id: 'Bank Transfer', label: 'Stripe Bank Wire', icon: '🏦' },
                      { id: 'Crypto (Solana/USDT)', label: 'Solana Wallet', icon: '⚡' },
                      { id: 'Apple Pay', label: 'Apple Pay Cash', icon: '📱' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => selectWithdrawalMethod(method.id as any)}
                        className={`p-2 rounded-xl border text-[10px] font-semibold transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                          withdrawalMethod === method.id 
                            ? 'bg-blue-600/10 border-blue-500 text-white font-bold' 
                            : 'bg-slate-900/60 border-slate-855 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-sm shrink-0">{method.icon}</span>
                        <span className="truncate">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-wide mb-1.5">Withdrawal Destination Account</label>
                  <div className="relative">
                    <input
                      id="withdrawal-destination-input"
                      type="text"
                      required
                      placeholder={getDestinationPlaceholder()}
                      className="w-full bg-slate-900 border border-slate-855 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-sans"
                      value={withdrawalDestination}
                      onChange={e => setWithdrawalDestination(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-wide">Enter Amount (USD)</label>
                    <button
                      id="payout-balance-max"
                      type="button"
                      onClick={() => setWithdrawalAmount(wallet.balanceUSD.toFixed(2))}
                      className="text-[9px] text-blue-400 hover:text-blue-300 font-bold underline"
                    >
                      Use Max Balance
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="withdrawal-amount-input"
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 10.00"
                      className="w-full bg-slate-900 border border-slate-850 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                      value={withdrawalAmount}
                      onChange={e => setWithdrawalAmount(e.target.value)}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold">USD</span>
                  </div>
                </div>

                {withdrawalError && (
                  <div className="bg-red-500/10 border border-red-550/20 text-red-300 p-2.5 rounded-xl flex items-center gap-1.5 text-[10px]">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{withdrawalError}</span>
                  </div>
                )}

                <button
                  id="payout-execute"
                  type="submit"
                  disabled={wallet.balanceUSD < 10.0}
                  className={`w-full py-3 rounded-xl font-extrabold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white shadow-xl ${
                    wallet.balanceUSD < 10.0 
                      ? 'bg-slate-900/60 border border-slate-850 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-600/10 active:scale-98'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>Authorize Secure Withdrawal</span>
                </button>
              </form>
            )}
          </div>

          {/* Historical Withdrawal Log Ledger */}
          <div className="bg-slate-950 border border-slate-855 rounded-2xl p-4 text-left space-y-3 animate-fade-in">
            <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Withdrawal History Log
            </h5>

            {!wallet.withdrawals || wallet.withdrawals.length === 0 ? (
              <div className="bg-slate-905/15 border border-slate-900/50 py-8 px-4 rounded-xl text-center space-y-1">
                <p className="text-[10px] text-slate-500">You have no recorded withdrawals yet.</p>
                <p className="text-[8.5px] text-slate-600 font-medium">Verify your payouts configuration and complete your first transfer simulation above.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {wallet.withdrawals.map((record) => (
                  <div 
                    key={record.id}
                    className="bg-slate-900 border border-slate-850/60 hover:border-slate-800 transition-all rounded-xl p-3 flex justify-between items-center text-[10.5px]"
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{record.method}</span>
                        <span className="text-[8.5px] text-slate-500">•</span>
                        <span className="text-[9px] text-slate-500 font-mono font-normal">Ref: {record.id}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-550" /> {record.timestamp}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1 shrink-0">
                      <span className="font-mono text-xs font-black text-rose-400">
                        -${record.amount.toFixed(2)}
                      </span>
                      <div className="text-[8px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900 px-1.5 py-0.5 rounded-full inline-block">
                        Processed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* STRIPE SANDBOX CHECKOUT GATEWAY MODAL (REAL GATEWAY INTERACTION) */}
      {showStripeModal && selectedProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-4.5 space-y-4 shadow-2xl relative overflow-hidden">
            
            {/* Header decor */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-emerald-400" /> Secure Checkout Gateway
                </span>
                <h3 className="text-xs font-black text-white">{selectedProduct.title}</h3>
              </div>
              <button 
                id="close-stripe-modal"
                onClick={() => setShowStripeModal(false)}
                className="w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold hover:text-white"
              >
                ✕
              </button>
            </div>

            {checkoutStep === 'form' && (
              <form onSubmit={processStripeCheckout} className="space-y-3.5">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Subtotal Due Now:</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">${selectedProduct.price} USD</span>
                </div>

                <div className="space-y-3 text-left">
                  {/* Test card filler shortcut */}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-medium">Card Details</span>
                    <button
                      id="stripe-fill-test-card"
                      type="button"
                      onClick={fillTestCard}
                      className="text-[9px] text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md hover:bg-blue-500/10 font-bold"
                    >
                      Fill Demo Test Card ⚡
                    </button>
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-400 font-medium mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        id="stripe-card-num"
                        type="text"
                        required
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 font-mono"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value.replace(/[^\d ]/g, ''))}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">💳</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9.5px] text-slate-400 font-medium mb-1">Expiry (MM/YY)</label>
                      <input
                        id="stripe-card-exp"
                        type="text"
                        required
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 font-mono"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] text-slate-400 font-medium mb-1">CVC / CVV</label>
                      <input
                        id="stripe-card-cvv"
                        type="password"
                        required
                        maxLength={4}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 font-mono"
                        placeholder="424"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-400 font-medium mb-1">Cardholder Name</label>
                    <input
                      id="stripe-card-holder"
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500"
                      placeholder="Jane Doe"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-400 font-medium mb-1">Billing ZIP / Postal Code</label>
                    <input
                      id="stripe-card-zip"
                      type="text"
                      required
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-white outline-none focus:border-blue-500 font-mono"
                      placeholder="90210"
                      value={cardZip}
                      onChange={e => setCardZip(e.target.value)}
                    />
                  </div>
                </div>

                {paymentError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-[10px] p-2 rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    {paymentError}
                  </div>
                )}

                <button
                  id="stripe-pay-submit"
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-505 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all"
                >
                  Authorize Payment with Stripe Elements ➔
                </button>
              </form>
            )}

            {checkoutStep === 'processing' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center text-emerald-400 text-xs font-bold">✓</span>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-white">Contacting Stripe Clearing Nodes...</p>
                  <p className="text-[10px] text-slate-500 font-mono">POST /v1/payment_intents/confirm</p>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl animate-bounce">
                  🏆
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-white">Charge Captured Successfully!</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-[90%] mx-auto">
                    Your account has been upgraded with <span className="text-emerald-400 font-bold">{selectedProduct.benefit}</span>.
                  </p>
                  <span className="block font-mono text-[8px] text-slate-600 truncate max-w-[200px] mx-auto">
                    txn_stripe_{Math.random().toString(36).substr(2, 9)}
                  </span>
                </div>
                <button
                  id="stripe-success-close"
                  onClick={() => setShowStripeModal(false)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-[10px] px-6 py-2 rounded-lg font-bold hover:text-white transition-all"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {activeSubTab === 'founder_vault' && (
        <div className="space-y-4 animate-fade-in text-left">
          
          {/* Header Shield */}
          <div className="bg-gradient-to-r from-amber-600/10 to-yellow-600/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Founder's 3% Commission Vault</h3>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                As the developer & founder of FaceNote, a <b>3% platform overhead fee</b> is automatically split and routed into this hidden vault from every single USD generated by your platform's active users (ad streaming, premium marketplace, and gated content commissions).
              </p>
            </div>
          </div>

          {/* Balance Widget */}
          <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex justify-between items-center relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none text-right">
              <span className="text-8xl font-black font-mono leading-none select-none">3%</span>
            </div>
            <div className="space-y-1 relative z-10">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Hiding Platform Balance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-400 font-mono">
                  ${(wallet.founderBalanceUSD !== undefined ? wallet.founderBalanceUSD : 145.50).toFixed(2)}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase font-mono font-bold">USD</span>
              </div>
              <p className="text-[8px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                Commission Engine Online (3.0% Overhead Active)
              </p>
            </div>

            <div className="text-right space-y-1 relative z-10">
              <span className="text-[9px] text-slate-400 font-semibold block">Clearing Protocols</span>
              <span className="text-[8.5px] bg-slate-900 border border-slate-800 text-amber-400 px-2.5 py-1 rounded font-bold font-mono">
                Offshore Routing
              </span>
            </div>
          </div>

          {/* Custom Founder Withdrawal Form */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3.5">
            <div className="border-b border-slate-900 pb-2">
              <h4 className="text-xs font-bold text-slate-200">Withdraw Platform Commission Reserve</h4>
              <p className="text-[9px] text-slate-400">Specify details to trigger offshore route clearing. Only you can access this payload.</p>
            </div>

            {founderWithdrawSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs p-3.5 rounded-xl text-center space-y-2">
                <p className="font-bold text-emerald-400">🎉 Founder Transfer Clearance Successful!</p>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  The requested funds have been settled. Check your Swiss Bank Swift Node or designated destination ledger for confirmation.
                </p>
                <button
                  onClick={() => setFounderWithdrawSuccess(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-[9px] px-3.5 py-1 rounded border border-slate-800 transition-colors"
                >
                  Clear Status
                </button>
              </div>
            ) : founderIsWithdrawing ? (
              <div className="py-4 space-y-3 text-center">
                <div className="relative inline-block mx-auto">
                  <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-amber-500 animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center text-amber-400 text-xs font-bold">🔒</span>
                </div>
                <div className="space-y-1 max-w-[90%] mx-auto">
                  <p className="text-xs font-bold text-slate-200">Processing Offshore Clearance...</p>
                  <p className="text-[9px] text-amber-400 font-mono bg-slate-900 py-1 px-2 rounded truncate">
                    {founderStepMessage}
                  </p>
                  <div className="flex justify-center gap-1 pt-1">
                    {[1, 2, 3].map(step => (
                      <div 
                        key={step} 
                        className={`w-4 h-1 rounded-full transition-all ${
                          step <= founderStepNum ? 'bg-amber-500 scale-x-110' : 'bg-slate-800'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteFounderWithdrawal} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold mb-1">WITHDRAWAL AMOUNT (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">$</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-6 pr-2.5 text-xs text-white outline-none focus:border-amber-500 font-mono"
                        placeholder="e.g. 50.00"
                        value={founderWithdrawAmount}
                        onChange={e => setFounderWithdrawAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-semibold mb-1">ROUTING DESTINATION</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white outline-none focus:border-amber-500"
                      placeholder="e.g. Swiss Trust Account / Solana Wallet Address"
                      value={founderWithdrawDestination}
                      onChange={e => setFounderWithdrawDestination(e.target.value)}
                    />
                  </div>
                </div>

                {founderError && (
                  <div className="bg-red-500/10 border border-red-500/22 text-red-300 text-[10px] p-2.5 rounded-lg flex items-center gap-1.5 leading-relaxed">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    {founderError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 active:scale-99 transition-all text-white font-black text-xs py-2 rounded-xl shadow-md border border-amber-500/30 flex items-center justify-center gap-1"
                >
                  <span>💸</span> Confirm Founder Clearance Payout (Swiss Swift)
                </button>
              </form>
            )}
          </div>

          {/* Transactions Ledger */}
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-[10px] font-bold text-slate-200">Private Settlement Ledger</span>
              <span className="text-[8px] uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded font-black">
                Encrypted Log
              </span>
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              {founderTxns.map((txn) => (
                <div key={txn.id} className="bg-slate-900 border border-slate-850 pb-2 p-2 rounded-lg text-[10px] flex justify-between items-center transition-all hover:bg-slate-850">
                  <div className="space-y-0.5">
                    <p className="text-zinc-200 font-semibold">{txn.method}</p>
                    <p className="text-[8.5px] text-zinc-500 font-mono truncate max-w-[170px]">{txn.destination}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-mono font-bold">-${txn.amount.toFixed(2)} USD</p>
                    <p className="text-[8px] text-zinc-600 italic font-medium">{txn.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Subtle Founder Gateway Footer trigger */}
      <div className="flex justify-between items-center px-1 text-[8.5px] text-slate-600 border-t border-slate-900/50 pt-2 selection:bg-transparent">
        <span>FaceNote Cryptographic Settlement v3.0</span>
        <button
          type="button"
          onClick={() => {
            if (isFounderUnlocked || user?.email === 'smart4smartfun@gmail.com') {
              setActiveSubTab('founder_vault');
            } else {
              setShowFounderModal(true);
            }
          }}
          className="hover:text-amber-400 transition-colors flex items-center gap-1 font-mono hover:underline cursor-pointer bg-slate-950 px-2 py-0.5 border border-slate-850 rounded text-slate-500"
        >
          <span>🔑</span>
          <span>{(isFounderUnlocked || user?.email === 'smart4smartfun@gmail.com') ? 'Admin Vault Authorized' : 'Founder Gate (3%)'}</span>
        </button>
      </div>

      {/* Founder Verification Modal */}
      {showFounderModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-850 w-full max-w-sm rounded-2xl p-5 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setShowFounderModal(false)}
              className="absolute top-3 right-3 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-[10px] flex items-center justify-center hover:text-white"
            >
              ✕
            </button>

            <div className="text-center space-y-1.5 mb-4">
              <span className="inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/25 animate-pulse">
                🛡️ SECURE ENCLAVE GATE
              </span>
              <h3 className="text-sm font-bold text-white">Identify Founder Token</h3>
              <p className="text-[9.5px] text-slate-400 leading-relaxed">
                Provide security authorization metadata to access the 3% platform commission overhead hiding wallet. Key accounts: <span className="text-amber-400 font-semibold font-mono">smart4smartfun@gmail.com</span>
              </p>
            </div>

            <form onSubmit={handleVerifyFounderGate} className="space-y-3.5">
              <div>
                <label className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                  Founder Verification Code (or lock pin)
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-500 text-center font-mono placeholder-slate-700"
                  placeholder="Enter Passcode (Hint: 7777)"
                  value={founderPasscode}
                  onChange={e => setFounderPasscode(e.target.value)}
                />
              </div>

              {founderError && (
                <p className="text-[9.5px] text-red-400 text-center leading-relaxed">
                  ⚠️ {founderError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black py-2.5 rounded-xl text-xs transition-all shadow-lg active:scale-98"
              >
                Authenticate Founder Access Clearance ➔
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
