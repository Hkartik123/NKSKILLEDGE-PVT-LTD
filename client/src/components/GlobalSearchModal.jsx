import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Layers, FolderGit2, Calendar, HelpCircle, ArrowRight } from 'lucide-react';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
        }
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-header">
          <Search size={22} className="search-box-icon" />
          <input 
            type="text" 
            placeholder="Search programs, services, projects, blogs, FAQs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="search-main-input"
          />
          <button className="search-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="search-results-body">
          {loading && <div className="search-loading">Searching NK SkillEdge platform...</div>}

          {!loading && !results && (
            <div className="search-hint">
              <p>Type to search across courses, business services, live projects, and technical FAQs.</p>
              <div className="quick-tags">
                <span onClick={() => setQuery('Full Stack')}>Full Stack</span>
                <span onClick={() => setQuery('Industrial Training')}>Industrial Training</span>
                <span onClick={() => setQuery('Mobile App')}>Mobile App</span>
                <span onClick={() => setQuery('IoT')}>IoT</span>
                <span onClick={() => setQuery('Certificate')}>Certificate</span>
              </div>
            </div>
          )}

          {!loading && results && (
            <div className="results-container">
              {/* Programs */}
              {results.programs?.length > 0 && (
                <div className="result-group">
                  <div className="group-title"><BookOpen size={16} /> Training Programs ({results.programs.length})</div>
                  {results.programs.map((p) => (
                    <a key={p._id} href="#programs" onClick={onClose} className="result-item">
                      <div className="result-item-main">
                        <strong>{p.name}</strong>
                        <p>{p.shortDescription}</p>
                      </div>
                      <ArrowRight size={16} className="item-arrow" />
                    </a>
                  ))}
                </div>
              )}

              {/* Services */}
              {results.services?.length > 0 && (
                <div className="result-group">
                  <div className="group-title"><Layers size={16} /> Digital Services ({results.services.length})</div>
                  {results.services.map((s) => (
                    <a key={s._id} href="#services" onClick={onClose} className="result-item">
                      <div className="result-item-main">
                        <strong>{s.title}</strong>
                        <p>{s.shortDescription}</p>
                      </div>
                      <ArrowRight size={16} className="item-arrow" />
                    </a>
                  ))}
                </div>
              )}

              {/* Projects */}
              {results.projects?.length > 0 && (
                <div className="result-group">
                  <div className="group-title"><FolderGit2 size={16} /> Case Studies & Projects ({results.projects.length})</div>
                  {results.projects.map((pr) => (
                    <a key={pr._id} href="#projects" onClick={onClose} className="result-item">
                      <div className="result-item-main">
                        <strong>{pr.title}</strong>
                        <p>{pr.shortSummary}</p>
                      </div>
                      <ArrowRight size={16} className="item-arrow" />
                    </a>
                  ))}
                </div>
              )}

              {/* FAQs */}
              {results.faqs?.length > 0 && (
                <div className="result-group">
                  <div className="group-title"><HelpCircle size={16} /> Frequently Asked Questions ({results.faqs.length})</div>
                  {results.faqs.map((f) => (
                    <a key={f._id} href="#faqs" onClick={onClose} className="result-item">
                      <div className="result-item-main">
                        <strong>{f.question}</strong>
                        <p>{f.answer.slice(0, 100)}...</p>
                      </div>
                      <ArrowRight size={16} className="item-arrow" />
                    </a>
                  ))}
                </div>
              )}

              {/* No results */}
              {results.programs?.length === 0 && results.services?.length === 0 && results.projects?.length === 0 && results.faqs?.length === 0 && (
                <div className="no-results">No exact results found for "{query}". Try another query or contact our counselor directly.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .search-modal-box {
          background: var(--bg-surface-elevated);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 680px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
          overflow: hidden;
          animation: slideUp 0.25s ease;
        }
        .search-input-header {
          display: flex;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid var(--border-subtle);
          gap: 14px;
          background: rgba(11, 17, 32, 0.9);
        }
        .search-box-icon {
          color: var(--primary);
        }
        .search-main-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 1.1rem;
          font-family: var(--font-heading);
          outline: none;
        }
        .search-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .search-close-btn:hover { color: #ffffff; }
        .search-results-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }
        .search-hint {
          text-align: center;
          padding: 30px 10px;
          color: var(--text-secondary);
        }
        .quick-tags {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .quick-tags span {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quick-tags span:hover {
          background: rgba(14, 165, 233, 0.15);
          color: var(--primary-hover);
          border-color: var(--primary);
        }
        .result-group {
          margin-bottom: 24px;
        }
        .group-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-hover);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .result-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }
        .result-item:hover {
          background: rgba(14, 165, 233, 0.08);
          border-color: var(--border-primary);
          transform: translateX(4px);
        }
        .result-item-main strong {
          display: block;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        .result-item-main p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .item-arrow {
          color: var(--text-muted);
        }
        .search-loading, .no-results {
          text-align: center;
          padding: 30px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
