import React from 'react';
import './Landing.css';

const PLANS = [
  { name: 'Estudiante', docs: '5 documentos por día', price: 'S/ 100', usd: '$30 USD' },
  { name: 'Instructor', docs: '15 documentos por día', price: 'S/ 200', usd: '$60 USD' },
  { name: 'Instructor Plus', docs: '30 documentos por día', price: 'S/ 300', usd: '$90 USD', popular: true },
  { name: 'Instructor Ilimitado', docs: 'Documentos ilimitados', price: 'S/ 500', usd: '$150 USD' },
];

const FEATURES = [
  ['🔍', 'Informe de Similitud', 'Detecta coincidencias con fuentes académicas, repositorios y publicaciones con reportes detallados en PDF.'],
  ['🤖', 'Detección de IA', 'Identifica texto generado por inteligencia artificial con porcentajes claros y resaltado por párrafo.'],
  ['⚡', 'Resultados inmediatos', 'Sube tu documento y recibe tus informes en minutos, disponibles las 24 horas.'],
  ['🔒', 'Privacidad total', 'Tus documentos no se depositan en repositorios. Tú decides cuándo eliminarlos.'],
  ['✍️', 'QuillBot y Todas las IA', 'Reformula y mejora tu redacción con herramientas de parafraseo y modelos de IA integrados.'],
  ['💬', 'Soporte por WhatsApp', 'Atención directa de un asesor para activar tu cuenta y resolver cualquier duda.'],
];

const FAQ = [
  ['¿Qué es TurnitinPE?', 'Una plataforma para verificar la originalidad de documentos académicos: similitud y detección de escritura con IA.'],
  ['¿Mis documentos son privados?', 'Sí. No se guardan en repositorios y puedes eliminarlos cuando termines.'],
  ['¿Cómo activo mi cuenta?', 'Escríbenos por WhatsApp, elige tu plan y activamos tu acceso de inmediato.'],
  ['¿Puedo ver una demo?', 'Sí, solicita una cuenta demo a tu asesor para recorrer la plataforma antes de comprar.'],
];

export default function Landing({ onLogin }) {
  const wa = 'https://wa.me/51987654321?text=' + encodeURIComponent('Hola, quiero información sobre TurnitinPE');
  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-brand">turnitin<b>pe</b></div>
        <nav>
          <a href="#lp-features">Servicios</a>
          <a href="#lp-plans">Planes</a>
          <a href="#lp-faq">Preguntas</a>
          <a href="#lp-contact">Contacto</a>
        </nav>
        <div className="lp-nav-actions">
          <button className="lp-btn lp-btn-ghost" onClick={onLogin}>Iniciar sesión</button>
          <a className="lp-btn lp-btn-primary" href={wa} target="_blank" rel="noopener noreferrer">Crear cuenta</a>
        </div>
      </header>

      <section className="lp-hero">
        <span className="lp-pill">Integridad académica en la era de la IA</span>
        <h1>Verifica la originalidad de tus documentos en segundos</h1>
        <p>Informes de similitud y detección de IA con calidad institucional, para estudiantes, docentes e investigadores en Perú y Latinoamérica.</p>
        <div className="lp-hero-cta">
          <a className="lp-btn lp-btn-primary lp-btn-lg" href="#lp-plans">Ver planes</a>
          <button className="lp-btn lp-btn-light lp-btn-lg" onClick={onLogin}>Acceder a mi cuenta</button>
        </div>
        <div className="lp-stats">
          <div><strong>24/7</strong><span>Disponibilidad</span></div>
          <div><strong>Similitud + IA</strong><span>Reportes en PDF</span></div>
          <div><strong>100%</strong><span>Privado, sin repositorio</span></div>
        </div>
      </section>

      <section id="lp-features" className="lp-section">
        <h2>Lo que hacemos</h2>
        <p className="lp-sub">Todo lo que necesitas para entregar trabajos auténticos.</p>
        <div className="lp-grid">
          {FEATURES.map(([icon, t, d]) => (
            <div className="lp-card" key={t}>
              <div className="lp-icon">{icon}</div>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-steps">
        <h2>Así de simple</h2>
        <div className="lp-grid lp-grid-3">
          {['Sube tu documento', 'Analizamos similitud e IA', 'Descarga tus informes'].map((s, i) => (
            <div className="lp-card lp-step" key={s}><span>{i + 1}</span><h3>{s}</h3></div>
          ))}
        </div>
      </section>

      <section id="lp-plans" className="lp-section">
        <h2>Planes y precios</h2>
        <p className="lp-sub">Elige el plan según tu rol. Incluye reportes en PDF y soporte por WhatsApp.</p>
        <div className="lp-grid lp-grid-4">
          {PLANS.map((p) => (
            <div className={`lp-card lp-plan ${p.popular ? 'popular' : ''}`} key={p.name}>
              {p.popular && <em>POPULAR</em>}
              <h3>{p.name}</h3>
              <div className="lp-price">{p.price}<small> /mes · {p.usd}</small></div>
              <ul>
                <li>{p.docs}</li>
                <li>Similitud + detección de IA</li>
                <li>Informes PDF detallados</li>
                <li>Soporte por WhatsApp</li>
              </ul>
              <a className="lp-btn lp-btn-primary" href={wa} target="_blank" rel="noopener noreferrer">Comenzar</a>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-b2b">
        <h2>Programa para vendedores aliados</h2>
        <p>Revende cuentas con descuentos por volumen, activación inmediata y panel de gestión propio.</p>
        <a className="lp-btn lp-btn-light" href={wa} target="_blank" rel="noopener noreferrer">Quiero ser aliado</a>
      </section>

      <section id="lp-faq" className="lp-section">
        <h2>Preguntas frecuentes</h2>
        <div className="lp-faq">
          {FAQ.map(([q, a]) => (
            <details key={q}><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
      </section>

      <footer id="lp-contact" className="lp-footer">
        <div>
          <div className="lp-brand">turnitin<b>pe</b></div>
          <p>Autenticidad académica en un mundo con IA.</p>
        </div>
        <div>
          <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <button onClick={onLogin}>Iniciar sesión</button>
        </div>
        <small>© 2026 TurnitinPE. Todos los derechos reservados.</small>
      </footer>
    </div>
  );
}
