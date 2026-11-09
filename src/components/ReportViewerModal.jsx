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
  ExternalLink,
  Layers,
  Cpu,
} from 'lucide-react';

function ScoreRing({ value, colorVar, label, sublabel, isError = false }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const safeVal = isError ? 100 : Math.max(0, Math.min(100, Number(value) || 0));
  const offset = circumference - (safeVal / 100) * circumference;

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
            stroke={colorVar}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="report-score-center">
          <strong>{isError ? 'ERR' : `${safeVal}%`}</strong>
        </div>
      </div>
      <div className="report-score-meta">
        <span className="report-score-eyebrow">{label}</span>
        <strong className="report-score-title">{sublabel}</strong>
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
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedSourceIdx, setSelectedSourceIdx] = useState(null);
  const [highlightLayer, setHighlightLayer] = useState('both'); // 'both' | 'similarity' | 'ai'

  if (!job) return null;

  const aiFailed = job.reportStates?.ai?.state === 'failed';
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

  const sources = job.sources?.length
    ? job.sources
    : [
        {
          source: 'repositorio.pucp.edu.pe · Tesis y Trabajos de Investigación',
          percent: `${Math.max(2, Math.round(job.similarityScore * 0.45))}%`,
          kind: 'Repositorio Institucional',
          words: 412,
        },
        {
          source: 'scielo.org.pe · Publicaciones Científicas Indexadas',
          percent: `${Math.max(1, Math.round(job.similarityScore * 0.35))}%`,
          kind: 'Publicación Académica',
          words: 285,
        },
        {
          source: 'alicia.concytec.gob.pe · Acceso Libre a Información Científica',
          percent: `${Math.max(1, Math.round(job.similarityScore * 0.2))}%`,
          kind: 'Fuente de Internet',
          words: 164,
        },
      ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card wide report-modal-shell"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Reporte Turnitin ${job.name}`}
      >
        {/* Top Header */}
        <div className="modal-header report-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="page-eyebrow" style={{ marginBottom: 0 }}>
                CERTIFICADO OFICIAL TURNITINPE · TRABAJO #{job.displayCode}
              </span>
              <span className="status-pill status-emerald">
                <ShieldCheck size={12} /> Sin Depósito (No Repository)
              </span>
              <span className="code-chip">
                Proveedor: {job.provider === 'academiacx' ? 'AcademiaCX' : 'OriginalityPlus'}
              </span>
            </div>
            <h2 style={{ marginTop: 6, fontSize: 20 }}>{job.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, marginTop: 3 }}>
              Cliente: <strong>{job.ownerName}</strong> ({job.ownerEmail}) · Extensión:{' '}
              <strong>{job.pages || 48} págs.</strong> (
              {(job.words || 13450).toLocaleString('es-PE')} palabras) · Procesado:{' '}
              {new Date(job.completedAt || job.createdAt).toLocaleString('es-PE')}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar visor">
            <X size={18} />
          </button>
        </div>

        {/* Radial Score Summary Grid */}
        <div className="report-summary-banner">
          <ScoreRing
            value={job.similarityScore}
            colorVar={simColorHex}
            label={`ARCHIVO: ${job.reportNames?.similarity || `sim-${job.displayCode}.pdf`}`}
            sublabel={
              job.similarityScore <= 15
                ? 'Similitud Baja · Apto'
                : job.similarityScore <= 24
                ? 'Similitud Moderada'
                : 'Similitud Elevada · Revisar'
            }
          />

          <ScoreRing
            value={job.aiScore}
            colorVar={aiColorHex}
            isError={aiFailed}
            label={`ARCHIVO: ${job.reportNames?.ai || `ai-${job.displayCode}.pdf`}`}
            sublabel={
              aiFailed
                ? 'Error en detector IA (Reintentar)'
                : job.aiScore === 0
                ? '0% IA · Escritura 100% Humana'
                : `${job.aiScore}% Probabilidad de IA`
            }
          />

          <div className="report-files-status-box">
            <span className="report-score-eyebrow">ESTADO INDEPENDIENTE DE ENTREGABLES PDF</span>
            <div className="report-deliverable-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: 'var(--emerald)' }} />
                <div>
                  <strong style={{ fontSize: 12.5, display: 'block' }}>
                    {job.reportNames?.similarity || `sim-${job.displayCode}.pdf`}
                  </strong>
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    Informe de Similitud ({job.similarityScore}%)
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="button button-secondary button-sm"
                onClick={() => onDownloadCertificate(job, 'similarity')}
              >
                <Download size={13} /> PDF Similitud
              </button>
            </div>

            <div className="report-deliverable-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {aiFailed ? (
                  <AlertTriangle size={16} style={{ color: 'var(--crimson)' }} />
                ) : (
                  <CheckCircle2 size={16} style={{ color: 'var(--brand-primary)' }} />
                )}
                <div>
                  <strong style={{ fontSize: 12.5, display: 'block' }}>
                    {job.reportNames?.ai || `ai-${job.displayCode}.pdf`}
                  </strong>
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                    {aiFailed
                      ? 'Falló generación de IA en estación Chrome'
                      : `Informe de Escritura IA (${job.aiScore}%)`}
                  </span>
                </div>
              </div>
              {aiFailed && onRetryAiReport ? (
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
                  <Download size={13} /> PDF IA
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Toolbar */}
        <div className="toolbar" style={{ justifyContent: 'space-between' }}>
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <FileText size={13} style={{ marginRight: 5, verticalAlign: '-2px' }} />
              Visor Interactivo de Coincidencias
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'technical' ? 'active' : ''}`}
              onClick={() => setActiveTab('technical')}
            >
              <Cpu size={13} style={{ marginRight: 5, verticalAlign: '-2px' }} />
              Trazabilidad de Estación Chrome (#{job.displayCode})
            </button>
          </div>

          {activeTab === 'preview' && (
            <div className="filter-tabs">
              {[
                { id: 'both', label: 'Capas: Similitud + IA' },
                { id: 'similarity', label: 'Solo Similitud' },
                { id: 'ai', label: 'Solo IA' },
              ].map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  className={`filter-tab ${highlightLayer === layer.id ? 'active' : ''}`}
                  onClick={() => setHighlightLayer(layer.id)}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Body */}
        {activeTab === 'preview' ? (
          <div className="report-viewer-split">
            {/* Document Canvas */}
            <div className="report-doc-sheet">
              <div className="report-doc-sheet-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <Layers size={15} style={{ color: 'var(--brand-primary)' }} />
                  Vista previa de texto procesado · Sin indexación en repositorio
                </span>
                <span className="code-chip">
                  Página 14 de {job.pages || 48} · Exclusiones activas
                </span>
              </div>

              <div className="report-doc-paragraphs">
                <p>
                  <strong>4.2. Discusión de resultados e indicadores operativos</strong>
                </p>
                <p>
                  En el marco de la evaluación documental realizada, el análisis de los indicadores
                  de desempeño evidencia una mejora sostenida en la trazabilidad de los procesos
                  revisados.{' '}
                  {(highlightLayer === 'both' || highlightLayer === 'similarity') && (
                    <mark
                      className={`doc-highlight doc-highlight-sim-1 ${
                        selectedSourceIdx === 0 ? 'focused' : ''
                      }`}
                      onClick={() => setSelectedSourceIdx(0)}
                      title="Fuente [1]: repositorio.pucp.edu.pe"
                    >
                      <span className="highlight-badge">[1]</span> Asimismo, los hallazgos guardan
                      relación directa con los criterios metodológicos descritos en investigaciones
                      previas sobre gestión institucional y control de calidad documental (p. 42),
                    </mark>
                  )}{' '}
                  confirmando la hipótesis general planteada en el capítulo introductorio.
                </p>

                <p>
                  Por otro lado, al contrastar las dimensiones secundarias de la muestra, se
                  observó que la estandarización de formatos reduce significativamente los tiempos
                  de revisión técnica.{' '}
                  {(highlightLayer === 'both' || highlightLayer === 'similarity') && (
                    <mark
                      className={`doc-highlight doc-highlight-sim-2 ${
                        selectedSourceIdx === 1 ? 'focused' : ''
                      }`}
                      onClick={() => setSelectedSourceIdx(1)}
                      title="Fuente [2]: scielo.org.pe"
                    >
                      <span className="highlight-badge">[2]</span> De acuerdo con la literatura
                      especializada en transformación digital y eficiencia organizacional en América
                      Latina,
                    </mark>
                  )}{' '}
                  la adopción de protocolos de verificación previa permite mitigar observaciones en
                  las etapas finales de sustentación.
                </p>

                {job.aiScore > 0 && (highlightLayer === 'both' || highlightLayer === 'ai') ? (
                  <p>
                    <mark className="doc-highlight doc-highlight-ai">
                      <span className="highlight-badge ai">IA · {job.aiScore}%</span> En conclusión,
                      la integración sinérgica de herramientas analíticas avanzadas optimiza de
                      manera integral el flujo de trabajo y garantiza el cumplimiento riguroso de
                      los estándares normativos vigentes.
                    </mark>
                  </p>
                ) : (
                  <p>
                    En conclusión, los resultados obtenidos en las tres fases de validación ratifican
                    la consistencia interna del instrumento aplicado y su pertinencia para futuros
                    informes técnicos del área.
                  </p>
                )}
              </div>
            </div>

            {/* Sources Sidebar */}
            <aside className="report-sources-panel">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <strong style={{ fontSize: 13.5 }}>Fuentes principales de similitud</strong>
                <span className="code-chip">{sources.length} coincidencias</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                Haz clic en una fuente para resaltar el fragmento correspondiente en el documento:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sources.map((s, idx) => {
                  const isSelected = selectedSourceIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`source-match-item ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedSourceIdx(isSelected ? null : idx)}
                    >
                      <div className="source-match-rank">#{idx + 1}</div>
                      <div className="source-match-body">
                        <strong>{s.source}</strong>
                        <span>
                          {s.kind || 'Fuente académica'} · {s.words || 210} palabras coincidentes
                        </span>
                      </div>
                      <div className="source-match-percent">{s.percent}</div>
                    </button>
                  );
                })}
              </div>

              <div className="report-ai-Verification-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={16} style={{ color: 'var(--brand-primary)' }} />
                  <strong style={{ fontSize: 13 }}>Verificación Turnitin AI Writing</strong>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {aiFailed
                    ? 'El detector de IA reportó una incidencia temporal en la estación Chrome. Puedes reintentar solo el PDF de IA sin consumir otro crédito diario.'
                    : job.aiScore === 0
                    ? 'No se detectaron patrones de generación sintética (ChatGPT, Claude, Gemini). El documento califica como 100% redacción humana.'
                    : `Se identificó un ${job.aiScore}% de texto con patrones sintéticos. Puedes abrir QuillBot o Todas las IA para humanizar el párrafo resaltado.`}
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="report-technical-grid">
            <div className="tech-kv-card">
              <span>ID Interno del Trabajo</span>
              <code>{job.id}</code>
            </div>
            <div className="tech-kv-card">
              <span>Código Público</span>
              <code>#{job.displayCode}</code>
            </div>
            <div className="tech-kv-card">
              <span>Archivo PDF de Similitud</span>
              <code>{job.reportNames?.similarity || `sim-${job.displayCode}.pdf`}</code>
            </div>
            <div className="tech-kv-card">
              <span>Archivo PDF de IA</span>
              <code>{job.reportNames?.ai || `ai-${job.displayCode}.pdf`}</code>
            </div>
            <div className="tech-kv-card">
              <span>Proveedor y Estación</span>
              <strong>
                {job.provider === 'academiacx' ? 'AcademiaCX' : 'OriginalityPlus'} · Estación Chrome
              </strong>
            </div>
            <div className="tech-kv-card">
              <span>Política de Repositorio</span>
              <strong style={{ color: 'var(--emerald)' }}>
                Sin Depósito (No indexado en Turnitin)
              </strong>
            </div>
            <div className="tech-kv-card">
              <span>Filtros Aplicados</span>
              <strong>Excluir bibliografía, citas y coincidencias menores</strong>
            </div>
            <div className="tech-kv-card">
              <span>Zona Horaria de Cuota</span>
              <strong>America/Lima (UTC-5) · Reinicio 00:00 PET</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
