/* ============================================
    PROGRESSBAR COMPONENT
    Reusable progress bar for tracking completion
   ============================================ */

import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({ current, total, percentage, label }) {
    return (
        <div className="progress-bar-component">
            {label && (
                <div className="progress-bar-label">
                    {label}
                </div>
            )}
            <div className={`progress-bar-track ${percentage === 100 ? 'complete' : ''}`}>
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${percentage}%` }}
                >
                    <span className="progress-bar-text">{percentage}%</span>
                </div>
            </div>
            <div className="progress-bar-stats">
                {current} of {total} completed
            </div>
        </div>
    );
}