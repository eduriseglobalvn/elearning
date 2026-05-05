import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BrainCircuit,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Globe,
  Layout,
  LibraryBig,
  Presentation,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export type CourseColor = "blue" | "red" | "indigo" | "emerald";

export type CourseModule = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export type CourseProgram = {
  name: string;
  slug: string;
  color: CourseColor;
  badge: string;
  summary: string;
  href: string;
  items: CourseModule[];
};

export type CourseGroup = {
  title: string;
  description: string;
  programs: CourseProgram[];
};

export type QuickAccessItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export type ProgramDetail = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  accent: CourseColor;
  stats: Array<{ label: string; value: string }>;
  modules: Array<{ title: string; detail: string; duration: string }>;
  resources: Array<{ title: string; type: string; detail: string }>;
  workflow: Array<{ title: string; detail: string }>;
  support: Array<{ title: string; detail: string }>;
};

export type HubCollection = {
  title: string;
  subtitle: string;
  metric: string;
  href: string;
  tags: string[];
};

export type CommunityChannel = {
  title: string;
  summary: string;
  cadence: string;
  href: string;
};

export type PortfolioStream = {
  title: string;
  summary: string;
  volume: string;
  href: string;
};

export type QuizTrack = {
  title: string;
  summary: string;
  questionCount: string;
  href: string;
};

export const COURSE_GROUPS: CourseGroup[] = [
  {
    title: "Chá»©ng chá»‰ quá»‘c táº¿",
    description: "CÃ¡c chÆ°Æ¡ng trÃ¬nh cá»‘t lÃµi dÃ nh cho lá»›p há»c tin há»c chuáº©n Certiport.",
    programs: [
      {
        name: "IC3 GS6",
        slug: "ic3-gs6",
        color: "blue",
        badge: "Core",
        summary: "Bá»™ ká»¹ nÄƒng sá»‘ ná»n táº£ng cho há»c sinh vÃ  giÃ¡o viÃªn triá»ƒn khai chÆ°Æ¡ng trÃ¬nh chÃ­nh khÃ³a.",
        href: "/chuong-trinh/ic3-gs6",
        items: [
          { name: "Computing Fundamentals", href: "/chuong-trinh/ic3-gs6#computing-fundamentals", icon: Zap },
          { name: "Key Applications", href: "/chuong-trinh/ic3-gs6#key-applications", icon: Layout },
          { name: "Living Online", href: "/chuong-trinh/ic3-gs6#living-online", icon: Globe },
        ],
      },
      {
        name: "IC3 Spark",
        slug: "ic3-spark",
        color: "red",
        badge: "Junior",
        summary: "Lá»™ trÃ¬nh nháº­p mÃ´n cÃ´ng nghá»‡ nháº¹ hÆ¡n cho nhÃ³m há»c sinh nhá» tuá»•i vÃ  lá»›p khá»Ÿi Ä‘á»™ng.",
        href: "/chuong-trinh/ic3-spark",
        items: [
          { name: "Digital Discovery", href: "/chuong-trinh/ic3-spark#digital-discovery", icon: Zap },
          { name: "Creative Projects", href: "/chuong-trinh/ic3-spark#creative-projects", icon: Layout },
          { name: "Online Safety", href: "/chuong-trinh/ic3-spark#online-safety", icon: Globe },
        ],
      },
      {
        name: "MOS Master",
        slug: "mos",
        color: "indigo",
        badge: "Office",
        summary: "Kho tÃ i nguyÃªn Word, Excel, PowerPoint phá»¥c vá»¥ giáº£ng dáº¡y vÃ  luyá»‡n thi chá»©ng chá»‰ vÄƒn phÃ²ng.",
        href: "/chuong-trinh/mos",
        items: [
          { name: "Word Specialist", href: "/chuong-trinh/mos#word-specialist", icon: FileText },
          { name: "Excel Specialist", href: "/chuong-trinh/mos#excel-specialist", icon: FileSpreadsheet },
          { name: "PowerPoint", href: "/chuong-trinh/mos#powerpoint", icon: Presentation },
        ],
      },
    ],
  },
  {
    title: "AI vÃ  ká»¹ nÄƒng má»›i",
    description: "NhÃ³m ná»™i dung má»Ÿ rá»™ng Ä‘á»ƒ há»‡ thá»‘ng cÃ²n tiáº¿p tá»¥c thÃªm cÃ¡c khoÃ¡ cÃ´ng nghá»‡ má»›i sau nÃ y.",
    programs: [
      {
        name: "AI & Programming",
        slug: "tech",
        color: "emerald",
        badge: "New",
        summary: "TÃ i liá»‡u AI á»©ng dá»¥ng, tÆ° duy láº­p trÃ¬nh vÃ  cÃ¡c chuyÃªn Ä‘á» ká»¹ nÄƒng sá»‘ cho giÃ¡o viÃªn.",
        href: "/chuong-trinh/tech",
        items: [
          { name: "Scratch Programming", href: "/chuong-trinh/tech#scratch-programming", icon: BookOpen },
          { name: "Python for Beginners", href: "/chuong-trinh/tech#python-for-beginners", icon: BookOpen },
          { name: "AI Tools for Teachers", href: "/chuong-trinh/tech#ai-tools-for-teachers", icon: Sparkles },
        ],
      },
    ],
  },
];

