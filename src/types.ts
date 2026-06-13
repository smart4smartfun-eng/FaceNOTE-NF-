export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  avatar: string;
  isRegistered: boolean;
  isGmailAuthed: boolean;
  isFaceVerified: boolean;
  faceScanData?: string; // Mock face vector summary
  isOnline: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLikedByMe?: boolean;
  isSponsored?: boolean; // Generating dynamic CPM/Ad-income
  sponsorUrl?: string;
  impressions: number;
  isGated?: boolean;
  gatePrice?: number; // USD price, default e.g. 0.99
  unlockedByMe?: boolean;
}

export interface Story {
  id: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  isVideo?: boolean;
  isViewed?: boolean;
}

export interface Message {
  id: string;
  senderId: 'me' | 'them';
  text: string;
  timestamp: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage?: string;
  lastActive?: string;
  messages: Message[];
}

export type CallStatus = 'none' | 'dialing' | 'incoming' | 'connected' | 'ended';
export type CallMode = 'voice' | 'video';

export interface CallSession {
  status: CallStatus;
  mode: CallMode;
  peer: Friend;
  durationSeconds: number;
  localStreamActive: boolean;
  audioMuted: boolean;
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  method: 'PayPal' | 'Bank Transfer' | 'Crypto (Solana/USDT)' | 'Apple Pay';
  status: 'Pending' | 'Processed';
  timestamp: string;
}

export interface PaymentSetup {
  stripeMode: 'sandbox' | 'production';
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalEmail: string;
  isStripeConnected: boolean;
  isPaypalConnected: boolean;
  activePayoutMethod: 'None' | 'Stripe' | 'PayPal' | 'Crypto' | 'Apple Pay';
}

export interface WalletState {
  balanceUSD: number;
  totalWithdrawn: number;
  fnCoins: number;
  adDensityMultiplier: number; // 1x, 2.5x, 5x, 10x
  trafficMiningActive: boolean;
  miningRatePerSecond: number;
  withdrawals: WithdrawalRecord[];
  isProMember?: boolean;
  adBoosterActive?: boolean;
  paymentConfig?: PaymentSetup;
}

