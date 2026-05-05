import { MessageCircle, Sparkles, Users, Video } from "lucide-react";

import { COMMUNITY_CHANNELS, HOCLIEU_COMMUNITY_HIGHLIGHTS } from "@/features/hoclieu/api/hoclieu-data";
import {
  HocLieuCardGrid,
  HocLieuPageHero,
  HocLieuSection,
  HocLieuTimeline,
} from "@/features/hoclieu/components/hoclieu-page-shell";

export function HocLieuCommunityPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <HocLieuPageHero
        eyebrow="Teacher Community"
        title="Cá»™ng Ä‘á»“ng ná»™i bá»™ Ä‘á»ƒ giÃ¡o viÃªn cÃ¹ng nÃ¢ng cháº¥t lÆ°á»£ng bÃ i dáº¡y."
        description="KhÃ´ng gian trao Ä‘á»•i dÃ nh riÃªng cho Ä‘á»™i ngÅ© ERG, nÆ¡i bÃ i giáº£ng Ä‘Æ°á»£c review, cÃ¢u há»i Ä‘Æ°á»£c giáº£i Ä‘Ã¡p nhanh vÃ  kinh nghiá»‡m lá»›p há»c Ä‘Æ°á»£c lÆ°u láº¡i thÃ nh tÃ i nguyÃªn sá»‘ng."
        stats={[
          { label: "KÃªnh hoáº¡t Ä‘á»™ng", value: `${COMMUNITY_CHANNELS.length}` },
          { label: "Mentor trá»±c", value: "12" },
          { label: "Chá»§ Ä‘á» ná»•i báº­t", value: "Q&A / Review / Sharing" },
        ]}
        actions={[
          { label: "Má»Ÿ portfolio", href: "/portfolio", icon: Users },
          { label: "Xem quiz bank", href: "/quizzes", icon: Sparkles, variant: "secondary" },
        ]}
      />

      <HocLieuSection
        eyebrow="Channels"
        title="CÃ¡c kÃªnh cá»™ng Ä‘á»“ng Ä‘ang hoáº¡t Ä‘á»™ng nhiá»u nháº¥t."
        description="Má»—i kÃªnh phá»¥c vá»¥ má»™t nhu cáº§u tháº­t trong váº­n hÃ nh giáº£ng dáº¡y, tá»« xin review giÃ¡o Ã¡n Ä‘áº¿n xá»­ lÃ½ case khÃ³ trÃªn lá»›p."
      >
        <HocLieuCardGrid
          items={COMMUNITY_CHANNELS.map((channel) => ({
            title: channel.title,
            description: channel.summary,
            meta: channel.cadence,
            href: channel.href,
          }))}
        />
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Highlights"
        title="Nhá»¯ng ná»™i dung cá»™ng Ä‘á»“ng nÃªn khai thÃ¡c thÆ°á»ng xuyÃªn."
        description="ÄÃ¢y lÃ  cÃ¡c dÃ²ng tháº£o luáº­n quan trá»ng Ä‘á»ƒ há»‡ thá»‘ng tri thá»©c trong Teacher Hub khÃ´ng bá»‹ náº±m cháº¿t á»Ÿ tá»«ng cÃ¡ nhÃ¢n."
        tone="muted"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {HOCLIEU_COMMUNITY_HIGHLIGHTS.map((item, index) => (
            <div key={item} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/30">
              <p className="text-4xl font-black text-[#00008b]/12">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-4 text-2xl font-black leading-tight text-slate-900">{item}</p>
            </div>
          ))}
        </div>
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Participation Flow"
        title="CÃ¡ch tham gia cá»™ng Ä‘á»“ng Ä‘á»ƒ nháº­n giÃ¡ trá»‹ tháº­t."
        description="MÃ¬nh Ä‘Ã³ng flow nÃ y nhÆ° má»™t quy trÃ¬nh ráº¥t cá»¥ thá»ƒ Ä‘á»ƒ giÃ¡o viÃªn khÃ´ng chá»‰ vÃ o Ä‘á»c mÃ  cÃ²n táº¡o ra thÃªm tri thá»©c dÃ¹ng Ä‘Æ°á»£c cho cáº£ Ä‘á»™i."
      >
        <HocLieuTimeline
          items={[
            {
              title: "ÄÄƒng case hoáº·c cÃ¢u há»i",
              detail: "MÃ´ táº£ rÃµ bá»‘i cáº£nh lá»›p há»c, objective Ä‘ang dáº¡y vÃ  vÆ°á»›ng máº¯c Ä‘ang gáº·p Ä‘á»ƒ má»i ngÆ°á»i há»— trá»£ Ä‘Ãºng trá»ng tÃ¢m.",
              meta: "Ask",
            },
            {
              title: "Nháº­n pháº£n há»“i tá»« mentor",
              detail: "Mentor hoáº·c giÃ¡o viÃªn khÃ¡c gÃ³p Ã½ dá»±a trÃªn tÃ i nguyÃªn sáºµn cÃ³, kinh nghiá»‡m triá»ƒn khai vÃ  cÃ¡ch xá»­ lÃ½ Ä‘Ã£ thá»­.",
              meta: "Review",
            },
            {
              title: "ÄÃ³ng gÃ³i láº¡i thÃ nh tÃ i nguyÃªn",
              detail: "Khi Ä‘Ã£ cÃ³ lá»i giáº£i tá»‘t, ná»™i dung Ä‘Æ°á»£c Ä‘Æ°a ngÆ°á»£c vá» portfolio hoáº·c kho há»c liá»‡u Ä‘á»ƒ dÃ¹ng lÃ¢u dÃ i.",
              meta: "Archive",
            },
          ]}
        />
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Formats"
        title="Cá»™ng Ä‘á»“ng khÃ´ng chá»‰ lÃ  bÃ¬nh luáº­n vÄƒn báº£n."
        description="NgoÃ i thread trao Ä‘á»•i, Ä‘á»™i ngÅ© cÃ²n cÃ³ nhiá»u hÃ¬nh thá»©c cá»™ng tÃ¡c khÃ¡c Ä‘á»ƒ bÃ i giáº£ng Ä‘Æ°á»£c cáº£i thiá»‡n nhanh hÆ¡n."
        tone="dark"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Text threads", detail: "Tháº£o luáº­n nhanh theo topic, cÃ³ gáº¯n file vÃ  áº£nh chá»¥p lá»›p há»c.", icon: MessageCircle },
            { title: "Video review", detail: "Review deck hoáº·c demo bÃ i giáº£ng qua recording ngáº¯n Ä‘á»ƒ pháº£n há»“i trá»±c diá»‡n.", icon: Video },
            { title: "Weekly spotlight", detail: "Chá»n cÃ¡c bÃ i giáº£ng hay nháº¥t tuáº§n Ä‘á»ƒ lan tá»a cÃ¡ch lÃ m tá»‘t cho toÃ n Ä‘á»™i.", icon: Sparkles },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <ItemIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </HocLieuSection>
    </div>
  );
}
