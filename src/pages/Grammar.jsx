import { useState } from 'react';
import { grammarData } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaLightbulb, FaVolumeUp } from 'react-icons/fa';

export default function Grammar() {
  const [expandedId, setExpandedId] = useState(null);
  
  const levels = [...new Set(grammarData.map(g => g.level))];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <span key={i} className="text-pink-400 font-bold bg-pink-400/10 px-1 rounded">{part}</span>
        : part
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
          文法學習
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">依照 TOPIK 等級分類，掌握核心文法</p>
      </div>

      <div className="space-y-12">
        {levels.map(level => (
          <div key={level}>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{level}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-300 dark:from-slate-700 to-transparent"></div>
            </div>
            
            <div className="space-y-4">
              {grammarData.filter(g => g.level === level).map(grammar => (
                <div key={grammar.id} className="glass-panel overflow-hidden">
                  <button 
                    onClick={() => setExpandedId(expandedId === grammar.id ? null : grammar.id)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <FaLightbulb />
                      </div>
                      <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{grammar.title}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedId === grammar.id ? 180 : 0 }}
                      className="text-slate-500 dark:text-slate-400"
                    >
                      <FaChevronDown />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedId === grammar.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/30"
                      >
                        <div className="p-6">
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                            {grammar.explanation}
                          </p>
                          
                          <h4 className="text-sm font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-4">Example Sentences</h4>
                          <div className="space-y-4">
                            {grammar.examples.map((ex, idx) => (
                              <div key={idx} className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="text-lg text-slate-800 dark:text-slate-200">
                                    {highlightText(ex.korean, ex.highlight)}
                                  </p>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); speak(ex.korean); }}
                                    className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 p-1 shrink-0 ml-2"
                                  >
                                    <FaVolumeUp size={16} />
                                  </button>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">{ex.chinese}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
