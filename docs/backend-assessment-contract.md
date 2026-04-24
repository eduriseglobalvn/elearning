# Backend Assessment Contract

Tài liệu này mô tả contract BE cần hỗ trợ cho quiz/assessment theo hướng offline-first, dùng chung cho web và Tauri desktop app.

## Mục tiêu

- Học sinh chọn đáp án và nộp bài phải phản hồi gần như tức thì.
- FE/Tauri có thể tải một `QuizPackage` một lần, chấm local, lưu attempt/event log local và sync nền.
- BE vẫn là nơi lưu trữ, xác minh, tổng hợp báo cáo, xếp hạng, dashboard giáo viên.
- Với bài thi nghiêm túc, BE có thể chuyển sang chấm server-authoritative.

## Runtime Strategy

FE đọc env:

```env
VITE_API_BASE=https://api.erg.edu.vn/api/v1
VITE_GRADING_STRATEGY=client-first
```

Giá trị `VITE_GRADING_STRATEGY`:

- `client-first`: FE/Tauri chấm ngay bằng rubric trong package, sau đó sync result/event log lên BE. Đây là mode khuyến nghị cho luyện tập, homework, desktop offline.
- `server-authoritative`: FE gửi đáp án lên BE để BE chấm. Dùng cho bài thi cần bảo mật đáp án.

## Core Concepts

### QuizPackage

BE nên cung cấp một gói bài làm đã đóng gói:

```json
{
  "id": "pkg_quiz-001_v3_fnv1a32_abcd1234",
  "quizId": "quiz-001",
  "quizVersion": "v3",
  "generatedAt": "2026-04-24T10:00:00.000Z",
  "expiresAt": "2026-05-01T10:00:00.000Z",
  "contentHash": "sha256_or_backend_hash",
  "signature": "base64-signature",
  "publicKeyId": "erg-prod-key-2026-01",
  "gradingMode": "client-first",
  "source": "server",
  "quiz": {}
}
```

Yêu cầu BE:

- `contentHash` phải ổn định theo nội dung quiz/rubric/assets manifest.
- `signature` ký trên payload canonical của package, để Tauri/FE có thể verify nếu cần.
- `quizVersion` tăng khi câu hỏi/rubric thay đổi.
- Assets nên dùng URL có cache tốt hoặc manifest để Tauri tải offline.

### AttemptEvent

Mọi thao tác quan trọng được ghi thành event:

```json
{
  "id": "evt_uuid",
  "attemptId": "attempt_uuid",
  "quizId": "quiz-001",
  "packageId": "pkg_quiz-001_v3_hash",
  "type": "answer_graded",
  "createdAt": "2026-04-24T10:15:00.000Z",
  "questionId": "q1",
  "answer": { "choiceId": "a" },
  "result": {
    "questionId": "q1",
    "correct": true,
    "partiallyRight": false,
    "awardedPoints": 1,
    "maxPoints": 1,
    "message": "Correct"
  }
}
```

BE phải xử lý idempotent:

- Upsert theo `event.id`.
- Upsert attempt theo `attemptId`.
- Nếu nhận lại cùng event/result nhiều lần thì không nhân đôi điểm.

## Required Endpoints

Base path đề xuất: `/api/v1`.

### `GET /quizzes`

Trả danh sách quiz cho dashboard.

```json
{
  "items": [
    {
      "id": "quiz-001",
      "title": "GS6 LV3 OTTHBS",
      "subtitle": "TRAINING",
      "version": "v3",
      "sectionCount": 2,
      "questionCount": 10
    }
  ]
}
```

### `GET /quizzes/:quizId/package`

Trả `QuizPackage`. Đây là endpoint chính cho `client-first` và Tauri offline.

Yêu cầu:

- Response nên cache được theo `quizVersion`.
- Nếu học sinh không có quyền học quiz này, trả `403`.
- Nếu package hết hạn hoặc đã bị thay version, trả package mới.

### `GET /quizzes/:quizId`

Endpoint tương thích cũ, trả `Quiz`. FE hiện vẫn fallback sang endpoint này nếu package chưa có.

### `POST /attempts`

Tuỳ chọn cho `server-authoritative`.

Request:

```json
{
  "quizId": "quiz-001"
}
```

Response:

```json
{
  "id": "attempt_uuid",
  "quizId": "quiz-001",
  "submittedCount": 0,
  "totalQuestions": 10,
  "totalScore": 0,
  "maxScore": 10,
  "percent": 0,
  "passed": false,
  "answers": {}
}
```

Trong `client-first`, FE có thể tự tạo `attemptId`, nên BE không được phụ thuộc việc endpoint này luôn được gọi trước.

### `POST /attempts/:attemptId/sync`

Nhận event log khi học sinh đang làm bài. Endpoint này không được block UX.

Request là `AttemptSyncPayload`:

```json
{
  "attemptId": "attempt_uuid",
  "quizId": "quiz-001",
  "packageId": "pkg_quiz-001_v3_hash",
  "packageHash": "sha256_or_backend_hash",
  "quizVersion": "v3",
  "attempt": {},
  "events": [],
  "client": {
    "runtime": "web",
    "gradingStrategy": "client-first"
  }
}
```

BE xử lý:

- Verify quyền học sinh với `attemptId`, `quizId`.
- Verify `packageHash` tồn tại và đúng version.
- Lưu event log.
- Cập nhật trạng thái in-progress.
- Không cần trả result chấm lại ở mode client-first.

