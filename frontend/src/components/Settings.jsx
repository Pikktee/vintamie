import React from 'react';
import { User, LogOut, Key, Cpu, HelpCircle, ShieldCheck, Globe } from 'lucide-react';

export default function Settings({ user, onLogout }) {
  // If user metadata hasn't loaded yet
  if (!user) return null;

  const loginMethod = user.google_id ? 'Google-Konto' : 'E-Mail & Passwort';

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Einstellungen
        </h2>

        {/* User Account Info Card */}
        <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(9, 176, 183, 0.15)',
            border: '1px solid var(--primary-glow)',
            color: 'var(--primary)',
            padding: '0.75rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Eingeloggt als</span>
            <span style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)' }}>{user.email}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Methode: {loginMethod}</span>
          </div>
        </div>

        {/* AI & System Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-title)', fontWeight: '600', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            Künstliche Intelligenz
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Model Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', padding: '0.5rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Cpu size={16} />
                <span>Gemini Vision Modell</span>
              </div>
              <span style={{
                background: 'rgba(9, 176, 183, 0.15)',
                color: 'var(--primary)',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '600',
                border: '1px solid var(--primary-glow)'
              }}>
                gemini-3.5-flash
              </span>
            </div>

            {/* API Status Card */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', padding: '0.5rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={16} />
                <span>API-Verbindungsstatus</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Aktiv</span>
              </div>
            </div>
          </div>
        </div>

        {/* WebExtension Sync Instructions */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-title)', fontWeight: '600', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            WebExtension Synchronisation
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', padding: '0.5rem 0' }}>
            <Globe size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: '500' }}>Automatischer Login in der Erweiterung</p>
              <p>
                Deine Sitzung wird automatisch mit der Vintamie Chrome/Firefox-Extension synchronisiert, solange du im selben Browser auf dieser Seite eingeloggt bist. Du musst dich in der Extension nicht separat anmelden!
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '2rem' }}>
          <button
            onClick={onLogout}
            className="btn btn-danger"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <LogOut size={18} />
            Abmelden (Logout)
          </button>
        </div>

      </div>
    </div>
  );
}
