import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaVolumeUp, FaSyncAlt, FaMoon, FaSun } from 'react-icons/fa';

export default function Flashcards({ vocabList, updateVocabStatus, isDarkMode, toggleTheme }) {
  const [filter, setFilter] = useState('全部');
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const categories = ['全部', '日常', '旅遊', '時尚', '漢字詞'];

  const filteredList = useMemo(() => {
    if (!vocabList || vocabList.length === 0) return [];
    return filter === '全部' ? vocabList : vocabList.filter(v => v.category === filter);
  }, [vocabList, filter]);

  // Weighted Random Selection
  const pickRandomCard = (list) => {
    if (list.length === 0) return null;
    const totalWeight = list.reduce((sum, item) => sum + (item.weight || 10), 0);
    let randomNum = Math.random() * totalWeight;
    for (const item of list) {
      if (randomNum < (item.weight || 10)) {
        return item;
      }
      randomNum -= (item.weight || 10);
    }
    return list[0]; // fallback
  };

  useEffect(() => {
    if (filteredList.length > 0 && !currentCard) {
      setCurrentCard(pickRandomCard(filteredList));
    } else if (filteredList.length > 0 && currentCard) {
      // If filter changes, pick a new card from that filter
      const cardInNewFilter = filteredList.find(c => c.id === currentCard.id);
      if (!cardInNewFilter) {
        setCurrentCard(pickRandomCard(filteredList));
      }
    } else if (filteredList.length === 0) {
      setCurrentCard(null);
    }
  }, [filteredList, filter]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
  };

  const handleAction = (action) => {
    if (!currentCard) return;

    let newStatus = currentCard.status;
    let newWeight = currentCard.weight || 10;

    if (action === 'learned') {
      newStatus = 'learned';
      newWeight = 0.5; // Extremely low frequency
    } else if (action === 'review') {
      newStatus = 'review';
      newWeight = 100; // Extremely high frequency
    }
    // 'skip' does nothing to weight

    if (action !== 'skip') {
      updateVocabStatus(currentCard.id, newStatus, newWeight);
    }

    setIsFlipped(false);
    setShowTranslation(false);
    setTimeout(() => {
      // Pick next card from the updated list
      // Since updateVocabStatus is async and triggers re-render, 
      // we can just pick from current filteredList but pretend the current card's weight changed
      const updatedList = filteredList.map(v => 
        v.id === currentCard.id ? { ...v, status: newStatus, weight: newWeight } : v
      );
      
      let nextCard = pickRandomCard(updatedList);
      // Try not to show the same card twice in a row if possible
      if (nextCard.id === currentCard.id && updatedList.length > 1) {
        while (nextCard.id === currentCard.id) {
          nextCard = pickRandomCard(updatedList);
        }
      }
      setCurrentCard(nextCard);
    }, 150);
  };

  const getPosChinese = (pos) => {
    switch (pos) {
      case 'noun': return '名詞';
      case 'verb': return '動詞';
      case 'adjective': return '形容詞';
      case 'greeting': return '問候語';
      default: return pos;
    }
  };

  const getPosColor = (pos) => {
    switch (pos) {
      case 'noun': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'verb': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'adjective': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-screen p-4 text-slate-400">
        載入中或該分類沒有單字...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-screen p-4 relative pt-28 pb-28 md:pt-4 md:pb-4">
      {/* Top Controls */}
      <div className="absolute top-4 right-4 md:top-8 md:right-10 z-10 flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-md hover:scale-105 transition-all"
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 px-6 py-2 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer shadow-md transition-all hover:bg-white dark:hover:bg-slate-700/80 text-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md perspective-1000 mt-4 md:mt-0">
        <motion.div
          className="w-full h-[22rem] md:h-[28rem] relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden glass-panel flex flex-col items-center justify-center p-8">
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${getPosColor(currentCard.pos)}`}>
              {getPosChinese(currentCard.pos)}
            </span>
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 tracking-wide text-center">{currentCard.word}</h2>
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(currentCard.word); }}
                  className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/40 transition-colors shrink-0"
                >
                  <FaVolumeUp size={20} />
                </button>
              </div>

              {currentCard.sentence && (
                <div className="w-full bg-slate-100/50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/30 mb-2">
                  <div className="flex justify-between items-center text-left">
                    <p className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-200">{currentCard.sentence}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); speak(currentCard.sentence); }}
                      className="text-indigo-400 hover:text-indigo-300 p-2 shrink-0 ml-3 bg-white/50 dark:bg-slate-800/50 rounded-full"
                    >
                      <FaVolumeUp size={16} />
                    </button>
                  </div>
                </div>
              )}

              {(currentCard.pos === 'verb' || currentCard.pos === 'adjective') && currentCard.conjugations && (
                <div className="flex gap-2 flex-wrap justify-center mt-2" onClick={(e) => e.stopPropagation()}>
                  {currentCard.conjugations.map((conj, idx) => {
                    const labels = ['現在', '過去', '未來'];
                    return (
                      <button 
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); speak(conj); }}
                        className="flex flex-col items-center justify-center bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors group"
                      >
                        <span className="text-sm md:text-base font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-500 dark:group-hover:text-indigo-400">{conj}</span>
                        <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">{labels[idx] || '變化'}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full font-bold shadow-sm hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all border border-indigo-200 dark:border-indigo-500/30 hover:scale-105"
            >
              <FaSyncAlt /> <span>翻面查看</span>
            </button>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden glass-panel rotate-y-180 flex flex-col p-8 bg-white/90 dark:bg-slate-800/90">
             <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-bold shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-600 hover:scale-105"
            >
              <FaSyncAlt /> <span>翻回正面</span>
            </button>
            
            <div className="flex-1 flex flex-col justify-center w-full mt-4 pb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-center text-pink-500 dark:text-pink-400 mb-6 md:mb-8 tracking-wide">{currentCard.meaning}</h3>
              
              <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-200">{currentCard.sentence}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); speak(currentCard.sentence); }}
                    className="text-indigo-400 hover:text-indigo-300 p-1 shrink-0 ml-2"
                  >
                    <FaVolumeUp size={20} />
                  </button>
                </div>
                
                {showTranslation ? (
                  <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg mt-3 pt-3 border-t border-slate-300 dark:border-slate-700/50">
                    {currentCard.sentenceMeaning}
                  </p>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowTranslation(true); }}
                    className="mt-3 text-sm text-slate-500 hover:text-slate-300 underline underline-offset-4"
                  >
                    顯示翻譯
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-6 md:mt-8 flex justify-center gap-2 md:gap-4">
          <button onClick={() => handleAction('review')} className="btn-outline flex-1 border-rose-500/50 text-rose-500 dark:text-rose-300 hover:bg-rose-500/10 active:bg-rose-500/20 text-sm md:text-base px-2 py-3">
            需要複習
          </button>
          <button onClick={() => handleAction('skip')} className="btn-outline flex-1 border-slate-400 dark:border-slate-500 text-slate-600 dark:text-slate-400 active:bg-slate-200 dark:active:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-sm md:text-base px-2 py-3">
            跳過
          </button>
          <button onClick={() => handleAction('learned')} className="btn-outline flex-1 border-emerald-500/50 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10 active:bg-emerald-500/20 text-sm md:text-base px-2 py-3">
            我學會了
          </button>
        </div>
      </div>
    </div>
  );
}
