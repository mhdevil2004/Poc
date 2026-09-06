// ============================================================
// MOCK AUDIT LOG — Admin Portal
// POC ONLY: In-memory log. Replace with Go API persistence later.
// Timestamps use Asia/Jakarta (WIB, UTC+7).
// ============================================================

import type { AdminRole } from "./mockAdminUsers";
import type { ScoreBand, AdminAssessmentStatus } from "./mockAdminAssessments";

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "MFA_VERIFIED"
  | "VIEWED_ASSESSMENT"
  | "UPDATED_SCORE_BAND"
  | "UPDATED_STATUS"
  | "UPDATED_NOTES"
  | "UPDATED_ASSESSMENT";

export interface AuditEvent {
  id: string;
  user: string;       // User's display name
  userId: string;
  role: AdminRole;
  action: AuditAction;
  resource: string;   // e.g. "Assessment"
  loanRef?: string;
  previousValue?: string;
  newValue?: string;
  detail?: string;
  timestamp: string;  // ISO string, but display formatted as WIB
}

// ── Counter for generating audit IDs ─────────────────────────────────────
let _auditCounter = 21; // Start seeded log at AUD-00021+

function nextAuditId(): string {
  _auditCounter += 1;
  return `AUD-${String(_auditCounter).padStart(5, "0")}`;
}

