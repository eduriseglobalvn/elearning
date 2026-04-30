# FE Task: One-Load One-Submit Quiz Runtime

## Mục tiêu

Đổi flow làm quiz của học sinh sang mô hình chịu tải lớn:

- Học sinh tải quiz package đúng 1 lần khi bắt đầu bài.
- Toàn bộ quá trình làm bài chạy local trên client.
- Không gọi API save answer/sync liên tục trong lúc làm bài.
- Khi học sinh nộp bài, FE gửi đúng 1 request submit cuối cùng lên BE.
- Nếu submit lỗi mạng, FE retry cùng payload/idempotency key, không tạo lần nộp mới.

Mục tiêu hệ thống là giảm write traffic để chuẩn bị cho 100.000 học sinh làm bài cùng lúc.

## Phạm vi

Áp dụng cho student quiz player trong eLearning FE, đặc biệt luồng từ student dashboard mở bài làm.

Các khu vực cần kiểm tra/chỉnh:

- `src/features/student-dashboard`
- `src/components/quiz`
- quiz player shell/runtime hiện tại
- API adapter cho LMS/assessment
- local attempt store

## Luồng mới

```text
Student mở assignment
        |
        v
FE gọi GET quiz package 1 lần
        |
        v
FE tạo local attempt session
        |
        v
Student làm bài hoàn toàn local
        |
        v
FE lưu nháp local trên trình duyệt
        |
        v
Student bấm nộp bài
        |
        v
FE gửi POST submit 1 lần
        |
        v
BE chấm/lưu kết quả và trả final result
```

## API Contract FE Cần Dùng

### 1. Load package

```http
GET /api/lms/quizzes/:quizId/package
```

FE gọi endpoint này một lần khi bắt đầu bài hoặc khi local cache không còn hợp lệ.

Response kỳ vọng:

```json
{
  "contentHash": "sha256_or_backend_hash",
  "signature": "optional-signature",
  "gradingMode": "server-authoritative",
  "quiz": {
    "quiz": {
      "id": "quiz_id",
      "version": 1,
      "questionIds": []
    },
    "slides": [],
    "settings": {},
    "result": {},
    "theme": {}
  }
}
```

### 2. Start attempt

Nếu BE yêu cầu attempt server-side trước khi làm bài:

```http
POST /api/lms/attempts
```

Payload:

```json
{
  "assignmentId": "assignment_id",
  "quizId": "quiz_id",
  "packageId": "package_id_or_quiz_id",
  "packageHash": "content_hash"
}
```

Yêu cầu FE:

- Gọi tối đa 1 lần khi vào bài.
- Nếu refresh trang, ưu tiên dùng local attempt session đang có.
- Nếu gọi lại do retry, giữ cùng local `attemptId`/idempotency key nếu BE hỗ trợ.

### 3. Submit final

```http
POST /api/lms/attempts/:attemptId/submit
```

Payload:

```json
{
  "packageHash": "content_hash",
  "quizVersion": "version",
  "startedAt": "2026-04-30T10:00:00.000Z",
  "submittedAt": "2026-04-30T10:45:00.000Z",
  "durationMs": 2700000,
  "answers": {
    "question_id_1": {
      "choiceId": "A"
    },
    "question_id_2": {
      "choiceIds": ["A", "C"]
    }
  },
  "clientResult": {
    "score": 8,
    "maxScore": 10,
    "percent": 80
  },
  "clientEvents": []
}
```

Yêu cầu FE:

- Chỉ submit khi học sinh bấm nộp hoặc hết giờ.
- Không gọi `save answer` từng câu.
- Không gọi `/sync` định kỳ.
- Dùng cùng `X-Idempotency-Key` khi retry submit.
- Sau khi submit thành công, khóa bài làm local và hiển thị kết quả từ BE.

## Local State

FE cần lưu local attempt session để chống mất bài khi refresh/mất mạng:

```ts
type LocalQuizAttemptSession = {
  attemptId: string;
  assignmentId: string;
  quizId: string;
  packageHash: string;
  quizVersion: string;
  startedAt: string;
  updatedAt: string;
  submittedAt?: string;
  status: "in_progress" | "submitting" | "submitted" | "submit_failed";
  answers: Record<string, unknown>;
  clientEvents: Array<Record<string, unknown>>;
  submitIdempotencyKey: string;
};
```

