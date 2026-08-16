import React from 'react';
import { Milestone, Calendar, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Timeline: React.FC = () => {
  const { timeline } = usePortfolio();

  return (
    <section id="timeline" className="py-20 md:py-28 bg-[#FFFDF5] border-y border-yellow-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-200/60">
            <Milestone className="w-3.5 h-3.5 text-yellow-600" />
            <span>LEARNING JOURNEY · 成長軌跡</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            我的學習歷程與里程碑
          </h2>
          <p className="text-gray-600 text-base">
            記錄從第一次接觸科技探索、社團實作、專案發表到未來目標的成長軌跡。
          </p>
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-2 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-yellow-300">
          {timeline.map((item, index) => (
            <div key={item.id} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-6 sm:-left-10 top-1.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-yellow-400 border-4 border-white shadow-xs flex items-center justify-center -translate-x-1/2 group-hover:scale-125 transition-transform duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
              </div>

              {/* Timeline Event Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-yellow-200/80 shadow-xs hover:border-yellow-400 hover:shadow-md transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  {/* Year badge */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-900 bg-yellow-100 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-yellow-700" />
                    <span>{item.year}</span>
                  </div>
                  {/* Category */}
                  {item.category && (
                    <span className="text-xs font-semibold text-gray-500 bg-yellow-50 px-2.5 py-0.5 rounded-md border border-yellow-100">
                      {item.category}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
