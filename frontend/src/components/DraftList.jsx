import React from 'react';
import { Tag, Sparkles, Trash2, Calendar, ShoppingBag } from 'lucide-react';
import { getImageUrl } from '../utils/api';

export default function DraftList({ drafts, onSelectDraft, onDeleteDraft }) {
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (drafts.length === 0) {
    return (
      <div className="fade-in glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--glass-border)' }}>
          <ShoppingBag size={28} style={{ color: 'var(--text-muted)' }} />
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Keine Entwürfe vorhanden</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '320px', margin: '0 auto' }}>
          Fotografiere ein Kleidungsstück oder einen Gegenstand, um deinen ersten Entwurf zu erstellen.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-title)' }}>
        Deine Entwürfe ({drafts.length})
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.25rem' }}>
        {drafts.map((draft) => (
          <div 
            key={draft.id} 
            className="glass-panel glass-card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              overflow: 'hidden', 
              cursor: 'pointer',
              height: '100%',
              minHeight: '380px'
            }}
            onClick={() => onSelectDraft(draft)}
          >
            {/* Image Thumbnail */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '100%', background: '#000' }}>
              <img 
                src={getImageUrl(draft.image_path)} 
                alt={draft.title}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
              
              {/* Price Tag Overlay */}
              <div style={{ 
                position: 'absolute', 
                bottom: '0.75rem', 
                right: '0.75rem',
                background: 'var(--primary)',
                color: '#000',
                padding: '0.4rem 0.8rem',
                borderRadius: '99px',
                fontWeight: '700',
                fontSize: '0.95rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                {Math.round(draft.price)} €
              </div>
            </div>

            {/* Content Details */}
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.3', 
                marginBottom: '0.5rem', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                height: '2.8rem'
              }}>
                {draft.title || 'Unbenannter Entwurf'}
              </h3>
              
              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  fontSize: '0.75rem', 
                  background: 'rgba(255,255,255,0.04)', 
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  <Tag size={10} />
                  {draft.category}
                </span>
                
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  fontSize: '0.75rem', 
                  background: 'rgba(9, 176, 183, 0.05)', 
                  border: '1px solid rgba(9, 176, 183, 0.15)',
                  color: 'var(--primary)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  <Sparkles size={10} />
                  {draft.condition}
                </span>
              </div>

              {/* Footer row */}
              <div style={{ 
                marginTop: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} />
                  {formatDate(draft.created_at)}
                </span>
                
                {/* Delete button (stop propagation to prevent selecting the card) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Möchtest du diesen Entwurf wirklich löschen?')) {
                      onDeleteDraft(draft.id);
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--danger)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  title="Löschen"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
