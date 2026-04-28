import {
  DashboardMetricCard,
  DashboardPageShell,
  DashboardSectionCard,
} from "@/components/dashboard/dashboard-page-shell";
import { Badge, Button, Input, ProgressBar } from "@/components/ui/dashboard-kit";
import {
  classroomSchools,
  classroomSnapshots,
  classroomStudents,
} from "@/features/classroom/api/mock-classroom-data";
import type { ClassroomSchool } from "@/features/classroom/types/classroom-types";
import type { DashboardLeaf } from "@/features/dashboard/types/dashboard-types";
import { cn } from "@/lib/utils";
import type { ManagementScope } from "@/types/scope-types";

type AdminOperationsWorkspaceProps = {
  activeLeaf: DashboardLeaf;
  managementScope: ManagementScope;
};

const importPreviewRows = [
  {
    fullName: "Nguyễn Minh An",
    centerName: "ERG Alpha Campus",
    className: "Lớp 6A1",
    status: "Hợp lệ",
    username: "an.nguyen.6a1",
  },
  {
    fullName: "Trần Bảo Ngọc",
    centerName: "ERG East Learning Point",
    className: "Lớp 7C2",
    status: "Thiếu ngày sinh",
    username: "ngoc.tran.7c2",
  },
  {
    fullName: "Lê Gia Khang",
    centerName: "ERG South Studio",
    className: "Lớp 6M1",
    status: "Hợp lệ",
    username: "khang.le.6m1",
  },
];

const permissionRows = [
  {
    role: "ERG Admin",
    scope: "Toàn hệ thống",
    abilities: "Quản lý trung tâm, học sinh, phân quyền, học liệu global",
    members: "3 tài khoản",
  },
  {
    role: "Điều phối trung tâm",
    scope: "Theo trung tâm được cấp",
    abilities: "Quản lý lớp, import học sinh, theo dõi báo cáo trung tâm",
    members: "9 tài khoản",
  },
  {
    role: "Giáo viên",
    scope: "Theo lớp phân công",
    abilities: "Giao bài, xem học sinh, phản hồi và báo cáo lớp",
    members: "42 tài khoản",
  },
];

export function AdminOperationsWorkspace({
  activeLeaf,
  managementScope,
}: AdminOperationsWorkspaceProps) {
  const scopedCenters = getScopedCenters(managementScope);
  const scopedCenterIds = scopedCenters.map((center) => center.id);
  const scopedClasses = classroomSnapshots.filter((snapshot) => scopedCenterIds.includes(snapshot.schoolId));
  const scopedStudents = classroomStudents.filter((student) => scopedCenterIds.includes(student.schoolId));
  const scopeDescription = getScopeDescription(managementScope, scopedCenters);

  return (
    <DashboardPageShell
      badge="Admin ERG"
      title={activeLeaf.title}
      description={activeLeaf.description}
      breadcrumbs={activeLeaf.breadcrumb}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">Xuất báo cáo</Button>
          <Button>Thêm mới</Button>
        </div>
      }
      headerContent={
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Phạm vi đang xem</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">{scopeDescription}</p>
          </div>
          <Badge tone="secondary">Chỉ hiển thị với quyền ERG</Badge>
        </div>
      }
    >
      {activeLeaf.variant === "admin-overview" ? (
        <AdminOverview
          centers={scopedCenters}
          classCount={scopedClasses.length}
          studentCount={scopedStudents.length}
        />
      ) : null}
      {activeLeaf.variant === "admin-centers" ? <CenterManagement centers={scopedCenters} /> : null}
      {activeLeaf.variant === "admin-students" ? <StudentManagement students={scopedStudents} /> : null}
      {activeLeaf.variant === "admin-sheet-import" ? <SheetImportWorkspace /> : null}
      {activeLeaf.variant === "admin-permissions" ? <PermissionWorkspace /> : null}
    </DashboardPageShell>
  );
}

function AdminOverview({
  centers,
  classCount,
  studentCount,
}: {
  centers: ClassroomSchool[];
  classCount: number;
  studentCount: number;
}) {
  const flaggedStudents = centers.reduce((sum, center) => sum + center.flaggedStudents, 0);
  const averageCompletion = Math.round(
    centers.reduce((sum, center) => sum + center.completionRate, 0) / Math.max(1, centers.length),
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard label="Trung tâm" value={String(centers.length)} detail="đang hoạt động" tone="blue" />
        <DashboardMetricCard label="Lớp" value={String(classCount)} detail="được cấu hình trong hệ thống" tone="emerald" />
        <DashboardMetricCard label="Học sinh" value={studentCount.toLocaleString("vi-VN")} detail="đã có tài khoản" tone="violet" />
        <DashboardMetricCard label="Cần hỗ trợ" value={String(flaggedStudents)} detail="học sinh cần theo dõi" tone="amber" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DashboardSectionCard title="Trung tâm trong phạm vi" description="Nhìn nhanh sức khỏe vận hành, không nhồi quá nhiều chỉ số.">
          <div className="grid gap-3">
            {centers.map((center) => (
              <CenterRow key={center.id} center={center} />
            ))}
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard title="Việc cần xử lý" description="Ưu tiên các thao tác admin hay dùng.">
          <div className="space-y-3">
            <ActionItem title="Duyệt file import học sinh" detail="2 file đang chờ kiểm tra cột và dữ liệu lỗi." />
            <ActionItem title="Kiểm tra quyền truy cập global" detail="1 tài khoản vừa được đề xuất quyền ERG Admin." />
            <ActionItem title="Rà học liệu dùng chung" detail={`${averageCompletion}% hoàn thành trung bình trong phạm vi.`} />
          </div>
        </DashboardSectionCard>
      </div>
    </>
  );
}

