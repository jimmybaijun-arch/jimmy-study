import React, { useState } from 'react';
import { Award, Plus, Trash2, Edit2, Save, X, Loader2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SkillItem } from '../../types';

interface SkillManagerProps {
  onNotify: (type: 'success' | 'error', text: string) => void;
}

export const SkillManager: React.FC<SkillManagerProps> = ({ onNotify }) => {
  const { skills, saveSkillItem, removeSkillItem } = usePortfolio();

  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('程式開發');
  const [isAdding, setIsAdding] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);

  const categories = ['程式開發', '人工智慧', '硬體物聯網', '數位創作', '核心素養', '其他專長'];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setIsAdding(true);
      await saveSkillItem({
        name: newName.trim(),
        category: newCategory,
        order: skills.length + 1,
      });
      setNewName('');
      onNotify('success', '已新增技能標籤！');
    } catch (err: unknown) {
      console.error(err);
      onNotify('error', '新增失敗，請重試。');
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) return;

    try {
      await saveSkillItem(editingSkill);
      onNotify('success', '已更新技能標籤！');
      setEditingSkill(null);
    } catch (err: unknown) {
      console.error(err);
      onNotify('error', '更新失敗，請重試。');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeSkillItem(id);
      onNotify('success', '已移除技能標籤。');
    } catch (err: unknown) {
      console.error(err);
      onNotify('error', '刪除失敗，請重試。');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          <span>技能標籤管理</span>
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          管理首頁展示的技能標籤（目前共 {skills.length} 個標籤，採用純文字 Tag，不使用虛假百分比）。
        </p>

        {/* Quick Add Form */}
        <form onSubmit={handleAdd} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="輸入技能名稱（例如：Python、Arduino、攝影）"
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={isAdding || !newName.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm shadow-xs transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>新增技能</span>
          </button>
        </form>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-3 hover:border-amber-300 transition-colors"
          >
            <div className="min-w-0">
              <span className="text-xs text-stone-400 font-medium">{skill.category}</span>
              <p className="text-base font-bold text-stone-900 truncate">{skill.name}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setEditingSkill(skill)}
                className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                title="修改"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(skill.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="刪除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 space-y-4 border border-stone-200 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-stone-900">編輯技能標籤</h4>
              <button onClick={() => setEditingSkill(null)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">技能名稱</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">分類類別</label>
                <select
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-400 text-stone-900 text-sm bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold shadow-xs"
                >
                  儲存更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
