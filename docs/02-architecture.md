# System Architecture
## Smart School Timetable Management and Optimization System

---

## 1. Architecture Overview

The system follows **Clean Architecture** combined with **Domain-Driven Design (DDD)**, ensuring separation of concerns, testability, and maintainability.

### 1.1 Architectural Layers

```
┌────────────────────────────────────────────────────────┐
│                  Presentation Layer                     │
│          (REST Controllers, DTOs, Mappers)              │
├────────────────────────────────────────────────────────┤
│                  Application Layer                      │
│        (Use Cases, Commands, Queries, Handlers)         │
├────────────────────────────────────────────────────────┤
│                    Domain Layer                         │
│      (Entities, Value Objects, Domain Services,         │
│       Aggregates, Domain Events, Specifications)        │
├────────────────────────────────────────────────────────┤
│                Infrastructure Layer                     │
│    (JPA Repositories, Redis, Email, Telegram,           │
│     Timefold Solver, External APIs)                    │
└────────────────────────────────────────────────────────┘
```

### 1.2 Dependency Rule
> Inner layers define interfaces. Outer layers implement them. Dependencies always point inward.

---

## 2. System Components

### 2.1 Component Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 15)                      │
│  ┌──────────┐ ┌─────────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  Pages   │ │  Components │ │  Store   │ │  API Client      │  │
│  │  (App    │ │  (Shadcn UI │ │ (Zustand)│ │  (TanStack Query)│  │
│  │  Router) │ │  + Custom)  │ │          │ │                  │  │
│  └──────────┘ └─────────────┘ └──────────┘ └──────────────────┘  │
└─────────────────────────┬─────────────────────────────────────────┘
                          │ HTTPS/REST
┌─────────────────────────▼─────────────────────────────────────────┐
│                    NGINX (Reverse Proxy + SSL)                      │
│              - Rate Limiting  - Static Files  - Gzip               │
└─────────────────────────┬─────────────────────────────────────────┘
                          │
┌─────────────────────────▼─────────────────────────────────────────┐
│                    BACKEND (Spring Boot 3 / Java 21)               │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Presentation Layer                                           │  │
│  │  AuthController  SchoolController  TimetableController  ...  │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ Application Layer                                            │  │
│  │  GenerateTimetableUseCase  ManageCurriculumUseCase  ...      │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ Domain Layer                                                 │  │
│  │  School  Teacher  Classroom  Subject  Timetable  Curriculum  │  │
│  ├─────────────────────────────────────────────────────────────┤  │
│  │ Infrastructure Layer                                         │  │
│  │  JPA Repos │ Redis │ Flyway │ Email │ Telegram │ Timefold    │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────┬───────────────────┬────────────────────┬────────────────────┘
      │                   │                    │
┌─────▼──────┐  ┌─────────▼──────┐  ┌─────────▼──────┐
│ PostgreSQL  │  │  Redis Cache   │  │ Timefold Solver │
│    16      │  │  (Sessions +   │  │  (OptaPlanner   │
│            │  │   Cache)       │  │   Successor)    │
└────────────┘  └────────────────┘  └────────────────┘
```

---

## 3. Backend Architecture (Clean Architecture + DDD)

### 3.1 Domain Aggregates

```
┌──────────────── SCHOOL AGGREGATE ────────────────┐
│  School (Root)                                    │
│    ├── Branch[]                                   │
│    ├── AcademicYear[]                             │
│    │     └── Semester[]                           │
│    └── SchoolSettings                             │
└───────────────────────────────────────────────────┘

┌──────────────── RESOURCE AGGREGATES ─────────────┐
│  Teacher (Root)                                   │
│    ├── TeacherSubject[]                           │
│    └── TeacherAvailability[]                      │
│                                                   │
│  Classroom (Root)                                 │
│    └── ClassroomAvailability[]                    │
│                                                   │
│  StudentClass (Root)                              │
│    └── ClassCurriculum                            │
│          └── CurriculumItem[]                     │
└───────────────────────────────────────────────────┘