Ưu tiên IndexedDB nếu đã có store phù hợp. Nếu chưa có, có thể dùng localStorage tạm thời nhưng phải bọc qua adapter để sau này đổi sang IndexedDB/SQLite dễ hơn.

## Yêu Cầu UX

- Khi package đang tải: hiển thị loading trong player.
- Nếu package tải lỗi: cho học sinh retry, không vào màn làm bài rỗng.
- Khi đang làm bài: mọi thao tác chọn đáp án phải phản hồi tức thì, không chờ network.
- Nếu refresh trang: hỏi học sinh tiếp tục bài đang làm nếu local session còn hợp lệ.
- Khi submit: disable nút submit, hiển thị trạng thái đang nộp.
- Nếu submit lỗi mạng: hiển thị trạng thái chưa nộp thành công và nút thử lại.
- Nếu submit thành công: xóa hoặc khóa local draft, cập nhật trạng thái assignment là `submitted`.

## Yêu Cầu Bảo Mật

- Không tin điểm client nếu BE trả kết quả chấm lại.
- FE có thể chấm local để hiển thị nhanh, nhưng final result phải ưu tiên response từ BE.
- Không hiển thị đáp án đúng trước khi submit nếu quiz setting không cho phép review.
- Không gửi answer key/rubric nhạy cảm vào log console.
- Không lưu token/auth data trong attempt payload.

## Implementation Checklist

- [ ] Tạo API adapter: `getQuizPackage(quizId)`.
- [ ] Tạo API adapter: `startAttempt({ assignmentId, quizId, packageId, packageHash })`.
- [ ] Tạo API adapter: `submitAttempt(attemptId, payload, idempotencyKey)`.
- [ ] Tạo local attempt store adapter.
- [ ] Update `PlayerShell` để nhận package đã load thay vì tự fetch nhiều lần.
- [ ] Update student dashboard flow: mở assignment -> load package -> start/create local session -> render player.
- [ ] Bỏ/disable mọi autosave hoặc periodic sync trong quiz runtime.
- [ ] Khi answer thay đổi, chỉ update local store.
- [ ] Khi submit, build final answer payload từ local store.
- [ ] Retry submit bằng cùng `submitIdempotencyKey`.
- [ ] Sau submit thành công, invalidate assignment list/student score cache.
- [ ] Thêm tests cho refresh/resume/submit retry.

## Acceptance Criteria

- Mở một assignment chỉ tạo tối đa:
  - 1 request load package.
  - 0 request save answer trong lúc làm bài.
  - 0 request sync định kỳ trong lúc làm bài.
  - 1 request submit khi nộp bài.
- Refresh trong lúc làm bài không mất đáp án đã chọn.
- Mất mạng trong lúc làm bài vẫn tiếp tục chọn đáp án local được.
- Submit lỗi mạng có thể retry và không tạo duplicate attempt.
- Submit thành công hiển thị kết quả từ BE.
- Không có polling/progress sync chạy trong quiz player.
- DevTools Network khi làm 10 câu chỉ thấy package/start/submit, không thấy 10 request answer-save.

## Test Cases

1. Bắt đầu bài mới
   - Vào student dashboard.
   - Bấm bắt đầu assignment.
   - Kiểm tra chỉ gọi package/start một lần.

2. Làm bài local
   - Chọn đáp án 10 câu.
   - Kiểm tra Network không có request save/sync.
   - Refresh trang.
   - Kiểm tra đáp án vẫn còn.

3. Submit thành công
   - Bấm nộp bài.
   - Kiểm tra chỉ có một request submit.
   - Kết quả lấy từ response BE.

4. Submit retry
   - Giả lập request submit đầu tiên lỗi mạng.
   - Bấm thử lại.
   - Kiểm tra retry dùng cùng idempotency key.
   - Không tạo duplicate result.

5. Hết giờ
   - Khi timer hết, FE gọi submit một lần.
   - Nếu submit lỗi, giữ trạng thái `submit_failed` để retry.

## Không Làm Trong Task Này

- Không triển khai proctoring/chống gian lận nâng cao.
- Không làm teacher live progress real-time.
- Không gửi từng answer lên BE.
- Không sync event log định kỳ khi học sinh đang làm bài.

## Ghi Chú Cho BE

BE cần hỗ trợ submit idempotent và chấm/lưu server-side. FE sẽ tối ưu traffic bằng cách chỉ gửi final payload một lần, nhưng BE vẫn là nguồn sự thật cuối cùng cho kết quả chính thức.
