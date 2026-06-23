import React from 'react';
import { FlaskConical, ArrowLeft, ExternalLink, UserPlus, Download, LogIn, Mail } from 'lucide-react';

// Internal-test opt-in link from the Play Console:
//   Test und Veröffentlichung → Test → Interner Test → Tab "Tester" → "Link kopieren".
// Until it's filled in, the join button points users to the waitlist instead.
const OPTIN_URL = 'https://play.google.com/apps/internaltest/4701493677596269227';
const STORE_URL = 'https://play.google.com/store/apps/details?id=com.velosia.app';
const OPTIN_READY = !OPTIN_URL.includes('REPLACE_ME');

const stepNumStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: 'rgba(9, 176, 183, 0.1)',
  border: '1px solid rgba(9, 176, 183, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--primary)',
  fontWeight: '700',
  fontSize: '0.85rem',
  flexShrink: 0
};

const Step = ({ n, icon, title, children }) => (
  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
    <div style={stepNumStyle}>{n}</div>
    <div>
      <h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-title)', fontWeight: '700', margin: '0.15rem 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {icon} {title}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
        {children}
      </p>
    </div>
  </div>
);

export default function TesterPage() {
  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 0.25rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'rgba(9, 176, 183, 0.08)', border: '1px solid rgba(9, 176, 183, 0.2)',
          color: 'var(--primary)', marginBottom: '1rem'
        }}>
          <FlaskConical size={26} />
        </div>
        <h1 style={{
          fontSize: '1.7rem', fontWeight: '800', fontFamily: 'var(--font-title)',
          letterSpacing: '-0.02em', marginBottom: '0.6rem',
          background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Velosia als Tester ausprobieren
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.55', maxWidth: '480px', margin: '0 auto' }}>
          Velosia läuft aktuell als <strong>geschlossener Test</strong> über Google Play. Wenn du eine
          Einladung erhalten hast, installierst du die App in wenigen Schritten direkt aus dem Play Store –
          ganz normal, mit automatischen Updates.
        </p>
      </div>

      {/* Steps */}
      <div className="glass-panel" style={{
        padding: '1.5rem 1.4rem',
        borderRadius: 'var(--radius-lg, 16px)',
        display: 'flex', flexDirection: 'column', gap: '1.4rem',
        textAlign: 'left', marginBottom: '1.5rem'
      }}>
        <Step n="1" icon={<Mail size={15} style={{ color: 'var(--primary)' }} />} title="Auf der Warteliste eintragen">
          Trag dich auf der Startseite mit deiner E-Mail-Adresse ein. Wir nehmen genau diese Adresse in die
          Testliste auf – wichtig: Es muss die <strong>Google-Konto-Adresse</strong> deines Android-Geräts sein.
        </Step>
        <Step n="2" icon={<UserPlus size={15} style={{ color: 'var(--primary)' }} />} title="Test beitreten">
          Sobald wir dich freigeschaltet haben, öffnest du auf dem Smartphone den <strong>Tester-Link</strong> unten
          und tippst auf <strong>„Tester werden"</strong>. Damit trittst du dem geschlossenen Test bei.
        </Step>
        <Step n="3" icon={<Download size={15} style={{ color: 'var(--primary)' }} />} title="Velosia installieren">
          Anschließend erscheint Velosia ganz normal im <strong>Play Store</strong>. Auf „Installieren" tippen –
          fertig. Künftige Updates kommen automatisch.
        </Step>
        <Step n="4" icon={<LogIn size={15} style={{ color: 'var(--primary)' }} />} title="Anmelden & loslegen">
          App öffnen, per Google oder E-Mail anmelden, ein Foto deines Artikels machen – Velosia erstellt den Rest.
        </Step>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', alignItems: 'center' }}>
        {OPTIN_READY ? (
          <a
            href={OPTIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              padding: '0.9rem 1.5rem', fontSize: '0.95rem', fontWeight: '700',
              textDecoration: 'none', width: '100%', maxWidth: '320px',
              boxShadow: '0 8px 25px rgba(9, 176, 183, 0.35)'
            }}
          >
            <UserPlus size={16} /> Test beitreten <ExternalLink size={13} />
          </a>
        ) : (
          <button
            onClick={() => window.location.hash = '#/'}
            className="btn btn-primary"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              padding: '0.9rem 1.5rem', fontSize: '0.95rem', fontWeight: '700',
              width: '100%', maxWidth: '320px',
              boxShadow: '0 8px 25px rgba(9, 176, 183, 0.35)'
            }}
          >
            <Mail size={16} /> Auf die Warteliste eintragen
          </button>
        )}

        <a
          href={STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            padding: '0.8rem 1.5rem', fontSize: '0.88rem', fontWeight: '600',
            background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)', textDecoration: 'none', width: '100%', maxWidth: '320px'
          }}
        >
          <ExternalLink size={14} /> Velosia im Play Store öffnen
        </a>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '360px', lineHeight: '1.45', marginTop: '0.3rem' }}>
          Hinweis: Der Play-Store-Eintrag ist nur sichtbar, wenn dein Google-Konto bereits zum Test
          hinzugefügt wurde und du dem Test beigetreten bist. Sonst erscheint „App nicht gefunden".
        </p>

        <button
          onClick={() => window.location.hash = '#/'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', padding: '0.5rem', marginTop: '0.5rem' }}
        >
          <ArrowLeft size={14} /> Zurück zur Startseite
        </button>
      </div>
    </div>
  );
}
