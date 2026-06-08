import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { uploadAndAnalyze } from '../utils/api';

export default function CameraCapture({ onAnalysisStart, onAnalysisSuccess, onAnalysisError, initialError }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(initialError);

  React.useEffect(() => {
    setError(initialError);
  }, [initialError]);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('Bitte wähle eine gültige Bilddatei aus.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const triggerCameraInput = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!imageFile) return;
    
    setUploading(true);
    setError(null);
    onAnalysisStart();

    try {
      const result = await uploadAndAnalyze(imageFile);
      onAnalysisSuccess(result);
    } catch (err) {
      console.error(err);
      const errMsg = err.message || 'Die Analyse ist fehlgeschlagen. Versuche es erneut.';
      setError(errMsg);
      onAnalysisError(errMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontFamily: 'var(--font-title)' }}>
          Neues Angebot erstellen
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Fotografiere deinen Artikel oder lade ein Foto hoch. Die Vintamie KI erledigt den Rest.
        </p>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        
        {/* Native mobile camera input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        {/* Image Preview or Drop Zone */}
        {selectedImage ? (
          <div style={{ position: 'relative', maxWidth: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '2rem' }}>
            <img 
              src={selectedImage} 
              alt="Ausgewählter Artikel" 
              style={{ width: '100%', maxHeight: '350px', objectFit: 'contain', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)' }}
            />
            <button 
              className="btn btn-secondary" 
              onClick={() => { setSelectedImage(null); setImageFile(null); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem 1rem', minHeight: 'auto' }}
            >
              Ändern
            </button>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            style={{
              border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--glass-border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '3rem 2rem',
              cursor: 'pointer',
              background: dragActive ? 'rgba(9, 176, 183, 0.05)' : 'rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '50%', border: '1px solid var(--glass-border)' }}>
                <Upload size={32} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Foto hierhin ziehen</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>oder klicken zum Auswählen</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selectedImage ? (
            <button 
              className="btn btn-primary" 
              onClick={handleUploadAndAnalyze}
              disabled={uploading}
              style={{ width: '100%', padding: '1rem' }}
            >
              <Sparkles size={18} />
              {uploading ? 'Analysiere...' : 'Mit KI analysieren'}
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={triggerCameraInput}
              style={{ width: '100%', padding: '1rem' }}
            >
              <Camera size={18} />
              Kamera öffnen
            </button>
          )}

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', textAlign: 'left', marginTop: '0.5rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
