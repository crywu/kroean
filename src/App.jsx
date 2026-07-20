import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Flashcards from './pages/Flashcards';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import { vocabData as initialVocabData } from './data/mockData';

function App() {
  const [vocabList, setVocabList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('koreanThemeDark');
    return savedTheme !== null ? JSON.parse(savedTheme) : true;
  });

  useEffect(() => {
    // Load saved progress
    const savedProgressStr = localStorage.getItem('koreanLearningProgress');
    const savedProgress = savedProgressStr ? JSON.parse(savedProgressStr) : {};

    // Initialize vocab list, overriding with saved progress if it exists
    const listWithWeights = initialVocabData.map(v => {
      const savedItem = savedProgress[v.id];
      return {
        ...v,
        status: savedItem?.status || v.status || 'learning',
        weight: savedItem?.weight || 10
      };
    });
    setVocabList(listWithWeights);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('koreanThemeDark', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const updateVocabStatus = (id, newStatus, newWeight) => {
    setVocabList(prev => {
      const newList = prev.map(v => 
        v.id === id ? { ...v, status: newStatus, weight: newWeight } : v
      );
      
      // Save progress to LocalStorage (only mapping id -> status & weight to save space)
      const progressToSave = {};
      newList.forEach(item => {
        if (item.status !== 'learning' || item.weight !== 10) {
          progressToSave[item.id] = { status: item.status, weight: item.weight };
        }
      });
      localStorage.setItem('koreanLearningProgress', JSON.stringify(progressToSave));
      
      return newList;
    });
  };

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-500">
        <Navbar />
        <main className="flex-1 md:ml-64 w-full">
          <Routes>
            <Route path="/" element={<Flashcards vocabList={vocabList} updateVocabStatus={updateVocabStatus} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />} />
            <Route path="/vocabulary" element={<Vocabulary vocabList={vocabList} />} />
            <Route path="/grammar" element={<Grammar />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
