import { Link, useLocation } from 'react-router-dom';
import { FaLayerGroup, FaList, FaBookOpen } from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '單詞卡片', icon: <FaLayerGroup /> },
    { path: '/vocabulary', label: '單字管理', icon: <FaList /> },
    { path: '/grammar', label: '文法學習', icon: <FaBookOpen /> },
  ];

  return (
    <nav className="fixed bottom-0 w-full md:bottom-auto md:top-0 md:w-64 md:h-screen glass-panel rounded-none md:rounded-r-2xl border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-700/50 z-50">
      <div className="flex md:flex-col justify-around md:justify-start items-center p-4 md:p-6 h-16 md:h-full gap-2 md:gap-6">
        <div className="hidden md:block w-full text-center mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
            K-Lingo
          </h1>
        </div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 w-full p-2 md:p-4 rounded-xl transition-all ${
              location.pathname === item.path
                ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="text-xl md:text-2xl">{item.icon}</span>
            <span className="text-xs md:text-base font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
