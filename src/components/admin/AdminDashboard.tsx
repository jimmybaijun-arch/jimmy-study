import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  FolderGit2, 
  Milestone, 
  Award, 
  LogOut, 
  ExternalLink, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Database, 
  Loader2 
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProfileEditor } from './ProfileEditor';
import { ProjectManager } from './ProjectManager';
import { TimelineManager } from './TimelineManager';
import { SkillManager } from './SkillManager';
import { ToastContainer, ToastMessage } from '../common/Toast';

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome }) => {
  const { 
    currentUser, 
    isAdmin, 
    isAuthReady, 
    loginWithGoogle, 
    logoutUser, 
    seedDefaultDataToFirestore 
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'timeline' | 'skills'>('profile');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await loginWithGoogle();
      addToast('success', 'Google 登入成功！');
    } catch (err: unknown) {
      console.error(err);
      addToast('error', 'Google 登入失敗或已取消，請重試。');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      addToast('info', '已成功登出管理員帳號。');
    } catch (err: unknown) {
      console.error(err);
      addToast('error', '登出失敗，請重試。');
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm('確定要將預設的精美範例資料（3個專案、5個歷程事件、10個技能）寫入 Firebase 嗎？')) return;
    try {
      setIsSeeding(true);
      await seedDefaultDataToFirestore();
      addToast('success', '範例資料已成功寫入 Firebase 資料庫！');
    } catch (err: unknown) {
      console.error(err);
      addToast('error', '寫入失敗，請重試。');
    } finally {
      setIsSeeding(false);
    }
  };

  // Auth Loading
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#FFFCF0] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-yellow-200 text-gray-700">
          <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
          <span className="font-medium">載入登入驗證狀態中...</span>
        </div>
      </div>
    );
  }

  // Not Logged In
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FFFCF0] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-yellow-200 shadow-xl space-y-6 text-center">
          
          <div className="w-14 h-14 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900">
              學生學習歷程管理後台
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              請登入管理員 Google 帳號以管理你的個人簡介、專案作品、歷程時間軸與技能清單。
            </p>
          </div>

          <div className="pt-2">
            <button
              id="google-signin-btn"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-300 active:scale-98 text-gray-950 font-bold text-base shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>使用 Google 帳號登入</span>
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={onNavigateHome}
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← 返回公開首頁
            </button>
          </div>

        </div>

        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // Logged In but Not Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FFFCF0] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 shadow-xl space-y-6 text-center">
          
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">
              此帳號沒有網站管理權限
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              目前登入帳號：<span className="font-semibold text-gray-900">{currentUser.email}</span>
            </p>
            <p className="text-xs text-gray-500">
              只有指定管理員（jimmybaijun@gmail.com）具備修改與發布權限。
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>切換其他帳號登入</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full text-xs font-semibold text-gray-500 hover:text-gray-800 py-2 transition-colors"
            >
              返回公開首頁
            </button>
          </div>

        </div>

        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // Admin Dashboard Logged In
  return (
    <div className="min-h-screen bg-[#FFFCF0] text-gray-900 flex flex-col">
      
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-gray-900 text-white border-b border-gray-800 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-gray-950 flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-gray-950" />
            </div>
            <div>
              <span className="font-bold text-white text-base">學習歷程管理後台</span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-md font-mono">
                Admin Mode
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>查看前台網站</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800/40 transition-colors"
              title="登出管理員"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">登出</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-yellow-100/60 p-1.5 rounded-2xl border border-yellow-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <User className="w-4 h-4 text-yellow-600" />
            <span>基本資料</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'projects'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-yellow-600" />
            <span>作品專案</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'timeline'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Milestone className="w-4 h-4 text-yellow-600" />
            <span>學習歷程</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'skills'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Award className="w-4 h-4 text-yellow-600" />
            <span>技能標籤</span>
          </button>

          {/* Quick Seed Action on the right */}
          <div className="ml-auto">
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-950 text-xs font-bold shadow-xs transition-colors"
              title="初始化預設範例資料至資料庫"
            >
              {isSeeding ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Database className="w-3.5 h-3.5 text-gray-950" />
              )}
              <span>同步範例資料到 Firebase</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === 'profile' && <ProfileEditor onNotify={addToast} />}
          {activeTab === 'projects' && <ProjectManager onNotify={addToast} />}
          {activeTab === 'timeline' && <TimelineManager onNotify={addToast} />}
          {activeTab === 'skills' && <SkillManager onNotify={addToast} />}
        </div>

      </main>

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
