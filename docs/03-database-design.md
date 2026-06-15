# Database Design
## Smart School Timetable Management and Optimization System
### PostgreSQL 16

---

## Complete Database Schema

```sql
-- ============================================================
-- EXTENSION SETUP
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search

-- ============================================================
-- AUTHENTICATION ZONE
-- ============================================================

CREATE TABLE roles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code        VARCHAR(100) NOT NULL UNIQUE,  -- e.g. 'timetable:generate'
    module      VARCHAR(50) NOT NULL,           -- e.g. 'timetable'
    action      VARCHAR(50) NOT NULL,           -- e.g. 'generate'
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
    role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    photo_url       VARCHAR(500),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    last_login_at   TIMESTAMPTZ,
    school_id       UUID,  -- NULL for super admin
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      UUID REFERENCES users(id),
    deleted_at      TIMESTAMPTZ  -- soft delete
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    device_info TEXT,
    ip_address  INET,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_info TEXT,
    ip_address  INET,
    user_agent  TEXT,
    last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at  TIMESTAMPTZ
);

CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES users(id),
    school_id   UUID,
    action      VARCHAR(100) NOT NULL,  -- e.g. 'USER_LOGIN', 'TIMETABLE_PUBLISHED'
    entity_type VARCHAR(100),
    entity_id   UUID,
    old_value   JSONB,
    new_value   JSONB,
    ip_address  INET,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SCHOOL ZONE
-- ============================================================

CREATE TABLE schools (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    short_name      VARCHAR(50),
    logo_url        VARCHAR(500),
    address         TEXT,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    region          VARCHAR(100),
    district        VARCHAR(100),
    school_type     VARCHAR(50) NOT NULL DEFAULT 'SECONDARY',  -- ELEMENTARY, SECONDARY, LYCEUM, COLLEGE
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE branches (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    address     TEXT,
    phone       VARCHAR(20),
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE academic_years (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name        VARCHAR(50) NOT NULL,  -- e.g. '2024-2025'
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    is_current  BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, name)
);

CREATE TABLE semesters (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,  -- e.g. '1-semestr'
    semester_number SMALLINT NOT NULL CHECK (semester_number IN (1, 2)),
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    is_current      BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(academic_year_id, semester_number)
);

CREATE TABLE school_settings (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id           UUID NOT NULL UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
    working_days        VARCHAR(10)[] NOT NULL DEFAULT ARRAY['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY'],
    shifts_count        SMALLINT NOT NULL DEFAULT 1 CHECK (shifts_count IN (1, 2)),
    max_daily_lessons_primary   SMALLINT NOT NULL DEFAULT 5,  -- grades 1-4
    max_daily_lessons_middle    SMALLINT NOT NULL DEFAULT 6,  -- grades 5-9
    max_daily_lessons_senior    SMALLINT NOT NULL DEFAULT 7,  -- grades 10-11
    telegram_chat_id    VARCHAR(100),
    telegram_bot_token  VARCHAR(255),
    smtp_host           VARCHAR(255),
    smtp_port           INT,
    smtp_username       VARCHAR(255),
    smtp_password_encrypted VARCHAR(500),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CLASSROOM ZONE
-- ============================================================

CREATE TABLE classroom_types (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    code        VARCHAR(50) NOT NULL,   -- STANDARD, COMPUTER_LAB, PHYSICS_LAB, etc.
    name        VARCHAR(100) NOT NULL,  -- Display name in Uzbek
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE classrooms (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    branch_id       UUID REFERENCES branches(id),
    classroom_type_id UUID NOT NULL REFERENCES classroom_types(id),
    name            VARCHAR(50) NOT NULL,     -- e.g. '101', 'Kompyuter lab 1'
    capacity        SMALLINT NOT NULL DEFAULT 30,
    floor           SMALLINT,
    building        VARCHAR(50),
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, MAINTENANCE, INACTIVE
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(school_id, name)
);

-- ============================================================
-- CLASS (STUDENT GROUP) ZONE
-- ============================================================

CREATE TABLE student_classes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    branch_id       UUID REFERENCES branches(id),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id),
    name            VARCHAR(20) NOT NULL,   -- e.g. '5-A', '10-B'
    grade_level     SMALLINT NOT NULL CHECK (grade_level BETWEEN 1 AND 11),
    section         VARCHAR(5) NOT NULL,    -- A, B, C, ...
    student_count   SMALLINT NOT NULL DEFAULT 0,
    shift           VARCHAR(10) NOT NULL DEFAULT 'FIRST',  -- FIRST, SECOND
    home_room_id    UUID REFERENCES classrooms(id),        -- assigned homeroom
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, academic_year_id, name)
);

-- ============================================================
-- SUBJECT ZONE
-- ============================================================

CREATE TABLE subjects (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name                VARCHAR(100) NOT NULL,
    code                VARCHAR(20) NOT NULL,
    color               VARCHAR(7),       -- hex color for calendar display
    is_core             BOOLEAN NOT NULL DEFAULT true,
    requires_classroom_type_id UUID REFERENCES classroom_types(id),  -- NULL = any room OK
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    UNIQUE(school_id, code)
);

-- ============================================================
-- TEACHER ZONE
-- ============================================================

CREATE TABLE teachers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),  -- linked user account (optional)
    full_name       VARCHAR(255) NOT NULL,
    short_name      VARCHAR(50),   -- e.g. 'Aliyev A.A.'
    phone           VARCHAR(20),
    email           VARCHAR(255),
    photo_url       VARCHAR(500),
    employment_type VARCHAR(20) NOT NULL DEFAULT 'FULL_TIME',  -- FULL_TIME, PART_TIME
    min_weekly_load SMALLINT NOT NULL DEFAULT 0,
    max_weekly_load SMALLINT NOT NULL DEFAULT 24,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE teacher_subjects (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id  UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    is_primary  BOOLEAN NOT NULL DEFAULT false,  -- primary specialization
    UNIQUE(teacher_id, subject_id)
);

CREATE TABLE teacher_availability (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id  UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL,  -- MONDAY, TUESDAY, ...
    period_from SMALLINT NOT NULL,     -- period number
    period_to   SMALLINT NOT NULL,
    availability_type VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',  -- AVAILABLE, PREFERRED, UNAVAILABLE
    UNIQUE(teacher_id, day_of_week, period_from, period_to)
);

CREATE TABLE teacher_unavailability (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id  UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    reason      VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LESSON PERIOD ZONE
-- ============================================================

CREATE TABLE lesson_periods (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    shift       VARCHAR(10) NOT NULL DEFAULT 'FIRST',
    period_number SMALLINT NOT NULL,  -- 1, 2, 3, ...
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(school_id, shift, period_number)
);

-- ============================================================
-- CURRICULUM ZONE
-- ============================================================

CREATE TABLE curricula (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    semester_id     UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    student_class_id UUID NOT NULL REFERENCES student_classes(id) ON DELETE CASCADE,
    name            VARCHAR(255),
    is_locked       BOOLEAN NOT NULL DEFAULT false,  -- locked after timetable generated
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(semester_id, student_class_id)
);

CREATE TABLE curriculum_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curriculum_id   UUID NOT NULL REFERENCES curricula(id) ON DELETE CASCADE,
    subject_id      UUID NOT NULL REFERENCES subjects(id),
    teacher_id      UUID REFERENCES teachers(id),     -- assigned teacher (can be null initially)
    weekly_hours    SMALLINT NOT NULL CHECK (weekly_hours > 0),
    UNIQUE(curriculum_id, subject_id)
);

-- ============================================================
-- TIMETABLE ZONE
-- ============================================================

CREATE TABLE timetables (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    semester_id     UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    -- DRAFT → GENERATING → GENERATED → PUBLISHED → ARCHIVED
    generation_started_at   TIMESTAMPTZ,
    generation_completed_at TIMESTAMPTZ,
    solver_duration_seconds INT,
    published_at    TIMESTAMPTZ,
    published_by    UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      UUID REFERENCES users(id)
);

CREATE TABLE timetable_quality_scores (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_id        UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    overall_score       DECIMAL(5,2) NOT NULL DEFAULT 0,
    hard_score          INT NOT NULL DEFAULT 0,       -- negative = violations
    soft_score          INT NOT NULL DEFAULT 0,       -- higher = better
    hard_constraint_violations INT NOT NULL DEFAULT 0,
    soft_constraint_penalties  INT NOT NULL DEFAULT 0,
    score_explanation   JSONB,
    calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE timetable_entries (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_id        UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    school_id           UUID NOT NULL REFERENCES schools(id),
    student_class_id    UUID NOT NULL REFERENCES student_classes(id),
    subject_id          UUID NOT NULL REFERENCES subjects(id),
    teacher_id          UUID NOT NULL REFERENCES teachers(id),
    classroom_id        UUID NOT NULL REFERENCES classrooms(id),
    day_of_week         VARCHAR(10) NOT NULL,  -- MONDAY, TUESDAY, ...
    period_number       SMALLINT NOT NULL,
    lesson_period_id    UUID NOT NULL REFERENCES lesson_periods(id),
    is_pinned           BOOLEAN NOT NULL DEFAULT false,  -- prevents solver from moving
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Unique: same class, day, period → only one lesson
    UNIQUE(timetable_id, student_class_id, day_of_week, period_number),
    -- Unique: same teacher, day, period → only one lesson
    UNIQUE(timetable_id, teacher_id, day_of_week, period_number),
    -- Unique: same classroom, day, period → only one lesson
    UNIQUE(timetable_id, classroom_id, day_of_week, period_number)
);

CREATE TABLE constraint_violations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_id        UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    constraint_type     VARCHAR(20) NOT NULL,   -- HARD, SOFT
    constraint_name     VARCHAR(100) NOT NULL,
    description         TEXT NOT NULL,
    impact_score        INT NOT NULL DEFAULT 0,
    entry_ids           UUID[],
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATION ZONE
-- ============================================================

CREATE TABLE notification_templates (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code        VARCHAR(100) NOT NULL UNIQUE,
    title_uz    VARCHAR(255) NOT NULL,   -- Uzbek title template
    body_uz     TEXT NOT NULL,           -- Uzbek body template (supports {variable})
    channel     VARCHAR(20) NOT NULL,   -- EMAIL, TELEGRAM, IN_APP
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID REFERENCES schools(id),
    user_id         UUID REFERENCES users(id),
    template_code   VARCHAR(100),
    title           VARCHAR(255) NOT NULL,
    body            TEXT NOT NULL,
    channel         VARCHAR(20) NOT NULL DEFAULT 'IN_APP',
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING, SENT, FAILED, READ
    metadata        JSONB,
    sent_at         TIMESTAMPTZ,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notification_settings (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_enabled       BOOLEAN NOT NULL DEFAULT true,
    telegram_enabled    BOOLEAN NOT NULL DEFAULT false,
    in_app_enabled      BOOLEAN NOT NULL DEFAULT true,
    telegram_chat_id    VARCHAR(100),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Authentication
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Schools
CREATE INDEX idx_academic_years_school_id ON academic_years(school_id);
CREATE INDEX idx_semesters_academic_year ON semesters(academic_year_id);
CREATE INDEX idx_semesters_school_id ON semesters(school_id);

-- Resources
CREATE INDEX idx_classrooms_school_id ON classrooms(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_student_classes_school_year ON student_classes(school_id, academic_year_id);
CREATE INDEX idx_teachers_school_id ON teachers(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_teacher_subjects_teacher ON teacher_subjects(teacher_id);
CREATE INDEX idx_teacher_subjects_subject ON teacher_subjects(subject_id);
CREATE INDEX idx_teacher_availability_teacher ON teacher_availability(teacher_id);

-- Curriculum
CREATE INDEX idx_curricula_semester ON curricula(semester_id);
CREATE INDEX idx_curriculum_items_curriculum ON curriculum_items(curriculum_id);
CREATE INDEX idx_curriculum_items_teacher ON curriculum_items(teacher_id);

-- Timetable
CREATE INDEX idx_timetables_school_semester ON timetables(school_id, semester_id);
CREATE INDEX idx_timetable_entries_timetable ON timetable_entries(timetable_id);
CREATE INDEX idx_timetable_entries_class ON timetable_entries(student_class_id);
CREATE INDEX idx_timetable_entries_teacher ON timetable_entries(teacher_id);
CREATE INDEX idx_timetable_entries_classroom ON timetable_entries(classroom_id);
CREATE INDEX idx_timetable_entries_day_period ON timetable_entries(day_of_week, period_number);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id) WHERE status != 'READ';
CREATE INDEX idx_notifications_school ON notifications(school_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'users', 'schools', 'branches', 'academic_years', 'semesters',
        'classrooms', 'student_classes', 'subjects', 'teachers',
        'lesson_periods', 'curricula', 'timetables', 'timetable_entries'
    ] LOOP
        EXECUTE format(
            'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()',
            tbl
        );
    END LOOP;
END $$;

-- Ensure only one active academic year per school
CREATE OR REPLACE FUNCTION ensure_single_current_academic_year()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_current = true THEN
        UPDATE academic_years
        SET is_current = false
        WHERE school_id = NEW.school_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER single_current_academic_year
BEFORE INSERT OR UPDATE ON academic_years
FOR EACH ROW WHEN (NEW.is_current = true)
EXECUTE FUNCTION ensure_single_current_academic_year();
```

---

## Table Summary

| Zone | Tables | Count |
|------|--------|-------|
| Authentication | users, roles, permissions, role_permissions, user_roles, refresh_tokens, password_reset_tokens, sessions, audit_logs | 9 |
| School | schools, branches, academic_years, semesters, school_settings | 5 |
| Classroom | classrooms, classroom_types | 2 |
| Class | student_classes | 1 |
| Subject | subjects | 1 |
| Teacher | teachers, teacher_subjects, teacher_availability, teacher_unavailability | 4 |
| Period | lesson_periods | 1 |
| Curriculum | curricula, curriculum_items | 2 |
| Timetable | timetables, timetable_quality_scores, timetable_entries, constraint_violations | 4 |
| Notification | notifications, notification_templates, notification_settings | 3 |
| **TOTAL** | | **32** |
