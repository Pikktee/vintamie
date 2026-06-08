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
      minHeight: '80vh',
      padding: '1rem 0.5rem',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      {/* Glow background positioned absolutely behind everything */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '280px',
        height: '280px',
        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6
      }}></div>

      {/* Logo */}
      <div style={{ position: 'relative', zIndex: 1, display: 'inline-block', marginBottom: '1.25rem' }}>
        <img 
          src="/favicon.svg" 
          alt="Vintamie Logo" 
          style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '18px',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(9, 176, 183, 0.15)'
          }} 
        />
      </div>

      {/* Hero Title */}
      <h1 style={{
        fontSize: '2.1rem',
        fontWeight: '800',
        fontFamily: 'var(--font-title)',
        lineHeight: '1.25',
        letterSpacing: '-0.02em',
        marginBottom: '1.25rem',
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        padding: '0 0.5rem'
      }}>
        Kleidung fotografieren, Anzeige fertig
      </h1>

      {/* Hero Description */}
      <p style={{
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.55',
        maxWidth: '520px',
        margin: '0 auto 2.25rem auto',
        position: 'relative',
        zIndex: 1,
        padding: '0 0.75rem'
      }}>
        Mache ein Foto deiner Kleidung. Vintamie erkennt automatisch Marke, Zustand sowie Farbe und schlägt dir den optimalen Preis vor. Danach kannst du deine Anzeige direkt bei Vinted und Kleinanzeigen einstellen.
      </p>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.85rem',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        padding: '0 1rem',
        marginBottom: '3.5rem'
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
            padding: '0.9rem 1.75rem',
            fontSize: '0.95rem',
            fontWeight: '700',
            textDecoration: 'none',
            boxShadow: '0 8px 25px rgba(9, 176, 183, 0.35)',
            width: '100%',
            maxWidth: '290px',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Download size={16} />
          <span>App für Android laden</span>
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
            padding: '0.8rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '290px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(9, 176, 183, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
          }}
        >
          <Globe size={15} />
          <span>Im Browser starten</span>
          <ArrowRight size={13} style={{ marginLeft: '0.15rem' }} />
        </button>
      </div>

      {/* Features List (Unboxed, clean row) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '100%',
        padding: '0 1rem',
        textAlign: 'left'
      }}>
        {/* Feature 1 */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(9, 176, 183, 0.08)',
            border: '1px solid rgba(9, 176, 183, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0,
            marginTop: '0.25rem'
          }}>
            <Camera size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-title)', fontWeight: '700', marginBottom: '0.25rem' }}>
              1. Foto machen
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              Knipse ein Bild deines Kleidungsstücks oder wähle es aus deiner Galerie aus.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(236, 72, 153, 0.08)',
            border: '1px solid rgba(236, 72, 153, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)',
            flexShrink: 0,
            marginTop: '0.25rem'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-title)', fontWeight: '700', marginBottom: '0.25rem' }}>
              2. Automatische Erkennung
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              Die integrierte Intelligenz erkennt Marke, Farbe und Zustand sekundenschnell.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--warning)',
            flexShrink: 0,
            marginTop: '0.25rem'
          }}>
            <FolderHeart size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-title)', fontWeight: '700', marginBottom: '0.25rem' }}>
              3. Schnell online stellen
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              Übertrage deine Entwürfe mit unserer Erweiterung direkt in die Formulare von Vinted und Kleinanzeigen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
