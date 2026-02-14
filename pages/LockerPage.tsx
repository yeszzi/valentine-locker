
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import { LockerVisual } from '../components/LockerVisual';
import { storage } from '../services/storage';
import { Locker, GiftType, GiftSummary } from '../types';
import { Heart, CheckCircle, ArrowLeft, Star, PlusCircle, RefreshCw } from 'lucide-react';

export const LockerPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [locker, setLocker] = useState<Locker | null>(null);
  const [giftSummaries, setGiftSummaries] = useState<GiftSummary[]>([]);
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<GiftType | null>(null);
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (slug) {
      const found = storage.getLockerBySlug(slug);
      if (found) {
        setLocker(found);
        setGiftSummaries(storage.getGiftSummariesByLockerId(found.id));
      }
    }
  }, [slug]);

  if (!locker) return <Layout><div className="text-pink-500 font-bold text-center w-full bg-white/80 p-6 rounded-2xl shadow-xl">사물함을 찾을 수 없어요... 😢<br/><br/><button onClick={() => navigate('/create')} className="text-pink-600 underline text-sm">내 사물함 만들기</button></div></Layout>;

  const handleSend = async () => {
    if (!selectedType || !message.trim()) return;

    setIsSending(true);
    const newGift = {
      id: Math.random().toString(36).substring(2, 11),
      lockerId: locker.id,
      giftType: selectedType,
      senderName: isAnonymous ? '익명' : (senderName || '익명'),
      message: message.trim(),
      createdAt: Date.now()
    };

    setTimeout(() => {
      storage.saveGift(newGift);
      setIsSending(false);
      setIsSent(true);
      setIsFlowOpen(false);
      setGiftSummaries(prev => [...prev, { id: newGift.id, giftType: newGift.giftType, createdAt: newGift.createdAt }]);
    }, 1200);
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedType(null);
    setSenderName('');
    setMessage('');
    setIsSent(false);
    setIsFlowOpen(true);
  };

  const isMint = locker.theme === 'mint';
  const themeAccentColor = isMint ? 'text-teal-700' : 'text-pink-700';
  const themeSubColor = isMint ? 'text-teal-500' : 'text-pink-500';
  const themeBtnColor = isMint ? 'bg-teal-500 hover:bg-teal-600' : 'bg-pink-500 hover:bg-pink-600';

  return (
    <Layout theme={locker.theme}>
      <div className="flex flex-col items-center w-full relative">
        <header className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`inline-block ${isMint ? 'bg-teal-500' : 'bg-pink-500'} text-white text-[9px] font-bold px-2 py-0.5 rounded-full mb-1 uppercase`}
          >
            Valentine's Day
          </motion.div>
          <h1 className={`text-xl font-bold ${themeAccentColor} leading-tight`}>
            <span className={themeSubColor}>{locker.ownerName}</span>님의 사물함에<br/>마음을 전해주세요! 💝
          </h1>
        </header>

        <div className="relative mb-8">
          <LockerVisual ownerName={locker.ownerName} gifts={giftSummaries} theme={locker.theme} />
          
          <AnimatePresence>
            {isSending && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 300, x: 0 }}
                animate={{ opacity: 1, scale: 0.6, y: -80, rotate: 360 }}
                exit={{ opacity: 0, scale: 0.1, y: -120 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute left-1/2 -translate-x-1/2 bottom-0 text-7xl z-30 pointer-events-none drop-shadow-lg"
              >
                {selectedType === GiftType.NOTE && '✉️'}
                {selectedType === GiftType.CHOCO_BAR && '🍫'}
                {selectedType === GiftType.TEDDY_BEAR && '🧸'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isFlowOpen && !isSent && !isSending && (
          <button
            onClick={() => setIsFlowOpen(true)}
            className={`${themeBtnColor} text-white font-bold py-3.5 px-10 rounded-full shadow-lg transform active:scale-95 transition-all flex items-center gap-2 group text-sm`}
          >
            {isMint ? <Star size={18} fill="white" className="group-hover:scale-125 transition-transform" /> : <Heart size={18} fill="white" className="group-hover:scale-125 transition-transform" />}
            마음 선물하기
          </button>
        )}

        <AnimatePresence>
          {isFlowOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
              onClick={() => !isSending && setIsFlowOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFlowOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 300 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 300 }}
              className="w-full bg-white rounded-t-[2.5rem] shadow-2xl p-6 sm:p-8 fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto h-[75vh] flex flex-col"
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 flex-shrink-0" />
              
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => step === 2 ? setStep(1) : setIsFlowOpen(false)}
                  className={`p-1.5 rounded-full transition-colors ${isMint ? 'hover:bg-teal-50 text-teal-500' : 'hover:bg-pink-50 text-pink-500'}`}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${step === 1 ? (isMint ? 'bg-teal-500' : 'bg-pink-500') : 'bg-gray-100'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${step === 2 ? (isMint ? 'bg-teal-500' : 'bg-pink-500') : 'bg-gray-100'}`} />
                </div>
                <div className="w-8" />
              </div>

              {step === 1 ? (
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">어떤 선물을 보낼까요?</h3>
                  <p className="text-xs text-gray-400 mb-6 text-center">사물함 속에 쏙 들어갈 달콤한 선물입니다.</p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { type: GiftType.NOTE, icon: '✉️', label: '쪽지' },
                      { type: GiftType.CHOCO_BAR, icon: '🍫', label: '초콜릿' },
                      { type: GiftType.TEDDY_BEAR, icon: '🧸', label: '곰인형' },
                    ].map((item) => (
                      <motion.button
                        key={item.type}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedType(item.type)}
                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                          selectedType === item.type 
                            ? (isMint ? 'border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-50' : 'border-pink-500 bg-pink-50 shadow-md ring-2 ring-pink-50') 
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-4xl mb-2">{item.icon}</span>
                        <span className="text-xs font-bold text-gray-700">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <button
                      disabled={!selectedType}
                      onClick={() => setStep(2)}
                      className={`w-full ${themeBtnColor} text-white font-bold py-3.5 rounded-2xl shadow-lg disabled:bg-gray-200 transition-all text-sm`}
                    >
                      메시지 작성하기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">마음을 담아보세요</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5 px-1">
                        <label className="text-xs font-bold text-gray-600">보내는 분</label>
                        <label className={`flex items-center gap-1.5 text-[10px] ${themeSubColor} font-bold cursor-pointer`}>
                          <input 
                            type="checkbox" 
                            checked={isAnonymous} 
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            className={`w-3.5 h-3.5 rounded ${isMint ? 'accent-teal-500' : 'accent-pink-500'}`}
                          />
                          익명
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder={isAnonymous ? "익명으로 전달됩니다" : "이름을 적어주세요"}
                        disabled={isAnonymous}
                        className={`w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none transition-all disabled:bg-gray-50 text-sm ${isMint ? 'focus:border-teal-300' : 'focus:border-pink-300'}`}
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 px-1">전하고 싶은 말</label>
                      <div className="relative">
                        <textarea
                          placeholder="메시지를 남겨보세요!"
                          className={`w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:outline-none h-32 resize-none text-sm leading-relaxed ${isMint ? 'focus:border-teal-300' : 'focus:border-pink-300'}`}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          maxLength={200}
                        />
                        <div className="absolute bottom-3 right-4 text-[9px] font-bold text-gray-300">{message.length}/200</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <button
                      disabled={!message.trim() || isSending}
                      onClick={handleSend}
                      className={`w-full ${themeBtnColor} text-white font-bold py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 group text-sm`}
                    >
                      {isSending ? '넣는 중...' : '사물함에 몰래 넣기'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSent && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`mt-4 bg-white/95 backdrop-blur-sm p-6 rounded-[2.5rem] shadow-2xl border flex flex-col items-center w-full max-w-[300px] text-center mb-10 z-[60] ${isMint ? 'border-teal-100' : 'border-pink-100'}`}
            >
              <CheckCircle size={32} className={`${isMint ? 'text-teal-400' : 'text-green-400'} mb-3`} />
              <h4 className={`text-lg font-bold mb-1 ${isMint ? 'text-teal-600' : 'text-pink-600'}`}>전달 완료! 💘</h4>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed px-2">성공적으로 사물함에 넣었어요.<br/>친구의 사물함이 가득 찼겠네요!</p>
              
              <div className="space-y-2.5 w-full">
                <button
                  onClick={resetFlow}
                  className={`w-full ${themeBtnColor} text-white font-bold py-3 rounded-2xl shadow-md text-xs transition-all active:scale-95 flex items-center justify-center gap-2`}
                >
                  <RefreshCw size={14} />
                  선물 하나 더 보내기
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className={`w-full font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border-2 ${isMint ? 'bg-white border-teal-100 text-teal-500' : 'bg-white border-pink-100 text-pink-500'}`}
                >
                  <PlusCircle size={14} />
                  나도 사물함 만들기
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};