export const QUICK_ACCESS_NAV: QuickAccessItem[] = [
  {
    label: "Kho há»c liá»‡u",
    href: "/kho-hoc-lieu",
    icon: LibraryBig,
    description: "Slide, worksheet vÃ  Ä‘á» mÃ´ phá»ng",
  },
  {
    label: "Cá»™ng Ä‘á»“ng",
    href: "/cong-dong",
    icon: Users,
    description: "Káº¿t ná»‘i giáº£ng viÃªn vÃ  chia sáº» kinh nghiá»‡m",
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: FolderKanban,
    description: "Bá»™ bÃ i giáº£ng vÃ  máº«u triá»ƒn khai",
  },
  {
    label: "Quizzes",
    href: "/quizzes",
    icon: BrainCircuit,
    description: "Kho cÃ¢u há»i vÃ  bÃ i Ä‘Ã¡nh giÃ¡ nhanh",
  },
];

export const FLAT_PROGRAMS = COURSE_GROUPS.flatMap((group) => group.programs);
export const TOTAL_LESSON_SHELVES = FLAT_PROGRAMS.reduce((total, program) => total + program.items.length, 0);

export const HUB_COLLECTIONS: HubCollection[] = [
  {
    title: "SmartLibrary mÃ´n MOS",
    subtitle: "Bá»™ slide, handout, template vÃ  bÃ i luyá»‡n thi theo tá»«ng exam objective.",
    metric: "182 tÃ i nguyÃªn",
    href: "/kho-hoc-lieu",
    tags: ["Word", "Excel", "PowerPoint"],
  },
  {
    title: "Lesson Kit cho IC3",
    subtitle: "GiÃ¡o Ã¡n theo tiáº¿t, worksheet, quiz warm-up vÃ  rubrics Ä‘Ã¡nh giÃ¡.",
    metric: "96 lesson kits",
    href: "/kho-hoc-lieu",
    tags: ["GS6", "Spark", "Digital Literacy"],
  },
  {
    title: "AI Teaching Pack",
    subtitle: "Prompt máº«u, demo project vÃ  hÆ°á»›ng dáº«n Ã¡p dá»¥ng AI vÃ o lá»›p há»c tháº­t.",
    metric: "48 playbooks",
    href: "/chuong-trinh/tech",
    tags: ["AI", "Python", "Scratch"],
  },
];

