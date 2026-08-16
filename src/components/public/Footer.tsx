import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { profile } = usePortfolio();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-600 py-12 border-t border-yellow-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        
        {/* Left Side: Name and School */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-400 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            {profile.name ? profile.name.charAt(0) : '黃'}
          </div>
          <div className="space-y-0.5">
            <p className="text-gray-900 font-bold text-sm">
              {profile.name} · 學生學習歷程檔案
            </p>
            <p className="text-xs text-gray-500">
              {profile.school} · {profile.grade}
            </p>
          </div>
        </div>

        {/* Right Side: Designed by */}
        <div className="text-xs text-gray-500 space-y-1 sm:text-right">
          <p>自主學習成果 · Powered by Firebase & React</p>
          <p className="text-gray-400">© {currentYear} {profile.name}. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
};
