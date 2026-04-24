import type { FormEvent } from "react";

import {
  AppleIcon,
  EyeIcon,
  GoogleIcon,
} from "@/features/auth/components/auth-icons";
import {
  DividerText,
  Field,
  SocialButton,
  inputClassName,
  submitButtonClassName,
} from "@/features/auth/components/auth-shared";
import type {
  AuthMode,
  LoginFormState,
  RegisterFormState,
} from "@/features/auth/types/auth-types";
import { useI18n } from "@/features/i18n";
import { cn } from "@/utils/cn";

export function AuthFormPanel({
  mode,
  rememberMe,
  showPassword,
  loginForm,
  registerForm,
  onModeChange,
  onRememberMeChange,
  onShowPasswordToggle,
  onLoginFormChange,
  onRegisterFormChange,
  onLoginSubmit,
  onRegisterSubmit,
  onForgotPassword,
  onProviderLogin,
}: {
  mode: AuthMode;
  rememberMe: boolean;
  showPassword: boolean;
  loginForm: LoginFormState;
  registerForm: RegisterFormState;
  onModeChange: (mode: AuthMode) => void;
  onRememberMeChange: (rememberMe: boolean) => void;
  onShowPasswordToggle: () => void;
  onLoginFormChange: (value: LoginFormState) => void;
  onRegisterFormChange: (value: RegisterFormState) => void;
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onForgotPassword: () => void;
  onProviderLogin: (provider: "google" | "apple") => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex rounded-full bg-slate-100 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          {[
            { id: "login" as const, label: t("auth.login") },
            { id: "register" as const, label: t("auth.register") },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onModeChange(item.id)}
              className={cn(
                "min-w-[210px] rounded-full px-8 py-3 text-lg font-semibold transition",
                mode === item.id
                  ? "bg-white text-[var(--erg-blue)] shadow-sm"
                  : "text-slate-900",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onModeChange(mode === "login" ? "register" : "login")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={t("auth.switchMode")}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mt-8 rounded-[24px] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.35)] sm:px-7 sm:py-8">
        {mode === "login" ? (
          <>
            <div className="text-center">
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-slate-950 sm:text-[24px]">
                {t("auth.loginTeacherHub")}
              </h2>
              <p className="mt-3 text-lg leading-8 text-slate-500">
                {t("auth.loginSubtitle")}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <SocialButton
                icon={<AppleIcon />}
                label={t("auth.loginWithApple")}
                onClick={() => onProviderLogin("apple")}
              />
              <SocialButton
                icon={<GoogleIcon />}
                label={t("auth.loginWithGoogle")}
                onClick={() => onProviderLogin("google")}
              />
            </div>

            <DividerText text={t("auth.orContinueWith")} />

            <form className="mt-7 space-y-5" onSubmit={onLoginSubmit}>
              <Field label={t("auth.email")}>
                <input
                  className={inputClassName}
                  value={loginForm.email}
                  onChange={(event) =>
                    onLoginFormChange({
                      ...loginForm,
                      email: event.target.value,
                    })
                  }
                  placeholder={t("auth.placeholderWorkEmail")}
                  type="email"
                />
              </Field>

              <Field
                label={t("auth.password")}
                action={
                  <button
                    type="button"
                    className="font-medium text-slate-600 hover:text-slate-900"
                    onClick={onForgotPassword}
                  >
                    {t("auth.forgotPassword")}
                  </button>
                }
              >
                <div className="relative">
                  <input
                    className={cn(inputClassName, "pr-12")}
                    value={loginForm.password}
                    onChange={(event) =>
                      onLoginFormChange({
                        ...loginForm,
                        password: event.target.value,
                      })
                    }
                    placeholder={t("auth.enterPassword")}
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={onShowPasswordToggle}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label={t("auth.showHidePassword")}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </Field>

              <label className="inline-flex items-center gap-3 text-lg text-slate-700">
                <input
                  checked={rememberMe}
                  onChange={(event) => onRememberMeChange(event.target.checked)}
                  className="h-5 w-5 rounded border-slate-300 accent-[var(--erg-blue)]"
                  type="checkbox"
                />
                {t("auth.rememberMe")}
              </label>

              <button className={submitButtonClassName} type="submit">
                {t("auth.login")}
              </button>
            </form>

            <div className="mt-7 text-center text-lg text-slate-600">
              {t("auth.noAccount")}{" "}
              <button
                type="button"
                className="font-semibold text-slate-900 underline underline-offset-4"
                onClick={() => onModeChange("register")}
              >
                {t("auth.registerNow")}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-slate-950 sm:text-[24px]">
                {t("auth.createTeacherAccount")}
              </h2>
              <p className="mt-3 text-lg leading-8 text-slate-500">
                {t("auth.registerSubtitle")}
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={onRegisterSubmit}>
              <Field label={t("auth.fullName")}>
                <input
                  className={inputClassName}
                  value={registerForm.fullName}
                  onChange={(event) =>
                    onRegisterFormChange({
                      ...registerForm,
                      fullName: event.target.value,
                    })
                  }
                  placeholder={t("auth.placeholderName")}
                  type="text"
                />
              </Field>

              <Field label={t("auth.internalEmail")}>
                <input
                  className={inputClassName}
                  value={registerForm.email}
                  onChange={(event) =>
                    onRegisterFormChange({
                      ...registerForm,
                      email: event.target.value,
                    })
                  }
                  placeholder={t("auth.placeholderWorkEmail")}
                  type="email"
                />
              </Field>

              <Field label={t("auth.department")}>
                <input
                  className={inputClassName}
                  value={registerForm.department}
                  onChange={(event) =>
                    onRegisterFormChange({
                      ...registerForm,
                      department: event.target.value,
                    })
                  }
                  placeholder={t("auth.placeholderDepartment")}
                  type="text"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t("auth.password")}>
                  <input
                    className={inputClassName}
                    value={registerForm.password}
                    onChange={(event) =>
                      onRegisterFormChange({
                        ...registerForm,
                        password: event.target.value,
                      })
                    }
                    placeholder={t("auth.placeholderPasswordMin")}
                    type="password"
                  />
                </Field>
                <Field label={t("auth.confirmPassword")}>
                  <input
                    className={inputClassName}
                    value={registerForm.confirmPassword}
                    onChange={(event) =>
                      onRegisterFormChange({
                        ...registerForm,
                        confirmPassword: event.target.value,
                      })
                    }
                    placeholder={t("auth.placeholderConfirmPassword")}
                    type="password"
                  />
                </Field>
              </div>

              <button className={submitButtonClassName} type="submit">
                {t("auth.createAccount")}
              </button>
            </form>

            <div className="mt-7 text-center text-lg text-slate-600">
              {t("auth.hasAccount")}{" "}
              <button
                type="button"
                className="font-semibold text-slate-900 underline underline-offset-4"
                onClick={() => onModeChange("login")}
              >
                {t("auth.backToLogin")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