export const COMMUNITY_CHANNELS: CommunityChannel[] = [
  {
    title: "Teacher Forum",
    summary: "KhÃ´ng gian há»i Ä‘Ã¡p bÃ i giáº£ng, chia sáº» lesson learned vÃ  cÃ¡ch xá»­ lÃ½ lá»›p há»c thá»±c táº¿.",
    cadence: "Má»—i ngÃ y",
    href: "/cong-dong",
  },
  {
    title: "Mentor Circle",
    summary: "NhÃ³m mentor ná»™i bá»™ review giÃ¡o Ã¡n, cháº¥m thá»­ mock exam vÃ  Ä‘á»“ng hÃ nh cÃ¹ng giÃ¡o viÃªn má»›i.",
    cadence: "HÃ ng tuáº§n",
    href: "/cong-dong",
  },
  {
    title: "Resource Swap",
    summary: "Tá»§ chia sáº» worksheet, template kiá»ƒm tra, visual aids vÃ  mini game dáº¡y há»c.",
    cadence: "LiÃªn tá»¥c",
    href: "/cong-dong",
  },
];

export const PORTFOLIO_STREAMS: PortfolioStream[] = [
  {
    title: "Portfolio bÃ i giáº£ng theo module",
    summary: "Bá»™ bÃ i giáº£ng máº«u Ä‘Ã£ qua review, dÃ¹ng Ä‘á»ƒ tham chiáº¿u cÃ¡ch triá»ƒn khai tá»«ng buá»•i há»c.",
    volume: "120 decks",
    href: "/portfolio",
  },
  {
    title: "Showcase lá»›p há»c",
    summary: "Case study tá»« lá»›p tháº­t: má»Ÿ bÃ i, hoáº¡t Ä‘á»™ng nhÃ³m, Ä‘Ã¡nh giÃ¡ cuá»‘i buá»•i vÃ  pháº£n há»“i há»c viÃªn.",
    volume: "37 showcases",
    href: "/portfolio",
  },
  {
    title: "Template há»c liá»‡u dÃ¹ng chung",
    summary: "Máº«u giÃ¡o Ã¡n, checklist, rubric vÃ  bÃ¡o cÃ¡o tiáº¿n Ä‘á»™ Ä‘á»ƒ nhÃ¢n báº£n nhanh sang khÃ³a má»›i.",
    volume: "64 templates",
    href: "/portfolio",
  },
];

export const QUIZ_TRACKS: QuizTrack[] = [
  {
    title: "Quiz Bank IC3",
    summary: "NgÃ¢n hÃ ng cÃ¢u há»i warm-up, exit ticket vÃ  mock test cho tá»«ng strand cá»§a IC3.",
    questionCount: "1,240 cÃ¢u",
    href: "/quizzes",
  },
  {
    title: "Quiz Bank MOS",
    summary: "Bá»™ cÃ¢u há»i ká»¹ thuáº­t, bÃ i táº­p thao tÃ¡c vÃ  Ä‘á» mÃ´ phá»ng theo objective chÃ­nh thá»©c.",
    questionCount: "980 cÃ¢u",
    href: "/quizzes",
  },
  {
    title: "AI & Coding Checks",
    summary: "Quick checks cho Scratch, Python cÄƒn báº£n vÃ  AI literacy theo hoáº¡t Ä‘á»™ng trÃªn lá»›p.",
    questionCount: "410 cÃ¢u",
    href: "/quizzes",
  },
];

