import { BrainCircuit, ChartColumn, CircleCheckBig, ClipboardList } from "lucide-react";

import { QUIZ_TRACKS } from "@/features/hoclieu/api/hoclieu-data";
import {
  HocLieuCardGrid,
  HocLieuPageHero,
  HocLieuSection,
  HocLieuTimeline,
} from "@/features/hoclieu/components/hoclieu-page-shell";

export function HocLieuQuizzesPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <HocLieuPageHero
        eyebrow="Assessment Hub"
        title="Quiz bank Ä‘á»ƒ kiá»ƒm tra nhanh, mock thi tháº­t vÃ  Ä‘o tiáº¿n bá»™ há»c viÃªn."
        description="Teacher Hub gom toÃ n bá»™ warm-up quiz, exit ticket, quiz giá»¯a buá»•i, Ä‘á» mÃ´ phá»ng vÃ  checklist cháº¥m nhanh thÃ nh má»™t khu assessment thá»‘ng nháº¥t cho giÃ¡o viÃªn."
        stats={[
          { label: "Quiz tracks", value: `${QUIZ_TRACKS.length}` },
          { label: "CÃ¢u há»i", value: "2.6k+" },
          { label: "Mock sets", value: "34" },
        ]}
        actions={[
          { label: "Má»Ÿ kho há»c liá»‡u", href: "/kho-hoc-lieu", icon: ClipboardList },
          { label: "VÃ o chÆ°Æ¡ng trÃ¬nh", href: "/chuong-trinh", icon: BrainCircuit, variant: "secondary" },
        ]}
      />

      <HocLieuSection
        eyebrow="Quiz Tracks"
        title="Má»—i track cÃ³ ngÃ¢n hÃ ng Ä‘Ã¡nh giÃ¡ riÃªng."
        description="CÃ¢u há»i khÃ´ng bá»‹ trá»™n láº«n vÃ´ tá»• chá»©c ná»¯a. Má»—i chÆ°Æ¡ng trÃ¬nh Ä‘Æ°á»£c tÃ¡ch quiz bank riÃªng Ä‘á»ƒ giÃ¡o viÃªn chá»n Ä‘Ãºng nÄƒng lá»±c cáº§n kiá»ƒm tra."
      >
        <HocLieuCardGrid
          items={QUIZ_TRACKS.map((track) => ({
            title: track.title,
            description: track.summary,
            meta: track.questionCount,
            href: track.href,
          }))}
        />
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Assessment Types"
        title="CÃ¡c loáº¡i bÃ i Ä‘Ã¡nh giÃ¡ cÃ³ trong há»‡ thá»‘ng."
        description="Má»™t bÃ i dáº¡y tá»‘t thÆ°á»ng cáº§n nhiá»u lá»›p kiá»ƒm tra: má»Ÿ bÃ i, checkpoint giá»¯a buá»•i, cá»§ng cá»‘ cuá»‘i buá»•i vÃ  bÃ i mÃ´ phá»ng cuá»‘i cháº·ng."
        tone="muted"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Warm-up quiz", detail: "Khá»Ÿi Ä‘á»™ng 3-5 phÃºt Ä‘á»ƒ gá»i láº¡i kiáº¿n thá»©c cÅ©.", icon: BrainCircuit },
            { title: "Checkpoint", detail: "Bá»™ cÃ¢u há»i ngáº¯n giá»¯a buá»•i há»c Ä‘á»ƒ cháº·n sá»›m pháº§n chÆ°a hiá»ƒu.", icon: CircleCheckBig },
            { title: "Exit ticket", detail: "ÄÃ¡nh giÃ¡ cuá»‘i buá»•i vÃ  xÃ¡c Ä‘á»‹nh ai cáº§n há»— trá»£ tiáº¿p theo.", icon: ClipboardList },
            { title: "Mock exam", detail: "BÃ i mÃ´ phá»ng gáº§n vá»›i ká»³ thi tháº­t, cÃ³ bÃ¡o cÃ¡o objective.", icon: ChartColumn },
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
        eyebrow="Assessment Flow"
        title="Má»™t vÃ²ng Ä‘Ã¡nh giÃ¡ Ä‘á»§ Ä‘á»ƒ giÃ¡o viÃªn theo dÃµi tiáº¿n bá»™."
        description="Quiz bank Ä‘Æ°á»£c thiáº¿t káº¿ Ä‘á»ƒ Ä‘i kÃ¨m lesson kit chá»© khÃ´ng Ä‘á»©ng riÃªng, nÃªn báº¡n cÃ³ thá»ƒ dÃ¹ng ngay trong flow váº­n hÃ nh lá»›p há»c."
      >
        <HocLieuTimeline
          items={[
            {
              title: "Láº¥y quiz Ä‘Ãºng module",
              detail: "Chá»n Ä‘Ãºng module cá»§a chÆ°Æ¡ng trÃ¬nh Ä‘á»ƒ trÃ¡nh kiá»ƒm tra lá»‡ch ná»™i dung Ä‘ang dáº¡y.",
              meta: "01",
            },
            {
              title: "Cháº¥m vÃ  nhÃ¬n lá»—i nhanh",
              detail: "DÃ¹ng rubric hoáº·c answer map Ä‘á»ƒ cháº¥m nhanh, xÃ¡c Ä‘á»‹nh objective nÃ o lá»›p Ä‘ang yáº¿u.",
              meta: "02",
            },
            {
              title: "Quay láº¡i lesson kit",
              detail: "Tá»« káº¿t quáº£ quiz, giÃ¡o viÃªn quay láº¡i há»c liá»‡u hoáº·c portfolio Ä‘á»ƒ bá»• trá»£ pháº§n cÃ²n há»•ng.",
              meta: "03",
            },
          ]}
        />
      </HocLieuSection>
    </div>
  );
}
