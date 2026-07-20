import { useState } from 'react';
import { FaVolumeUp } from 'react-icons/fa';

export default function Vocabulary({ vocabList }) {
  const [filter, setFilter] = useState('全部');
  const categories = ['全部', '日常', '旅遊', '時尚', '漢字詞'];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const filteredVocab = filter === '全部' 
    ? (vocabList || [])
    : (vocabList || []).filter(v => v.category === filter);

  const getPosChinese = (pos) => {
    switch (pos) {
      case 'noun': return '名詞';
      case 'verb': return '動詞';
      case 'adjective': return '形容詞';
      case 'greeting': return '問候語';
      default: return pos;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'learned': return <span className="px-2 py-1 text-xs rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">已學會</span>;
      case 'review': return <span className="px-2 py-1 text-xs rounded-md bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400">需複習</span>;
      default: return <span className="px-2 py-1 text-xs rounded-md bg-slate-200 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400">學習中</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
          單字管理
        </h2>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 px-6 py-2.5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer shadow-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-700/80"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVocab.map(vocab => (
          <div key={vocab.id} className="glass-panel p-6 hover:border-indigo-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{vocab.word}</h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); speak(vocab.word); }}
                    className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                  >
                    <FaVolumeUp />
                  </button>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400 inline-block mt-1">{getPosChinese(vocab.pos)} • {vocab.meaning}</span>
              </div>
              {getStatusBadge(vocab.status)}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{vocab.sentence}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(vocab.sentence); }}
                  className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 p-1 shrink-0 ml-2"
                >
                  <FaVolumeUp size={14} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">{vocab.sentenceMeaning}</p>
            </div>
          </div>
        ))}
      </div>
      
      {filteredVocab.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          此分類目前沒有單字喔！
        </div>
      )}
    </div>
  );
}
