import { HocLieuLink as Link } from "@/features/hoclieu/components/hoclieu-link";
import { useParams } from "react-router-dom";
import { ArrowLeft, BrainCircuit, FolderKanban, LibraryBig, Users } from "lucide-react";

import { getProgramDetailBySlug } from "@/features/hoclieu/api/hoclieu-data";
import {
  getInternalDocumentsByProgram,
  getInternalDocumentsByType,
  INTERNAL_DOCUMENT_TYPES,
} from "@/features/hoclieu/api/internal-docs-data";
import {
  HocLieuCardGrid,
  HocLieuPageHero,
  HocLieuSection,
  HocLieuTimeline,
} from "@/features/hoclieu/components/hoclieu-page-shell";

export function HocLieuProgramDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const detail = getProgramDetailBySlug(slug);
  const internalDocuments = getInternalDocumentsByProgram(slug);
  if (!detail) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-[#f8fafc] px-4 py-24">
        <div className="max-w-xl rounded-[28px] border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#cc0022]">Program not found</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Teacher Hub does not have this program yet.</h1>
          <Link href="/chuong-trinh" className="mt-6 inline-flex rounded-2xl bg-[#00008b] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white">Back to programs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] pb-24">
      <HocLieuPageHero
        eyebrow={detail.eyebrow}
        title={detail.title}
        description={detail.description}
        stats={detail.stats}
        actions={[
          { label: "Má»Ÿ kho há»c liá»‡u", href: "/kho-hoc-lieu", icon: LibraryBig },
          { label: "VÃ o cá»™ng Ä‘á»“ng", href: "/cong-dong", icon: Users, variant: "secondary" },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/chuong-trinh"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 transition-all hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay láº¡i danh má»¥c chÆ°Æ¡ng trÃ¬nh
        </Link>
      </div>

      <HocLieuSection
        eyebrow="Modules"
        title="Cáº¥u trÃºc dáº¡y há»c cá»§a chÆ°Æ¡ng trÃ¬nh."
        description="Má»—i track Ä‘á»u Ä‘Æ°á»£c chia thÃ nh nhá»¯ng module cÃ³ thá»i lÆ°á»£ng rÃµ rÃ ng, giÃºp giÃ¡o viÃªn lÃªn plan theo tuáº§n hoáº·c theo má»‘c assessment."
      >
        <HocLieuTimeline
          items={detail.modules.map((module) => ({
            title: module.title,
            detail: module.detail,
            meta: module.duration,
          }))}
        />
      </HocLieuSection>

      <HocLieuSection
        eyebrow="TÃ i liá»‡u ná»™i bá»™"
        title="Bá»™ tÃ i liá»‡u dÃ¹ng trá»±c tiáº¿p cho chÆ°Æ¡ng trÃ¬nh nÃ y."
        description="GiÃ¡o viÃªn cÃ³ thá»ƒ láº¥y Ä‘Ãºng loáº¡i tÃ i liá»‡u mÃ¬nh cáº§n: slide Ä‘á»ƒ lÃªn lá»›p, giÃ¡o trÃ¬nh cho há»c sinh, phÃ¢n phá»‘i chÆ°Æ¡ng trÃ¬nh Ä‘á»ƒ bÃ¡m tiáº¿n Ä‘á»™ vÃ  giÃ¡o Ã¡n cho tá»«ng buá»•i."
        tone="muted"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {INTERNAL_DOCUMENT_TYPES.map((type) => {
            const documents = getInternalDocumentsByType(type.id, internalDocuments);

            return (
              <div key={type.id} className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/40">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#cc0022]">{type.shortLabel}</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{type.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{type.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    {documents.length} file
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {documents.length > 0 ? (
                    documents.map((document) => (
                      <article key={document.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h4 className="font-black text-slate-900">{document.title}</h4>
                            <p className="mt-1 text-sm leading-6 text-slate-500">{document.description}</p>
                          </div>
                          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                            {document.format}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                          <span>{document.moduleName}</span>
                          <span>Â·</span>
                          <span>{document.version}</span>
                          <span>Â·</span>
                          <span>{document.updatedAt}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button className="rounded-xl bg-[#00008b] px-4 py-2 text-xs font-black text-white" type="button">
                            Xem
                          </button>
                          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700" type="button">
                            Táº£i xuá»‘ng
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
                      ChÆ°a cÃ³ tÃ i liá»‡u thuá»™c nhÃ³m nÃ y cho chÆ°Æ¡ng trÃ¬nh hiá»‡n táº¡i.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Resource Stack"
        title="Nhá»¯ng gÃ³i tÃ i nguyÃªn báº¡n cÃ³ thá»ƒ láº¥y ngay Ä‘á»ƒ lÃªn lá»›p."
        description="KhÃ´ng chá»‰ cÃ³ slide, má»—i chÆ°Æ¡ng trÃ¬nh Ä‘á»u cÃ³ nhiá»u lá»›p há»c liá»‡u Ä‘i kÃ¨m Ä‘á»ƒ giÃ¡o viÃªn dÃ¹ng linh hoáº¡t theo trÃ¬nh Ä‘á»™ lá»›p vÃ  má»¥c tiÃªu kiá»ƒm tra."
        tone="muted"
      >
        <HocLieuCardGrid
          items={detail.resources.map((resource) => ({
            title: resource.title,
            description: resource.detail,
            meta: resource.type,
            href: "/kho-hoc-lieu",
          }))}
        />
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Teaching Workflow"
        title="Workflow triá»ƒn khai má»™t buá»•i há»c trong Teacher Hub."
        description="ÄÃ¢y lÃ  luá»“ng sá»­ dá»¥ng khuyáº¿n nghá»‹ Ä‘á»ƒ giÃ¡o viÃªn má»Ÿ tÃ i nguyÃªn Ä‘Ãºng thá»© tá»±, tiáº¿t kiá»‡m thá»i gian chuáº©n bá»‹ vÃ  kiá»ƒm soÃ¡t tá»‘t hÆ¡n cháº¥t lÆ°á»£ng buá»•i dáº¡y."
      >
        <HocLieuTimeline
          items={detail.workflow.map((step, index) => ({
            title: step.title,
            detail: step.detail,
            meta: `Pha ${index + 1}`,
          }))}
        />
      </HocLieuSection>

      <HocLieuSection
        eyebrow="Support Layer"
        title="Lá»›p há»— trá»£ ná»™i bá»™ Ä‘á»ƒ giÃ¡o viÃªn khÃ´ng pháº£i tá»± bÆ¡i."
        description="Má»—i chÆ°Æ¡ng trÃ¬nh cÃ²n cÃ³ note cho mentor, checklist triá»ƒn khai, file pháº£n há»“i vÃ  cÃ¡c gá»£i Ã½ há»— trá»£ lá»›p yáº¿u hÆ¡n Ä‘á»ƒ Ä‘i cÃ¹ng giÃ¡o viÃªn trong suá»‘t há»c ká»³."
        tone="dark"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {detail.support.map((support) => (
            <div key={support.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h3 className="text-3xl font-black tracking-tight text-white">{support.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{support.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            { title: "Kho há»c liá»‡u", href: "/kho-hoc-lieu", icon: LibraryBig },
            { title: "Portfolio bÃ i giáº£ng", href: "/portfolio", icon: FolderKanban },
            { title: "Quiz Bank", href: "/quizzes", icon: BrainCircuit },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <ItemIcon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </HocLieuSection>
    </div>
  );
}
