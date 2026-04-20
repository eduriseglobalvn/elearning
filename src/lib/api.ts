import { sampleQuiz } from "@/lib/sample-quiz";
import { getAllQuestions, getQuestionById, normalizeAnswerForSubmission, scoreQuestion } from "@/lib/quiz";
import { getApiBase } from "@/lib/platform";
import type { AnswerPayload, AnswerResult, Attempt, Quiz, QuizSummary, StudentProgress } from "@/lib/types";

const API_BASE = getApiBase();

let localAttempt: Attempt | null = null;

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchQuizList(): Promise<QuizSummary[]> {
  try {
    const data = await safeFetch<{ items: QuizSummary[] }>("/quizzes");
    return data.items;
  } catch {
    return [
      {
        id: sampleQuiz.id,
        title: sampleQuiz.title,
        subtitle: sampleQuiz.subtitle,
        version: sampleQuiz.version,
        sectionCount: sampleQuiz.sections.length,
        questionCount: sampleQuiz.sections.reduce((acc, section) => acc + section.questions.length, 0),
      },
    ];
  }
}

export async function fetchQuiz(id: string): Promise<Quiz> {
  try {
    return await safeFetch<Quiz>(`/quizzes/${id}`);
  } catch {
    return sampleQuiz;
  }
}

export async function saveQuiz(quiz: Quiz): Promise<Quiz> {
  try {
    return await safeFetch<Quiz>(`/quizzes/${quiz.id}`, {
      method: "PUT",
      body: JSON.stringify(quiz),
    });
  } catch {
    return quiz;
  }
}

export async function createAttempt(quizId: string): Promise<Attempt> {
  try {
    return await safeFetch<Attempt>("/attempts", {
      method: "POST",
      body: JSON.stringify({ quizId }),
    });
  } catch {
    const totalQuestions = sampleQuiz.sections.reduce((acc, section) => acc + section.questions.length, 0);
    const maxScore = sampleQuiz.sections.flatMap((section) => section.questions).reduce((acc, question) => acc + question.points, 0);
    localAttempt = {
      id: "local-attempt",
      quizId,
      submittedCount: 0,
      totalQuestions,
      totalScore: 0,
      maxScore,
      percent: 0,
      passed: false,
      answers: {},
    };
    return localAttempt;
  }
}

export async function submitAnswer(
  attemptId: string,
  quiz: Quiz,
  questionId: string,
  answer: AnswerPayload,
): Promise<{ attempt: Attempt; result: AnswerResult }> {
  try {
    return await safeFetch<{ attempt: Attempt; result: AnswerResult }>(`/attempts/${attemptId}/answers`, {
      method: "POST",
      body: JSON.stringify({ questionId, answer }),
    });
  } catch {
    const question = getQuestionById(quiz, questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    if (!localAttempt) {
      localAttempt = await createAttempt(quiz.id);
    }

    const result = scoreQuestion(question, answer);
    const normalizedInput = normalizeAnswerForSubmission(question, answer);
    localAttempt.answers[questionId] = {
      questionId,
      input: normalizedInput,
      result,
    };
    localAttempt.submittedCount = Object.keys(localAttempt.answers).length;
    localAttempt.totalScore = Object.values(localAttempt.answers).reduce(
      (acc, record) => acc + record.result.awardedPoints,
      0,
    );
    localAttempt.percent = Math.floor((localAttempt.totalScore / localAttempt.maxScore) * 100);
    localAttempt.passed = localAttempt.percent >= quiz.settings.passPercent;

    return { attempt: localAttempt, result };
  }
}

export async function submitAttempt(attemptId: string, quiz: Quiz, answers: Record<string, AnswerPayload>): Promise<Attempt> {
  let nextAttempt: Attempt | null = null;

  for (const question of getAllQuestions(quiz)) {
    const normalizedAnswer = normalizeAnswerForSubmission(question, answers[question.id]);
    const response = await submitAnswer(attemptId, quiz, question.id, normalizedAnswer);
    nextAttempt = response.attempt;
  }

  if (!nextAttempt) {
    throw new Error("Unable to submit attempt.");
  }

  return nextAttempt;
}

export async function fetchStudentProgress(quizId: string): Promise<StudentProgress[]> {
  try {
    const data = await safeFetch<{ items: StudentProgress[] }>(`/quizzes/${quizId}/students`);
    return data.items;
  } catch {
    const totalQuestions = getAllQuestions(sampleQuiz).length;
    return [
      {
        id: "student-1",
        studentName: "Nguyễn Khánh Linh",
        quizId,
        quizTitle: sampleQuiz.title,
        mode: sampleQuiz.settings.mode,
        status: "in_progress",
        currentQuestionIndex: 4,
        currentQuestionTitle: "Bạn đăng một video lên trang web của công ty...",
        answeredCount: 4,
        totalQuestions,
        percentComplete: 67,
        score: null,
        passed: null,
        startedAt: "2026-04-20T08:05:00+07:00",
        submittedAt: null,
        lastActiveAt: "2026-04-20T08:31:00+07:00",
      },
      {
        id: "student-2",
        studentName: "Trần Minh Đức",
        quizId,
        quizTitle: sampleQuiz.title,
        mode: "testing",
        status: "submitted",
        currentQuestionIndex: totalQuestions,
        currentQuestionTitle: "Đã nộp bài",
        answeredCount: totalQuestions,
        totalQuestions,
        percentComplete: 100,
        score: 54,
        passed: false,
        startedAt: "2026-04-20T07:42:00+07:00",
        submittedAt: "2026-04-20T08:14:00+07:00",
        lastActiveAt: "2026-04-20T08:14:00+07:00",
      },
      {
        id: "student-3",
        studentName: "Phạm Gia Hân",
        quizId,
        quizTitle: sampleQuiz.title,
        mode: "training",
        status: "in_progress",
        currentQuestionIndex: 2,
        currentQuestionTitle: "Hãy sắp xếp các bước sử dụng Start Menu...",
        answeredCount: 2,
        totalQuestions,
        percentComplete: 34,
        score: null,
        passed: null,
        startedAt: "2026-04-20T08:18:00+07:00",
        submittedAt: null,
        lastActiveAt: "2026-04-20T08:29:00+07:00",
      },
      {
        id: "student-4",
        studentName: "Lê Hoàng Nam",
        quizId,
        quizTitle: sampleQuiz.title,
        mode: sampleQuiz.settings.mode,
        status: "not_started",
        currentQuestionIndex: 0,
        currentQuestionTitle: "Chưa bắt đầu",
        answeredCount: 0,
        totalQuestions,
        percentComplete: 0,
        score: null,
        passed: null,
        startedAt: null,
        submittedAt: null,
        lastActiveAt: "2026-04-20T07:50:00+07:00",
      },
    ];
  }
}
