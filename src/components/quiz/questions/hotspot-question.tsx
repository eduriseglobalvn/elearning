import { useRef } from "react";

import type { QuestionComponentProps } from "@/components/quiz/questions/types";

export function HotspotQuestion({
  question,
  value,
  onChange,
  submitted = false,
  reviewMode = false,
}: QuestionComponentProps) {
  const imageRef = useRef<HTMLDivElement | null>(null);

  if (!question.hotspotImage) {
    return null;
  }

  return (
    <div className="grid gap-3">
      <div
        ref={imageRef}
        className="relative overflow-hidden rounded-xl border bg-white"
        style={{ borderColor: "var(--quiz-canvas-border)" }}
        onClick={(event) => {
          if (submitted || !imageRef.current) return;
          const rect = imageRef.current.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
          onChange({ hotspotPoint: { x, y } });
        }}
      >
        <img src={question.hotspotImage.url} alt={question.title} className="block h-[280px] w-full object-cover sm:h-[420px]" />
        {reviewMode
          ? question.hotspotAreas?.map((area) => (
              <div
                key={area.id}
                className="absolute border-2 border-dashed border-white/90 bg-sky-400/20"
                style={{
                  left: `${area.x * 100}%`,
                  top: `${area.y * 100}%`,
                  width: `${area.width * 100}%`,
                  height: `${area.height * 100}%`,
                }}
              />
            ))
          : null}
        {value.hotspotPoint ? (
          <div
            className="absolute h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-[0_10px_20px_rgba(23,41,58,0.22)]"
            style={{
              backgroundColor: "var(--quiz-accent-end)",
              left: `${value.hotspotPoint.x * 100}%`,
              top: `${value.hotspotPoint.y * 100}%`,
            }}
          />
        ) : null}
      </div>
      <p className="text-sm text-slate-500">Nhấp vào hình để đặt điểm trả lời.</p>
    </div>
  );
}
