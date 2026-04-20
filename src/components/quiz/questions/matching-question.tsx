import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

import { QuestionBodyWithImage } from "@/components/quiz/questions/shared";
import type { QuestionComponentProps } from "@/components/quiz/questions/types";
import type { MatchingPair } from "@/lib/types";

type DisplayMatchingPair = MatchingPair & {
  leftText: string;
  rightText: string;
};

export function MatchingQuestion({
  question,
  value,
  submitted = false,
  reviewMode = false,
  onChange,
}: QuestionComponentProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const displayPairs = useMemo<DisplayMatchingPair[]>(
    () =>
      (question.matching ?? []).map((pair) => {
        const promptLonger = pair.prompt.trim().length >= pair.response.trim().length;
        return {
          ...pair,
          leftText: promptLonger ? pair.prompt : pair.response,
          rightText: promptLonger ? pair.response : pair.prompt,
        };
      }),
    [question.matching],
  );

  const rowIds = displayPairs.map((pair) => pair.id);
  const pairMap = useMemo(() => new Map(displayPairs.map((pair) => [pair.id, pair])), [displayPairs]);
  const currentOrder = useMemo(() => {
    if (value.matchingOrder?.length) {
      return value.matchingOrder;
    }

    if (value.matchingAssignments && Object.keys(value.matchingAssignments).length > 0) {
      return rowIds.map((rowId) => value.matchingAssignments?.[rowId] ?? rowId);
    }

    return [...rowIds].reverse();
  }, [rowIds, value.matchingAssignments, value.matchingOrder]);
  const activePair = activeId ? pairMap.get(activeId) ?? null : null;
  const connectedRows = submitted || reviewMode ? rowIds : (value.matchingConnectedRows ?? []);

  function emit(nextOrder: string[], nextConnectedRows: string[]) {
    onChange({
      matchingOrder: nextOrder,
      matchingConnectedRows: nextConnectedRows,
    });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const chipId = String(active.id);
    const overId = String(over.id);
    if (!overId.startsWith("row:")) return;

    const sourceIndex = currentOrder.findIndex((id) => id === chipId);
    const targetIndex = rowIds.findIndex((rowId) => rowId === overId.replace("row:", ""));
    if (sourceIndex === -1 || targetIndex === -1) return;

    const sourceRowId = rowIds[sourceIndex];
    const targetRowId = rowIds[targetIndex];
    if (sourceIndex === targetIndex) {
      const nextConnectedRows = new Set(connectedRows);
      nextConnectedRows.add(targetRowId);
      emit(currentOrder, [...nextConnectedRows]);
      return;
    }

    const nextOrder = [...currentOrder];
    const [moved] = nextOrder.splice(sourceIndex, 1);
    nextOrder.splice(targetIndex, 0, moved);
    const nextConnectedRows = new Set(connectedRows);
    nextConnectedRows.add(targetRowId);
    nextConnectedRows.delete(sourceRowId);
    emit(nextOrder, [...nextConnectedRows]);
  }

  return (
    <QuestionBodyWithImage question={question}>
      <div className="flex flex-col gap-4 sm:gap-5">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
          <div className="flex flex-col gap-3">
            {displayPairs.map((pair, index) => {
              const assignedId = currentOrder[index];
              const assignedPair = assignedId ? pairMap.get(assignedId) ?? null : null;
              const showReviewCorrect = reviewMode && assignedId === displayPairs[index]?.id;
              const rowConnected = connectedRows.includes(pair.id);

              return (
                <div
                  key={pair.id}
                  className={`grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_188px] ${rowConnected ? "md:gap-0" : "md:gap-8"}`}
                >
                  <div
                    className="relative flex min-h-[52px] items-center rounded-lg border-2 bg-white px-4 py-2 pr-8 text-lg leading-[1.35] shadow-sm sm:text-[22px]"
                    style={{
                      borderColor: "var(--quiz-canvas-border)",
                      color: "var(--quiz-option-text)",
                    }}
                  >
                    <span>{pair.leftText}</span>
                    <span
                      className="pointer-events-none absolute right-[-2px] top-1/2 z-[3] h-7 w-[18px] -translate-y-1/2 rounded-l-full border-2 border-r-0 bg-white"
                      style={{ borderColor: "var(--quiz-canvas-border)" }}
                    />
                  </div>

                  <MatchingRowTarget rowId={pair.id}>
                    {assignedPair ? (
                      <DraggableMatchingChip
                        id={assignedPair.id}
                        rowId={pair.id}
                        label={assignedPair.rightText}
                        disabled={submitted}
                        correct={showReviewCorrect}
                        active={activeId === assignedPair.id}
                        connected={rowConnected}
                      />
                    ) : null}
                  </MatchingRowTarget>
                </div>
              );
            })}
          </div>

          <DragOverlay dropAnimation={null}>{activePair ? <MatchingChip label={activePair.rightText} overlay /> : null}</DragOverlay>
        </DndContext>
      </div>
    </QuestionBodyWithImage>
  );
}