### `POST /attempts/:attemptId/submit`

Nhận bài nộp cuối.

Request trong `client-first`:

```json
{
  "attemptId": "attempt_uuid",
  "quizId": "quiz-001",
  "packageId": "pkg_quiz-001_v3_hash",
  "packageHash": "sha256_or_backend_hash",
  "quizVersion": "v3",
  "submittedAt": "2026-04-24T10:20:00.000Z",
  "attempt": {},
  "events": [],
  "answers": {
    "q1": { "choiceId": "a" }
  },
  "clientResult": {}
}
```

BE xử lý trong `client-first`:

- Verify package/hash/signature/version.
- Recompute score nếu BE có rubric hoặc chấp nhận `clientResult` nếu là homework/training.
- Lưu final attempt.
- Cập nhật leaderboard, dashboard lớp, tiến độ học sinh.

Request trong `server-authoritative`:

```json
{
  "answers": {
    "q1": { "choiceId": "a" }
  }
}
```

Response:

```json
{
  "id": "attempt_uuid",
  "quizId": "quiz-001",
  "submittedCount": 10,
  "totalQuestions": 10,
  "totalScore": 8,
  "maxScore": 10,
  "percent": 80,
  "passed": true,
  "answers": {}
}
```

## Supported Question Kinds

FE player hiện hỗ trợ 14 dạng câu hỏi trong student UI. BE nên lưu `question.kind` đúng theo các key sau để FE/Tauri render và chấm local nhất quán:

```ts
type QuestionKind =
  | "single_choice"
  | "multiple_response"
  | "true_false"
  | "short_answer"
  | "numeric"
  | "sequence"
  | "matching"
  | "fill_blank"
  | "inline_choice"
  | "select_from_lists"
  | "drag_words"
  | "hotspot"
  | "drag_drop"
  | "likert_scale"
  | "essay";
```

`AnswerPayload` theo từng nhóm:

```json
{
  "choiceId": "choice-a",
  "choiceIds": ["choice-a", "choice-b"],
  "matchingOrder": ["pair-1", "pair-2"],
  "matchingConnectedRows": ["pair-1"],
  "sequenceOrder": ["step-1", "step-2"],
  "inlineSelections": { "blank-1": "yes" },
  "textResponses": { "blank-1": "PDF" },
  "numericValue": "400",
  "dragWordPlacements": { "slot-1": "word-source" },
  "dragDropPlacements": { "item-apple": "target-healthy" },
  "likertResponses": { "row-confidence": "scale-4" },
  "essayText": "Student long-form response",
  "hotspotPoint": { "x": 0.62, "y": 0.48 }
}
```

BE cần lưu raw answer theo payload gốc, kể cả khi một số dạng như `likert_scale` và `essay` không có đúng/sai tuyệt đối. Với `essay`, BE nên hỗ trợ rubric/teacher grading sau submit.

## Tauri Offline Requirements

Tauri app nên dùng SQLite local với 3 bảng tối thiểu:

```sql
quiz_packages(id primary key, quiz_id, quiz_version, content_hash, payload_json, signature, downloaded_at, expires_at)
attempt_sessions(id primary key, quiz_id, package_id, payload_json, sync_status, created_at, updated_at, submitted_at)
sync_outbox(id primary key, attempt_id, payload_json, retry_count, next_retry_at, created_at)
```

Luồng Tauri:

1. Tải `QuizPackage` khi có mạng.
2. Verify signature/hash.
3. Lưu package local.
4. Khi làm bài, chấm bằng local engine.
5. Ghi attempt session + event log vào SQLite.
6. Nếu có mạng, sync outbox lên `/attempts/:attemptId/sync` hoặc `/submit`.
7. Nếu sync lỗi, tăng retry count và retry nền.

## Security Notes

Không có client-side grading nào bảo mật tuyệt đối vì đáp án/rubric nằm trên máy học sinh. Cách xử lý:

- Homework/training: dùng `client-first`, ưu tiên tốc độ và offline.
- Quiz điểm danh/đánh giá nhẹ: dùng `client-first` + BE recompute khi sync.
- Thi nghiêm túc: dùng `server-authoritative`, không gửi answer key xuống client.
- Tauri: ký package, hash event log, lưu audit trail để phát hiện sửa dữ liệu.

## BE Validation Checklist

- Validate quyền truy cập quiz/attempt theo studentId/classId/schoolId.
- Validate `packageHash` và `quizVersion`.
- Idempotent theo `attemptId` và `event.id`.
- Không nhân đôi điểm khi sync retry.
- Chấp nhận out-of-order events nhưng final submit phải có `submittedAt`.
- Có job recompute leaderboard/report sau submit.
- Có endpoint để giáo viên xem raw events khi cần audit.

## Current Frontend Behavior

Source hiện tại:

- Nếu không có `VITE_API_BASE`, dùng mock/local 100%.
- Nếu `VITE_GRADING_STRATEGY=client-first`, FE chấm ngay và sync nền.
- Nếu `VITE_GRADING_STRATEGY=server-authoritative`, FE ưu tiên BE chấm final.
- FE đã có local `AssessmentEngine`, `AttemptSession`, event log và browser localStorage store. Tauri có thể thay store này bằng SQLite adapter.
