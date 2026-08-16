import React, { useState } from 'react';
import { Milestone, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Save, X, Loader2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TimelineItem } from '../../types';

interface TimelineManagerProps {
  onNotify: (type: 'success' | 'error', text: string) => void;
}

export const TimelineManager: React.FC<TimelineManagerProps> = ({ onNotify }) => {
  const { timeline, saveTimelineItem, removeTimelineItem, swapTimelineOrder } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<TimelineItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingItem({
      year: new Date().getFullYear() + ' 年',
      title: '',
      description: '',
      category: '學習里程碑',
      order: timeline.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TimelineItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await removeTimelineItem(deleteConfirmId);
      onNotify('success', '已刪除學習歷程事件！');
    } catch (err: unknown) {
      console.error(err);
      onNotify('error', '刪除失敗，請重試。');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.year?.trim() || !editingItem?.title?.trim()) {
      onNotify('error', '請填寫時間年份與標題！');
      return;
    }

    try {
      setIsSaving(true);
      await saveTimelineItem({
        id: editingItem.id,
        year: editingItem.year,
        title: editingItem.title,
        description: editingItem.description || '',
        category: editingItem.category || '里程碑',
        order: editingItem.order || timeline.length + 1,
      });
      onNotify('success', '學習歷程已成功儲存！');
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err: unknown) {
      console.error(err);
      onNotify('error', '儲存失敗，請重試。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Milestone className="w-6 h-6 text-amber-500" />
            <span>學習歷程時間軸管理</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            記錄各階段的學習大事記、競賽活動與未來展望（目前共 {timeline.length} 個事件）。
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-stone-950 font-bold text-sm shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>新增歷程事件</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {timeline.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-300 transition-colors"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {item.year}
                </span>
                {item.category && (
                  <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-stone-900">{item.title}</h3>
              <p className="text-xs text-stone-500 whitespace-pre-line line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => swapTimelineOrder(item.id, timeline[idx - 1].id)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg disabled:opacity-30 transition-colors"
                  title="向上移動"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === timeline.length - 1}
                  onClick={() => swapTimelineOrder(item.id, timeline[idx + 1].id)}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg disabled:opacity-30 transition-colors"
                  title="向下移動"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-800 text-xs font-semibold border border-stone-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>編輯</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteConfirmId(item.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                title="刪除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900">
                {editingItem.id ? '編輯歷程事件' : '新增歷程事件'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    年份 / 時間 *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.year || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                    placeholder="例如：2026 年、高一上"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    分類標籤
                  </label>
                  <input
                    type="text"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                    placeholder="例如：程式起步、專題發表"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  事件標題 *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm font-medium"
                  placeholder="例如：完成第一個 AI 辨識垃圾分類專案"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  歷程內容說明
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                  placeholder="簡短描述這段時間的具體經歷與收穫..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-xs"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>儲存事件</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 space-y-4 border border-stone-200 shadow-xl">
            <h4 className="text-lg font-bold text-stone-900">確認刪除歷程事件？</h4>
            <p className="text-sm text-stone-600">
              確定要刪除此事件嗎？此動作無法復原。
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