export const PROGRAM_DETAILS: ProgramDetail[] = [
  {
    slug: "ic3-gs6",
    title: "IC3 GS6 Teaching Hub",
    eyebrow: "Digital Literacy Core",
    description: "ToÃ n bá»™ giÃ¡o Ã¡n, slide, bÃ i táº­p thá»±c hÃ nh, cÃ¢u há»i warm-up vÃ  mock exam cho lá»™ trÃ¬nh IC3 GS6, tá»‘i Æ°u cho viá»‡c dáº¡y theo tuáº§n vÃ  theo nÄƒng lá»±c.",
    accent: "blue",
    stats: [
      { label: "Lesson Packs", value: "36" },
      { label: "Mock Exams", value: "12" },
      { label: "Worksheet Sets", value: "58" },
    ],
    modules: [
      { title: "Computing Fundamentals", detail: "Cáº¥u trÃºc mÃ¡y tÃ­nh, há»‡ Ä‘iá»u hÃ nh, dá»¯ liá»‡u vÃ  tÆ° duy thao tÃ¡c cÄƒn báº£n.", duration: "4 tuáº§n" },
      { title: "Key Applications", detail: "Soáº¡n tháº£o, báº£ng tÃ­nh, trÃ¬nh chiáº¿u vÃ  ká»¹ nÄƒng xá»­ lÃ½ tÃ¡c vá»¥ vÄƒn phÃ²ng.", duration: "5 tuáº§n" },
      { title: "Living Online", detail: "Khai thÃ¡c Internet, an toÃ n sá»‘, tÃ¬m kiáº¿m thÃ´ng tin vÃ  quyá»n riÃªng tÆ°.", duration: "3 tuáº§n" },
    ],
    resources: [
      { title: "Deck bÃ i giáº£ng theo tuáº§n", type: "Slides", detail: "Má»—i tuáº§n cÃ³ báº£n full deck, báº£n rÃºt gá»n vÃ  gá»£i Ã½ nhá»‹p nÃ³i cho giÃ¡o viÃªn." },
      { title: "Worksheet phÃ¢n táº§ng", type: "Worksheets", detail: "Bá»™ bÃ i táº­p chia theo lá»›p máº¡nh, lá»›p trung bÃ¬nh vÃ  nhÃ³m cáº§n há»— trá»£ thÃªm." },
      { title: "Bá»™ Ä‘á» mock & review", type: "Assessments", detail: "Äá» luyá»‡n theo objective, rubric cháº¥m nhanh vÃ  file phÃ¢n tÃ­ch lá»—i thÆ°á»ng gáº·p." },
    ],
    workflow: [
      { title: "Má»Ÿ buá»•i há»c", detail: "Warm-up 5 phÃºt báº±ng flash quiz hoáº·c demo tÃ¬nh huá»‘ng sá»‘ trong Ä‘á»i sá»‘ng." },
      { title: "Dáº¡y trá»ng tÃ¢m", detail: "Triá»ƒn khai slide chÃ­nh, hoáº¡t Ä‘á»™ng cáº·p Ä‘Ã´i vÃ  checkpoint giá»¯a buá»•i." },
      { title: "KhÃ³a buá»•i há»c", detail: "Exit ticket, assignment vá» nhÃ  vÃ  gá»£i Ã½ tÃ i liá»‡u tá»± há»c tiáº¿p theo." },
    ],
    support: [
      { title: "Coach notes", detail: "Ghi chÃº cho giÃ¡o viÃªn vá» cÃ¡ch giáº£i thÃ­ch khÃ¡i niá»‡m khÃ³, vÃ­ dá»¥ gáº§n gÅ©i vÃ  cÃ¢u há»i phá»¥ trá»£." },
      { title: "Parent update template", detail: "Máº«u cáº­p nháº­t tiáº¿n Ä‘á»™ há»c táº­p Ä‘á»ƒ gá»­i phá»¥ huynh hoáº·c Ä‘iá»u phá»‘i viÃªn." },
    ],
  },
  {
    slug: "ic3-spark",
    title: "IC3 Spark Classroom Lab",
    eyebrow: "Junior Digital Skills",
    description: "Kho hoáº¡t Ä‘á»™ng nháº­p mÃ´n cÃ´ng nghá»‡ cho nhÃ³m há»c sinh nhá» tuá»•i vá»›i nhiá»u trÃ² chÆ¡i lá»›p há»c, project mini vÃ  visual worksheet dá»… triá»ƒn khai.",
    accent: "red",
    stats: [
      { label: "Mini Projects", value: "24" },
      { label: "Visual Worksheets", value: "42" },
      { label: "Class Games", value: "18" },
    ],
    modules: [
      { title: "Digital Discovery", detail: "LÃ m quen thiáº¿t bá»‹, thao tÃ¡c cÆ¡ báº£n, thuáº­t ngá»¯ cÃ´ng nghá»‡ dá»… hiá»ƒu.", duration: "3 tuáº§n" },
      { title: "Creative Projects", detail: "Hoáº¡t Ä‘á»™ng ká»ƒ chuyá»‡n sá»‘, trÃ¬nh bÃ y trá»±c quan vÃ  project nhÃ³m nhá».", duration: "4 tuáº§n" },
      { title: "Online Safety", detail: "Nháº­n biáº¿t rá»§i ro máº¡ng, á»©ng xá»­ Ä‘Ãºng vÃ  xÃ¢y dá»±ng thÃ³i quen sá»‘ tÃ­ch cá»±c.", duration: "2 tuáº§n" },
    ],
    resources: [
      { title: "Lesson storyboard", type: "Teaching Guide", detail: "Storyboard tá»«ng buá»•i vá»›i má»¥c tiÃªu, Ä‘áº¡o cá»¥ cáº§n chuáº©n bá»‹ vÃ  thá»i lÆ°á»£ng hoáº¡t Ä‘á»™ng." },
      { title: "Printable cards", type: "Printables", detail: "Flashcard, matching game vÃ  visual prompts dÃ¹ng trá»±c tiáº¿p trong lá»›p." },
      { title: "Reflection sheet", type: "Student Reflection", detail: "Phiáº¿u pháº£n há»“i sau tiáº¿t há»c giÃºp há»c sinh tá»± ká»ƒ láº¡i Ä‘iá»u vá»«a lÃ m Ä‘Æ°á»£c." },
    ],
    workflow: [
      { title: "Ice-breaker", detail: "Khá»Ÿi Ä‘á»™ng báº±ng trÃ² chÆ¡i nháº­n diá»‡n biá»ƒu tÆ°á»£ng, thiáº¿t bá»‹ hoáº·c thao tÃ¡c Ä‘Æ¡n giáº£n." },
      { title: "Hands-on demo", detail: "GiÃ¡o viÃªn demo tháº­t trÃªn mÃ n hÃ¬nh lá»›n, há»c sinh thá»±c hÃ nh theo nhá»‹p ngáº¯n." },
      { title: "Gallery walk", detail: "Cuá»‘i buá»•i há»c sinh trÃ¬nh bÃ y sáº£n pháº©m vÃ  giÃ¡o viÃªn chá»‘t láº¡i ká»¹ nÄƒng Ä‘áº¡t Ä‘Æ°á»£c." },
    ],
    support: [
      { title: "Classroom management", detail: "Máº¹o chia nhÃ³m, kiá»ƒm soÃ¡t nhá»‹p lá»›p vÃ  giá»¯ sá»± táº­p trung cá»§a há»c sinh nhá» tuá»•i." },
      { title: "Remedial pack", detail: "GÃ³i há»c liá»‡u Ä‘Æ¡n giáº£n hÆ¡n cho cÃ¡c em cáº§n thá»i gian lÃ m quen thao tÃ¡c mÃ¡y tÃ­nh." },
    ],
  },
  {
    slug: "mos",
    title: "MOS Master Resource Center",
    eyebrow: "Office Productivity Track",
    description: "Trung tÃ¢m bÃ i giáº£ng MOS dÃ nh cho Word, Excel vÃ  PowerPoint vá»›i bá»™ task file, scoring guide vÃ  portfolio á»©ng dá»¥ng thá»±c táº¿ cho ngÆ°á»i há»c.",
    accent: "indigo",
    stats: [
      { label: "Practice Files", value: "210" },
      { label: "Demo Videos", value: "64" },
      { label: "Exam Maps", value: "15" },
    ],
    modules: [
      { title: "Word Specialist", detail: "Äá»‹nh dáº¡ng tÃ i liá»‡u, styles, references vÃ  xá»­ lÃ½ vÄƒn báº£n chuyÃªn nghiá»‡p.", duration: "4 tuáº§n" },
      { title: "Excel Specialist", detail: "CÃ´ng thá»©c, biá»ƒu Ä‘á»“, phÃ¢n tÃ­ch dá»¯ liá»‡u vÃ  cÃ¡c tÃ¬nh huá»‘ng spreadsheet thá»±c táº¿.", duration: "5 tuáº§n" },
      { title: "PowerPoint", detail: "Thiáº¿t káº¿ bÃ i trÃ¬nh bÃ y, layout, motion cÆ¡ báº£n vÃ  storytelling báº±ng slide.", duration: "3 tuáº§n" },
    ],
    resources: [
      { title: "Task file banks", type: "Practice Files", detail: "Kho file thao tÃ¡c theo chá»§ Ä‘á»: hÃ nh chÃ­nh, kinh doanh, bÃ¡o cÃ¡o, giÃ¡o dá»¥c." },
      { title: "Scoring checklist", type: "Evaluation", detail: "Checklist cháº¥m nhanh tá»«ng objective Ä‘á»ƒ giÃ¡o viÃªn pháº£n há»“i ngay táº¡i lá»›p." },
      { title: "Capstone projects", type: "Projects", detail: "BÃ i táº­p lá»›n cuá»‘i cháº·ng Ä‘á»ƒ há»c viÃªn gom ká»¹ nÄƒng thÃ nh sáº£n pháº©m thá»±c táº¿." },
    ],
    workflow: [
      { title: "Skill breakdown", detail: "Má»—i buá»•i chia objective thÃ nh micro-skill Ä‘á»ƒ há»c viÃªn tháº¥y tiáº¿n bá»™ rÃµ rÃ ng." },
      { title: "Live correction", detail: "So sÃ¡nh file Ä‘Ãºng/sai vÃ  hÆ°á»›ng dáº«n máº¹o trÃ¡nh lá»—i thao tÃ¡c thÆ°á»ng gáº·p." },
      { title: "Capstone reflection", detail: "Chá»‘t láº¡i báº±ng portfolio task gáº¯n vá»›i ngá»¯ cáº£nh há»c táº­p hoáº·c cÃ´ng viá»‡c." },
    ],
    support: [
      { title: "Exam-day kit", detail: "Bá»™ lÆ°u Ã½ trÆ°á»›c ngÃ y thi, checklist thiáº¿t bá»‹ vÃ  máº¹o phÃ¢n bá»• thá»i gian lÃ m bÃ i." },
      { title: "Office scenarios", detail: "TÃ¬nh huá»‘ng á»©ng dá»¥ng vÃ o mÃ´i trÆ°á»ng vÄƒn phÃ²ng Ä‘á»ƒ tÄƒng tÃ­nh thá»±c tiá»…n." },
    ],
  },
  {
    slug: "tech",
    title: "AI & Programming Studio",
    eyebrow: "Future Skills Lab",
    description: "KhÃ´ng gian phÃ¡t triá»ƒn chuyÃªn Ä‘á» AI, Scratch, Python vÃ  tÆ° duy dá»± Ã¡n Ä‘á»ƒ giÃ¡o viÃªn cÃ³ thá»ƒ dáº¡y nhanh, cáº­p nháº­t vÃ  á»©ng dá»¥ng ngay vÃ o lá»›p há»c cÃ´ng nghá»‡.",
    accent: "emerald",
    stats: [
      { label: "Prompt Kits", value: "52" },
      { label: "Coding Labs", value: "28" },
      { label: "Project Briefs", value: "19" },
    ],
    modules: [
      { title: "Scratch Programming", detail: "TÆ° duy thuáº­t toÃ¡n cÄƒn báº£n, logic khá»‘i lá»‡nh vÃ  mini game classroom-ready.", duration: "4 tuáº§n" },
      { title: "Python for Beginners", detail: "Biáº¿n, Ä‘iá»u kiá»‡n, vÃ²ng láº·p vÃ  cÃ¡c bÃ i lab nháº­p mÃ´n cÃ³ kiá»ƒm thá»­ nhanh.", duration: "5 tuáº§n" },
      { title: "AI Tools for Teachers", detail: "á»¨ng dá»¥ng AI vÃ o thiáº¿t káº¿ bÃ i giáº£ng, feedback há»c viÃªn vÃ  táº¡o há»c liá»‡u nhanh.", duration: "2 tuáº§n" },
    ],
    resources: [
      { title: "Prompt library", type: "AI Resources", detail: "Kho prompt theo vai trÃ²: soáº¡n giÃ¡o Ã¡n, lÃ m rubric, táº¡o worksheet vÃ  pháº£n há»“i bÃ i lÃ m." },
      { title: "Coding labs", type: "Hands-on Labs", detail: "BÃ i lab cÃ³ input/output máº«u, checklist debug vÃ  extension challenge." },
      { title: "Project showcase", type: "Project Archive", detail: "Kho sáº£n pháº©m máº«u vÃ  khung Ä‘Ã¡nh giÃ¡ Ä‘á»ƒ triá»ƒn khai project-based learning." },
    ],
    workflow: [
      { title: "Demo first", detail: "Báº¯t Ä‘áº§u báº±ng sáº£n pháº©m hoÃ n chá»‰nh Ä‘á»ƒ há»c viÃªn tháº¥y má»¥c tiÃªu cuá»‘i buá»•i." },
      { title: "Build together", detail: "Dáº«n tá»«ng bÆ°á»›c cÃ³ checkpoint ngáº¯n Ä‘á»ƒ trÃ¡nh lá»›p bá»‹ há»¥t theo nhá»‹p." },
      { title: "Remix & extend", detail: "Má»—i buá»•i Ä‘á»u cÃ³ gá»£i Ã½ nÃ¢ng cáº¥p cho nhÃ³m há»c nhanh hÆ¡n." },
    ],
    support: [
      { title: "Safe AI policy", detail: "HÆ°á»›ng dáº«n sá»­ dá»¥ng AI cÃ³ trÃ¡ch nhiá»‡m, trÃ­ch dáº«n rÃµ nguá»“n vÃ  kiá»ƒm tra Ä‘á»™ tin cáº­y." },
      { title: "Facilitator notes", detail: "Note cho giÃ¡o viÃªn vá» cÃ¡c lá»—i code phá»• biáº¿n vÃ  cÃ¡ch gá»¡ ngay táº¡i lá»›p." },
    ],
  },
];

export const HOCLIEU_STATS = [
  { label: "Chá»©ng chá»‰ há»— trá»£", value: "09+" },
  { label: "File trÃ¬nh chiáº¿u chuáº©n", value: "2.5k+" },
  { label: "Teacher packs", value: "360+" },
];

export const HOCLIEU_HERO_ACTIONS = [
  { label: "KhÃ¡m phÃ¡ chÆ°Æ¡ng trÃ¬nh", href: "/chuong-trinh", icon: Search },
  { label: "Má»Ÿ portfolio", href: "/portfolio", icon: FolderKanban },
];

export const HOCLIEU_COMMUNITY_HIGHLIGHTS = [
  "Q&A theo mÃ´n vÃ  theo chá»©ng chá»‰",
  "Lá»‹ch mentor review bÃ i giáº£ng hÃ ng tuáº§n",
  "Kho topic tháº£o luáº­n vá» váº­n hÃ nh lá»›p há»c",
];

export function getProgramBySlug(slug: string) {
  return COURSE_GROUPS.flatMap((group) => group.programs).find((program) => program.slug === slug);
}

export function getProgramDetailBySlug(slug: string) {
  return PROGRAM_DETAILS.find((program) => program.slug === slug);
}
