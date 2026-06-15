-- V4: Curriculum and Timetable tables

CREATE TABLE curricula (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id        UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    semester_id      UUID        NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    student_class_id UUID        NOT NULL REFERENCES student_classes(id) ON DELETE CASCADE,
    name             VARCHAR(255),
    is_locked        BOOLEAN     NOT NULL DEFAULT false,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (semester_id, student_class_id)
);

CREATE TABLE curriculum_items (
    id            UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
    curriculum_id UUID     NOT NULL REFERENCES curricula(id) ON DELETE CASCADE,
    subject_id    UUID     NOT NULL REFERENCES subjects(id),
    teacher_id    UUID     REFERENCES teachers(id),
    weekly_hours  SMALLINT NOT NULL CHECK (weekly_hours > 0),
    UNIQUE (curriculum_id, subject_id)
);

CREATE TABLE timetables (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id               UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    semester_id             UUID        NOT NULL REFERENCES semesters(id),
    name                    VARCHAR(255) NOT NULL,
    status                  VARCHAR(20)  NOT NULL DEFAULT 'DRAFT',
    generation_started_at   TIMESTAMPTZ,
    generation_completed_at TIMESTAMPTZ,
    solver_duration_seconds INT,
    published_at            TIMESTAMPTZ,
    published_by            UUID        REFERENCES users(id),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by              UUID        REFERENCES users(id)
);

CREATE TABLE timetable_quality_scores (
    id                         UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_id               UUID     NOT NULL UNIQUE REFERENCES timetables(id) ON DELETE CASCADE,
    overall_score              DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (overall_score BETWEEN 0 AND 100),
    hard_score                 INT      NOT NULL DEFAULT 0,
    soft_score                 INT      NOT NULL DEFAULT 0,
    hard_constraint_violations INT      NOT NULL DEFAULT 0,
    soft_constraint_penalties  INT      NOT NULL DEFAULT 0,
    score_explanation          JSONB,
    calculated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE timetable_entries (
    id               UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_id     UUID     NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    school_id        UUID     NOT NULL REFERENCES schools(id),
    student_class_id UUID     NOT NULL REFERENCES student_classes(id),
    subject_id       UUID     NOT NULL REFERENCES subjects(id),
    teacher_id       UUID     NOT NULL REFERENCES teachers(id),
    classroom_id     UUID     NOT NULL REFERENCES classrooms(id),
    day_of_week      VARCHAR(10) NOT NULL,
    period_number    SMALLINT NOT NULL CHECK (period_number >= 1),
    lesson_period_id UUID     NOT NULL REFERENCES lesson_periods(id),
    is_pinned        BOOLEAN  NOT NULL DEFAULT false,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Hard constraint enforcement at DB level
    UNIQUE (timetable_id, student_class_id, day_of_week, period_number),
    UNIQUE (timetable_id, teacher_id, day_of_week, period_number),
    UNIQUE (timetable_id, classroom_id, day_of_week, period_number)
);

CREATE TABLE constraint_violations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_id    UUID        NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    constraint_type VARCHAR(20)  NOT NULL,
    constraint_name VARCHAR(100) NOT NULL,
    description     TEXT        NOT NULL,
    impact_score    INT         NOT NULL DEFAULT 0,
    entry_ids       UUID[],
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notification tables
CREATE TABLE notification_templates (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code      VARCHAR(100) NOT NULL UNIQUE,
    title_uz  VARCHAR(255) NOT NULL,
    body_uz   TEXT         NOT NULL,
    channel   VARCHAR(20)  NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id     UUID        REFERENCES schools(id),
    user_id       UUID        REFERENCES users(id),
    template_code VARCHAR(100),
    title         VARCHAR(255) NOT NULL,
    body          TEXT        NOT NULL,
    channel       VARCHAR(20)  NOT NULL DEFAULT 'IN_APP',
    status        VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    metadata      JSONB,
    sent_at       TIMESTAMPTZ,
    read_at       TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notification_settings (
    id               UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID    NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_enabled    BOOLEAN NOT NULL DEFAULT true,
    telegram_enabled BOOLEAN NOT NULL DEFAULT false,
    in_app_enabled   BOOLEAN NOT NULL DEFAULT true,
    telegram_chat_id VARCHAR(100),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_curricula_semester      ON curricula(semester_id);
CREATE INDEX idx_curricula_class         ON curricula(student_class_id);
CREATE INDEX idx_curriculum_items_curr   ON curriculum_items(curriculum_id);
CREATE INDEX idx_curriculum_items_teacher ON curriculum_items(teacher_id);

CREATE INDEX idx_timetables_school_sem   ON timetables(school_id, semester_id);
CREATE INDEX idx_timetables_status       ON timetables(school_id, status);

CREATE INDEX idx_te_timetable            ON timetable_entries(timetable_id);
CREATE INDEX idx_te_class                ON timetable_entries(student_class_id);
CREATE INDEX idx_te_teacher              ON timetable_entries(teacher_id);
CREATE INDEX idx_te_classroom            ON timetable_entries(classroom_id);
CREATE INDEX idx_te_day_period           ON timetable_entries(day_of_week, period_number);

CREATE INDEX idx_notifications_user      ON notifications(user_id) WHERE status != 'READ';
CREATE INDEX idx_notifications_school    ON notifications(school_id);

-- Triggers
CREATE TRIGGER upd_curricula       BEFORE UPDATE ON curricula       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER upd_timetables      BEFORE UPDATE ON timetables      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER upd_te              BEFORE UPDATE ON timetable_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at();
