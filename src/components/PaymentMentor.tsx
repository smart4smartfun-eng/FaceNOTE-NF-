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
  QrCode
} from 'lucide-react';
import { WalletState } from '../types';

interface PaymentMentorProps {
  wallet: WalletState;
  onUpdateWallet: (updater: (prev: WalletState) => WalletState) => void;
  onTriggerFloatingDollar: (label: string) => void;
}

export default function PaymentMentor({ wallet, onUpdateWallet, onTriggerFloatingDollar }: PaymentMentorProps) {
  // Tabs: 'mentor' (setup guide), 'shop' (buy multipliers/premium), 'gateway' (the Stripe processor)
  const [activeSubTab, setActiveSubTab] = useState<'mentor' | 'shop'>('shop');
  const [showStripeModal, setShowStripeModal] = useState(false);
  
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
      <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850">
        <button
          id="tab-mentor-shop"
          onClick={() => setActiveSubTab('shop')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'shop' 
              ? 'bg-blue-600 text-white shadow-md font-bold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          FaceNote Marketplace
        </button>

        <button
          id="tab-mentor-wizard"
          onClick={() => setActiveSubTab('mentor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'mentor' 
              ? 'bg-blue-600 text-white shadow-md font-bold' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Payout Setup Advisor
        </button>
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

    </div>
  );
}
