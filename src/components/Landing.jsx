import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  FileText,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Award,
  BookOpen,
  Eye,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';
import './Landing.css';

const PLANS = [
  {
    name: 'Estudiante',
    badge: 'ACCESO BÁSICO',
    docs: '5 documentos al día',
    price: 'S/ 100',
    usd: '$30 USD',
    period: 'mensual',
    desc: 'Ideal para tesis de pregrado, monografías y artículos finales de ciclo.',
    features: [
      '5 documentos diarios sin depósito',
      'Informe de similitud detallado',
      'Detección de IA calibrada',
      'Informes en PDF oficiales descargables',
      'Activación en 2 minutos vía WhatsApp',
      'Soporte técnico continuo',
    ],
    popular: false,
    color: '#0284c7',
  },
  {
    name: 'Instructor',
    badge: 'RECOMENDADO DOCENTES',
    docs: '15 documentos al día',
    price: 'S/ 200',
    usd: '$60 USD',
    period: 'mensual',
    desc: 'Diseñado para asesores de tesis, docentes universitarios e investigadores.',
    features: [
      '15 documentos diarios sin depósito',
      'Informe de similitud Turnitin Feedback',
      'Detector de IA avanzado (ChatGPT, Claude, Gemini)',
      'Acceso a Todas las IA para reformular fragmentos',
      'Parafraseador QuillBot académico integrado',
      'Informes en PDF oficiales idénticos a universidad',
      'Soporte prioritario WhatsApp 24/7',
    ],
    popular: false,
    color: '#0d9488',
  },
  {
    name: 'Instructor Plus',
    badge: 'MÁS POPULAR',
    docs: '30 documentos al día',
    price: 'S/ 300',
    usd: '$90 USD',
    period: 'mensual',
    desc: 'Para centros de investigación, grupos de tesis y revisores de alto volumen.',
    features: [
      '30 documentos diarios sin depósito',
      'Similitud + IA ilimitada en cola rápida',
      'Turnitin Originality y Feedback Studio',
      'Acceso completo a Todas las IA y QuillBot',
      'Gestión multidispositivo (hasta 3 navegadores)',
      'Certificados de integridad con firma digital',
      'Atención personalizada con asesor directo',
    ],
    popular: true,
    color: '#1d4ed8',
  },
  {
    name: 'Instructor Ilimitado',
    badge: 'MÁXIMO PODER',
    docs: 'Documentos ilimitados',
    price: 'S/ 500',
    usd: '$150 USD',
    period: 'mensual',
    desc: 'Para consultorías académicas, institutos y evaluadores profesionales.',
    features: [
      'Documentos ilimitados sin tope diario',
      'Prioridad máxima en servidores de análisis',
      '100% Sin depósito (cero riesgo de auto-plagio)',
      'Suite completa de IA: Claude 3.5, GPT-4o, Gemini',
      'QuillBot Premium integrado ilimitado',
      'Multidispositivo con soporte para equipos',
      'Asesor comercial dedicado para renovaciones',
    ],
    popular: false,
    color: '#7c3aed',
  },
];

const UNIVERSITIES = [
  'Pontificia Universidad Católica del Perú (PUCP)',
  'Universidad Nacional Mayor de San Marcos (UNMSM)',
  'Universidad Nacional de Ingeniería (UNI)',
  'Universidad Peruana de Ciencias Aplicadas (UPC)',
  'Universidad San Ignacio de Loyola (USIL)',
  'Universidad César Vallejo (UCV)',
  'SciELO Perú',
  'ALICIA CONCYTEC',
  'IEEE Xplore',
  'Elsevier ScienceDirect',
  'Crossref',
  'Scopus',
];

