import type {
  AccountRole,
  AuthProvider,
  TeacherAccount,
} from "@/features/auth/types/auth-types";
import { tr } from "@/features/i18n";

type AccountSession = {
  accountId: string;
  rememberMe: boolean;
  loggedInAt: string;
};

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  department: string;
};

type LoginInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const ACCOUNTS_KEY = "erg-learning.accounts";
const LOCAL_SESSION_KEY = "erg-learning.session";
const SESSION_SESSION_KEY = "erg-learning.session.temp";

const defaultAccounts: TeacherAccount[] = [
  {
    id: "teacher-default",
    fullName: "Nguyễn Hoàng Giang",
    email: "teacher@erg.vn",
    password: "12345678",
    role: "teacher",
    provider: "password",
    department: "Khối tin học ứng dụng",
    title: "Giảng viên chính",
    features: [
      tr("auth.defaultCapabilityDashboard"),
      tr("auth.defaultCapabilityMaterials"),
      tr("auth.defaultCapabilityClasses"),
      tr("auth.defaultCapabilityAccount"),
    ],
    createdAt: "2026-04-20T09:00:00+07:00",
    lastLoginAt: null,
  },
];

function canUseStorage() {
  return typeof window !== "undefined";
}

function parseJson<T>(value: string | null, fallback: T) {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function writeAccounts(accounts: TeacherAccount[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function listAccounts() {
  if (!canUseStorage()) return defaultAccounts;

  const stored = parseJson<TeacherAccount[]>(window.localStorage.getItem(ACCOUNTS_KEY), []);
  if (!stored.length) {
    writeAccounts(defaultAccounts);
    return defaultAccounts;
  }

  return stored;
}

function readSession() {
  if (!canUseStorage()) return null;

  const localSession = parseJson<AccountSession | null>(window.localStorage.getItem(LOCAL_SESSION_KEY), null);
  if (localSession) return localSession;

  return parseJson<AccountSession | null>(window.sessionStorage.getItem(SESSION_SESSION_KEY), null);
}

function writeSession(session: AccountSession) {
  if (!canUseStorage()) return;

  if (session.rememberMe) {
    window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
    window.sessionStorage.removeItem(SESSION_SESSION_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_SESSION_KEY, JSON.stringify(session));
  window.localStorage.removeItem(LOCAL_SESSION_KEY);
}

function clearSession() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(LOCAL_SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_SESSION_KEY);
}

function saveAccount(nextAccount: TeacherAccount) {
  const accounts = listAccounts().map((account) => (account.id === nextAccount.id ? nextAccount : account));
  writeAccounts(accounts);
  return nextAccount;
}

export function getCurrentAccount() {
  const session = readSession();
  if (!session) return null;

  return listAccounts().find((account) => account.id === session.accountId) ?? null;
}

export function registerAccount(input: RegisterInput) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const accounts = listAccounts();

  if (accounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
    throw new Error(tr("auth.errorEmailExists"));
  }

  const nextAccount: TeacherAccount = {
    id: `account-${Math.random().toString(36).slice(2, 10)}`,
    fullName: input.fullName.trim(),
    email: normalizedEmail,
    password: input.password,
    role: "teacher",
    provider: "password",
    department: input.department.trim(),
    title: "Giảng viên mới",
    features: [
      tr("auth.defaultCapabilityDashboard"),
      tr("auth.defaultCapabilityMaterials"),
      tr("auth.defaultCapabilityClasses"),
      tr("auth.defaultCapabilityAccount"),
    ],
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };

  writeAccounts([...accounts, nextAccount]);
  return nextAccount;
}

export function loginWithPassword(input: LoginInput) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const account = listAccounts().find((entry) => entry.email.toLowerCase() === normalizedEmail);

  if (!account || account.password !== input.password) {
    throw new Error(tr("auth.errorEmailPasswordWrong"));
  }

  const nextAccount = saveAccount({
    ...account,
    lastLoginAt: new Date().toISOString(),
  });

  writeSession({
    accountId: nextAccount.id,
    rememberMe: input.rememberMe,
    loggedInAt: new Date().toISOString(),
  });

  return nextAccount;
}

export function loginWithProvider(provider: Extract<AuthProvider, "google" | "apple">, rememberMe: boolean) {
  const providerEmail = provider === "google" ? "teacher.google@erg.vn" : "teacher.apple@erg.vn";
  const providerName =
    provider === "google" ? "Giảng viên Google ERG" : "Giảng viên Apple ERG";
  const providerDepartment =
    provider === "google" ? "Khối học liệu số" : "Khối đào tạo nội bộ";

  const accounts = listAccounts();
  const existing = accounts.find((account) => account.email === providerEmail);

  const account =
    existing ??
    ({
      id: `provider-${provider}`,
      fullName: providerName,
      email: providerEmail,
      password: "",
      role: "teacher",
      provider,
      department: providerDepartment,
      title: "Giảng viên tích hợp",
      features: [
        tr("auth.defaultCapabilityDashboard"),
        tr("auth.defaultCapabilityMaterials"),
        tr("auth.defaultCapabilityClasses"),
        tr("auth.defaultCapabilityAccount"),
      ],
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    } satisfies TeacherAccount);

  if (!existing) {
    writeAccounts([...accounts, account]);
  }

  const nextAccount = saveAccount({
    ...account,
    lastLoginAt: new Date().toISOString(),
  });

  writeSession({
    accountId: nextAccount.id,
    rememberMe,
    loggedInAt: new Date().toISOString(),
  });

  return nextAccount;
}

export function logoutAccount() {
  clearSession();
}

export function updateAccountProfile(
  accountId: string,
  payload: { fullName: string; department: string; title: string },
) {
  const account = listAccounts().find((entry) => entry.id === accountId);
  if (!account) {
    throw new Error(tr("auth.errorAccountNotFound"));
  }

  return saveAccount({
    ...account,
    fullName: payload.fullName.trim(),
    department: payload.department.trim(),
    title: payload.title.trim(),
  });
}

export function updateAccountPassword(accountId: string, currentPassword: string, nextPassword: string) {
  const account = listAccounts().find((entry) => entry.id === accountId);
  if (!account) {
    throw new Error(tr("auth.errorAccountNotFound"));
  }

  if (account.provider !== "password") {
    throw new Error(tr("auth.errorLinkedPasswordChange"));
  }

  if (account.password !== currentPassword) {
    throw new Error(tr("auth.errorCurrentPasswordWrong"));
  }

  return saveAccount({
    ...account,
    password: nextPassword,
  });
}

export function roleLabel(role: AccountRole) {
  switch (role) {
    case "admin":
      return tr("auth.roleAdmin");
    case "coordinator":
      return tr("auth.roleCoordinator");
    case "teacher":
    default:
      return tr("auth.roleTeacher");
  }
}

export function providerLabel(provider: AuthProvider) {
  switch (provider) {
    case "google":
      return tr("auth.providerGoogle");
    case "apple":
      return tr("auth.providerApple");
    case "password":
    default:
      return tr("auth.providerInternalEmail");
  }
}