┌──────────────── TIMETABLE AGGREGATE ─────────────┐
│  Timetable (Root)                                 │
│    ├── TimetableVersion                           │
│    ├── TimetableEntry[]                           │
│    │     ├── Lesson (Subject + Class + Teacher)   │
│    │     └── LessonSlot (Day + Period + Room)     │
│    └── QualityScore                               │
└───────────────────────────────────────────────────┘
```

### 3.2 Domain Events

```java
// Events published by aggregates
TimetableGenerationStartedEvent
TimetableGenerationCompletedEvent
TimetableGenerationFailedEvent
TimetablePublishedEvent
TeacherAvailabilityChangedEvent
CurriculumUpdatedEvent
```

### 3.3 CQRS Pattern

```
Commands (Write):                    Queries (Read):
─────────────────                    ────────────────
GenerateTimetableCommand             GetTimetableByClassQuery
PublishTimetableCommand              GetTeacherScheduleQuery
CreateTeacherCommand                 GetClassroomUtilizationQuery
UpdateCurriculumCommand              GetQualityScoreQuery
PinLessonSlotCommand                 GetConstraintViolationsQuery
```

---

## 4. Frontend Architecture (Next.js 15)

### 4.1 App Router Structure

```
src/app/
├── (auth)/
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
├── (dashboard)/
│   ├── layout.tsx          ← Protected layout with sidebar
│   ├── page.tsx            ← Dashboard
│   ├── schools/
│   ├── branches/
│   ├── academic-years/
│   ├── classrooms/
│   ├── classes/
│   ├── subjects/
│   ├── teachers/
│   ├── curriculum/
│   ├── timetable/
│   │   ├── generate/
│   │   ├── editor/
│   │   └── view/
│   ├── reports/
│   ├── exports/
│   ├── notifications/
│   ├── settings/
│   └── users/
└── api/                    ← Next.js API routes (BFF pattern)
```

### 4.2 State Management

```
Zustand Stores:
├── authStore          ← User, tokens, session
├── schoolStore        ← Active school/branch/semester
├── timetableStore     ← Current timetable, edit state
├── notificationStore  ← Unread notifications
└── uiStore            ← Theme, sidebar, modals
```

### 4.3 Data Fetching Strategy

```
TanStack Query:
├── Server State (API data)     → useQuery hooks
├── Mutations                   → useMutation hooks
├── Optimistic Updates          → For drag-and-drop
├── Cache Invalidation          → Post-mutation
└── Background Refetch          → 30s for active timetable
```

---

## 5. Timetable Solver Architecture

### 5.1 Timefold Solver Pipeline

```
Input Data
    │
    ▼
┌────────────────────────────┐
│   TimetableSolution        │
│   (Planning Solution)      │
│   ├── Lessons (planning    │
│   │   entities)            │
│   └── LessonSlots          │
│       (planning variables) │
└─────────────────┬──────────┘
                  │
                  ▼
┌────────────────────────────┐
│   ConstraintProvider       │
│   ├── Hard Constraints     │
│   │   ├── noTeacherConflict│
│   │   ├── noClassConflict  │
│   │   ├── noRoomConflict   │
│   │   └── ...              │
│   └── Soft Constraints     │
│       ├── minimizeGaps     │
│       ├── morningForHard   │
│       └── ...              │
└─────────────────┬──────────┘
                  │
                  ▼
┌────────────────────────────┐
│   SolverManager            │
│   ├── Construction         │
│   │   Heuristic            │
│   └── Local Search         │
│       (Tabu Search)        │
└─────────────────┬──────────┘
                  │
                  ▼
┌────────────────────────────┐
│   Optimized Timetable      │
│   + Quality Score          │
│   + Constraint Violations  │
└────────────────────────────┘
```

---

## 6. Database Architecture

### 6.1 Schema Zones

```
Authentication Zone:
  users, roles, permissions, role_permissions, user_roles,
  refresh_tokens, audit_logs, sessions

School Zone:
  schools, branches, academic_years, semesters, school_settings

Resource Zone:
  classrooms, classroom_types,
  student_classes, subjects,
  teachers, teacher_subjects, teacher_availability,
  lesson_periods

Academic Zone:
  curricula, curriculum_items

Timetable Zone:
  timetables, timetable_versions, timetable_entries,
  quality_scores, constraint_violations

Notification Zone:
  notifications, notification_templates, notification_settings
```

### 6.2 Multi-tenancy Strategy
- **Discriminator-based**: Every entity carries a `school_id` foreign key
- **Row-level security**: Spring Security filters all queries by school context
- **Connection pool**: Shared pool, tenant identified via JWT claim

---

## 7. Caching Strategy

```
Redis Key Patterns:
├── auth:session:{userId}:{sessionId}     TTL: 7 days
├── auth:refresh:{token}                  TTL: 7 days
├── school:{schoolId}:settings            TTL: 1 hour
├── timetable:{timetableId}:entries       TTL: 5 min
├── teacher:{teacherId}:schedule          TTL: 5 min
├── classroom:{id}:availability           TTL: 1 hour
└── rate-limit:{ip}                       TTL: 1 min
```

---

## 8. API Design Principles

- **RESTful**: Standard HTTP verbs (GET, POST, PUT, PATCH, DELETE)
- **Versioned**: `/api/v1/...`
- **Consistent responses**: `{ data, meta, errors }` envelope
- **Pagination**: Cursor-based for large lists, offset for small
- **Filtering**: Query params `?filter[field]=value`
- **Sorting**: `?sort=field:asc`
- **Partial updates**: PATCH for partial, PUT for full replacement

---

## 9. Integration Architecture

### 9.1 Telegram Bot Integration
```
Telegram Bot API ←→ WebHook Handler ←→ NotificationService
                                              ↓
                                    NotificationRepository
```

### 9.2 Email Integration
```
JavaMailSender → Thymeleaf Templates → SMTP Server
                      ↓
               EmailNotificationService
```

---

## 10. Deployment Architecture

See [13-deployment.md](13-deployment.md) for full details.

### Summary
```
Internet → Cloudflare (DDoS) → VPS (Nginx) → Docker Network
  Docker Network:
    ├── frontend:3000
    ├── backend:8080
    ├── postgresql:5432
    └── redis:6379
```
