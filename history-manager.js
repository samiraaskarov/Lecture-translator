/**
 * Lecture Translator AI - History & State Manager
 * Handles local storage for historical analyses, favorites, search, rename, and statistics.
 */

const HistoryManager = (function() {
    const STORAGE_KEY = 'lecture_translator_history';

    // Helper: Generate unique ID
    function generateId() {
        return 'lecture_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Load history from localStorage
    function getHistory() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error reading history from localStorage:", e);
            return [];
        }
    }

    // Save history array back to localStorage
    function saveHistory(historyArray) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(historyArray));
            // Dispatch custom event to notify home page stats / lists of updates
            window.dispatchEvent(new CustomEvent('historyUpdated'));
        } catch (e) {
            console.error("Error writing history to localStorage:", e);
        }
    }

    // Auto Save a new analysis result
    function autoSaveAnalysis(title, subject, difficulty, language, originalText, results) {
        const history = getHistory();
        
        const newItem = {
            id: generateId(),
            title: title || `Lecture on ${subject || 'General Topic'}`,
            date: new Date().toISOString(),
            subject: subject || 'General',
            difficulty: difficulty,
            language: language,
            originalText: originalText,
            results: results,
            favorite: false,
            quizScore: null // Initial state, updated if quiz is completed
        };

        history.unshift(newItem); // Add to beginning
        saveHistory(history);
        return newItem;
    }

    // Delete item
    function deleteItem(id) {
        let history = getHistory();
        history = history.filter(item => item.id !== id);
        saveHistory(history);
    }

    // Toggle favorite status
    function toggleFavorite(id) {
        const history = getHistory();
        const item = history.find(item => item.id === id);
        if (item) {
            item.favorite = !item.favorite;
            saveHistory(history);
        }
        return item ? item.favorite : false;
    }

    // Rename item
    function renameItem(id, newTitle) {
        if (!newTitle || !newTitle.trim()) return;
        const history = getHistory();
        const item = history.find(item => item.id === id);
        if (item) {
            item.title = newTitle.trim();
            saveHistory(history);
        }
    }

    // Update Quiz score for an item
    function updateQuizScore(id, scoreStr) {
        const history = getHistory();
        const item = history.find(item => item.id === id);
        if (item) {
            item.quizScore = scoreStr;
            saveHistory(history);
        }
    }

    // Search items
    function searchItems(query) {
        const history = getHistory();
        if (!query || !query.trim()) return history;
        
        const normalizedQuery = query.toLowerCase().trim();
        return history.filter(item => {
            return (
                item.title.toLowerCase().includes(normalizedQuery) ||
                item.subject.toLowerCase().includes(normalizedQuery) ||
                (item.results && item.results.simplifiedNotes && item.results.simplifiedNotes.toLowerCase().includes(normalizedQuery))
            );
        });
    }

    // Compute progress stats
    function getStats() {
        const history = getHistory();
        
        let totalAnalyzed = history.length;
        let totalFavorites = history.filter(item => item.favorite).length;
        
        // Sum total reading time saved
        let totalTimeSavedMin = 0;
        let quizzesTaken = 0;
        let totalQuizScorePercent = 0;

        history.forEach(item => {
            if (item.results) {
                const orig = parseInt(item.results.originalReadingTimeMin) || 0;
                const simp = parseInt(item.results.simplifiedReadingTimeMin) || 0;
                if (orig > simp) {
                    totalTimeSavedMin += (orig - simp);
                }
            }
            if (item.quizScore) {
                // e.g. "8/10" -> parse values
                const parts = item.quizScore.split('/');
                if (parts.length === 2) {
                    const scored = parseFloat(parts[0]);
                    const total = parseFloat(parts[1]);
                    if (total > 0) {
                        totalQuizScorePercent += (scored / total) * 100;
                        quizzesTaken++;
                    }
                }
            }
        });

        const avgScore = quizzesTaken > 0 ? Math.round(totalQuizScorePercent / quizzesTaken) : 0;

        return {
            totalAnalyzed,
            totalFavorites,
            totalTimeSavedMin,
            avgQuizScore: avgScore + '%'
        };
    }

    return {
        getHistory,
        autoSaveAnalysis,
        deleteItem,
        toggleFavorite,
        renameItem,
        updateQuizScore,
        searchItems,
        getStats
    };
})();
