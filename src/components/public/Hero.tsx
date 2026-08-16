import React from 'react';
import { ArrowDown, Code2, Camera, Bot, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Hero: React.FC = () => {
  const { profile } = usePortfolio();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-yellow-200/40 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-yellow-300/25 blur-2xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Vibrant Palette Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Bold Vibrant Yellow Hero Card */}
          <div className="lg:col-span-7 bg-yellow-400 rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[380px]">
            <div className="relative z-10 space-y-4">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-semibold tracking-wide border border-white/30">
                <GraduationCap className="w-4 h-4" />
                <span>{profile.school} · {profile.grade}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                HELLO,<br />I'M {profile.name}
              </h1>

              {/* Tagline */}
              <p className="text-yellow-100 text-base sm:text-lg leading-relaxed max-w-xl">
                {profile.tagline || '喜歡透過科技與創作，解決生活中的問題。'}
              </p>

              {/* Tags with white/20 overlay */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-medium border border-white/25">
                  <Code2 className="w-3.5 h-3.5" /> # 程式設計
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-medium border border-white/25">
                  <Bot className="w-3.5 h-3.5" /> # 機器人與 AI
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-medium border border-white/25">
                  <Camera className="w-3.5 h-3.5" /> # 攝影創作
                </span>
              </div>

            </div>

            {/* Action buttons */}
            <div className="relative z-10 flex flex-wrap items-center gap-3 pt-6">
              <a
                id="hero-cta-projects"
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 hover:bg-black active:scale-98 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>探索精選作品</span>
              </a>
              <a
                id="hero-cta-about"
                href="#about"
                onClick={(e) => handleScrollTo(e, '#about')}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-white hover:bg-yellow-50 active:scale-98 text-gray-900 font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                <span>認識我的故事</span>
                <ArrowDown className="w-4 h-4 text-gray-700" />
              </a>
            </div>

            {/* Decorative Organic Circle in background */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-yellow-300 rounded-full opacity-60 pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-500/30 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Right Column: Profile Photo Card & Highlights */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-yellow-200/80 flex flex-col justify-between space-y-6">
            
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-yellow-100 border-2 border-yellow-300 shadow-sm shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-400 text-white text-3xl font-black">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-yellow-800 bg-yellow-100 px-2.5 py-0.5 rounded-md">
                    個人檔案
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 truncate">
                  {profile.name}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-yellow-600" />
                  <span>{profile.school}</span>
                </p>
              </div>
            </div>

            {/* Quick Introduction Snippet */}
            <div className="bg-[#FFFCF0] p-4 rounded-2xl border border-yellow-100 text-sm text-gray-700 leading-relaxed">
              <p>
                專注於程式設計、開源硬體感測與生成式 AI 的自主探索。喜歡把抽象的點子化為具體可運作的專案！
              </p>
            </div>

            {/* Core Values / Focus Badges */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>自主學習歷程檔案</span>
              <span className="text-yellow-600 font-bold">高一成果專案</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
