"use client";

import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ERG_ASSETS } from "@/config/seo";
import { TeacherAuthDialog } from "@/features/auth/components/teacher-auth-dialog";
import { HocLieuLink as Link } from "@/features/hoclieu/components/hoclieu-link";
import {
    Search,
    UserPlus,
    Menu,
    Globe,
    Users,
    ChevronDown,
    ChevronRight,
    X,
    BookOpen,
    LogOut,
    User,
    Settings,
    Sparkles,
} from 'lucide-react';
import { COURSE_GROUPS, FLAT_PROGRAMS, QUICK_ACCESS_NAV, TOTAL_LESSON_SHELVES, type CourseColor } from "@/features/hoclieu/api/hoclieu-data";

// Helper Ä‘á»ƒ láº¥y mÃ u sáº¯c theo tag
const getColorClass = (color: CourseColor) => {
    switch (color) {
        case 'blue': return 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100';
        case 'red': return 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100';
        case 'indigo': return 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100';
        case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100';
        default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
};

const getAccentClass = (color: CourseColor) => {
    switch (color) {
        case 'blue': return 'from-[#00008b] to-blue-500';
        case 'red': return 'from-[#cc0022] to-rose-500';
        case 'indigo': return 'from-indigo-700 to-indigo-400';
        case 'emerald': return 'from-emerald-600 to-teal-400';
        default: return 'from-slate-700 to-slate-400';
    }
};

function HocLieuPageLayout({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation();
    const isAuthLoading = false;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    const isAuthenticated = false;
    const displayName = "Giao vien ERG";
    const displayEmail = "";
    const displayAvatar = ERG_ASSETS.logo;

    const handleOpenAuth = () => setIsAuthDialogOpen(true);
    const handleLogout = () => {
        setIsAuthDialogOpen(false);
    };

    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }

        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
            activeElement.blur();
        }
    }, [pathname]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#00008b]/10">
            {/* NAVIGATION */}
            <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[100] transition-all duration-300">
                <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between gap-4 md:h-24 xl:gap-6 2xl:gap-8">
                        {/* LOGO SECTION */}
                        <div className="flex min-w-0 shrink-0 items-center gap-4 xl:flex-none">
                            <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform duration-300">
                                <div className="flex-shrink-0">
                                    <Image
                                        src={ERG_ASSETS.logo}
                                        alt="ERG Logo"
                                        width={110}
                                        height={60}
                                        className="object-contain w-[90px] md:w-[100px]"
                                        priority
                                    />
                                </div>
                                <div className="flex min-w-0 flex-col">
                                    <h2 className="text-base md:text-lg font-black leading-none tracking-tight text-[#00008b] uppercase whitespace-nowrap">
                                        Teacher <span className="text-[#cc0022]">Hub</span>
                                    </h2>
                                    <p className="mt-1 text-[8px] font-bold tracking-[0.18em] text-slate-400 uppercase md:text-[9px] xl:block hidden">
                                        Internal ERG Portal
                                    </p>
                                </div>
                            </Link>
                        </div>

                        {/* DESKTOP SUBJECT MENU */}
                        <div className="hidden xl:flex xl:min-w-0 xl:flex-1 xl:items-center xl:justify-center xl:pl-6 2xl:pl-8">
                            <div className="flex min-w-0 items-center justify-center gap-6 2xl:gap-8">
                                <div
                                    className="group relative flex h-full shrink-0 items-center justify-center"
                                >
                                    <Link href="/chuong-trinh" className="relative flex items-center gap-2 whitespace-nowrap py-4 text-[15px] font-black uppercase tracking-[0.04em] text-[#00008b] transition-all duration-300 hover:text-[#cc0022] group-hover:text-[#cc0022] group-focus-within:text-[#cc0022] 2xl:text-[16px] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#cc0022] after:transition-all after:duration-300 group-hover:after:w-full group-focus-within:after:w-full">
                                        ChÆ°Æ¡ng trÃ¬nh
                                        <ChevronDown className="h-3.5 w-3.5 text-slate-300 transition-transform duration-300 group-hover:rotate-180 group-hover:text-[#cc0022] group-focus-within:rotate-180 group-focus-within:text-[#cc0022]" strokeWidth={3} />
                                    </Link>

                                    <div className="absolute top-full left-1/2 z-30 mt-0 w-[min(92vw,860px)] -translate-x-1/2 origin-top overflow-hidden rounded-[28px] border border-slate-100 bg-white opacity-0 shadow-[0_30px_90px_-20px_rgba(15,23,42,0.24)] transition-all duration-200 invisible -translate-y-2 scale-[0.98] group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
                                        <div className="grid grid-cols-[260px_minmax(0,1fr)]">
                                            <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_38%),linear-gradient(155deg,#00008b_0%,#1d4ed8_42%,#0f172a_100%)] p-7 text-white">
                                                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.18)_100%)]" />
                                                <div className="relative z-10 space-y-5">
                                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-white/80">
                                                        <Sparkles className="h-3.5 w-3.5" />
                                                        Teacher Hub
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black leading-tight">Má»™t menu gá»n cho toÃ n bá»™ há»‡ chÆ°Æ¡ng trÃ¬nh.</p>
                                                        <p className="mt-3 text-sm leading-6 text-white/76">
                                                            Tá»« giá» chá»‰ cáº§n má»Ÿ má»™t cá»¥m â€œChÆ°Æ¡ng trÃ¬nhâ€, sau nÃ y thÃªm khÃ³a há»c má»›i cÅ©ng khÃ´ng lÃ m header bá»‹ ná»Ÿ ngang.
                                                        </p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Tracks</p>
                                                            <p className="mt-2 text-3xl font-black">{FLAT_PROGRAMS.length}</p>
                                                        </div>
                                                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Tá»§ há»c liá»‡u</p>
                                                            <p className="mt-2 text-3xl font-black">{TOTAL_LESSON_SHELVES}+</p>
                                                        </div>
                                                    </div>
                                                    <Link href="/kho-hoc-lieu" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#00008b] transition-all hover:translate-x-1">
                                                        Má»Ÿ kho há»c liá»‡u
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="max-h-[70vh] overflow-y-auto overscroll-contain p-6">
                                                <div className="space-y-6">
                                                    {COURSE_GROUPS.map((group) => (
                                                        <div key={group.title} className="space-y-3">
                                                            <div className="flex items-end justify-between gap-4 border-b border-slate-100 pb-3">
                                                                <div>
                                                                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">{group.title}</p>
                                                                    <p className="mt-1 text-sm leading-6 text-slate-500">{group.description}</p>
                                                                </div>
                                                                <span className="hidden rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 xl:inline-flex">
                                                                    {group.programs.length} chÆ°Æ¡ng trÃ¬nh
                                                                </span>
                                                            </div>

                                                            <div className="grid gap-3 xl:grid-cols-2">
                                                                {group.programs.map((program) => {
                                                                    const ProgramIcon = program.items[0]?.icon || BookOpen;

                                                                    return (
                                                                        <Link
                                                                            key={program.slug}
                                                                            href={program.href}
                                                                            prefetch={false}
                                                                            className="group/program rounded-[24px] border border-slate-100 bg-slate-50/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                                                                        >
                                                                            <div className="flex items-start justify-between gap-3">
                                                                                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br text-white shadow-sm ${getAccentClass(program.color)}`}>
                                                                                    <ProgramIcon className="h-5 w-5" />
                                                                                </div>
                                                                                <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${getColorClass(program.color)}`}>
                                                                                    {program.badge}
                                                                                </span>
                                                                            </div>
                                                                            <div className="mt-4">
                                                                                <h3 className="text-[15px] font-black tracking-tight text-slate-900 transition-colors group-hover/program:text-[#00008b]">
                                                                                    {program.name}
                                                                                </h3>
                                                                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                                                                    {program.summary}
                                                                                </p>
                                                                            </div>
                                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                                {program.items.slice(0, 3).map((item) => (
                                                                                    <span
                                                                                        key={item.name}
                                                                                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500"
                                                                                    >
                                                                                        {item.name}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex min-w-0 items-center gap-6 2xl:gap-8">
                                    {QUICK_ACCESS_NAV.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            prefetch={false}
                                            className="relative group inline-flex shrink-0 items-center justify-center whitespace-nowrap py-4 text-[15px] font-black uppercase tracking-[0.04em] text-[#00008b] transition-colors hover:text-[#cc0022] 2xl:text-[16px]"
                                        >
                                            {item.label}
                                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#cc0022] transition-all group-hover:w-[72%]"></span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT ACTIONS */}
                        <div className="flex shrink-0 items-center justify-end gap-3 xl:flex-none 2xl:gap-4">
                            <button className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#00008b] transition-all group hover:bg-slate-100 active:scale-90 xl:flex">
                                <Search className="w-5.5 h-5.5 group-hover:scale-110 transition-transform" />
                            </button>

                            {isAuthenticated ? (
                                <div className="group relative">
                                    <button type="button" className="flex shrink-0 items-center gap-3 rounded-full border border-slate-100 bg-slate-50 p-1.5 shadow-sm transition-all duration-300 group-hover:bg-white active:scale-95">
                                        <div className="flex flex-col items-end hidden sm:flex pl-3">
                                            <span className="text-[11px] font-black text-slate-900 leading-none">{displayName}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">GV Há»‡ thá»‘ng</span>
                                        </div>
                                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                            <Image
                                                src={displayAvatar}
                                                alt="profile"
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                    </button>

                                    {/* User Dropdown */}
                                    <div className="absolute top-full right-0 mt-0 w-56 origin-top-right pt-2 opacity-0 transition-all duration-200 invisible -translate-y-2 scale-[0.98] group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
                                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                                            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">TÃ i khoáº£n giáº£ng viÃªn</p>
                                                <p className="text-xs font-bold text-slate-600 truncate mt-1">{displayEmail}</p>
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#00008b] transition-all group/item">
                                                    <User className="w-4 h-4 text-slate-400 group-hover/item:text-[#00008b]" />
                                                    <span className="text-xs font-bold">Há»“ sÆ¡ cá»§a tÃ´i</span>
                                                </button>
                                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#00008b] transition-all group/item">
                                                    <Settings className="w-4 h-4 text-slate-400 group-hover/item:text-[#00008b]" />
                                                    <span className="text-xs font-bold">CÃ i Ä‘áº·t Hub</span>
                                                </button>
                                                <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-700 hover:text-red-600 transition-all group/item"
                                                >
                                                    <LogOut className="w-4 h-4 text-slate-400 group-hover/item:text-red-600" />
                                                    <span className="text-xs font-bold font-oswald uppercase tracking-widest text-red-600">ÄÄƒng xuáº¥t</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleOpenAuth}
                                    className="hidden shrink-0 items-center gap-2 rounded-full bg-[#00008b] px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-xl shadow-blue-200/50 transition-all duration-500 hover:-translate-y-0.5 hover:bg-[#cc0022] active:scale-95 sm:flex xl:px-5 2xl:px-6 2xl:text-[12px]"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    {isAuthLoading ? "..." : "ÄÄƒng kÃ½ GV"}
                                </button>
                            )}

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="xl:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-slate-100 text-[#00008b] active:scale-95 shadow-sm"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-7 h-7" strokeWidth={2.5} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div className={`xl:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-xl z-[90] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
                   <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
                        <div className="rounded-[28px] bg-[linear-gradient(145deg,#00008b_0%,#1d4ed8_50%,#0f172a_100%)] p-5 text-white shadow-2xl shadow-blue-200/40">
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/70">Teacher Hub</p>
                            <h3 className="mt-3 text-2xl font-black leading-tight">Má»™t menu gá»n Ä‘á»ƒ quáº£n lÃ½ má»i lá»™ trÃ¬nh há»c.</h3>
                            <p className="mt-3 text-sm leading-6 text-white/80">
                                Gom toÃ n bá»™ khÃ³a há»c vÃ o tá»«ng nhÃ³m Ä‘á»ƒ sau nÃ y má»Ÿ rá»™ng thÃªm váº«n rÃµ rÃ ng trÃªn mobile.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {QUICK_ACCESS_NAV.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    prefetch={false}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-[#00008b]">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{item.label}</p>
                                            <p className="text-xs text-slate-500">{item.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-300" />
                                </Link>
                            ))}
                        </div>

                        {COURSE_GROUPS.map((group) => (
                            <div key={group.title} className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{group.title}</p>
                                    <p className="mt-1 text-sm text-slate-500">{group.description}</p>
                                </div>
                                <div className="grid gap-3">
                                    {group.programs.map((program) => {
                                        const ProgramIcon = program.items[0]?.icon || BookOpen;

                                        return (
                                            <Link
                                                key={program.slug}
                                                href={program.href}
                                                prefetch={false}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm active:scale-[0.98] transition-all"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${getAccentClass(program.color)}`}>
                                                            <ProgramIcon className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">{program.name}</p>
                                                            <p className="mt-1 text-xs text-slate-500">{program.summary}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${getColorClass(program.color)}`}>
                                                        {program.badge}
                                                    </span>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {program.items.slice(0, 3).map((item) => (
                                                        <span
                                                            key={item.name}
                                                            className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"
                                                        >
                                                            {item.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        <div className="pt-8 border-t border-slate-100">
                             {!isAuthenticated && (
                                <button
                                    onClick={handleOpenAuth}
                                    className="w-full py-5 bg-[#00008b] text-white font-black rounded-2xl uppercase tracking-[0.2em]"
                                >
                                    Cá»•ng giÃ¡o viÃªn ERG
                                </button>
                             )}
                        </div>
                   </div>
                </div>
            </nav>
            <TeacherAuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />

            {/* MAIN CONTENT */}
            <main className="relative min-h-[60vh]">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-slate-900 pt-20 pb-10 text-slate-400 relative overflow-hidden mt-20">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="col-span-1 md:col-span-2 space-y-8">
                            <Link href="/" className="flex items-center gap-3">
                                <Image
                                    src={ERG_ASSETS.logo}
                                    alt="ERG Logo"
                                    width={100}
                                    height={50}
                                    className="brightness-0 invert opacity-90"
                                />
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-black text-white uppercase italic leading-none">
                                        Teacher<span className="text-[#cc0022]">Hub</span>
                                    </h2>
                                    <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mt-1">
                                        Internal ERG Portal
                                    </p>
                                </div>
                            </Link>
                            <p className="max-w-md text-sm leading-relaxed font-medium">
                                Ná»n táº£ng há»c liá»‡u chuáº©n quá»‘c táº¿ dÃ nh riÃªng cho giáº£ng viÃªn ERG. CÃ¹ng cá»™ng Ä‘á»“ng 1.2k+ giÃ¡o viÃªn kiáº¿n táº¡o bÃ i giáº£ng tháº¿ há»‡ má»›i.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#00008b] transition-all"><Globe className="w-5 h-5" /></Link>
                                <Link href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#cc0022] transition-all"><Users className="w-5 h-5" /></Link>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-[#cc0022]"></span>
                                Lá»™ trÃ¬nh ÄÃ o táº¡o
                            </h4>
                            <ul className="space-y-4 text-xs font-bold">
                                {FLAT_PROGRAMS.map((program) => (
                                    <li key={program.slug}><Link href={program.href} className="hover:text-white transition-colors uppercase tracking-widest">{program.name}</Link></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-black mb-8 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-[#cc0022]"></span>
                                LiÃªn káº¿t ná»™i bá»™
                            </h4>
                            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                                <li><Link href="/kho-hoc-lieu" className="hover:text-white transition-colors">Kho há»c liá»‡u</Link></li>
                                <li><Link href="/cong-dong" className="hover:text-white transition-colors">Cá»™ng Ä‘á»“ng giÃ¡o viÃªn</Link></li>
                                <li><Link href="/portfolio" className="hover:text-white transition-colors">BÃ¡o cÃ¡o bÃ i giáº£ng</Link></li>
                                <li><Link href="/quizzes" className="hover:text-white transition-colors">Quiz Bank</Link></li>
                                <li><Link href="mailto:it@erg.edu.vn" className="text-[#cc0022]">Há»— trá»£ ká»¹ thuáº­t IT</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 text-center flex flex-col md:flex-row items-center justify-between gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
                        <span>Â© 2026 EDURISE GLOBAL â€¢ INTERNAL USE ONLY</span>
                        <div className="flex gap-8">
                            <Link href="#" className="hover:text-white transition-colors">Báº£o máº­t</Link>
                            <Link href="#" className="hover:text-white transition-colors">Quy trÃ¬nh</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}


type HocLieuImageProps = React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean };

function Image({ priority, alt, ...props }: HocLieuImageProps) {
    void priority;
    return <img alt={alt ?? ""} {...props} />;
}

export function HocLieuLayout() {
    return (
        <HocLieuPageLayout>
            <Outlet />
        </HocLieuPageLayout>
    );
}
