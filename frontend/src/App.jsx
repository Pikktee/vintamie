import React, { useState, useEffect } from 'react';
import { Camera, FolderHeart, Sparkles, Settings } from 'lucide-react';
import CameraCapture from './components/CameraCapture';
import DraftList from './components/DraftList';
import DraftDetail from './components/DraftDetail';
import AnalysisLoader from './components/AnalysisLoader';
import { getDrafts, deleteDraft } from './utils/api';

export default function App() {
  const [view, setView] = useState('capture'); // 'capture', 'list', 'detail', 'analyzing'
  const [drafts, setDrafts] = useState([]);
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch drafts from database on mount
  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const data = await getDrafts();
      setDrafts(data);
    } catch (err) {
      console.error("Error fetching drafts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (id) => {
    try {
      await deleteDraft(id);
      // Remove from state
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      if (selectedDraft && selectedDraft.id === id) {
        setSelectedDraft(null);
        setView('list');
      }
    } catch (err) {
      console.error(err);
      alert('Der Entwurf konnte nicht gelöscht werden.');
    }
  };

  const handleAnalysisStart = () => {
    setView('analyzing');
  };

  const handleAnalysisSuccess = (newDraft) => {
    setDrafts((prev) => [newDraft, ...prev]);
    setSelectedDraft(newDraft);
    setView('detail');
  };

  const handleAnalysisError = () => {
    setView('capture');
  };

  const handleUpdateSuccess = (updatedDraft) => {
    setDrafts((prev) => prev.map((d) => (d.id === updatedDraft.id ? updatedDraft : d)));
    setSelectedDraft(updatedDraft);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '70px' }}>
      
      {/* Premium Header */}
      <header className="glass-panel" style={{
        margin: '1rem',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '0.4rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={20} style={{ color: '#000' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Vintamie
            </h1>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Vision Listing Mate
            </span>
          </div>
        </div>

        {/* Small version tag */}
        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
          v1.0.0
        </span>
      </header>

      {/* Main Content Area */}
      <main className="container" style={{ flexGrow: 1 }}>
        {view === 'capture' && (
          <CameraCapture
            onAnalysisStart={handleAnalysisStart}
            onAnalysisSuccess={handleAnalysisSuccess}
            onAnalysisError={handleAnalysisError}
          />
        )}

        {view === 'analyzing' && (
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)' }}>
            <AnalysisLoader />
          </div>
        )}

        {view === 'list' && (
          <DraftList
            drafts={drafts}
            onSelectDraft={(draft) => {
              setSelectedDraft(draft);
              setView('detail');
            }}
            onDeleteDraft={handleDeleteDraft}
          />
        )}

        {view === 'detail' && selectedDraft && (
          <DraftDetail
            draft={selectedDraft}
            onBack={() => {
              setView('list');
              setSelectedDraft(null);
              fetchDrafts(); // Sync changes
            }}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </main>

      {/* Responsive Sticky Footer Navigation (App-like feel) */}
      <nav className="glass-panel" style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '500px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: '99px',
        padding: '0 1rem',
        border: '1px solid var(--glass-border)',
        zIndex: 100,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <button
          onClick={() => setView('capture')}
          style={{
            background: 'transparent',
            border: 'none',
            color: view === 'capture' || view === 'analyzing' ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600',
            transition: 'color 0.2s ease'
          }}
        >
          <Camera size={18} />
          <span>Aufnahme</span>
        </button>

        <button
          onClick={() => {
            fetchDrafts();
            setView('list');
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: view === 'list' || view === 'detail' ? 'var(--primary)' : 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600',
            transition: 'color 0.2s ease'
          }}
        >
          <FolderHeart size={18} />
          <span>Entwürfe</span>
        </button>
      </nav>
    </div>
  );
}
