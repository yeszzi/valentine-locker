
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LockerVisual } from '../components/LockerVisual';
import { storage } from '../services/storage';
import { ThemeType } from '../types';
import { Copy, Heart, Star, Share2, Lock, ArrowRight } from 'lucide-react';

export const CreatePage: React.FC = () => {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState<ThemeType>('pink');
  const [createdLocker, setCreatedLocker] = useState<{ slug: string, token: string } | null>(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name.trim() || name.length > 10) return;

    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 6)}`;
    const token = `ot_${Math.random().toString(36).substring(2, 15)}`;
    
    const newLocker = {
      id: Math.random().toString(36).substring(2, 9),
      slug,
      ownerName: name.trim(),
      ownerToken: token,
      theme: theme,
      createdAt: Date.now()
    };

    storage.saveLocker(newLocker);
    setCreatedLocker({ slug, token });
  };

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    alert(msg);
  };

  const handleNativeShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '발렌타인 사물함',
          text: `${name}님의 사물함에 익명 선물을 남겨보세요! 💝`,
          url: url,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      copyToClipboard(url, '링크가 복사되었습니다! 친구에게 전달해보세요. 💌');
    }
  };

  const shareUrl = `${window.location.origin}/#/locker/${createdLocker?.slug}`;
  const ownerUrl = `${window.location.origin}/#/owner/${createdLocker?.token}`;
  
  const isMint = theme === 'mint';
  const themeAccentColor = isMint ? 'text-teal-600' : 'text-pink-600';
  const themeSubColor = isMint ? 'text-teal-400' : 'text-pink-400';
  const themeBtnColor = isMint ? 'bg-teal-500 hover:bg-teal-600' : 'bg-pink-500 hover:bg-pink-600';

  return (
    <Layout theme={theme}>
      <div className="flex flex-col items-center w-full">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className={`text-xl sm:text-2xl font-bold ${themeAccentColor} leading-tight transition-colors duration-500`}>
            나만의 발렌타인 <br/>사물함을 만들어보세요
          </h1>
          <p className={`${themeSubColor} text-[10px] mt-1 opacity-80 transition-colors duration-500 uppercase tracking-widest`}>Secret Locker Service</p>
        </motion.div>

        <div className="relative w-full flex items-center justify-center mb-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <LockerVisual ownerName={name} variant="main" theme={theme} />
          </motion.div>
        </div>

        <div className="w-full bg-white/85 backdrop-blur-md rounded-[2rem] p-4 shadow-xl border border-white/50 max-w-[320px]">
          {!createdLocker ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className={`text-[9px] font-bold ${themeSubColor} uppercase tracking-widest transition-colors`}>Theme</label>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setTheme('pink')}
                    className={`flex items-center justify-center w-8 h-7 rounded-lg border-2 transition-all ${theme === 'pink' ? 'border-pink-400 bg-pink-50 text-pink-500 shadow-sm' : 'border-gray-50 bg-gray-50 text-gray-200'}`}
                  >
                    <Heart size={12} fill={theme === 'pink' ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={() => setTheme('mint')}
                    className={`flex items-center justify-center w-8 h-7 rounded-lg border-2 transition-all ${theme === 'mint' ? 'border-teal-400 bg-teal-50 text-teal-500 shadow-sm' : 'border-gray-50 bg-gray-50 text-gray-200'}`}
                  >
                    <Star size={12} fill={theme === 'mint' ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-[9px] font-bold ${themeSubColor} mb-1 ml-1 uppercase tracking-widest transition-colors`}>Locker Name</label>
                <input
                  type="text"
                  placeholder=""
                  className={`w-full px-4 py-2 rounded-xl border-2 transition-all text-center text-base font-bold placeholder:text-gray-200 ${isMint ? 'border-teal-50 focus:border-teal-300 text-teal-700' : 'border-pink-50 focus:border-pink-300 text-pink-700'} bg-white/50 focus:outline-none`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={10}
                />
              </div>

              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                className={`w-full ${themeBtnColor} disabled:bg-gray-200 text-white font-bold py-2.5 rounded-xl shadow-md transform active:scale-95 transition-all flex items-center justify-center gap-2 text-sm`}
              >
                {isMint ? <Star size={16} fill="currentColor" /> : <Heart size={16} fill="currentColor" />}
                내 사물함 만들기
              </button>
            </div>
          ) : (
            <div className="space-y-5 py-2">
              <div className="text-center mb-1">
                <h2 className={`text-base font-bold ${themeAccentColor} transition-colors`}>사물함 생성 완료! 💝</h2>
                <p className="text-[10px] text-gray-400 leading-tight">아래 링크를 복사하거나 공유해보세요.</p>
              </div>

              {/* Share Link Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 ml-1">
                  <Share2 size={10} className={themeSubColor} />
                  <label className={`text-[9px] font-bold ${themeSubColor} uppercase tracking-wider`}>친구들에게 공유하기</label>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className={`col-span-4 flex items-center bg-white p-1 rounded-xl border ${isMint ? 'border-teal-100' : 'border-pink-100'} overflow-hidden`}>
                    <span className={`flex-1 text-[10px] ${themeAccentColor} truncate font-medium ml-2`}>{shareUrl}</span>
                    <button 
                      onClick={() => copyToClipboard(shareUrl, '공유 링크가 복사되었습니다! 💌')}
                      className={`p-1.5 rounded-lg transition-colors ${isMint ? 'text-teal-500 hover:bg-teal-50' : 'text-pink-500 hover:bg-pink-50'}`}
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                  <button 
                    onClick={() => handleNativeShare(shareUrl)}
                    className={`col-span-1 flex items-center justify-center rounded-xl transition-colors text-white ${themeBtnColor}`}
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              </div>

              {/* Management Link Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 ml-1">
                  <Lock size={10} className="text-gray-400" />
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">나만 볼 수 있는 관리 링크</label>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 overflow-hidden">
                  <span className="flex-1 text-[10px] text-gray-400 truncate font-medium ml-2">{ownerUrl}</span>
                  <button 
                    onClick={() => copyToClipboard(ownerUrl, '관리 링크가 복사되었습니다! 메모장에 꼭 저장해 두세요. 🔒')}
                    className="p-1.5 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <p className="text-[8px] text-rose-400 px-1 font-medium leading-tight">
                  * 메시지 확인을 위해 위 링크를 반드시 따로 저장해 주세요!
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/owner/${createdLocker.token}`)}
                  className={`w-full ${themeBtnColor} text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs group`}
                >
                  사물함으로 바로가기
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
