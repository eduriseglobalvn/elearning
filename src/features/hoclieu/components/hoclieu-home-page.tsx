import { HocLieuLink as Link } from "@/features/hoclieu/components/hoclieu-link";
import {
    Download,
    GraduationCap,
    CheckCircle2,
    ArrowRight,
    FileText,
    FileSpreadsheet,
    Presentation,
    Zap,
    ShieldCheck,
    Layout,
    Database,
    LineChart,
    MousePointer2,
    Search
} from 'lucide-react';

export function HocLieuHomePage() {
    return (
        <div className="pb-24 bg-[#FAFAFA]">
            {/* HERO SECTION - REBRANDED AS MULTI-SUBJECT HUB */}
            <section className="relative overflow-hidden pt-20 pb-32">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-red-100/30 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
                            <span className="flex h-2 w-2 rounded-full bg-[#cc0022] animate-ping"></span>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Cá»•ng Ä‘Ã o táº¡o nÄƒng lá»±c sá»‘ chuáº©n Quá»‘c táº¿</span>
                        </div>

                        <h1 className="text-6xl lg:text-8xl font-extrabold text-slate-900 leading-[0.95] tracking-tighter">
                            Trung tÃ¢m <span className="text-[#00008b]">Huáº¥n luyá»‡n</span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc0022] to-red-600">Äa ná»n táº£ng</span>
                        </h1>

                        <p className="text-xl text-slate-600 leading-relaxed max-w-xl font-medium">
                            Kho há»c liá»‡u chuyÃªn sÃ¢u dÃ nh riÃªng cho giÃ¡o viÃªn ERG. TÃ­ch há»£p trá»n bá»™ tÃ i liá»‡u giáº£ng dáº¡y
                            <span className="text-slate-900 font-bold border-b-2 border-red-200 ml-1">IC3 GS6</span>,
                            <span className="text-slate-900 font-bold border-b-2 border-blue-200 ml-1">MOS (Word, Excel, PPT)</span>
                            vÃ  cÃ¡c chuyÃªn Ä‘á» ká»¹ nÄƒng sá»‘ thiáº¿t yáº¿u khÃ¡c.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-5">
                            <Link href="/chuong-trinh" className="w-full sm:w-auto px-10 py-5 bg-[#00008b] hover:bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl shadow-blue-200/50 group">
                                <Search className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                KhÃ¡m phÃ¡ chÆ°Æ¡ng trÃ¬nh
                            </Link>
                            <Link href="/portfolio" className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 text-slate-900 font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-400 border border-slate-200 shadow-sm">
                                <Layout className="w-5 h-5" />
                                Portfolio bÃ i giáº£ng
                            </Link>
                        </div>

                        <div className="flex items-center gap-12 pt-6 border-t border-slate-200 font-oswald">
                           <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                               <span className="text-4xl font-black text-[#00008b]">09+</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chá»©ng chá»‰ há»— trá»£</span>
                           </div>
                           <div className="flex flex-col border-l border-slate-200 pl-12 items-center sm:items-start text-center sm:text-left">
                               <span className="text-4xl font-black text-[#cc0022]">2.5k+</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">File trÃ¬nh chiáº¿u chuáº©n</span>
                           </div>
                        </div>
                    </div>

                    {/* MULTI-SUBJECT PROGRESS MOCKUP */}
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-tr from-[#00008b] via-[#cc0022] to-yellow-400 rounded-[50px] blur-xl opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative bg-white border border-slate-100 rounded-[45px] shadow-2xl overflow-hidden p-4">
                            <div className="bg-slate-50 rounded-[35px] p-8 lg:p-12 space-y-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">BÃ n lÃ m viá»‡c cá»§a tÃ´i</h3>
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Subject 1: MOS Excel */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                                                    <FileSpreadsheet className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-black text-slate-900 tracking-tight">MOS Excel Specialist</span>
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-600">80% ÄÃ£ hoÃ n thÃ nh</span>
                                        </div>
                                        <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100 p-0.5">
                                            <div className="h-full w-[80%] bg-emerald-500 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Subject 2: IC3 GS6 */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                                                    <Zap className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-black text-slate-900 tracking-tight">IC3 GS6 Level 3</span>
                                            </div>
                                            <span className="text-[10px] font-black text-blue-600">35% Äang há»c</span>
                                        </div>
                                        <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100 p-0.5">
                                            <div className="h-full w-[35%] bg-blue-600 rounded-full"></div>
                                        </div>
                                    </div>

                                     {/* Subject 3: MOS Word */}
                                     <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm font-black text-slate-900 tracking-tight">MOS Word Expert</span>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400">ChÆ°a báº¯t Ä‘áº§u</span>
                                        </div>
                                        <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100 p-0.5">
                                            <div className="h-full w-[0%] bg-slate-200 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-slate-900 hover:bg-[#cc0022] text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 shadow-xl">
                                    VÃ o lá»›p giáº£ng dáº¡y ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CURRICULUM VERTICALS */}
            <section className="bg-white py-32 border-y border-slate-100 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto mb-24 space-y-6">
                        <span className="text-[10px] font-black text-[#cc0022] uppercase tracking-[0.4em] bg-red-50 px-4 py-2 rounded-full">Chá»©ng chá»‰ quá»‘c táº¿ chuáº©n Certiport</span>
                        <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-tight font-oswald uppercase">Há»‡ sinh thÃ¡i bÃ i giáº£ng <br /> <span className="text-[#00008b]">ChuyÃªn sÃ¢u & ToÃ n diá»‡n</span></h2>
                        <p className="text-xl text-slate-500 leading-relaxed font-lora italic max-w-2xl mx-auto">Má»—i mÃ´n há»c Ä‘Æ°á»£c chi tiáº¿t hÃ³a Ä‘áº¿n tá»«ng Module kiáº¿n thá»©c, Ä‘áº£m báº£o giÃ¡o viÃªn luÃ´n cÃ³ Ä‘áº§y Ä‘á»§ "vÅ© khÃ­" khi lÃªn lá»›p.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* IC3 TRACK */}
                        <div className="bg-[#F8FAFC] rounded-[45px] p-10 border border-slate-100 flex flex-col items-center text-center space-y-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                            <div className="w-20 h-20 bg-white rounded-[25px] flex items-center justify-center text-4xl shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">ðŸ“˜</div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-900 font-oswald uppercase">IC3 Series</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">DÃ nh cho há»c sinh phá»• thÃ´ng náº¯m vá»¯ng ná»n táº£ng sá»‘. <br /> <strong className="text-slate-900 font-bold uppercase text-[10px]">GS6 â€¢ Spark â€¢ Digital Literacy</strong></p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 w-full">
                                <div className="p-3 bg-white rounded-2xl text-[10px] font-black uppercase text-slate-600 border border-slate-100">GS6 GS3</div>
                                <div className="p-3 bg-white rounded-2xl text-[10px] font-black uppercase text-slate-600 border border-slate-100">GS6 GS2</div>
                                <div className="p-3 bg-white rounded-2xl text-[10px] font-black uppercase text-slate-600 border border-slate-100">Spark M1</div>
                                <div className="p-3 bg-white rounded-2xl text-[10px] font-black uppercase text-slate-600 border border-slate-100">Spark M3</div>
                            </div>
                            <Link href="/chuong-trinh/ic3-gs6" className="flex items-center gap-2 text-[#00008b] font-black text-xs uppercase tracking-widest pt-4 group-hover:gap-4 transition-all">
                                Xem giÃ¡o Ã¡n IC3 <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* MOS TRACK */}
                        <div className="bg-[#00008b] rounded-[45px] p-10 flex flex-col items-center text-center space-y-8 shadow-3xl transform lg:scale-110 relative z-10 group">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[25px] flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">ðŸ†</div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-white font-oswald uppercase">MOS MASTER</h3>
                                <p className="text-sm text-white/50 leading-relaxed font-lora italic">Ká»¹ nÄƒng tin há»c vÄƒn phÃ²ng chuyÃªn sÃ¢u 365/2019/2016. Tá»‘i Æ°u cho sinh viÃªn & ngÆ°á»i Ä‘i lÃ m.</p>
                            </div>
                             <div className="flex flex-col gap-3 w-full">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        <span className="text-[11px] font-black text-white uppercase tracking-[0.1em]">MOS Word Proficient</span>
                                    </div>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                                        <span className="text-[11px] font-black text-white uppercase tracking-[0.1em]">MOS Excel Expert</span>
                                    </div>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Presentation className="w-4 h-4 text-orange-400" />
                                        <span className="text-[11px] font-black text-white uppercase tracking-[0.1em]">MOS PPT Professional</span>
                                    </div>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                </div>
                            </div>
                            <Link href="/chuong-trinh/mos" className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest pt-4 group-hover:gap-4 transition-all">
                                Xem há»c liá»‡u MOS <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* SKILLS TRACK */}
                        <div className="bg-[#F8FAFC] rounded-[45px] p-10 border border-slate-100 flex flex-col items-center text-center space-y-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                            <div className="w-20 h-20 bg-white rounded-[25px] flex items-center justify-center text-4xl shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">âš™ï¸</div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-900 font-oswald uppercase">Tech Skills</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">Ká»¹ nÄƒng bá»• trá»£ thiáº¿t yáº¿u cho ká»· nguyÃªn AI. <br /> <strong className="text-slate-900 font-bold uppercase text-[10px]">Cloud â€¢ Security â€¢ Data Viz</strong></p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 w-full">
                                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                                    <Database className="w-4 h-4 text-[#00008b]" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Khai thÃ¡c dá»¯ liá»‡u sá»•</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                                    <ShieldCheck className="w-4 h-4 text-[#cc0022]" />
                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">An ninh máº¡ng cÆ¡ báº£n</span>
                                </div>
                            </div>
                            <Link href="/chuong-trinh/tech" className="flex items-center gap-2 text-[#00008b] font-black text-xs uppercase tracking-widest pt-4 group-hover:gap-4 transition-all">
                                KhÃ¡m phÃ¡ chá»§ Ä‘á» <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* RESOURCE REPOSITORY - DETAILED SUBJECT FILTERS */}
            <section id="tai-lieu" className="py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black text-slate-900 tracking-tighter font-oswald uppercase">Kho há»c liá»‡u <span className="text-[#cc0022]">SmartLibrary</span></h2>
                            <p className="text-xl text-slate-500 italic max-w-2xl font-lora">Há»‡ thá»‘ng Slide, video, bÃ i kiá»ƒm tra giáº£ láº­p Ä‘Æ°á»£c tinh chá»‰nh cho tá»«ng mÃ´n há»c chuyÃªn biá»‡t.</p>
                        </div>
                        <div className="flex gap-2">
                             {['Táº¥t cáº£', 'MOS Excel', 'IC3 GS6', 'MOS Word'].map((cat, i) => (
                                 <button key={i} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${i===0 ? 'bg-[#00008b] text-white border-transparent' : 'bg-white text-slate-500 border-slate-200 hover:border-[#00008b]'}`}>
                                     {cat}
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* MOS EXCEL DETAIL */}
                        <div className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl hover:shadow-emerald-200/50 transition-all duration-500">
                             <div className="p-10 space-y-8">
                                 <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                        <LineChart className="w-7 h-7" />
                                    </div>
                                    <BadgeSubject label="MOS Excel" color="emerald" />
                                 </div>
                                 <div className="space-y-3">
                                    <h4 className="text-2xl font-black text-slate-900 leading-tight">Project-based Handling: <br /> Quáº£n lÃ½ nhÃ¢n sá»±</h4>
                                    <p className="text-sm text-slate-500 font-lora leading-relaxed italic">BiÃªn soáº¡n giÃ¡o Ã¡n thá»±c hÃ nh cho bÃ i toÃ¡n quáº£n lÃ½ Big Data báº±ng Pivot Table.</p>
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                     {['Báº£n 365', 'Data Viz', 'HÃ m nÃ¢ng cao'].map((tag, i) => (
                                         <span key={i} className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-lg uppercase tracking-tight">{tag}</span>
                                     ))}
                                 </div>
                                 <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                        <img src="https://media.erg.edu.vn/logo/erg.png" alt="author" className="w-6 h-6 grayscale opacity-30" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ERG Academy Repo</span>
                                     </div>
                                     <button className="p-4 bg-[#00008b] text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg hover:rotate-6">
                                         <Download className="w-5 h-5" />
                                     </button>
                                 </div>
                             </div>
                        </div>

                        {/* MOS WORD DETAIL */}
                        <div className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl hover:shadow-indigo-200/50 transition-all duration-500">
                             <div className="p-10 space-y-8">
                                 <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <BadgeSubject label="MOS Word" color="indigo" />
                                 </div>
                                 <div className="space-y-3">
                                    <h4 className="text-2xl font-black text-slate-900 leading-tight">Mastering Document <br /> Formatting (GS3/GS6)</h4>
                                    <p className="text-sm text-slate-500 font-lora leading-relaxed italic">HÆ°á»›ng dáº«n chi tiáº¿t quáº£n lÃ½ Style vÃ  trÃ­ch dáº«n theo chuáº©n IEEE vÃ  APA.</p>
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                     {['GS6 Approved', 'Academic', 'Expert'].map((tag, i) => (
                                         <span key={i} className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-lg uppercase tracking-tight">{tag}</span>
                                     ))}
                                 </div>
                                 <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                        <img src="https://media.erg.edu.vn/logo/erg.png" alt="author" className="w-6 h-6 grayscale opacity-30" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Curriculum v2025</span>
                                     </div>
                                     <button className="p-4 bg-[#00008b] text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg hover:rotate-6">
                                         <Download className="w-5 h-5" />
                                     </button>
                                 </div>
                             </div>
                        </div>

                        {/* PPT DETAIL */}
                        <div className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl hover:shadow-orange-200/50 transition-all duration-500">
                             <div className="p-10 space-y-8">
                                 <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                        <Presentation className="w-7 h-7" />
                                    </div>
                                    <BadgeSubject label="MOS PPT" color="orange" />
                                 </div>
                                 <div className="space-y-3">
                                    <h4 className="text-2xl font-black text-slate-900 leading-tight">Interactive Slide: <br /> Animation Masterclass</h4>
                                    <p className="text-sm text-slate-500 font-lora leading-relaxed italic">Bá»™ Slide máº«u cÃ³ tÃ­nh nÄƒng kÃ©o tháº£ vÃ  gameification cho giÃ¡o viÃªn THCS.</p>
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                     {['Gamified', 'Dynamic', 'Storytelling'].map((tag, i) => (
                                         <span key={i} className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-lg uppercase tracking-tight">{tag}</span>
                                     ))}
                                 </div>
                                 <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                     <div className="flex items-center gap-2">
                                        <img src="https://media.erg.edu.vn/logo/erg.png" alt="author" className="w-6 h-6 grayscale opacity-30" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Instructional Design</span>
                                     </div>
                                     <button className="p-4 bg-[#00008b] text-white rounded-2xl hover:bg-orange-600 transition-all shadow-lg hover:rotate-6">
                                         <Download className="w-5 h-5" />
                                     </button>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE SIMULATION SECTION */}
            <section className="bg-slate-900 py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-16">
                     <div className="space-y-6 max-w-3xl">
                        <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none font-oswald uppercase">Há»‡ thá»‘ng <span className="text-[#cc0022]">Thi giáº£ láº­p</span> <br /> Trá»±c tuyáº¿n</h2>
                        <p className="text-white/50 text-xl font-medium font-lora italic leading-relaxed">Giao diá»‡n phÃ²ng thi Certiport & Microsoft Ä‘Æ°á»£c mÃ´ phá»ng 100% nháº±m giÃºp há»c sinh khÃ´ng bá»‹ bá»¡ ngá»¡.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {[
                            { title: 'Excel G-Metrix', sub: 'MOS 365 Specialist', icon: <Database className="w-6 h-6"/> },
                            { title: 'Word G-Metrix', sub: 'Expert Module', icon: <FileText className="w-6 h-6"/> },
                            { title: 'IC3 Exam Demo', sub: 'GS6 Level 1/2/3', icon: <Zap className="w-6 h-6"/> },
                            { title: 'PPT Sandbox', sub: 'Slide Interaction', icon: <MousePointer2 className="w-6 h-6"/> },
                        ].map((m, i) => (
                            <button key={i} className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-left transition-all group group relative">
                                <div className="absolute top-4 right-4 text-white/20 group-hover:text-[#cc0022] transition-colors">{m.icon}</div>
                                <h4 className="text-xl font-black text-white font-oswald uppercase leading-none mb-2">{m.title}</h4>
                                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{m.sub}</p>
                            </button>
                        ))}
                     </div>
                </div>
            </section>

            {/* CTA SECTION - FINAL CALL */}
            <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[60px] p-12 lg:px-24 lg:py-20 shadow-2xl border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#00008b] opacity-10 rounded-br-full -z-10 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="space-y-8 flex-1">
                         <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#00008b]/5 rounded-full border border-[#00008b]/10">
                            <GraduationCap className="w-5 h-5 text-[#00008b]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00008b]">Join the ERG Elite Circle</span>
                         </div>
                         <h2 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] font-oswald uppercase">Háº¿t mÃ¬nh vÃ¬ <br /> <span className="text-[#cc0022]">Sá»± nghiá»‡p sá»‘</span></h2>
                         <p className="text-xl text-slate-500 max-w-xl italic font-lora leading-relaxed border-l-4 border-slate-900 pl-8">Äá»«ng Ä‘á»ƒ rÃ o cáº£n tÃ i liá»‡u kÃ¬m hÃ£m sá»± sÃ¡ng táº¡o cá»§a báº¡n. Gia nháº­p cá»™ng Ä‘á»“ng 1.2k+ giÃ¡o viÃªn ERG ngay hÃ´m nay.</p>
                    </div>

                    <div className="flex flex-col gap-6 w-full max-w-md">
                         <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Há» vÃ  tÃªn giáº£ng viÃªn</label>
                             <input type="text" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#00008b]/20 transition-all font-bold" />
                         </div>
                         <button className="w-full py-6 bg-slate-900 hover:bg-[#cc0022] text-white font-black rounded-3xl text-xs uppercase tracking-[0.4em] transition-all transform hover:-translate-y-2 shadow-2xl shadow-slate-300">
                             Gia nháº­p cá»™ng Ä‘á»“ng
                         </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Subordinate components for cleaner code
function BadgeSubject({ label, color }: { label: string, color: 'emerald' | 'indigo' | 'orange' }) {
    const colors = {
        emerald: 'bg-emerald-100 text-emerald-700',
        indigo: 'bg-indigo-100 text-indigo-700',
        orange: 'bg-orange-100 text-orange-700',
    }
    return (
        <span className={`px-3 py-1.5 ${colors[color]} text-[10px] font-black rounded-full uppercase tracking-widest`}>
            {label}
        </span>
    )
}
