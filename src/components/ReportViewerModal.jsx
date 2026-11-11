import React, { useState } from 'react';
import {
  X,
  Download,
  ShieldCheck,
  Sparkles,
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Lock,
} from 'lucide-react';

function ScoreRing({ value, colorVar, label, sublabel, isError = false, isLocked = false }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const safeVal = isError || isLocked ? 100 : Math.max(0, Math.min(100, Number(value) || 0));
  const offset = isLocked ? 0 : circumference - (safeVal / 100) * circumference;

  return (
    <div className="report-score-card">
      <div className="report-score-ring-wrap">
        <svg width="80" height="80" viewBox="0 0 80 80" className="report-score-svg">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="7"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={isLocked ? 'var(--amber)' : colorVar}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="report-score-center">
          <strong>{isLocked ? '🔒' : isError ? 'ERR' : `${safeVal}%`}</strong>
        </div>
      </div>
      <div className="report-score-meta">
        <span className="report-score-eyebrow">{label}</span>
        <strong className="report-score-title" style={isLocked ? { color: 'var(--amber)' } : {}}>
          {isLocked ? 'Resultado Protegido' : sublabel}
        </strong>
      </div>
    </div>
  );
}

export default function ReportViewerModal({
  job,
  onClose,
  onDownloadCertificate,
  onRetryAiReport,
}) {
  const [activeTab, setActiveTab] = useState('outcomes');

  if (!job) return null;

  const isDemo = !!(job.isDemoFile || job.state === 'demo_locked');
  const aiFailed = !isDemo && job.reportStates?.ai?.state === 'failed';
  const simColorHex =
    job.similarityScore <= 15
      ? 'var(--emerald)'
      : job.similarityScore <= 24
      ? 'var(--amber)'
      : 'var(--crimson)';

  const aiColorHex = aiFailed
    ? 'var(--crimson)'
    : job.aiScore <= 10
    ? 'var(--brand-primary)'
    : 'var(--amber)';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card wide report-modal-shell"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Informe Turnitin ${job.name}`}
      >
        <div className="modal-header report-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="page-eyebrow" style={{ marginBottom: 0 }}>
                CÓDIGO {job.displayCode} · {isDemo ? 'MODO DEMO (RESULTADOS PROTEGIDOS)' : 'INFORME IA + SIMILITUD'}
              </span>
              <span className={`status-pill ${isDemo ? 'status-amber' : 'status-emerald'}`}>
                {isDemo ? <Lock size={12} /> : <ShieldCheck size={12} />}
                {isDemo ? 'Cuenta Demo · Solo Visualización' : 'Servicio disponible'}
              </span>
            </div>
            <h2 style={{ marginTop: 6, fontSize: 19 }}>{job.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, marginTop: 3 }}>
              Cliente: <strong>{job.ownerName}</strong> ({job.ownerEmail}) · Enviado:{' '}
              {new Date(job.createdAt).toLocaleString('es-PE')}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar visor">
            <X size={18} />
          </button>
        </div>

        {isDemo && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '0 0 16px 0',
            }}
          >
            <span style={{ fontSize: 20 }}>🔒</span>
            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>
              <strong style={{ color: 'var(--amber)' }}>Modo Demo · Resultado Protegido</strong>
              <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)', fontSize: 12 }}>
                Los porcentajes exactos de similitud y detección de IA, así como los informes oficiales PDF, están protegidos y ocultos en esta cuenta demo. Adquiere una cuenta oficial con tu asesor para desbloquear tus informes completos.
              </p>
            </div>
          </div>
        )}

        {/* Radial Score Summary Grid */}
        <div className="report-summary-banner">
          <ScoreRing
            value={job.similarityScore}
            colorVar={simColorHex}
            isLocked={isDemo}
            label={`SIMILITUD (${isDemo ? 'Protegido' : job.reportNames?.similarity || `sim-${job.displayCode}.pdf`})`}
            sublabel="Similitud listo"
          />

          <ScoreRing
            value={job.aiScore}
            colorVar={aiColorHex}
            isError={aiFailed}
            isLocked={isDemo}
            label={`DETECCIÓN DE IA (${isDemo ? 'Protegido' : job.reportNames?.ai || `ai-${job.displayCode}.pdf`})`}
            sublabel={aiFailed ? 'Error en IA' : 'IA listo'}
          />

          <div className="report-files-status-box">
            <span className="report-score-eyebrow">DESCARGA DE INFORMES PDF</span>
            <div className="report-deliverable-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {isDemo ? (
                  <Lock size={16} style={{ color: 'var(--amber)' }} />
                ) : (
                  <CheckCircle2 size={16} style={{ color: 'var(--emerald)' }} />
                )}
                <div>
                  <strong style={{ fontSize: 12.5, display: 'block' }}>
                    {isDemo ? 'Similitud (Protegido)' : 'Similitud listo'}
                  </strong>
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    {isDemo ? '🔒 Oculto en cuenta demo' : job.reportNames?.similarity || `sim-${job.displayCode}.pdf`}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={`button ${isDemo ? 'button-secondary' : 'button-secondary'} button-sm`}
                onClick={() => onDownloadCertificate(job, 'similarity')}
                title={isDemo ? 'Descarga inhabilitada en modo demo' : 'Descargar informe'}
              >
                {isDemo ? <Lock size={13} /> : <Download size={13} />}
                {isDemo ? 'Descarga Protegida' : 'Descargar Similitud'}
              </button>
            </div>

            <div className="report-deliverable-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {isDemo ? (
                  <Lock size={16} style={{ color: 'var(--amber)' }} />
                ) : aiFailed ? (
                  <AlertTriangle size={16} style={{ color: 'var(--crimson)' }} />
                ) : (
                  <CheckCircle2 size={16} style={{ color: 'var(--brand-primary)' }} />
                )}
                <div>
                  <strong style={{ fontSize: 12.5, display: 'block' }}>
                    {isDemo ? 'Detección IA (Protegido)' : aiFailed ? 'Error en IA' : 'IA listo'}
                  </strong>
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    {isDemo
                      ? '🔒 Oculto en cuenta demo'
                      : aiFailed
                      ? 'No se pudo generar este informe. Los demás informes conservan su estado.'
                      : job.reportNames?.ai || `ai-${job.displayCode}.pdf`}
                  </span>
                </div>
              </div>
              {isDemo ? (
                <button
                  type="button"
                  className="button button-secondary button-sm"
                  onClick={() => onDownloadCertificate(job, 'ai')}
                  title="Descarga inhabilitada en modo demo"
                >
                  <Lock size={13} /> Descarga Protegida
                </button>
              ) : aiFailed && onRetryAiReport ? (
                <button
                  type="button"
                  className="button button-primary button-sm"
                  onClick={() => onRetryAiReport(job.id)}
                >
                  <RefreshCw size={13} /> Reintentar IA
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-primary button-sm"
                  onClick={() => onDownloadCertificate(job, 'ai')}
                >
                  <Download size={13} /> Descargar IA
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${activeTab === 'outcomes' ? 'active' : ''}`}
              onClick={() => setActiveTab('outcomes')}
            >
              <FileText size={13} style={{ marginRight: 5, verticalAlign: '-2px' }} />
              Resumen del Documento
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'technical' ? 'active' : ''}`}
              onClick={() => setActiveTab('technical')}
            >
              <Cpu size={13} style={{ marginRight: 5, verticalAlign: '-2px' }} />
              Detalles del Trabajo (#{job.displayCode})
            </button>
          </div>
        </div>

        {activeTab === 'outcomes' ? (
          <div className="report-technical-grid">
            <div className="tech-kv-card">
              <span>Documento</span>
              <strong>{job.name}</strong>
            </div>
            <div className="tech-kv-card">
              <span>Tipo de informe</span>
              <strong>IA + Similitud</strong>
            </div>
            <div className="tech-kv-card">
              <span>Estado Informe de Similitud</span>
              <strong style={{ color: isDemo ? 'var(--amber)' : 'var(--emerald)' }}>
                {isDemo ? '🔒 Resultado Protegido (Modo Demo)' : `Similitud listo (${job.similarityScore}%)`}
              </strong>
            </div>
            <div className="tech-kv-card">
              <span>Estado Informe de IA</span>
              <strong
                style={{
                  color: isDemo
                    ? 'var(--amber)'
                    : aiFailed
                    ? 'var(--crimson)'
                    : 'var(--brand-primary)',
                }}
              >
                {isDemo
                  ? '🔒 Resultado Protegido (Modo Demo)'
                  : aiFailed
                  ? 'Error en IA (Reintentar IA disponible)'
                  : `IA listo (${job.aiScore}%)`}
              </strong>
            </div>
          </div>
        ) : (
          <div className="report-technical-grid">
            <div className="tech-kv-card">
              <span>Código de Trabajo</span>
              <code>Código {job.displayCode}</code>
            </div>
            <div className="tech-kv-card">
              <span>Cliente</span>
              <strong>{job.ownerName}</strong>
            </div>
            <div className="tech-kv-card">
              <span>Archivo PDF Similitud</span>
              <code>{isDemo ? '🔒 [Protegido en Demo]' : job.reportNames?.similarity || `sim-${job.displayCode}.pdf`}</code>
            </div>
            <div className="tech-kv-card">
              <span>Archivo PDF IA</span>
              <code>{isDemo ? '🔒 [Protegido en Demo]' : job.reportNames?.ai || `ai-${job.displayCode}.pdf`}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
