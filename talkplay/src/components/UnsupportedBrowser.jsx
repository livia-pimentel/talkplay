/* ============================================
    UNSUPPORTED BROWSER COMPONENT
    Displays when browser doesn't support required features
   ============================================ */

import React from 'react';
import '../styles/UnsupportedBrowser.css';

export default function UnsupportedBrowser() {
    return (
        <div className="unsupported-overlay">
            <div className="unsupported-modal">
                <div className="unsupported-icon">⚠️</div>
                <h1 className="unsupported-title">Browser Not Supported</h1>
                <p className="unsupported-message">
                    TalkPlay needs a modern browser to work properly.
                </p>
                
                <div className="unsupported-features">
                    <div className="feature-item">
                        <span className="feature-icon">🎤</span>
                        <span className="feature-text">Microphone recording</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🔊</span>
                        <span className="feature-text">Speech synthesis</span>
                    </div>
                </div>

                <div className="unsupported-recommendation">
                    <p className="recommendation-text">We recommend using:</p>
                    <div className="browser-options">
                        <div className="browser-option">
                            <div className="browser-icon">🌐</div>
                            <div className="browser-name">Google Chrome</div>
                        </div>
                        <div className="browser-option">
                            <div className="browser-icon">🌊</div>
                            <div className="browser-name">Microsoft Edge</div>
                        </div>
                    </div>
                </div>

                <a 
                    href="https://www.google.com/chrome/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="download-button"
                >
                    Download Chrome
                </a>
            </div>
        </div>
    );
}