# UML Diagrams
## Smart School Timetable Management and Optimization System

---

## 1. Use Case Diagram

```
                    ┌─────────────────────────────────────────────┐
                    │     Smart Timetable Management System        │
                    │                                              │
                    │  ┌──────────────┐  ┌─────────────────────┐  │
  ┌──────────┐      │  │ Auth Module  │  │   School Module      │  │
  │  Super   │──────┤  │              │  │                      │  │
  │  Admin   │      │  │ ○ Login      │  │ ○ Manage Schools     │  │
  └──────────┘      │  │ ○ Logout     │  │ ○ Manage Branches    │  │
       │            │  │ ○ Reset Pwd  │  │ ○ Manage Acad Years  │  │
  ┌────▼─────┐      │  │ ○ Manage     │  │ ○ Manage Semesters   │  │
  │  School  │──────┤  │   Sessions   │  │ ○ School Settings    │  │
  │  Admin   │      │  └──────────────┘  └─────────────────────┘  │
  └──────────┘      │                                              │
       │            │  ┌──────────────┐  ┌─────────────────────┐  │
  ┌────▼─────┐      │  │ Resource Mgmt│  │  Timetable Module    │  │
  │ Academic │──────┤  │              │  │                      │  │
  │ Manager  │      │  │ ○ Classrooms │  │ ○ Generate Timetable │  │
  └──────────┘      │  │ ○ Classes    │  │ ○ Edit Timetable     │  │
       │            │  │ ○ Subjects   │  │ ○ Publish Timetable  │  │
  ┌────▼─────┐      │  │ ○ Teachers   │  │ ○ View Timetable     │  │
  │Scheduler │──────┤  │ ○ Curriculum │  │ ○ Detect Conflicts   │  │
  └──────────┘      │  │ ○ Periods    │  │ ○ Export Timetable   │  │
       │            │  └──────────────┘  └─────────────────────┘  │
  ┌────▼─────┐      │                                              │
  │ Teacher  │──────┤  ┌──────────────┐  ┌─────────────────────┐  │
  └──────────┘      │  │ Reports      │  │   Notifications      │  │
       │            │  │              │  │                      │  │
  ┌────▼─────┐      │  │ ○ Workload   │  │ ○ Email Notify       │  │
  │  Viewer  │──────┤  │ ○ Classroom  │  │ ○ Telegram Notify    │  │
  └──────────┘      │  │   Utilization│  │ ○ In-App Notify      │  │
                    │  │ ○ Dashboard  │  │ ○ Manage Settings    │  │
                    │  └──────────────┘  └─────────────────────┘  │
                    └─────────────────────────────────────────────┘
```

---

## 2. Class Diagram — Domain Layer

