import type { AttemptSession, AttemptSyncPayload } from "@/lib/types";

const SESSION_PREFIX = "erg:attempt-session:";
const OUTBOX_PREFIX = "erg:attempt-sync:";

export type AttemptStore = {
  getSession: (attemptId: string) => Promise<AttemptSession | null>;
  saveSession: (session: AttemptSession) => Promise<void>;
  queueSyncPayload: (payload: AttemptSyncPayload) => Promise<void>;
  listPendingSyncPayloads: () => Promise<AttemptSyncPayload[]>;
  markSynced: (attemptId: string) => Promise<void>;
};

export const browserAttemptStore: AttemptStore = {
  async getSession(attemptId) {
    return readJson<AttemptSession>(`${SESSION_PREFIX}${attemptId}`);
  },
  async saveSession(session) {
    writeJson(`${SESSION_PREFIX}${session.attempt.id}`, session);
  },
  async queueSyncPayload(payload) {
    writeJson(`${OUTBOX_PREFIX}${payload.attemptId}`, payload);
  },
  async listPendingSyncPayloads() {
    if (!canUseLocalStorage()) {
      return [];
    }

    return Object.keys(window.localStorage)
      .filter((key) => key.startsWith(OUTBOX_PREFIX))
      .map((key) => readJson<AttemptSyncPayload>(key))
      .filter((payload): payload is AttemptSyncPayload => Boolean(payload));
  },
  async markSynced(attemptId) {
    if (!canUseLocalStorage()) {
      return;
    }

    window.localStorage.removeItem(`${OUTBOX_PREFIX}${attemptId}`);
  },
};

function readJson<T>(key: string): T | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Tauri will replace this store with SQLite; browser quota errors should not block grading.
  }
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}