function MatchingRowTarget({
  rowId,
  children,
}: {
  rowId: string;
  children: ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: `row:${rowId}` });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[52px] items-center ${isOver ? "rounded-lg ring-2 ring-offset-2" : ""}`}
      style={isOver ? { backgroundColor: "var(--quiz-option-selected-bg)", ["--tw-ring-color" as string]: "rgba(59, 130, 246, 0.24)" } : undefined}
    >
      {children}
    </div>
  );
}

function DraggableMatchingChip({
  id,
  rowId,
  label,
  disabled,
  correct,
  active,
  connected,
}: {
  id: string;
  rowId: string;
  label: string;
  disabled: boolean;
  correct?: boolean;
  active: boolean;
  connected: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
    data: {
      rowId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
      }}
    >
      <MatchingChip
        label={label}
        dragging={isDragging}
        locked={disabled}
        correct={correct}
        active={active}
        connected={connected}
        dragProps={{
          ...(attributes as ButtonHTMLAttributes<HTMLButtonElement>),
          ...(listeners as ButtonHTMLAttributes<HTMLButtonElement>),
        }}
      />
    </div>
  );
}

function MatchingChip({
  label,
  dragging = false,
  overlay = false,
  locked = false,
  correct = false,
  active = false,
  connected = false,
  dragProps,
}: {
  label: string;
  dragging?: boolean;
  overlay?: boolean;
  locked?: boolean;
  correct?: boolean;
  active?: boolean;
  connected?: boolean;
  dragProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className={`relative inline-flex min-h-[52px] w-full items-center justify-between gap-2 rounded-r-lg border-2 px-3 pl-6 text-left text-lg leading-[1.35] shadow-sm transition md:w-[188px] sm:text-[22px] ${
        overlay || active
          ? "border-[#c6b66a] bg-[#fff0a8] shadow-[0_10px_26px_rgba(98,89,34,0.22)]"
          : correct
            ? "border-[#8fb37f] bg-[#f4fff0]"
            : "border-slate-300 bg-white"
      } ${connected ? "md:-ml-[2px] md:border-l-0" : ""} ${dragging ? "opacity-15" : ""} ${locked ? "cursor-default" : "cursor-grab"}`}
      style={!overlay && !active && !correct ? { borderColor: "var(--quiz-canvas-border)", backgroundColor: "var(--quiz-input-bg)", color: "var(--quiz-option-text)" } : undefined}
      {...dragProps}
    >
      <span
        className={`pointer-events-none absolute left-[-18px] top-1/2 z-[4] h-7 w-[18px] -translate-y-1/2 rounded-l-full border-2 border-r-0 ${
          overlay || active ? "border-[#c6b66a] bg-[#fff0a8]" : correct ? "border-[#8fb37f] bg-[#f4fff0]" : "border-slate-300 bg-white"
        }`}
        style={!overlay && !active && !correct ? { borderColor: "var(--quiz-canvas-border)", backgroundColor: "var(--quiz-input-bg)" } : undefined}
      />
      <span className="whitespace-nowrap">{label}</span>
      {!overlay ? <span aria-hidden="true" className="text-xl tracking-[-0.16em] text-slate-500">⋮⋮</span> : null}
    </button>
  );
}
