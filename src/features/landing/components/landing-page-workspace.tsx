import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { cn } from "@/lib/utils";

type LoginRole = "teacher" | "student";

type LandingLoginForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const trainingAreas = [
  {
    title: "Tin học Quốc tế",
    description: "Luyện thi MOS, IC3 Spark và IC3 GS6 theo lộ trình chuẩn quốc tế.",
  },
  {
    title: "Tin học Thiếu nhi",
    description: "Khơi dậy tư duy công nghệ, logic và kỹ năng giải quyết vấn đề từ sớm.",
  },
  {
    title: "Công dân số",
    description: "Trang bị an toàn trực tuyến, đạo đức số và kỹ năng học tập hiện đại.",
  },
];

const newsItems = [
  {
    date: "15/12/2024",
    title: "Lễ ký kết hợp tác chiến lược đào tạo nhân lực số 2025",
  },
  {
    date: "10/12/2024",
    title: "Khai giảng khóa học MOS Specialist - Ưu đãi 30%",
  },
  {
    date: "05/12/2024",
    title: "Hội thảo: Ứng dụng AI trong học tập và văn phòng",
  },
];

export function LandingPageWorkspace() {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-4">
          <Brand />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <a href="#home" className="hover:text-[var(--erg-blue)]">Trang chủ</a>
            <a href="#programs" className="hover:text-[var(--erg-blue)]">Chương trình</a>
            <a href="#news" className="hover:text-[var(--erg-blue)]">Tin tức</a>
            <a href="#about" className="hover:text-[var(--erg-blue)]">Về ERG</a>
          </nav>
          <button
            type="button"
            className="rounded-md bg-[var(--erg-blue)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#060b7a]"
            onClick={() => setLoginOpen(true)}
          >
            Đăng nhập
          </button>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0">
          <img
            alt="Học sinh học công nghệ tại ERG"
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1800&q=85"
          />
          <div className="absolute inset-0 bg-white/82" />
        </div>

        <div className="relative mx-auto grid min-h-[620px] max-w-[1180px] gap-8 px-4 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-[var(--erg-red)]/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--erg-red)]">
              Learn today, lead tomorrow
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-[var(--erg-blue)] sm:text-5xl">
              Tiên phong đào tạo Công nghệ & Kỹ năng số
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              ERG eLearning kết nối giáo viên, học sinh và phụ huynh trong một nền tảng học tập số rõ ràng,
              hiện đại, bám sát lộ trình đào tạo chuẩn quốc tế.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-md bg-[var(--erg-blue)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#060b7a]"
                onClick={() => setLoginOpen(true)}
              >
                Bắt đầu học tập
              </button>
              <a
                href="#programs"
                className="rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[var(--erg-blue)] shadow-sm hover:bg-slate-50"
              >
                Khám phá chương trình
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_26px_80px_-40px_rgba(15,23,42,0.35)]">
            <div className="text-sm font-semibold text-slate-500">Nền tảng ERG eLearning</div>
            <div className="mt-4 grid gap-3">
              {[
                ["Lớp học số", "Giao bài, làm bài, theo dõi tiến độ theo lớp."],
                ["Thảo luận lớp", "Học sinh hỏi bài, trao đổi và nhận phản hồi."],
                ["Thông báo giáo viên", "Tin quan trọng được gửi tới học sinh hoặc cả lớp."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="font-semibold text-[var(--erg-blue)]">{title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">{description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-[1180px] px-4 py-14">
        <div className="max-w-2xl">
          <div className="text-sm font-bold uppercase text-[var(--erg-red)]">Lĩnh vực đào tạo</div>
          <h2 className="mt-2 text-3xl font-bold text-[var(--erg-blue)]">Chương trình trọng điểm</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {trainingAreas.map((area) => (
            <article key={area.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--erg-blue)]">{area.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="news" className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-[1180px] px-4 py-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-bold uppercase text-[var(--erg-red)]">Tin tức & Sự kiện</div>
              <h2 className="mt-2 text-3xl font-bold text-[var(--erg-blue)]">Cập nhật từ ERG</h2>
            </div>
            <a className="text-sm font-semibold text-[var(--erg-blue)]" href="#news">Xem tất cả</a>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {newsItems.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-[var(--erg-red)]">{item.date}</div>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-950">{item.title}</h3>
                <div className="mt-4 text-sm font-semibold text-[var(--erg-blue)]">Xem chi tiết →</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1180px] px-4 py-14">
        <div className="rounded-xl bg-[var(--erg-blue)] p-8 text-white">
          <div className="text-sm font-bold uppercase text-white/70">Về chúng tôi</div>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold">Kiến tạo nền tảng vững chắc cho tương lai</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
            ERG tập trung vào đào tạo công nghệ, tin học quốc tế và kỹ năng số, giúp học sinh tự tin bước vào
            môi trường học tập và làm việc hiện đại.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <Brand />
          <div className="text-sm text-slate-500">© 2026 Edurise Global. All rights reserved.</div>
        </div>
      </footer>

      {loginOpen ? (
        <LoginChooser
          onClose={() => setLoginOpen(false)}
          onNavigate={(path) => {
            setLoginOpen(false);
            navigate(path);
          }}
        />
      ) : null}
    </main>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-3xl font-black leading-none">
        <span className="text-[var(--erg-blue)]">ER</span>
        <span className="text-[var(--erg-red)]">G</span>
      </div>
      <div>
        <div className="text-lg font-bold leading-none text-[var(--erg-blue)]">EDURISE GLOBAL</div>
        <div className="mt-1 text-[10px] font-bold uppercase text-slate-400">Learn today, lead tomorrow</div>
      </div>
    </div>
  );
}

function LoginChooser({ onClose, onNavigate }: { onClose: () => void; onNavigate: (path: string) => void }) {
  const teacherAuth = useAuthSession();
  const [selectedRole, setSelectedRole] = useState<LoginRole | null>(null);
  const [loginForm, setLoginForm] = useState<LandingLoginForm>({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const roleConfig = selectedRole ? loginRoleConfig[selectedRole] : null;

  function chooseRole(role: LoginRole) {
    const config = loginRoleConfig[role];
    setSelectedRole(role);
    setErrorMessage(null);
    teacherAuth.setNotice(null);
    setLoginForm({
      email: config.defaultEmail,
      password: config.defaultPassword,
      rememberMe: true,
    });
  }

  function runTeacherAuth(action: () => void) {
    try {
      action();
      onNavigate("/dashboard");
    } catch (error) {
      teacherAuth.setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Không thể đăng nhập giáo viên.",
      });
    }
  }

  function handleTeacherLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runTeacherAuth(teacherAuth.actions.login);
  }

  function handleTeacherRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runTeacherAuth(teacherAuth.actions.register);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRole) return;

    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    if (loginForm.email.trim().toLowerCase() !== "student@erg.vn" || loginForm.password !== "12345678") {
      setErrorMessage("Tài khoản học sinh demo là student@erg.vn / 12345678.");
      return;
    }

    window.localStorage.setItem(
      "erg-learning.student-session",
      JSON.stringify({
        className: "Lớp 6A1",
        email: loginForm.email.trim().toLowerCase(),
        loggedInAt: new Date().toISOString(),
        name: "Võ Ngọc Linh",
      }),
    );
    onNavigate("/student");
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4">
      <div className="max-h-[92vh] w-full max-w-[860px] overflow-y-auto rounded-xl bg-white p-5 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.5)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--erg-blue)]">
              {roleConfig ? roleConfig.heading : "Đăng nhập ERG eLearning"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {roleConfig ? roleConfig.subtitle : "Chọn đúng không gian làm việc của bạn."}
            </p>
          </div>
          <button className="text-sm font-semibold text-slate-500" type="button" onClick={onClose}>
            Đóng
          </button>
        </div>

        {selectedRole === "teacher" ? (
          <div className="mt-5">
            <button
              className="mb-4 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() => {
                setSelectedRole(null);
                teacherAuth.setNotice(null);
              }}
              type="button"
            >
              Quay lại chọn vai trò
            </button>

            {teacherAuth.notice ? (
              <div
                className={cn(
                  "mb-4 rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm",
                  teacherAuth.notice.tone === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : teacherAuth.notice.tone === "error"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-blue-200 bg-blue-50 text-blue-700",
                )}
              >
                {teacherAuth.notice.message}
              </div>
            ) : null}

            <AuthFormPanel
              mode={teacherAuth.mode}
              rememberMe={teacherAuth.rememberMe}
              showPassword={teacherAuth.showPassword}
              loginForm={teacherAuth.loginForm}
              registerForm={teacherAuth.registerForm}
              onModeChange={teacherAuth.setMode}
              onRememberMeChange={teacherAuth.setRememberMe}
              onShowPasswordToggle={() => teacherAuth.setShowPassword((current) => !current)}
              onLoginFormChange={teacherAuth.setLoginForm}
              onRegisterFormChange={teacherAuth.setRegisterForm}
              onLoginSubmit={handleTeacherLoginSubmit}
              onRegisterSubmit={handleTeacherRegisterSubmit}
              onForgotPassword={teacherAuth.actions.forgotPassword}
              onProviderLogin={(provider) => runTeacherAuth(() => teacherAuth.actions.loginByProvider(provider))}
            />
          </div>
        ) : selectedRole === "student" ? (
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <span className="font-semibold text-[var(--erg-blue)]">Tài khoản demo:</span>{" "}
              {roleConfig?.defaultEmail} / {roleConfig?.defaultPassword}
            </div>

            {errorMessage ? (
              <div className="rounded-lg border border-[var(--erg-red)]/20 bg-[var(--erg-red)]/5 px-4 py-3 text-sm font-medium text-[var(--erg-red)]">
                {errorMessage}
              </div>
            ) : null}

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">{roleConfig?.emailLabel}</span>
              <input
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-[var(--erg-blue)] focus:ring-4 focus:ring-[var(--erg-blue)]/10"
                onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                type="email"
                value={loginForm.email}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Mật khẩu</span>
              <input
                className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-[var(--erg-blue)] focus:ring-4 focus:ring-[var(--erg-blue)]/10"
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                type="password"
                value={loginForm.password}
              />
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <input
                checked={loginForm.rememberMe}
                className="h-4 w-4 rounded border-slate-300 text-[var(--erg-blue)]"
                onChange={(event) => setLoginForm((current) => ({ ...current, rememberMe: event.target.checked }))}
                type="checkbox"
              />
              Ghi nhớ đăng nhập
            </label>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                onClick={() => {
                  setSelectedRole(null);
                  setErrorMessage(null);
                }}
                type="button"
              >
                Quay lại chọn vai trò
              </button>
              <button
                className="rounded-md bg-[var(--erg-blue)] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#060b7a]"
                type="submit"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <LoginCard
              className="border-[var(--erg-blue)]/20 bg-[var(--erg-blue)]/5"
              description="Quản lý lớp học, giao bài, theo dõi tiến độ và gửi thông báo cho học sinh."
              onClick={() => chooseRole("teacher")}
              title="Dành cho giáo viên"
            />
            <LoginCard
              className="border-[var(--erg-red)]/20 bg-[var(--erg-red)]/5"
              description="Làm bài tập, xem điểm, nhận thông báo và trao đổi cùng lớp."
              onClick={() => chooseRole("student")}
              title="Dành cho học sinh"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function LoginCard({
  className,
  description,
  onClick,
  title,
}: {
  className?: string;
  description: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className={cn("rounded-xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md", className)}
      onClick={onClick}
      type="button"
    >
      <h3 className="text-lg font-bold text-[var(--erg-blue)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4 text-sm font-semibold text-[var(--erg-blue)]">Tiếp tục →</div>
    </button>
  );
}

const loginRoleConfig: Record<
  LoginRole,
  {
    defaultEmail: string;
    defaultPassword: string;
    emailLabel: string;
    heading: string;
    subtitle: string;
  }
> = {
  teacher: {
    defaultEmail: "teacher@erg.vn",
    defaultPassword: "12345678",
    emailLabel: "Email giáo viên",
    heading: "Đăng nhập giáo viên",
    subtitle: "Vào khu vực quản lý lớp học, giao bài và thông báo.",
  },
  student: {
    defaultEmail: "student@erg.vn",
    defaultPassword: "12345678",
    emailLabel: "Email học sinh",
    heading: "Đăng nhập học sinh",
    subtitle: "Vào khu vực làm bài, xem điểm và nhận thông báo từ giáo viên.",
  },
};
