import '../styles/UnsupportedBrowser.css';
import { Link } from 'react-router-dom';

export default function SafeFallback({ error }) {
  return (
    <div className="unsupported-overlay">
      <div className="unsupported-modal">
        <div className="unsupported-icon" aria-hidden>
          🧸
        </div>
        <h1 className="unsupported-title">Uh-oh — Something's not right</h1>
        <p className="unsupported-message">
          TalkPlay had a little tumble. Let's try again or go back home.
        </p>
        {error && (
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 150, overflow: 'auto' }}>
            {String(error)}
          </pre>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center', alignItems: 'center' }}>
          <button
            className="download-button"
            onClick={() => window.location.reload()}
            style={{ padding: '14px 18px', fontSize: 18, borderRadius: 10, minWidth: 120 }}
          >
            Try again 🔁
          </button>

          <Link
            to="/"
            className="download-button"
            style={{ padding: '14px 18px', fontSize: 18, borderRadius: 10, minWidth: 120, background: '#007bff', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Home 🏠
          </Link>
        </div>
      </div>
    </div>
  );
}
