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
  Calendar,
  Clock,
  Globe,
} from 'lucide-react';
import {
  SEED_ADMIN_USER,
  SEED_SUPER_ADMIN_USER,
  SEED_REPORT_ADMIN_USER,
  SEED_ADMIN_CREDENTIALS,
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
import Landing from './components/Landing';

function formatCurrency(minor, currency = 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format((minor || 0) / 100);
}

function getInitials(name = '') {
  return (
    String(name || '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'TP'
  );
}

function toDateTimeLocalValue(dateInput) {
  try {
    const d = dateInput ? new Date(dateInput) : new Date(Date.now() + 30 * 86400000);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

function formatSafeDateTime(
  dateInput,
  options = { dateStyle: 'medium', timeStyle: 'short' }
) {
  if (!dateInput) return 'Sin definir';
  try {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return 'Sin definir';
    return d.toLocaleString('es-PE', options);
  } catch {
    return String(dateInput);
  }
}

function hasPendingReports(u) {
  if (!u || u.role === 'admin') return false;
  return (
    (u.pendingReports || 0) > 0 ||
    (u.daily?.reserved || 0) > 0 ||
    (u.daily?.remaining ?? 0) > 0
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

function QuillbotIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, borderRadius: '50%' }}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" fill="#499557" />
      {/* Feather / Quill on top of robot head */}
      <path
        d="M31.5 22C31.5 16.5 35.5 11.2 40.5 9.5C40.3 12.2 39.2 14.2 37.5 15.3L39.3 15.6C38.2 17.6 36.8 18.8 35.2 19.6L36.8 20C35.4 21.4 33.6 22 31.5 22Z"
        fill="#FFFFFF"
      />
      <path
        d="M32 22L38.5 11.5"
        stroke="#499557"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Robot Head */}
      <rect x="17" y="22" width="30" height="19" rx="2" fill="#FFFFFF" />
      {/* Robot Eyes */}
      <circle cx="24.5" cy="31.5" r="3.4" fill="#499557" />
      <circle cx="39.5" cy="31.5" r="3.4" fill="#499557" />
      {/* Neck */}
      <rect x="27.5" y="42" width="9" height="3" fill="#FFFFFF" />
      {/* Torso */}
      <path
        d="M19 46H45V56C40.8 58.6 36.5 60 32 60C27.5 60 23.2 58.6 19 56V46Z"
        fill="#FFFFFF"
      />
      <path d="M19 50H33V59.5" stroke="#499557" strokeWidth="1.5" />
      <line x1="21" y1="53" x2="30" y2="53" stroke="#499557" strokeWidth="1.5" />
      <circle cx="39" cy="53" r="2.6" stroke="#499557" strokeWidth="1.5" />
    </svg>
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  // Inicio público (landing). Subdominios app./login./portal. o #login van directo al inicio de sesión.
  const [showLanding, setShowLanding] = useState(() => {
    if (typeof window === 'undefined') return true;
    const host = window.location.hostname;
    const direct = /^(app|login|portal|panel)\./i.test(host) || /login/i.test(window.location.hash);
    return !direct;
  });
  const [viewMode, setViewMode] = useState('admin'); // 'admin' | 'member'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('fabianrayasaravia@gmail.com');
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
  const [uploadStage, setUploadStage] = useState(0); // 0=idle, 1=chunked, 2=quota, 3=station, 4=done
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeProvider, setActiveProvider] = useState('originalityplus');
  const [retentionPolicy, setRetentionPolicy] = useState('never');
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
    serviceType: 'feedback', // 'feedback' (7/día) | 'originality' (ilimitado) | 'both'
    planId: SEED_PLANS[0].id,
    deviceLimit: 2,
    expiresAt: toDateTimeLocalValue(new Date(Date.now() + 30 * 86400000)),
    sellerWhatsapp: '+51987654321',
  });

  // New Admin Reportes (vendedor) form state — solo Ultra Admin y Super Admin
  const [showNewAdminModal, setShowNewAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    whatsapp: '',
    deviceLimit: 2,
  });
  const [newAdminError, setNewAdminError] = useState('');

  // New Plan form state
  const [newPlanForm, setNewPlanForm] = useState({
    name: '',
    description: '',
    pricePen: '90.00',
    dailyLimit: 7,
  });

  // Modal y formulario para "Crear Demo" (sección independiente)
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    password: '',
    expiresAt: toDateTimeLocalValue(new Date(Date.now() + 7 * 86400000)), // 7 días de demo
    notes: 'Demo solo visualización (sin descarga ni edición)',
  });
  const [demoFormError, setDemoFormError] = useState('');

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
      const normalizedEmail = loginEmail.trim().toLowerCase();
      const matched = users.find(
        (u) =>
          u.email.toLowerCase() === normalizedEmail ||
          (u.altEmail && u.altEmail.toLowerCase() === normalizedEmail)
      );
      if (
        normalizedEmail === 'fabianrayasaravia@gmail.com'
      ) {
        setUser(SEED_ADMIN_USER);
        setViewMode('admin');
        showNotification('Sesión iniciada como Ultra Admin (Control total y eliminación)');
      } else if (normalizedEmail === 'acadiax@turnitinpe.com') {
        setUser(SEED_SUPER_ADMIN_USER);
        setViewMode('admin');
        showNotification('Sesión iniciada como Super Admin');
      } else if (normalizedEmail === 'saraviarosquetecomeverga@chivo.com') {
        setUser(SEED_REPORT_ADMIN_USER);
        setViewMode('admin');
        showNotification(
          'Sesión iniciada como Admin Reportes (Solo gestiona las cuentas que vende)'
        );
      } else if (matched) {
        if (matched.passwordPlain && loginPassword !== matched.passwordPlain) {
          showNotification('Contraseña incorrecta para esta cuenta.');
          return;
        }
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

  const handleRetryAiReport = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const updated = {
          ...j,
          aiScore: 0,
          reportStates: {
            ...j.reportStates,
            ai: { state: 'completed', attempt: (j.reportStates?.ai?.attempt || 1) + 1 },
          },
        };
        if (selectedJobForReport?.id === jobId) {
          setSelectedJobForReport(updated);
        }
        return updated;
      })
    );
    showNotification('Reporte PDF de IA regenerado con éxito (0% IA).');
  };

  const handleFileUploadSubmit = (e) => {
    e.preventDefault();
    const isDemoUser = !!user?.isDemo;
    const chosenName = uploadFileName.trim() || 'Documento_Revision_Turnitin_2026.pdf';
    setIsUploading(true);
    setUploadStage(1);
    setUploadProgress(25);

    setTimeout(() => {
      setUploadStage(2);
      setUploadProgress(55);
    }, 300);

    setTimeout(() => {
      setUploadStage(3);
      setUploadProgress(85);
    }, 600);

    setTimeout(() => {
      setUploadStage(4);
      setUploadProgress(100);
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
        provider: activeProvider,
        sizeBytes: 1542100,
        pages: 58,
        words: 14820,
        kinds,
        state: isDemoUser ? 'demo_locked' : 'completed',
        isDemoFile: isDemoUser,
        similarityScore: simScore,
        aiScore,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        reportNames: {
          ai: `ai-${nextCode}.pdf`,
          similarity: `sim-${nextCode}.pdf`,
        },
        reportStates: {
          ai: { state: isDemoUser ? 'demo_locked' : 'completed', attempt: 1 },
          similarity: { state: isDemoUser ? 'demo_locked' : 'completed', attempt: 1 },
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
          action: isDemoUser
            ? `Subió documento de prueba #${nextCode} en MODO DEMO (resultado protegido)`
            : `Envió documento #${nextCode} (${kinds.join(' + ').toUpperCase()})`,
          target: chosenName,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setIsUploading(false);
      setUploadStage(0);
      setUploadProgress(0);
      setUploadFileName('');

      if (isDemoUser) {
        showNotification(
          `🔒 Documento #${nextCode} recibido en MODO DEMO: el resultado está protegido y oculto hasta adquirir una cuenta oficial.`
        );
      } else {
        showNotification(
          `¡Reporte #${nextCode} listo! Similitud: ${simScore}% · Detección IA: ${aiScore}%`
        );
        setSelectedJobForReport(newJob);
      }
    }, 950);
  };

  const handleDownloadCertificate = (job, type = 'similarity') => {
    if (user?.isDemo || job.isDemoFile || job.state === 'demo_locked') {
      showNotification(
        '🔒 Modo Demo: la descarga de certificados e informes está inhabilitada. Adquiere una cuenta oficial para descargar.'
      );
      return;
    }
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

  const openNewAdminModal = () => {
    setNewAdminError('');
    setNewAdminForm({ name: '', email: '', password: '', whatsapp: '', deviceLimit: 2 });
    setShowNewAdminModal(true);
  };

  const handleCreateReportAdmin = (e) => {
    e.preventDefault();
    if (!(isUltraAdmin || isSuperAdmin)) {
      setNewAdminError('Solo Ultra Admin y Super Admin pueden crear cuentas de Admin Reportes.');
      return;
    }
    const name = newAdminForm.name.trim();
    const email = newAdminForm.email.trim().toLowerCase();
    const password = newAdminForm.password;
    if (!name || !email) {
      setNewAdminError('Completa el nombre y el correo del vendedor.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewAdminError('El correo no es válido.');
      return;
    }
    if (password.length < 12) {
      setNewAdminError('La contraseña inicial debe tener al menos 12 caracteres.');
      return;
    }
    if (users.some((u) => (u.email || '').toLowerCase() === email)) {
      setNewAdminError('Ya existe una cuenta con ese correo.');
      return;
    }
    const created = {
      id: `adm-rep-${Date.now().toString(36)}`,
      name,
      email,
      passwordPlain: password,
      role: 'admin',
      adminRole: 'report_admin',
      adminRoleLabel: 'ADMIN REPORTES',
      reviewAccess: 'instructor',
      status: 'active',
      deviceLimit: Math.min(Number(newAdminForm.deviceLimit) || 2, 5),
      deviceCount: 0,
      deviceCurrency: 'PEN',
      nvidiaRequestsPerDay: 100,
      creditsBalance: 0,
      providerWhatsapp: newAdminForm.whatsapp.trim(),
      adminPermissions: ['clients.manage_own', 'reports.assign_units'],
      feedbackAccess: {
        enabled: true,
        mode: 'unlimited',
        reportKinds: ['ai', 'similarity'],
        canSubmit: true,
      },
      dailyReportLimit: { unlimitedAi: true, limit: null, remaining: null },
      createdById: user?.id,
      createdByName: user?.name,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };
    setUsers((prev) => [created, ...prev]);
    setShowNewAdminModal(false);
    showNotification(`Admin Reportes creado: ${name} (${email})`);
  };

  const openNewDemoModal = () => {
    setDemoFormError('');
    setDemoForm({
      name: '',
      email: '',
      password: '',
      expiresAt: toDateTimeLocalValue(new Date(Date.now() + 7 * 86400000)),
      notes: 'Demo solo visualización (sin descarga ni edición)',
    });
    setShowDemoModal(true);
  };

  const handleCreateDemo = (e) => {
    e.preventDefault();
    const name = demoForm.name.trim();
    const email = demoForm.email.trim().toLowerCase();
    const password = demoForm.password.trim();

    if (!name || !email) {
      setDemoFormError('Ingresa el nombre del cliente y su correo.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setDemoFormError('El correo ingresado no es válido.');
      return;
    }
    if (password && password.length < 6) {
      setDemoFormError('La contraseña demo debe tener al menos 6 caracteres.');
      return;
    }
    if (users.some((u) => (u.email || '').toLowerCase() === email)) {
      setDemoFormError('Ya existe una cuenta registrada con este correo.');
      return;
    }

    const parsedExpiry = demoForm.expiresAt
      ? new Date(demoForm.expiresAt)
      : new Date(Date.now() + 7 * 86400000);
    const isoExpiry = Number.isNaN(parsedExpiry.getTime())
      ? new Date(Date.now() + 7 * 86400000).toISOString()
      : parsedExpiry.toISOString();

    const createdDemo = {
      id: `usr-demo-${Date.now().toString(36)}`,
      name: `${name} (DEMO)`,
      email,
      passwordPlain: password || 'Demo#2026',
      role: 'member',
      accountType: 'instructor',
      isDemo: true, // Flag fundamental para bloquear edición, subidas y visualización de resultados reales
      status: 'active',
      planId: 'plan-demo-visualizacion',
      planName: 'DEMO SOLO VISUALIZACIÓN',
      deviceLimit: 1,
      deviceCount: 0,
      originalityApproved: false,
      expiresAt: isoExpiry,
      lastLogin: null,
      feedbackAccess: {
        enabled: true,
        mode: 'view_only',
        reportKinds: ['similarity'],
        canSubmit: false, // NO PUEDE ENVIAR ARCHIVOS
      },
      daily: {
        configuredLimit: 0,
        limit: 0,
        unlimited: false,
        reserved: 0,
        consumed: 0,
        remaining: 0,
      },
      sellerEmail: user?.email || 'fabianrayasaravia@gmail.com',
      sellerName: user?.name || 'Soluciones Académicas',
      createdByAdminId: user?.id,
      notes: demoForm.notes || 'Cuenta demo para explorar la plataforma (solo visualización)',
    };

    setUsers((prev) => [createdDemo, ...prev]);
    setShowDemoModal(false);
    showNotification(
      `Cuenta DEMO creada para ${name} · Clave: ${createdDemo.passwordPlain} (Solo visualización)`
    );
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;
    const chosenPlan = plans.find((p) => p.id === newUserForm.planId) || plans[0];
    const svcType = chosenPlan.serviceType || newUserForm.serviceType || 'feedback';
    const acctType =
      chosenPlan.accountType ||
      (chosenPlan.modality === 'student' ? 'student' : 'instructor');
    const isUnlimited =
      svcType === 'originality' || chosenPlan.feedbackPolicy?.mode === 'unlimited';
    const reportKinds =
      acctType === 'student' ? ['similarity'] : ['ai', 'similarity'];
    const parsedExpiry = newUserForm.expiresAt
      ? new Date(newUserForm.expiresAt)
      : new Date(Date.now() + 30 * 86400000);
    const expiresIso = Number.isNaN(parsedExpiry.getTime())
      ? new Date(Date.now() + 30 * 86400000).toISOString()
      : parsedExpiry.toISOString();

    const created = {
      id: `usr-${Date.now()}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      role: 'member',
      status: 'active',
      accountType: acctType,
      reportKinds,
      serviceType: svcType,
      planId: chosenPlan.id,
      planName: chosenPlan.name,
      deviceLimit: Number(newUserForm.deviceLimit) || 2,
      deviceCount: 0,
      originalityApproved: isUnlimited,
      unlimitedOriginality: isUnlimited,
      expiresAt: expiresIso,
      lastLogin: null,
      pendingReports: 0,
      daily: isUnlimited
        ? {
            configuredLimit: null,
            limit: null,
            unlimited: true,
            reserved: 0,
            consumed: 0,
            remaining: null,
          }
        : {
            configuredLimit: 7,
            limit: 7,
            unlimited: false,
            reserved: 0,
            consumed: 0,
            remaining: 7,
          },
      sellerEmail: user?.email || 'fabianrayasaravia@gmail.com',
      sellerName: user?.name || 'Soluciones Académicas',
      createdByAdminId: user?.id || SEED_ADMIN_USER.id,
      sellerWhatsapp: newUserForm.sellerWhatsapp,
    };
    setUsers((prev) => [created, ...prev]);
    setUserFilter('all');
    setUserSearch('');
    setActiveTab('users');
    setShowNewUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      serviceType: 'feedback',
      planId: SEED_PLANS[0].id,
      deviceLimit: 2,
      expiresAt: toDateTimeLocalValue(new Date(Date.now() + 30 * 86400000)),
      sellerWhatsapp: '+51987654321',
    });
    showNotification(
      `Cuenta ${chosenPlan.name} (${
        acctType === 'student' ? 'Solo Similitud' : 'Similitud + IA'
      } · ${isUnlimited ? 'Reportes ilimitados' : '7 reportes al día'}) creada para ${
        created.name
      } por ${user?.name || 'Admin'}.`
    );
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
    if (user?.isDemo) {
      showNotification(
        '🔒 Modo Demo: el chat interactivo de Todas las IA está bloqueado. Es solo para visualización del catálogo.'
      );
      return;
    }
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
    if (user?.isDemo) {
      showNotification(
        '🔒 Modo Demo: el motor de parafraseo de QuillBot está inactivo para cuentas demo (solo lectura).'
      );
      return;
    }
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

  const isAdminView = viewMode === 'admin';
  const isUltraAdmin =
    isAdminView &&
    (user?.adminRole === 'ultra_admin' ||
      user?.email === 'fabianrayasaravia@gmail.com');
  const isSuperAdmin = isAdminView && user?.adminRole === 'super_admin';
  const isReportAdmin = isAdminView && user?.adminRole === 'report_admin';

  // Admin Reportes (report_admin) solo ve las cuentas oficiales que él mismo vende/crea
  // Las cuentas DEMO quedan aisladas en su propia sección para que los admin de reportes NO se confundan
  const visibleUsers = useMemo(() => {
    if (isReportAdmin) {
      return users.filter(
        (u) =>
          u.role !== 'admin' &&
          !u.isDemo && // Se ocultan cuentas demo a los vendedores
          ((u.sellerEmail || '').toLowerCase() === (user?.email || '').toLowerCase() ||
            u.createdByAdminId === user?.id ||
            u.createdById === user?.id)
      );
    }
    return users;
  }, [users, isReportAdmin, user]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (jobKindFilter === 'similarity' && !(j.kinds || []).includes('similarity')) return false;
      if (jobKindFilter === 'ai' && !(j.kinds || []).includes('ai')) return false;
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
    return visibleUsers.filter((u) => {
      if (userFilter === 'active' && u.status !== 'active') return false;
      if (userFilter === 'admins' && u.role !== 'admin') return false;
      if (userFilter === 'expired' && u.status !== 'expired') return false;
      if (userFilter === 'pending_reports' && !hasPendingReports(u)) return false;
      if (userFilter === 'suspended' && u.status !== 'suspended') return false;
      if (userFilter === 'demos' && !u.isDemo) return false;
      if (userFilter !== 'demos' && userFilter !== 'all' && u.isDemo) return false; // Las demos no ensucian activos/vencidos ordinarios
      const q = userSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.planName || '').toLowerCase().includes(q) ||
        (u.sellerName || '').toLowerCase().includes(q)
      );
    });
  }, [visibleUsers, userFilter, userSearch]);

  // Inicio público (Landing page institucional)
  if (showLanding) {
    return (
      <Landing
        currentUser={user}
        onLogin={() => {
          setShowLanding(false);
          window.scrollTo(0, 0);
        }}
        onTryDemo={() => {
          const demoAccount = {
            id: 'demo-public-visitor',
            name: 'Cliente Demo (Prospecto)',
            email: 'demo@turnitinpe.com',
            passwordPlain: 'Demo#2026',
            role: 'member',
            accountType: 'instructor',
            isDemo: true,
            status: 'active',
            planName: 'DEMO SOLO VISUALIZACIÓN',
            deviceLimit: 1,
            deviceCount: 0,
            daily: { limit: 2, used: 0, remaining: 2, reserved: 0 },
            feedbackAccess: {
              enabled: true,
              mode: 'view_only',
              reportKinds: ['similarity', 'ai'],
              canSubmit: false,
            },
          };
          setUser(demoAccount);
          setViewMode('member');
          setShowLanding(false);
          window.scrollTo(0, 0);
          showNotification(
            '¡Bienvenido al Modo Demo de TurnitinPE! Puedes explorar la interfaz y el visor de informes.'
          );
        }}
        onReturnToPlatform={() => {
          setShowLanding(false);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

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
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                type="button"
                className="button button-secondary button-sm"
                onClick={() => setShowLanding(true)}
              >
                ← Volver al inicio
              </button>
              <button className="sidebar-icon-btn" onClick={toggleTheme} title="Cambiar tema">
                {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
              </button>
            </div>
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
            <span>Procesamiento Sin Depósito (No Repository)</span>
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
                <span>3 Credenciales de Administrador y Cuentas Cliente</span>
              </div>
              <div className="demo-accounts-buttons" style={{ gridTemplateColumns: '1fr' }}>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => {
                    setUser(SEED_ADMIN_USER);
                    setViewMode('admin');
                    setLoginEmail(SEED_ADMIN_USER.email);
                    setLoginPassword(SEED_ADMIN_USER.passwordPlain);
                    showNotification(
                      'Sesión iniciada como ULTRA ADMIN (Único que puede eliminar cuentas vencidas y con reportes pendientes)'
                    );
                  }}
                >
                  <strong>1. Ultra Admin — {SEED_ADMIN_USER.email} / {SEED_ADMIN_USER.passwordPlain}</strong>
                  <span>Control total · Único que puede eliminar cuentas vencidas y con reportes pendientes</span>
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => {
                    setUser(SEED_SUPER_ADMIN_USER);
                    setViewMode('admin');
                    setLoginEmail(SEED_SUPER_ADMIN_USER.email);
                    setLoginPassword(SEED_SUPER_ADMIN_USER.passwordPlain);
                    showNotification(
                      'Sesión iniciada como SUPER ADMIN (Gestiona clientes y cuotas, sin permiso para eliminar cuentas)'
                    );
                  }}
                >
                  <strong>2. Super Admin — {SEED_SUPER_ADMIN_USER.email} / {SEED_SUPER_ADMIN_USER.passwordPlain}</strong>
                  <span>Ve y gestiona todas las cuentas y planes · No puede eliminar cuentas</span>
                </button>
                <button
                  type="button"
                  className="demo-btn"
                  onClick={() => {
                    setUser(SEED_REPORT_ADMIN_USER);
                    setViewMode('admin');
                    setLoginEmail(SEED_REPORT_ADMIN_USER.email);
                    setLoginPassword(SEED_REPORT_ADMIN_USER.passwordPlain);
                    showNotification(
                      'Sesión iniciada como ADMIN REPORTES (Solo crea y ve las cuentas que él mismo vende)'
                    );
                  }}
                >
                  <strong>3. Admin Reportes — {SEED_REPORT_ADMIN_USER.email} / {SEED_REPORT_ADMIN_USER.passwordPlain}</strong>
                  <span>Solo crea y ve las cuentas que él vende · No puede eliminar cuentas</span>
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => {
                      const client = SEED_USERS[3];
                      setUser(client);
                      setViewMode('member');
                      setActiveTab('turnitin2');
                      showNotification(`Vista Instructor (Asesor): ${client.name}`);
                    }}
                  >
                    <strong>Instructor</strong>
                    <span>Similitud + IA</span>
                  </button>
                  <button
                    type="button"
                    className="demo-btn"
                    onClick={() => {
                      const stud = SEED_USERS[8];
                      setUser(stud);
                      setViewMode('student');
                      setActiveTab('turnitin2');
                      showNotification(`Vista Estudiante: ${stud.name}`);
                    }}
                  >
                    <strong>Estudiante</strong>
                    <span>Solo Similitud</span>
                  </button>
                  <button
                    type="button"
                    className="demo-btn"
                    style={{
                      borderColor: 'rgba(217, 119, 6, 0.45)',
                      background: 'rgba(217, 119, 6, 0.08)',
                    }}
                    onClick={() => {
                      const demoUser = {
                        id: 'usr-demo-invitado',
                        name: 'Cliente Invitado (DEMO)',
                        email: 'demo@turnitinpe.com',
                        passwordPlain: 'Demo#2026',
                        role: 'member',
                        accountType: 'instructor',
                        isDemo: true,
                        status: 'active',
                        planName: 'DEMO SOLO VISUALIZACIÓN',
                        deviceLimit: 1,
                        deviceCount: 0,
                        feedbackAccess: { enabled: true, mode: 'view_only', reportKinds: ['similarity'], canSubmit: false },
                        daily: { limit: 0, remaining: 0 },
                      };
                      setUser(demoUser);
                      setViewMode('member');
                      setActiveTab('overview');
                      showNotification('🔒 Iniciada sesión como Cliente Demo (Solo visualización)');
                    }}
                  >
                    <strong style={{ color: 'var(--amber)' }}>Cliente Demo</strong>
                    <span>Solo Visualización</span>
                  </button>
                </div>
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

  const isStudentAccount =
    viewMode === 'student' ||
    (!isAdminView &&
      (user?.accountType === 'student' ||
        (user?.planName || '').toUpperCase().includes('ESTUDIANTE')));

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
          proBadge: isStudentAccount ? 'Similitud' : 'IA + Sim',
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
        { id: 'quillbot', label: 'QuillBot', icon: QuillbotIcon },
        ...(!isStudentAccount
          ? [{ id: 'nvidia', label: 'Todas las IA', icon: Sparkles }]
          : []),
      ],
    },
    ...(isAdminView
      ? [
          {
            label: 'ADMINISTRACIÓN DEL ESPACIO',
            items: [
              { id: 'users', label: 'Usuarios', icon: Users, badge: String(visibleUsers.length) },
              { id: 'plans', label: 'Planes y precios', icon: CreditCard },
              ...(!isReportAdmin
                ? [
                    {
                      id: 'turnitin-settings',
                      label: 'Configuración de Turnitin',
                      icon: Settings,
                    },
                  ]
                : []),
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
      title: isStudentAccount
        ? 'Turnitin Feedback · Reporte de Similitud'
        : 'Turnitin Feedback · Detección de IA y Similitud',
      subtitle: isStudentAccount
        ? 'Prepara una nueva solicitud de análisis en PDF (7 reportes al día) y descarga tu informe oficial de Similitud sin depósito.'
        : 'Prepara una nueva solicitud de análisis en PDF (7 reportes al día) y descarga tus informes oficiales de IA y Similitud sin depósito.',
    },
    documents: {
      eyebrow: 'DOCUMENTOS PRIVADOS',
      title: 'Turnitin Originality · Tus archivos en un lugar',
      subtitle: isStudentAccount
        ? 'Analiza documentos PDF con reportes ilimitados de Similitud sin indexación en repositorio.'
        : 'Analiza documentos PDF con reportes ilimitados de IA y Similitud sin indexación en repositorio.',
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
      eyebrow: isReportAdmin
        ? 'MIS VENTAS · CUENTAS QUE YO VENDO'
        : isSuperAdmin
        ? 'SUPER ADMIN · GESTIÓN DE CLIENTES'
        : 'ULTRA ADMIN · CONTROL TOTAL DE CUENTAS',
      title: 'Personas con acceso.',
      subtitle: isUltraAdmin
        ? 'Ultra Admin: único autorizado para eliminar cuentas vencidas y eliminar cuentas con reportes pendientes.'
        : isReportAdmin
        ? 'Admin Reportes: solo puedes crear y gestionar las cuentas que tú vendes (sin permiso para eliminar cuentas).'
        : 'Super Admin: puedes crear y gestionar todas las cuentas de clientes (solo Ultra Admin puede eliminar cuentas).',
    },
    plans: {
      eyebrow: 'CATÁLOGO COMERCIAL',
      title: 'Planes y precios.',
      subtitle:
        'Instructor Básico S/ 80 (7/día · Similitud+IA) · Instructor Ilimitado S/ 200 (Ilimitado · Similitud+IA) · Estudiante Básico S/ 50 (7/día · Similitud) · Estudiante Ilimitado S/ 100 (Ilimitado · Similitud).',
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
        'Consulta los reportes consumidos hoy por cada cliente (7/día en Básico e Ilimitados en Originality).',
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
        'Consulta las sesiones iniciadas, los trabajos procesados y los movimientos administrativos.',
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
            className={`role-switch-btn ${viewMode === 'admin' ? 'active' : ''}`}
            onClick={() => {
              if (user?.role !== 'admin') {
                setUser(SEED_ADMIN_USER);
              }
              setViewMode('admin');
            }}
            title="Vista Administrador"
          >
            <ShieldCheck size={13} /> Admin
          </button>
          <button
            type="button"
            className={`role-switch-btn ${viewMode === 'member' ? 'active' : ''}`}
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
            title="Vista Instructor (Asesor): Muestra Similitud + IA"
          >
            <FileCheck2 size={13} /> Instructor
          </button>
          <button
            type="button"
            className={`role-switch-btn ${viewMode === 'student' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('student');
              if (
                [
                  'users',
                  'plans',
                  'daily-limits',
                  'turnitin-settings',
                  'client-uploads',
                  'activity',
                  'nvidia',
                ].includes(activeTab)
              ) {
                setActiveTab('turnitin2');
              }
            }}
            title="Vista Estudiante: Solo muestra Similitud"
          >
            <FileText size={13} /> Estudiante
          </button>
        </div>

        {/* Selector de las 3 Credenciales de Administrador */}
        {isAdminView && (
          <div
            style={{
              margin: '0 14px 10px',
              padding: '8px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.65)',
                padding: '0 4px',
              }}
            >
              Credencial Admin Activa:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              <button
                type="button"
                className={`role-switch-btn ${isUltraAdmin ? 'active' : ''}`}
                style={{ fontSize: 10.5, padding: '5px 4px' }}
                onClick={() => {
                  setUser(SEED_ADMIN_USER);
                  setViewMode('admin');
                  showNotification(
                    'Credencial activa: ULTRA ADMIN (Único que elimina cuentas vencidas y con reportes pendientes)'
                  );
                }}
                title={`${SEED_ADMIN_USER.email} / ${SEED_ADMIN_USER.passwordPlain}`}
              >
                Ultra Admin
              </button>
              <button
                type="button"
                className={`role-switch-btn ${isSuperAdmin ? 'active' : ''}`}
                style={{ fontSize: 10.5, padding: '5px 4px' }}
                onClick={() => {
                  setUser(SEED_SUPER_ADMIN_USER);
                  setViewMode('admin');
                  showNotification(
                    'Credencial activa: SUPER ADMIN (Sin permiso para eliminar cuentas)'
                  );
                }}
                title={`${SEED_SUPER_ADMIN_USER.email} / ${SEED_SUPER_ADMIN_USER.passwordPlain}`}
              >
                Super Admin
              </button>
              <button
                type="button"
                className={`role-switch-btn ${isReportAdmin ? 'active' : ''}`}
                style={{ fontSize: 10.5, padding: '5px 4px' }}
                onClick={() => {
                  setUser(SEED_REPORT_ADMIN_USER);
                  setViewMode('admin');
                  if (activeTab === 'turnitin-settings') setActiveTab('users');
                  showNotification(
                    'Credencial activa: ADMIN REPORTES (Solo ve y crea las cuentas que él vende)'
                  );
                }}
                title={`${SEED_REPORT_ADMIN_USER.email} / ${SEED_REPORT_ADMIN_USER.passwordPlain}`}
              >
                Admin Reportes
              </button>
            </div>
          </div>
        )}

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
          <div className="sidebar-profile-row">
            <button
              type="button"
              className="sidebar-profile-btn"
              onClick={() => setActiveTab('overview')}
            >
              <span className="avatar avatar-sm">{getInitials(user.name)}</span>
              <span className="sidebar-profile-info">
                <strong>{user.name}</strong>
                <small>
                  {isAdminView
                    ? isUltraAdmin
                      ? 'ULTRA ADMIN (Elimina cuentas)'
                      : isSuperAdmin
                      ? 'SUPER ADMIN (Gestión general)'
                      : 'ADMIN REPORTES'
                    : user.planName || 'INSTRUCTOR BÁSICO (7 / DÍA)'}
                </small>
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
            {isAdminView && (
              <button
                type="button"
                className="button button-emerald button-sm"
                onClick={() => {
                  setNewUserForm((prev) => ({
                    ...prev,
                    expiresAt:
                      prev.expiresAt ||
                      toDateTimeLocalValue(new Date(Date.now() + 30 * 86400000)),
                  }));
                  setShowNewUserModal(true);
                }}
              >
                <Plus size={14} /> Crear cuenta
              </button>
            )}
            <span className="quota-chip">
              <ShieldCheck size={14} style={{ color: 'var(--emerald)' }} />
              Sin Depósito (No Repository)
            </span>
            <span className="quota-chip">
              <FileCheck2 size={14} style={{ color: 'var(--brand-primary)' }} />
              {activeTab === 'documents' || user.serviceType === 'originality'
                ? 'Turnitin Originality: Reportes Ilimitados'
                : isAdminView
                ? 'Feedback: 7/día · Originality: Ilimitado'
                : `Turnitin Feedback: ${user.daily?.remaining ?? 7} / 7 reportes hoy`}
            </span>
            <button
              type="button"
              className="button button-primary button-sm"
              onClick={() => setActiveTab('turnitin2')}
            >
              <Upload size={14} /> Subir Documento PDF
            </button>
            <button
              type="button"
              className="button button-secondary button-sm"
              onClick={() => {
                setShowLanding(true);
                window.scrollTo(0, 0);
              }}
              title="Ver la página de inicio institucional"
            >
              <Globe size={14} /> Ver Sitio Web
            </button>
          </div>
        </header>

        <main className="main-content">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <span className="page-eyebrow">{pageMeta.eyebrow}</span>
              <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {activeTab === 'quillbot' && <QuillbotIcon size={28} />}
                <span>{pageMeta.title}</span>
              </h1>
              <p>{pageMeta.subtitle}</p>
            </div>
            <div className="page-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {activeTab === 'users' && isUltraAdmin && (
                <>
                  <button
                    type="button"
                    className="button button-secondary"
                    style={{
                      color: 'var(--crimson)',
                      borderColor: 'rgba(225, 29, 72, 0.35)',
                    }}
                    onClick={() => {
                      const expiredList = users.filter(
                        (u) => u.role !== 'admin' && u.status === 'expired'
                      );
                      if (expiredList.length === 0) {
                        showNotification('No hay cuentas vencidas para eliminar.');
                        return;
                      }
                      setUsers((prev) =>
                        prev.filter((u) => u.role === 'admin' || u.status !== 'expired')
                      );
                      showNotification(
                        `Ultra Admin eliminó ${expiredList.length} cuenta(s) vencida(s) (${expiredList
                          .map((x) => x.name)
                          .join(', ')}).`
                      );
                    }}
                  >
                    <Trash2 size={15} /> Eliminar cuentas vencidas (
                    {users.filter((u) => u.role !== 'admin' && u.status === 'expired').length})
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    style={{
                      color: 'var(--crimson)',
                      borderColor: 'rgba(225, 29, 72, 0.35)',
                    }}
                    onClick={() => {
                      const pendingList = users.filter(
                        (u) =>
                          u.role !== 'admin' &&
                          ((u.pendingReports || 0) > 0 || (u.daily?.reserved || 0) > 0)
                      );
                      if (pendingList.length === 0) {
                        showNotification(
                          'No hay cuentas con reportes pendientes en cola para eliminar.'
                        );
                        return;
                      }
                      setUsers((prev) =>
                        prev.filter(
                          (u) =>
                            u.role === 'admin' ||
                            ((u.pendingReports || 0) === 0 && (u.daily?.reserved || 0) === 0)
                        )
                      );
                      showNotification(
                        `Ultra Admin eliminó ${pendingList.length} cuenta(s) con reportes pendientes (${pendingList
                          .map((x) => x.name)
                          .join(', ')}).`
                      );
                    }}
                  >
                    <Trash2 size={15} /> Eliminar cuentas con reportes pendientes (
                    {
                      users.filter(
                        (u) =>
                          u.role !== 'admin' &&
                          ((u.pendingReports || 0) > 0 || (u.daily?.reserved || 0) > 0)
                      ).length
                    }
                    )
                  </button>
                </>
              )}
              {activeTab === 'users' && (isUltraAdmin || isSuperAdmin) && (
                <>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={openNewAdminModal}
                  >
                    <ShieldCheck size={16} /> Crear Admin Reportes
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    style={{
                      borderColor: 'rgba(217, 119, 6, 0.45)',
                      color: 'var(--amber)',
                      background: 'rgba(217, 119, 6, 0.08)',
                    }}
                    onClick={openNewDemoModal}
                    title="Crear cuenta demo de solo visualización para clientes interesados"
                  >
                    <Sparkles size={16} /> Crear Demo
                  </button>
                </>
              )}
              {activeTab === 'users' && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    setNewUserForm((prev) => ({
                      ...prev,
                      expiresAt:
                        prev.expiresAt ||
                        toDateTimeLocalValue(new Date(Date.now() + 30 * 86400000)),
                    }));
                    setShowNewUserModal(true);
                  }}
                >
                  <Plus size={16} /> Crear cuenta
                </button>
              )}
              {activeTab === 'plans' && !isReportAdmin && (
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
              {user?.isDemo && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    marginBottom: 16,
                    background: 'rgba(217, 119, 6, 0.12)',
                    border: '1px solid rgba(217, 119, 6, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Sparkles size={24} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ color: 'var(--amber)', fontSize: 13.5 }}>
                      MODO DEMO ACTIVO (SOLO VISUALIZACIÓN)
                    </strong>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                      Esta cuenta demo te permite explorar toda la interfaz, menús y funciones de la plataforma. Para mantener la confidencialidad, no es posible redactar, descargar informes ni consultar porcentajes reales de documentos subidos. Contacta a tu asesor para activar tu cuenta oficial.
                    </p>
                  </div>
                </div>
              )}

              {/* Executive Hero Banner */}
              <section className="executive-hero-banner">
                <div>
                  <div className="hero-badge-row">
                    <span className="hero-live-pill">
                      <span className="pulse-dot" /> Servicio Activo · Recepción Inmediata
                    </span>
                    <span className="hero-meta-pill">
                      <ShieldCheck size={13} /> Sin Depósito (No Repository)
                    </span>
                    <span className="hero-meta-pill">
                      Zona Horaria: America/Lima (UTC-5)
                    </span>
                  </div>
                  <h2>
                    Plataforma Oficial de Reportes de IA y Similitud Turnitin
                  </h2>
                  <p>
                    Cuentas de <strong>Turnitin Feedback con 7 reportes al día</strong> y cuentas de{' '}
                    <strong>Turnitin Originality con reportes ilimitados</strong>. Entrega simultánea
                    de <strong>Similitud (sim-*.pdf)</strong> y <strong>Escritura con IA (ai-*.pdf)</strong>.
                  </p>
                  <div className="hero-cta-row">
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => setActiveTab('turnitin2')}
                    >
                      <Upload size={15} /> Turnitin Feedback (7 reportes/día)
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.2)',
                      }}
                      onClick={() => setActiveTab('documents')}
                    >
                      <FolderLock size={15} /> Turnitin Originality (Ilimitado)
                    </button>
                  </div>
                </div>

                <div className="hero-telemetry-box">
                  <div className="hero-telemetry-row">
                    <span>Turnitin Feedback</span>
                    <strong style={{ color: '#6ee7b7' }}>7 reportes PDF al día</strong>
                  </div>
                  <div className="hero-telemetry-row">
                    <span>Turnitin Originality</span>
                    <strong style={{ color: '#38bdf8' }}>Reportes PDF ilimitados</strong>
                  </div>
                  <div className="hero-telemetry-row">
                    <span>Tamaño máximo por PDF</span>
                    <strong>100 MB (Bloques de 1 MB)</strong>
                  </div>
                  <div className="hero-telemetry-row">
                    <span>Reinicio de cuota diaria</span>
                    <strong>00:00 PET (Hora en Lima)</strong>
                  </div>
                </div>
              </section>

              {/* Tarjetas de métricas operativas: ocultas completamente para los clientes */}
              {isAdminView && (
                <div className="metrics-grid">
                  <article className="metric-card">
                    <div className="metric-top">
                      <span>Personas en el espacio</span>
                      <span className="metric-icon metric-blue">
                        <Users size={18} />
                      </span>
                    </div>
                    <div className="metric-value">{users.length}</div>
                    <span className="metric-note">Cuentas registradas en turnitinpe</span>
                  </article>

                  <article className="metric-card">
                    <div className="metric-top">
                      <span>Accesos activos</span>
                      <span className="metric-icon metric-emerald">
                        <CheckCircle2 size={18} />
                      </span>
                    </div>
                    <div className="metric-value">
                      {users.filter((u) => u.status === 'active').length}
                    </div>
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
                      <span>Planes activos</span>
                      <span className="metric-icon metric-blue">
                        <ShieldCheck size={18} />
                      </span>
                    </div>
                    <div className="metric-value">7/día · ∞</div>
                    <span className="metric-note">Instructor Básico (7/día) · Originality (∞)</span>
                  </article>
                </div>
              )}

              <div className="overview-grid">
                {/* Latest Reports */}
                <section className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>
                        {isAdminView
                          ? 'Últimos Reportes de IA y Similitud'
                          : isStudentAccount
                          ? 'Mis Últimos Reportes de Similitud'
                          : 'Mis Últimos Reportes de IA y Similitud'}
                      </h2>
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
                          <th>Similitud (sim-*.pdf)</th>
                          {!isStudentAccount && <th>Detección IA (ai-*.pdf)</th>}
                          <th>Informes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.slice(0, 5).map((job) => {
                          const aiFailed = job.reportStates?.ai?.state === 'failed';
                          return (
                            <tr key={job.id}>
                              <td>
                                <span className="code-chip">#{job.displayCode}</span>
                              </td>
                              <td>
                                <div className="person-meta">
                                  <strong>{job.name}</strong>
                                  {isAdminView && <span>Cliente: {job.ownerName}</span>}
                                </div>
                              </td>
                              <td>
                                {job.isDemoFile || job.state === 'demo_locked' ? (
                                  <span className="status-pill status-amber">
                                    🔒 Similitud Protegida
                                  </span>
                                ) : (
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
                                )}
                              </td>
                              {!isStudentAccount && (
                                <td>
                                  {job.isDemoFile || job.state === 'demo_locked' ? (
                                    <span className="status-pill status-amber">
                                      🔒 IA Protegida
                                    </span>
                                  ) : aiFailed ? (
                                    <button
                                      type="button"
                                      className="status-pill status-crimson"
                                      onClick={() => handleRetryAiReport(job.id)}
                                      title="Reintentar generación de PDF de IA"
                                    >
                                      <RefreshCw size={11} /> Error IA · Reintentar
                                    </button>
                                  ) : (
                                    <span
                                      className={`status-pill ${
                                        job.aiScore <= 10 ? 'status-blue' : 'status-amber'
                                      }`}
                                    >
                                      {job.aiScore}% IA
                                    </span>
                                  )}
                                </td>
                              )}
                              <td>
                                <button
                                  type="button"
                                  className="button button-secondary button-sm"
                                  onClick={() => {
                                    if (user?.isDemo || job.isDemoFile || job.state === 'demo_locked') {
                                      showNotification(
                                        '🔒 Modo Demo: el detalle completo del informe está protegido. Solo se muestra la estructura visual.'
                                      );
                                    }
                                    setSelectedJobForReport(job);
                                  }}
                                >
                                  <Eye size={13} /> Ver Reporte
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Distribution & Services Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {isAdminView && (
                    <section className="panel">
                      <div className="panel-header" style={{ marginBottom: 8 }}>
                        <div>
                          <h2>Distribución de Reportes Recientes</h2>
                          <p>Métricas en tiempo real de Similitud y Escritura con IA</p>
                        </div>
                      </div>
                      <div className="dist-bar-group">
                        <div className="dist-bar-item">
                          <div className="dist-bar-label">
                            <span>Baja Similitud (≤ 15% · Apto sustentación)</span>
                            <strong>
                              {Math.round(
                                (jobs.filter((j) => j.similarityScore <= 15).length / jobs.length) *
                                  100
                              )}
                              %
                            </strong>
                          </div>
                          <div className="dist-bar-track">
                            <div
                              className="dist-bar-fill"
                              style={{
                                width: `${Math.round(
                                  (jobs.filter((j) => j.similarityScore <= 15).length /
                                    jobs.length) *
                                    100
                                )}%`,
                                background: 'var(--emerald)',
                              }}
                            />
                          </div>
                        </div>

                        <div className="dist-bar-item">
                          <div className="dist-bar-label">
                            <span>Similitud Moderada / Por revisar (&gt; 15%)</span>
                            <strong>
                              {Math.round(
                                (jobs.filter((j) => j.similarityScore > 15).length / jobs.length) *
                                  100
                              )}
                              %
                            </strong>
                          </div>
                          <div className="dist-bar-track">
                            <div
                              className="dist-bar-fill"
                              style={{
                                width: `${Math.round(
                                  (jobs.filter((j) => j.similarityScore > 15).length /
                                    jobs.length) *
                                    100
                                )}%`,
                                background: 'var(--amber)',
                              }}
                            />
                          </div>
                        </div>

                        <div className="dist-bar-item">
                          <div className="dist-bar-label">
                            <span>Escritura Humana Verificada (0% – 10% IA)</span>
                            <strong>
                              {Math.round(
                                (jobs.filter(
                                  (j) => j.reportStates?.ai?.state !== 'failed' && j.aiScore <= 10
                                ).length /
                                  jobs.length) *
                                  100
                              )}
                              %
                            </strong>
                          </div>
                          <div className="dist-bar-track">
                            <div
                              className="dist-bar-fill"
                              style={{
                                width: `${Math.round(
                                  (jobs.filter(
                                    (j) => j.reportStates?.ai?.state !== 'failed' && j.aiScore <= 10
                                  ).length /
                                    jobs.length) *
                                    100
                                )}%`,
                                background: 'var(--brand-primary)',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  <section className="panel">
                    <div className="panel-header">
                      <div>
                        <h2>Servicios del Espacio</h2>
                        <p>Herramientas conectadas en tu dashboard</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {SEED_SERVICES.filter((svc) =>
                        isStudentAccount ? svc.id !== 'nvidia' : true
                      ).map((svc) => (
                        <div
                          key={svc.id}
                          style={{
                            padding: 12,
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
                              {svc.id === 'quillbot' && <QuillbotIcon size={20} />}
                              <strong>{svc.name}</strong>
                              <span className="status-pill status-emerald">Recepción activa</span>
                            </div>
                            <p
                              style={{
                                fontSize: 12,
                                color: 'var(--text-secondary)',
                                marginTop: 2,
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
              </div>
            </>
          )}

          {/* ==========================================
              TAB 2 & 3: TURNITIN FEEDBACK & ORIGINALITY (EXACT CLIENT VIEW)
             ========================================== */}
          {(activeTab === 'turnitin2' || activeTab === 'documents') && (
            <>
              {/* Plan Summary Bar (Matches turnitinpe.com t2-summary) */}
              <div className="bs-summary-alert">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="metric-icon metric-blue">
                    <FileText size={18} />
                  </span>
                  <div>
                    <small
                      style={{
                        display: 'block',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {isStudentAccount
                        ? 'Tu plan (Cuenta Estudiante · Solo Similitud)'
                        : 'Tu plan (Cuenta Instructor / Asesor · Similitud + IA)'}
                    </small>
                    <strong style={{ fontSize: 14.5 }}>
                      {activeTab === 'documents'
                        ? `Turnitin Originality · Reportes ilimitados habilitados (${
                            isStudentAccount ? 'Solo Similitud' : 'Similitud + IA'
                          })`
                        : `${
                            user.daily?.remaining ?? 7
                          } de 7 reportes disponibles hoy · Turnitin Feedback (7 reportes al día · ${
                            isStudentAccount ? 'Solo Similitud' : 'Similitud + IA'
                          })`}
                    </strong>
                  </div>
                </div>
                <span className="status-pill status-emerald">
                  <span className="pulse-dot" style={{ width: 7, height: 7 }} /> Servicio disponible
                </span>
              </div>

              {/* Upload Card (Subir documento - Exact fields from turnitinpe.com) */}
              <section className="panel">
                <div className="panel-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="metric-icon metric-blue">
                      <Upload size={18} />
                    </span>
                    <div>
                      <h2>Subir documento</h2>
                      <p>Prepara una nueva solicitud de análisis.</p>
                    </div>
                  </div>
                  <span className="code-chip">
                    {activeTab === 'documents'
                      ? `Reportes ilimitados · ${
                          isStudentAccount ? 'Solo Similitud' : 'Incluye Similitud + IA'
                        }`
                      : `7 reportes al día · ${
                          isStudentAccount ? 'Solo Similitud' : 'Incluye Similitud + IA'
                        }`}
                  </span>
                </div>

                <form
                  onSubmit={handleFileUploadSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setUploadFileName(file.name);
                    }}
                  />

                  <div
                    className="dropzone bs-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="dropzone-icon">
                      <Upload size={26} />
                    </div>
                    <strong style={{ fontSize: 15.5, display: 'block', marginTop: 4 }}>
                      {uploadFileName ? uploadFileName : 'Arrastra tu archivo aquí'}
                    </strong>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      o selecciona un archivo desde tu equipo
                    </span>
                    <div style={{ marginTop: 8 }}>
                      <span className="button button-secondary button-sm">
                        Seleccionar archivos
                      </span>
                    </div>
                    <small
                      style={{
                        display: 'block',
                        marginTop: 6,
                        fontSize: 12,
                        color: 'var(--text-muted)',
                      }}
                    >
                      PDF · Máximo 100 MB por archivo
                    </small>
                  </div>

                  {/* Exact fields: Título, Autor, Tipo de informe */}
                  <div className="bs-fields-grid">
                    <label className="field">
                      Título
                      <input
                        type="text"
                        value={uploadFileName}
                        onChange={(e) => setUploadFileName(e.target.value)}
                        placeholder="Se obtiene del nombre del archivo"
                      />
                    </label>

                    <label className="field">
                      Autor
                      <input
                        type="text"
                        placeholder="No disponible en este flujo"
                        disabled
                        style={{ opacity: 0.65, cursor: 'not-allowed' }}
                      />
                    </label>

                    <label className="field">
                      Tipo de informe
                      <input
                        type="text"
                        value={isStudentAccount ? 'Solo Similitud (Estudiante)' : 'Similitud + IA (Instructor)'}
                        readOnly
                        disabled
                        style={{
                          fontWeight: 700,
                          color: 'var(--brand-primary)',
                          background: 'var(--brand-primary-soft)',
                          borderColor: 'rgba(29, 78, 216, 0.3)',
                          cursor: 'not-allowed',
                        }}
                      />
                    </label>
                  </div>

                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    El nombre del archivo identifica el documento. Este servicio aún no guarda autor
                    ni título por separado. Solo PDF: hasta 100 MB por archivo y 200 MB por carga.
                  </p>

                  {isUploading && (
                    <div className="pipeline-stepper">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 12.5,
                          fontWeight: 700,
                        }}
                      >
                        <span>
                          {uploadStage === 1
                            ? 'Validando documento…'
                            : 'Subiendo documento 1 de 1…'}
                        </span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="pipeline-progress-track">
                        <div
                          className="pipeline-progress-fill"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button
                      type="submit"
                      className="button button-primary"
                      disabled={isUploading}
                    >
                      <FileCheck2 size={16} />
                      {isUploading ? 'Subiendo documento…' : 'Enviar documento'}
                    </button>
                  </div>
                </form>
              </section>

              {/* SEGUIMIENTO · Mis documentos (Exact table from turnitinpe.com) */}
              <section className="panel">
                <div className="panel-header">
                  <div>
                    <span className="page-eyebrow" style={{ marginBottom: 2 }}>
                      SEGUIMIENTO
                    </span>
                    <h2>Mis documentos</h2>
                    <p>Consulta el estado y descarga tus informes.</p>
                  </div>

                  <div className="toolbar">
                    <button
                      type="button"
                      className="button button-secondary button-sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={14} /> Subir
                    </button>
                    <button
                      type="button"
                      className="button button-secondary button-sm"
                      onClick={() => showNotification('Lista de documentos actualizada.')}
                    >
                      <RefreshCw size={14} /> Actualizar
                    </button>

                    <div className="search-box">
                      <Search size={15} style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={jobSearch}
                        onChange={(e) => setJobSearch(e.target.value)}
                        placeholder="Buscar por código (13912) o documento…"
                      />
                    </div>
                  </div>
                </div>

                {/* Filter tabs: hide IA tab for student accounts */}
                <div className="filter-tabs" style={{ marginBottom: 14, width: 'fit-content' }}>
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'similarity', label: 'Similitud' },
                    ...(!isStudentAccount ? [{ id: 'ai', label: 'IA' }] : []),
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

                <div className="table-wrap">
                  <table className="data-table bs-table-hover">
                    <thead>
                      <tr>
                        <th>Documento</th>
                        {isAdminView && <th>Cliente</th>}
                        <th>Informe</th>
                        <th>Actividad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => {
                        const aiFailed = job.reportStates?.ai?.state === 'failed';
                        return (
                          <tr key={job.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                <FileText
                                  size={18}
                                  style={{
                                    color: 'var(--brand-primary)',
                                    marginTop: 2,
                                    flexShrink: 0,
                                  }}
                                />
                                <div className="person-meta">
                                  <small
                                    style={{
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: 'var(--brand-primary)',
                                    }}
                                  >
                                    Código {job.displayCode}
                                  </small>
                                  <strong>{job.name}</strong>
                                </div>
                              </div>
                            </td>
                            {isAdminView && (
                              <td>
                                <div className="person-meta">
                                  <strong>{job.ownerName}</strong>
                                </div>
                              </td>
                            )}
                            <td>
                              <span className="code-chip">
                                {isStudentAccount ? 'Solo Similitud' : 'Similitud + IA'}
                              </span>
                            </td>
                            <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                              <div>
                                Enviado:{' '}
                                {new Date(job.createdAt).toLocaleString('es-PE', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                                Finalizado:{' '}
                                {new Date(job.completedAt || job.createdAt).toLocaleString(
                                  'es-PE',
                                  {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )}
                              </div>
                            </td>
                            <td>
                              {/* Stacked outcomes: cuentas Demo o archivos demo tienen resultados protegidos (sin ver score) */}
                              {job.isDemoFile || job.state === 'demo_locked' ? (
                                <div className="bs-outcomes-stack">
                                  <div
                                    className="bs-outcome-item"
                                    style={{
                                      background: 'rgba(217, 119, 6, 0.08)',
                                      borderColor: 'rgba(217, 119, 6, 0.35)',
                                      padding: '8px 10px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 4,
                                    }}
                                  >
                                    <span className="status-pill status-amber" style={{ width: 'fit-content' }}>
                                      🔒 Modo Demo · Resultado Protegido
                                    </span>
                                    <small style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                                      El documento fue procesado pero el porcentaje y el PDF están ocultos en esta cuenta demo de visualización.
                                    </small>
                                  </div>
                                </div>
                              ) : (
                                <div className="bs-outcomes-stack">
                                  <div className="bs-outcome-item bs-outcome-ok">
                                    <span className="status-pill status-emerald">
                                      <CheckCircle2 size={12} /> Similitud listo ({job.similarityScore}
                                      %)
                                    </span>
                                    <button
                                      type="button"
                                      className="button button-secondary button-sm"
                                      onClick={() => handleDownloadCertificate(job, 'similarity')}
                                    >
                                      <Download size={13} /> Descargar Similitud
                                    </button>
                                  </div>

                                  {!isStudentAccount &&
                                    (aiFailed ? (
                                      <div className="bs-outcome-item bs-outcome-err">
                                        <div>
                                          <span className="status-pill status-crimson">
                                            Error en IA
                                          </span>
                                          <small
                                            style={{
                                              display: 'block',
                                              fontSize: 11,
                                              color: 'var(--text-secondary)',
                                              marginTop: 2,
                                            }}
                                          >
                                            No se pudo generar este informe. Los demás informes
                                            conservan su estado.
                                          </small>
                                        </div>
                                        <button
                                          type="button"
                                          className="button button-emerald button-sm"
                                          onClick={() => handleRetryAiReport(job.id)}
                                        >
                                          <RefreshCw size={13} /> Reintentar IA
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="bs-outcome-item bs-outcome-ok">
                                        <span className="status-pill status-blue">
                                          <CheckCircle2 size={12} /> IA listo ({job.aiScore}%)
                                        </span>
                                        <button
                                          type="button"
                                          className="button button-secondary button-sm"
                                          onClick={() => handleDownloadCertificate(job, 'ai')}
                                        >
                                          <Download size={13} /> Descargar IA
                                        </button>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  type="button"
                                  className="button button-primary button-sm"
                                  onClick={() => setSelectedJobForReport(job)}
                                >
                                  <Eye size={13} /> Detalle
                                </button>
                                <button
                                  type="button"
                                  className="button button-secondary button-sm"
                                  onClick={() => {
                                    setJobs((prev) => prev.filter((item) => item.id !== job.id));
                                    showNotification(`Documento #${job.displayCode} eliminado.`);
                                  }}
                                >
                                  <Trash2 size={13} /> Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p
                  style={{
                    marginTop: 14,
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: 12,
                  }}
                >
                  Los informes se conservan hasta tu eliminación explícita; plazo mínimo: 7 días.
                </p>
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
                    disabled={!!user?.isDemo}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={
                      user?.isDemo
                        ? '🔒 Modo Demo (solo visualización): no es posible redactar ni enviar consultas en el laboratorio IA.'
                        : 'Pega aquí el fragmento que deseas reformular antes de volver a pasar por Turnitin…'
                    }
                    style={
                      user?.isDemo
                        ? { background: 'var(--bg-card)', cursor: 'not-allowed', opacity: 0.75 }
                        : {}
                    }
                  />
                  <button
                    type="submit"
                    className="button button-primary"
                    disabled={!!user?.isDemo}
                    title={user?.isDemo ? 'Inhabilitado en cuenta demo' : 'Enviar consulta'}
                  >
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <QuillbotIcon size={28} />
                    <div>
                      <h2>QuillBot · Parafraseador de Apoyo</h2>
                      <p>Reformula pasajes con coincidencias antes de generar tu informe definitivo</p>
                    </div>
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
                      value={
                        user?.isDemo
                          ? '🔒 [Modo Demo - Solo Lectura]\nEste texto es un ejemplo precargado. En una cuenta oficial podrás pegar cualquier fragmento para parafrasearlo al instante.'
                          : qbInput
                      }
                      disabled={!!user?.isDemo}
                      onChange={(e) => setQbInput(e.target.value)}
                      style={
                        user?.isDemo
                          ? { background: 'var(--bg-card)', cursor: 'not-allowed', opacity: 0.8 }
                          : {}
                      }
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <QuillbotIcon size={26} />
                    <div>
                      <h2>Acceso Directo QuillBot</h2>
                      <p>QuillBot es gratuito para clientes con cuenta activa</p>
                    </div>
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
            <>
              {/* Tarjeta de las 3 Credenciales de Administrador y Jerarquía de Permisos */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {users
                  .filter((u) => u.role === 'admin' && (!isReportAdmin || u.id === user?.id))
                  .map((cred) => {
                  const isCurrentCred = user?.id === cred.id;
                  return (
                    <div
                      key={cred.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: isCurrentCred
                          ? '2px solid var(--brand-primary)'
                          : '1px solid var(--border-color)',
                        background: isCurrentCred
                          ? 'var(--brand-primary-soft)'
                          : 'var(--bg-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <strong style={{ fontSize: 13 }}>{cred.adminRoleLabel}</strong>
                          <span
                            className={`status-pill ${
                              cred.adminRole === 'ultra_admin'
                                ? 'status-emerald'
                                : cred.adminRole === 'super_admin'
                                ? 'status-blue'
                                : 'status-amber'
                            }`}
                          >
                            {isCurrentCred ? 'En uso' : 'Disponible'}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            fontFamily: 'var(--font-mono)',
                            marginTop: 4,
                            color: 'var(--text-primary)',
                          }}
                        >
                          <div>Correo: {cred.email}</div>
                          <div>Clave: {cred.passwordPlain}</div>
                        </div>
                        <p
                          style={{
                            fontSize: 11.5,
                            color: 'var(--text-secondary)',
                            marginTop: 6,
                          }}
                        >
                          {cred.adminRole === 'ultra_admin'
                            ? 'Control total · Único que puede eliminar cuentas vencidas y eliminar cuentas con reportes pendientes.'
                            : cred.adminRole === 'super_admin'
                            ? 'Ve y gestiona todas las cuentas y cuotas · No puede eliminar cuentas.'
                            : 'Solo crea y ve las cuentas que él mismo vende · No puede eliminar cuentas.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`button button-sm ${
                          isCurrentCred ? 'button-primary' : 'button-secondary'
                        }`}
                        onClick={() => {
                          setUser(cred);
                          setViewMode('admin');
                          showNotification(`Cambiado a credencial: ${cred.adminRoleLabel}`);
                        }}
                      >
                        {isCurrentCred ? 'Credencial Activa' : `Usar ${cred.adminRoleLabel}`}
                      </button>
                    </div>
                  );
                })}
              </div>

              <section className="panel">
                <div className="panel-header">
                  <div className="filter-tabs">
                    {[
                      { id: 'all', label: `Todos (${visibleUsers.length})` },
                      {
                        id: 'active',
                        label: `Activos (${
                          visibleUsers.filter((u) => u.status === 'active').length
                        })`,
                      },
                      {
                        id: 'expired',
                        label: `Vencidos (${
                          visibleUsers.filter((u) => u.status === 'expired').length
                        })`,
                      },
                      {
                        id: 'pending_reports',
                        label: `Con reportes pendientes (${
                          visibleUsers.filter((u) => hasPendingReports(u)).length
                        })`,
                      },
                      ...(!isReportAdmin
                        ? [
                            {
                              id: 'admins',
                              label: `Administradores (${
                                visibleUsers.filter((u) => u.role === 'admin').length
                              })`,
                            },
                            {
                              id: 'demos',
                              label: `Demos (${
                                visibleUsers.filter((u) => u.isDemo).length
                              })`,
                            },
                          ]
                        : []),
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

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="search-box">
                      <Search size={15} style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Buscar cuenta por nombre, correo o vendedor…"
                      />
                    </div>
                    {(isUltraAdmin || isSuperAdmin) && (
                      <>
                        <button
                          type="button"
                          className="button button-secondary button-sm"
                          onClick={openNewAdminModal}
                        >
                          <ShieldCheck size={14} /> Crear Admin Reportes
                        </button>
                        <button
                          type="button"
                          className="button button-secondary button-sm"
                          style={{
                            borderColor: 'rgba(217, 119, 6, 0.45)',
                            color: 'var(--amber)',
                            background: 'rgba(217, 119, 6, 0.08)',
                          }}
                          onClick={openNewDemoModal}
                          title="Crear cuenta demo para clientes interesados (solo visualización)"
                        >
                          <Sparkles size={14} /> Crear Demo
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="button button-primary button-sm"
                      onClick={() => {
                        setNewUserForm((prev) => ({
                          ...prev,
                          expiresAt:
                            prev.expiresAt ||
                            toDateTimeLocalValue(new Date(Date.now() + 30 * 86400000)),
                        }));
                        setShowNewUserModal(true);
                      }}
                    >
                      <Plus size={14} /> Crear cuenta
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Persona</th>
                        <th>Plan asignado</th>
                        <th>Vendedor / Creado por</th>
                        <th>Estado</th>
                        <th>Cuota / Reportes pendientes</th>
                        <th>Vencimiento (Fecha y Hora)</th>
                        <th>Dispositivos</th>
                        <th>Originality</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const queuedCount = (u.pendingReports || 0) + (u.daily?.reserved || 0);
                        const remainingReports = u.daily?.remaining ?? 0;
                        return (
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
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span
                                  className={`code-chip ${u.isDemo ? 'status-amber' : ''}`}
                                  style={{ width: 'fit-content', fontWeight: u.isDemo ? 700 : 'normal' }}
                                >
                                  {u.isDemo
                                    ? '🔒 DEMO SOLO VISUALIZACIÓN'
                                    : u.role === 'admin'
                                    ? u.adminRoleLabel || 'ADMINISTRADOR'
                                    : u.planName || 'INSTRUCTOR BÁSICO'}
                                </span>
                                {u.isDemo ? (
                                  <small style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber)' }}>
                                    Solo lectura · Resultados protegidos
                                  </small>
                                ) : u.role !== 'admin' && (
                                  <small
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 600,
                                      color:
                                        u.accountType === 'student' ||
                                        (u.planName || '').toUpperCase().includes('ESTUDIANTE')
                                          ? 'var(--amber)'
                                          : 'var(--brand-primary)',
                                    }}
                                  >
                                    {u.accountType === 'student' ||
                                    (u.planName || '').toUpperCase().includes('ESTUDIANTE')
                                      ? 'Estudiante · Solo Similitud'
                                      : 'Instructor (Asesor) · Similitud + IA'}
                                  </small>
                                )}
                              </div>
                            </td>
                            <td>
                              {u.role === 'admin' ? (
                                <span className="code-chip">Sistema</span>
                              ) : (
                                <div className="person-meta">
                                  <strong style={{ fontSize: 12 }}>
                                    {u.sellerName || 'Soluciones Académicas'}
                                  </strong>
                                  <span style={{ fontSize: 11 }}>
                                    {u.sellerEmail || 'fabianrayasaravia@gmail.com'}
                                  </span>
                                </div>
                              )}
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
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {u.role === 'admin' ||
                                u.daily?.unlimited ||
                                u.originalityApproved ? (
                                  <span className="status-pill status-blue">
                                    Reportes Ilimitados
                                  </span>
                                ) : (
                                  <span className="code-chip">
                                    {remainingReports} / {u.daily?.limit ?? 7} pendientes hoy
                                  </span>
                                )}
                                {queuedCount > 0 && (
                                  <span
                                    className="status-pill status-amber"
                                    style={{ width: 'fit-content', fontSize: 10.5 }}
                                  >
                                    {queuedCount} reporte(s) en cola
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              {u.role === 'admin' ? (
                                <span className="code-chip">Permanente</span>
                              ) : (
                                <input
                                  type="datetime-local"
                                  value={toDateTimeLocalValue(u.expiresAt)}
                                  onChange={(e) => {
                                    const newVal = e.target.value;
                                    if (!newVal) return;
                                    const parsed = new Date(newVal);
                                    if (Number.isNaN(parsed.getTime())) return;
                                    const isoDate = parsed.toISOString();
                                    const isExpired = parsed.getTime() <= Date.now();
                                    setUsers((prev) =>
                                      prev.map((item) =>
                                        item.id === u.id
                                          ? {
                                              ...item,
                                              expiresAt: isoDate,
                                              status: isExpired ? 'expired' : 'active',
                                            }
                                          : item
                                      )
                                    );
                                    showNotification(
                                      `Vencimiento de ${u.name} actualizado a ${formatSafeDateTime(
                                        newVal,
                                        { dateStyle: 'short', timeStyle: 'short' }
                                      )}.`
                                    );
                                  }}
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: 8,
                                    border: '1px solid var(--border-color)',
                                    fontSize: 12,
                                    fontFamily: 'var(--font-mono)',
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                  }}
                                />
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
                                disabled={u.role === 'admin'}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setUsers((prev) =>
                                    prev.map((item) =>
                                      item.id === u.id
                                        ? {
                                            ...item,
                                            originalityApproved: checked,
                                            daily: checked
                                              ? {
                                                  ...item.daily,
                                                  unlimited: true,
                                                  limit: 999999,
                                                  remaining: 999999,
                                                }
                                              : {
                                                  ...item.daily,
                                                  unlimited: false,
                                                  limit: 7,
                                                  remaining: 7,
                                                },
                                          }
                                        : item
                                    )
                                  );
                                  showNotification(
                                    `Turnitin Originality ${
                                      checked
                                        ? 'aprobado (Reportes ilimitados)'
                                        : 'deshabilitado (7 reportes al día en Feedback)'
                                    } para ${u.name}`
                                  );
                                }}
                              />
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {u.role !== 'admin' && (
                                  <>
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
                                          `Dispositivos liberados para ${u.name}.`
                                        );
                                      }}
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
                                                    ...item.daily,
                                                    limit: (item.daily?.limit || 7) + 3,
                                                    remaining: (item.daily?.remaining || 7) + 3,
                                                  },
                                                }
                                              : item
                                          )
                                        );
                                        showNotification(
                                          `Saldo de +3 reportes acreditado a ${u.name}`
                                        );
                                      }}
                                    >
                                      <Plus size={13} /> +3
                                    </button>
                                    <a
                                      className="button button-secondary button-sm"
                                      href={`https://wa.me/51987654321?text=${encodeURIComponent(
                                        `Hola ${u.name}, tu acceso a TurnitinPE (${
                                          u.planName || 'INSTRUCTOR BÁSICO'
                                        }) está activo en https://turnitinpe.com`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <MessageCircle size={13} /> WhatsApp
                                    </a>
                                  </>
                                )}
                                {/* SOLO ULTRA ADMIN PUEDE ELIMINAR CUENTAS VENCIDAS Y CUENTAS CON REPORTES PENDIENTES */}
                                {u.role !== 'admin' &&
                                  (isUltraAdmin ? (
                                    <button
                                      type="button"
                                      className="button button-secondary button-sm"
                                      style={{
                                        color: 'var(--crimson)',
                                        borderColor: 'rgba(225, 29, 72, 0.35)',
                                      }}
                                      onClick={() => {
                                        const isExp = u.status === 'expired';
                                        const hasPend = hasPendingReports(u);
                                        setUsers((prev) =>
                                          prev.filter((item) => item.id !== u.id)
                                        );
                                        showNotification(
                                          `Ultra Admin eliminó la cuenta ${
                                            isExp
                                              ? 'vencida'
                                              : hasPend
                                              ? 'con reportes pendientes'
                                              : ''
                                          } de ${u.name}.`
                                        );
                                      }}
                                      title="Solo Ultra Admin puede eliminar cuentas vencidas o con reportes pendientes"
                                    >
                                      <Trash2 size={13} /> Eliminar cuenta
                                    </button>
                                  ) : (
                                    <span
                                      className="code-chip"
                                      style={{ opacity: 0.65, fontSize: 10.5 }}
                                      title="Solo Ultra Admin tiene permiso para eliminar cuentas vencidas o con reportes pendientes"
                                    >
                                      Solo Ultra Admin elimina
                                    </span>
                                  ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* ==========================================
              TAB 7: PLANES Y PRECIOS
             ========================================== */}
          {activeTab === 'plans' && (
            <div className="plans-grid">
              {plans.map((plan) => {
                const isStudentPlan =
                  plan.modality === 'student' ||
                  plan.accountType === 'student' ||
                  (plan.name || '').toUpperCase().includes('ESTUDIANTE');
                const isUnlimitedPlan =
                  plan.serviceType === 'originality' ||
                  plan.feedbackPolicy?.mode === 'unlimited';
                return (
                  <article key={plan.id} className="plan-card">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span className="code-chip">
                        {isStudentPlan
                          ? 'ESTUDIANTE · SOLO SIMILITUD'
                          : 'INSTRUCTOR (ASESOR) · SIMILITUD + IA'}
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
                        <strong>
                          {isStudentPlan
                            ? 'Solo muestra reporte de Similitud'
                            : 'Muestra reporte de Similitud + IA'}
                        </strong>
                      </li>
                      <li>
                        <CheckCircle2 size={15} style={{ color: 'var(--emerald)' }} />
                        {isUnlimitedPlan
                          ? 'Reportes PDF ilimitados (Turnitin Originality)'
                          : `${
                              plan.feedbackPolicy?.dailyLimit || 7
                            } reportes PDF al día (Turnitin Feedback)`}
                      </li>
                      <li>
                        <QuillbotIcon size={16} />
                        QuillBot incluido gratuitamente
                      </li>
                      <li>
                        <Users size={15} style={{ color: 'var(--brand-primary)' }} />
                        <strong>{plan.assignedUsers} cuentas asignadas</strong>
                      </li>
                    </ul>
                  </article>
                );
              })}
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
                    <h2>
                      Vinculaciones Chrome · Proveedor{' '}
                      {activeProvider === 'academiacx' ? 'AcademiaCX' : 'OriginalityPlus'}
                    </h2>
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

                <div className="provider-selector-grid">
                  <button
                    type="button"
                    className={`provider-card ${
                      activeProvider === 'originalityplus' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveProvider('originalityplus');
                      showNotification('Proveedor activo cambiado a OriginalityPlus.');
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <strong>OriginalityPlus</strong>
                      <span className="status-pill status-emerald">Recomendado</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Genera sim-*.pdf + ai-*.pdf con soporte de subida chunked hasta 100 MB.
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`provider-card ${activeProvider === 'academiacx' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveProvider('academiacx');
                      showNotification('Proveedor activo cambiado a AcademiaCX.');
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                      }}
                    >
                      <strong>AcademiaCX</strong>
                      <span className="code-chip">Respaldo</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Estación secundaria para balanceo de cola o mantenimiento programado.
                    </span>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <label className="field">
                    Conservación automática de informes PDF
                    <select
                      value={retentionPolicy}
                      onChange={(e) => {
                        setRetentionPolicy(e.target.value);
                        showNotification('Política de conservación de informes actualizada.');
                      }}
                    >
                      <option value="never">No eliminar automáticamente (Recomendado)</option>
                      <option value="2h">Eliminar después de 2 horas</option>
                      <option value="5h">Eliminar después de 5 horas</option>
                      <option value="24h">Eliminar después de 24 horas</option>
                    </select>
                  </label>
                  <div className="filter-switch-item">
                    <CheckCircle2 size={18} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                    <div>
                      <strong>Los informes nunca se indexan en repositorio Turnitin</strong>
                      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                        Todos los análisis se ejecutan en modalidad Sin Depósito (No Repository).
                      </p>
                    </div>
                  </div>
                  <div className="filter-switch-item">
                    <CheckCircle2 size={18} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
                    <div>
                      <strong>Eliminación manual por el cliente habilitada</strong>
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
                  <p>
                    Turnitin Feedback: 7 reportes al día · Turnitin Originality: Reportes ilimitados
                  </p>
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Correo</th>
                      <th>Servicio / Límite</th>
                      <th>Consumidos Hoy</th>
                      <th>Pendientes en Cola</th>
                      <th>Restantes</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleUsers
                      .filter((u) => u.role !== 'admin')
                      .map((u) => (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.name}</strong>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            {u.daily?.unlimited || u.originalityApproved ? (
                              <span className="status-pill status-blue">
                                Ilimitado (Originality)
                              </span>
                            ) : (
                              <span className="code-chip">
                                {u.daily?.limit ?? 7} PDF / día (Feedback)
                              </span>
                            )}
                          </td>
                          <td>{u.daily?.consumed ?? 0}</td>
                          <td>{(u.pendingReports || 0) + (u.daily?.reserved ?? 0)}</td>
                          <td>
                            {u.daily?.unlimited || u.originalityApproved ? (
                              <span className="status-pill status-blue">Ilimitados</span>
                            ) : (
                              <span className="status-pill status-emerald">
                                {u.daily?.remaining ?? 7} disponibles
                              </span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
                                              limit: (item.daily?.limit || 7) + 5,
                                              remaining: (item.daily?.remaining || 7) + 5,
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
                              {isUltraAdmin && (
                                <button
                                  type="button"
                                  className="button button-secondary button-sm"
                                  style={{
                                    color: 'var(--crimson)',
                                    borderColor: 'rgba(225, 29, 72, 0.35)',
                                  }}
                                  onClick={() => {
                                    setUsers((prev) => prev.filter((item) => item.id !== u.id));
                                    showNotification(
                                      `Ultra Admin eliminó la cuenta de ${u.name}.`
                                    );
                                  }}
                                >
                                  <Trash2 size={13} /> Eliminar cuenta
                                </button>
                              )}
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
          onRetryAiReport={handleRetryAiReport}
        />
      )}

      {/* Create Admin Reportes Modal — solo Ultra Admin y Super Admin */}
      {showNewAdminModal && (isUltraAdmin || isSuperAdmin) && (
        <div className="modal-backdrop" onClick={() => setShowNewAdminModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow">NUEVO VENDEDOR</span>
                <h2>Crear Admin Reportes</h2>
              </div>
              <button className="icon-btn" onClick={() => setShowNewAdminModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={handleCreateReportAdmin}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {newAdminError && (
                <div className="error-banner" role="alert">
                  {newAdminError}
                </div>
              )}
              <label className="field">
                Nombre del vendedor
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                />
              </label>
              <label className="field">
                Correo del vendedor
                <input
                  type="email"
                  required
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  placeholder="vendedor@correo.com"
                />
              </label>
              <label className="field">
                Contraseña inicial
                <input
                  type="text"
                  required
                  minLength={12}
                  maxLength={256}
                  autoComplete="new-password"
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  placeholder="Al menos 12 caracteres"
                />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field">
                  WhatsApp del vendedor
                  <input
                    type="tel"
                    value={newAdminForm.whatsapp}
                    onChange={(e) =>
                      setNewAdminForm({ ...newAdminForm, whatsapp: e.target.value })
                    }
                    placeholder="+51 9XX XXX XXX"
                  />
                </label>
                <label className="field">
                  Dispositivos permitidos
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newAdminForm.deviceLimit}
                    onChange={(e) =>
                      setNewAdminForm({ ...newAdminForm, deviceLimit: e.target.value })
                    }
                  />
                </label>
              </div>
              <div className="info-callout" style={{ fontSize: 12.5 }}>
                <ShieldCheck size={18} />
                <p style={{ margin: 0 }}>
                  El Admin Reportes solo puede crear y ver las cuentas que él mismo vende. No puede
                  eliminar cuentas, crear administradores ni modificar planes.
                </p>
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowNewAdminModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="button button-primary">
                  <ShieldCheck size={16} /> Crear Admin Reportes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Independiente: Crear Demo (Solo Ultra Admin y Super Admin) */}
      {showDemoModal && (isUltraAdmin || isSuperAdmin) && (
        <div className="modal-backdrop" onClick={() => setShowDemoModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="page-eyebrow" style={{ color: 'var(--amber)' }}>
                  ACCESO DEMO · SOLO VISUALIZACIÓN
                </span>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={20} style={{ color: 'var(--amber)' }} />
                  Crear Demo
                </h2>
              </div>
              <button className="icon-btn" onClick={() => setShowDemoModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateDemo}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {demoFormError && (
                <div className="error-banner" role="alert">
                  {demoFormError}
                </div>
              )}

              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'rgba(217, 119, 6, 0.1)',
                  border: '1px solid rgba(217, 119, 6, 0.35)',
                  fontSize: 12.5,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <strong style={{ color: 'var(--amber)' }}>
                  🔒 Restricciones estrictas para el cliente demo:
                </strong>
                <span>• Puede navegar por toda la plataforma pero <strong>no podrá usarla para generar informes</strong>.</span>
                <span>• Si sube un archivo de prueba, <strong>no podrá ver el resultado ni los porcentajes</strong> (quedan protegidos).</span>
                <span>• No podrá escribir ni parafrasear en QuillBot ni en Todas las IA (solo lectura).</span>
                <span>• Queda en su propia sección "Demos" para que los <strong>Admin Reportes no se confundan</strong>.</span>
              </div>

              <label className="field">
                Nombre del cliente interesado
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                  placeholder="Ej. Dr. Mario Vargas (Demo)"
                />
              </label>

              <label className="field">
                Correo para la demo
                <input
                  type="email"
                  required
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                  placeholder="cliente.demo@correo.com"
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field">
                  Contraseña de acceso
                  <input
                    type="text"
                    value={demoForm.password}
                    onChange={(e) => setDemoForm({ ...demoForm, password: e.target.value })}
                    placeholder="Demo#2026 (por defecto)"
                  />
                </label>

                <label className="field">
                  Vigencia de la demo
                  <input
                    type="datetime-local"
                    value={demoForm.expiresAt}
                    onChange={(e) => setDemoForm({ ...demoForm, expiresAt: e.target.value })}
                  />
                </label>
              </div>

              <label className="field">
                Notas / Motivo de la demo
                <input
                  type="text"
                  value={demoForm.notes}
                  onChange={(e) => setDemoForm({ ...demoForm, notes: e.target.value })}
                  placeholder="Ej. Cliente consultando por plan Instructor Ilimitado"
                />
              </label>

              <div className="modal-actions" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowDemoModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                  style={{
                    background: 'var(--amber)',
                    borderColor: 'var(--amber)',
                    color: '#000',
                    fontWeight: 700,
                  }}
                >
                  <Sparkles size={16} /> Crear Demo
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

              <label className="field">
                Plan y modalidad de cuenta
                <select
                  value={newUserForm.planId}
                  onChange={(e) => {
                    const planId = e.target.value;
                    const chosen = plans.find((p) => p.id === planId) || plans[0];
                    setNewUserForm({
                      ...newUserForm,
                      planId,
                      serviceType: chosen?.serviceType || 'feedback',
                    });
                  }}
                >
                  {plans.map((p) => {
                    const isStud =
                      p.modality === 'student' ||
                      p.accountType === 'student' ||
                      (p.name || '').toUpperCase().includes('ESTUDIANTE');
                    const isUnlim =
                      p.serviceType === 'originality' ||
                      p.feedbackPolicy?.mode === 'unlimited';
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatCurrency(p.priceMinor, p.currency)} (
                        {isStud ? 'Solo Similitud' : 'Similitud + IA'} ·{' '}
                        {isUnlim ? 'Ilimitado' : '7 reportes al día'})
                      </option>
                    );
                  })}
                </select>
              </label>

              <div className="form-grid">
                <label className="field">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} style={{ color: 'var(--brand-primary)' }} />
                    Fecha y hora de vencimiento
                  </span>
                  <input
                    type="datetime-local"
                    value={newUserForm.expiresAt}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, expiresAt: e.target.value })
                    }
                    required
                  />
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

              {/* Botones rápidos para configurar el vencimiento con fecha y hora */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    marginRight: 4,
                  }}
                >
                  Duración rápida:
                </span>
                {[
                  { label: '+1 día', days: 1 },
                  { label: '+7 días', days: 7 },
                  { label: '+15 días', days: 15 },
                  { label: '+1 mes (30d)', days: 30 },
                  { label: '+3 meses', days: 90 },
                  { label: '+1 año', days: 365 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="button button-secondary button-sm"
                    style={{ padding: '4px 9px', fontSize: 11.5 }}
                    onClick={() => {
                      const target = new Date(Date.now() + preset.days * 86400000);
                      setNewUserForm({
                        ...newUserForm,
                        expiresAt: toDateTimeLocalValue(target),
                      });
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Resumen visual de la configuración de la cuenta */}
              {(() => {
                const selectedPlanObj =
                  plans.find((p) => p.id === newUserForm.planId) || plans[0];
                const isStudentSel =
                  selectedPlanObj?.modality === 'student' ||
                  selectedPlanObj?.accountType === 'student' ||
                  (selectedPlanObj?.name || '').toUpperCase().includes('ESTUDIANTE');
                const isUnlimSel =
                  selectedPlanObj?.serviceType === 'originality' ||
                  selectedPlanObj?.feedbackPolicy?.mode === 'unlimited';
                return (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: isUnlimSel
                        ? 'rgba(37, 99, 235, 0.08)'
                        : 'var(--emerald-soft)',
                      border: '1px solid var(--border-color)',
                      fontSize: 12.5,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 8,
                      }}
                    >
                      <span>
                        <strong>{selectedPlanObj?.name}:</strong>{' '}
                        {isStudentSel ? 'Solo Similitud' : 'Similitud + IA'} ·{' '}
                        {isUnlimSel ? 'Reportes ilimitados' : '7 reportes al día'} (
                        {formatCurrency(selectedPlanObj?.priceMinor || 8000, 'PEN')})
                      </span>
                      <span>
                        <strong>Vence:</strong> {formatSafeDateTime(newUserForm.expiresAt)}
                      </span>
                    </div>
                    <small style={{ color: 'var(--text-secondary)', fontSize: 11.5 }}>
                      Vendedor asignado: <strong>{user?.name || 'Admin'}</strong> ({user?.email})
                    </small>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
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
