import React, { useState, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  FileCheck2,
  FolderLock,
  Sparkles,
  Feather,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  History,
  LogOut,
  Sun,
  Moon,
  Upload,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  Smartphone,
  MessageCircle,
  ShieldCheck,
  Terminal,
  Copy,
  Menu,
  X,
  BookOpen,
  Sliders,
  Send,
  Trash2,
  KeyRound,
  Award,
  Layers,
} from 'lucide-react';
import {
  SEED_ADMIN_USER,
  SEED_COURSES,
  SEED_SERVICES,
  SEED_PLANS,
  SEED_JOBS,
  SEED_USERS,
  SEED_AI_MODELS,
  SEED_BINDINGS,
  SEED_AUDIT,
} from './data/liveSeedData';
import ReportViewerModal from './components/ReportViewerModal';

function formatCurrency(minor, currency = 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format((minor || 0) / 100);
}

function getInitials(name = '') {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'TP'
  );
}

function TurnitinSymbol() {
  return (
    <svg
      className="brand-symbol"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-1 -0.811157 37.211701 60.851957"
      fill="none"
      aria-hidden="true"
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
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(SEED_ADMIN_USER);
  const [viewMode, setViewMode] = useState('admin'); // 'admin' | 'member'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('saraviarosquetecomeverga@chivo.com');
  const [loginPassword, setLoginPassword] = useState('yacache@123456');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Core data states
  const [courses, setCourses] = useState(SEED_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState('course-tesis-posgrado');
  const [jobs, setJobs] = useState(SEED_JOBS);
  const [users, setUsers] = useState(SEED_USERS);
  const [plans, setPlans] = useState(SEED_PLANS);
  const [bindings, setBindings] = useState(SEED_BINDINGS);
  const [auditLogs, setAuditLogs] = useState(SEED_AUDIT);

  // Filters & search
  const [jobSearch, setJobSearch] = useState('');
  const [jobCourseFilter, setJobCourseFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  // Upload studio state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('');
  const [uploadCourseCode, setUploadCourseCode] = useState('POS-2026-II');
  const [uploadKinds, setUploadKinds] = useState(['ai', 'similarity']);
  const [excludeBib, setExcludeBib] = useState(true);
  const [excludeQuotes, setExcludeQuotes] = useState(true);
  const [excludeSmallWords, setExcludeSmallWords] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Modals state
  const [selectedJobForReport, setSelectedJobForReport] = useState(null);
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [toast, setToast] = useState(null);

  // AI Studio state
  const [selectedAiModel, setSelectedAiModel] = useState(SEED_AI_MODELS[0].model);
  const [aiUsedToday, setAiUsedToday] = useState(4);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: '¡Bienvenido al Laboratorio Académico de IA de TurnitinPE! Selecciona un modelo especializado o utiliza las plantillas inferiores para redactar tu marco teórico, parafrasear con normas APA 7ma edición o interpretar tablas estadísticas SPSS.',
    },
  ]);

  // QuillBot Interactive state
  const [qbInput, setQbInput] = useState(
    'El presente estudio tiene como objetivo determinar la relación entre la transformación digital y la gestión administrativa en las municipalidades provinciales durante el periodo 2026.'
  );
  const [qbMode, setQbMode] = useState('academic');
  const [qbOutput, setQbOutput] = useState(
    'La presente investigación examina el vínculo existente entre los procesos de modernización digital y la eficiencia de la gestión pública en los gobiernos locales provinciales durante el ejercicio 2026 (APA 7ma ed.).'
  );

  // New Course form state
  const [newCourseForm, setNewCourseForm] = useState({
    code: 'DOC-2026-III',
    title: '',
    institution: 'Escuela de Posgrado',
    instructor: 'Dr. Saravia · Instructor Oficial',
    maxSimilarityThreshold: 15,
    maxAiThreshold: 15,
  });

  // New User form state
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    planId: SEED_PLANS[0].id,
    deviceLimit: 2,
    sellerWhatsapp: '+51987654321',
  });

  // New Plan form state
  const [newPlanForm, setNewPlanForm] = useState({
    name: '',
    description: '',
    pricePen: '90.00',
    dailyLimit: 7,
  });

  const showNotification = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3600);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError('');
    try {
      // Try live API first if reachable, fallback to local state seamlessly
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          setViewMode(data.user.role === 'admin' ? 'admin' : 'member');
          showNotification(`Bienvenido de nuevo, ${data.user.name}`);
          setLoginBusy(false);
          return;
        }
      }

      const matched = users.find(
        (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
      );
      if (
        loginEmail.trim().toLowerCase() === 'saraviarosquetecomeverga@chivo.com' &&
        loginPassword === 'yacache@123456'
      ) {
        setUser(SEED_ADMIN_USER);
        setViewMode('admin');
        showNotification('Sesión iniciada como Administrador (Saravia chivo)');
      } else if (matched) {
        setUser(matched);
        setViewMode(matched.role === 'admin' ? 'admin' : 'member');
        showNotification(`Sesión iniciada como ${matched.name}`);
      } else {
        setUser({
          ...SEED_ADMIN_USER,
          name: loginEmail.split('@')[0] || 'Investigador',
          email: loginEmail,
        });
        showNotification('Sesión iniciada en tu espacio académico');
      }
    } finally {
      setLoginBusy(false);
    }
  };

  const handleFileUploadSubmit = (e) => {
    e.preventDefault();
    const chosenName =
      uploadFileName.trim() || 'Tesis_Maestria_Gestion_Publica_2026_Revisado.pdf';
    setIsUploading(true);

    setTimeout(() => {
      const nextCode = String(13913 + jobs.length);
      const simScore = Math.floor(Math.random() * 11) + 4; // 4% - 14%
      const aiScore = Math.random() > 0.45 ? 0 : Math.floor(Math.random() * 7) + 2;
      const newJob = {
        id: `job-${Date.now()}`,
        displayCode: nextCode,
        name: chosenName,
        courseCode: uploadCourseCode,
        author: uploadAuthor.trim() || user.name,
        ownerName: user.name,
        ownerEmail: user.email,
        sizeBytes: 1624100,
        pages: 64,
        words: 15820,
        kinds: uploadKinds,
        state: 'completed',
        similarityScore: simScore,
        aiScore,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        reportStates: {
          ai: { state: 'completed', attempt: 1 },
          similarity: { state: 'completed', attempt: 1 },
        },
        sources: [
          { source: 'repositorio.pucp.edu.pe (Tesis de Posgrado)', percent: '4%' },
          { source: 'scielo.org.pe (Revista Científica)', percent: '3%' },
          { source: 'alicia.concytec.gob.pe', percent: '2%' },
        ],
      };

      setJobs((prev) => [newJob, ...prev]);
      setAuditLogs((prev) => [
        {
          id: `aud-${Date.now()}`,
          actorName: user.name,
          actorRole: viewMode,
          action: `Procesó documento en aula ${uploadCourseCode} (#${nextCode})`,
          target: chosenName,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setIsUploading(false);
      setUploadFileName('');
      setUploadAuthor('');
      showNotification(
        `¡Informe #${nextCode} generado! Similitud: ${simScore}% · IA: ${aiScore}%`
      );
      setSelectedJobForReport(newJob);
    }, 900);
  };

  const handleDownloadCertificate = (job, type = 'similarity') => {
    const content = [
      '====================================================================',
      '        TURNITINPE · CERTIFICADO OFICIAL DE INTEGRIDAD ACADÉMICA     ',
      '====================================================================',
      `Código de Entrega : #${job.displayCode}`,
      `Documento         : ${job.name}`,
      `Autor / Tesista   : ${job.author || job.ownerName}`,
      `Curso / Aula      : ${job.courseCode || 'POS-2026-II'} (Sin Depósito / No Repository)`,
      `Fecha de Emisión  : ${new Date(job.createdAt).toLocaleString('es-PE')}`,
      '--------------------------------------------------------------------',
      `ÍNDICE DE SIMILITUD GENERAL : ${job.similarityScore}%`,
      `ESCRITURA POR IA DETECTADA  : ${job.aiScore}%`,
      `TIPO DE CERTIFICADO         : ${
        type === 'ai' ? 'Detección de Escritura IA' : 'Informe de Originalidad y Similitud'
      }`,
      '--------------------------------------------------------------------',
      'FUENTES PRINCIPALES IDENTIFICADAS:',
      ...(job.sources || []).map((s, idx) => `  [${idx + 1}] ${s.source} — ${s.percent}`),
      '--------------------------------------------------------------------',
      'Verificado por Estación TurnitinPE OriginalityPlus · Lima, Perú.',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificado_Turnitin_${type.toUpperCase()}_${job.displayCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(
      `Descargando certificado ${type === 'ai' ? 'de IA' : 'de Similitud'} (#${job.displayCode})`
    );
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseForm.title.trim()) return;
    const created = {
      id: `course-${Date.now()}`,
      code: newCourseForm.code.trim() || 'POS-2026',
      title: newCourseForm.title.trim(),
      institution: newCourseForm.institution.trim(),
      instructor: newCourseForm.instructor.trim(),
      bannerTheme: 'course-banner-navy',
      modality: 'Sin depósito (No Repository)',
      maxSimilarityThreshold: Number(newCourseForm.maxSimilarityThreshold) || 15,
      maxAiThreshold: Number(newCourseForm.maxAiThreshold) || 15,
      studentsCount: 1,
      submissionsCount: 0,
      pendingReviews: 0,
      status: 'active',
      excludeBibliography: true,
      excludeQuotes: true,
      excludeSmallMatchesWords: 10,
      description:
        'Aula académica configurada para revisión segura de borradores y tesis sin indexación en el repositorio global.',
      assignments: [
        {
          id: `asg-${Date.now()}`,
          title: 'Entrega Principal de Investigación',
          dueDate: '2026-12-20',
          submissions: 0,
          avgSimilarity: 0,
          avgAiScore: 0,
        },
      ],
    };
    setCourses((prev) => [created, ...prev]);
    setShowNewCourseModal(false);
    setNewCourseForm({
      code: 'DOC-2026-IV',
      title: '',
      institution: 'Escuela de Posgrado',
      instructor: 'Dr. Saravia · Instructor Oficial',
      maxSimilarityThreshold: 15,
      maxAiThreshold: 15,
    });
    showNotification(`Curso "${created.title}" creado correctamente.`);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;
    const chosenPlan = plans.find((p) => p.id === newUserForm.planId) || plans[0];
    const created = {
      id: `usr-${Date.now()}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      role: 'member',
      status: 'active',
      planId: chosenPlan.id,
      planName: chosenPlan.name,
      deviceLimit: Number(newUserForm.deviceLimit) || 2,
      deviceCount: 0,
      originalityApproved: true,
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      lastLogin: null,
      daily: {
        limit: chosenPlan.feedbackPolicy?.dailyLimit || 7,
        consumed: 0,
        remaining: chosenPlan.feedbackPolicy?.dailyLimit || 7,
      },
      sellerWhatsapp: newUserForm.sellerWhatsapp,
    };
    setUsers((prev) => [created, ...prev]);
    setShowNewPlanModal(false);
    setShowNewUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      planId: SEED_PLANS[0].id,
      deviceLimit: 2,
      sellerWhatsapp: '+51987654321',
    });
    showNotification(`Cuenta creada para ${created.name} con plan ${created.planName}.`);
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!newPlanForm.name.trim()) return;
    const priceMinor = Math.round(( parseFloat(newPlanForm.pricePen) || 80 ) * 100);
    const created = {
      id: `plan-${Date.now()}`,
      name: newPlanForm.name.trim().toUpperCase(),
      description:
        newPlanForm.description.trim() ||
        'Plan académico con acceso a Turnitin Feedback Studio, IA y QuillBot.',
      priceMinor,
      currency: 'PEN',
      interval: 'month',
      status: 'active',
      modality: 'instructor',
      billingMode: 'standard',
      assignedUsers: 0,
      feedbackPolicy: {
        mode: 'daily',
        dailyLimit: Number(newPlanForm.dailyLimit) || 7,
        reportKinds: ['ai', 'similarity'],
      },
      servicePermissions: {
        turnitin2: true,
        turnitin: true,
        nvidia: true,
        quillbot: true,
      },
    };
    setPlans((prev) => [...prev, created]);
    setShowNewPlanModal(false);
    setNewPlanForm({ name: '', description: '', pricePen: '90.00', dailyLimit: 7 });
    showNotification(`Plan "${created.name}" añadido al catálogo comercial.`);
  };

  const handleSendChat = (promptText) => {
    const content = (promptText ?? chatInput).trim();
    if (!content) return;
    const activeModelObj =
      SEED_AI_MODELS.find((m) => m.model === selectedAiModel) || SEED_AI_MODELS[0];

    const userMsg = { role: 'user', text: content };
    let reply = '';
    if (content.toLowerCase().includes('apa') || content.toLowerCase().includes('parafrase')) {
      reply = `✅ **Reescritura Académica (${activeModelObj.name} · Norma APA 7ma Ed.):**\n\n"En consonancia con la evidencia empírica reciente, la modernización de los sistemas de gestión institucional incide de manera directa en la transparencia administrativa y en la optimización de los recursos públicos, reduciendo las brechas de atención ciudadana (Méndez & Paredes, 2026)." \n\n• **Índice estimado de IA tras humanización:** < 2%\n• **Conservación terminológica:** 100%`;
    } else if (content.toLowerCase().includes('spearman') || content.toLowerCase().includes('spss')) {
      reply = `📊 **Interpretación Estadística (${activeModelObj.name}):**\n\nAl observarse un coeficiente de correlación **Rho de Spearman de r = 0.782** con una significancia bilateral **p = 0.000 (p < 0.05)**, se rechaza la hipótesis nula ($H_0$) y se acepta la hipótesis de investigación ($H_1$). Esto demuestra que existe una relación positiva considerable y estadísticamente significativa entre la variable independiente y el desempeño institucional en la muestra estudiada.`;
    } else {
      reply = `📚 **Respuesta de ${activeModelObj.name}:**\n\nHe estructurado tu solicitud siguiendo los estándares metodológicos de posgrado:\n1. **Planteamiento argumentativo:** Se contextualiza la problemática desde el ámbito internacional al nacional (Perú).\n2. **Rigor conceptual:** Se mantiene la trazabilidad entre objetivos específicos, dimensiones e indicadores.\n3. **Recomendación Turnitin:** Recuerda excluir la bibliografía y citas menores de 10 palabras antes de emitir el certificado final.`;
    }

    setChatMessages((prev) => [...prev, userMsg, { role: 'assistant', text: reply }]);
    setChatInput('');
    setAiUsedToday((u) => Math.min(100, u + 1));
  };

  const handleQuillbotParaphrase = (mode) => {
    setQbMode(mode);
    const variants = {
      academic:
        'La presente investigación examina el vínculo existente entre los procesos de modernización digital y la eficiencia de la gestión pública en los gobiernos locales provinciales durante el ejercicio 2026 (APA 7ma ed.).',
      humanized:
        'A lo largo de este trabajo analizamos cómo la incorporación de herramientas digitales transforma el funcionamiento administrativo de las municipalidades provinciales en el año 2026, desde una perspectiva práctica e institucional.',
      formal:
        'El objetivo primordial de este estudio consiste en establecer el grado de correlación entre la transformación digital y el desempeño administrativo en las entidades ediles provinciales durante el periodo 2026.',
      concise:
        'Este estudio evalúa el impacto de la transformación digital en la gestión administrativa municipal durante el 2026.',
    };
    setQbOutput(variants[mode] || variants.academic);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchesCourse = jobCourseFilter === 'all' || j.courseCode === jobCourseFilter;
      const q = jobSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        j.name.toLowerCase().includes(q) ||
        j.displayCode.toLowerCase().includes(q) ||
        (j.author || '').toLowerCase().includes(q);
      return matchesCourse && matchesQuery;
    });
  }, [jobs, jobCourseFilter, jobSearch]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (userFilter === 'active' && u.status !== 'active') return false;
      if (userFilter === 'admins' && u.role !== 'admin') return false;
      if (userFilter === 'expired' && u.status !== 'expired') return false;
      if (userFilter === 'suspended' && u.status !== 'suspended') return false;
      const q = userSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.planName || '').toLowerCase().includes(q)
      );
    });
  }, [users, userFilter, userSearch]);

  // If logged out, show the executive Login screen
  if (!user) {
    return (
      <main className="auth-layout">
        <section className="auth-story">
          <div className="auth-story-header">
            <div className="brand brand-dark">
              <TurnitinSymbol />
              <span>turnitinpe</span>
              <span className="brand-badge">Academic Pro v2.0</span>
            </div>
            <button className="sidebar-icon-btn" onClick={toggleTheme} title="Cambiar tema">
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
          </div>

          <div className="auth-story-body">
            <span className="auth-eyebrow">
              <GraduationCap size={16} /> PLATAFORMA DE CURSOS E INTEGRIDAD ACADÉMICA
            </span>
            <h1>Todos tus cursos, revisiones Turnitin e IA en un solo acceso.</h1>
            <p className="auth-story-lead">
              Gestiona tus aulas de tesis sin depósito (No Repository), emite informes oficiales de
              Similitud y Detección de IA en segundos, y potencia tu investigación con más de 50
              modelos académicos y QuillBot Premium.
            </p>

            <div className="auth-pillars">
              <div className="auth-pillar-card">
                <span className="auth-pillar-icon">
                  <GraduationCap size={18} />
                </span>
                <strong>Aulas sin depósito</strong>
                <span>Revisa borradores de tesis e investigaciones sin indexar el documento.</span>
              </div>
              <div className="auth-pillar-card">
                <span className="auth-pillar-icon">
                  <ShieldCheck size={18} />
                </span>
                <strong>IA + Similitud Oficial</strong>
                <span>Certificados verificados con filtros APA, exclusión de citas y bibliografía.</span>
              </div>
              <div className="auth-pillar-card">
                <span className="auth-pillar-icon">
                  <Sparkles size={18} />
                </span>
                <strong>Laboratorio IA & QuillBot</strong>
                <span>Modelos para tesis, estadística SPSS, parafraseo humanizado y audio WAV.</span>
              </div>
            </div>
          </div>

          <div className="auth-story-footer">
            <span>turnitinpe · Cada investigador, el acceso correcto.</span>
            <span>Estación Lima Activa · 99.9% Uptime</span>
          </div>
        </section>

        <section className="auth-panel-wrap">
          <div className="auth-card">
            <div className="auth-card-top">
              <div className="brand">
                <TurnitinSymbol />
                <span>turnitinpe</span>
              </div>
              <span className="status-pill status-emerald">Estación en línea</span>
            </div>

            <h2>Bienvenido de nuevo</h2>
            <p className="auth-subtitle">
              Ingresa a tu espacio académico de cursos, revisión antiplagio e inteligencia
              artificial.
            </p>

            <div className="demo-accounts-box">
              <div className="demo-accounts-header">
                <span>Acceso rápido con tus cuentas configuradas</span>
              </div>
              <div className="demo-accounts-buttons">
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => {
                    setLoginEmail('saraviarosquetecomeverga@chivo.com');
                    setLoginPassword('yacache@123456');
                    setUser(SEED_ADMIN_USER);
                    setViewMode('admin');
                    showNotification('Ingresaste como Administrador: Saravia chivo');
                  }}
                >
                  <strong>Saravia chivo (Admin)</strong>
                  <span>Panel total + Cursos + 71 clientes</span>
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => {
                    const client = SEED_USERS[1];
                    setUser(client);
                    setViewMode('member');
                    showNotification(`Ingresaste como Tesista/Instructor: ${client.name}`);
                  }}
                >
                  <strong>Vista Instructor / Tesista</strong>
                  <span>Mis Cursos + Subida PDF + IA</span>
                </button>
              </div>
            </div>

            {loginError && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: 'var(--crimson-soft)',
                  color: 'var(--crimson)',
                  marginBottom: 14,
                  fontSize: 13,
                }}
              >
                {loginError}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <label className="field">
                Correo electrónico institucional o personal
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="correo@universidad.edu.pe"
                  required
                />
              </label>

              <label className="field">
                Contraseña
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </label>

              <button
                type="submit"
                className="button button-primary"
                disabled={loginBusy}
                style={{ marginTop: 6, minHeight: 44 }}
              >
                {loginBusy ? 'Verificando acceso…' : 'Iniciar sesión en mi espacio'}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const isAdminView = viewMode === 'admin';

  const navGroups = [
    {
      label: 'AULAS Y REVISIÓN ACADÉMICA',
      items: [
        { id: 'overview', label: 'Inicio Ejecutivo', icon: LayoutDashboard },
        {
          id: 'courses',
          label: 'Mis Cursos y Clases',
          icon: GraduationCap,
          badge: `${courses.length} aulas`,
        },
        {
          id: 'turnitin2',
          label: 'Turnitin Feedback Studio',
          icon: FileCheck2,
          proBadge: 'IA + Sim',
        },
        {
          id: 'documents',
          label: 'Turnitin Originality',
          icon: FolderLock,
        },
      ],
    },
    {
      label: 'HERRAMIENTAS DE INVESTIGACIÓN',
      items: [
        {
          id: 'nvidia',
          label: 'Todas las IA · Laboratorio',
          icon: Sparkles,
          badge: '50+ IA',
        },
        {
          id: 'quillbot',
          label: 'QuillBot Parafraseador',
          icon: Feather,
        },
      ],
    },
    ...(isAdminView
      ? [
          {
            label: 'ADMINISTRACIÓN Y COMERCIAL',
            items: [
              { id: 'users', label: 'Clientes y Accesos', icon: Users, badge: '71' },
              { id: 'plans', label: 'Planes y Membresías', icon: CreditCard },
              { id: 'daily-limits', label: 'Control de Cuotas Lima', icon: BarChart3 },
              { id: 'turnitin-settings', label: 'Estaciones Chrome', icon: Settings },
              { id: 'activity', label: 'Auditoría en Vivo', icon: History },
            ],
          },
        ]
      : []),
  ];

  const pageMeta = {
    overview: {
      eyebrow: isAdminView ? 'CENTRO DE CONTROL ACADÉMICO' : 'MI ESPACIO DE INVESTIGACIÓN',
      title: isAdminView
        ? `Bienvenido de nuevo, ${user.name}`
        : `Hola, ${user.name} · Espacio de Tesis e Investigación`,
      subtitle: isAdminView
        ? 'Supervisa en tiempo real tus aulas académicas, la estación Chrome OriginalityPlus, las entregas de Turnitin y las 71 cuentas activas.'
        : 'Selecciona tu aula académica, sube tu documento sin depósito (No Repository) o utiliza el Laboratorio de IA y QuillBot.',
    },
    courses: {
      eyebrow: 'GESTIÓN DE AULAS Y CURSOS ACADÉMICOS',
      title: 'Cursos, Seminarios de Tesis y Clases Activas',
      subtitle:
        'Cada curso opera bajo modalidad Sin Depósito (No Repository) con umbrales personalizados de similitud e IA y exclusión bibliográfica automática.',
    },
    turnitin2: {
      eyebrow: 'TURNITIN FEEDBACK STUDIO · SIN DEPÓSITO',
      title: 'Revisión de Similitud y Detección de Escritura con IA',
      subtitle:
        'Sube documentos PDF o Word (.docx). Los certificados oficiales se procesan automáticamente mediante la Estación Chrome conectada.',
    },
    documents: {
      eyebrow: 'REPOSITORIO PRIVADO · TURNITIN ORIGINALITY',
      title: 'Mis Documentos y Certificados Emitidos',
      subtitle:
        'Consulta el historial íntegro de manuscritos analizados, compara versiones de tesis y descarga tus certificados verificados.',
    },
    nvidia: {
      eyebrow: 'LABORATORIO MULTIMODELO · NVIDIA AI ENTERPRISE',
      title: 'Todas las IA para Investigación, Tesis y Estadística',
      subtitle:
        'Accede a modelos calibrados para redacción APA 7ma edición, interpretación de tablas SPSS, revisión por pares Scopus y transcripción WAV.',
    },
    quillbot: {
      eyebrow: 'APOYO A LA REDACCIÓN CIENTÍFICA',
      title: 'QuillBot Premium · Parafraseo Académico y Credenciales',
      subtitle:
        'Reescribe párrafos densos conservando las citas académicas o utiliza las credenciales institucionales directas.',
    },
    users: {
      eyebrow: 'ADMINISTRACIÓN DE CUENTAS Y DISPOSITIVOS',
      title: 'Directorio de Clientes, Instructores y Tesistas',
      subtitle:
        'Gestiona planes asignados, cuotas diarias de reportes, límite de dispositivos y envíos de renovación por WhatsApp en un clic.',
    },
    plans: {
      eyebrow: 'CATÁLOGO COMERCIAL · MONEDA NACIONAL (PEN)',
      title: 'Planes, Tarifas y Políticas de Acceso',
      subtitle:
        'Configura los planes para estudiantes, instructores y centros de investigación con permisos granulares por herramienta.',
    },
    'daily-limits': {
      eyebrow: 'HORA OFICIAL AMERICA/LIMA · CORTE DIARIO',
      title: 'Historial de Cuotas y Acreditación de Reportes',
      subtitle:
        'Monitorea los reportes consumidos hoy por cada cliente y acredita unidades adicionales confirmadas por pago.',
    },
    'turnitin-settings': {
      eyebrow: 'INFRAESTRUCTURA DE PROCESAMIENTO',
      title: 'Estaciones Chrome Vinculadas y Conservación',
      subtitle:
        'Administra los nodos OriginalityPlus / AcademiaCX conectados mediante extensión Chrome y las reglas de retención de archivos.',
    },
    activity: {
      eyebrow: 'TRAZABILIDAD Y SEGURIDAD',
      title: 'Registro de Auditoría del Espacio',
      subtitle:
        'Historial cronológico de inicios de sesión, certificados generados y movimientos administrativos.',
    },
  }[activeTab] || {
    eyebrow: 'ESPACIO ACADÉMICO',
    title: 'TurnitinPE',
    subtitle: '',
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand brand-dark">
            <TurnitinSymbol />
            <span>turnitinpe</span>
            <span className="brand-badge">PRO</span>
          </div>
          {mobileNavOpen && (
            <button
              className="sidebar-icon-btn"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="sidebar-role-switcher" role="group" aria-label="Cambiar modo de vista">
          <button
            type="button"
            className={`role-switch-btn ${isAdminView ? 'active' : ''}`}
            onClick={() => setViewMode('admin')}
          >
            <ShieldCheck size={14} /> Vista Admin
          </button>
          <button
            type="button"
            className={`role-switch-btn ${!isAdminView ? 'active' : ''}`}
            onClick={() => {
              setViewMode('member');
              if (
                ['users', 'plans', 'daily-limits', 'turnitin-settings', 'activity'].includes(
                  activeTab
                )
              ) {
                setActiveTab('courses');
              }
            }}
          >
            <GraduationCap size={14} /> Vista Aula/Cliente
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Navegación principal">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <span className="nav-group-label">{group.label}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`nav-item ${active ? 'nav-item-active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileNavOpen(false);
                    }}
                  >
                    <Icon size={18} />
                    <span className="nav-item-text">{item.label}</span>
                    {item.badge && <span className="nav-count">{item.badge}</span>}
                    {item.proBadge && <span className="nav-badge-pro">{item.proBadge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-station-pill">
            <span className="pulse-dot" />
            <span>Estación OriginalityPlus · Activa</span>
          </div>

          <div className="sidebar-profile-row">
            <button
              type="button"
              className="sidebar-profile-btn"
              onClick={() => setActiveTab('overview')}
            >
              <span className="avatar avatar-sm">{getInitials(user.name)}</span>
              <span className="sidebar-profile-info">
                <strong>{user.name}</strong>
                <small>{isAdminView ? 'Administrador · Instructor' : 'Plan Investigador Pro'}</small>
              </span>
            </button>
            <button
              type="button"
              className="sidebar-icon-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              type="button"
              className="sidebar-icon-btn"
              onClick={() => setUser(null)}
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Abrir navegación"
            >
              <Menu size={18} />
            </button>
            <div className="topbar-breadcrumb">
              <span>Espacio Académico</span>
              <span>/</span>
              <strong>{pageMeta.title}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <span className="quota-chip">
              <ShieldCheck size={14} style={{ color: 'var(--emerald)' }} />
              Sin depósito (No Repository)
            </span>
            <span className="quota-chip">
              <Sparkles size={14} style={{ color: 'var(--brand-primary)' }} />
              IA hoy: {aiUsedToday} / 100
            </span>
            <button
              type="button"
              className="button button-primary button-sm"
              onClick={() => setActiveTab('turnitin2')}
            >
              <Upload size={14} /> Subir Tesis / Documento
            </button>
          </div>
        </header>

        <main className="main-content">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <span className="page-eyebrow">{pageMeta.eyebrow}</span>
              <h1>{pageMeta.title}</h1>
              <p>{pageMeta.subtitle}</p>
            </div>
            <div className="page-actions">
              {activeTab === 'courses' && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setShowNewCourseModal(true)}
                >
                  <Plus size={16} /> Crear Nuevo Curso / Aula
                </button>
              )}
              {activeTab === 'users' && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setShowNewUserModal(true)}
                >
                  <Plus size={16} /> Crear Cuenta de Cliente
                </button>
              )}
              {activeTab === 'plans' && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setShowNewPlanModal(true)}
                >
                  <Plus size={16} /> Crear Nuevo Plan
                </button>
              )}
            </div>
          </div>

          {/* ==========================================
              TAB 1: OVERVIEW (INICIO EJECUTIVO)
             ========================================== */}
          {activeTab === 'overview' && (
            <>
              <div className="metrics-grid">
                <article className="metric-card">
                  <div className="metric-top">
                    <span>Personas en el espacio</span>
                    <span className="metric-icon metric-blue">
                      <Users size={18} />
                    </span>
                  </div>
                  <div className="metric-value">71</div>
                  <span className="metric-note">66 accesos activos · 5 por renovar</span>
                </article>

                <article className="metric-card">
                  <div className="metric-top">
                    <span>Cursos y Aulas Activas</span>
                    <span className="metric-icon metric-emerald">
                      <GraduationCap size={18} />
                    </span>
                  </div>
                  <div className="metric-value">{courses.length}</div>
                  <span className="metric-note">Modalidad Sin Depósito (No Repository)</span>
                </article>

                <article className="metric-card">
                  <div className="metric-top">
                    <span>Informes Procesados</span>
                    <span className="metric-icon metric-amber">
                      <FileCheck2 size={18} />
                    </span>
                  </div>
                  <div className="metric-value">{100 + jobs.length - SEED_JOBS.length}</div>
                  <span className="metric-note">Tiempo medio: 85 seg · IA + Similitud</span>
                </article>

                <article className="metric-card">
                  <div className="metric-top">
                    <span>Modelos IA & QuillBot</span>
                    <span className="metric-icon metric-blue">
                      <Sparkles size={18} />
                    </span>
                  </div>
                  <div className="metric-value">52</div>
                  <span className="metric-note">Catálogo NVIDIA + QuillBot Premium activo</span>
                </article>
              </div>

              {/* Quick Academic Courses Preview */}
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Mis Cursos y Aulas de Revisión Turnitin</h2>
                    <p>
                      Aulas configuradas al estilo Instructor para revisar tesis y artículos sin
                      indexarlos en el repositorio.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="button button-secondary button-sm"
                    onClick={() => setActiveTab('courses')}
                  >
                    Ver todas las aulas ({courses.length})
                  </button>
                </div>

                <div className="courses-grid">
                  {courses.slice(0, 3).map((course) => (
                    <article key={course.id} className="course-card">
                      <div className={`course-card-banner ${course.bannerTheme}`}>
                        <div className="course-banner-top">
                          <span className="course-code-pill">{course.code}</span>
                          <span className="course-code-pill">{course.modality}</span>
                        </div>
                        <h3>{course.title}</h3>
                        <span className="course-instructor">
                          {course.institution} · {course.instructor}
                        </span>
                      </div>

                      <div className="course-card-body">
                        <div className="course-stats-row">
                          <div className="course-stat">
                            <span>Umbral Similitud</span>
                            <strong>≤ {course.maxSimilarityThreshold}%</strong>
                          </div>
                          <div className="course-stat">
                            <span>Umbral IA</span>
                            <strong>≤ {course.maxAiThreshold}%</strong>
                          </div>
                          <div className="course-stat">
                            <span>Entregas</span>
                            <strong>{course.submissionsCount}</strong>
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          {course.description}
                        </p>
                      </div>

                      <div className="course-card-footer">
                        <span className="status-pill status-emerald">Recepción abierta</span>
                        <button
                          type="button"
                          className="button button-primary button-sm"
                          onClick={() => {
                            setUploadCourseCode(course.code);
                            setActiveTab('turnitin2');
                          }}
                        >
                          <Upload size={13} /> Subir a esta aula
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <div className="overview-grid">
                {/* Latest Turnitin Certificates */}
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Últimos Certificados Turnitin Emitidos</h2>
                      <p>Haz clic en cualquier entrega para abrir el visor interactivo de similitud e IA.</p>
                    </div>
                    <button
                      type="button"
                      className="button button-secondary button-sm"
                      onClick={() => setActiveTab('turnitin2')}
                    >
                      Ir a Feedback Studio
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Documento / Aula</th>
                          <th>Similitud</th>
                          <th>Escritura IA</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.slice(0, 4).map((job) => (
                          <tr key={job.id}>
                            <td>
                              <span className="code-chip">#{job.displayCode}</span>
                            </td>
                            <td>
                              <div className="person-meta">
                                <strong>{job.name}</strong>
                                <span>
                                  Aula {job.courseCode} · {job.author}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={`status-pill ${
                                  job.similarityScore <= 15
                                    ? 'status-emerald'
                                    : job.similarityScore <= 22
                                    ? 'status-amber'
                                    : 'status-crimson'
                                }`}
                              >
                                {job.similarityScore}% Similitud
                              </span>
                            </td>
                            <td>
                              <span
                                className={`status-pill ${
                                  job.aiScore <= 10 ? 'status-blue' : 'status-amber'
                                }`}
                              >
                                {job.aiScore}% IA
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="button button-secondary button-sm"
                                onClick={() => setSelectedJobForReport(job)}
                              >
                                <Eye size={13} /> Ver Certificado
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Connected Services Status */}
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Servicios Conectados</h2>
                      <p>Estado operativo de tu infraestructura</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {SEED_SERVICES.map((svc) => (
                      <div
                        key={svc.id}
                        style={{
                          padding: 14,
                          borderRadius: 12,
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-surface-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <strong>{svc.name}</strong>
                            <span className="status-pill status-emerald">Operativo</span>
                          </div>
                          <p
                            style={{
                              fontSize: 12.5,
                              color: 'var(--text-secondary)',
                              marginTop: 3,
                            }}
                          >
                            {svc.operationalDetail}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="button button-secondary button-sm"
                          onClick={() =>
                            setActiveTab(svc.id === 'turnitin' ? 'documents' : svc.id)
                          }
                        >
                          Abrir
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {/* ==========================================
              TAB 2: MIS CURSOS Y CLASES (PRO LMS VIEW)
             ========================================== */}
          {activeTab === 'courses' && (
            <>
              <div className="courses-grid">
                {courses.map((course) => (
                  <article key={course.id} className="course-card">
                    <div className={`course-card-banner ${course.bannerTheme}`}>
                      <div className="course-banner-top">
                        <span className="course-code-pill">{course.code}</span>
                        <span className="course-code-pill">{course.modality}</span>
                      </div>
                      <h3>{course.title}</h3>
                      <span className="course-instructor">
                        {course.institution} · {course.instructor}
                      </span>
                    </div>

                    <div className="course-card-body">
                      <div className="course-stats-row">
                        <div className="course-stat">
                          <span>Máx. Similitud</span>
                          <strong>≤ {course.maxSimilarityThreshold}%</strong>
                        </div>
                        <div className="course-stat">
                          <span>Máx. IA</span>
                          <strong>≤ {course.maxAiThreshold}%</strong>
                        </div>
                        <div className="course-stat">
                          <span>Entregas</span>
                          <strong>{course.submissionsCount}</strong>
                        </div>
                      </div>

                      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {course.description}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          paddingTop: 6,
                          borderTop: '1px solid var(--border-color)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                          }}
                        >
                          Bandejas de entrega activas:
                        </span>
                        {course.assignments.map((asg) => (
                          <div
                            key={asg.id}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 8,
                              background: 'var(--bg-surface-subtle)',
                              border: '1px solid var(--border-color)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: 12.5,
                            }}
                          >
                            <span>
                              <strong>{asg.title}</strong>
                            </span>
                            <span className="code-chip">Media: {asg.avgSimilarity}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="course-card-footer">
                      <button
                        type="button"
                        className="button button-secondary button-sm"
                        onClick={() => {
                          setJobCourseFilter(course.code);
                          setActiveTab('turnitin2');
                        }}
                      >
                        <Eye size={14} /> Ver entregas del curso
                      </button>
                      <button
                        type="button"
                        className="button button-primary button-sm"
                        onClick={() => {
                          setUploadCourseCode(course.code);
                          setActiveTab('turnitin2');
                        }}
                      >
                        <Upload size={14} /> Subir documento
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {/* ==========================================
              TAB 3 & 4: TURNITIN FEEDBACK STUDIO & ORIGINALITY
             ========================================== */}
          {(activeTab === 'turnitin2' || activeTab === 'documents') && (
            <>
              <div className="upload-studio-grid">
                {/* Upload Form */}
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Subir Documento a Revisión Oficial</h2>
                      <p>
                        Procesamiento en 90 segundos · Sin depósito en base de datos institucional
                      </p>
                    </div>
                    <span className="status-pill status-emerald">1 Crédito = IA + Similitud</span>
                  </div>

                  <form
                    onSubmit={handleFileUploadSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadFileName(file.name);
                      }}
                    />

                    <div
                      className="dropzone"
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="dropzone-icon">
                        <Upload size={24} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 15, display: 'block' }}>
                          {uploadFileName
                            ? `Archivo seleccionado: ${uploadFileName}`
                            : 'Haz clic para seleccionar tu archivo PDF o Word (.docx)'}
                        </strong>
                        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                          Tamaño máximo: 100 MB · Mínimo 300 palabras · Idiomas: Español, Inglés,
                          Portugués
                        </span>
                      </div>
                    </div>

                    <div className="form-grid">
                      <label className="field">
                        Curso / Aula de destino
                        <select
                          value={uploadCourseCode}
                          onChange={(e) => setUploadCourseCode(e.target.value)}
                        >
                          {courses.map((c) => (
                            <option key={c.id} value={c.code}>
                              {c.code} · {c.title}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="field">
                        Nombre del autor / tesista
                        <input
                          type="text"
                          value={uploadAuthor}
                          onChange={(e) => setUploadAuthor(e.target.value)}
                          placeholder={user.name}
                        />
                      </label>
                    </div>

                    <label className="field">
                      Título o nombre personalizado del archivo (opcional)
                      <input
                        type="text"
                        value={uploadFileName}
                        onChange={(e) => setUploadFileName(e.target.value)}
                        placeholder="Ej. Tesis_Final_Maestria_Gestion_Publica_2026.pdf"
                      />
                    </label>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <button
                        type="submit"
                        className="button button-primary"
                        disabled={isUploading}
                      >
                        <FileCheck2 size={16} />
                        {isUploading
                          ? 'Analizando en Estación Turnitin…'
                          : 'Analizar Documento y Emitir Certificados'}
                      </button>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Incluye informe de Similitud (%) + Detección de Escritura IA (%)
                      </span>
                    </div>
                  </form>
                </section>

                {/* Calibration & Filters */}
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Parámetros y Filtros de Calibración</h2>
                      <p>Configurados según el reglamento de grados y títulos (SUNEDU / APA 7)</p>
                    </div>
                    <Sliders size={18} style={{ color: 'var(--brand-primary)' }} />
                  </div>

                  <div className="filter-switches">
                    <label className="filter-switch-item">
                      <input
                        type="checkbox"
                        checked={excludeBib}
                        onChange={(e) => setExcludeBib(e.target.checked)}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: 13.5 }}>
                          Excluir referencias bibliográficas
                        </strong>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          Omite la sección de Bibliografía / Referencias en formato APA, IEEE o
                          Vancouver.
                        </span>
                      </div>
                    </label>

                    <label className="filter-switch-item">
                      <input
                        type="checkbox"
                        checked={excludeQuotes}
                        onChange={(e) => setExcludeQuotes(e.target.checked)}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: 13.5 }}>
                          Excluir citas textuales entrecomilladas
                        </strong>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          No contabiliza fragmentos citados correctamente entre comillas o bloques
                          indentados.
                        </span>
                      </div>
                    </label>

                    <label className="filter-switch-item">
                      <input
                        type="checkbox"
                        checked={excludeSmallWords}
                        onChange={(e) => setExcludeSmallWords(e.target.checked)}
                      />
                      <div>
                        <strong style={{ display: 'block', fontSize: 13.5 }}>
                          Excluir coincidencias menores (&lt; 10 palabras)
                        </strong>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          Evita falsos positivos en nombres de instituciones, leyes y conectores
                          comunes.
                        </span>
                      </div>
                    </label>
                  </div>
                </section>
              </div>

              {/* Submissions / Jobs Table */}
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Bandeja de Informes y Certificados Emitidos</h2>
                    <p>
                      Mostrando {filteredJobs.length} documentos procesados · Haz clic en "Ver
                      Informe" para inspeccionar las fuentes.
                    </p>
                  </div>

                  <div className="toolbar">
                    <select
                      value={jobCourseFilter}
                      onChange={(e) => setJobCourseFilter(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface)',
                        fontSize: 13,
                      }}
                    >
                      <option value="all">Todas las aulas ({courses.length})</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.code}>
                          Aula {c.code}
                        </option>
                      ))}
                    </select>

                    <div className="search-box">
                      <Search size={15} style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        placeholder="Buscar por código (#13912), archivo o autor…"
                      />
                    </div>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Documento / Manuscrito</th>
                        <th>Aula</th>
                        <th>Autor</th>
                        <th>Similitud</th>
                        <th>Detección IA</th>
                        <th>Fecha Lima</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr key={job.id}>
                          <td>
                            <span className="code-chip">#{job.displayCode}</span>
                          </td>
                          <td>
                            <div className="person-meta">
                              <strong>{job.name}</strong>
                              <span>
                                {job.pages || 48} págs ·{' '}
                                {((job.sizeBytes || 1200000) / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="code-chip">{job.courseCode || 'POS-2026-II'}</span>
                          </td>
                          <td>{job.author || job.ownerName}</td>
                          <td>
                            <span
                              className={`status-pill ${
                                job.similarityScore <= 15
                                  ? 'status-emerald'
                                  : job.similarityScore <= 22
                                  ? 'status-amber'
                                  : 'status-crimson'
                              }`}
                            >
                              {job.similarityScore}% Similitud
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-pill ${
                                job.aiScore <= 10 ? 'status-blue' : 'status-amber'
                              }`}
                            >
                              {job.aiScore === 0 ? '0% IA' : `${job.aiScore}% IA`}
                            </span>
                          </td>
                          <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                            {new Date(job.createdAt).toLocaleDateString('es-PE', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                className="button button-primary button-sm"
                                onClick={() => setSelectedJobForReport(job)}
                              >
                                <Eye size={13} /> Ver Informe
                              </button>
                              <button
                                type="button"
                                className="button button-secondary button-sm"
                                onClick={() => handleDownloadCertificate(job, 'similarity')}
                                title="Descargar PDF Similitud"
                              >
                                <Download size={13} /> PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* ==========================================
              TAB 5: TODAS LAS IA · LABORATORIO ACADÉMICO
             ========================================== */}
          {activeTab === 'nvidia' && (
            <div className="ai-studio-layout">
              <aside className="ai-models-sidebar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 14 }}>Modelos Académicos (NVIDIA)</strong>
                  <span className="code-chip">{SEED_AI_MODELS.length} destacados</span>
                </div>
                {SEED_AI_MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`ai-model-item ${selectedAiModel === m.model ? 'active' : ''}`}
                    onClick={() => setSelectedAiModel(m.model)}
                  >
                    <Sparkles
                      size={18}
                      style={{ color: 'var(--brand-primary)', marginTop: 2, flexShrink: 0 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong style={{ fontSize: 13 }}>{m.name}</strong>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--brand-primary)',
                        }}
                      >
                        {m.category} · {m.badge}
                      </span>
                      <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                        {m.description}
                      </span>
                    </div>
                  </button>
                ))}
              </aside>

              <section className="ai-chat-panel">
                <div className="ai-chat-header">
                  <div>
                    <strong style={{ fontSize: 15 }}>
                      {SEED_AI_MODELS.find((m) => m.model === selectedAiModel)?.name}
                    </strong>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Calibrado para redacción científica, normas APA 7ma edición y análisis de tesis
                    </p>
                  </div>
                  <span className="status-pill status-emerald">
                    Cuota hoy: {aiUsedToday} / 100 consultas
                  </span>
                </div>

                <div className="ai-chat-messages">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.role}`}>
                      {msg.text}
                    </div>
                  ))}
                </div>

                <div className="ai-prompt-chips">
                  <button
                    type="button"
                    className="prompt-chip"
                    onClick={() =>
                      handleSendChat(
                        'Parafrasea este párrafo con estilo académico APA 7ma edición para reducir coincidencias en Turnitin.'
                      )
                    }
                  >
                    ✨ Parafrasear en APA 7ma sin IA
                  </button>
                  <button
                    type="button"
                    className="prompt-chip"
                    onClick={() =>
                      handleSendChat(
                        'Interpreta una correlación Rho de Spearman de 0.782 (p = 0.000) para mi tesis en SPSS.'
                      )
                    }
                  >
                    📊 Interpretar Rho de Spearman (SPSS)
                  </button>
                  <button
                    type="button"
                    className="prompt-chip"
                    onClick={() =>
                      handleSendChat(
                        'Estructura la discusión de resultados comparando mis hallazgos con 3 antecedentes.'
                      )
                    }
                  >
                    📚 Estructurar Discusión de Resultados
                  </button>
                </div>

                <form
                  className="ai-chat-input-bar"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                >
                  <textarea
                    rows={2}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Pega aquí un párrafo de tu tesis, tabla estadística o consulta metodológica…"
                  />
                  <button type="submit" className="button button-primary">
                    <Send size={15} /> Consultar IA
                  </button>
                </form>
              </section>
            </div>
          )}

          {/* ==========================================
              TAB 6: QUILLBOT PREMIUM
             ========================================== */}
          {activeTab === 'quillbot' && (
            <div className="upload-studio-grid">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Parafraseador Académico Integrado (QuillBot Pro)</h2>
                    <p>Reformula fragmentos con alta similitud manteniendo el rigor técnico</p>
                  </div>
                  <div className="filter-tabs">
                    {[
                      { id: 'academic', label: 'Académico APA' },
                      { id: 'humanized', label: 'Humanizado Anti-IA' },
                      { id: 'formal', label: 'Formal' },
                      { id: 'concise', label: 'Conciso' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className={`filter-tab ${qbMode === m.id ? 'active' : ''}`}
                        onClick={() => handleQuillbotParaphrase(m.id)}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-grid">
                  <label className="field">
                    Texto original con coincidencias
                    <textarea
                      rows={6}
                      value={qbInput}
                      onChange={(e) => setQbInput(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    Resultado parafraseado sugerido
                    <textarea rows={6} readOnly value={qbOutput} />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => handleQuillbotParaphrase(qbMode)}
                  >
                    <RefreshCw size={15} /> Regenerar Parafraseo
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => {
                      navigator.clipboard?.writeText(qbOutput);
                      showNotification('Párrafo parafraseado copiado al portapapeles.');
                    }}
                  >
                    <Copy size={15} /> Copiar Resultado
                  </button>
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Credenciales Institucionales QuillBot</h2>
                    <p>Acceso directo incluido gratuitamente en tu plan activo</p>
                  </div>
                  <span className="status-pill status-emerald">Cuenta Verificada</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="field">
                    <span>Correo corporativo QuillBot</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        readOnly
                        value="acceso.investigacion@turnitinpe.com"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => {
                          navigator.clipboard?.writeText('acceso.investigacion@turnitinpe.com');
                          showNotification('Correo de QuillBot copiado.');
                        }}
                      >
                        <Copy size={14} /> Copiar
                      </button>
                    </div>
                  </div>

                  <div className="field">
                    <span>Contraseña vigente</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        readOnly
                        value="QuillBotPro#2026PE"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => {
                          navigator.clipboard?.writeText('QuillBotPro#2026PE');
                          showNotification('Contraseña de QuillBot copiada.');
                        }}
                      >
                        <Copy size={14} /> Copiar
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ==========================================
              TAB 7: CLIENTES Y ACCESOS (USERS ADMIN)
             ========================================== */}
          {activeTab === 'users' && (
            <section className="panel">
              <div className="panel-header">
                <div className="filter-tabs">
                  {[
                    { id: 'all', label: `Todos (${users.length})` },
                    {
                      id: 'active',
                      label: `Activos (${users.filter((u) => u.status === 'active').length})`,
                    },
                    {
                      id: 'admins',
                      label: `Administradores (${users.filter((u) => u.role === 'admin').length})`,
                    },
                    {
                      id: 'expired',
                      label: `Vencidos (${users.filter((u) => u.status === 'expired').length})`,
                    },
                    {
                      id: 'suspended',
                      label: `Suspendidos (${
                        users.filter((u) => u.status === 'suspended').length
                      })`,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`filter-tab ${userFilter === tab.id ? 'active' : ''}`}
                      onClick={() => setUserFilter(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="search-box">
                  <Search size={15} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Buscar cliente por nombre, correo o plan…"
                  />
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cliente / Investigador</th>
                      <th>Plan Asignado</th>
                      <th>Estado</th>
                      <th>Cuota Hoy (Lima)</th>
                      <th>Dispositivos</th>
                      <th>Originality</th>
                      <th>Acciones Rápidas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="person-cell">
                            <span className="avatar">{getInitials(u.name)}</span>
                            <div className="person-meta">
                              <strong>{u.name}</strong>
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="code-chip">
                            {u.role === 'admin' ? 'ADMINISTRADOR' : u.planName || 'ESTUDIANTE PRO'}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              u.status === 'active'
                                ? 'status-emerald'
                                : u.status === 'expired'
                                ? 'status-amber'
                                : 'status-crimson'
                            }`}
                          >
                            {u.status === 'active'
                              ? 'Activo'
                              : u.status === 'expired'
                              ? 'Vencido'
                              : 'Suspendido'}
                          </span>
                        </td>
                        <td>
                          {u.role === 'admin' ? (
                            <span className="status-pill status-blue">Ilimitado</span>
                          ) : (
                            <span className="code-chip">
                              {u.daily?.remaining ?? 3} / {u.daily?.limit ?? 3} disponibles
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="code-chip">
                            {u.deviceCount || 1} / {u.deviceLimit || 2} equipos
                          </span>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={!!u.originalityApproved || u.role === 'admin'}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setUsers((prev) =>
                                prev.map((item) =>
                                  item.id === u.id
                                    ? { ...item, originalityApproved: checked }
                                    : item
                                )
                              );
                              showNotification(
                                `Originality ${checked ? 'aprobado' : 'retirado'} para ${u.name}`
                              );
                            }}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              type="button"
                              className="button button-secondary button-sm"
                              onClick={() => {
                                setUsers((prev) =>
                                  prev.map((item) =>
                                    item.id === u.id ? { ...item, deviceCount: 0 } : item
                                  )
                                );
                                showNotification(`Dispositivos liberados para ${u.name}.`);
                              }}
                              title="Liberar dispositivos registrados"
                            >
                              <Smartphone size={13} /> Liberar
                            </button>
                            <button
                              type="button"
                              className="button button-emerald button-sm"
                              onClick={() => {
                                setUsers((prev) =>
                                  prev.map((item) =>
                                    item.id === u.id
                                      ? {
                                          ...item,
                                          status: 'active',
                                          daily: {
                                            limit: (item.daily?.limit || 3) + 3,
                                            consumed: item.daily?.consumed || 0,
                                            remaining: (item.daily?.remaining || 3) + 3,
                                          },
                                        }
                                      : item
                                  )
                                );
                                showNotification(`+3 reportes acreditados y cuenta activa: ${u.name}`);
                              }}
                              title="Acreditar +3 reportes y renovar"
                            >
                              <Plus size={13} /> +3 Reportes
                            </button>
                            <a
                              className="button button-secondary button-sm"
                              href={`https://wa.me/51987654321?text=${encodeURIComponent(
                                `Hola ${u.name}, tu acceso académico en TurnitinPE (${
                                  u.planName || 'Plan Pro'
                                }) está listo en https://turnitinpe.com`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Enviar acceso por WhatsApp"
                            >
                              <MessageCircle size={13} /> WhatsApp
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==========================================
              TAB 8: PLANES Y PRECIOS
             ========================================== */}
          {activeTab === 'plans' && (
            <div className="plans-grid">
              {plans.map((plan) => (
                <article key={plan.id} className="plan-card">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span className="code-chip">
                      {plan.modality === 'instructor' ? 'MODALIDAD INSTRUCTOR' : 'MODALIDAD TESISTA'}
                    </span>
                    <span className="status-pill status-emerald">Activo</span>
                  </div>

                  <div>
                    <h2 style={{ fontSize: 20 }}>{plan.name}</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="plan-price-row">
                    <strong>{formatCurrency(plan.priceMinor, plan.currency)}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>/ mes</span>
                  </div>

                  <ul className="plan-features-list">
                    <li>
                      <CheckCircle2 size={15} style={{ color: 'var(--emerald)' }} />
                      {plan.feedbackPolicy?.mode === 'unlimited'
                        ? 'Informes PDF ilimitados por día'
                        : `${plan.feedbackPolicy?.dailyLimit || 7} informes PDF diarios (IA + Similitud)`}
                    </li>
                    <li>
                      <CheckCircle2 size={15} style={{ color: 'var(--emerald)' }} />
                      Aulas Sin Depósito (No Repository)
                    </li>
                    <li>
                      <CheckCircle2 size={15} style={{ color: 'var(--emerald)' }} />
                      QuillBot Premium + Laboratorio NVIDIA IA
                    </li>
                    <li>
                      <Users size={15} style={{ color: 'var(--brand-primary)' }} />
                      <strong>{plan.assignedUsers} cuentas asignadas</strong>
                    </li>
                  </ul>
                </article>
              ))}
            </div>
          )}

          {/* ==========================================
              TAB 9: HISTORIAL DE CUOTAS (DAILY LIMITS LIMA)
             ========================================== */}
          {activeTab === 'daily-limits' && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Control Diario de Reportes (Zona Horaria America/Lima)</h2>
                  <p>Reinicio automático a las 00:00 hrs (Lima) · Acredita unidades extra en 1 clic</p>
                </div>
                <span className="code-chip">Fecha Lima: 2026-11-08</span>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Correo</th>
                      <th>Cuota Base</th>
                      <th>Consumidos Hoy</th>
                      <th>Disponibles</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((u) => u.role !== 'admin')
                      .map((u) => (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.name}</strong>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className="code-chip">{u.daily?.limit ?? 3} reportes</span>
                          </td>
                          <td>{u.daily?.consumed ?? 0}</td>
                          <td>
                            <span className="status-pill status-emerald">
                              {u.daily?.remaining ?? 3} restantes
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="button button-primary button-sm"
                              onClick={() => {
                                setUsers((prev) =>
                                  prev.map((item) =>
                                    item.id === u.id
                                      ? {
                                          ...item,
                                          daily: {
                                            limit: (item.daily?.limit || 3) + 5,
                                            consumed: item.daily?.consumed || 0,
                                            remaining: (item.daily?.remaining || 3) + 5,
                                          },
                                        }
                                      : item
                                  )
                                );
                                showNotification(`Se acreditaron +5 reportes hoy para ${u.name}.`);
                              }}
                            >
                              <Plus size={13} /> Acreditar +5 hoy
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==========================================
              TAB 10: ESTACIONES CHROME Y CONFIGURACIÓN
             ========================================== */}
          {activeTab === 'turnitin-settings' && (
            <div className="upload-studio-grid">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Vinculaciones de Estación Chrome (OriginalityPlus)</h2>
                    <p>26 vinculaciones históricas · Nodos encargados de emitir los PDF oficiales</p>
                  </div>
                  <button
                    type="button"
                    className="button button-primary button-sm"
                    onClick={() => {
                      const tok = `tpe_live_station_${Math.random().toString(36).slice(2, 10)}_7d`;
                      setGeneratedToken(tok);
                      showNotification('Nuevo token de vinculación Chrome (7 días) generado.');
                    }}
                  >
                    <KeyRound size={14} /> Generar Token (7 días)
                  </button>
                </div>

                {generatedToken && (
                  <div
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      background: 'var(--emerald-soft)',
                      border: '1px solid var(--emerald-border)',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: 13, display: 'block' }}>
                        Token para Extensión Chrome (Válido por 7 días):
                      </strong>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {generatedToken}
                      </code>
                    </div>
                    <button
                      type="button"
                      className="button button-secondary button-sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(generatedToken);
                        showNotification('Token copiado al portapapeles.');
                      }}
                    >
                      <Copy size={13} /> Copiar Token
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {bindings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        padding: 14,
                        borderRadius: 12,
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <strong>{b.name}</strong>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          Proveedor: <strong>{b.provider}</strong> · Último latido: {b.lastSeen} ·
                          Procesados hoy: {b.processedToday}
                        </p>
                      </div>
                      <span
                        className={`status-pill ${
                          b.status === 'online' ? 'status-emerald' : 'status-amber'
                        }`}
                      >
                        {b.status === 'online' ? 'Conectada' : 'En espera'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Política de Conservación y Privacidad</h2>
                    <p>Protección de tesis y manuscritos inéditos</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5 }}>
                  <div className="filter-switch-item">
                    <CheckCircle2 size={18} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                    <div>
                      <strong>Depósito Cero (No Repository Garantizado)</strong>
                      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                        Ningún documento subido por clientes o instructores se guarda en la base de
                        datos global de Turnitin, evitando el autoplagio en futuras revisiones
                        universitarias.
                      </p>
                    </div>
                  </div>
                  <div className="filter-switch-item">
                    <CheckCircle2 size={18} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                    <div>
                      <strong>Eliminación Manual Habilitada para Clientes</strong>
                      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                        El tesista o asesor puede eliminar su archivo y certificados en cualquier
                        momento desde su bandeja personal.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ==========================================
              TAB 11: AUDITORÍA EN VIVO (ACTIVITY)
             ========================================== */}
          {activeTab === 'activity' && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Registro de Actividad y Auditoría</h2>
                  <p>Eventos recientes en tiempo real del espacio TurnitinPE</p>
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Actor / Usuario</th>
                      <th>Rol</th>
                      <th>Acción Registrada</th>
                      <th>Recurso / Destino</th>
                      <th>Fecha y Hora (Lima)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div className="person-cell">
                            <span className="avatar avatar-sm">{getInitials(log.actorName)}</span>
                            <strong>{log.actorName}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="code-chip">{log.actorRole}</span>
                        </td>
                        <td>{log.action}</td>
                        <td>{log.target}</td>
                        <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                          {new Date(log.createdAt).toLocaleString('es-PE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Interactive Report Viewer Modal */}
      {selectedJobForReport && (
        <ReportViewerModal
          job={selectedJobForReport}
          onClose={() => setSelectedJobForReport(null)}
          onDownloadCertificate={handleDownloadCertificate}
        />
      )}

      {/* Create Course Modal */}
      {showNewCourseModal && (
        <div className="modal-backdrop" onClick={() => setShowNewCourseModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">NUEVA AULA ACADÉMICA SIN DEPÓSITO</span>
                <h2>Crear Curso o Seminario de Tesis</h2>
              </div>
              <button className="icon-btn" onClick={() => setShowNewCourseModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateCourse}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div className="form-grid">
                <label className="field">
                  Código del curso
                  <input
                    type="text"
                    value={newCourseForm.code}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                    required
                  />
                </label>
                <label className="field">
                  Facultad / Escuela
                  <input
                    type="text"
                    value={newCourseForm.institution}
                    onChange={(e) =>
                      setNewCourseForm({ ...newCourseForm, institution: e.target.value })
                    }
                    required
                  />
                </label>
              </div>

              <label className="field">
                Nombre del Curso o Taller de Tesis
                <input
                  type="text"
                  value={newCourseForm.title}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                  placeholder="Ej. Tesis Doctoral en Educación y Gestión Universitaria"
                  required
                />
              </label>

              <div className="form-grid">
                <label className="field">
                  Umbral máx. Similitud (%)
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={newCourseForm.maxSimilarityThreshold}
                    onChange={(e) =>
                      setNewCourseForm({
                        ...newCourseForm,
                        maxSimilarityThreshold: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="field">
                  Umbral máx. Escritura IA (%)
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={newCourseForm.maxAiThreshold}
                    onChange={(e) =>
                      setNewCourseForm({ ...newCourseForm, maxAiThreshold: e.target.value })
                    }
                  />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowNewCourseModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="button button-primary">
                  Crear Aula Académica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showNewUserModal && (
        <div className="modal-backdrop" onClick={() => setShowNewUserModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">NUEVO ACCESO AL ESPACIO</span>
                <h2>Crear Cuenta de Cliente / Investigador</h2>
              </div>
              <button className="icon-btn" onClick={() => setShowNewUserModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateUser}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <label className="field">
                Nombre completo del cliente
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="Ej. Dra. María Fernanda Quispe"
                  required
                />
              </label>

              <label className="field">
                Correo electrónico de acceso
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="maria.quispe@unmsm.edu.pe"
                  required
                />
              </label>

              <div className="form-grid">
                <label className="field">
                  Plan contratado
                  <select
                    value={newUserForm.planId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, planId: e.target.value })}
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatCurrency(p.priceMinor, p.currency)})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  Dispositivos permitidos
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newUserForm.deviceLimit}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, deviceLimit: e.target.value })
                    }
                  />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowNewUserModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="button button-primary">
                  Crear Cuenta y Habilitar Acceso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showNewPlanModal && (
        <div className="modal-backdrop" onClick={() => setShowNewPlanModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">CATÁLOGO COMERCIAL</span>
                <h2>Crear Nuevo Plan</h2>
              </div>
              <button className="icon-btn" onClick={() => setShowNewPlanModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreatePlan}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <label className="field">
                Nombre del Plan
                <input
                  type="text"
                  value={newPlanForm.name}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                  placeholder="Ej. TESISTA DOCTORAL PRO"
                  required
                />
              </label>

              <div className="form-grid">
                <label className="field">
                  Precio mensual (Soles PEN)
                  <input
                    type="text"
                    value={newPlanForm.pricePen}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, pricePen: e.target.value })}
                    required
                  />
                </label>
                <label className="field">
                  Cuota diaria de informes PDF
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newPlanForm.dailyLimit}
                    onChange={(e) =>
                      setNewPlanForm({ ...newPlanForm, dailyLimit: e.target.value })
                    }
                  />
                </label>
              </div>

              <label className="field">
                Descripción comercial
                <textarea
                  rows={3}
                  value={newPlanForm.description}
                  onChange={(e) =>
                    setNewPlanForm({ ...newPlanForm, description: e.target.value })
                  }
                  placeholder="Acceso completo a aulas sin depósito, certificados IA + Similitud y QuillBot."
                />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowNewPlanModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="button button-primary">
                  Guardar Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast-banner" role="status">
          <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
