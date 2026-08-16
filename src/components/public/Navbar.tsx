import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Navbar: React.FC = () => {
  const { profile } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '關於我', href: '#about' },
    { name: '我的作品', href: '#projects' },
    { name: '學習歷程', href: '#timeline' },
    { name: '專長技能', href: '#skills' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-yellow-200 py-3'
          : 'bg-[#FFFCF0]/80 backdrop-blur-xs py-4 border-b border-yellow-100/50'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Name */}
        <a
          href="#hero"
          onClick={(e) => handleScrollTo(e, '#hero')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xs transition-transform group-hover:scale-105">
            {profile.name ? profile.name.charAt(0) : '黃'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-base leading-tight group-hover:text-yellow-600 transition-colors">
              {profile.name}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {profile.school} · {profile.grade}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="hover:text-yellow-600 hover:border-b-2 hover:border-yellow-400 pb-0.5 transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#projects"
            onClick={(e) => handleScrollTo(e, '#projects')}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-300 active:scale-98 rounded-full shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4 text-gray-900" />
            <span>探索作品</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          id="mobile-menu-btn"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-gray-950 hover:bg-yellow-100 rounded-xl transition-colors"
          aria-label="開啟導覽選單"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-yellow-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#projects"
              onClick={(e) => handleScrollTo(e, '#projects')}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-full font-bold text-gray-950 bg-yellow-400 hover:bg-yellow-300 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>探索作品</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
