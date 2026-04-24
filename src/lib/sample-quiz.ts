import { defaultQuizTheme } from "@/lib/quiz-themes";
import type { Quiz } from "@/lib/types";

export const sampleQuiz: Quiz = {
  id: "avs-demo",
  title: "GS6 LV3 OTTH01 (TRAINING)",
  subtitle: "IC3 GS6 Level 3",
  version: "1.3",
  description: "Bộ câu hỏi mẫu theo phong cách AVS để thử nghiệm giao diện erg-elerning.",
  themeId: defaultQuizTheme.id,
  theme: { ...defaultQuizTheme.theme },
  settings: {
    mode: "training",
    timeLimitMinutes: 20,
    passPercent: 90,
    shuffleQuestions: false,
    shuffleChoices: false,
    revealFeedbackPerStep: true,
  },
  result: {
    passMessage: "Chúc mừng, bạn đã đạt!",
    failMessage: "Rất tiếc bạn đã không đạt!",
    reviewButtonLabel: "REVIEW QUIZ",
    thankYouMessage: "Thank you!",
    showReviewButton: true,
    submitAllPrompt: "All questions have been answered. Would you like to submit your answers?",
    confirmSubmitPrompt: "Are you sure you're ready to submit your answers and finish the quiz?",
    submitAllLabel: "SUBMIT ALL",
    returnToQuizLabel: "RETURN TO QUIZ",
    confirmYesLabel: "YES",
    confirmNoLabel: "NO",
  },
  sections: [
    {
      id: "section-1",
      title: "Tương tác cốt lõi",
      questions: [
        {
          id: "q1",
          kind: "single_choice",
          title:
            "Trong hình ảnh sau đây, thông tin nào là thông tin hệ thống để xác định số kiểu máy (model number) của PC?",
          points: 10,
          contentImage: {
            url: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80",
            alt: "System information screen",
          },
          feedback: {
            correct: "Bạn làm tốt lắm!",
            incorrect: "Rất tiếc! Bạn hãy thử lại.",
            partial: "Bạn đã rất gần.",
          },
          choices: [
            { id: "q1-choice-a", label: "81Y6", correct: true },
            { id: "q1-choice-b", label: "UEFI", correct: false },
            {
              id: "q1-choice-c",
              label: "10.0.18363 Build 18363",
              correct: false,
            },
            { id: "q1-choice-d", label: "x64-based PC", correct: false },
          ],
        },
        {
          id: "q2",
          kind: "multiple_response",
          title:
            "Tại sao người dùng biết hệ điều hành và phiên bản của hệ điều hành rất quan trọng? (chọn 2)",
          points: 10,
          feedback: {
            correct: "Chính xác.",
            incorrect: "Bạn chưa chọn đúng đầy đủ đáp án.",
            partial: "Bạn đã đúng một phần.",
          },
          choices: [
            {
              id: "q2-choice-a",
              label: "Các tác vụ khác nhau giữa các hệ điều hành",
              correct: true,
            },
            {
              id: "q2-choice-b",
              label: "Các bản cập nhật phiên bản khả dụng",
              correct: true,
            },
            { id: "q2-choice-c", label: "Phần mềm có giá đắt", correct: false },
            { id: "q2-choice-d", label: "Nhiều ứng dụng miễn phí", correct: false },
          ],
        },
        {
          id: "q3",
          kind: "matching",
          title: "Hãy sắp xếp các bước sử dụng Start Menu để gỡ cài đặt Outlook trên PC:",
          points: 10,
          feedback: {
            correct: "Bạn đã sắp xếp đúng thứ tự.",
            incorrect: "Rất tiếc! Bạn hãy thử lại.",
            partial: "Thứ tự của bạn đã đúng một phần.",
          },
          matching: [
            { id: "q3-pair-1", prompt: "Bước 1", response: "Chọn biểu tượng Start Menu" },
            {
              id: "q3-pair-2",
              prompt: "Bước 2",
              response: "Chọn và giữ (hoặc nhấp chuột phải) Outlook",
            },
            { id: "q3-pair-3", prompt: "Bước 3", response: "Chọn gỡ cài đặt (Uninstall)" },
          ],
        },
        {
          id: "q4",
          kind: "sequence",
          title: "Hãy sắp xếp các bước sử dụng Start Menu để gỡ cài đặt Outlook trên PC:",
          points: 10,
          feedback: {
            correct: "Bạn đã sắp xếp đúng thứ tự.",
            incorrect: "Thứ tự hiện tại chưa đúng.",
            partial: "Bạn đã sắp xếp đúng một vài bước.",
          },
          sequenceItems: [
            { id: "q4-step-1", label: "Chọn biểu tượng Start Menu" },
            {
              id: "q4-step-2",
              label: "Chọn và giữ (hoặc nhấp chuột phải) Outlook",
            },
            { id: "q4-step-3", label: "Chọn gỡ cài đặt (Uninstall)" },
          ],
        },
        {
          id: "q5",
          kind: "inline_choice",
          title:
            "Bạn đăng một video lên trang web của công ty. Đối với mỗi hành động, hãy chọn Có nếu hành động đó giúp tải video nhanh hơn. Ngược lại, hãy chọn Không.",
          points: 10,
          feedback: {
            correct: "Bạn đã chọn đúng toàn bộ statement.",
            incorrect: "Các lựa chọn chưa đúng.",
            partial: "Bạn đã chọn đúng một số statement.",
          },
          inlineBlanks: [
            {
              id: "q5-blank-1",
              statement: "Tăng tốc độ bit của video",
              options: ["yes", "no"],
              correctOptionId: "yes",
              selectPosition: "before",
            },
            {
              id: "q5-blank-2",
              statement: "Chuyển đổi video thành HTML5",
              options: ["yes", "no"],
              correctOptionId: "yes",
              selectPosition: "before",
            },
            {
              id: "q5-blank-3",
              statement: "Giảm độ phân giải của video",
              options: ["yes", "no"],
              correctOptionId: "no",
              selectPosition: "before",
            },
          ],
        },
        {
          id: "q6",
          kind: "hotspot",
          title:
            "Bạn cần tìm ra phiên bản Windows đang chạy. Hãy bấm vào khu vực phù hợp trong cửa sổ cài đặt.",
          points: 10,
          feedback: {
            correct: "Bạn đã chọn đúng khu vực.",
            incorrect: "Điểm bấm chưa đúng.",
            partial: "",
          },
          hotspotImage: {
            url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
            width: 1200,
            height: 800,
          },
          hotspotAreas: [
            {
              id: "q6-area-1",
              shape: "rect",
              x: 0.58,
              y: 0.69,
              width: 0.2,
              height: 0.17,
              correct: true,
            },
          ],
        },
      ],
    },
  ],
};
