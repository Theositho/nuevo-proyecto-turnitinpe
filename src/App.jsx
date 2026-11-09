import React, { useState, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
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
  Download,
  Eye,
  RefreshCw,
  Smartphone,
  MessageCircle,
  ShieldCheck,
  Copy,
  Menu,
  X,
  Sliders,
  Send,
  KeyRound,
  HardDrive,
  FileText,
  Trash2,
} from 'lucide-react';
import {
  SEED_ADMIN_USER,
  SEED_SERVICES,
  SEED_PLANS,
  SEED_JOBS,
  SEED_CLIENT_UPLOADS,
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

  // Core data states
  const [jobs, setJobs] = useState(SEED_JOBS);
  const [users, setUsers] = useState(SEED_USERS);
  const [plans, setPlans] = useState(SEED_PLANS);
  const [bindings] = useState(SEED_BINDINGS);
  const [clientUploads] = useState(SEED_CLIENT_UPLOADS);
  const [auditLogs, setAuditLogs] = useState(SEED_AUDIT);

  // Filters & search
  const [jobSearch, setJobSearch] = useState('');
  const [jobKindFilter, setJobKindFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');

  // Upload studio state (Turnitin Feedback & Originality)
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadReportMode, setUploadReportMode] = useState('both'); // 'both' | 'similarity' | 'ai'
  const [excludeBib, setExcludeBib] = useState(true);
  const [excludeQuotes, setExcludeQuotes] = useState(true);
  const [excludeSmallWords, setExcludeSmallWords] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Modals state
  const [selectedJobForReport, setSelectedJobForReport] = useState(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [toast, setToast] = useState(null);

  // AI Studio state
  const [selectedAiModel, setSelectedAiModel] = useState(SEED_AI_MODELS[0].model);
  const [aiUsedToday, setAiUsedToday] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: '¡Bienvenido a Todas las IA de turnitinpe! Utiliza este asistente para reformular fragmentos con coincidencias, disminuir el porcentaje de detección de IA o revisar la redacción de tu documento antes de volver a analizarlo.',
    },
  ]);

  // QuillBot state
  const [qbInput, setQbInput] = useState(
    'El presente documento analiza los indicadores de gestión y su impacto directo en la optimización de procesos durante el ejercicio 2026.'
  );
  const [qbMode, setQbMode] = useState('academic');
  const [qbOutput, setQbOutput] = useState(
    'Este informe examina las métricas operativas y su incidencia en la mejora continua de los procedimientos institucionales durante el periodo 2026.'
  );

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
    }, 3500);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginBusy(true);
    try {
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
        showNotification(`Bienvenido de nuevo, ${matched.name}`);
      } else {
        setUser({
          ...SEED_ADMIN_USER,
          name: loginEmail.split('@')[0] || 'Usuario',
          email: loginEmail,
        });
        showNotification('Sesión iniciada en turnitinpe');
      }
    } finally {
      setLoginBusy(false);
    }
  };

  const handleFileUploadSubmit = (e) => {
    e.preventDefault();
    const chosenName = uploadFileName.trim() || 'Documento_Revision_Turnitin_2026.pdf';
    setIsUploading(true);

    setTimeout(() => {
      const nextCode = String(13913 + jobs.length - SEED_JOBS.length);
      const simScore = Math.floor(Math.random() * 11) + 4;
      const aiScore = Math.random() > 0.45 ? 0 : Math.floor(Math.random() * 7) + 2;
      const kinds =
        uploadReportMode === 'both'
          ? ['ai', 'similarity']
          : uploadReportMode === 'ai'
          ? ['ai']
          : ['similarity'];

      const newJob = {
        id: `job-${Date.now()}`,
        displayCode: nextCode,
        name: chosenName,
        ownerName: user.name,
        ownerEmail: user.email,
        provider: 'originalityplus',
        sizeBytes: 1542100,
        pages: 58,
        words: 14820,
        kinds,
        state: 'completed',
        similarityScore: simScore,
        aiScore,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        reportNames: {
          ai: `ai-${nextCode}.pdf`,
          similarity: `sim-${nextCode}.pdf`,
        },
        reportStates: {
          ai: { state: 'completed', attempt: 1 },
          similarity: { state: 'completed', attempt: 1 },
        },
        sources: [
          { source: 'repositorio.pucp.edu.pe (Repositorio Institucional)', percent: '4%' },
          { source: 'scielo.org.pe (Artículo Científico)', percent: '3%' },
          { source: 'alicia.concytec.gob.pe', percent: '2%' },
        ],
      };

      setJobs((prev) => [newJob, ...prev]);
      setAuditLogs((prev) => [
        {
          id: `aud-${Date.now()}`,
          actorName: user.name,
          actorRole: viewMode,
          action: `Envió documento #${nextCode} (${kinds.join(' + ').toUpperCase()})`,
          target: chosenName,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setIsUploading(false);
      setUploadFileName('');
      showNotification(
        `¡Reporte #${nextCode} listo! Similitud: ${simScore}% · Detección IA: ${aiScore}%`
      );
      setSelectedJobForReport(newJob);
    }, 850);
  };

  const handleDownloadCertificate = (job, type = 'similarity') => {
    const content = [
      '====================================================================',
      '          TURNITINPE · REPORTE OFICIAL DE IA Y SIMILITUD            ',
      '====================================================================',
      `Código de Trabajo : #${job.displayCode}`,
      `Documento         : ${job.name}`,
      `Usuario / Cliente : ${job.ownerName} (${job.ownerEmail})`,
      `Proveedor         : OriginalityPlus · Sin Depósito (No Repository)`,
      `Fecha en Lima     : ${new Date(job.createdAt).toLocaleString('es-PE')}`,
      '--------------------------------------------------------------------',
      `PORCENTAJE DE SIMILITUD     : ${job.similarityScore}%`,
      `PORCENTAJE DE DETECCIÓN IA  : ${job.aiScore}%`,
      `ARCHIVO DESCARGADO          : ${
        type === 'ai'
          ? job.reportNames?.ai || `ai-${job.displayCode}.pdf`
          : job.reportNames?.similarity || `sim-${job.displayCode}.pdf`
      }`,
      '--------------------------------------------------------------------',
      'FUENTES PRINCIPALES DETECTADAS:',
      ...(job.sources || []).map((s, idx) => `  [${idx + 1}] ${s.source} — ${s.percent}`),
      '====================================================================',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_Turnitin_${type.toUpperCase()}_${job.displayCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(
      `Descargando PDF de ${type === 'ai' ? 'Detección de IA' : 'Similitud'} (#${job.displayCode})`
    );
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;
    const chosenPlan = plans.find((p) => p.id === newUserForm.planId) || plans[0];
    const limitVal = chosenPlan.feedbackPolicy?.dailyLimit || 7;
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
        configuredLimit: limitVal,
        limit: limitVal,
        reserved: 0,
        consumed: 0,
        remaining: limitVal,
      },
      sellerWhatsapp: newUserForm.sellerWhatsapp,
    };
    setUsers((prev) => [created, ...prev]);
    setShowNewUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      planId: SEED_PLANS[0].id,
      deviceLimit: 2,
      sellerWhatsapp: '+51987654321',
    });
    showNotification(`Cuenta creada para ${created.name} (${created.planName}).`);
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!newPlanForm.name.trim()) return;
    const priceMinor = Math.round((parseFloat(newPlanForm.pricePen) || 80) * 100);
    const created = {
      id: `plan-${Date.now()}`,
      name: newPlanForm.name.trim().toUpperCase(),
      description:
        newPlanForm.description.trim() ||
        'Incluye reportes PDF diarios de Detección de IA y Similitud sin depósito.',
      priceMinor,
      currency: 'PEN',
      interval: 'month',
      status: 'active',
      modality: 'instructor',
      billingMode: 'standard',
      assignedUsers: 0,
      feedbackAccess: {
        enabled: true,
        mode: 'daily',
        reportKinds: ['ai', 'similarity'],
      },
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
    showNotification(`Plan "${created.name}" creado correctamente.`);
  };

  const handleSendChat = (promptText) => {
    const content = (promptText ?? chatInput).trim();
    if (!content) return;
    const activeModelObj =
      SEED_AI_MODELS.find((m) => m.model === selectedAiModel) || SEED_AI_MODELS[0];

    const userMsg = { role: 'user', text: content };
    const reply = `✅ **Sugerencia de ${activeModelObj.name}:**\n\n"En concordancia con los antecedentes analizados, la implementación de mecanismos de control operativo fortalece la trazabilidad documental y optimiza la eficiencia institucional."\n\n• **Similitud estimada:** 0%\n• **Detección de IA estimada:** < 2% (Redacción natural)`;

    setChatMessages((prev) => [...prev, userMsg, { role: 'assistant', text: reply }]);
    setChatInput('');
    setAiUsedToday((u) => Math.min(100, u + 1));
  };

  const handleQuillbotParaphrase = (mode) => {
    setQbMode(mode);
    const variants = {
      academic:
        'Este informe examina las métricas operativas y su incidencia en la mejora continua de los procedimientos institucionales durante el periodo 2026.',
      humanized:
        'A través de este documento revisamos cómo los indicadores de gestión influyen directamente en la mejora de los procesos internos a lo largo del año 2026.',
      formal:
        'La presente evaluación determina la correlación existente entre los indicadores administrativos y el fortalecimiento de los procesos organizacionales en el 2026.',
      concise:
        'El documento evalúa el impacto de los indicadores de gestión en la mejora de procesos del 2026.',
    };
    setQbOutput(variants[mode] || variants.academic);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (jobKindFilter === 'low' && j.similarityScore > 15) return false;
      if (jobKindFilter === 'high' && j.similarityScore <= 15 && j.aiScore <= 15) return false;
      const q = jobSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        j.name.toLowerCase().includes(q) ||
        j.displayCode.toLowerCase().includes(q) ||
        (j.ownerName || '').toLowerCase().includes(q)
      );
    });
  }, [jobs, jobKindFilter, jobSearch]);

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

  // Login Screen
  if (!user) {
    return (
      <main className="auth-layout">
        <section className="auth-story">
          <div className="auth-story-header">
            <div className="brand brand-dark">
              <TurnitinSymbol />
              <span>turnitinpe</span>
            </div>
            <button className="sidebar-icon-btn" onClick={toggleTheme} title="Cambiar tema">
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>
          </div>

          <div className="auth-story-body">
            <span className="auth-eyebrow">
              <ShieldCheck size={16} /> TU ESPACIO, CONECTADO · REPORTES DE IA Y SIMILITUD
            </span>
            <h1>Todos tus reportes de IA y Similitud. Un solo acceso.</h1>
            <p className="auth-story-lead">
              Analiza tus documentos PDF y Word sin depósito (No Repository), descarga certificados
              oficiales de Similitud y Detección de IA en segundos, y administra las cuotas y
              accesos de tu equipo desde un panel centralizado.
            </p>

            <div className="auth-pillars">
              <div className="auth-pillar-card">
                <span className="auth-pillar-icon">
                  <FileCheck2 size={18} />
                </span>
                <strong>IA + Similitud Oficial</strong>
                <span>Informes PDF independientes procesados al instante sin indexación.</span>
              </div>
              <div className="auth-pillar-card">
                <span className="auth-pillar-icon">
                  <ShieldCheck size={18} />
                </span>
                <strong>Accesos a tu medida</strong>
                <span>Planes diarios, ilimitados o por créditos con control de dispositivos.</span>
              </div>
              <div className="auth-pillar-card">
                <span className="auth-pillar-icon">
                  <Sparkles size={18} />
                </span>
                <strong>Servicios en un lugar</strong>
                <span>Turnitin Feedback, Originality, QuillBot y Todas las IA conectadas.</span>
              </div>
            </div>
          </div>

          <div className="auth-story-footer">
            <span>turnitinpe · Cada persona, el acceso correcto.</span>
            <span>Estación Chrome OriginalityPlus Activa</span>
          </div>
        </section>

        <section className="auth-panel-wrap">
          <div className="auth-card">
            <div className="auth-card-top">
              <div className="brand">
                <TurnitinSymbol />
                <span>turnitinpe</span>
              </div>
              <span className="status-pill status-emerald">Recepción activa</span>
            </div>

            <h2>Bienvenido de nuevo</h2>
            <p className="auth-subtitle">
              Entra a tu espacio de trabajo para enviar documentos y descargar tus informes de IA y
              Similitud.
            </p>

            <div className="demo-accounts-box">
              <div className="demo-accounts-header">
                <span>Ingreso rápido de demostración</span>
              </div>
              <div className="demo-accounts-buttons">
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => {
                    setUser(SEED_ADMIN_USER);
                    setViewMode('admin');
                    showNotification('Sesión iniciada como Administrador: Saravia chivo');
                  }}
                >
                  <strong>Saravia chivo (Admin)</strong>
                  <span>Gestión de 71 clientes y reportes</span>
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => {
                    const client = SEED_USERS[1];
                    setUser(client);
                    setViewMode('member');
                    setActiveTab('turnitin2');
                    showNotification(`Vista Cliente activa: ${client.name}`);
                  }}
                >
                  <strong>Vista Cliente (Ecola)</strong>
                  <span>Subir PDF y descargar informes</span>
                </button>
              </div>
            </div>

            <form
              onSubmit={handleLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <label className="field">
                Correo electrónico
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tu@correo.com"
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
                {loginBusy ? 'Iniciando sesión…' : 'Iniciar sesión'}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  const isAdminView = viewMode === 'admin';

  // Exact navigation matching turnitinpe.com
  const navGroups = [
    {
      label: 'REPORTES Y ANÁLISIS',
      items: [
        { id: 'overview', label: 'Inicio', icon: LayoutDashboard },
        {
          id: 'turnitin2',
          label: 'Turnitin Feedback',
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
      label: 'SERVICIOS COMPLEMENTARIOS',
      items: [
        { id: 'quillbot', label: 'QuillBot', icon: Feather },
        { id: 'nvidia', label: 'Todas las IA', icon: Sparkles },
      ],
    },
    ...(isAdminView
      ? [
          {
            label: 'ADMINISTRACIÓN DEL ESPACIO',
            items: [
              { id: 'users', label: 'Usuarios', icon: Users, badge: String(users.length) },
              { id: 'plans', label: 'Planes y precios', icon: CreditCard },
              { id: 'turnitin-settings', label: 'Configuración de Turnitin', icon: Settings },
              { id: 'daily-limits', label: 'Historial de cuotas', icon: BarChart3 },
              { id: 'client-uploads', label: 'Archivos de clientes', icon: HardDrive },
              { id: 'activity', label: 'Actividad', icon: History },
            ],
          },
        ]
      : []),
  ];

  const pageMeta = {
    overview: {
      eyebrow: isAdminView ? 'VISTA GENERAL' : 'BIENVENIDO',
      title: isAdminView ? `Hola, ${user.name}.` : `Hola, ${user.name}`,
      subtitle: isAdminView
        ? 'Así va tu espacio hoy: supervisión de reportes de IA y Similitud, usuarios activos y servicios conectados.'
        : 'Elige el servicio contratado que deseas abrir para procesar tus documentos.',
    },
    turnitin2: {
      eyebrow: 'TU ESPACIO DE ANÁLISIS',
      title: 'Turnitin Feedback · Detección de IA y Similitud',
      subtitle:
        'Prepara una nueva solicitud de análisis en PDF y descarga tus informes oficiales de IA y Similitud sin depósito.',
    },
    documents: {
      eyebrow: 'DOCUMENTOS PRIVADOS',
      title: 'Turnitin Originality · Tus archivos en un lugar',
      subtitle:
        'Guarda documentos (.docx / .pdf), aplica filtros de exclusión y consulta sus informes independientes.',
    },
    quillbot: {
      eyebrow: 'APOYO A LA REDACCIÓN',
      title: 'QuillBot · Parafraseo y Credenciales',
      subtitle:
        'Herramientas de apoyo para reformular coincidencias y credenciales directas para clientes activos.',
    },
    nvidia: {
      eyebrow: 'INTELIGENCIA ARTIFICIAL',
      title: 'Todas las IA · Chat y Transcripción NVIDIA',
      subtitle:
        'Modelos de inteligencia artificial y transcripción de audio WAV incluidos en tu espacio.',
    },
    users: {
      eyebrow: 'EQUIPO Y PERMISOS',
      title: 'Personas con acceso.',
      subtitle:
        'Crea cuentas, asigna planes, controla el límite de dispositivos, acredita reportes y envía accesos por WhatsApp.',
    },
    plans: {
      eyebrow: 'CATÁLOGO COMERCIAL',
      title: 'Planes y precios.',
      subtitle:
        'Define precios en Soles (PEN), cuotas diarias de PDF (IA + Similitud) y permisos incluidos.',
    },
    'turnitin-settings': {
      eyebrow: 'PROCESAMIENTO Y ESTACIONES',
      title: 'Configuración de Turnitin.',
      subtitle:
        'Administra el proveedor (OriginalityPlus / AcademiaCX), las vinculaciones Chrome de 7 días y la conservación de informes.',
    },
    'daily-limits': {
      eyebrow: 'HORA EN LIMA (AMERICA/LIMA)',
      title: 'Historial de cuotas de reportes.',
      subtitle:
        'Consulta los reportes consumidos hoy por cada cliente y acredita unidades adicionales.',
    },
    'client-uploads': {
      eyebrow: 'ALMACENAMIENTO DE DOCUMENTOS',
      title: 'Archivos de clientes.',
      subtitle:
        'Supervisa el volumen de documentos subidos por cada cliente y su estado de procesamiento.',
    },
    activity: {
      eyebrow: 'REGISTRO DEL ESPACIO',
      title: 'Actividad de usuarios.',
      subtitle:
        'Consulta las sesiones iniciadas, los trabajos procesados por la estación Chrome y los movimientos administrativos.',
    },
  }[activeTab] || {
    eyebrow: 'TURNITINPE',
    title: 'Espacio de trabajo',
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
                [
                  'users',
                  'plans',
                  'daily-limits',
                  'turnitin-settings',
                  'client-uploads',
                  'activity',
                ].includes(activeTab)
              ) {
                setActiveTab('turnitin2');
              }
            }}
          >
            <FileCheck2 size={14} /> Vista Cliente
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
            <span>Estación Chrome · OriginalityPlus</span>
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
                <small>{isAdminView ? 'Administrador (report_admin)' : user.planName || 'INSTRUCTOR BASICO'}</small>
              </span>
            </button>
            <button
              type="button"
              className="sidebar-icon-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
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
              <span>turnitinpe</span>
              <span>/</span>
              <strong>{pageMeta.title}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <span className="quota-chip">
              <ShieldCheck size={14} style={{ color: 'var(--emerald)' }} />
              Sin Depósito (No Repository)
            </span>
            <span className="quota-chip">
              <FileCheck2 size={14} style={{ color: 'var(--brand-primary)' }} />
              {isAdminView ? 'Reportes Ilimitados' : 'Cuota hoy: 5 / 7 disponibles'}
            </span>
            <button
              type="button"
              className="button button-primary button-sm"
              onClick={() => setActiveTab('turnitin2')}
            >
              <Upload size={14} /> Subir Documento PDF
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
              {activeTab === 'users' && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setShowNewUserModal(true)}
                >
                  <Plus size={16} /> Crear cuenta
                </button>
              )}
              {activeTab === 'plans' && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setShowNewPlanModal(true)}
                >
                  <Plus size={16} /> Crear plan
                </button>
              )}
            </div>
          </div>

          {/* ==========================================
              TAB 1: INICIO (OVERVIEW)
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
                  <span className="metric-note">Cuentas registradas en turnitinpe</span>
                </article>

                <article className="metric-card">
                  <div className="metric-top">
                    <span>Accesos activos</span>
                    <span className="metric-icon metric-emerald">
                      <CheckCircle2 size={18} />
                    </span>
                  </div>
                  <div className="metric-value">66</div>
                  <span className="metric-note">Listos para enviar documentos hoy</span>
                </article>

                <article className="metric-card">
                  <div className="metric-top">
                    <span>Trabajos procesados</span>
                    <span className="metric-icon metric-amber">
                      <FileCheck2 size={18} />
                    </span>
                  </div>
                  <div className="metric-value">{100 + jobs.length - SEED_JOBS.length}</div>
                  <span className="metric-note">Reportes PDF de IA + Similitud</span>
                </article>

                <article className="metric-card">
                  <div className="metric-top">
                    <span>Estaciones Chrome</span>
                    <span className="metric-icon metric-blue">
                      <ShieldCheck size={18} />
                    </span>
                  </div>
                  <div className="metric-value">26</div>
                  <span className="metric-note">OriginalityPlus conectada en vivo</span>
                </article>
              </div>

              <div className="overview-grid">
                {/* Latest Reports */}
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Últimos Reportes de IA y Similitud</h2>
                      <p>Haz clic en cualquier trabajo para abrir el visor o descargar sus PDF.</p>
                    </div>
                    <button
                      type="button"
                      className="button button-primary button-sm"
                      onClick={() => setActiveTab('turnitin2')}
                    >
                      <Upload size={13} /> Nuevo Análisis
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Documento</th>
                          <th>Similitud</th>
                          <th>Detección IA</th>
                          <th>Informes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.slice(0, 5).map((job) => (
                          <tr key={job.id}>
                            <td>
                              <span className="code-chip">#{job.displayCode}</span>
                            </td>
                            <td>
                              <div className="person-meta">
                                <strong>{job.name}</strong>
                                <span>Cliente: {job.ownerName}</span>
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
                                <Eye size={13} /> Ver Reporte
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Services Status */}
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Servicios del Espacio</h2>
                      <p>4 herramientas conectadas en tu dashboard</p>
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
                            <span className="status-pill status-emerald">Recepción activa</span>
                          </div>
                          <p
                            style={{
                              fontSize: 12.5,
                              color: 'var(--text-secondary)',
                              marginTop: 3,
                            }}
                          >
                            {svc.description}
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
              TAB 2 & 3: TURNITIN FEEDBACK & ORIGINALITY
             ========================================== */}
          {(activeTab === 'turnitin2' || activeTab === 'documents') && (
            <>
              <div className="upload-studio-grid">
                {/* Upload Form */}
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Subir documento</h2>
                      <p>Prepara una nueva solicitud de análisis de IA y Similitud.</p>
                    </div>
                    <span className="status-pill status-emerald">
                      1 crédito por documento · IA + Similitud
                    </span>
                  </div>

                  <form
                    onSubmit={handleFileUploadSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
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
                            ? `Archivo listo: ${uploadFileName}`
                            : 'Arrastra tu archivo PDF aquí o selecciona un archivo desde tu equipo'}
                        </strong>
                        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                          Hasta 100 MB por documento · Sin depósito en base de datos Turnitin
                        </span>
                      </div>
                    </div>

                    <div className="form-grid">
                      <label className="field">
                        Nombre del documento (opcional)
                        <input
                          type="text"
                          value={uploadFileName}
                          onChange={(e) => setUploadFileName(e.target.value)}
                          placeholder="Ej. proyectofin_26.corregido1.pdf"
                        />
                      </label>

                      <label className="field">
                        Tipo de informe solicitado
                        <select
                          value={uploadReportMode}
                          onChange={(e) => setUploadReportMode(e.target.value)}
                        >
                          <option value="both">IA + Similitud (Ambos informes PDF)</option>
                          <option value="similarity">Solo Similitud</option>
                          <option value="ai">Solo Detección de IA</option>
                        </select>
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <button
                        type="submit"
                        className="button button-primary"
                        disabled={isUploading}
                      >
                        <FileCheck2 size={16} />
                        {isUploading ? 'Procesando en estación…' : 'Enviar documento'}
                      </button>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Detección de IA ilimitada · Los informes nunca se indexan en repositorio.
                      </span>
                    </div>
                  </form>
                </section>

                {/* Similarity Filters */}
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Filtros del Informe de Similitud</h2>
                      <p>Configura las exclusiones antes de enviar tu documento</p>
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
                          Excluir bibliografía
                        </strong>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          Ignora la lista de referencias bibliográficas al calcular el porcentaje de
                          similitud.
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
                          Excluir citas textuales
                        </strong>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          Excluye el texto citado correctamente entre comillas del puntaje total.
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
                          Evita que frases comunes o nombres propios sumen porcentaje de similitud.
                        </span>
                      </div>
                    </label>
                  </div>
                </section>
              </div>

              {/* Jobs / Documents Table */}
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Mis documentos y trabajos ({filteredJobs.length})</h2>
                    <p>Consulta el estado y descarga tus informes PDF de IA y Similitud.</p>
                  </div>

                  <div className="toolbar">
                    <div className="filter-tabs">
                      {[
                        { id: 'all', label: 'Todos' },
                        { id: 'low', label: 'Similitud ≤ 15%' },
                        { id: 'high', label: 'Por revisar (>15%)' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className={`filter-tab ${jobKindFilter === f.id ? 'active' : ''}`}
                          onClick={() => setJobKindFilter(f.id)}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="search-box">
                      <Search size={15} style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        placeholder="Buscar por código (#13912), documento o cliente…"
                      />
                    </div>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Documento</th>
                        <th>Cliente</th>
                        <th>Informe Similitud</th>
                        <th>Informe IA</th>
                        <th>Actividad</th>
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
                                {((job.sizeBytes || 1200000) / 1024 / 1024).toFixed(2)} MB ·{' '}
                                {job.pages || 48} págs.
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="person-meta">
                              <strong>{job.ownerName}</strong>
                              <span>{job.ownerEmail}</span>
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
                              {job.aiScore === 0 ? '0% IA' : `${job.aiScore}% IA`}
                            </span>
                          </td>
                          <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                            {new Date(job.createdAt).toLocaleString('es-PE', {
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
                                title="Descargar PDF de Similitud"
                              >
                                <Download size={13} /> Similitud
                              </button>
                              <button
                                type="button"
                                className="button button-secondary button-sm"
                                onClick={() => handleDownloadCertificate(job, 'ai')}
                                title="Descargar PDF de IA"
                              >
                                <Download size={13} /> IA
                              </button>
                              <button
                                type="button"
                                className="icon-btn danger"
                                onClick={() => {
                                  setJobs((prev) => prev.filter((item) => item.id !== job.id));
                                  showNotification(`Trabajo #${job.displayCode} eliminado.`);
                                }}
                                title="Eliminar documento e informes"
                              >
                                <Trash2 size={14} />
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
              TAB 4: TODAS LAS IA (NVIDIA)
             ========================================== */}
          {activeTab === 'nvidia' && (
            <div className="ai-studio-layout">
              <aside className="ai-models-sidebar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 14 }}>Catálogo Todas las IA</strong>
                  <span className="code-chip">{SEED_AI_MODELS.length} activos</span>
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
                      <strong style={{ fontSize: 13 }}>{m.name}</strong>
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
                      Chat exclusivo mediante NVIDIA para apoyo en redacción y reducción de similitud
                    </p>
                  </div>
                  <span className="status-pill status-emerald">
                    Consultas de hoy: {aiUsedToday} / 100
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
                        'Reescribe este párrafo para reducir el porcentaje de similitud y detección de IA.'
                      )
                    }
                  >
                    ✨ Reducir porcentaje de IA y similitud
                  </button>
                  <button
                    type="button"
                    className="prompt-chip"
                    onClick={() =>
                      handleSendChat('Mejora la redacción formal manteniendo las citas APA.')
                    }
                  >
                    📝 Mejorar redacción formal APA
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
                    placeholder="Pega aquí el fragmento que deseas reformular antes de volver a pasar por Turnitin…"
                  />
                  <button type="submit" className="button button-primary">
                    <Send size={15} /> Enviar
                  </button>
                </form>
              </section>
            </div>
          )}

          {/* ==========================================
              TAB 5: QUILLBOT
             ========================================== */}
          {activeTab === 'quillbot' && (
            <div className="upload-studio-grid">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>QuillBot · Parafraseador de Apoyo</h2>
                    <p>Reformula pasajes con coincidencias antes de generar tu informe definitivo</p>
                  </div>
                  <div className="filter-tabs">
                    {[
                      { id: 'academic', label: 'Académico' },
                      { id: 'humanized', label: 'Natural (Baja IA)' },
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
                    Fragmento con coincidencias
                    <textarea
                      rows={6}
                      value={qbInput}
                      onChange={(e) => setQbInput(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    Texto reformulado
                    <textarea rows={6} readOnly value={qbOutput} />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => handleQuillbotParaphrase(qbMode)}
                  >
                    <RefreshCw size={15} /> Parafrasear
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => {
                      navigator.clipboard?.writeText(qbOutput);
                      showNotification('Texto copiado al portapapeles.');
                    }}
                  >
                    <Copy size={15} /> Copiar
                  </button>
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Acceso Directo QuillBot</h2>
                    <p>QuillBot es gratuito para clientes con cuenta activa</p>
                  </div>
                  <span className="status-pill status-emerald">Vigente</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="field">
                    <span>Correo electrónico</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        readOnly
                        value="acceso.quillbot@turnitinpe.com"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => {
                          navigator.clipboard?.writeText('acceso.quillbot@turnitinpe.com');
                          showNotification('Correo electrónico copiado.');
                        }}
                      >
                        <Copy size={14} /> Copiar
                      </button>
                    </div>
                  </div>

                  <div className="field">
                    <span>Contraseña</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        readOnly
                        value="QuillBot#TurnitinPE2026"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => {
                          navigator.clipboard?.writeText('QuillBot#TurnitinPE2026');
                          showNotification('Contraseña copiada.');
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
              TAB 6: USUARIOS (ADMIN)
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
                      id: 'suspended',
                      label: `Suspendidos (${
                        users.filter((u) => u.status === 'suspended').length
                      })`,
                    },
                    {
                      id: 'expired',
                      label: `Vencidos (${users.filter((u) => u.status === 'expired').length})`,
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
                    placeholder="Buscar cuenta por nombre, correo o plan…"
                  />
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Persona</th>
                      <th>Plan asignado</th>
                      <th>Estado</th>
                      <th>Cuota diaria (Lima)</th>
                      <th>Dispositivos</th>
                      <th>Originality</th>
                      <th>Acciones</th>
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
                            {u.role === 'admin' ? 'ADMINISTRADOR' : u.planName || 'Sin plan'}
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
                              {u.daily?.remaining ?? 3} / {u.daily?.limit ?? 3} restantes
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="code-chip">
                            {u.deviceCount || 1} / {u.deviceLimit || 1}
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
                                `Turnitin Originality ${
                                  checked ? 'aprobado' : 'deshabilitado'
                                } para ${u.name}`
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
                                showNotification(
                                  `Dispositivos liberados para ${u.name}. El siguiente ingreso registrará el nuevo navegador.`
                                );
                              }}
                            >
                              <Smartphone size={13} /> Liberar dispositivos
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
                                            ...item.daily,
                                            limit: (item.daily?.limit || 3) + 3,
                                            remaining: (item.daily?.remaining || 3) + 3,
                                          },
                                        }
                                      : item
                                  )
                                );
                                showNotification(`Saldo de +3 reportes acreditado a ${u.name}`);
                              }}
                            >
                              <Plus size={13} /> Acreditar +3
                            </button>
                            <a
                              className="button button-secondary button-sm"
                              href={`https://wa.me/51987654321?text=${encodeURIComponent(
                                `Hola ${u.name}, tu acceso a TurnitinPE (${
                                  u.planName || 'Reportes IA + Similitud'
                                }) está activo en https://turnitinpe.com`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
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
              TAB 7: PLANES Y PRECIOS
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
                      {plan.billingMode === 'credits'
                        ? 'POR CRÉDITOS'
                        : plan.modality === 'instructor'
                        ? 'INSTRUCTOR'
                        : 'ESTUDIANTE'}
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
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      / {plan.interval === 'once' ? 'pago único' : 'mes'}
                    </span>
                  </div>

                  <ul className="plan-features-list">
                    <li>
                      <CheckCircle2 size={15} style={{ color: 'var(--emerald)' }} />
                      {plan.feedbackPolicy?.mode === 'credits'
                        ? '1 crédito por PDF · IA + Similitud'
                        : `${plan.feedbackPolicy?.dailyLimit || 7} PDF por día · IA + Similitud`}
                    </li>
                    <li>
                      <CheckCircle2 size={15} style={{ color: 'var(--emerald)' }} />
                      Turnitin Feedback habilitado (Sin depósito)
                    </li>
                    <li>
                      <CheckCircle2 size={15} style={{ color: 'var(--emerald)' }} />
                      QuillBot incluido gratuitamente
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
              TAB 8: CONFIGURACIÓN DE TURNITIN
             ========================================== */}
          {activeTab === 'turnitin-settings' && (
            <div className="upload-studio-grid">
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Vinculaciones Chrome · Proveedor OriginalityPlus</h2>
                    <p>Estaciones conectadas para procesar los informes PDF de IA y Similitud</p>
                  </div>
                  <button
                    type="button"
                    className="button button-primary button-sm"
                    onClick={() => {
                      const tok = `tpe_chrome_bind_${Math.random().toString(36).slice(2, 10)}_7d`;
                      setGeneratedToken(tok);
                      showNotification(
                        'Vinculación generada (7 días). Guarda este token en la extensión.'
                      );
                    }}
                  >
                    <KeyRound size={14} /> Generar vinculación (7 días)
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
                        Guarda este token en la extensión Chrome (Solo se muestra ahora):
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
                        showNotification('Token copiado.');
                      }}
                    >
                      <Copy size={13} /> Copiar
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
                          Trabajos hoy: {b.processedToday}
                        </p>
                      </div>
                      <span
                        className={`status-pill ${
                          b.status === 'online' ? 'status-emerald' : 'status-amber'
                        }`}
                      >
                        {b.status === 'online' ? 'Activa' : 'En espera'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Conservación y Procesamiento</h2>
                    <p>Políticas de retención de documentos e informes</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="filter-switch-item">
                    <CheckCircle2 size={18} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                    <div>
                      <strong>Los informes nunca se eliminan automáticamente</strong>
                      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                        Los reportes PDF generados permanecen disponibles en la cuenta del cliente.
                      </p>
                    </div>
                  </div>
                  <div className="filter-switch-item">
                    <CheckCircle2 size={18} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                    <div>
                      <strong>Eliminación por el cliente habilitada</strong>
                      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                        El cliente puede eliminar su documento e informes cuando haya terminado de
                        descargarlos.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ==========================================
              TAB 9: HISTORIAL DE CUOTAS (DAILY LIMITS)
             ========================================== */}
          {activeTab === 'daily-limits' && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Historial de cuotas de reportes (Día en Lima: 2026-11-08)</h2>
                  <p>Acredita saldo de reportes confirmado o ajusta el límite diario individual</p>
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Correo</th>
                      <th>Límite Configurado</th>
                      <th>Consumidos Hoy</th>
                      <th>Reservas</th>
                      <th>Restantes</th>
                      <th>Acreditar saldo</th>
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
                            <span className="code-chip">{u.daily?.limit ?? 3} PDF / día</span>
                          </td>
                          <td>{u.daily?.consumed ?? 0}</td>
                          <td>{u.daily?.reserved ?? 0}</td>
                          <td>
                            <span className="status-pill status-emerald">
                              {u.daily?.remaining ?? 3} disponibles
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
                                            ...item.daily,
                                            limit: (item.daily?.limit || 3) + 5,
                                            remaining: (item.daily?.remaining || 3) + 5,
                                          },
                                        }
                                      : item
                                  )
                                );
                                showNotification(`Se acreditaron +5 reportes a ${u.name}.`);
                              }}
                            >
                              <Plus size={13} /> Acreditar +5 reportes
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
              TAB 10: ARCHIVOS DE CLIENTES (CLIENT UPLOADS)
             ========================================== */}
          {activeTab === 'client-uploads' && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Archivos subidos por clientes</h2>
                  <p>Resumen de almacenamiento y entregas registradas por cuenta</p>
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Correo</th>
                      <th>Documentos Subidos</th>
                      <th>Volumen Total</th>
                      <th>Pendientes</th>
                      <th>Última Carga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientUploads.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.email}</td>
                        <td>
                          <span className="code-chip">{item.count} archivos</span>
                        </td>
                        <td>{(item.bytes / 1024).toFixed(1)} KB</td>
                        <td>{item.pending}</td>
                        <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                          {new Date(item.lastUpload).toLocaleString('es-PE')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==========================================
              TAB 11: ACTIVIDAD / AUDITORÍA
             ========================================== */}
          {activeTab === 'activity' && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2>Auditoría y Actividad del Espacio</h2>
                  <p>Registro cronológico de inicios de sesión y respuestas de la estación Chrome</p>
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Persona / Estación</th>
                      <th>Rol</th>
                      <th>Acción</th>
                      <th>Recurso</th>
                      <th>Fecha y hora (Lima)</th>
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

      {/* Report Viewer Modal */}
      {selectedJobForReport && (
        <ReportViewerModal
          job={selectedJobForReport}
          onClose={() => setSelectedJobForReport(null)}
          onDownloadCertificate={handleDownloadCertificate}
        />
      )}

      {/* Create User Modal */}
      {showNewUserModal && (
        <div className="modal-backdrop" onClick={() => setShowNewUserModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">NUEVA CUENTA DE CLIENTE</span>
                <h2>Crear cuenta</h2>
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
                Nombre completo
                <input
                  type="text"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="Nombre del cliente"
                  required
                />
              </label>

              <label className="field">
                Correo electrónico
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="cliente@correo.com"
                  required
                />
              </label>

              <div className="form-grid">
                <label className="field">
                  Plan asignado
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
                    max="20"
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
                  Crear cuenta
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
                <span className="page-eyebrow">PLANES Y PRECIOS</span>
                <h2>Crear plan</h2>
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
                Nombre del plan
                <input
                  type="text"
                  value={newPlanForm.name}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                  placeholder="Ej. INSTRUCTOR PRO"
                  required
                />
              </label>

              <div className="form-grid">
                <label className="field">
                  Precio en Soles (PEN)
                  <input
                    type="text"
                    value={newPlanForm.pricePen}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, pricePen: e.target.value })}
                    required
                  />
                </label>
                <label className="field">
                  PDFs diarios incluidos (IA + Similitud)
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
                Descripción
                <textarea
                  rows={3}
                  value={newPlanForm.description}
                  onChange={(e) =>
                    setNewPlanForm({ ...newPlanForm, description: e.target.value })
                  }
                  placeholder="Informes PDF diarios de Similitud e IA sin depósito."
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
                  Guardar plan
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
