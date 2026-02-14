
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftType, GiftSummary, ThemeType } from '../types';

interface LockerVisualProps {
  ownerName: string;
  isOpening?: boolean;
  gifts?: GiftSummary[];
  onClickGift?: (giftId: string) => void;
  onClickDoor?: () => void;
  variant?: 'main' | 'background';
  theme?: ThemeType;
}

const GiftIcon: React.FC<{ 
  type: GiftType, 
  style: React.CSSProperties, 
  onClick?: () => void,
  disabled?: boolean,
  isOpening?: boolean
}> = ({ type, style, onClick, disabled, isOpening }) => {
  const icons = {
    [GiftType.NOTE]: '✉️',
    [GiftType.CHOCO_BAR]: '🍫',
    [GiftType.TEDDY_BEAR]: '🧸',
  };
  return (
    <motion.button
      animate={{ scale: isOpening ? 1.1 : 1 }}
      whileHover={!disabled ? { scale: 1.25, zIndex: 100 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`absolute text-4xl sm:text-5xl drop-shadow-md select-none transition-transform focus:outline-none ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
      style={style}
    >
      {icons[type]}
    </motion.button>
  );
};

export const LockerVisual: React.FC<LockerVisualProps> = ({ 
  ownerName, 
  isOpening = false, 
  gifts = [], 
  onClickGift,
  onClickDoor,
  variant = 'main',
  theme = 'pink'
}) => {
  const isMain = variant === 'main';
  const isMint = theme === 'mint';
  
  // Theme-based colors
  const colors = isMint ? {
    border: 'border-teal-300',
    interiorBase: isOpening ? '#f0fdfa' : '#e0f2f1',
    interiorBorder: 'border-teal-200',
    interiorGradientTo: 'to-teal-300/30',
    doorBg: 'bg-teal-200',
    doorBorder: 'border-teal-300',
    namePlateBorder: 'border-teal-100',
    namePlateText: 'text-teal-600',
    windowBorder: 'border-teal-300/30',
    handle: 'bg-teal-400',
    handleInner: 'bg-teal-300/50'
  } : {
    border: 'border-pink-300',
    interiorBase: isOpening ? '#fff1f2' : '#fce4ec',
    interiorBorder: 'border-pink-200',
    interiorGradientTo: 'to-pink-300/30',
    doorBg: 'bg-pink-200',
    doorBorder: 'border-pink-300',
    namePlateBorder: 'border-pink-100',
    namePlateText: 'text-pink-600',
    windowBorder: 'border-pink-300/30',
    handle: 'bg-pink-400',
    handleInner: 'bg-pink-300/50'
  };

  const getGiftStyle = (index: number) => {
    const itemsPerRow = 3; 
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    const baseY = 78 - (row * 18); 
    const baseX = 22 + (col * 28); 
    const randomSeed = Math.sin(index * 123.456);
    const offsetX = randomSeed * 6;
    const offsetY = Math.cos(index * 456.789) * 3;
    const rotation = randomSeed * 15;
    return {
      left: `${baseX + offsetX}%`,
      top: `${baseY + offsetY}%`,
      transform: `rotate(${rotation}deg) translate(-50%, -50%)`,
      zIndex: index,
    };
  };

  const displayedGifts = gifts.slice(0, 12); 
  const extraCount = gifts.length - 12;

  return (
    <motion.div 
      animate={{ 
        scale: isOpening ? 1.15 : 1,
        y: isOpening ? 20 : 0 
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className={`relative ${isMain ? 'w-64 h-[320px]' : 'w-40 h-[240px] opacity-40'} flex-shrink-0 transition-all duration-500`}
    >
      {/* Locker Box Body (Interior) */}
      <motion.div 
        animate={{ 
          backgroundColor: colors.interiorBase,
          boxShadow: isOpening ? `0px 20px 40px ${isMint ? 'rgba(20,184,166,0.3)' : 'rgba(244,114,182,0.3)'}` : "0px 10px 20px rgba(0,0,0,0.1)"
        }}
        className={`absolute inset-0 ${colors.border} border-4 rounded-lg overflow-hidden z-10`}
      >
        <div className={`absolute inset-0 bg-gradient-to-b from-white/20 ${colors.interiorGradientTo}`}></div>
        <div className={`absolute inset-2 ${isMint ? 'bg-teal-900/10' : 'bg-pink-900/10'} rounded border ${isMint ? 'border-teal-900/5' : 'border-pink-900/5'}`}></div>
        
        {/* Gifts Pile */}
        <div className="absolute inset-0 p-4">
          {displayedGifts.map((gift, idx) => (
            <GiftIcon 
              key={gift.id} 
              type={gift.giftType} 
              style={getGiftStyle(idx)} 
              disabled={!isOpening}
              isOpening={isOpening}
              onClick={() => isOpening && onClickGift?.(gift.id)}
            />
          ))}
          
          {extraCount > 0 && (
            <div className={`absolute top-2 right-2 ${isMint ? 'bg-teal-500' : 'bg-rose-500'} text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm z-[110]`}>
              +{extraCount}
            </div>
          )}
        </div>
      </motion.div>

      {/* Locker Door */}
      <motion.div 
        onClick={() => !isOpening && onClickDoor?.()}
        className={`absolute inset-0 ${colors.doorBg} border-4 ${colors.doorBorder} rounded-lg shadow-inner z-20 flex flex-col items-center justify-start pt-5 origin-left ${!isOpening ? 'cursor-pointer' : ''}`}
        initial={false}
        animate={{ 
          rotateY: isOpening ? -125 : 0, 
          x: isOpening ? -15 : 0, 
          boxShadow: isOpening ? "0px 0px 0px rgba(0,0,0,0)" : "10px 0px 30px rgba(0,0,0,0.1)"
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 14 }}
        style={{ perspective: '1200px', backfaceVisibility: 'hidden' }}
      >
        {/* Air vents */}
        <div className={`w-8 h-1 ${isMint ? 'bg-teal-300' : 'bg-pink-300'} rounded-full mb-1 opacity-60`}></div>
        <div className={`w-8 h-1 ${isMint ? 'bg-teal-300' : 'bg-pink-300'} rounded-full mb-3 opacity-60`}></div>

        {/* Name Plate */}
        <div className={`w-44 h-10 bg-white border-2 ${colors.namePlateBorder} shadow-sm flex items-center justify-center p-2 relative mb-3`}>
          <AnimatePresence mode="wait">
            {ownerName ? (
              <motion.span
                key={ownerName}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className={`text-base font-bold ${colors.namePlateText} truncate px-2`}
              >
                {ownerName}
              </motion.span>
            ) : (
              <span className="text-gray-300 text-[10px]">이름표</span>
            )}
          </AnimatePresence>
        </div>

        {/* Heart Window (Glass) */}
        <div className={`w-32 h-28 bg-white/20 border-2 ${colors.windowBorder} rounded-2xl backdrop-blur-[1px] shadow-inner flex items-center justify-center overflow-hidden relative`}>
           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
           <div className="absolute -top-10 -left-10 w-20 h-40 bg-white/10 rotate-45 pointer-events-none"></div>
           
           {!isOpening && (
             <div className="w-full h-full relative opacity-60 pointer-events-none scale-90">
                {displayedGifts.slice(0, 9).map((gift, idx) => (
                  <div 
                    key={`win-${gift.id}`} 
                    className="absolute text-2xl"
                    style={getGiftStyle(idx)} 
                  >
                    {gift.giftType === GiftType.NOTE ? '✉️' : gift.giftType === GiftType.CHOCO_BAR ? '🍫' : '🧸'}
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Handle */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-10 ${colors.handle} rounded-full shadow-md flex items-center justify-center`}>
          <div className={`w-0.5 h-5 ${colors.handleInner} rounded-full`}></div>
        </div>
      </motion.div>
    </motion.div>
  );
};
