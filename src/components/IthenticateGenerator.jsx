import React, { useState, useEffect, useCallback } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Clock,
  Lock,
  Settings,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { generateTOTP, getTOTPSecondsRemaining } from '../utils/totp';

// Default base32 secret for RMIT iThenticate 2FA
const DEFAULT_RMIT_SECRET = 'RMITITHENTICATE2FAKEY2026SECURE';
const RMIT_URL = 'http://www.rmit.edu.au/iThenticate';

export default function IthenticateGenerator({ showNotification, isAdmin = false }) {
  const [secretKey, setSecretKey] = useState(() => {
    return localStorage.getItem('ithenticate_rmit_secret') || DEFAULT_RMIT_SECRET;
  });
  const [code, setCode] = useState('------');
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [editSecret, setEditSecret] = useState(secretKey);
  const [showSecretText, setShowSecretText] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update code when timer expires or secret changes
  const updateCode = useCallback(async (currentSecret) => {
    setIsUpdating(true);
    try {
      const newCode = await generateTOTP(currentSecret || secretKey);
      setCode(newCode);
    } catch (e) {
      console.error('Failed to generate TOTP:', e);
    } finally {
      setTimeout(() => setIsUpdating(false), 300);
    }
  }, [secretKey]);

  // Main countdown loop (runs every second)
  useEffect(() => {
    // Initial generation
    updateCode(secretKey);

    const interval = setInterval(() => {
      const remaining = getTOTPSecondsRemaining(30);
      setSecondsRemaining(remaining);

      // When period flips back to near 30 (29 or 30), regenerate code
      if (remaining >= 29) {
        updateCode(secretKey);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secretKey, updateCode]);

  const handleCopyCode = () => {
    if (!code || code === '------') return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    showNotification?.('Código 2FA de iThenticate copiado al portapapeles.');
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const handleCopyText = (text, type, msg) => {
    navigator.clipboard?.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else if (type === 'user') {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else if (type === 'pass') {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
    showNotification?.(msg);
  };

  const handleSaveSecret = (e) => {
    e.preventDefault();
    const clean = editSecret.trim().toUpperCase().replace(/[\s-]+/g, '');
    if (!clean) {
      showNotification?.('La clave secreta no puede estar vacía.');
      return;
    }
    setSecretKey(clean);
    localStorage.setItem('ithenticate_rmit_secret', clean);
    updateCode(clean);
    setShowConfig(false);
    showNotification?.('Clave secreta 2FA guardada correctamente.');
  };

  const handleResetSecret = () => {
    setSecretKey(DEFAULT_RMIT_SECRET);
    setEditSecret(DEFAULT_RMIT_SECRET);
    localStorage.removeItem('ithenticate_rmit_secret');
    updateCode(DEFAULT_RMIT_SECRET);
    showNotification?.('Clave secreta restaurada al valor predeterminado.');
  };

  // Progress percentage (0% to 100%)
  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / 30) * 100));
  const isExpiringSoon = secondsRemaining <= 5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero Service Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.12) 0%, rgba(2, 132, 199, 0.08) 100%)',
          border: '1.5px solid rgba(29, 78, 216, 0.25)',
          borderRadius: 'var(--radius-lg, 16px)',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}
      >
        <div style={{ flex: '1 1 320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'var(--brand-primary)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.04em',
                padding: '3px 9px',
                borderRadius: 6,
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={12} /> EXCLUSIVO
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 6,
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <CheckCircle2 size={12} /> Sincronización 2FA Activa
            </span>
          </div>
          <h2
            style={{
              margin: '0 0 6px',
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            iThenticate · Generador de Código RMIT
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              maxWidth: 620,
            }}
          >
            Generador exclusivo de códigos de verificación temporal (2FA / TOTP) sincronizado con el portal oficial de{' '}
            <strong>RMIT University</strong> para acceso a la suite de investigación de <strong>iThenticate</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href={RMIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(29, 78, 216, 0.25)',
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={16} /> Abrir iThenticate RMIT
          </a>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => updateCode(secretKey)}
            title="Sincronizar código ahora"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <RefreshCw size={15} className={isUpdating ? 'spin' : ''} /> Sincronizar
          </button>
        </div>
      </section>

      {/* Main Grid: Generator & Credentials */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        {/* Card 1: 2FA Live Code Display */}
        <section
          className="panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div>
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'var(--brand-primary-soft)',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                    Código de Acceso 2FA (TOTP)
                  </h3>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    Actualización automática cada 30 segundos
                  </p>
                </div>
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700,
                  color: isExpiringSoon ? '#ef4444' : 'var(--brand-primary)',
                  background: isExpiringSoon ? 'rgba(239, 68, 68, 0.1)' : 'var(--brand-primary-soft)',
                  padding: '4px 10px',
                  borderRadius: 20,
                  transition: 'all 0.2s ease',
                }}
              >
                <Clock size={13} />
                <span>{secondsRemaining}s</span>
              </span>
            </div>

            {/* Countdown Progress Bar */}
            <div
              style={{
                width: '100%',
                height: 5,
                background: 'var(--border-color)',
                borderRadius: 4,
                overflow: 'hidden',
                marginTop: -4,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: isExpiringSoon
                    ? '#ef4444'
                    : 'linear-gradient(90deg, var(--brand-accent) 0%, var(--brand-primary) 100%)',
                  transition: 'width 1s linear, background 0.3s ease',
                }}
              />
            </div>

            {/* Code Big Display */}
            <div
              style={{
                textAlign: 'center',
                padding: '24px 16px',
                background: 'var(--bg-surface-subtle)',
                border: '1.5px dashed var(--border-strong)',
                borderRadius: 'var(--radius-md, 12px)',
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                }}
              >
                CÓDIGO DE VERIFICACIÓN DINÁMICO
              </div>
              <div
                style={{
                  fontSize: 'clamp(32px, 5vw, 44px)',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 12,
                  userSelect: 'all',
                }}
              >
                <span>{code.slice(0, 3)}</span>
                <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>·</span>
                <span>{code.slice(3, 6)}</span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: isExpiringSoon ? '#ef4444' : 'var(--text-secondary)',
                  fontWeight: 600,
                }}
              >
                {isExpiringSoon
                  ? '⚠️ El código está por expirar, espera el siguiente si estás por iniciar sesión'
                  : `Válido durante los próximos ${secondsRemaining} segundos`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="button button-primary"
              onClick={handleCopyCode}
              style={{
                flex: 1,
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                padding: '12px 18px',
                fontSize: 14,
                fontWeight: 700,
                background: copiedCode ? '#10b981' : undefined,
                borderColor: copiedCode ? '#10b981' : undefined,
              }}
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              {copiedCode ? '¡Código Copiado!' : 'Copiar Código de 6 Dígitos'}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setShowConfig(!showConfig)}
              title="Configurar clave secreta 2FA"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 14px',
              }}
            >
              <Settings size={16} />
            </button>
          </div>
        </section>

        {/* Card 2: Portal RMIT Access Details */}
        <section
          className="panel"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                    Acceso Oficial a iThenticate
                  </h3>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    Portal exclusivo de RMIT University
                  </p>
                </div>
              </div>
              <span className="status-pill status-emerald">Vigente</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
              {/* URL field */}
              <div className="field">
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Enlace Oficial de Acceso
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    readOnly
                    value={RMIT_URL}
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: 12.5,
                      background: 'var(--bg-surface-subtle)',
                    }}
                  />
                  <button
                    type="button"
                    className="button button-secondary button-sm"
                    onClick={() =>
                      handleCopyText(
                        RMIT_URL,
                        'url',
                        'Enlace de RMIT iThenticate copiado al portapapeles.'
                      )
                    }
                    title="Copiar enlace"
                  >
                    {copiedUrl ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <a
                    href={RMIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-primary button-sm"
                    title="Ir a RMIT iThenticate"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Institutional Email */}
              <div className="field">
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Correo / Usuario Institucional RMIT
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    readOnly
                    value="rmit.ithenticate@turnitinpe.com"
                    style={{ flex: 1, background: 'var(--bg-surface-subtle)' }}
                  />
                  <button
                    type="button"
                    className="button button-secondary button-sm"
                    onClick={() =>
                      handleCopyText(
                        'rmit.ithenticate@turnitinpe.com',
                        'user',
                        'Usuario de RMIT copiado.'
                      )
                    }
                  >
                    {copiedUser ? <Check size={14} /> : <Copy size={14} />} Copiar
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="field">
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Contraseña Institucional
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    readOnly
                    value="iThenticate#RMIT2026"
                    style={{
                      flex: 1,
                      background: 'var(--bg-surface-subtle)',
                      fontFamily: 'var(--font-mono, monospace)',
                    }}
                  />
                  <button
                    type="button"
                    className="button button-secondary button-sm"
                    onClick={() =>
                      handleCopyText(
                        'iThenticate#RMIT2026',
                        'pass',
                        'Contraseña copiada al portapapeles.'
                      )
                    }
                  >
                    {copiedPass ? <Check size={14} /> : <Copy size={14} />} Copiar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-color)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Lock size={14} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
            <span>
              Ingresa al portal de RMIT, escribe el usuario y contraseña, y cuando solicite el código 2FA pega el generado en esta pantalla.
            </span>
          </div>
        </section>
      </div>

      {/* Secret Configuration Drawer (for admin / custom seed) */}
      {showConfig && (
        <section
          className="panel"
          style={{
            border: '2px solid var(--brand-primary)',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md, 12px)',
          }}
        >
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Settings size={18} style={{ color: 'var(--brand-primary)' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                  Configuración de Semilla Secreta 2FA (Base32)
                </h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                  Personaliza la clave secreta compartida de RMIT iThenticate para generar los códigos de tu cuenta.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveSecret} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label className="field">
              Clave Secreta Base32 (Seed 2FA)
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type={showSecretText ? 'text' : 'password'}
                  value={editSecret}
                  onChange={(e) => setEditSecret(e.target.value)}
                  placeholder="Ej: RMITITHENTICATE2FAKEY2026SECURE"
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-mono, monospace)',
                    letterSpacing: '0.05em',
                  }}
                />
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowSecretText(!showSecretText)}
                  title={showSecretText ? 'Ocultar clave' : 'Mostrar clave'}
                >
                  {showSecretText ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="button button-secondary button-sm"
                onClick={handleResetSecret}
              >
                Restaurar Semilla Predeterminada
              </button>
              <button type="submit" className="button button-primary button-sm">
                Guardar y Recalcular Código
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Step by step instructions guide */}
      <section className="panel">
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={18} style={{ color: 'var(--brand-primary)' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                Guía Rápida para Iniciar Sesión en iThenticate RMIT
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                Sigue estos 4 pasos sencillos para acceder sin errores
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginTop: 8,
          }}
        >
          {[
            {
              num: '1',
              title: 'Abrir RMIT iThenticate',
              desc: 'Haz clic en el botón superior o visita http://www.rmit.edu.au/iThenticate en una pestaña nueva.',
            },
            {
              num: '2',
              title: 'Ingresar Credenciales',
              desc: 'Coloca el correo institucional y contraseña provistos en esta pantalla.',
            },
            {
              num: '3',
              title: 'Copiar Código 2FA',
              desc: 'Copia el código de 6 dígitos que figura en este generador y pégalo en la solicitud de RMIT.',
            },
            {
              num: '4',
              title: 'Acceso Completo',
              desc: '¡Listo! Tu sesión en iThenticate quedará iniciada para subir y revisar manuscritos o tesis.',
            },
          ].map((st) => (
            <div
              key={st.num}
              style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--brand-primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {st.num}
                </span>
                <strong style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>
                  {st.title}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
