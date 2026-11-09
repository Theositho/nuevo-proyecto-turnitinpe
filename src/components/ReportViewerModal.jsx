import React, { useState } from 'react';
import {
  X,
  Download,
  ShieldCheck,
  Sparkles,
  FileText,
} from 'lucide-react';

export default function ReportViewerModal({ job, onClose, onDownloadCertificate }) {
  const [activeTab, setActiveTab] = useState('both');

  if (!job) return null;

  const simColor =
    job.similarityScore <= 15
      ? 'status-emerald'
      : job.similarityScore <= 25
      ? 'status-amber'
      : 'status-crimson';

  const aiColor =
    job.aiScore <= 10
      ? 'status-emerald'
      : job.aiScore <= 20
      ? 'status-amber'
      : 'status-crimson';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Reporte Turnitin ${job.name}`}
      >
        <div className="modal-header">
          <div>
            <span className="page-eyebrow">
              REPORTE OFICIAL DE IA Y SIMILITUD · CÓDIGO #{job.displayCode}
            </span>
            <h2>{job.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
              Cliente: <strong>{job.ownerName}</strong> ({job.ownerEmail}) · Proveedor:{' '}
              <strong>OriginalityPlus</strong> · Extensión:{' '}
              <strong>{job.pages || 45} págs.</strong> ({(job.words || 12400).toLocaleString('es-PE')}{' '}
              palabras)
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar visor">
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                REPORTE DE SIMILITUD
              </span>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                {job.similarityScore}%
              </div>
              <span className={`status-pill ${simColor}`}>
                {job.similarityScore <= 15
                  ? 'Baja similitud (<15%)'
                  : job.similarityScore <= 20
                  ? 'Rango moderado'
                  : 'Similitud elevada'}
              </span>
            </div>
            <ShieldCheck size={38} style={{ color: 'var(--brand-primary)', opacity: 0.85 }} />
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                REPORTE DE DETECCIÓN DE IA
              </span>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                {job.aiScore === 0 ? '0% *' : `${job.aiScore}%`}
              </div>
              <span className={`status-pill ${aiColor}`}>
                {job.aiScore <= 10 ? 'Escritura humana verificada' : 'Coincidencia de IA detectada'}
              </span>
            </div>
            <Sparkles size={38} style={{ color: 'var(--emerald)', opacity: 0.85 }} />
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
              PRIVACIDAD DEL ARCHIVO
            </span>
            <strong style={{ fontSize: 14.5, color: 'var(--emerald)' }}>
              Sin Depósito (No Repository)
            </strong>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Tu documento no queda guardado en el repositorio de Turnitin.
            </span>
          </div>
        </div>

        <div className="toolbar">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeTab === 'both' ? 'active' : ''}`}
              onClick={() => setActiveTab('both')}
            >
              Fuentes Detectadas y Vista Previa
            </button>
            <button
              className={`filter-tab ${activeTab === 'filters' ? 'active' : ''}`}
              onClick={() => setActiveTab('filters')}
            >
              Detalles Técnicos del Trabajo
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="button button-secondary button-sm"
              onClick={() => onDownloadCertificate(job, 'similarity')}
            >
              <Download size={14} />
              Descargar PDF Similitud ({job.similarityScore}%)
            </button>
            <button
              className="button button-primary button-sm"
              onClick={() => onDownloadCertificate(job, 'ai')}
            >
              <Download size={14} />
              Descargar PDF IA ({job.aiScore}%)
            </button>
          </div>
        </div>

        {activeTab === 'both' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.25fr 0.75fr',
              gap: 16,
            }}
          >
            <div
              style={{
                padding: 18,
                borderRadius: 12,
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface-subtle)',
                fontSize: 13.5,
                lineHeight: 1.7,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  paddingBottom: 8,
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <strong style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={15} /> Extracto analizado en el documento
                </strong>
                <span className="code-chip">Pág. 14 de {job.pages || 45}</span>
              </div>
              <p style={{ marginBottom: 10 }}>
                En el contexto de la modernización institucional peruana, la gestión por resultados
                permite articular la planificación estratégica con la calidad del gasto público.{' '}
                <mark
                  style={{
                    background: 'rgba(217, 119, 6, 0.18)',
                    color: 'inherit',
                    padding: '2px 5px',
                    borderRadius: 4,
                    borderBottom: '2px solid var(--amber)',
                  }}
                >
                  Según el enfoque metodológico planteado en estudios previos sobre gobernanza y
                  transformación digital (Fuente [1] · 3%),
                </mark>{' '}
                la trazabilidad de los indicadores operativos fortalece la toma de decisiones basada
                en evidencia empírica.
              </p>
              <p>
                Asimismo, el análisis estadístico demostró una correlación positiva y significativa
                entre las dimensiones evaluadas, confirmando la consistencia metodológica del
                documento revisado.
              </p>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 12,
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <strong style={{ fontSize: 13.5 }}>Fuentes de similitud encontradas</strong>
              {(job.sources || []).map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ flex: 1 }}>
                    <strong>[{idx + 1}]</strong> {s.source}
                  </span>
                  <span className="code-chip">{s.percent}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-surface-subtle)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              fontSize: 13,
            }}
          >
            <div>
              <strong>Archivo PDF IA:</strong>{' '}
              <code>{job.reportNames?.ai || `ai-${job.id}.pdf`}</code>
            </div>
            <div>
              <strong>Archivo PDF Similitud:</strong>{' '}
              <code>{job.reportNames?.similarity || `sim-${job.id}.pdf`}</code>
            </div>
            <div>
              <strong>Filtros de exclusión:</strong> Bibliografía y citas excluidas
            </div>
            <div>
              <strong>Proveedor de estación:</strong> OriginalityPlus · Estación Chrome
            </div>
            <div>
              <strong>Fecha de envío (Lima):</strong>{' '}
              {new Date(job.createdAt).toLocaleString('es-PE')}
            </div>
            <div>
              <strong>Estado de conservación:</strong> Sin eliminación automática
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
