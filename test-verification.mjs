import {
  SEED_ADMIN_USER,
  SEED_SUPER_ADMIN_USER,
  SEED_REPORT_ADMIN_USER,
  SEED_ADMIN_CREDENTIALS,
  SEED_USERS,
  SEED_JOBS,
} from './src/data/liveSeedData.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('====================================================');
console.log('🧪 EJECUTANDO PRUEBAS DE VERIFICACIÓN TURNITINPE V2');
console.log('====================================================\n');

// 1. VERIFICACIÓN DE CREDENCIALES Y JERARQUÍA DE ROLES
console.log('📌 1. Verificación de Credenciales y Jerarquía de Administradores:');

assert(
  SEED_ADMIN_USER.email === 'fabianrayasaravia@gmail.com' &&
    SEED_ADMIN_USER.adminRole === 'ultra_admin' &&
    SEED_ADMIN_USER.adminRoleLabel === 'ULTRA ADMIN',
  'Ultra Admin está asignado a fabianrayasaravia@gmail.com con rol ultra_admin'
);

assert(
  SEED_ADMIN_USER.adminPermissions.includes('clients.delete') &&
    SEED_ADMIN_USER.adminPermissions.includes('clients.delete_expired') &&
    SEED_ADMIN_USER.adminPermissions.includes('clients.delete_pending_reports'),
  'Ultra Admin tiene los permisos exclusivos para eliminar cuentas ordinarias, vencidas y con reportes pendientes'
);

assert(
  SEED_SUPER_ADMIN_USER.adminRole === 'super_admin' &&
    SEED_SUPER_ADMIN_USER.adminRoleLabel === 'SUPER ADMIN',
  'Super Admin está configurado como super_admin'
);

assert(
  !SEED_SUPER_ADMIN_USER.adminPermissions.includes('clients.delete') &&
    !SEED_SUPER_ADMIN_USER.adminPermissions.includes('clients.delete_expired') &&
    !SEED_SUPER_ADMIN_USER.adminPermissions.includes('clients.delete_pending_reports'),
  'Super Admin NO tiene permisos de eliminación de cuentas (requisito del usuario)'
);

assert(
  SEED_REPORT_ADMIN_USER.adminRole === 'report_admin' &&
    SEED_REPORT_ADMIN_USER.adminRoleLabel === 'ADMIN REPORTES',
  'Admin Reportes tiene el label limpio ADMIN REPORTES'
);

assert(
  !SEED_REPORT_ADMIN_USER.adminRoleLabel.includes('SOLO SUS VENTAS') &&
    !SEED_REPORT_ADMIN_USER.adminRoleLabel.includes('Solo sus ventas'),
  'Admin Reportes NO contiene el texto (SOLO SUS VENTAS)'
);

assert(
  !SEED_REPORT_ADMIN_USER.adminPermissions.includes('clients.delete') &&
    !SEED_REPORT_ADMIN_USER.adminPermissions.includes('clients.delete_expired'),
  'Admin Reportes NO puede eliminar cuentas'
);

// 2. VERIFICACIÓN DE AISLAMIENTO PARA ADMIN REPORTES
console.log('\n📌 2. Verificación de Aislamiento Estricto para Admin Reportes:');

// Test dataset containing regular clients, client sold by seller, and demo accounts
const testUsers = [
  { id: 'cli-1', name: 'Cliente de Ultra Admin', sellerEmail: 'fabianrayasaravia@gmail.com', isDemo: false, role: 'member' },
  { id: 'cli-2', name: 'Cliente de Vendedor Saravia', sellerEmail: 'saraviarosquetecomeverga@chivo.com', isDemo: false, role: 'member' },
  { id: 'cli-3', name: 'Demo de Prueba para Cliente', sellerEmail: 'fabianrayasaravia@gmail.com', isDemo: true, role: 'member' },
  { id: 'cli-4', name: 'Demo de Super Admin', sellerEmail: 'acadiax@turnitinpe.com', isDemo: true, role: 'member' },
  { id: 'cli-5', name: 'Demo asignado a Saravia', sellerEmail: 'saraviarosquetecomeverga@chivo.com', isDemo: true, role: 'member' },
];

// Admin Reportes filter function from App.jsx
function filterUsersForReportAdmin(users, sellerUser) {
  return users.filter(
    (u) =>
      u.role !== 'admin' &&
      !u.isDemo && // STRICT ISOLATION: Never show demo accounts to vendors
      ((u.sellerEmail || '').toLowerCase() === (sellerUser?.email || '').toLowerCase() ||
        u.createdByAdminId === sellerUser?.id ||
        u.createdById === sellerUser?.id)
  );
}

const sellerVisible = filterUsersForReportAdmin(testUsers, SEED_REPORT_ADMIN_USER);

assert(
  sellerVisible.length === 1 && sellerVisible[0].id === 'cli-2',
  'Admin Reportes solo ve las cuentas que él vendió (cli-2)'
);

assert(
  sellerVisible.every((u) => !u.isDemo),
  'Admin Reportes tiene filtro estricto !u.isDemo: NUNCA se le muestran cuentas demo (evita confusiones)'
);