```
┌──────────────────────────────────────────────────────────┐
│                    << AggregateRoot >>                    │
│                        School                            │
├──────────────────────────────────────────────────────────┤
│ - id: SchoolId                                           │
│ - name: String                                           │
│ - schoolType: SchoolType                                 │
│ - isActive: Boolean                                      │
├──────────────────────────────────────────────────────────┤
│ + create(name, type): School                             │
│ + activate(): void                                       │
│ + deactivate(): void                                     │
│ + updateSettings(settings): void                         │
└─────────┬────────────────────────────────────────────────┘
          │ 1
          │ has
          │ *
          ▼
┌─────────────────┐     ┌─────────────────┐
│   Branch        │     │  AcademicYear   │
├─────────────────┤     ├─────────────────┤
│ - id: UUID      │     │ - id: UUID      │
│ - schoolId: UUID│     │ - name: String  │
│ - name: String  │     │ - startDate     │
│ - isActive: bool│     │ - endDate       │
└─────────────────┘     │ - isCurrent     │
                        └───────┬─────────┘
                                │ 1
                                │ contains
                                │ 1..2
                                ▼
                        ┌─────────────────┐
                        │    Semester     │
                        ├─────────────────┤
                        │ - number: int   │
                        │ - startDate     │
                        │ - endDate       │
                        │ - isCurrent     │
                        └─────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    << AggregateRoot >>                    │
│                        Teacher                           │
├──────────────────────────────────────────────────────────┤
│ - id: TeacherId                                          │
│ - schoolId: SchoolId                                     │
│ - fullName: String                                       │
│ - minWeeklyLoad: int                                     │
│ - maxWeeklyLoad: int                                     │
│ - isActive: Boolean                                      │
├──────────────────────────────────────────────────────────┤
│ + addSubject(subjectId, isPrimary): void                 │
│ + removeSubject(subjectId): void                         │
│ + setAvailability(slots): void                           │
│ + isAvailableAt(day, period): boolean                    │
│ + getCurrentLoad(): int                                  │
│ + canTakeMoreLessons(): boolean                          │
└─────────┬──────────────────────────────────────────────  ┘
          │ 1
          ├── has → TeacherSubject[]
          └── has → TeacherAvailability[]

┌──────────────────────────────────────────────────────────┐
│                    << AggregateRoot >>                    │
│                       Timetable                          │
├──────────────────────────────────────────────────────────┤
│ - id: TimetableId                                        │
│ - schoolId: SchoolId                                     │
│ - semesterId: SemesterId                                 │
│ - status: TimetableStatus                                │
│ - qualityScore: QualityScore                             │
├──────────────────────────────────────────────────────────┤
│ + startGeneration(): void                                │
│ + completeGeneration(entries, score): void               │
│ + publish(publishedBy): void                             │
│ + addEntry(entry): void                                  │
│ + removeEntry(entryId): void                             │
│ + moveLesson(entryId, newSlot): Result                   │
│ + swapLessons(entryId1, entryId2): void                  │
│ + hasHardViolations(): boolean                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                     TimetableEntry                       │
├──────────────────────────────────────────────────────────┤
│ - id: UUID                                               │
│ - timetableId: TimetableId                              │
│ - studentClassId: StudentClassId                         │
│ - subjectId: SubjectId                                   │
│ - teacherId: TeacherId                                   │
│ - classroomId: ClassroomId                               │
│ - dayOfWeek: DayOfWeek                                   │
│ - periodNumber: int                                      │
│ - isPinned: boolean                                      │
├──────────────────────────────────────────────────────────┤
│ + pin(): void                                            │
│ + unpin(): void                                          │
│ + moveTo(day, period, classroomId): void                 │
└──────────────────────────────────────────────────────────┘

┌────────────────────────┐
│  << ValueObject >>     │
│    QualityScore        │
├────────────────────────┤
│ - overallScore: double │
│ - hardScore: int       │
│ - softScore: int       │
│ - violations: int      │
├────────────────────────┤
│ + isValid(): boolean   │
│ + getGrade(): Grade    │
└────────────────────────┘
```

---

## 3. Sequence Diagram — Timetable Generation

```
User          Frontend         Backend          Solver       DB
 │                │                │              │           │
 │─── Generate ──▶│                │              │           │
 │                │─── POST /gen ─▶│              │           │
 │                │                │─── Load ────▶│           │
 │                │                │   Problem    │           │
 │                │                │◀─────────────│           │
 │                │                │              │           │
 │                │                │─────────────────────────▶│
 │                │                │    Save GENERATING status │
 │                │                │◀─────────────────────────│
 │                │                │              │           │
 │                │◀── 202 Accepted│              │           │
 │◀──────────────▶│                │              │           │
 │  [Poll status] │                │              │           │
 │                │                │─── Solve() ─▶│           │
 │                │                │  (async)     │           │
 │                │                │              │─ Search ─▶│
 │                │─── GET /status▶│              │  spaces   │
 │                │◀── 65% done ───│              │           │
 │                │                │              │           │
 │                │                │◀── Best ─────│           │
 │                │                │   Solution   │           │
 │                │                │─────────────────────────▶│
 │                │                │   Save entries + score   │
 │                │                │─────────────────────────▶│
 │                │                │   Update status=GENERATED│
 │                │                │◀─────────────────────────│
 │                │─── GET /status▶│              │           │
 │                │◀── COMPLETED ──│              │           │
 │◀── View result─│                │              │           │
```

---

## 4. Sequence Diagram — Login Flow

