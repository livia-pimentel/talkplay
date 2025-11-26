/* ============================================
    COMPLETION CELEBRATION COMPONENT
    Shows when all cards in category are done
   ============================================ */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CompletionCelebration.css';
import { categories } from '../data/categories';

export default function CompletionCelebration({ 
    show, 
    categoryName,
    currentCategoryId,
    totalCards, 
    onClose 
}) {
    const navigate = useNavigate();
    
    if (!show) return null;

    // Get other categories (excluding current one)
    const otherCategories = categories.filter(cat => cat.id !== currentCategoryId);

    return (
        <div className="completion-overlay">
            <div className="completion-modal">
                <div className="completion-icon">🎉</div>
                <h1 className="completion-title">🌟 Amazing Work! 🌟</h1>
                <p className="completion-message">
                    You completed all <strong>{totalCards} words</strong> in <strong>{categoryName}</strong>!
                </p>
                
                <div className="completion-stats">
                    <div className="stat-badge">
                        <div className="stat-emoji">⭐</div>
                        <div className="stat-number">{totalCards}</div>
                        <div className="stat-label">Words Practiced</div>
                    </div>
                </div>

                <div className="completion-actions">
                    {otherCategories.length > 0 && (
                        <div className="next-categories">
                            <p className="next-categories-label">Try another category:</p>
                            <div className="category-buttons">
                                {otherCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => navigate(`/category/${cat.id}`)}
                                        className={`category-mini-card ${cat.id}`}
                                    >
                                        <div className="category-mini-icon">
                                            <img src={cat.icon} alt={cat.name} />
                                        </div>
                                        <div className="category-mini-name">{cat.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <button onClick={onClose} className="completion-button secondary">
                        Practice Again 🔄
                    </button>

                    <button 
                        onClick={() => navigate('/categories')} 
                        className="completion-button tertiary"
                    >
                        Back to All Categories
                    </button>
                    
                </div>
            </div>
        </div>
    );
}