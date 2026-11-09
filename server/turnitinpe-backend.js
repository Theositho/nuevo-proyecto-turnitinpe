/**
 * TurnitinPE - Arquitectura Backend Mejorada (/api/turnitin2, /api/auth, /api/private/daily-report-limits)
 * Basada en la ingenieria inversa completa de turnitinpe.com:
 *  - Subida fragmentada (Chunked Uploads de 1 MB hasta 100 MB)
 *  - Cola de trabajos y leasing para Estaciones Chrome (OriginalityPlus / AcademiaCX)
 *  - Reportes independientes de IA (ai-<jobId>.pdf) y Similitud (sim-<jobId>.pdf)
 *  - Cuotas diarias con reinicio automatico en zona horaria America/Lima (UTC-5)
 *  - Control de sesiones HttpOnly y limite de dispositivos por usuario (deviceLimit: 2)
 */

import crypto from 'node:crypto';

export const TURNITIN2_CONFIG = {
  uploadLimits: {
    maxBytes: 100 * 1024 * 1024, // 100 MB
    chunkBytes: 1024 * 1024,     // 1 MB por bloque
    accept: '.pdf,application/pdf',
  },
  station: {
    heartbeatTtlMs: 45_000,      // 45s para considerar estacion online
    leaseTimeoutMs: 12 * 60_000, // 12 min max por trabajo antes de re-encolar automaticamente
    bindingTokenTtlDays: 7,      // 7 dias por token de vinculacion Chrome
  },
  providers: ['originalityplus', 'academiacx'],
  services: ['feedback', 'originality'],
  timezone: 'America/Lima',
};

/**
 * Calcula la ventana del dia actual en America/Lima (medianoche a medianoche UTC-5)
 * Mejora frente al backend actual: evita condiciones de carrera al cruzar las 00:00 PET.
 */
export function getLimaDayWindow(now = new Date()) {
  const limaOffsetMs = -5 * 60 * 60 * 1000;
  const shifted = new Date(now.getTime() + limaOffsetMs);
  const startShifted = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
    0, 0, 0, 0
  );
  const startUtc = new Date(startShifted - limaOffsetMs);
  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);
  return {
    dayKey: shifted.toISOString().slice(0, 10),
    resetsAt: endUtc.toISOString(),
  };
}

/**
 * Calcula el resumen de cuota diaria de reportes PDF (/api/private/daily-report-limits)
 * - Feedback consume cupo diario (ej. 7 PDF/dia en ESTUDIANTE PRO)
 * - Originality con independentMode=true puede operar sin consumir cupo de Feedback
 * - Reembolsa automaticamente (`released`) si ambos reportes (IA y Similitud) fallan
 */
export function computeDailyQuotaSummary(user, activeJobs = [], extraUnits = 0) {
  const { resetsAt } = getLimaDayWindow();
  const baseLimit = Number(user.dailyReportLimit ?? 7);
  const configuredLimit = baseLimit + Number(extraUnits || 0);

  let reserved = 0;
  let consumed = 0;

  for (const job of activeJobs) {
    if (job.service === 'originality' && job.independentMode) continue;
    if (job.state === 'queued' || job.state === 'leased' || job.state === 'processing') {
      reserved += 1;
    } else if (job.state === 'completed') {
      const hasAnySuccess =
        job.reportStatus?.similarity === 'ready' || job.reportStatus?.ai === 'ready';
      if (hasAnySuccess) consumed += 1;
    }
  }

  const remaining = Math.max(0, configuredLimit - reserved - consumed);
  return {
    limit: configuredLimit,
    configuredLimit,
    baseLimit,
    additional: Number(extraUnits || 0),
    reserved,
    consumed,
    remaining,
    unlimited: Boolean(user.unlimitedReports),
    resetsAt,
  };
}

/**
 * Reconciliador de resultados de reportes (IA + Similitud) enviados por la Estacion Chrome
 * Mejora clave:
 *  - Si `sim-<id>.pdf` esta listo pero `ai-<id>.pdf` falla (ej. documento < 300 palabras o idioma no soportado),
 *    marca el trabajo como `completed` parcial y entrega el PDF de Similitud inmediatamente sin bloquear la cola.
 */
export function reconcileJobReportOutcomes(job, { similarityOutcome, aiOutcome }) {
  const nextReportStatus = {
    similarity: similarityOutcome?.status || job.reportStatus?.similarity || 'pending',
    ai: aiOutcome?.status || job.reportStatus?.ai || 'pending',
  };

  const simDone = ['ready', 'failed', 'skipped'].includes(nextReportStatus.similarity);
  const aiDone = ['ready', 'failed', 'skipped'].includes(nextReportStatus.ai);
  const anyReady = nextReportStatus.similarity === 'ready' || nextReportStatus.ai === 'ready';

  let nextState = job.state;
  if (simDone && aiDone) {
    nextState = anyReady ? 'completed' : 'failed';
  }

  return {
    ...job,
    state: nextState,
    reportStatus: nextReportStatus,
    similarityScore: similarityOutcome?.score ?? job.similarityScore ?? null,
    aiScore: aiOutcome?.score ?? job.aiScore ?? null,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generador de tokens de vinculacion para Estaciones Chrome (/api/turnitin2/admin/bindings)
 */
export function createChromeBindingToken({ label, service = 'feedback', createdBy }) {
  const rawToken = crypto.randomBytes(24).toString('base64url');
  const now = Date.now();
  const expiresAt = new Date(
    now + TURNITIN2_CONFIG.station.bindingTokenTtlDays * 24 * 60 * 60 * 1000
  ).toISOString();

  return {
    id: crypto.randomUUID(),
    label,
    service,
    tokenPreview: `${rawToken.slice(0, 6)}...${rawToken.slice(-4)}`,
    tokenHash: crypto.createHash('sha256').update(rawToken).digest('hex'),
    rawToken,
    createdBy,
    createdAt: new Date(now).toISOString(),
    expiresAt,
  };
}