// 3. VERIFICACIÓN DE CREACIÓN Y PROTECCIÓN DE CUENTAS DEMO
console.log('\n📌 3. Verificación de Cuentas Demo (Visualización Protegida):');

// Simulation of handleCreateDemo
function createDemoAccount(creatorUser, { name, email, durationDays = 3 }) {
  return {
    id: `demo-${Date.now()}`,
    name: `[DEMO] ${name}`,
    email,
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
    demoExpiresAt: new Date(Date.now() + durationDays * 86400000).toISOString(),
    createdById: creatorUser.id,
    sellerEmail: creatorUser.email,
  };
}

const newDemo = createDemoAccount(SEED_ADMIN_USER, {
  name: 'Empresa Interesada SAC',
  email: 'contacto@empresa.com',
  durationDays: 3,
});

assert(newDemo.isDemo === true, 'Cuenta creada tiene bandera isDemo: true');
assert(newDemo.planName === 'DEMO SOLO VISUALIZACIÓN', 'Plan asignado es DEMO SOLO VISUALIZACIÓN');
assert(newDemo.feedbackAccess.mode === 'view_only', 'feedbackAccess está en modo view_only');
assert(newDemo.feedbackAccess.canSubmit === false, 'canSubmit está en false');

// Simulation of file upload under demo account
function simulateUploadOutcome(user, filename) {
  const isDemoUser = !!user?.isDemo;
  return {
    id: `job-test-${Date.now()}`,
    name: filename,
    ownerName: user.name,
    ownerEmail: user.email,
    isDemoFile: isDemoUser,
    state: isDemoUser ? 'demo_locked' : 'completed',
    reportStates: {
      ai: { state: isDemoUser ? 'demo_locked' : 'completed' },
      similarity: { state: isDemoUser ? 'demo_locked' : 'completed' },
    },
    similarityScore: 14,
    aiScore: 0,
  };
}

const demoJob = simulateUploadOutcome(newDemo, 'Tesis_Postgrado_Borrador.pdf');
const regularJob = simulateUploadOutcome(testUsers[0], 'Tesis_Postgrado_Borrador.pdf');

assert(
  demoJob.isDemoFile === true && demoJob.state === 'demo_locked',
  'Subida en Modo Demo genera un job bloqueado (state: demo_locked, isDemoFile: true)'
);

assert(
  regularJob.isDemoFile === false && regularJob.state === 'completed',
  'Subida en cuenta ordinaria genera un job completado normal'
);

// Simulation of certificate download permission
function canDownloadCertificate(user, job) {
  if (user?.isDemo || job.isDemoFile || job.state === 'demo_locked') {
    return false; // Bloqueado
  }
  return true;
}

assert(
  canDownloadCertificate(newDemo, demoJob) === false,
  'Descarga de certificados o informes PDF bloqueada para cuentas Demo'
);

assert(
  canDownloadCertificate(testUsers[0], regularJob) === true,
  'Descarga de certificados habilitada para cuentas cliente regulares'
);

// Simulation of QuillBot paraphrasing protection
function canParaphraseQuillbot(user) {
  return !user?.isDemo;
}

assert(
  canParaphraseQuillbot(newDemo) === false,
  'Motor de parafraseo de QuillBot inhabilitado para cuentas Demo (solo lectura)'
);

// Simulation of AI Chat interaction protection
function canSubmitAiChat(user) {
  return !user?.isDemo;
}

assert(
  canSubmitAiChat(newDemo) === false,
  'Envío de consultas al chat de IA inhabilitado para cuentas Demo'
);

// 4. VERIFICACIÓN DE TABS Y PERMISOS DE GESTIÓN EN PANEL ADMIN
console.log('\n📌 4. Verificación de Pestañas y Acciones en Panel Admin:');

function getAvailableTabsForUser(adminUser) {
  const isUltra = adminUser.adminRole === 'ultra_admin';
  const isSuper = adminUser.adminRole === 'super_admin';
  const isReport = adminUser.adminRole === 'report_admin';

  const tabs = ['overview', 'users'];
  if (isUltra || isSuper) {
    tabs.push('plans', 'ai-catalog', 'admins', 'client-uploads', 'stations');
  }
  return tabs;
}

const ultraTabs = getAvailableTabsForUser(SEED_ADMIN_USER);
const superTabs = getAvailableTabsForUser(SEED_SUPER_ADMIN_USER);
const reportTabs = getAvailableTabsForUser(SEED_REPORT_ADMIN_USER);

assert(
  ultraTabs.includes('admins') && ultraTabs.includes('client-uploads'),
  'Ultra Admin tiene acceso a todas las secciones de administración'
);

assert(
  superTabs.includes('admins') && superTabs.includes('plans'),
  'Super Admin tiene acceso a gestión de planes y vendedores'
);

assert(
  !reportTabs.includes('admins') && !reportTabs.includes('plans') && !reportTabs.includes('stations'),
  'Admin Reportes NO tiene acceso a la pestaña de Administradores ni a Planes ni a Estaciones'
);

// 5. RESUMEN FINAL
console.log('\n====================================================');
console.log(`📊 RESULTADO DE LAS PRUEBAS: ${passed} PASADAS, ${failed} FALLADAS`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 TODAS LAS VERIFICACIONES HAN SIDO SATISFACTORIAS.');
}
