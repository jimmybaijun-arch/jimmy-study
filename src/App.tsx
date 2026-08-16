import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { About } from './components/public/About';
import { Projects } from './components/public/Projects';
import { Timeline } from './components/public/Timeline';
import { Skills } from './components/public/Skills';
import { Footer } from './components/public/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { testConnection } from './firebase';
import { Loader2 } from 'lucide-react';

function PortfolioApp() {
  const { isLoading } = usePortfolio();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.startsWith('/admin') || hash === '#/admin' || hash === '#admin') {
      return '/admin';
    }
    return '/';
  });

  // Test Firebase connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  // Listen for browser back/forward and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith('/admin') || hash === '#/admin' || hash === '#admin') {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    try {
      window.history.pushState(null, '', path);
    } catch {
      // fallback for constrained iframe if pushState fails
      window.location.hash = path;
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFCF0] flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm border border-yellow-200 text-gray-700">
          <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
          <span className="font-medium text-sm">載入學生學習歷程資料中...</span>
        </div>
      </div>
    );
  }

  // Admin Route: /admin
  if (currentPath === '/admin') {
    return <AdminDashboard onNavigateHome={() => navigateTo('/')} />;
  }

  // Public Route: / (Strictly View-Only, zero admin indicators)
  return (
    <div className="min-h-screen bg-[#FFFCF0] text-gray-800 font-sans antialiased selection:bg-yellow-300 selection:text-yellow-950 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Projects />
        <Timeline />
        <Skills />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
