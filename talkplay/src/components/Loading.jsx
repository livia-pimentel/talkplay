import React from 'react';
import '../styles/Loading.css';

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <img src="/talkplay-logo.svg" alt="logo" className="loading-logo" />
        <h1 className="loading-title">TalkPlay</h1>
        <div className="loading-spinner" aria-hidden="true">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <p className="loading-text">Preparing your learning experience…</p>
      </div>
      <div className="loading-bg-bubbles" />
    </div>
  );
}