const FAQ_ITEMS = [
  {
    q: '¿Qué significa que el análisis sea "Sin Depósito" (No Repository)?',
    a: 'Significa que tu documento se analiza en la memoria volátil de nuestros servidores seguros de Turnitin Originality y Feedback Studio SIN guardarse en la base de datos global de Turnitin. Puedes revisarlo las veces que quieras: cuando tu universidad, asesor o jurado lo pase por su propio Turnitin, no marcará auto-plagio ni 100% de coincidencia.',
  },
  {
    q: '¿El informe generado es idéntico al que entrega mi universidad?',
    a: 'Sí. El informe PDF que descargas es el formato oficial de Turnitin Feedback Studio y Originality, con los mismos códigos de colores, desglose de fuentes primarias, porcentaje de similitud general y porcentaje de detección de IA.',
  },
  {
    q: '¿Qué tipos de Inteligencia Artificial detecta la plataforma?',
    a: 'El motor neuronal detecta texto generado por ChatGPT (GPT-3.5, GPT-4, GPT-4o, o1), Claude 3.5 Sonnet, Google Gemini 1.5, Microsoft Copilot, DeepSeek y herramientas de parafraseo automatizado, con una tasa de falsos positivos menor al 1%.',
  },
  {
    q: '¿Cuánto tiempo tarda en generarse un informe?',
    a: 'El procesamiento promedio toma entre 60 y 120 segundos. Una vez procesado, puedes visualizar el resultado en pantalla y descargar inmediatamente el PDF de Similitud y el PDF de Detección de IA.',
  },
  {
    q: '¿Puedo probar la plataforma antes de adquirir un plan?',
    a: '¡Por supuesto! Hemos habilitado el botón "Probar Demo en Vivo" para que puedas ingresar como cliente demo, explorar los módulos, ver el visor interactivo de reportes y verificar el flujo de trabajo antes de realizar cualquier pago.',
  },
  {
    q: '¿Cuáles son los métodos de pago aceptados y cómo se activa la cuenta?',
    a: 'Aceptamos transferencias BCP, BBVA, Interbank, Yape, Plin y PayPal para clientes internacionales. Una vez enviado el comprobante a nuestro WhatsApp oficial, la cuenta se activa en menos de 2 minutos.',
  },
];

