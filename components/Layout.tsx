
import React, { useMemo } from 'react';
import { ThemeType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  theme?: ThemeType;
}

export const Layout: React.FC<LayoutProps> = ({ children, theme = 'pink' }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 10}s`,
      scale: 0.5 + Math.random()
    }));
  }, []);

  const isMint = theme === 'mint';
  const particleChar = isMint ? '⭐' : '❤';
  const bgColor = isMint ? 'bg-[#e0f7fa]' : 'bg-[#fce4ec]';
  const floorColor = isMint ? 'bg-[#b2ebf2]' : 'bg-[#f8bbd0]';
  const accentBlur1 = isMint ? 'bg-teal-300' : 'bg-pink-400';
  const accentBlur2 = isMint ? 'bg-cyan-200' : 'bg-rose-300';
  const particleColor = isMint ? 'text-teal-400' : 'text-pink-400';

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${bgColor} transition-colors duration-500`}>
      {/* Floating Particles Background */}
      {particles.map(p => (
        <div 
          key={p.id}
          className={`heart-particle select-none ${particleColor}`}
          style={{ 
            left: p.left, 
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `scale(${p.scale})`,
            bottom: '-5%'
          }}
        >
          {particleChar}
        </div>
      ))}

      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className={`absolute top-10 left-10 w-20 h-20 ${accentBlur1} rounded-full blur-3xl`}></div>
        <div className={`absolute bottom-20 right-10 w-32 h-32 ${accentBlur2} rounded-full blur-3xl`}></div>
      </div>
      
      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-6">
        {children}
      </main>
      
      {/* Creator Credit */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none select-none z-[60]">
        <div className="px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-[1px]">
          <span className={`${isMint ? 'text-teal-600/20' : 'text-pink-600/20'} text-[10px] font-bold tracking-[0.5em] uppercase`}>
            @yes.zzi
          </span>
        </div>
      </div>

      {/* Decorative Floor/Corridor Line */}
      <div className={`fixed bottom-0 left-0 right-0 h-24 ${floorColor} -z-0 transition-colors duration-500`}>
        <div className={`h-2 ${isMint ? 'bg-teal-100' : 'bg-pink-200'} w-full`}></div>
      </div>
    </div>
  );
};
