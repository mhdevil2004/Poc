// ============================================================
// MOCK AUDIT SERVICE — Admin Portal
// POC ONLY: Appends events to in-memory mock log.
// Replace with Go API calls in production.
// ============================================================

import { appendAuditEvent, type AuditAction } from "../admin-data/mockAuditLog";
import type { AdminUser } from "../admin-data/mockAdminUsers";

/**
 * Log any important admin action.
 * This is the single entry point for all audit events.
 * Future: replace with POST /api/audit on the Go backend.
 */
export function logAuditEvent(
  user: AdminUser,
  action: AuditAction,
  opts: {
    resource?: string;
    loanRef?: string;
    previousValue?: string;
    newValue?: string;
    detail?: string;
  } = {}
) {
  appendAuditEvent({
    user: user.name,
    userId: user.id,
    role: user.role,
    action,
    resource: opts.resource ?? "Assessment",
    loanRef: opts.loanRef,
    previousValue: opts.previousValue,
    newValue: opts.newValue,
    detail: opts.detail,
  });
}

/** Convenience: log assessment viewed */
export function logAssessmentViewed(user: AdminUser, loanRef: string) {
  logAuditEvent(user, "VIEWED_ASSESSMENT", {
    resource: "Assessment",
    loanRef,
    detail: "Opened assessment detail",
  });
}

/** Convenience: log score band update */
export function logScoreBandUpdated(
  user: AdminUser,
  loanRef: string,
  previousValue: string,
  newValue: string
) {
  logAuditEvent(user, "UPDATED_SCORE_BAND", {
    resource: "Assessment",
    loanRef,
    previousValue,
    newValue,
  });
}

/** Convenience: log status update */
export function logStatusUpdated(
  user: AdminUser,
  loanRef: string,
  previousValue: string,
  newValue: string
) {
  logAuditEvent(user, "UPDATED_STATUS", {
    resource: "Assessment",
    loanRef,
    previousValue,
    newValue,
  });
}

/** Convenience: log notes update */
export function logNotesUpdated(
  user: AdminUser,
  loanRef: string,
  previousValue: string,
  newValue: string
) {
  logAuditEvent(user, "UPDATED_NOTES", {
    resource: "Assessment",
    loanRef,
    previousValue,
    newValue,
  });
}
