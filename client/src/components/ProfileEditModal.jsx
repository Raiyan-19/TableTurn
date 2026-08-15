import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Crown,
  ChefHat,
  Save,
  Check,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReservation } from '../context/ReservationContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
];

// Helper to compress uploaded image to a lightweight crisp data URL
const compressImageFile = (file, maxWidth = 360, maxHeight = 360, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scale
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG data URL for compact size (< 40KB)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const ProfileEditModal = () => {
  const { user, updateUserProfile } = useAuth();
  const { isProfileModalOpen, setIsProfileModalOpen, showToast } = useReservation();

  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Password update fields
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync fields when modal opens or user updates
  useEffect(() => {
    if (user && isProfileModalOpen) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || PRESET_AVATARS[0]);
      setCustomAvatarUrl('');
      setShowCustomUrlInput(false);
      setUploadedFileName('');
      setShowPasswordSection(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
    }
  }, [user, isProfileModalOpen]);

  if (!isProfileModalOpen || !user) return null;

  const handleAvatarSelect = (url) => {
    setAvatar(url);
    setUploadedFileName('');
    setShowCustomUrlInput(false);
  };

  const handleCustomAvatarApply = () => {
    if (customAvatarUrl.trim()) {
      setAvatar(customAvatarUrl.trim());
      setUploadedFileName('');
      setShowCustomUrlInput(false);
    }
  };

  // Handle file selection from local device gallery or storage
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Limit raw upload to 12MB
    if (file.size > 12 * 1024 * 1024) {
      setErrorMsg('Image size too large. Please select a photo under 12MB.');
      return;
    }

    setIsProcessingFile(true);
    setErrorMsg('');
    try {
      const compressedDataUrl = await compressImageFile(file);
      setAvatar(compressedDataUrl);
      setUploadedFileName(file.name);
      setShowCustomUrlInput(false);
      showToast('Photo loaded from device successfully!', 'success');
    } catch (err) {
      console.error('File compression error:', err);
      setErrorMsg('Failed to process the chosen image. Please try another.');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Name cannot be empty.');
      return;
    }

    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(phone.trim())) {
      setErrorMsg('Please provide a valid Bangladeshi mobile number (e.g., 01712345678 or +8801712345678).');
      return;
    }

    if (showPasswordSection && (newPassword || currentPassword)) {
      if (!newPassword || newPassword.length < 6) {
        setErrorMsg('New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New passwords do not match.');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatar.trim(),
      };

      if (showPasswordSection && newPassword) {
        payload.password = newPassword.trim();
        if (currentPassword) {
          payload.currentPassword = currentPassword.trim();
        }
      }

      const res = await updateUserProfile(payload);
      if (res && res.success) {
        showToast('Account details updated successfully!', 'success');
        setIsProfileModalOpen(false);
      } else {
        setErrorMsg(res?.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-600 dark:text-gold-400 text-xs font-black uppercase tracking-wider shadow-sm">
          <Crown className="w-3.5 h-3.5" />
          Super Administrator
        </span>
      );
    }
    if (role === 'manager') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider shadow-sm">
          <ChefHat className="w-3.5 h-3.5" />
          Venue Manager
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider shadow-sm">
        <ShieldCheck className="w-3.5 h-3.5" />
        Verified Diner
      </span>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsProfileModalOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-10 my-6"
        >
          {/* Hidden File Input for Device Storage / Gallery */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          {/* Header Banner */}
          <div className="relative p-6 sm:p-7 bg-gradient-to-r from-amber-500/15 via-gold-500/10 to-transparent border-b border-slate-200 dark:border-white/10">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-600 dark:text-gold-400 flex items-center justify-center border border-gold-500/30 shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-display font-black text-slate-950 dark:text-white tracking-tight">
                  Account Profile Settings
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Manage your personal information, contact & security
                </p>
              </div>
            </div>

            <div className="mt-3">{getRoleBadge(user.role)}</div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
            
            {/* Error Notification */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-crimson-500/10 border border-crimson-500/30 flex items-center gap-3 text-xs text-crimson-600 dark:text-crimson-400 font-semibold"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Avatar Selection Section */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider flex items-center justify-between">
                <span>Profile Photo & Avatar</span>
                <span className="text-[10px] text-gold-600 dark:text-gold-400 font-mono font-medium lowercase">
                  Upload file or pick avatar
                </span>
              </label>

              {/* Current Selected Avatar Preview & Action Controls */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center gap-4 mb-4">
                <div className="relative shrink-0">
                  <img
                    src={avatar || PRESET_AVATARS[0]}
                    alt="Selected Avatar"
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-gold-500 shadow-glow-gold bg-slate-100 dark:bg-slate-900"
                    onError={(e) => {
                      e.target.src = PRESET_AVATARS[0];
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold-500 text-slate-950 flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                      <span>Active Photo</span>
                      {uploadedFileName && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 truncate max-w-[140px]">
                          Device: {uploadedFileName}
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Upload from phone/PC storage or choose a styled avatar below
                    </p>
                  </div>

                  {/* Action Buttons: Device Gallery Upload & Custom URL */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isProcessingFile}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-gold-500 text-white hover:text-slate-950 dark:bg-gold-500/20 dark:hover:bg-gold-500 dark:text-gold-400 dark:hover:text-slate-950 border border-slate-800 dark:border-gold-500/40 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                    >
                      {isProcessingFile ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Upload From Gallery</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3 text-gold-500" />
                      <span>{showCustomUrlInput ? 'Hide URL' : 'Image URL'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Image URL Input (collapsible) */}
              {showCustomUrlInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4 flex gap-2"
                >
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="button"
                    onClick={handleCustomAvatarApply}
                    className="px-3.5 py-2 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs shadow-sm hover:bg-gold-400 transition-colors"
                  >
                    Apply
                  </button>
                </motion.div>
              )}

              {/* Preset Avatar Grid */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Or pick a preset avatar:
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PRESET_AVATARS.map((imgUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleAvatarSelect(imgUrl)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all hover:scale-105 ${
                        avatar === imgUrl && !uploadedFileName
                          ? 'border-gold-500 ring-2 ring-gold-500/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-4">
              
              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                  />
                </div>
              </div>

              {/* Email Address (Read-only / Verified) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Email Address
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Primary
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Mobile Phone Field */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider">
                  Bangladeshi Mobile Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712345678 or +8801712345678"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Used for instant SMS and WhatsApp table confirmations.
                </p>
              </div>

            </div>

            {/* Optional Password Update Section */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-gold-500" />
                  <span>{showPasswordSection ? 'Hide Password Change' : 'Change Password'}</span>
                </span>
                <span className="text-[11px] text-gold-600 dark:text-gold-400 font-mono">
                  {showPasswordSection ? '▲' : '▼'}
                </span>
              </button>

              <AnimatePresence>
                {showPasswordSection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3 p-3.5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5"
                  >
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPw ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 pr-10 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        New Password (Min 6 chars)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPw ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 pr-10 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || isProcessingFile}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-slate-950 font-extrabold text-xs shadow-glow-gold transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
