    /* ============================================
    TALKPLAY - LOCAL STORAGE UTILITIES
    Helper functions for saving/loading progress
    ============================================ */

    const STORAGE_KEY = 'talkplay_progress';

    /**
     * Get progress for all categories from LocalStorage
     * @returns {Object} Progress object with categoryId as keys
     * Example: { animals: [wordId1, wordId2], foods: [], toys: [] }
     */
    export function getProgress() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
        return initializeProgress();
        }
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error reading progress from LocalStorage:', error);
        return initializeProgress();
    }
    }

    /**
     * Save progress for a specific word
     * @param {string} categoryId - The category (e.g., 'animals')
     * @param {string} wordId - The word ID that was completed
     */
    export function saveProgress(categoryId, wordId) {
    try {
        const progress = getProgress();
        
        // Initialize category array if it doesn't exist
        if (!progress[categoryId]) {
        progress[categoryId] = [];
        }
        
        // Add wordId if not already completed
        if (!progress[categoryId].includes(wordId)) {
        progress[categoryId].push(wordId);
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        return true;
    } catch (error) {
        console.error('Error saving progress to LocalStorage:', error);
        return false;
    }
    }

    /**
     * Get progress for a specific category
     * @param {string} categoryId - The category to check
     * @returns {Array} Array of completed word IDs
     */
    export function getCategoryProgress(categoryId) {
    const progress = getProgress();
    return progress[categoryId] || [];
    }

    /**
     * Check if a specific word has been completed
     * @param {string} categoryId - The category
     * @param {string} wordId - The word to check
     * @returns {boolean} True if completed
     */
    export function isWordCompleted(categoryId, wordId) {
    const categoryProgress = getCategoryProgress(categoryId);
    return categoryProgress.includes(wordId);
    }

    /**
     * Clear all progress (reset app)
     */
    export function clearProgress() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing progress:', error);
        return false;
    }
    }

    /**
     * Clear progress for a specific category
     * @param {string} categoryId - The category to reset
     */
    export function clearCategoryProgress(categoryId) {
    try {
        const progress = getProgress();
        progress[categoryId] = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        return true;
    } catch (error) {
        console.error('Error clearing category progress:', error);
        return false;
    }
    }

    /**
     * Initialize empty progress object
     * @returns {Object} Empty progress for all categories
     */
    function initializeProgress() {
    return {
        animals: [],
        foods: [],
        toys: []
    };
    }

    /**
     * Get total progress across all categories
     * @returns {Object} { completed: number, total: number, percentage: number }
     */
    export function getTotalProgress(totalWordsPerCategory = 10) {
    const progress = getProgress();
    const completed = Object.values(progress).reduce((sum, arr) => sum + arr.length, 0);
    const total = 3 * totalWordsPerCategory; // 3 categories
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
    }

    /**
     * Get completion progress for a specific category
     * @param {string} categoryId - The category to check
     * @param {number} totalWords - Total number of words in the category
     * @returns {Object} { completed: number, total: number, percentage: number }
     */
    export function getCategoryCompletion(categoryId, totalWords) {
    const completed = getCategoryProgress(categoryId).length;
    const percentage = Math.round((completed / totalWords) * 100);
    
    return { completed, total: totalWords, percentage };
    }

    /**
     * Get the current flashcard index for a category
     * @param {string} categoryId - The category
     * @returns {number} The current index
     */
    export function getCurrentIndex(categoryId) {
    try {
        const saved = localStorage.getItem(`talkplay-current-${categoryId}`);
        return saved ? parseInt(saved, 10) : 0;
    } catch (error) {
        console.error('Error reading current index from LocalStorage:', error);
        return 0;
    }
    }

    /**
     * Save the current flashcard index for a category
     * @param {string} categoryId - The category
     * @param {number} index - The current index
     * @returns {boolean} Success status
     */
    export function saveCurrentIndex(categoryId, index) {
    try {
        localStorage.setItem(`talkplay-current-${categoryId}`, index.toString());
        return true;
    } catch (error) {
        console.error('Error saving current index to LocalStorage:', error);
        return false;
    }
    }