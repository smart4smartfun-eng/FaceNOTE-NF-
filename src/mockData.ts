import { Post, Story, Friend } from './types';

export const INITIAL_STORIES: Story[] = [
  {
    id: 's1',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    isViewed: false
  },
  {
    id: 's2',
    userName: 'Chloe Bennett',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    isViewed: false
  },
  {
    id: 's3',
    userName: 'Marcus Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
    isVideo: false,
    isViewed: false
  },
  {
    id: 's4',
    userName: 'David K.',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-trees-in-the-wind-with-sun-beams-42353-large.mp4',
    isVideo: true,
    isViewed: false
  }
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f1',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isOnline: true,
    lastActive: 'Active now',
    messages: [
      { id: 'm1', senderId: 'them', text: 'Hey there! Long time no see. How is your project FaceNOTE going?', timestamp: '11:45 AM' },
      { id: 'm2', senderId: 'me', text: 'Hey Sarah! It’s going fantastic. Reconnecting friends and earning passive ad rewards as we go!', timestamp: '11:46 AM' },
      { id: 'm3', senderId: 'them', text: 'That is incredible! Let’s hop on an FaceNOTE Video Call later today. Call me whenever you are free!', timestamp: '11:48 AM' }
    ],
    lastMessage: 'Let’s hop on an FaceNOTE Video Call later today.'
  },
  {
    id: 'f2',
    name: 'Marcus Rivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isOnline: true,
    lastActive: 'Active now',
    messages: [
      { id: 'm1b', senderId: 'them', text: 'Did you see that post about the new WebGL engine?', timestamp: 'Yesterday' },
      { id: 'm2b', senderId: 'me', text: 'Yeah, looks beautiful!', timestamp: 'Yesterday' },
      { id: 'm3b', senderId: 'them', text: 'Awesome, talk soon!', timestamp: 'Yesterday' }
    ],
    lastMessage: 'Awesome, talk soon!'
  },
  {
    id: 'f3',
    name: 'Chloe Bennett',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    isOnline: false,
    lastActive: 'Offline - 30m ago',
    messages: [
      { id: 'm1c', senderId: 'them', text: 'Hey, did you make it home safely?', timestamp: '3h ago' }
    ],
    lastMessage: 'Hey, did you make it home safely?'
  },
  {
    id: 'f4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    isOnline: true,
    lastActive: 'Active now',
    messages: [
      { id: 'm1d', senderId: 'them', text: 'I love FaceNOTE! The UI is extremely responsive.', timestamp: '10:00 AM' }
    ],
    lastMessage: 'I love FaceNOTE! The UI is extremely responsive.'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content: 'Just set up my new remote workstation setup! Clean workspace, double monitors, and hot coffee. Ready to code the future of social networks. ☕💻✨',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    likes: 142,
    timestamp: '2 hours ago',
    location: 'Seattle, WA',
    latitude: 47.6062,
    longitude: -122.3321,
    comments: [
      {
        id: 'c1',
        authorName: 'Marcus Rivera',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        text: 'That setup looks incredibly clean! Which brand is that desk lamp?',
        timestamp: '1h ago'
      },
      {
        id: 'c2',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        text: 'Thanks Marcus! It is a metal architectural swing-arm lamp from BenQ.',
        timestamp: '45m ago'
      }
    ],
    impressions: 489
  },
  {
    id: 'sponsor1',
    authorName: 'FaceNOTE Premium Services',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    content: '💸 REVENUE GENERATOR SPONSOR: The more users engage with FaceNOTE, the larger our ad network payouts! Sign up for custom monetization triggers and get 2.5x traffic farming bonuses inside your Wallet immediately.',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80',
    likes: 928,
    timestamp: 'Sponsored Ad Space',
    isSponsored: true,
    sponsorUrl: 'https://google.ai/studio',
    comments: [
      {
        id: 'cs1',
        authorName: 'FaceNOTE System Bot',
        authorAvatar: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=150',
        text: 'Earn passive rewards. Active status updates pay out 0.05 FN Coins every minute!',
        timestamp: 'Just now'
      }
    ],
    impressions: 3951
  },
  {
    id: 'p2',
    authorName: 'Marcus Rivera',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    content: 'Check out this beautiful ocean motion capture wave video I filmed near the California coast! FaceNOTE handles full HD frame uploads with zero lag. Let me know what you think of the color grade!',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-near-shore-43026-large.mp4',
    likes: 84,
    timestamp: '4 hours ago',
    location: 'Malibu Coast, CA',
    latitude: 34.0259,
    longitude: -118.7798,
    isGated: true,
    gatePrice: 1.49,
    unlockedByMe: false,
    comments: [
      {
        id: 'c3',
        authorName: 'David Kim',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        text: 'Absolute masterpiece! The blues are extremely rich.',
        timestamp: '2h ago'
      }
    ],
    impressions: 211
  }
];
