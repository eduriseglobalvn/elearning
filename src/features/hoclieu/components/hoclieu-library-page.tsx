import { BookOpen, CalendarDays, ClipboardList, LibraryBig, Presentation, Search } from "lucide-react";

import { HUB_COLLECTIONS } from "@/features/hoclieu/api/hoclieu-data";
import { INTERNAL_DOCUMENT_TYPES, INTERNAL_DOCUMENTS } from "@/features/hoclieu/api/internal-docs-data";
import {
  HocLieuCardGrid,
  HocLieuPageHero,
  HocLieuSection,
  HocLieuTimeline,
} from "@/features/hoclieu/components/hoclieu-page-shell";

export function HocLieuLibraryPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <HocLieuPageHero
        eyebrow="SmartLibrary"
        title="Kho há»c liá»‡u táº­p trung cho toÃ n bá»™ giÃ¡o viÃªn ERG."
        description="Tá»« bÃ i giáº£ng, giÃ¡o trÃ¬nh, phÃ¢n phá»‘i chÆ°Æ¡ng trÃ¬nh Ä‘áº¿n giÃ¡o Ã¡n, má»i tÃ i liá»‡u ná»™i bá»™ Ä‘á»u Ä‘Æ°á»£c gom theo Ä‘Ãºng chÆ°Æ¡ng trÃ¬nh Ä‘á»ƒ giÃ¡o viÃªn má»Ÿ vÃ o lÃ  láº¥y Ä‘Æ°á»£c."
        stats={[
          { label: "Bá»™ sÆ°u táº­p", value: "18" },
          { label: "TÃ i liá»‡u", value: `${INTERNAL_DOCUMENTS.length}+` },
          { label: "NhÃ³m chÃ­nh", value: "4 loáº¡i" },
        ]}
        actions={[
          { label: "TÃ¬m tÃ i liá»‡u", href: "/kho-hoc-lieu", icon: Search },
          { label: "Má»Ÿ chÆ°Æ¡ng trÃ¬nh", href: "/chuong-trinh", icon: LibraryBig, variant: "secondary" },
        ]}
      />

      <HocLieuSection
        eyebrow="Collections"
        title="Nhá»¯ng tá»§ tÃ i nguyÃªn quan trá»ng nháº¥t trong há»‡ thá»‘ng."
        description="Má»—i collection Ä‘Æ°á»£c Ä‘Ã³ng gÃ³i theo ngá»¯ cáº£nh dÃ¹ng tháº­t Ä‘á»ƒ giÃ¡o viÃªn cÃ³ thá»ƒ má»Ÿ vÃ o vÃ  láº¥y ngay thá»© cáº§n cho buá»•i dáº¡y."
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
      </HocLieuSection>

      <HocLieuSection
        eyebrow="TÃ i liá»‡u ná»™i bá»™"
        title="Bá»‘n loáº¡i tÃ i liá»‡u giÃ¡o viÃªn cáº§n trÆ°á»›c khi lÃªn lá»›p."
        description="Kho há»c liá»‡u lÃ  nÆ¡i xem toÃ n bá»™ file Ä‘Ã£ Ä‘Æ°á»£c admin xuáº¥t báº£n. GiÃ¡o viÃªn cÃ³ thá»ƒ lá»c theo chÆ°Æ¡ng trÃ¬nh, level vÃ  Ä‘Ãºng loáº¡i tÃ i liá»‡u cáº§n dÃ¹ng."
        tone="muted"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {INTERNAL_DOCUMENT_TYPES.map((item, index) => {
            const icons = [Presentation, BookOpen, CalendarDays, ClipboardList];
            const ItemIcon = icons[index] ?? LibraryBig;
            const count = INTERNAL_DOCUMENTS.filter((document) => document.type === item.id).length;

            return (
              <div key={item.id} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#00008b]">
                  <ItemIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">{item.label}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{item.description}</p>
                <p className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-[#cc0022]">{count} tÃ i liá»‡u</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/30">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#cc0022]">Danh sÃ¡ch má»›i cáº­p nháº­t</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">TÃ i liá»‡u Ä‘ang cÃ³ trong kho</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERNAL_DOCUMENT_TYPES.map((type) => (
                <span key={type.id} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  {type.label}
                </span>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {INTERNAL_DOCUMENTS.map((document) => (
              <article key={document.id} className="grid gap-3 py-4 lg:grid-cols-[minmax(0,1fr)_160px_150px_110px] lg:items-center">
                <div className="min-w-0">
                  <h4 className="font-black text-slate-900">{document.title}</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{document.programName} Â· {document.moduleName}</p>
                </div>
                <span className="text-sm font-semibold text-slate-600">{document.owner}</span>
                <span className="text-sm font-semibold text-slate-600">{document.updatedAt}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                  {document.format}
                </span>
              </article>
            ))}
          </div>
        </div>
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Usage Flow"
        title="Má»™t quy trÃ¬nh láº¥y há»c liá»‡u nhanh trÆ°á»›c khi lÃªn lá»›p."
        description="ÄÃ¢y lÃ  flow khuyáº¿n nghá»‹ Ä‘á»ƒ giÃ¡o viÃªn má»›i vÃ o há»‡ thá»‘ng váº«n cÃ³ thá»ƒ chuáº©n bá»‹ bÃ i dáº¡y trong má»™t vÃ²ng thao tÃ¡c ngáº¯n."
      >
        <HocLieuTimeline
          items={[
            {
              title: "Chá»n chÆ°Æ¡ng trÃ¬nh vÃ  module",
              detail: "Báº¯t Ä‘áº§u tá»« track chÃ­nh, xÃ¡c Ä‘á»‹nh Ä‘Ãºng objective vÃ  nÄƒng lá»±c cá»§a lá»›p á»Ÿ tuáº§n hiá»‡n táº¡i.",
              meta: "01",
            },
            {
              title: "Lá»c theo loáº¡i tÃ i liá»‡u",
              detail: "Láº¥y Ä‘Ãºng bÃ i giáº£ng, giÃ¡o trÃ¬nh, phÃ¢n phá»‘i chÆ°Æ¡ng trÃ¬nh hoáº·c giÃ¡o Ã¡n cáº§n dÃ¹ng, trÃ¡nh táº£i thá»«a tÃ i nguyÃªn.",
              meta: "02",
            },
            {
              title: "Gáº¯n vÃ o buá»•i dáº¡y thá»±c táº¿",
              detail: "ÄÆ°a tÃ i liá»‡u sang káº¿ hoáº¡ch dáº¡y cá»§a giÃ¡o viÃªn hoáº·c dÃ¹ng lÃ m nguá»“n chuáº©n cho lá»›p Ä‘ang phá»¥ trÃ¡ch.",
              meta: "03",
            },
          ]}
        />
      </HocLieuSection>
    </div>
  );
}
