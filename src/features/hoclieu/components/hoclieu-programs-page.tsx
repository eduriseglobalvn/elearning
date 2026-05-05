import { HocLieuLink as Link } from "@/features/hoclieu/components/hoclieu-link";
import { ArrowRight, BookOpenCheck, FolderOpenDot, Sparkles } from "lucide-react";

import {
  COURSE_GROUPS,
  FLAT_PROGRAMS,
  HUB_COLLECTIONS,
  TOTAL_LESSON_SHELVES,
} from "@/features/hoclieu/api/hoclieu-data";
import { INTERNAL_DOCUMENT_TYPES, INTERNAL_DOCUMENTS } from "@/features/hoclieu/api/internal-docs-data";
import {
  HocLieuCardGrid,
  HocLieuPageHero,
  HocLieuSection,
  HocLieuTimeline,
} from "@/features/hoclieu/components/hoclieu-page-shell";

export function HocLieuProgramsPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <HocLieuPageHero
        eyebrow="Program Navigator"
        title="Báº£n Ä‘á»“ chÆ°Æ¡ng trÃ¬nh dÃ nh cho toÃ n bá»™ Teacher Hub."
        description="Tá»« chá»©ng chá»‰ quá»‘c táº¿ Ä‘áº¿n cÃ¡c chuyÃªn Ä‘á» AI má»›i, má»—i chÆ°Æ¡ng trÃ¬nh Ä‘á»u cÃ³ Ä‘áº§y Ä‘á»§ giÃ¡o Ã¡n, lesson kits, mock exam, worksheet vÃ  playbook triá»ƒn khai dÃ nh cho giÃ¡o viÃªn ERG."
        stats={[
          { label: "ChÆ°Æ¡ng trÃ¬nh", value: `${FLAT_PROGRAMS.length}` },
          { label: "NhÃ³m ná»™i dung", value: `${COURSE_GROUPS.length}` },
          { label: "Tá»§ há»c liá»‡u", value: `${TOTAL_LESSON_SHELVES}+` },
        ]}
        actions={[
          { label: "Má»Ÿ kho há»c liá»‡u", href: "/kho-hoc-lieu", icon: FolderOpenDot },
          { label: "Xem quiz bank", href: "/quizzes", icon: BookOpenCheck, variant: "secondary" },
        ]}
      />

      <HocLieuSection
        eyebrow="TÃ i liá»‡u ná»™i bá»™"
        title="Bá»‘n nhÃ³m tÃ i liá»‡u chuáº©n Ä‘i cÃ¹ng má»—i chÆ°Æ¡ng trÃ¬nh."
        description="Trang chÆ°Æ¡ng trÃ¬nh chá»‰ giá»›i thiá»‡u nhanh Ä‘á»ƒ giÃ¡o viÃªn hiá»ƒu cáº¥u trÃºc. Danh sÃ¡ch file chi tiáº¿t sáº½ náº±m trong tá»«ng chÆ°Æ¡ng trÃ¬nh vÃ  trong kho há»c liá»‡u."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {INTERNAL_DOCUMENT_TYPES.map((type) => {
            const count = INTERNAL_DOCUMENTS.filter((document) => document.type === type.id).length;

            return (
              <div key={type.id} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/40">
                <span className="inline-flex rounded-full bg-[#00008b]/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#00008b]">
                  {count} tÃ i liá»‡u
                </span>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">{type.label}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{type.description}</p>
              </div>
            );
          })}
        </div>
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Tracks"
        title="Má»—i chÆ°Æ¡ng trÃ¬nh lÃ  má»™t workspace giáº£ng dáº¡y hoÃ n chá»‰nh."
        description="Thay vÃ¬ chá»‰ liá»‡t kÃª tÃªn khÃ³a há»c, Teacher Hub gom theo tá»«ng track Ä‘á»ƒ giÃ¡o viÃªn má»Ÿ vÃ o lÃ  tháº¥y ngay lá»™ trÃ¬nh, module, tÃ i liá»‡u máº«u vÃ  checklist dáº¡y há»c."
      >
        <div className="space-y-10">
          {COURSE_GROUPS.map((group) => (
            <div key={group.title} className="space-y-5 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/40 lg:p-8">
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#cc0022]">{group.title}</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">{group.description}</h2>
                </div>
                <span className="inline-flex rounded-full bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {group.programs.length} tracks
                </span>
              </div>

              <HocLieuCardGrid
                items={group.programs.map((program) => ({
                  title: program.name,
                  description: program.summary,
                  meta: program.badge,
                  href: program.href,
                  tags: program.items.map((item) => item.name),
                }))}
              />
            </div>
          ))}
        </div>
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Execution Flow"
        title="CÃ¡ch giÃ¡o viÃªn thÆ°á»ng dÃ¹ng há»‡ chÆ°Æ¡ng trÃ¬nh trong thá»±c táº¿."
        description="MÃ¬nh Ä‘Ã³ng gÃ³i láº¡i theo Ä‘Ãºng nhá»‹p sá»­ dá»¥ng tháº­t trong Ä‘á»™i ngÅ© ná»™i bá»™: chá»n track, láº¥y bá»™ lesson kit, triá»ƒn khai trÃªn lá»›p rá»“i quay láº¡i tá»‘i Æ°u báº±ng quiz vÃ  cá»™ng Ä‘á»“ng."
        tone="muted"
      >
        <HocLieuTimeline
          items={[
            {
              title: "Chá»n track phÃ¹ há»£p",
              detail: "Má»Ÿ trang chÆ°Æ¡ng trÃ¬nh Ä‘á»ƒ chá»n Ä‘Ãºng lá»™ trÃ¬nh IC3, MOS hay AI theo nhÃ³m há»c viÃªn vÃ  má»¥c tiÃªu há»c ká»³.",
              meta: "Step 1",
            },
            {
              title: "Láº¥y bá»™ lesson kit",
              detail: "Má»—i track Ä‘á»u cÃ³ giÃ¡o Ã¡n, deck trÃ¬nh chiáº¿u, worksheet, quiz warm-up vÃ  mock exam Ä‘i kÃ¨m.",
              meta: "Step 2",
            },
            {
              title: "Dáº¡y, Ä‘o vÃ  cáº£i tiáº¿n",
              detail: "Káº¿t há»£p quiz bank, portfolio showcase vÃ  pháº£n há»“i tá»« cá»™ng Ä‘á»“ng Ä‘á»ƒ cáº£i tiáº¿n bÃ i dáº¡y liÃªn tá»¥c.",
              meta: "Step 3",
            },
          ]}
        />
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Cross Resources"
        title="CÃ¡c kho tÃ i nguyÃªn Ä‘i kÃ¨m xuyÃªn suá»‘t má»i chÆ°Æ¡ng trÃ¬nh."
        description="BÃªn cáº¡nh tá»«ng track riÃªng láº», giÃ¡o viÃªn cÃ²n cÃ³ má»™t lá»›p tÃ i nguyÃªn dÃ¹ng chung Ä‘á»ƒ triá»ƒn khai nhanh hÆ¡n á»Ÿ nhiá»u ngá»¯ cáº£nh lá»›p há»c."
      >
        <HocLieuCardGrid
          items={HUB_COLLECTIONS.map((collection) => ({
            title: collection.title,
            description: collection.subtitle,
            meta: collection.metric,
            href: collection.href,
            tags: collection.tags,
          }))}
        />

        <div className="mt-10 flex flex-col gap-4 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/40 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#cc0022]">Teacher Hub Navigator</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Muá»‘n Ä‘i tháº³ng vÃ o tá»«ng chÆ°Æ¡ng trÃ¬nh?</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Báº¡n cÃ³ thá»ƒ má»Ÿ tá»«ng track Ä‘á»ƒ xem Ä‘áº§y Ä‘á»§ module, bá»™ tÃ i nguyÃªn, workflow giáº£ng dáº¡y vÃ  há»— trá»£ ná»™i bá»™ cho riÃªng mÃ´n Ä‘Ã³.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {FLAT_PROGRAMS.map((program) => (
              <Link
                key={program.slug}
                href={program.href}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#00008b] transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                {program.name}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Next Step"
        title="Äi tiáº¿p sang kho há»c liá»‡u, portfolio vÃ  cá»™ng Ä‘á»“ng."
        description="Bá»™ menu ná»™i bá»™ khÃ´ng cÃ²n lÃ  menu tÄ©nh ná»¯a. Tá»« Ä‘Ã¢y báº¡n cÃ³ thá»ƒ Ä‘i tiáº¿p tá»›i cÃ¡c khu chá»©c nÄƒng chi tiáº¿t hÆ¡n Ä‘á»ƒ láº¥y Ä‘Ãºng thá»© mÃ¬nh cáº§n cho má»™t buá»•i dáº¡y."
        tone="dark"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Kho há»c liá»‡u", detail: "Má»Ÿ thÆ° viá»‡n tÃ i nguyÃªn theo mÃ´n, format vÃ  má»¥c tiÃªu giáº£ng dáº¡y.", href: "/kho-hoc-lieu" },
            { title: "Portfolio", detail: "Xem showcase bÃ i giáº£ng, deck máº«u vÃ  template Ä‘ang dÃ¹ng trong há»‡ thá»‘ng.", href: "/portfolio" },
            { title: "Cá»™ng Ä‘á»“ng", detail: "Trao Ä‘á»•i vá»›i mentor, Ä‘Äƒng cÃ¢u há»i vÃ  chia sáº» bÃ i giáº£ng cho cáº£ Ä‘á»™i.", href: "/cong-dong" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Continue
              </div>
              <h3 className="mt-5 text-3xl font-black tracking-tight text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{item.detail}</p>
            </Link>
          ))}
        </div>
      </HocLieuSection>
    </div>
  );
}