export default function Landing({ onLogin, onTryDemo, currentUser, onReturnToPlatform }) {
  const [activeTabSample, setActiveTabSample] = useState('similarity');
  const [openFaq, setOpenFaq] = useState(0);

  const whatsappBase = 'https://wa.me/51987654321?text=';
  const getWhatsAppPlanLink = (planName) =>
    `${whatsappBase}${encodeURIComponent(
      `Hola TurnitinPE, deseo adquirir el plan *${planName}*. ¿Me podrían brindar los métodos de pago para activación inmediata?`
    )}`;

  return (
    <div className="lp-root">
      {/* Active Session Notification Bar */}
      {currentUser && (
        <div className="lp-session-bar">
          <div className="lp-container lp-session-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="lp-pulse-dot" />
              <span>
                Sesión activa como: <strong>{currentUser.name}</strong> ({currentUser.email})
              </span>
            </div>
            <button
              type="button"
              className="lp-btn lp-btn-sm lp-btn-primary"
              onClick={onReturnToPlatform}
            >
              Ir a mi Panel de Control <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <header className="lp-header">
        <div className="lp-container lp-header-inner">
          <div className="lp-brand-group">
            <a href="#" className="lp-brand">
              <svg
                width="28"
                height="32"
                viewBox="-1 -0.811157 37.211701 60.851957"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="lp-brand-logo"
              >
                <path
                  d="M2.41016 22.1038L1.64596 26.9639H9.37611C3.29193 32.4721 0 41.0436 0 46.5812C0 50.6755 1.29326 53.8567 3.90916 56.0364C5.99601 57.8037 8.87645 58.7757 12.4623 59.0114L12.815 59.0408V57.3324L12.5505 57.2735C9.28794 56.5371 3.85038 54.3574 3.79159 47.7299C3.7622 42.7814 8.84705 33.5324 14.7255 29.6443L13.1677 38.6282H18.135L20.9272 22.1332L2.41016 22.1038Z"
                  fill="#0096FF"
                />
                <path
                  d="M7.23033 0.188843C4.67321 0.188843 2.58636 2.28018 2.55697 4.81334L2.38062 17.8326L5.05531 17.8621H7.7006L7.84757 5.52027H29.7154L29.8623 38.9521H22.867L21.9558 44.2836H30.509C33.0661 44.2836 35.1823 41.9566 35.2117 39.394L35.1235 0.188843H7.23033Z"
                  fill="#0096FF"
                />
              </svg>
              <span>turnitin<b>pe</b></span>
            </a>
          </div>

          <nav className="lp-nav">
            <a href="#soluciones">Soluciones</a>
            <a href="#como-funciona">Cómo Funciona</a>
            <a href="#sin-deposito">Garantía Sin Depósito</a>
            <a href="#planes">Planes y Precios</a>
            <a href="#faq">Preguntas</a>
          </nav>

          <div className="lp-header-actions">
            {onTryDemo && (
              <button
                type="button"
                className="lp-btn lp-btn-outline lp-btn-sm"
                onClick={onTryDemo}
                title="Accede como cliente demo para ver la plataforma"
              >
                <Eye size={14} /> Probar Demo
              </button>
            )}
            <button
              type="button"
              className="lp-btn lp-btn-primary lp-btn-sm"
              onClick={currentUser ? onReturnToPlatform : onLogin}
            >
              {currentUser ? 'Ir a la Plataforma' : 'Iniciar Sesión'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="lp-hero">
        <div className="lp-hero-bg-glow" />
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-copy">
            <div className="lp-hero-eyebrow">
              <ShieldCheck size={14} />
              <span>PLATAFORMA LÍDER EN INTEGRIDAD ACADÉMICA · PERÚ Y LATAM</span>
            </div>
            <h1>
              Detección de Similitud y Redacción con <span className="lp-gradient-text">Inteligencia Artificial</span>
            </h1>
            <p className="lp-hero-lead">
              Verifica la originalidad de tesis, artículos científicos y trabajos académicos en segundos.
              Informes oficiales de nivel institucional <strong>100% Sin Depósito</strong> (tu trabajo jamás queda almacenado en el repositorio global).
            </p>

            <div className="lp-hero-badges-row">
              <span className="lp-pill-badge">
                <CheckCircle2 size={13} style={{ color: '#10b981' }} /> Sin Depósito en Repositorio
              </span>
              <span className="lp-pill-badge">
                <CheckCircle2 size={13} style={{ color: '#10b981' }} /> Reportes en &lt; 2 minutos
              </span>
              <span className="lp-pill-badge">
                <CheckCircle2 size={13} style={{ color: '#10b981' }} /> Calibrado para ChatGPT y Claude
              </span>
              <span className="lp-pill-badge">
                <CheckCircle2 size={13} style={{ color: '#10b981' }} /> Aceptado por SUNEDU y Universidades
              </span>
            </div>

            <div className="lp-hero-actions">
              <a
                href="#planes"
                className="lp-btn lp-btn-primary lp-btn-lg"
              >
                Ver Planes y Precios <ArrowRight size={16} />
              </a>
              {onTryDemo && (
                <button
                  type="button"
                  className="lp-btn lp-btn-glass lp-btn-lg"
                  onClick={onTryDemo}
                >
                  <Eye size={16} /> Probar Demo en Vivo
                </button>
              )}
              <a
                href={`${whatsappBase}${encodeURIComponent(
                  'Hola TurnitinPE, deseo asesoría para revisar mi tesis/documento con Turnitin Sin Depósito.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-btn lp-btn-whatsapp lp-btn-lg"
              >
                <MessageCircle size={16} /> Asesor WhatsApp
              </a>
            </div>
          </div>

          {/* Hero Interactive Document Card Mockup */}
          <div className="lp-hero-mockup">
            <div className="lp-mockup-card">
              <div className="lp-mockup-header">
                <div>
                  <span className="lp-mockup-tag">REPORTE OFICIAL EN VIVO · CÓDIGO #13912</span>
                  <h3>Tesis_Postgrado_Borrador_PUCP_2026.pdf</h3>
                  <small>Turnitin Feedback Studio · Sin Depósito (No Repository)</small>
                </div>
                <span className="lp-status-live">
                  <span className="lp-pulse-dot" /> Servicio Activo
                </span>
              </div>

              {/* Radial Scores */}
              <div className="lp-mockup-scores">
                <div className="lp-score-box">
                  <div className="lp-score-circle lp-score-sim">
                    <span>11%</span>
                  </div>
                  <div className="lp-score-meta">
                    <strong>SIMILITUD</strong>
                    <small>Listo para entrega</small>
                  </div>
                </div>

                <div className="lp-score-box">
                  <div className="lp-score-circle lp-score-ai">
                    <span>0%</span>
                  </div>
                  <div className="lp-score-meta">
                    <strong>DETECCIÓN IA</strong>
                    <small>Texto Humano Seguro</small>
                  </div>
                </div>
              </div>

              {/* Sample Document Excerpt with Highlights */}
              <div className="lp-mockup-doc">
                <div className="lp-mockup-doc-header">
                  <span>Muestra de coincidencia y análisis neuronal</span>
                  <div className="lp-sample-tabs">
                    <button
                      type="button"
                      className={`lp-sample-tab ${activeTabSample === 'similarity' ? 'active' : ''}`}
                      onClick={() => setActiveTabSample('similarity')}
                    >
                      Similitud (11%)
                    </button>
                    <button
                      type="button"
                      className={`lp-sample-tab ${activeTabSample === 'ai' ? 'active' : ''}`}
                      onClick={() => setActiveTabSample('ai')}
                    >
                      IA (0%)
                    </button>
                  </div>
                </div>

                <div className="lp-mockup-text">
                  {activeTabSample === 'similarity' ? (
                    <p>
                      El presente estudio evalúa el impacto de la gobernanza digital en la eficiencia operativa.{' '}
                      <mark className="lp-mark lp-mark-red">
                        [1] Según los datos recabados en el sistema universitario durante el ejercicio 2025-2026
                      </mark>
                      , se identificó un incremento del 34% en la resolución de trámites institucionales.{' '}
                      <mark className="lp-mark lp-mark-amber">
                        [2] Este hallazgo coincide con los postulados teóricos del repositorio institucional
                      </mark>{' '}
                      y refuerza la necesidad de implementar marcos de interoperabilidad técnica.
                    </p>
                  ) : (
                    <p>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>
                        ✓ Análisis de detección de inteligencia artificial completado:
                      </span>{' '}
                      El 100% de los patrones sintácticos, perplejidad y variación léxica corresponden a redacción humana auténtica. No se registraron secuencias sintéticas generadas por modelos como ChatGPT, Claude o Gemini.
                    </p>
                  )}
                </div>

                <div className="lp-mockup-sources">
                  <div className="lp-source-row">
                    <span className="lp-source-num">1</span>
                    <span className="lp-source-name">repositorio.pucp.edu.pe (Tesis Doctoral)</span>
                    <strong className="lp-source-pct">5%</strong>
                  </div>
                  <div className="lp-source-row">
                    <span className="lp-source-num" style={{ background: '#d97706' }}>2</span>
                    <span className="lp-source-name">scielo.org.pe (Artículo Científico Scopus)</span>
                    <strong className="lp-source-pct">4%</strong>
                  </div>
                </div>
              </div>

              <div className="lp-mockup-footer">
                <span>Informes descargables en PDF oficial</span>
                <button
                  type="button"
                  className="lp-btn lp-btn-sm lp-btn-primary"
                  onClick={onTryDemo || onLogin}
                >
                  Ver en la plataforma <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Database Scale Section */}
      <section className="lp-trust-bar">
        <div className="lp-container">
          <p className="lp-trust-label">
            COTEJAMOS TU DOCUMENTO CONTRA LA BASE DE DATOS ACADÉMICA MÁS GRANDE DEL MUNDO
          </p>
          <div className="lp-stats-row">
            <div className="lp-stat-unit">
              <strong>99+ Mil Millones</strong>
              <span>Páginas web indexadas</span>
            </div>
            <div className="lp-stat-unit">
              <strong>1.8+ Mil Millones</strong>
              <span>Tesis y trabajos académicos</span>
            </div>
            <div className="lp-stat-unit">
              <strong>89+ Millones</strong>
              <span>Artículos científicos (IEEE, Elsevier, Scopus)</span>
            </div>
            <div className="lp-stat-unit">
              <strong>&lt; 120 Segundos</strong>
              <span>Tiempo promedio de entrega</span>
            </div>
          </div>

          <div className="lp-universities-track">
            {UNIVERSITIES.map((u) => (
              <span key={u} className="lp-uni-chip">
                {u}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do / Features Section */}
      <section id="soluciones" className="lp-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-eyebrow">QUÉ HACEMOS · SUITE INTEGRAL TURNITINPE</span>
            <h2>Soluciones profesionales para integridad académica</h2>
            <p>
              Diseñado para estudiantes que necesitan aprobar su tesis sin sobresaltos, docentes que revisan decenas de trabajos y asesores que exigen la máxima precisión.
            </p>
          </div>

          <div className="lp-features-grid">
            <div className="lp-feature-card">
              <div className="lp-feature-icon" style={{ background: 'rgba(29, 78, 216, 0.12)', color: '#1d4ed8' }}>
                <FileText size={26} />
              </div>
              <h3>Turnitin Feedback Studio & Originality</h3>
              <p>
                Informes oficiales con desglose de similitud por fuentes primarias, cotejo cruzado de párrafos y coincidencia exacta en formato idéntico al de las universidades de Perú.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon" style={{ background: 'rgba(13, 148, 136, 0.12)', color: '#0d9488' }}>
                <Cpu size={26} />
              </div>
              <h3>Detector Neuronal de Escritura con IA</h3>
              <p>
                Algoritmo de última generación con menos del 1% de falsos positivos. Identifica fragmentos redactados por ChatGPT, Claude, Gemini, Copilot o herramientas automáticas de parafraseo.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon" style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#d97706' }}>
                <Lock size={26} />
              </div>
              <h3>Garantía 100% Sin Depósito (No Repository)</h3>
              <p>
                Privacidad y confidencialidad absolutas. Tu documento no se sube a la base global de Turnitin, garantizando que tu universidad no detectará auto-plagio al momento de tu entrega final.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon" style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed' }}>
                <Sparkles size={26} />
              </div>
              <h3>QuillBot y Laboratorio de IA Integrado</h3>
              <p>
                Accede a modelos de inteligencia artificial y al motor de parafraseo académico de QuillBot para reestructurar citas, mejorar el estilo de redacción y citar correctamente en normas APA 7ma o Vancouver.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <Zap size={26} />
              </div>
              <h3>Entregas Rápidas las 24 Horas</h3>
              <p>
                Nuestra plataforma opera con servidores dedicados y balanceo de carga automático para generar tus informes PDF en menos de 2 minutos, sin importar la hora o el día.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-icon" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284c7' }}>
                <MessageCircle size={26} />
              </div>
              <h3>Asesoría y Soporte WhatsApp Inmediato</h3>
              <p>
                Atención personalizada con asesores en Lima capacitados en metodología de la investigación para orientarte en cómo interpretar tus reportes y resolver cualquier duda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* No Repository Deep Dive Banner */}
      <section id="sin-deposito" className="lp-no-repo-section">
        <div className="lp-container">
          <div className="lp-no-repo-banner">
            <div className="lp-no-repo-copy">
              <span className="lp-pill-badge" style={{ background: 'rgba(239, 68, 68, 0.18)', color: '#f87171' }}>
                SEGURIDAD ACADÉMICA GARANTIZADA
              </span>
              <h2>¿Por qué NUNCA debes revisar tu tesis en un Turnitin con depósito?</h2>
              <p>
                Muchas páginas gratuitas o revendedores informales usan cuentas institucionales con <strong>Depósito Activado</strong>.
                Cuando subes tu archivo a esos servicios, tu trabajo queda grabado para siempre en la base de datos de Turnitin.
                Al día siguiente, cuando tu universidad lo revisa, marca <strong>100% DE PLAGIO</strong> y tu tesis queda anulada.
              </p>
              <div className="lp-no-repo-points">
                <div className="lp-point">
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                  <div>
                    <strong>TurnitinPE procesa 100% Sin Depósito (No Repository)</strong>
                    <p>El documento se analiza en memoria volátil y luego puedes eliminarlo cuando quieras.</p>
                  </div>
                </div>
                <div className="lp-point">
                  <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                  <div>
                    <strong>Cero riesgo de auto-plagio ante tu jurado</strong>
                    <p>Tu universidad recibirá el archivo como completamente nuevo e inédito.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-no-repo-visual">
              <div className="lp-comparison-box">
                <div className="lp-comparison-side bad">
                  <span className="title">❌ Otros Servicios Informales</span>
                  <ul>
                    <li>Guardan tu tesis en repositorio</li>
                    <li>Marca 100% de plagio en tu universidad</li>
                    <li>Demoras de horas o días</li>
                    <li>Sin soporte técnico real</li>
                  </ul>
                </div>
                <div className="lp-comparison-side good">
                  <span className="title">✓ TurnitinPE Oficial</span>
                  <ul>
                    <li>100% Sin Depósito garantizado</li>
                    <li>Cero riesgo para tu graduación</li>
                    <li>Informes PDF en menos de 2 minutos</li>
                    <li>Soporte WhatsApp en Lima 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="lp-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-eyebrow">PASO A PASO SENCILLO</span>
            <h2>Cómo obtener tu informe oficial en 3 pasos</h2>
            <p>Un proceso intuitivo diseñado para que no pierdas tiempo.</p>
          </div>

          <div className="lp-steps-grid">
            <div className="lp-step-card">
              <div className="lp-step-badge">1</div>
              <h3>Carga tu archivo</h3>
              <p>Sube tu tesis, monografía o artículo en formato PDF o Word (soporta documentos de hasta 800 páginas).</p>
            </div>

            <div className="lp-step-card">
              <div className="lp-step-badge">2</div>
              <h3>Análisis Neuronal</h3>
              <p>El sistema coteja el contenido contra 99+ mil millones de fuentes y ejecuta el detector de inteligencia artificial.</p>
            </div>

            <div className="lp-step-card">
              <div className="lp-step-badge">3</div>
              <h3>Descarga tus PDFs</h3>
              <p>Visualiza tus porcentajes y descarga tus certificados oficiales de Similitud y Detección de IA listos para tu universidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planes" className="lp-section lp-plans-bg">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-eyebrow">PRECIOS CLAROS Y TRANSPARENTES</span>
            <h2>Elige el plan ideal para tu investigación</h2>
            <p>Sin contratos forzosos. Activación en 2 minutos mediante WhatsApp.</p>
          </div>

          <div className="lp-plans-grid">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`lp-pricing-card ${plan.popular ? 'popular' : ''}`}
                style={{ borderColor: plan.popular ? plan.color : undefined }}
              >
                {plan.popular && (
                  <span className="lp-popular-badge" style={{ background: plan.color }}>
                    {plan.badge}
                  </span>
                )}
                {!plan.popular && <span className="lp-plan-eyebrow">{plan.badge}</span>}

                <h3>{plan.name}</h3>
                <p className="lp-plan-desc">{plan.desc}</p>

                <div className="lp-plan-price-row">
                  <strong className="lp-plan-amount">{plan.price}</strong>
                  <span className="lp-plan-period">/mes</span>
                  <small className="lp-plan-usd">({plan.usd})</small>
                </div>

                <div className="lp-plan-capacity">
                  <Zap size={14} style={{ color: plan.color }} />
                  <strong>{plan.docs}</strong>
                </div>

                <ul className="lp-plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={getWhatsAppPlanLink(plan.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`lp-btn ${plan.popular ? 'lp-btn-primary' : 'lp-btn-outline'} lp-btn-block`}
                  style={plan.popular ? { background: plan.color, borderColor: plan.color } : {}}
                >
                  <MessageCircle size={15} /> Adquirir Plan {plan.name}
                </a>
              </div>
            ))}
          </div>

          {/* Demo Account Box */}
          <div className="lp-demo-invite-card">
            <div>
              <span className="lp-pill-badge" style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b' }}>
                MODO PRUEBA DISPONIBLE
              </span>
              <h3>¿Deseas recorrer la plataforma antes de adquirir un plan?</h3>
              <p>
                Ingresa con nuestra cuenta Demo gratuita para explorar el panel de control, ver el visor de reportes y verificar el funcionamiento de las herramientas.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {onTryDemo && (
                <button
                  type="button"
                  className="lp-btn lp-btn-primary lp-btn-lg"
                  onClick={onTryDemo}
                >
                  <Eye size={16} /> Ingresar a Demo Gratis
                </button>
              )}
              <button
                type="button"
                className="lp-btn lp-btn-outline lp-btn-lg"
                onClick={onLogin}
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* B2B / Allies Section */}
      <section className="lp-section lp-allies-section">
        <div className="lp-container">
          <div className="lp-allies-banner">
            <div>
              <span className="lp-pill-badge" style={{ background: 'rgba(56, 189, 248, 0.18)', color: '#7dd3fc' }}>
                PROGRAMA DE DISTRIBUIDORES Y VENDEDORES
              </span>
              <h2>¿Quieres generar ingresos revendiendo accesos TurnitinPE?</h2>
              <p>
                Ofrecemos a asesores de tesis, librerías y centros de fotocopiado la posibilidad de convertirse en <strong>Admin Reportes</strong>.
                Crea cuentas para tus propios clientes con panel de control exclusivo y tarifas con descuento especial.
              </p>
            </div>
            <a
              href={`${whatsappBase}${encodeURIComponent(
                'Hola, estoy interesado en ser distribuidor/vendedor aliado de TurnitinPE para revender cuentas.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn lp-btn-light lp-btn-lg"
            >
              <MessageCircle size={16} /> Solicitar Acceso Vendedor
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="lp-section">
        <div className="lp-container lp-faq-container">
          <div className="lp-section-header">
            <span className="lp-section-eyebrow">RESOLVEMOS TUS DUDAS</span>
            <h2>Preguntas Frecuentes</h2>
            <p>Todo lo que necesitas saber sobre el funcionamiento de TurnitinPE.</p>
          </div>

          <div className="lp-faq-accordion">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className={`lp-faq-card ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="lp-faq-question"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>
                  {isOpen && <div className="lp-faq-answer">{item.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="lp-final-cta">
        <div className="lp-container">
          <h2>Empieza a revisar tus documentos hoy mismo</h2>
          <p>
            Únete a miles de tesistas, docentes e investigadores en todo el Perú que confían en TurnitinPE para garantizar la originalidad de sus entregas.
          </p>
          <div className="lp-final-actions">
            <button
              type="button"
              className="lp-btn lp-btn-primary lp-btn-lg"
              onClick={currentUser ? onReturnToPlatform : onLogin}
            >
              {currentUser ? 'Ir a mi Panel de Control' : 'Acceder a la Plataforma'} <ArrowRight size={16} />
            </button>
            <a
              href={`${whatsappBase}${encodeURIComponent(
                'Hola TurnitinPE, deseo activar mi cuenta ahora mismo.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn lp-btn-whatsapp lp-btn-lg"
            >
              <MessageCircle size={16} /> Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-grid">
          <div className="lp-footer-col">
            <div className="lp-brand">
              <span>turnitin<b>pe</b></span>
            </div>
            <p style={{ marginTop: 10, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
              Plataforma líder en verificación de integridad académica, detección de inteligencia artificial y capacitación metodológica para universidades en Perú y Latinoamérica.
            </p>
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <span className="lp-status-live" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
                <span className="lp-pulse-dot" /> Servidores 100% Operativos
              </span>
            </div>
          </div>

          <div className="lp-footer-col">
            <h4>Soluciones</h4>
            <ul>
              <li><a href="#soluciones">Turnitin Feedback Studio</a></li>
              <li><a href="#soluciones">Detector de Inteligencia Artificial</a></li>
              <li><a href="#sin-deposito">Modo Sin Depósito (No Repository)</a></li>
              <li><a href="#soluciones">QuillBot y Asistente IA</a></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Planes y Vendedores</h4>
            <ul>
              <li><a href="#planes">Planes para Estudiantes</a></li>
              <li><a href="#planes">Planes para Docentes</a></li>
              <li><a href="#planes">Planes Ilimitados</a></li>
              <li><a href="#soluciones">Programa de Distribuidores B2B</a></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Acceso y Contacto</h4>
            <ul>
              <li>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#7dd3fc', cursor: 'pointer', padding: 0 }}
                  onClick={onLogin}
                >
                  Iniciar Sesión en Plataforma
                </button>
              </li>
              {onTryDemo && (
                <li>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#7dd3fc', cursor: 'pointer', padding: 0 }}
                    onClick={onTryDemo}
                  >
                    Probar Cuenta Demo
                  </button>
                </li>
              )}
              <li>
                <a
                  href={`${whatsappBase}${encodeURIComponent('Hola TurnitinPE, solicito atención comercial.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Atención WhatsApp (+51 987 654 321)
                </a>
              </li>
              <li><a href="#faq">Preguntas Frecuentes</a></li>
            </ul>
          </div>
        </div>

        <div className="lp-container lp-footer-bottom">
          <p>© 2026 TurnitinPE · Todos los derechos reservados. Desarrollado con tecnología de procesamiento sin depósito.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Lima, Perú</span>
            <span>·</span>
            <span>Términos y Privacidad</span>
            <span>·</span>
            <span>Soporte 24/7</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
