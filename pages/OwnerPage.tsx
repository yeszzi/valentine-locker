
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { LockerVisual } from '../components/LockerVisual';
import { storage } from '../services/storage';
import { Locker, Gift, GiftType } from '../types';
import { ChevronLeft, ChevronRight, X, Heart, Star } from 'lucide-react';

export const OwnerPage: React.FC = () => {
  const { ownerToken } = useParams<{ ownerToken: string }>();
  const navigate = useNavigate();
  const [locker, setLocker] = useState<Locker | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGiftIndex, setSelectedGiftIndex] = useState<number | null>(null);

  useEffect(() => {
    if (ownerToken) {
      const found = storage.getLockerByToken(ownerToken);
      if (found) {
        setLocker(found);
        setGifts(storage.getFullGiftsByLockerToken(ownerToken));
      }
    }
  }, [ownerToken]);

  if (!locker) {
    return (
      <Layout>
        <div className="flex flex-col items-center">
          <p className="text-pink-500 font-bold mb-4">비정상적인 접근입니다.</p>
          <button onClick={() => navigate('/create')} className="text-pink-600 underline">사물함 만들러 가기</button>
        </div>
      </Layout>
    );
  }

  const selectedGift = selectedGiftIndex !== null ? gifts[selectedGiftIndex] : null;

  const handleGiftClick = (giftId: string) => {
    const idx = gifts.findIndex(g => g.id === giftId);
    if (idx !== -1) {
      setSelectedGiftIndex(idx);
    }
  };

  const navigateGift = (dir: 'next' | 'prev') => {
    if (selectedGiftIndex === null) return;
    if (dir === 'next' && selectedGiftIndex < gifts.length - 1) setSelectedGiftIndex(selectedGiftIndex + 1);
    if (dir === 'prev' && selectedGiftIndex > 0) setSelectedGiftIndex(selectedGiftIndex - 1);
  };

  const formatDate = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return '방금 전';
    if (mins < 60) return `${mins}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  const getGiftEmoji = (type: GiftType) => {
    switch (type) {
      case GiftType.NOTE: return '✉️';
      case GiftType.CHOCO_BAR: return '🍫';
      case GiftType.TEDDY_BEAR: return '🧸';
    }
  };

  const isMint = locker.theme === 'mint';
  const themeAccentColor = isMint ? 'text-teal-700' : 'text-pink-700';
  const themeSubColor = isMint ? 'text-teal-400' : 'text-pink-400';
  const themeBtnColor = isMint ? 'bg-teal-500 hover:bg-teal-600' : 'bg-pink-500 hover:bg-pink-600';
  const modalAccentColor = isMint ? 'bg-teal-400' : 'bg-pink-400';
  const modalTextColor = isMint ? 'text-teal-600' : 'text-pink-600';

  return (
    <Layout theme={locker.theme}>
      <div className="flex flex-col items-center w-full">
        <header className="text-center mb-6">
          <h1 className={`text-xl font-bold ${themeAccentColor}`}>
            {locker.ownerName}님의 사물함
          </h1>
          <p className={`text-xs ${themeSubColor}`}>{gifts.length}개의 마음이 도착했어요</p>
        </header>

        {/* Locker Display Section */}
        <div className={`relative transition-all duration-700 ${isOpen ? 'mb-12' : 'mb-4'}`}>
          <LockerVisual 
            ownerName={locker.ownerName} 
            isOpening={isOpen} 
            gifts={gifts.map(g => ({ id: g.id, giftType: g.giftType, createdAt: g.createdAt }))}
            onClickGift={handleGiftClick}
            onClickDoor={() => setIsOpen(true)}
            theme={locker.theme}
          />
        </div>

        {/* Actions / Instructions Section */}
        <div className="w-full flex flex-col items-center justify-center pt-8">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.button
                key="open-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setIsOpen(true)}
                className={`${themeBtnColor} text-white font-bold py-3.5 px-10 rounded-full shadow-lg transition-all active:scale-95 text-sm`}
              >
                사물함 열어보기
              </motion.button>
            ) : (
              <motion.div
                key="instruction-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <p className={`${isMint ? 'text-teal-500' : 'text-pink-500'} font-bold text-xs animate-bounce text-center opacity-80`}>
                  👇 선물을 눌러 메시지를 확인하세요!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gift Detail Modal */}
        <AnimatePresence>
          {selectedGiftIndex !== null && selectedGift && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedGiftIndex(null)}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className={`h-24 ${modalAccentColor} flex items-center justify-center text-6xl transition-colors duration-500`}>
                  {getGiftEmoji(selectedGift.giftType)}
                </div>
                <button 
                  onClick={() => setSelectedGiftIndex(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                >
                  <X size={20} />
                </button>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className={`font-bold text-base ${modalTextColor} transition-colors`}>From. {selectedGift.senderName}</h4>
                      <p className="text-[9px] text-gray-400 uppercase tracking-tighter">{formatDate(selectedGift.createdAt)}</p>
                    </div>
                    {isMint ? <Star size={18} fill="#2dd4bf" className="text-teal-400" /> : <Heart size={18} fill="#f472b6" className="text-pink-400" />}
                  </div>
                  
                  <div className={`${isMint ? 'bg-teal-50 border-teal-100 text-teal-900' : 'bg-pink-50 border-pink-100 text-pink-900'} p-5 rounded-2xl min-h-[120px] font-handwriting text-2xl leading-relaxed shadow-inner border italic transition-colors`}>
                    {selectedGift.message}
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <button 
                      disabled={selectedGiftIndex === 0}
                      onClick={() => navigateGift('prev')}
                      className={`p-1.5 rounded-full border-2 disabled:opacity-30 ${isMint ? 'border-teal-100 text-teal-400' : 'border-pink-100 text-pink-400'}`}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-[10px] font-bold text-gray-300">{selectedGiftIndex + 1} / {gifts.length}</span>
                    <button 
                      disabled={selectedGiftIndex === gifts.length - 1}
                      onClick={() => navigateGift('next')}
                      className={`p-1.5 rounded-full border-2 disabled:opacity-30 ${isMint ? 'border-teal-100 text-teal-400' : 'border-pink-100 text-pink-400'}`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};