function CenterManagement({ centers }: { centers: ClassroomSchool[] }) {
  return (
    <DashboardSectionCard
      title="Danh sách trung tâm"
      description="Admin thêm trung tâm, kiểm tra trạng thái và đi tiếp vào danh sách lớp/học sinh."
      action={<Button>Thêm trung tâm</Button>}
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="hidden grid-cols-[minmax(0,1fr)_130px_130px_170px_140px] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 lg:grid">
          <span>Trung tâm</span>
          <span>Lớp</span>
          <span>Học sinh</span>
          <span>Hoàn thành</span>
          <span>Thao tác</span>
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          {centers.map((center) => (
            <article
              key={center.id}
              className="grid gap-3 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_130px_130px_170px_140px] lg:items-center"
            >
              <div>
                <h3 className="font-semibold text-slate-950">{center.name}</h3>
                <p className="mt-1 text-sm text-slate-500">Phụ trách: {center.principal}</p>
              </div>
              <FieldValue label="Lớp" value={`${center.activeClasses}`} />
              <FieldValue label="Học sinh" value={center.activeStudents.toLocaleString("vi-VN")} />
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-500 lg:hidden">Hoàn thành</span>
                  <span className="font-semibold text-slate-950">{center.completionRate}%</span>
                </div>
                <ProgressBar value={center.completionRate} className="mt-2 h-2" indicatorClassName="bg-emerald-500" />
              </div>
              <div className="flex gap-2 lg:justify-end">
                <Button variant="outline" size="sm">Chi tiết</Button>
                <Button size="sm">Lớp</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </DashboardSectionCard>
  );
}

function StudentManagement({
  students,
}: {
  students: typeof classroomStudents;
}) {
  return (
    <DashboardSectionCard
      title="Quản lý học sinh"
      description="Tìm học sinh toàn hệ thống hoặc theo trung tâm đã lọc, phục vụ kiểm tra tài khoản và chuyển lớp."
      action={<Button variant="outline">Tải mẫu import</Button>}
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
        <Input placeholder="Tìm theo tên, username, lớp..." aria-label="Tìm học sinh" />
        <select className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200">
          <option>Tất cả trung tâm</option>
          {classroomSchools.map((center) => (
            <option key={center.id}>{center.name}</option>
          ))}
        </select>
        <select className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200">
          <option>Tất cả trạng thái</option>
          <option>Cần hỗ trợ</option>
          <option>Ổn định</option>
          <option>Vượt nhịp</option>
        </select>
      </div>

      <div className="mt-4 max-h-[620px] overflow-auto rounded-2xl border border-slate-200">
        <div className="hidden grid-cols-[minmax(220px,1.1fr)_160px_160px_120px_150px] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 lg:grid">
          <span>Học sinh</span>
          <span>Trung tâm</span>
          <span>Lớp</span>
          <span>Điểm TB</span>
          <span>Trạng thái</span>
        </div>
        <div className="divide-y divide-slate-200 bg-white">
          {students.slice(0, 50).map((student) => (
            <article
              key={student.id}
              className="grid gap-3 px-4 py-4 lg:grid-cols-[minmax(220px,1.1fr)_160px_160px_120px_150px] lg:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
                  {student.avatarSeed}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-950">{student.name}</h3>
                  <p className="truncate text-sm text-slate-500">{student.currentAssignment}</p>
                </div>
              </div>
              <FieldValue label="Trung tâm" value={student.schoolName} />
              <FieldValue label="Lớp" value={student.className} />
              <FieldValue label="Điểm TB" value={`${student.averageScore}`} />
              <div>
                <Badge tone={student.status === "support" ? "warning" : student.status === "ahead" ? "success" : "outline"}>
                  {student.status === "support" ? "Cần hỗ trợ" : student.status === "ahead" ? "Vượt nhịp" : "Ổn định"}
                </Badge>
              </div>
            </article>
          ))}
        </div>
      </div>
    </DashboardSectionCard>
  );
}

function SheetImportWorkspace() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <DashboardSectionCard title="Nhập học sinh từ Google Sheet" description="Giai đoạn đầu mock flow/API contract, chưa tích hợp OAuth thật.">
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Link Google Sheet</span>
            <Input className="mt-2" defaultValue="https://docs.google.com/spreadsheets/d/erg-import-demo" />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Họ tên", "full_name"],
              ["Trung tâm", "center_name"],
              ["Lớp", "class_name"],
              ["Ngày sinh", "birthday"],
              ["Ghi chú", "note"],
              ["Cột trả username", "generated_username"],
            ].map(([label, value]) => (
              <label key={value} className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</span>
                <select className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-900 shadow-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200" defaultValue={value}>
                  <option value={value}>{value}</option>
                  <option value="skip">Bỏ qua</option>
                </select>
              </label>
            ))}
          </div>
        </div>
      </DashboardSectionCard>

      <DashboardSectionCard title="Quy tắc tạo tài khoản" description="Dễ kiểm tra, chống trùng username trước khi ghi ngược về Sheet.">
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <RuleLine label="Username" value="ten.ho.lop, thêm số nếu bị trùng" />
          <RuleLine label="Mật khẩu tạm" value="ERG + 6 số ngẫu nhiên" />
          <RuleLine label="Kết quả" value="Ghi username/password về sheet hoặc tải CSV" />
        </div>
        <Button className="mt-4 w-full">Kiểm tra file import</Button>
      </DashboardSectionCard>

      <DashboardSectionCard
        className="xl:col-span-2"
        title="Preview trước khi tạo"
        description="Admin nhìn lỗi ngay trong bảng, chỉ bấm tạo khi dữ liệu đã ổn."
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="hidden grid-cols-[minmax(0,1fr)_190px_130px_140px_160px] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 lg:grid">
            <span>Học sinh</span>
            <span>Trung tâm</span>
            <span>Lớp</span>
            <span>Trạng thái</span>
            <span>Username</span>
          </div>
          <div className="divide-y divide-slate-200 bg-white">
            {importPreviewRows.map((row) => (
              <article
                key={row.username}
                className="grid gap-3 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_190px_130px_140px_160px] lg:items-center"
              >
                <FieldValue label="Học sinh" value={row.fullName} />
                <FieldValue label="Trung tâm" value={row.centerName} />
                <FieldValue label="Lớp" value={row.className} />
                <Badge tone={row.status === "Hợp lệ" ? "success" : "warning"}>{row.status}</Badge>
                <FieldValue label="Username" value={row.username} />
              </article>
            ))}
          </div>
        </div>
      </DashboardSectionCard>
    </div>
  );
}

