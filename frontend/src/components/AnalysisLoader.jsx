import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function AnalysisLoader() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Foto wird analysiert... (und Staubkörner digital weggepustet)",
    "Klamotten-Detektiv sucht nach Marke und Details...",
    "Farben und Muster werden einer Stil-Prüfung unterzogen...",
    "Beschreibung wird verfasst (mit extra viel Verkaufs-Charme)...",
    "Preise werden auf Kleinanzeigen gescrapt... Bitte kurz Geduld!",
    "Medianpreis wird berechnet (und 'Was letzte Preis'-Anfragen ignoriert)...",
    "Das perfekte Angebot wird finalisiert... Gleich geschafft!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2800); // 2.8s per step for comfortable reading

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
      {/* Animated Scan Radar */}
      <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '2.5rem' }}>
        {/* Outer pulse */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          border: '2px solid var(--primary)',
          borderRadius: '50%',
          animation: 'radarPulse 2s infinite cubic-bezier(0.21, 0.6, 0.35, 1)',
          opacity: 0
        }} />
        
        {/* Middle ring */}
        <div style={{
          position: 'absolute',
          top: '15px', left: '15px', right: '15px', bottom: '15px',
          border: '1px dashed rgba(9, 176, 183, 0.4)',
          borderRadius: '50%',
          animation: 'spin 10s linear infinite'
        }} />

        {/* Inner rotating glowing particle */}
        <div style={{
          position: 'absolute',
          top: '35px', left: '35px', right: '35px', bottom: '35px',
          background: 'radial-gradient(circle, rgba(9, 176, 183, 0.2) 0%, rgba(9, 176, 183, 0) 70%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(9, 176, 183, 0.2)'
        }}>
          <Sparkles size={28} style={{ color: 'var(--primary)', animation: 'pulse 1.5s infinite alternate' }} />
        </div>
      </div>

      <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
        Vintamie arbeitet
      </h3>
      
      {/* Cycling step text (dynamic height, no overflow clipping) */}
      <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0 10px', overflow: 'visible' }}>
        <p
          key={activeStep}
          className="fade-in"
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: '500',
            lineHeight: '1.4',
            margin: 0,
            animationDuration: '0.4s',
            overflow: 'visible',
            textAlign: 'center'
          }}
        >
          {steps[activeStep]}
        </p>
      </div>

      {/* Embedded keyframe styles */}
      <style>{`
        @keyframes radarPulse {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(0.9);
            filter: drop-shadow(0 0 2px rgba(9, 176, 183, 0.4));
          }
          100% {
            transform: scale(1.1);
            filter: drop-shadow(0 0 10px rgba(9, 176, 183, 0.8));
          }
        }
      `}</style>
    </div>
  );
}
