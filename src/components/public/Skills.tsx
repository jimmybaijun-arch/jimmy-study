import React, { useMemo } from 'react';
import { Award, Sparkles, Layers } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Skills: React.FC = () => {
  const { skills } = usePortfolio();

  // Group skills by category
  const groupedSkills = useMemo(() => {
    const map = new Map<string, typeof skills>();
    skills.forEach((skill) => {
      const cat = skill.category || '核心技能';
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(skill);
    });
    return Array.from(map.entries());
  }, [skills]);

  return (
    <section id="skills" className="py-20 md:py-28 bg-[#FFFCF0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-200/60">
            <Award className="w-3.5 h-3.5 text-yellow-600" />
            <span>SKILLS & CAPABILITIES · 技能專長</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            我的技能與核心素養
          </h2>
          <p className="text-gray-600 text-base">
            包含程式開發、硬體創客實作、人工智慧工具應用以及跨領域核心素養能力。
          </p>
        </div>

        {/* Categorized Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {groupedSkills.map(([category, items]) => (
            <div
              key={category}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-yellow-200/80 shadow-xs hover:border-yellow-400 hover:shadow-md transition-all flex flex-col space-y-4"
            >
              <div className="flex items-center gap-2 text-gray-900 font-bold text-base pb-3 border-b border-gray-100">
                <Layers className="w-4 h-4 text-yellow-600" />
                <span>{category}</span>
                <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100 ml-auto">
                  {items.length} 項
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {items.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-gray-100/90 hover:bg-yellow-100 hover:text-yellow-950 text-gray-800 font-medium text-sm border border-transparent hover:border-yellow-200/80 shadow-2xs transition-colors"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