function PermissionWorkspace() {
  return (
    <DashboardSectionCard title="Phân quyền" description="Giữ ít vai trò, đặt theo cách admin ERG hay nói hằng ngày.">
      <div className="grid gap-3">
        {permissionRows.map((row) => (
          <article key={row.role} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="font-semibold text-slate-950">{row.role}</h3>
                <p className="mt-1 text-sm text-slate-500">{row.abilities}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="secondary">{row.scope}</Badge>
                <Badge tone="outline">{row.members}</Badge>
              </div>
            </div>
          </article>
        ))}
      </div>
    </DashboardSectionCard>
  );
}

function CenterRow({ center }: { center: ClassroomSchool }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-semibold text-slate-950">{center.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {center.activeClasses} lớp · {center.activeStudents.toLocaleString("vi-VN")} học sinh
          </p>
        </div>
        <Badge tone={center.flaggedStudents > 25 ? "warning" : "success"}>
          {center.flaggedStudents > 25 ? "Cần rà soát" : "Ổn định"}
        </Badge>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <FieldValue label="Hoàn thành" value={`${center.completionRate}%`} />
        <FieldValue label="Điểm TB" value={`${center.averageScore}`} />
        <FieldValue label="Cần hỗ trợ" value={`${center.flaggedStudents}`} />
      </div>
    </article>
  );
}

function ActionItem({ detail, title }: { detail: string; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

function FieldValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="text-xs font-medium text-slate-500 lg:hidden">{label}: </span>
      <span className="break-words text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function RuleLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2">
      <span className="font-semibold text-slate-950">{label}</span>
      <span className="text-right text-slate-500">{value}</span>
    </div>
  );
}

function getScopedCenters(managementScope: ManagementScope) {
  if (managementScope.level === "global" && managementScope.centerId) {
    return classroomSchools.filter((center) => center.id === managementScope.centerId);
  }

  if (managementScope.level !== "global") {
    return classroomSchools.filter((center) => center.id === managementScope.centerId);
  }

  return classroomSchools;
}

function getScopeDescription(managementScope: ManagementScope, centers: ClassroomSchool[]) {
  if (managementScope.level === "global" && !managementScope.centerId) {
    return "ERG toàn hệ thống · tất cả trung tâm";
  }

  const centerNames = centers.map((center) => center.name).join(", ");
  return cn("ERG toàn hệ thống", centerNames ? `· ${centerNames}` : "");
}
