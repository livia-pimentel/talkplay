/* ============================================
    FLASHCARD PAGE COMPONENT
    Interactive flashcard practice page
   ============================================ */

import React, { useState, useEffect, useRef, startTransition } from 'react';
import { useParams, Link } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import CelebrationModal from '../components/CelebrationModal';
import CompletionCelebration from '../components/CompletionCelebration';
import ProgressBar from '../components/ProgressBar';
import { allFlashcards } from '../data/flashcards';
import { categories } from '../data/categories';
import { useAudioRecorder } from '../utils/useAudioRecorder';
import { useSpeechSynthesis } from '../utils/useSpeechSynthesis';
import { saveProgress, getCategoryCompletion, clearCategoryProgress, getCurrentIndex, saveCurrentIndex } from '../utils/storage';
import '../styles/Flashcard.css';
import '../styles/FlashcardAnimations.css';
import '../styles/Toast.css';
import '../styles/FlashcardMobile.css';

export default function FlashcardPage() {
    const { categoryId } = useParams();
    const { isRecording, startRecording, stopRecording, audioUrl, toast, clearToast, showToast } = useAudioRecorder();
    const { speak, isSpeaking } = useSpeechSynthesis();
    
    // Get category info
    const category = categories.find(cat => cat.id === categoryId);
    
    // Filter flashcards for this category
    const categoryFlashcards = allFlashcards.filter(
        card => card.category === categoryId
    );
    
    // State - Load saved position from localStorage
    const [currentWordIndex, setCurrentWordIndex] = useState(() => getCurrentIndex(categoryId));
    const [isPlaying, setIsPlaying] = useState(false);
    const [waveAnimation, setWaveAnimation] = useState({ type: null, direction: null });
    const [showCelebration, setShowCelebration] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [progress, setProgress] = useState(() => getCategoryCompletion(categoryId, categoryFlashcards.length));
    const audioRef = useRef(null);
    
    // Get current flashcard
    const currentCard = categoryFlashcards[currentWordIndex];
    
    // Navigation handlers
    const goToNext = () => {
        saveProgress(categoryId, currentCard.id);
        setProgress(getCategoryCompletion(categoryId, categoryFlashcards.length));
        
        // If not on the last card, show celebration and move to next
        if (currentWordIndex < categoryFlashcards.length - 1) {
            setShowCelebration(true); // Show celebration modal
            setCurrentWordIndex(currentWordIndex + 1);
        } 
        // If on the last card, show completion celebration
        else if (currentWordIndex === categoryFlashcards.length - 1) {
            setShowCompletion(true);
        }
    };

    const goToPrevious = () => {
    if (currentWordIndex > 0) {
        setCurrentWordIndex(currentWordIndex - 1);
    }       
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowRight') {
                if (currentWordIndex < categoryFlashcards.length - 1) {
                    saveProgress(categoryId, categoryFlashcards[currentWordIndex].id);
                    setProgress(getCategoryCompletion(categoryId, categoryFlashcards.length));
                    setShowCelebration(true); // Show celebration modal instead
                    setCurrentWordIndex(currentWordIndex + 1);
                }
            }
            if (e.key === 'ArrowLeft') {
                if (currentWordIndex > 0) {
                    setCurrentWordIndex(currentWordIndex - 1);
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentWordIndex, categoryFlashcards.length, categoryId, categoryFlashcards]);

    // Stop recording when clicking outside the record button
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isRecording && !e.target.closest('.control-button.record')) {
                stopRecording();
                setWaveAnimation({ type: 'record', direction: 'inward' });
                setTimeout(() => setWaveAnimation({ type: null, direction: null }), 400);
            }
        };

        if (isRecording) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isRecording, stopRecording]);

        // Reset state when category changes
        useEffect(() => {
            startTransition(() => {
                const progress = getCategoryCompletion(categoryId, categoryFlashcards.length);
                const isCompleted = progress.completed === progress.total;
                
                setCurrentWordIndex(getCurrentIndex(categoryId));
                setShowCelebration(false);
                setShowCompletion(isCompleted);
                setIsPlaying(false);
                setProgress(progress);
            });
        }, [categoryId, categoryFlashcards.length]);

        // Save progress to localStorage whenever card changes
        useEffect(() => {
            saveCurrentIndex(categoryId, currentWordIndex);
        }, [currentWordIndex, categoryId]);
    

    const handleListen = async () => {
        setWaveAnimation({ type: 'listen', direction: 'outward' });
        setTimeout(() => setWaveAnimation({ type: null, direction: null }), 400);
        
        if (!('speechSynthesis' in window)) {
            showToast(`🤐 Can't talk! (Change browser)`);
            return;
        }
        
        speak(currentCard.word);
    };
    
    const handleRecord = async () => {
        if (isRecording) {
            stopRecording();
            setWaveAnimation({ type: 'record', direction: 'inward' });
            setTimeout(() => setWaveAnimation({ type: null, direction: null }), 400);
        } else {
            await startRecording();
        }
    };
    
    const handlePlay = async () => {
        // If currently playing, stop playback
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            setWaveAnimation({ type: 'play', direction: 'inward' });
            setTimeout(() => setWaveAnimation({ type: null, direction: null }), 400);
            return;
        }

        // If currently recording, stop recording first
        if (isRecording) {
            stopRecording();
            setWaveAnimation({ type: 'record', direction: 'inward' });
            setTimeout(() => setWaveAnimation({ type: null, direction: null }), 400);

            await new Promise(resolve => {
                const checkAudio = () => {
                    if (audioUrl) {
                        resolve();
                    } else {
                        setTimeout(checkAudio, 50);
                    }
                };
                setTimeout(checkAudio, 100);
            });
        }

        if (!audioUrl) {
            showToast('🎤 Record first! ▶️ Then play');
            return;
        }
        try {
            setIsPlaying(true);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            
            audio.onended = () => {
                setIsPlaying(false);
                setWaveAnimation({ type: 'play', direction: 'inward' });
                setTimeout(() => setWaveAnimation({ type: null, direction: null }), 400);
            };
            
            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                setIsPlaying(false);
                showToast('🔇 Sound broken! ▶️ Try again');
            };
            
            await audio.play();
        } catch (error) {
            console.error('Playback error:', error);
            setIsPlaying(false);
            showToast('💥 Oops! It broke! (Retry)');
        }
    };
    
    // If category doesn't exist or has no flashcards
    if (!category || categoryFlashcards.length === 0) {
        return (
        <div className="flashcard-page">
            <div className="flashcard-page-container">
            <Link to="/categories" className="back-button">
                <i className="fa-solid fa-arrow-left"></i> Back to Categories
            </Link>
            <p>No flashcards found for this category.</p>
            </div>
        </div>
        );
    }
    
    const handleRetry = () => {
        setShowCompletion(false);
        setCurrentWordIndex(0);
        saveCurrentIndex(categoryId, 0);
        clearCategoryProgress(categoryId);
        setProgress(getCategoryCompletion(categoryId, categoryFlashcards.length));
    };
    
    return (
        <div className="flashcard-page">
        <div className="flashcard-page-container">
            
            {/* Header with Back button and Progress */}
            <div className="flashcard-header">
            <Link to="/categories" className="back-button">
                <i className="fa-solid fa-arrow-left"></i> Back
            </Link>
            
            <div className="progress-bar-container">
                <ProgressBar 
                    current={progress.completed}
                    total={progress.total}
                    percentage={progress.percentage}
                />
            </div>
            </div>
            
            {/* Main Flashcard */}
            <div className="flashcard-main">
            {showCompletion ? (
                <div className="completion-screen">
                    <h2>Congratulations for finishing!</h2>
                    <button className="retry-button" onClick={handleRetry}>
                        <i className="fa-solid fa-arrow-rotate-right"></i> Retry
                    </button>
                </div>
            ) : (
                <>
                <div 
                    className="flashcard-container"
                >
                    <div className="flashcard-wrapper static">
                        <Flashcard 
                            word={currentCard.word}
                            image={currentCard.image}
                            isRecording={isRecording}
                            isPlaying={isPlaying}
                            waveAnimation={waveAnimation}
                        />
                    </div>
                </div>
                
                {/* Audio Control Buttons */}
                <div className="flashcard-controls">
                    <div className="control-button-wrapper">
                    <button 
                        className={`control-button listen ${isSpeaking ? 'speaking' : ''} ${waveAnimation.type === 'listen' && waveAnimation.direction === 'outward' ? 'wave-outward' : ''}`}
                        onClick={handleListen}
                        aria-label="Listen to word pronunciation"
                    >
                        🔊
                    </button>
                    <div className="control-label">Listen</div>
                    </div>
                    
                    <div className="control-button-wrapper">
                    <button 
                        className={`control-button record ${isRecording ? 'recording' : ''} ${waveAnimation.type === 'record' && waveAnimation.direction === 'inward' ? 'wave-inward' : ''}`}
                        onClick={handleRecord}
                        aria-label="Record your voice"
                    >
                        {isRecording ? '⏹️' : '🎤'}
                    </button>
                    <div className="control-label">Record</div>
                    </div>
                    
                    <div className="control-button-wrapper">
                    <button 
                        className={`control-button play ${isRecording ? 'disabled-hover' : ''} ${isPlaying ? 'playing' : ''} ${waveAnimation.type === 'play' && waveAnimation.direction === 'outward' ? 'wave-outward' : ''} ${waveAnimation.type === 'play' && waveAnimation.direction === 'inward' ? 'wave-inward' : ''}`}
                        onClick={handlePlay}
                        aria-label="Play your recording"
                    >
                        ▶️
                    </button>
                    <div className="control-label">Play</div>
                    </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flashcard-navigation">
                    <button 
                    className="nav-button prev" 
                    onClick={goToPrevious}
                    disabled={currentWordIndex === 0}
                    aria-label="Previous card"
                    >
                    <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <button 
                    className={`nav-button next ${currentWordIndex === categoryFlashcards.length - 1 ? 'finish' : ''}`}
                    onClick={goToNext}
                    disabled={false}
                    aria-label="Next card"
                    >
                    {currentWordIndex === categoryFlashcards.length - 1 ? 'Finish! 🎉' : <i className="fa-solid fa-arrow-right"></i>}
                    </button>
                </div>
                </>
            )}
            
            {/* Toast Notification */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    <div className="toast-content">
                        {toast.message}
                    </div>
                    {toast.persistent && (
                        <button 
                            className="toast-close"
                            onClick={clearToast}
                            aria-label="Close notification"
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}

           {/* Celebration Modal */}
            <CelebrationModal 
                show={showCelebration}
                onClose={() => setShowCelebration(false)}
            />

        {/* Completion Celebration - All cards done */}
        <CompletionCelebration 
            show={showCompletion}
            categoryName={category.name}
            currentCategoryId={categoryId}
            totalCards={categoryFlashcards.length}
            onClose={() => {
                setShowCompletion(false);
                setCurrentWordIndex(0);
                // Clear saved progress when restarting
                saveCurrentIndex(categoryId, 0);
                clearCategoryProgress(categoryId);
                setProgress(getCategoryCompletion(categoryId, categoryFlashcards.length));
            }}
        />
            </div>
            
        </div>
        </div>
    );
}