import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Calendar, 
  Tag, 
  ArrowRight, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Video, 
  ImageIcon, 
  ExternalLink 
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, ProjectImage } from '../../types';
import { parseGoogleDriveVideoUrl } from '../../utils/driveVideo';

export const Projects: React.FC = () => {
  const { projects, fetchProjectImages } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ProjectImage[]>([]);
  const [activeImageZoom, setActiveImageZoom] = useState<string | null>(null);

  // Load project images when a project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchProjectImages(selectedProject.id).then((imgs) => {
        setAdditionalImages(imgs);
      });
    } else {
      setAdditionalImages([]);
    }
  }, [selectedProject, fetchProjectImages]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="py-20 md:py-28 bg-[#FFFCF0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold border border-yellow-200/60">
            <FolderGit2 className="w-3.5 h-3.5 text-yellow-600" />
            <span>PORTFOLIO · 作品專區</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            我的精選專案與作品
          </h2>
          <p className="text-gray-600 text-base">
            點擊任一卡片即可查看完整的專案背景、遇到的挑戰、解決方案與學習反思。
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group bg-white rounded-3xl overflow-hidden border border-yellow-200/80 shadow-xs hover:shadow-lg hover:border-yellow-400 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1.5"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-16/10 bg-yellow-50 overflow-hidden">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-yellow-50/60 text-yellow-500/60 p-4 text-center">
                    <FolderGit2 className="w-10 h-10 mb-2 opacity-60" />
                    <span className="text-xs font-medium">專案封面</span>
                  </div>
                )}

                {/* Category Badge on Image */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-yellow-400 text-gray-950 text-xs font-bold shadow-xs">
                    {project.category || '學習專案'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-yellow-600" />
                    <span>{project.date || '2026'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors leading-snug line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                {/* Card Footer Action */}
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-yellow-700 group-hover:text-yellow-800">
                  <span>查看專案詳情</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Full Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-yellow-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-yellow-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-yellow-400 text-gray-950 text-xs font-bold">
                  {selectedProject.category || '作品'}
                </span>
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-yellow-600" />
                  {selectedProject.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-yellow-100 rounded-full transition-colors"
                aria-label="關閉視窗"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
              
              {/* Title & Summary */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {selectedProject.title}
                </h2>
                <p className="text-base text-gray-700 leading-relaxed bg-[#FFFDF5] border border-yellow-200/80 p-4 sm:p-5 rounded-2xl">
                  {selectedProject.summary}
                </p>
              </div>

              {/* Cover Image in Detail */}
              {selectedProject.coverImage && (
                <div className="rounded-2xl overflow-hidden border border-yellow-100 aspect-16/9 bg-yellow-50">
                  <img
                    src={selectedProject.coverImage}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Google Drive Video Player (Responsive) */}
              {selectedProject.videoUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                    <Video className="w-5 h-5 text-yellow-600" />
                    <span>專案展示影片</span>
                  </div>
                  {(() => {
                    const videoResult = parseGoogleDriveVideoUrl(selectedProject.videoUrl);
                    if (videoResult.isValid && videoResult.embedUrl) {
                      return (
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md border border-gray-200">
                          <iframe
                            src={videoResult.embedUrl}
                            title="Google Drive 專案展示影片"
                            className="w-full h-full border-0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-900 text-sm flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">無法辨識 Google Drive 影片網址</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              請確認分享連結是否為公開可檢視，格式例如：https://drive.google.com/file/d/你的檔案ID/view
                            </p>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}

              {/* Full Content */}
              {selectedProject.content && (
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-gray-900 border-l-4 border-yellow-400 pl-3">
                    專案詳細說明
                  </h4>
                  <div className="text-gray-700 text-base leading-relaxed space-y-3 whitespace-pre-line">
                    {selectedProject.content}
                  </div>
                </div>
              )}

              {/* Challenge & Solution Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Challenge */}
                <div className="bg-rose-50/60 rounded-2xl p-6 border border-rose-100 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <span>遭遇的困難與挑戰</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {selectedProject.challenge || '在實作過程中針對細節進行了多輪除錯與效能調校。'}
                  </p>
                </div>

                {/* Solution */}
                <div className="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-100 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>解決方法與突破</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {selectedProject.solution || '透過查閱文獻、分析問題結構與反覆測試驗證，成功解決關鍵瓶頸。'}
                  </p>
                </div>
              </div>

              {/* Learning Reflection */}
              {selectedProject.reflection && (
                <div className="bg-[#FFFDF5] rounded-2xl p-6 border border-yellow-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-900 font-bold text-base">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <span>學習心得與反思</span>
                  </div>
                  <p className="text-gray-800 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {selectedProject.reflection}
                  </p>
                </div>
              )}

              {/* Additional Photos Gallery (if any) */}
              {additionalImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                    <ImageIcon className="w-5 h-5 text-yellow-600" />
                    <span>更多專案照片 ({additionalImages.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {additionalImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setActiveImageZoom(img.imageUrl)}
                        className="rounded-2xl overflow-hidden border border-yellow-100 aspect-4/3 bg-yellow-50 cursor-pointer group relative"
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.caption || '專案照片'}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {img.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/70 p-2 text-white text-xs truncate">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Footer */}
            <div className="bg-[#FFFDF5] px-6 py-4 border-t border-yellow-100 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-300 active:scale-98 text-gray-950 text-sm font-bold transition-all shadow-xs"
              >
                關閉視窗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for Zoomed Image */}
      {activeImageZoom && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setActiveImageZoom(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={activeImageZoom}
              alt="放大預覽"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setActiveImageZoom(null)}
              className="absolute -top-12 right-0 text-white hover:text-amber-400 p-2 text-sm font-medium flex items-center gap-1"
            >
              <X className="w-6 h-6" /> 點擊關閉
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
