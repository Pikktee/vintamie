import React, { useState, useEffect } from 'react';
import { X, Send, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';
import { submitBugReport } from '../utils/api';

export default function BugReportModal({ onClose, currentView }) {
  const [description, setDescription] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Auto-capture screenshot on mount in the background
  useEffect(() => {
    captureScreen();
  }, []);

  const captureScreen = async () => {
    setIsCapturing(true);
    try {
      // Temporarily mark the modal overlay to be ignored by html2canvas
      const modalOverlay = document.querySelector('.bug-modal-overlay');
      if (modalOverlay) {
        modalOverlay.setAttribute('data-html2canvas-ignore', 'true');
      }
      
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 0.8, // reduce scale for faster capture and smaller payload
        logging: false,
      });
      const base64 = canvas.toDataURL('image/jpeg', 0.7); // compress to jpeg for efficiency
      setScreenshotBase64(base64);
    } catch (err) {
      console.error('Failed to capture screenshot in background:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Bitte beschreibe das Problem.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Auto-generate title from the first line or first 60 characters of description
    const firstLine = description.trim().split('\n')[0];
    const generatedTitle = firstLine.substring(0, 60) || 'Bug Report';

    // Gather device info
    const deviceInfo = {
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      currentView: currentView || 'unknown',
      urlHash: window.location.hash || '#/',
      platform: navigator.platform,
      language: navigator.language,
      timestamp: new Date().toISOString()
    };

    try {
      await submitBugReport({
        title: generatedTitle,
        description,
        device_info: JSON.stringify(deviceInfo),
        screenshot_base64: screenshotBase64
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Fehler beim Senden des Bug Reports.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bug-modal-overlay">
      <div className="glass-panel bug-modal-content fade-in">
        <div className="bug-modal-header">
          <h2>Problem melden</h2>
          <button className="bug-modal-close-btn" onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="bug-modal-success">
            <CheckCircle size={48} style={{ color: 'var(--success)' }} />
            <h3>Bug Report gesendet!</h3>
            <p>Vielen Dank für dein Feedback. Wir werden uns das Problem ansehen.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bug-modal-form">
            {error && (
              <div className="bug-error-message">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="bug-desc">Beschreibung des Problems *</label>
              <textarea
                id="bug-desc"
                className="form-control"
                placeholder="Bitte beschreibe kurz, was passiert ist und wie man den Fehler reproduzieren kann."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isSubmitting}
                style={{ minHeight: '150px' }}
              />
            </div>

            <div className="bug-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="spinner" size={16} />
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Senden</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