// ── Seed audit log with initial entries ──────────────────────────────────
// Timestamps are pre-formatted ISO strings (Asia/Jakarta context)
export const MOCK_AUDIT_LOG: AuditEvent[] = [
  {
    id: "AUD-00001",
    user: "Andi Wijaya",
    userId: "USR-001",
    role: "Administrator",
    action: "LOGIN",
    resource: "Auth",
    detail: "Successful mock SSO login",
    timestamp: "2026-09-04T09:15:00+07:00",
  },
  {
    id: "AUD-00002",
    user: "Andi Wijaya",
    userId: "USR-001",
    role: "Administrator",
    action: "MFA_VERIFIED",
    resource: "Auth",
    detail: "MFA verification successful",
    timestamp: "2026-09-04T09:15:12+07:00",
  },
  {
    id: "AUD-00003",
    user: "Siti Rahma",
    userId: "USR-002",
    role: "Risk Officer",
    action: "LOGIN",
    resource: "Auth",
    detail: "Successful mock SSO login",
    timestamp: "2026-09-04T09:30:00+07:00",
  },
  {
    id: "AUD-00004",
    user: "Siti Rahma",
    userId: "USR-002",
    role: "Risk Officer",
    action: "MFA_VERIFIED",
    resource: "Auth",
    detail: "MFA verification successful",
    timestamp: "2026-09-04T09:30:18+07:00",
  },
  {
    id: "AUD-00005",
    user: "Siti Rahma",
    userId: "USR-002",
    role: "Risk Officer",
    action: "VIEWED_ASSESSMENT",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00124",
    detail: "Opened assessment detail",
    timestamp: "2026-09-04T09:32:10+07:00",
  },
  {
    id: "AUD-00006",
    user: "Siti Rahma",
    userId: "USR-002",
    role: "Risk Officer",
    action: "UPDATED_SCORE_BAND",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00124",
    previousValue: "VERIFIED-ADEQUATE",
    newValue: "VERIFIED-STRONG",
    timestamp: "2026-09-04T09:35:44+07:00",
  },
  {
    id: "AUD-00007",
    user: "Budi Hartono",
    userId: "USR-003",
    role: "Underwriter",
    action: "LOGIN",
    resource: "Auth",
    detail: "Successful mock SSO login",
    timestamp: "2026-09-04T10:00:00+07:00",
  },
  {
    id: "AUD-00008",
    user: "Budi Hartono",
    userId: "USR-003",
    role: "Underwriter",
    action: "MFA_VERIFIED",
    resource: "Auth",
    detail: "MFA verification successful",
    timestamp: "2026-09-04T10:00:25+07:00",
  },
  {
    id: "AUD-00009",
    user: "Budi Hartono",
    userId: "USR-003",
    role: "Underwriter",
    action: "VIEWED_ASSESSMENT",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00126",
    detail: "Opened assessment detail",
    timestamp: "2026-09-04T10:05:00+07:00",
  },
  {
    id: "AUD-00010",
    user: "Budi Hartono",
    userId: "USR-003",
    role: "Underwriter",
    action: "UPDATED_NOTES",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00126",
    previousValue: "Warung makan dengan rekonsiliasi keuangan tipis.",
    newValue: "Warung makan dengan rekonsiliasi keuangan tipis. Perlu verifikasi lapangan tambahan.",
    timestamp: "2026-09-04T10:08:33+07:00",
  },
  {
    id: "AUD-00011",
    user: "Dewi Lestari",
    userId: "USR-004",
    role: "Read-Only Auditor",
    action: "LOGIN",
    resource: "Auth",
    detail: "Successful mock SSO login",
    timestamp: "2026-09-04T11:00:00+07:00",
  },
  {
    id: "AUD-00012",
    user: "Dewi Lestari",
    userId: "USR-004",
    role: "Read-Only Auditor",
    action: "MFA_VERIFIED",
    resource: "Auth",
    detail: "MFA verification successful",
    timestamp: "2026-09-04T11:00:15+07:00",
  },
  {
    id: "AUD-00013",
    user: "Dewi Lestari",
    userId: "USR-004",
    role: "Read-Only Auditor",
    action: "VIEWED_ASSESSMENT",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00128",
    detail: "Opened assessment detail",
    timestamp: "2026-09-04T11:05:22+07:00",
  },
  {
    id: "AUD-00014",
    user: "Andi Wijaya",
    userId: "USR-001",
    role: "Administrator",
    action: "UPDATED_STATUS",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00128",
    previousValue: "Pending",
    newValue: "Flagged",
    timestamp: "2026-09-04T11:20:00+07:00",
  },
  {
    id: "AUD-00015",
    user: "Andi Wijaya",
    userId: "USR-001",
    role: "Administrator",
    action: "UPDATED_SCORE_BAND",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00133",
    previousValue: "UNVERIFIED",
    newValue: "CONTRADICTED",
    timestamp: "2026-09-04T11:45:00+07:00",
  },
  {
    id: "AUD-00016",
    user: "Siti Rahma",
    userId: "USR-002",
    role: "Risk Officer",
    action: "VIEWED_ASSESSMENT",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00135",
    detail: "Opened assessment detail",
    timestamp: "2026-09-04T13:10:00+07:00",
  },
  {
    id: "AUD-00017",
    user: "Siti Rahma",
    userId: "USR-002",
    role: "Risk Officer",
    action: "UPDATED_SCORE_BAND",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00135",
    previousValue: "VERIFIED-ADEQUATE",
    newValue: "VERIFIED-STRONG",
    timestamp: "2026-09-04T13:12:45+07:00",
  },
  {
    id: "AUD-00018",
    user: "Budi Hartono",
    userId: "USR-003",
    role: "Underwriter",
    action: "VIEWED_ASSESSMENT",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00130",
    detail: "Opened assessment detail",
    timestamp: "2026-09-04T14:00:00+07:00",
  },
  {
    id: "AUD-00019",
    user: "Budi Hartono",
    userId: "USR-003",
    role: "Underwriter",
    action: "UPDATED_ASSESSMENT",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00130",
    previousValue: "VERIFIED-THIN",
    newValue: "VERIFIED-ADEQUATE",
    timestamp: "2026-09-04T14:05:18+07:00",
  },
  {
    id: "AUD-00020",
    user: "Andi Wijaya",
    userId: "USR-001",
    role: "Administrator",
    action: "VIEWED_ASSESSMENT",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00129",
    detail: "Opened assessment detail",
    timestamp: "2026-09-04T14:30:00+07:00",
  },
  {
    id: "AUD-00021",
    user: "Siti Rahma",
    userId: "USR-002",
    role: "Risk Officer",
    action: "UPDATED_SCORE_BAND",
    resource: "Assessment",
    loanRef: "LN-ID-2026-00124",
    previousValue: "VERIFIED-ADEQUATE",
    newValue: "VERIFIED-STRONG",
    timestamp: "2026-09-04T14:42:00+07:00",
  },
];

// ── Append a new audit event ──────────────────────────────────────────────
export function appendAuditEvent(
  event: Omit<AuditEvent, "id" | "timestamp">
): AuditEvent {
  const newEvent: AuditEvent = {
    ...event,
    id: nextAuditId(),
    timestamp: new Date().toISOString(),
  };
  MOCK_AUDIT_LOG.push(newEvent);
  return newEvent;
}
