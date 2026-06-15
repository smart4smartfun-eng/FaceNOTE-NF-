import React, { useState } from 'react';
import { 
  User2, Calendar, ShieldCheck, Mail, Phone, LogOut, CheckCircle, 
  Briefcase, GraduationCap, Home, MapPin, Heart, Link2, Clock, 
  Edit2, Check, X, Tag, Image, Plus, Camera 
} from 'lucide-react';
import { User, Post, WalletState } from '../types';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  posts: Post[];
  wallet?: WalletState;
  onLogOut: () => void;
}

const DEFAULT_FEATURED_PHOTOS = [
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&auto=format&fit=crop&q=80"
];

const PREDEFINED_HOBBIES = [
  "⚽ Sports", "🎸 Music", "✈️ Travel", "🎮 Gaming", "📸 Photography", 
  "🍳 Cooking", "💻 Coding", "🎨 Painting", "📚 Reading", "🏋️ Fitness", "🍿 Movies", "☕ Coffee"
];

export default function ProfileView({ user, onUpdateUser, posts, wallet, onLogOut }: ProfileViewProps) {
  // Filter timeline items authored specifically by logged-in user
  const myPosts = posts.filter(p => p.authorName === user.name);

  // Editing state toggles
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: user.bio || 'Exploring FaceNOTE. Reconnecting with old high-school friends! ✨',
    workplace: user.workplace || 'Software Engineer at FaceNote Technologies',
    education: user.education || 'Computer Science at Stanford University',
    currentCity: user.currentCity || 'Redwood City, California',
    hometown: user.hometown || 'Seattle, Washington',
    relationshipStatus: user.relationshipStatus || 'Single',
    website: user.website || 'https://facenote.io/me',
  });

  // Hobbies list state (initial loaded or default subset)
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(
    user.hobbies || ["⚽ Sports", "📱 Tech", "📸 Photography", "✈️ Travel"]
  );

  // Cover photo simulation state
  const [coverPhoto, setCoverPhoto] = useState<string>(
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
  );

  // Gallery images list
  const [gallery, setGallery] = useState<string[]>(DEFAULT_FEATURED_PHOTOS);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);

  // Save detailed information to state & trigger main callback
  const handleSaveInfo = () => {
    onUpdateUser({
      ...user,
      bio: editForm.bio,
      workplace: editForm.workplace,
      education: editForm.education,
      currentCity: editForm.currentCity,
      hometown: editForm.hometown,
      relationshipStatus: editForm.relationshipStatus,
      website: editForm.website,
      hobbies: selectedHobbies
    });
    setIsEditing(false);
  };

  // Toggle active hobby badge selection
  const handleToggleHobby = (hobby: string) => {
    let next: string[];
    if (selectedHobbies.includes(hobby)) {
      next = selectedHobbies.filter(h => h !== hobby);
    } else {
      next = [...selectedHobbies, hobby];
    }
    setSelectedHobbies(next);
    // Persist hobby update straight away
    onUpdateUser({
      ...user,
      hobbies: next
    });
  };

  // Handlers to add dynamic photo to gallery
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPhotoUrl.trim()) {
      setGallery(prev => [newPhotoUrl.trim(), ...prev]);
      setNewPhotoUrl('');
      setShowPhotoInput(false);
    }
  };

  // Helper template for cover styling swap
  const handleChangeCover = () => {
    const options = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    ];
    const currentIndex = options.indexOf(coverPhoto);
    const nextIndex = (currentIndex + 1) % options.length;
    setCoverPhoto(options[nextIndex]);
  };

  return (
    <div className="w-full h-full bg-slate-950 text-white overflow-y-auto no-scrollbar pb-24 animate-fade-in font-sans">
      
      {/* Cover Banner with camera trigger */}
      <div className="h-32 relative bg-slate-900 overflow-hidden group">
        <img 
          src={coverPhoto} 
          alt="Cover Art" 
          className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        
        <button
          onClick={handleChangeCover}
          title="Change cover background"
          className="absolute top-2.5 right-2.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-slate-300 hover:text-white transition-all text-[9.5px] font-bold flex items-center gap-1 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Change Cover</span>
        </button>

        {/* Floating Avatar Container */}
        <div className="absolute -bottom-10 left-6 z-10">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-22 h-22 rounded-full border-4 border-slate-950 object-cover bg-slate-900 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            {user.isFaceVerified && (
              <span className="absolute bottom-1 right-1 bg-blue-500 border-2 border-slate-950 rounded-full p-0.5 text-white animate-scale-up" title="Verified Account">
                <ShieldCheck className="w-4 h-4 text-white" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Layout Grid */}
      <div className="pt-12 px-5 pb-4 space-y-5">
        
        {/* Title Identity Block */}
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xl font-black tracking-tight text-white">{user.name}</h3>
              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8.5px] font-semibold uppercase px-2 py-0.5 rounded-full font-mono">
                Verified Profile
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">ID ref: FN_MEMBER_{Math.floor(29381 + (user.name.charCodeAt(0) * 12))}</p>
          </div>

          <button
            id="profile-toggle-edit"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-xl border text-[10.5px] font-bold flex items-center gap-1 transition-all ${
              isEditing 
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' 
                : 'bg-blue-600/15 border-blue-500/30 text-blue-400 hover:bg-blue-600/25 active:scale-95'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Short Custom Bio */}
        {!isEditing ? (
          <div className="bg-slate-900/50 hover:bg-slate-900 border border-slate-900 px-4 py-3 rounded-2xl">
            <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
              "{user.bio || editForm.bio}"
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl space-y-2">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">
              Short Bio Description
            </label>
            <textarea
              className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl p-2.5 text-xs text-white outline-none resize-none font-sans"
              rows={2}
              maxLength={150}
              placeholder="Tell your old friends what you have been up to..."
              value={editForm.bio}
              onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
            />
            <p className="text-[9px] text-zinc-600 text-right">{150 - editForm.bio.length} characters remaining</p>
          </div>
        )}

        {/* LIVE EDITOR COMPONENT PANEL */}
        {isEditing && (
          <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-4.5 space-y-4 shadow-xl">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <User2 className="w-4 h-4" /> Edit Personal Information
            </h4>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                  Workplace / Company
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none pl-9"
                    value={editForm.workplace}
                    onChange={e => setEditForm({...editForm, workplace: e.target.value})}
                  />
                  <Briefcase className="w-4 h-4 text-slate-650 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                  Education / University
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none pl-9"
                    value={editForm.education}
                    onChange={e => setEditForm({...editForm, education: e.target.value})}
                  />
                  <GraduationCap className="w-4 h-4 text-slate-650 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Current City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none pl-9"
                      value={editForm.currentCity}
                      onChange={e => setEditForm({...editForm, currentCity: e.target.value})}
                    />
                    <Home className="w-4 h-4 text-slate-650 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Hometown
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none pl-9"
                      value={editForm.hometown}
                      onChange={e => setEditForm({...editForm, hometown: e.target.value})}
                    />
                    <MapPin className="w-4 h-4 text-slate-650 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                  Relationship Status
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none pl-9 appearance-none cursor-pointer"
                    value={editForm.relationshipStatus}
                    onChange={e => setEditForm({...editForm, relationshipStatus: e.target.value})}
                  >
                    <option value="Single">Single</option>
                    <option value="In a relationship">In a relationship</option>
                    <option value="Married">Married</option>
                    <option value="Engaged">Engaged</option>
                    <option value="It's complicated">It's complicated</option>
                  </select>
                  <Heart className="w-4 h-4 text-slate-650 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">
                  Personal Website / Social Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white outline-none pl-9 font-mono"
                    value={editForm.website}
                    onChange={e => setEditForm({...editForm, website: e.target.value})}
                  />
                  <Link2 className="w-4 h-4 text-slate-650 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveInfo}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/10 active:scale-98"
            >
              <Check className="w-4 h-4" /> Save Professional Changes
            </button>
          </div>
        )}

        {/* THE "ABOUT INFO" DIRECTORY (Classic Facebook Visual Columns) */}
        {!isEditing && (
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4.5 space-y-4 shadow-lg text-left">
            <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pb-2 border-b border-slate-950 flex justify-between items-center">
              <span>Personal Details</span>
              <span className="text-zinc-650 text-[9.5px] font-mono select-none">Intro</span>
            </h4>

            <div className="space-y-3.5 text-xs text-slate-200">
              <div className="flex items-start gap-3">
                <Briefcase className="w-4.5 h-4.5 text-zinc-500 shrink-0 mt-0.5" />
                <p>
                  Works at <span className="font-semibold text-white">{user.workplace || editForm.workplace}</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="w-4.5 h-4.5 text-zinc-500 shrink-0 mt-0.5" />
                <p>
                  Studied <span className="font-semibold text-white">{user.education || editForm.education}</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Home className="w-4.5 h-4.5 text-zinc-500 shrink-0 mt-0.5" />
                <p>
                  Lives in <span className="font-semibold text-white">{user.currentCity || editForm.currentCity}</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-zinc-500 shrink-0 mt-0.5" />
                <p>
                  From <span className="font-semibold text-white">{user.hometown || editForm.hometown}</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Heart className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  Relationship status is <span className="font-semibold text-rose-400">{user.relationshipStatus || editForm.relationshipStatus}</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Link2 className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  Website: <a href={user.website || editForm.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-mono text-[11px] truncate inline-block max-w-[200px]">{user.website || editForm.website}</a>
                </p>
              </div>

              <div className="flex items-start gap-3 text-slate-400 pt-1.5 border-t border-slate-950/60">
                <Clock className="w-4.5 h-4.5 text-zinc-550 shrink-0 mt-0.5" />
                <p>
                  Joined FaceNOTE <span className="font-mono text-[10.5px]">June 15, 2026</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* HOBBIES BADGES CHIPS (Dynamic Selection) */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4.5 space-y-3.5 shadow-lg text-left">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" /> Hobbies & Interests
            </h4>
            <span className="text-[9.5px] text-zinc-600 font-bold">{selectedHobbies.length} selected</span>
          </div>

          {/* Current Hobbies List */}
          <div className="flex flex-wrap gap-2">
            {selectedHobbies.map(hobby => (
              <span 
                key={hobby}
                onClick={() => handleToggleHobby(hobby)}
                className="bg-blue-600/15 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-800 transition-all flex items-center gap-1 active:scale-95"
              >
                <span>{hobby}</span>
                <X className="w-3 h-3 text-red-400 hover:text-red-300 ml-1 shrink-0" />
              </span>
            ))}
          </div>

          {/* Recommended list to add to Hobbies */}
          <div className="pt-2.5 border-t border-slate-950/60">
            <p className="text-[9px] text-slate-500 uppercase tracking-wide font-extrabold mb-2">Toggle More Interests:</p>
            <div className="flex flex-wrap gap-1.5">
              {PREDEFINED_HOBBIES.filter(h => !selectedHobbies.includes(h)).map(hobby => (
                <button
                  key={hobby}
                  onClick={() => handleToggleHobby(hobby)}
                  className="bg-slate-950/50 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-850 px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3 text-slate-500" />
                  <span>{hobby}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURED PHOTO GALLERY CARD */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4.5 space-y-4 shadow-lg text-left">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Image className="w-4 h-4 text-slate-500" /> Featured Photos Grid
            </h4>
            
            <button
              onClick={() => setShowPhotoInput(!showPhotoInput)}
              className="bg-slate-950 hover:bg-slate-850 text-blue-400 hover:text-blue-300 border border-slate-850 text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              {showPhotoInput ? 'Cancel' : 'Add Photo'}
            </button>
          </div>

          {/* New Photo Link Inputs */}
          {showPhotoInput && (
            <form onSubmit={handleAddPhoto} className="p-3 bg-slate-950 rounded-xl border border-blue-500/20 space-y-2 animate-fade-in">
              <label className="block text-[9px] text-slate-400 font-bold uppercase">Insert Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none flex-1 font-mono"
                  value={newPhotoUrl}
                  onChange={e => setNewPhotoUrl(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-1 text-xs font-bold rounded-lg text-white"
                >
                  Confirm
                </button>
              </div>
              <p className="text-[8px] text-slate-500">Provide any public image URL to simulation list.</p>
            </form>
          )}

          {/* Pictures Grid Gallery */}
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((photo, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-950 bg-slate-950 hover:scale-102 group relative transition-all duration-200">
                <img 
                  src={photo} 
                  alt={`Gallery img ${idx}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Trash option to simulate removing images */}
                <button
                  onClick={() => setGallery(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute bottom-1 right-1 bg-black/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Remove image from gallery"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ACCOUNT CREDENTIAL DETAILS */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4.5 space-y-3.5 shadow-lg text-left">
          <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
            System Account Meta Info
          </h4>
          
          <div className="space-y-2.5 font-mono text-[10px]">
            <div className="flex items-center justify-between border-b border-slate-950 pb-2">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Checked Email
              </span>
              <span className="text-slate-300 font-medium truncate max-w-[180px]">{user.email || 'N/A'}</span>
            </div>

            {user.phoneNumber && (
              <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> SMS Verified Node
                </span>
                <span className="text-slate-300 font-medium">{user.phoneNumber}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400" /> Gateway Hash Pass
              </span>
              <span className="text-blue-400 font-semibold">{user.faceScanData || 'FN_CRED_APPROVED_SECURE_PASS'}</span>
            </div>
          </div>
        </div>

        {/* Self Timeline Feed list */}
        <div className="space-y-3.5 text-left">
          <h4 className="text-[10.5px] text-slate-400 uppercase tracking-widest font-extrabold pb-1.5 border-b border-slate-950">
            My Timeline Posts ({myPosts.length})
          </h4>

          {myPosts.length === 0 ? (
            <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-900 text-center">
              <p className="text-[10px] text-slate-500">You haven't posted any status updates yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myPosts.map(post => (
                <div key={post.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>{post.timestamp}</span>
                    <span className="bg-blue-600/15 border border-blue-600/25 text-blue-400 px-1.5 rounded text-[8px] font-mono">
                      {post.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">{post.content}</p>
                  
                  {post.mediaUrl && (
                    <div className="rounded-lg overflow-hidden border border-slate-950 max-h-[140px] bg-slate-950">
                      <img src={post.mediaUrl} className="w-full h-full object-cover" alt="Attachment" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout options */}
        <button
          id="profile-logout-btn"
          onClick={onLogOut}
          className="w-full bg-rose-950/40 hover:bg-rose-900/30 border border-rose-900/40 text-rose-400 hover:text-rose-300 py-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md"
        >
          <LogOut className="w-4 h-4" />
          Log Out of FaceNOTE
        </button>

      </div>
    </div>
  );
}
