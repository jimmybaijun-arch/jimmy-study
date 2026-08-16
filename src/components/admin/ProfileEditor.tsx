import React, { useState } from 'react';
import { Save, Upload, User, School, BookOpen, Target, Sparkles, Loader2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SiteProfile } from '../../types';
import { compressImage } from '../../utils/imageCompressor';

interface ProfileEditorProps {
  onNotify: (type: 'success' | 'error', text: string) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onNotify }) => {
  const { profile, saveProfile } = usePortfolio();
  const [formData, setFormData] = useState<SiteProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const result = await compressImage(file, 800, 800, 400 * 1024);
      setFormData((prev) => ({ ...prev, avatarUrl: result.dataUrl }));
      onNotify('success', `圖片已成功壓縮 (${result.sizeKB} KB) 並套用！`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '圖片處理失敗，請重試。';
      onNotify('error', msg);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.school.trim()) {
      onNotify('error', '請填寫姓名與學校！');
      return;
    }

    try {
      setIsSaving(true);
      await saveProfile(formData);
      onNotify('success', '個人基本資料已成功儲存到雲端！');
    } catch (err: unknown) {
      console.error('Save Profile Error:', err);
      onNotify('error', '儲存失敗，請確認網路連線與權限。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <User className="w-6 h-6 text-amber-500" />
            <span>個人基本資料管理</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            修改公開首頁上的姓名、學校、年級、照片與個人自我介紹。
          </p>
        </div>

        <button
          id="save-profile-btn"
          type="submit"
          disabled={isSaving || isCompressing}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-stone-950 font-bold text-sm shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>儲存中...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>儲存基本資料</span>
            </>
          )}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-stone-200 border-2 border-amber-300 shadow-xs shrink-0">
          {formData.avatarUrl ? (
            <img
              src={formData.avatarUrl}
              alt="大頭貼預覽"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              <User className="w-10 h-10" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <h3 className="font-bold text-stone-900 text-base">個人照片</h3>
          <p className="text-xs text-stone-500">
            支援 JPG、PNG，系統將自動進行瀏覽器端 WebP 壓縮（目標控制在 400KB 以內）。
          </p>
          <div className="pt-2">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-300 shadow-2xs cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-amber-600" />
              <span>{isCompressing ? '壓縮處理中...' : '選擇並上傳新照片'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isCompressing}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Basic Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            學生姓名 *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm font-medium"
            placeholder="例如：黃柏郡"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            學校名稱 *
          </label>
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm font-medium"
            placeholder="例如：大灣高中"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            年級 *
          </label>
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm font-medium"
            placeholder="例如：一年級"
          />
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          一句自我介紹（首頁大標題下方）
        </label>
        <input
          type="text"
          name="tagline"
          value={formData.tagline}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm font-medium"
          placeholder="例如：喜歡透過科技與創作解決生活中的問題"
        />
      </div>

      {/* Detailed About Me */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          完整自我介紹 (About Me)
        </label>
        <textarea
          name="aboutMe"
          rows={4}
          value={formData.aboutMe}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm leading-relaxed"
          placeholder="分享你的求學經歷、興趣探索與個人特質..."
        />
      </div>

      {/* Three Detailed Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <School className="w-4 h-4 text-amber-600" />
            <span>核心學習方向</span>
          </label>
          <textarea
            name="learningFocus"
            rows={3}
            value={formData.learningFocus}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
            placeholder="例如：結合程式與硬體感測..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>目前正在學習的內容</span>
          </label>
          <textarea
            name="currentLearning"
            rows={3}
            value={formData.currentLearning}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
            placeholder="例如：現代 Web、AI 應用..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-600" />
            <span>未來想挑戰的事情</span>
          </label>
          <textarea
            name="futureGoals"
            rows={3}
            value={formData.futureGoals}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
            placeholder="例如：參加全國競賽、資工學系..."
          />
        </div>
      </div>

    </form>
  );
};
