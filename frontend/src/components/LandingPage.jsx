import React from 'react';
import { Download, Sparkles, Camera, FolderHeart, ArrowRight, Globe } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

export default function LandingPage() {
  const apkDownloadUrl = `${API_BASE_URL}/api/app/latest-apk`;

  const handleOpenWebApp = () => {
    window.location.hash = '#/login';
  };

  return (
    <div className="fade-in landing-page-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '85vh',
      padding: '2rem 1.5rem',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      {/* Hero Card */}
      <div className="glass-panel" style={{
        width: '100%',
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        {/* Glow background */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}></div>

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1, display: 'inline-block', marginBottom: '1.5rem' }}>
          <img 
            src="/favicon.svg" 
            alt="Vintamie Logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '18px',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(9, 176, 183, 0.2)'
            }} 
          />
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: '800',
          fontFamily: 'var(--font-title)',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Second-Hand Verkäufe per Vision AI automatisieren
        </h1>

        {/* Hero Description */}
        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '580px',
          margin: '0 auto 2.5rem auto',
          position: 'relative',
          zIndex: 1
        }}>
          Nimm ein Foto deiner Kleidung auf. Vintamie erkennt automatisch Marke, Zustand, Farbe und schlägt den optimalen Preis vor. Exportiere deine fertigen Entwürfe blitzschnell zu Vinted und Kleinanzeigen.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {/* APK Download Button */}
          <a 
            href={apkDownloadUrl}
            download
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(9, 176, 183, 0.4)',
              width: '100%',
              maxWidth: '320px',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Download size={18} />
            <span>Vintamie für Android (.apk)</span>
          </a>

          {/* Web App Button */}
          <button 
            onClick={handleOpenWebApp}
            className="btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '320px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(9, 176, 183, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
          >
            <Globe size={16} />
            <span>Web-App im Browser öffnen</span>
            <ArrowRight size={14} style={{ marginLeft: '0.25rem' }} />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        width: '100%',
        marginBottom: '2rem'
      }}>
        {/* Feature 1 */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: 'var(--radius-md)' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(9, 176, 183, 0.1)',
            border: '1px solid rgba(9, 176, 183, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '1rem'
          }}>
            <Camera size={20} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-title)', fontWeight: '700', marginBottom: '0.5rem' }}>
            1. Foto knipsen
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Nimm Kleidung direkt per Kamera auf oder lade Fotos aus deiner Galerie hoch.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: 'var(--radius-md)' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(236, 72, 153, 0.1)',
            border: '1px solid rgba(236, 72, 153, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={20} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-title)', fontWeight: '700', marginBottom: '0.5rem' }}>
            2. Vision AI Analyse
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Die Vision-KI ermittelt vollautomatisch Marke, Zustand, Farbe und den passenden Preis.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', borderRadius: 'var(--radius-md)' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--warning)',
            marginBottom: '1rem'
          }}>
            <FolderHeart size={20} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-title)', fontWeight: '700', marginBottom: '0.5rem' }}>
            3. Blitzschnell online
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Übertrage deine fertigen Entwürfe per WebExtension direkt zu Vinted und Kleinanzeigen.
          </p>
        </div>
      </div>
    </div>
  );
}