```
User      Frontend      Backend       Redis        DB
 │             │             │           │           │
 │─ Login ────▶│             │           │           │
 │             │─ POST /auth▶│           │           │
 │             │             │──── Find user ───────▶│
 │             │             │◀─────────────────────│
 │             │             │                       │
 │             │             │─ Verify bcrypt hash   │
 │             │             │                       │
 │             │             │─ Generate JWT + RT    │
 │             │             │                       │
 │             │             │─ Store session ──────▶│
 │             │             │─ Store RT hash ──────▶│
 │             │             │           │           │
 │             │             │─ Write ──▶│           │
 │             │             │   session │           │
 │             │◀─ 200 +tokens│          │           │
 │◀─ Dashboard─│             │           │           │
```

---

## 5. State Machine — Timetable Lifecycle

```
         ┌─────────┐
         │  DRAFT  │◀─────────────── (created)
         └────┬────┘
              │ generate()
              ▼
         ┌───────────┐
         │ GENERATING │──── [solver running] ────
         └─────┬──────┘                          │
               │ complete()                      │ fail()
               ▼                                 ▼
         ┌───────────┐                    ┌──────────┐
         │ GENERATED │                    │  FAILED  │
         └─────┬──────┘                   └──────────┘
               │ publish()
               │ (only if hard_score == 0)
               ▼
         ┌───────────┐
         │ PUBLISHED │
         └─────┬──────┘
               │ archive() / new version published
               ▼
         ┌──────────┐
         │ ARCHIVED │
         └──────────┘
```

---

## 6. Component Diagram — System Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                      << System >>                           │
│            School Timetable Platform                        │
│                                                             │
│  ┌──────────────┐    ┌───────────────────────────────────┐  │
│  │  << Client >>│    │         << Backend >>             │  │
│  │  Next.js 15  │◄──▶│         Spring Boot 3             │  │
│  │  (Browser)   │    │                                   │  │
│  └──────────────┘    │  ┌────────────┐ ┌──────────────┐ │  │
│                      │  │  Domain    │ │ Timefold     │ │  │
│  ┌──────────────┐    │  │  Layer     │ │ Solver       │ │  │
│  │ << Mobile >> │    │  └────────────┘ └──────────────┘ │  │
│  │  PWA (future)│    │  ┌────────────┐ ┌──────────────┐ │  │
│  └──────────────┘    │  │  Infra     │ │ Export Svc   │ │  │
│                      │  │  (JPA/Redis│ │ (PDF/Excel)  │ │  │
│                      │  └────────────┘ └──────────────┘ │  │
│                      └───────────────────────────────────┘  │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐  ┌────────────────┐  │
│  │ PostgreSQL   │    │   Redis      │  │ External APIs  │  │
│  │   16         │    │   Cache      │  │ SMTP/Telegram  │  │
│  └──────────────┘    └──────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Deployment Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     VPS Server                           │
│                 (4 CPU, 8GB RAM)                         │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Docker Network                    │  │
│  │                                                    │  │
│  │  ┌─────────────┐    ┌──────────────────────────┐  │  │
│  │  │   Nginx     │    │   frontend:3000           │  │  │
│  │  │   :80/:443  │───▶│   (Next.js SSR)           │  │  │
│  │  │   SSL/TLS   │    └──────────────────────────┘  │  │
│  │  │   Rate Limit│    ┌──────────────────────────┐  │  │
│  │  │             │───▶│   backend:8080            │  │  │
│  │  └─────────────┘    │   (Spring Boot)           │  │  │
│  │                     └────────────┬─────────────┘  │  │
│  │  ┌─────────────┐                 │                 │  │
│  │  │ postgres:5432◀────────────────┤                 │  │
│  │  │ (PG 16)     │                 │                 │  │
│  │  └─────────────┘    ┌────────────▼─────────────┐  │  │
│  │  ┌─────────────┐    │   redis:6379              │  │  │
│  │  │  Backups    │    │   (Cache+Sessions)        │  │  │
│  │  │  (cron)     │    └──────────────────────────┘  │  │
│  │  └─────────────┘                                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │
         │ GitHub Actions CI/CD
         ▼
    GitHub Repo → Build → Test → Push Image → Deploy
```
