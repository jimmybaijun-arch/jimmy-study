import React, { useState } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  X, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project, ProjectImage } from '../../types';
import { compressImage } from '../../utils/imageCompressor';
import { parseGoogleDriveVideoUrl } from '../../utils/driveVideo';

interface ProjectManagerProps {
  onNotify: (type: 'success' | 'error', text: string) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ onNotify }) => {
  const { 
    projects, 
    saveProject, 
    removeProject, 
    swapProjectOrder, 
    fetchProjectImages, 
    saveProjectImage, 
    removeProjectImage 
  } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Open modal to create
  const handleCreateNew = () => {
    setEditingProject({
      title: '',
      date: new Date().toISOString().slice(0, 7).replace('-', '/'),
      category: '程式開發',
      summary: '',
      content: '',
      challenge: '',
      solution: '',
      reflection: '',
      coverImage: '',
      videoUrl: '',
      order: projects.length + 1,
    });
    setProjectImages([]);
    setIsModalOpen(true);
  };

  // Open modal to edit
  const handleEdit = async (proj: Project) => {
    setEditingProject({ ...proj });
    setIsModalOpen(true);
    const imgs = await fetchProjectImages(proj.id);
    setProjectImages(imgs);
  };

  // Delete project
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await removeProject(deleteConfirmId);
      onNotify('success', '作品已成功刪除！');
    } catch (err: unknown) {
      console.error(err);
      onNotify('error', '刪除失敗，請檢查網路連線。');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Cover image upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const res = await compressImage(file, 1200, 1200, 400 * 1024);
      setEditingProject((prev) => (prev ? { ...prev, coverImage: res.dataUrl } : null));
      onNotify('success', `封面圖片已壓縮 (${res.sizeKB} KB)！`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '圖片處理失敗';
      onNotify('error', msg);
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Gallery image upload (up to 3 images)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (projectImages.length >= 3) {
      onNotify('error', '每個作品最多支援 3 張附加照片！');
      return;
    }

    try {
      setIsUploadingGallery(true);
      const res = await compressImage(file, 1200, 1200, 400 * 1024);

      if (editingProject?.id && !editingProject.id.startsWith('sample-')) {
        // Save directly to Firestore for existing project
        await saveProjectImage(editingProject.id, res.dataUrl);
        const updatedImgs = await fetchProjectImages(editingProject.id);
        setProjectImages(updatedImgs);
      } else {
        // Temp item for new project
        setProjectImages((prev) => [
          ...prev,
          {
            id: 'temp_' + Date.now(),
            projectId: '',
            imageUrl: res.dataUrl,
            order: prev.length + 1,
          },
        ]);
      }
      onNotify('success', `附加照片已加入 (${res.sizeKB} KB)！`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '照片上傳失敗';
      onNotify('error', msg);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = async (imgId: string) => {
    if (imgId.startsWith('temp_')) {
      setProjectImages((prev) => prev.filter((i) => i.id !== imgId));
    } else {
      await removeProjectImage(imgId);
      setProjectImages((prev) => prev.filter((i) => i.id !== imgId));
    }
    onNotify('success', '已移除照片。');
  };

  // Submit project form
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title?.trim() || !editingProject?.summary?.trim()) {
      onNotify('error', '請填寫作品名稱與簡短介紹！');
      return;
    }

    try {
      setIsSaving(true);
      const savedId = await saveProject({
        id: editingProject.id,
        title: editingProject.title,
        date: editingProject.date || '',
        category: editingProject.category || '專案',
        summary: editingProject.summary,
        content: editingProject.content || '',
        challenge: editingProject.challenge || '',
        solution: editingProject.solution || '',
        reflection: editingProject.reflection || '',
        coverImage: editingProject.coverImage || '',
        videoUrl: editingProject.videoUrl || '',
        order: editingProject.order || projects.length + 1,
      });

      // Save any pending temp gallery images
      for (const tempImg of projectImages) {
        if (tempImg.id.startsWith('temp_')) {
          await saveProjectImage(savedId, tempImg.imageUrl, tempImg.caption);
        }
      }

      onNotify('success', '作品已成功儲存！');
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err: unknown) {
      console.error(err);
      onNotify('error', '儲存失敗，請檢查網路連線。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-amber-500" />
            <span>作品專案管理</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            新增、編輯、調整順序與刪除學習作品專案（目前共 {projects.length} 個作品）。
          </p>
        </div>

        <button
          id="add-project-btn"
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-stone-950 font-bold text-sm shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>新增作品專案</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-300 transition-colors"
          >
            {/* Left: Thumbnail & Info */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                {proj.coverImage ? (
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <FolderGit2 className="w-6 h-6 opacity-40" />
                  </div>
                )}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                    {proj.category || '專案'}
                  </span>
                  <span className="text-xs text-stone-400 font-medium">{proj.date}</span>
                </div>
                <h3 className="text-base font-bold text-stone-900 truncate">
                  {proj.title}
                </h3>
                <p className="text-xs text-stone-500 truncate max-w-md">
                  {proj.summary}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
              
              {/* Order buttons */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => swapProjectOrder(proj.id, projects[idx - 1].id)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg disabled:opacity-30 transition-colors"
                  title="向上移動"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === projects.length - 1}
                  onClick={() => swapProjectOrder(proj.id, projects[idx + 1].id)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg disabled:opacity-30 transition-colors"
                  title="向下移動"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              {/* Edit button */}
              <button
                type="button"
                onClick={() => handleEdit(proj)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-800 text-xs font-semibold border border-stone-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>編輯</span>
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => setDeleteConfirmId(proj.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                title="刪除作品"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-stone-900">
                {editingProject.id ? '編輯作品專案' : '新增作品專案'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProject} className="overflow-y-auto p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    作品名稱 *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm font-medium"
                    placeholder="例如：智慧校園垃圾分類助手"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    完成日期
                  </label>
                  <input
                    type="text"
                    value={editingProject.date || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                    placeholder="例如：2026/03"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    作品分類
                  </label>
                  <input
                    type="text"
                    value={editingProject.category || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                    placeholder="例如：人工智慧 / AI、機器人、程式開發"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    顯示順序 (數字越小越前面)
                  </label>
                  <input
                    type="number"
                    value={editingProject.order || 1}
                    onChange={(e) => setEditingProject({ ...editingProject, order: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  簡短介紹（首頁卡片顯示）*
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.summary || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                  placeholder="一句話概括此專案的目的與特色..."
                />
              </div>

              {/* Cover Image Upload */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  作品封面圖片 (WebP 自動壓縮 &lt; 400KB)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0">
                    {editingProject.coverImage ? (
                      <img
                        src={editingProject.coverImage}
                        alt="封面"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                        無封面
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-300 cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isUploadingCover ? '壓縮中...' : '選擇封面照片'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={isUploadingCover}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-stone-400">
                      建議解析度 1200x800 橫向照片
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Drive Video URL Parser */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-amber-700" />
                  <span>Google Drive 影片連結 (選填)</span>
                </label>
                <input
                  type="text"
                  value={editingProject.videoUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-amber-300 bg-white focus:ring-2 focus:ring-amber-400 text-stone-900 text-xs"
                  placeholder="https://drive.google.com/file/d/你的檔案ID/view"
                />
                {editingProject.videoUrl && (
                  <div className="pt-1">
                    {(() => {
                      const res = parseGoogleDriveVideoUrl(editingProject.videoUrl);
                      if (res.isValid) {
                        return (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            影片連結解析成功！(檔案 ID: {res.fileId})
                          </span>
                        );
                      } else {
                        return (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                            {res.errorMessage}
                          </span>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  完整作品內容 (Content)
                </label>
                <textarea
                  rows={4}
                  value={editingProject.content || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm leading-relaxed"
                  placeholder="詳細介紹此專案的背景、實作步驟與功能細節..."
                />
              </div>

              {/* Challenge & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    製作過程遇到的問題 (Challenge)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.challenge || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                    placeholder="遇到哪些程式 Bug、硬體接線或演算法瓶頸？"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    我是如何解決問題 (Solution)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.solution || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                    placeholder="查閱資料、改寫演算法、調整感測器角度..."
                  />
                </div>
              </div>

              {/* Reflection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  學習心得與反思 (Reflection)
                </label>
                <textarea
                  rows={3}
                  value={editingProject.reflection || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, reflection: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                  placeholder="完成此專案後帶給你的收穫與對未來的啟發..."
                />
              </div>

              {/* Additional Photos Section */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    附加專案照片（最多 3 張，獨立安全儲存）
                  </label>
                  <span className="text-xs text-stone-400 font-medium">
                    {projectImages.length} / 3 張
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {projectImages.map((img) => (
                    <div key={img.id} className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-300 bg-white group">
                      <img
                        src={img.imageUrl}
                        alt="附圖"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(img.id)}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                        title="移除此照片"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {projectImages.length < 3 && (
                    <label className="aspect-4/3 rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-400 bg-white flex flex-col items-center justify-center text-stone-500 hover:text-amber-700 cursor-pointer transition-colors p-2 text-center">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium">
                        {isUploadingGallery ? '處理中...' : '加入照片'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        disabled={isUploadingGallery}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Form Submit Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm shadow-xs transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>儲存中...</span>
                    </>
                  ) : (
                    <span>儲存作品專案</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 space-y-4 border border-stone-200 shadow-xl">
            <h4 className="text-lg font-bold text-stone-900">確認刪除作品？</h4>
            <p className="text-sm text-stone-600">
              確定要刪除這個作品嗎？此動作將會從資料庫永久移除。
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
