import { FolderKanban, LayoutTemplate, Presentation, Sparkles } from "lucide-react";

import { PORTFOLIO_STREAMS } from "@/features/hoclieu/api/hoclieu-data";
import {
  HocLieuCardGrid,
  HocLieuPageHero,
  HocLieuSection,
  HocLieuTimeline,
} from "@/features/hoclieu/components/hoclieu-page-shell";

export function HocLieuPortfolioPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <HocLieuPageHero
        eyebrow="Teaching Portfolio"
        title="Portfolio bÃ i giáº£ng Ä‘á»ƒ giÃ¡o viÃªn tÃ¡i sá»­ dá»¥ng vÃ  nÃ¢ng cáº¥p tháº­t nhanh."
        description="ÄÃ¢y lÃ  khu showcase cá»§a Teacher Hub, nÆ¡i cÃ¡c deck máº«u, case study lá»›p há»c, template triá»ƒn khai vÃ  tÃ i liá»‡u tham chiáº¿u Ä‘Æ°á»£c lÆ°u láº¡i thÃ nh chuáº©n thá»±c hÃ nh dÃ¹ng chung."
        stats={[
          { label: "DÃ²ng portfolio", value: `${PORTFOLIO_STREAMS.length}` },
          { label: "Deck máº«u", value: "120+" },
          { label: "Templates", value: "64" },
        ]}
        actions={[
          { label: "Xem kho há»c liá»‡u", href: "/kho-hoc-lieu", icon: FolderKanban },
          { label: "VÃ o cá»™ng Ä‘á»“ng", href: "/cong-dong", icon: Sparkles, variant: "secondary" },
        ]}
      />

      <HocLieuSection
        eyebrow="Streams"
        title="Nhá»¯ng nhÃ¡nh portfolio chÃ­nh trong ná»™i bá»™."
        description="Má»—i nhÃ¡nh giáº£i má»™t bÃ i toÃ¡n khÃ¡c nhau: tham chiáº¿u nhanh bÃ i giáº£ng, há»c há»i tá»« lá»›p tháº­t hoáº·c nhÃ¢n báº£n template Ä‘á»ƒ má»Ÿ khÃ³a má»›i."
      >
        <HocLieuCardGrid
          items={PORTFOLIO_STREAMS.map((stream) => ({
            title: stream.title,
            description: stream.summary,
            meta: stream.volume,
            href: stream.href,
          }))}
        />
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Assets"
        title="Má»™t portfolio bÃ i giáº£ng tá»‘t nÃªn cÃ³ gÃ¬?"
        description="MÃ¬nh Ä‘Ã³ng gÃ³i theo Ä‘Ãºng checklist mÃ  giÃ¡o viÃªn ná»™i bá»™ thÆ°á»ng cáº§n trÆ°á»›c khi chia sáº» cho cáº£ Ä‘á»™i."
        tone="muted"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Deck hoÃ n chá»‰nh", detail: "Báº£n trÃ¬nh chiáº¿u Ä‘Ã£ qua dáº¡y thá»­, cÃ³ note nhá»‹p giáº£ng vÃ  Ä‘iá»ƒm nháº¥n cáº§n lÆ°u Ã½.", icon: Presentation },
            { title: "Lesson map", detail: "SÆ¡ Ä‘á»“ buá»•i dáº¡y, cÃ¡c checkpoint, hoáº¡t Ä‘á»™ng nhÃ³m vÃ  tiÃªu chÃ­ Ä‘Ã¡nh giÃ¡ cuá»‘i buá»•i.", icon: LayoutTemplate },
            { title: "Reflection & fixes", detail: "Äiá»ƒm Ä‘Ã£ lÃ m tá»‘t, lá»—i thÆ°á»ng gáº·p vÃ  cÃ¡c chá»‰nh sá»­a sau má»—i vÃ²ng triá»ƒn khai.", icon: Sparkles },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.title} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[#00008b]">
                  <ItemIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Build Process"
        title="Quy trÃ¬nh phÃ¡t triá»ƒn má»™t portfolio bÃ i giáº£ng dÃ¹ng Ä‘Æ°á»£c lÃ¢u dÃ i."
        description="Portfolio trong Teacher Hub khÃ´ng pháº£i chá»— cáº¥t file táº¡m. Má»—i bÃ i giáº£ng Ä‘Æ°á»£c Ä‘áº©y lÃªn Ä‘á»u nÃªn qua má»™t quy trÃ¬nh Ä‘á»§ cháº·t Ä‘á»ƒ cáº£ Ä‘á»™i tÃ¡i sá»­ dá»¥ng vá» sau."
      >
        <HocLieuTimeline
          items={[
            {
              title: "Draft bÃ i giáº£ng",
              detail: "GiÃ¡o viÃªn táº¡o báº£n Ä‘áº§u tiÃªn tá»« lesson kit, deck máº«u hoáº·c task file cÃ³ sáºµn.",
              meta: "Draft",
            },
            {
              title: "Review & dáº¡y thá»­",
              detail: "Mentor hoáº·c Ä‘á»“ng nghiá»‡p xem nhanh flow bÃ i giáº£ng trÆ°á»›c khi Ä‘Æ°a vÃ o lá»›p tháº­t.",
              meta: "Review",
            },
            {
              title: "Chá»‘t vÃ  nhÃ¢n báº£n",
              detail: "Sau khi dáº¡y tháº­t, portfolio Ä‘Æ°á»£c cáº­p nháº­t note vÃ  trá»Ÿ thÃ nh tÃ i sáº£n dÃ¹ng chung cá»§a há»‡ thá»‘ng.",
              meta: "Scale",
            },
          ]}
        />
      </HocLieuSection>
    </div>
  );
}
