import React from 'react';
import { User, Compass, BookOpen, Target, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const About: React.FC = () => {
  const { profile } = usePortfolio();

  return (
    <section id="about" className="py-20 md:py-28 bg-[#FFFDF5] border-y border-yellow-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-200/60">
            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
            <span>ABOUT ME · 關於我</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            關於我與我的學習旅程
          </h2>
          <p className="text-gray-600 text-base">
            記錄我的探索方向、目前累積的經驗，以及對未來的期許與熱情。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-xs border border-yellow-200/80 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">個人簡介</h3>
                <p className="text-xs text-gray-500 font-medium">{profile.school} · {profile.grade}</p>
              </div>
            </div>

            <div className="prose prose-yellow max-w-none text-gray-700 leading-relaxed space-y-4 text-base">
              {profile.aboutMe ? (
                profile.aboutMe.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>熱愛科技與動手實作的高中生，持續探索各種有趣的程式專案與生活應用。</p>
              )}
            </div>
          </div>

          {/* Three Pillar Cards */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Learning Focus */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-yellow-200/80 space-y-2 hover:border-yellow-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5 text-yellow-800">
                <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                  <Compass className="w-4.5 h-4.5 text-yellow-700" />
                </div>
                <h4 className="font-bold text-base text-gray-900">核心學習方向</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-11.5">
                {profile.learningFocus || '結合程式設計與硬體感測，發展解決實際問題的專題能力。'}
              </p>
            </div>

            {/* Current Learning */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-yellow-200/80 space-y-2 hover:border-yellow-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5 text-yellow-800">
                <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4.5 h-4.5 text-yellow-700" />
                </div>
                <h4 className="font-bold text-base text-gray-900">目前正在精進</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-11.5">
                {profile.currentLearning || '現代 Web 開發技術、生成式 AI 工具應用、以及演算法邏輯思維。'}
              </p>
            </div>

            {/* Future Goals */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-yellow-200/80 space-y-2 hover:border-yellow-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-2.5 text-yellow-800">
                <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                  <Target className="w-4.5 h-4.5 text-yellow-700" />
                </div>
                <h4 className="font-bold text-base text-gray-900">未來想挑戰的事</h4>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-11.5">
                {profile.futureGoals || '代表學校參加全國性科技專案競賽，打造真正有影響力的開源工具。'}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
