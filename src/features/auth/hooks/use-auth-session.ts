import { useEffect, useMemo, useState } from "react";

import {
  getCurrentAccount,
  loginWithPassword,
  loginWithProvider,
  logoutAccount,
  providerLabel,
  registerAccount,
  updateAccountPassword,
  updateAccountProfile,
} from "@/features/auth/api/auth-storage";
import { useI18n } from "@/features/i18n";
import type {
  AccountTab,
  AuthMode,
  LoginFormState,
  Notice,
  PasswordFormState,
  ProfileFormState,
  RegisterFormState,
  TeacherAccount,
} from "@/features/auth/types/auth-types";

const defaultLoginForm: LoginFormState = {
  email: "teacher@erg.vn",
  password: "12345678",
};

const defaultRegisterForm: RegisterFormState = {
  fullName: "",
  email: "",
  department: "",
  password: "",
  confirmPassword: "",
};

const defaultProfileForm: ProfileFormState = {
  fullName: "",
  department: "",
  title: "",
};

const defaultPasswordForm: PasswordFormState = {
  currentPassword: "",
  nextPassword: "",
  confirmPassword: "",
};

export function useAuthSession() {
  const { t } = useI18n();
  const [mode, setMode] = useState<AuthMode>("login");
  const [accountTab, setAccountTab] = useState<AccountTab>("profile");
  const [account, setAccount] = useState<TeacherAccount | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginFormState>(defaultLoginForm);
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(defaultRegisterForm);
  const [profileForm, setProfileForm] = useState<ProfileFormState>(defaultProfileForm);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(defaultPasswordForm);

  useEffect(() => {
    setAccount(getCurrentAccount());
  }, []);

  useEffect(() => {
    if (!account) return;

    setProfileForm({
      fullName: account.fullName,
      department: account.department,
      title: account.title,
    });
  }, [account]);

  const accountCapabilities = useMemo(
    () =>
      account?.features ?? [
        t("auth.heroSubtitle"),
        t("auth.accountInfoSubtitle"),
        t("auth.accountSecuritySubtitle"),
        t("auth.viewStudentUiCaption"),
      ],
    [account, t],
  );

  function pushNotice(nextNotice: Notice) {
    setNotice(nextNotice);
  }

  function login() {
    const nextAccount = loginWithPassword({
      email: loginForm.email,
      password: loginForm.password,
      rememberMe,
    });

    setAccount(nextAccount);
    setAccountTab("profile");
    pushNotice({
      tone: "success",
      message: t("auth.noticeWelcomeBack", { name: nextAccount.fullName }),
    });
  }

  function register() {
    if (!registerForm.fullName.trim() || !registerForm.email.trim() || !registerForm.department.trim()) {
      throw new Error(t("auth.errorMissingRegisterFields"));
    }

    if (registerForm.password.length < 8) {
      throw new Error(t("auth.errorPasswordMin"));
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      throw new Error(t("auth.errorPasswordConfirmMismatch"));
    }

    const createdAccount = registerAccount({
      fullName: registerForm.fullName,
      email: registerForm.email,
      department: registerForm.department,
      password: registerForm.password,
    });

    const nextAccount = loginWithPassword({
      email: createdAccount.email,
      password: registerForm.password,
      rememberMe: true,
    });

    setAccount(nextAccount);
    setMode("login");
    setAccountTab("profile");
    setRegisterForm(defaultRegisterForm);
    pushNotice({ tone: "success", message: t("auth.noticeCreatedAndLoggedIn") });
  }

  function loginByProvider(provider: "google" | "apple") {
    const nextAccount = loginWithProvider(provider, rememberMe);
    setAccount(nextAccount);
    setAccountTab("profile");
    pushNotice({
      tone: "success",
      message: t("auth.noticeProviderLogin", { provider: providerLabel(provider) }),
    });
  }

  function forgotPassword() {
    pushNotice({
      tone: "info",
      message: t("auth.noticeForgotPassword"),
    });
  }

  function saveProfile() {
    if (!account) return;

    const nextAccount = updateAccountProfile(account.id, profileForm);
    setAccount(nextAccount);
    pushNotice({ tone: "success", message: t("auth.noticeProfileUpdated") });
  }

  function savePassword() {
    if (!account) return;

    if (passwordForm.nextPassword.length < 8) {
      throw new Error(t("auth.errorPasswordMin"));
    }

    if (passwordForm.nextPassword !== passwordForm.confirmPassword) {
      throw new Error(t("auth.errorNewPasswordConfirmMismatch"));
    }

    const nextAccount = updateAccountPassword(account.id, passwordForm.currentPassword, passwordForm.nextPassword);
    setAccount(nextAccount);
    setPasswordForm(defaultPasswordForm);
    pushNotice({ tone: "success", message: t("auth.noticePasswordUpdated") });
  }

  function signOut() {
    logoutAccount();
    setAccount(null);
    setAccountTab("profile");
    pushNotice({ tone: "info", message: t("auth.noticeLoggedOut") });
  }

  return {
    mode,
    setMode,
    accountTab,
    setAccountTab,
    account,
    notice,
    setNotice,
    rememberMe,
    setRememberMe,
    showPassword,
    setShowPassword,
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    profileForm,
    setProfileForm,
    passwordForm,
    setPasswordForm,
    accountCapabilities,
    actions: {
      login,
      register,
      loginByProvider,
      forgotPassword,
      saveProfile,
      savePassword,
      signOut,
    },
  };
}
