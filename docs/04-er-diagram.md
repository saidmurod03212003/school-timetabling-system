# ER Diagram
## Smart School Timetable Management and Optimization System

---

## Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    SCHOOLS {
        uuid id PK
        string name
        string short_name
        string logo_url
        string address
        string school_type
        boolean is_active
        timestamp created_at
    }

    BRANCHES {
        uuid id PK
        uuid school_id FK
        string name
        string address
        boolean is_active
    }

    ACADEMIC_YEARS {
        uuid id PK
        uuid school_id FK
        string name
        date start_date
        date end_date
        boolean is_current
    }

    SEMESTERS {
        uuid id PK
        uuid academic_year_id FK
        uuid school_id FK
        string name
        int semester_number
        date start_date
        date end_date
        boolean is_current
    }

    SCHOOL_SETTINGS {
        uuid id PK
        uuid school_id FK
        string[] working_days
        int shifts_count
        int max_daily_lessons_primary
        int max_daily_lessons_middle
        int max_daily_lessons_senior
    }

    USERS {
        uuid id PK
        string email
        string password_hash
        string full_name
        string phone
        boolean is_active
        uuid school_id FK
        timestamp last_login_at
    }

    ROLES {
        uuid id PK
        string name
        string display_name
    }

    PERMISSIONS {
        uuid id PK
        string code
        string module
        string action
    }

    ROLE_PERMISSIONS {
        uuid role_id FK
        uuid permission_id FK
    }

    USER_ROLES {
        uuid user_id FK
        uuid role_id FK
    }

    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK
        string token_hash
        timestamp expires_at
        timestamp revoked_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        uuid school_id
        string action
        string entity_type
        uuid entity_id
        jsonb old_value
        jsonb new_value
        timestamp created_at
    }

    CLASSROOM_TYPES {
        uuid id PK
        uuid school_id FK
        string code
        string name
    }

    CLASSROOMS {
        uuid id PK
        uuid school_id FK
        uuid branch_id FK
        uuid classroom_type_id FK
        string name
        int capacity
        string status
    }

    STUDENT_CLASSES {
        uuid id PK
        uuid school_id FK
        uuid branch_id FK
        uuid academic_year_id FK
        string name
        int grade_level
        string section
        int student_count
        string shift
        uuid home_room_id FK
    }

    SUBJECTS {
        uuid id PK
        uuid school_id FK
        string name
        string code
        string color
        uuid requires_classroom_type_id FK
    }

    TEACHERS {
        uuid id PK
        uuid school_id FK
        uuid user_id FK
        string full_name
        string short_name
        string phone
        string email
        int min_weekly_load
        int max_weekly_load
        boolean is_active
    }

    TEACHER_SUBJECTS {
        uuid id PK
        uuid teacher_id FK
        uuid subject_id FK
        boolean is_primary
    }

    TEACHER_AVAILABILITY {
        uuid id PK
        uuid teacher_id FK
        string day_of_week
        int period_from
        int period_to
        string availability_type
    }

    LESSON_PERIODS {
        uuid id PK
        uuid school_id FK
        string shift
        int period_number
        time start_time
        time end_time
        boolean is_active
    }

    CURRICULA {
        uuid id PK
        uuid school_id FK
        uuid semester_id FK
        uuid student_class_id FK
        boolean is_locked
    }

    CURRICULUM_ITEMS {
        uuid id PK
        uuid curriculum_id FK
        uuid subject_id FK
        uuid teacher_id FK
        int weekly_hours
    }

    TIMETABLES {
        uuid id PK
        uuid school_id FK
        uuid semester_id FK
        string name
        string status
        timestamp generation_started_at
        timestamp generation_completed_at
        int solver_duration_seconds
        timestamp published_at
    }

    TIMETABLE_QUALITY_SCORES {
        uuid id PK
        uuid timetable_id FK
        decimal overall_score
        int hard_score
        int soft_score
        int hard_constraint_violations
        jsonb score_explanation
    }

    TIMETABLE_ENTRIES {
        uuid id PK
        uuid timetable_id FK
        uuid school_id FK
        uuid student_class_id FK
        uuid subject_id FK
        uuid teacher_id FK
        uuid classroom_id FK
        string day_of_week
        int period_number
        uuid lesson_period_id FK
        boolean is_pinned
    }

    CONSTRAINT_VIOLATIONS {
        uuid id PK
        uuid timetable_id FK
        string constraint_type
        string constraint_name
        text description
        int impact_score
    }

    NOTIFICATIONS {
        uuid id PK
        uuid school_id FK
        uuid user_id FK
        string title
        string body
        string channel
        string status
        timestamp sent_at
        timestamp read_at
    }

    %% RELATIONSHIPS
    SCHOOLS ||--o{ BRANCHES : "has"
    SCHOOLS ||--o{ ACADEMIC_YEARS : "has"
    SCHOOLS ||--|| SCHOOL_SETTINGS : "configures"
    SCHOOLS ||--o{ CLASSROOMS : "owns"
    SCHOOLS ||--o{ STUDENT_CLASSES : "has"
    SCHOOLS ||--o{ SUBJECTS : "defines"
    SCHOOLS ||--o{ TEACHERS : "employs"
    SCHOOLS ||--o{ LESSON_PERIODS : "configures"
    SCHOOLS ||--o{ TIMETABLES : "generates"

    ACADEMIC_YEARS ||--o{ SEMESTERS : "contains"
    ACADEMIC_YEARS ||--o{ STUDENT_CLASSES : "belongs to"

    BRANCHES ||--o{ CLASSROOMS : "houses"
    BRANCHES ||--o{ STUDENT_CLASSES : "groups"

    CLASSROOM_TYPES ||--o{ CLASSROOMS : "categorizes"
    CLASSROOMS ||--o{ TIMETABLE_ENTRIES : "hosts"

    STUDENT_CLASSES ||--o{ CURRICULA : "has"
    STUDENT_CLASSES ||--o{ TIMETABLE_ENTRIES : "attends"

    SEMESTERS ||--o{ CURRICULA : "defines"
    SEMESTERS ||--o{ TIMETABLES : "for"

    SUBJECTS }o--o{ TEACHERS : "taught by"
    TEACHER_SUBJECTS }o--|| TEACHERS : ""
    TEACHER_SUBJECTS }o--|| SUBJECTS : ""

    TEACHERS ||--o{ TEACHER_AVAILABILITY : "available"
    TEACHERS ||--o{ CURRICULUM_ITEMS : "assigned"
    TEACHERS ||--o{ TIMETABLE_ENTRIES : "teaches"

    CURRICULA ||--o{ CURRICULUM_ITEMS : "contains"
    CURRICULUM_ITEMS }o--|| SUBJECTS : ""
    CURRICULUM_ITEMS }o--o| TEACHERS : ""

    TIMETABLES ||--o| TIMETABLE_QUALITY_SCORES : "scored"
    TIMETABLES ||--o{ TIMETABLE_ENTRIES : "contains"
    TIMETABLES ||--o{ CONSTRAINT_VIOLATIONS : "has"

    USERS }o--o{ ROLES : "has"
    USER_ROLES }o--|| USERS : ""
    USER_ROLES }o--|| ROLES : ""
    ROLES }o--o{ PERMISSIONS : "grants"
    ROLE_PERMISSIONS }o--|| ROLES : ""
    ROLE_PERMISSIONS }o--|| PERMISSIONS : ""

    USERS ||--o{ REFRESH_TOKENS : "owns"
    USERS ||--o{ AUDIT_LOGS : "creates"
    USERS ||--o| TEACHERS : "linked to"

    LESSON_PERIODS ||--o{ TIMETABLE_ENTRIES : "slots"
```

---

## Key Relationships Summary

| Relationship | Type | Description |
|---|---|---|
| School → Branch | 1:N | School has multiple branches |
| School → AcademicYear | 1:N | School has multiple academic years |
| AcademicYear → Semester | 1:N | Year has 2 semesters |
| School → Classroom | 1:N | School owns classrooms |
| School → Teacher | 1:N | School employs teachers |
| Teacher ↔ Subject | N:M | Teachers can teach multiple subjects |
| StudentClass → Curriculum | 1:1 per semester | Each class has one curriculum per semester |
| Curriculum → CurriculumItem | 1:N | Curriculum has items for each subject |
| Semester → Timetable | 1:N | Multiple timetable drafts per semester |
| Timetable → TimetableEntry | 1:N | Timetable contains lesson slots |
| TimetableEntry → {Class, Teacher, Classroom, Subject, Period} | N:1 each | Each entry references all resources |

---

## Integrity Constraints

```
Uniqueness Constraints:
├── (timetable_id, student_class_id, day_of_week, period_number) → UNIQUE
│     Prevents: class double-booking
├── (timetable_id, teacher_id, day_of_week, period_number) → UNIQUE
│     Prevents: teacher double-booking
├── (timetable_id, classroom_id, day_of_week, period_number) → UNIQUE
│     Prevents: room double-booking
├── (school_id, academic_year_id, class_name) → UNIQUE
│     Prevents: duplicate class names
└── (semester_id, student_class_id) → UNIQUE in curricula
      Prevents: duplicate curriculum per class/semester

Check Constraints:
├── grade_level BETWEEN 1 AND 11
├── semester_number IN (1, 2)
├── weekly_hours > 0
├── max_weekly_load >= min_weekly_load
└── start_date < end_date
```
