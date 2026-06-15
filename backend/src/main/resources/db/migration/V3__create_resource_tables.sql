-- V3: Resource tables (classrooms, student classes, subjects, teachers, periods)

CREATE TABLE classroom_types (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    code      VARCHAR(50)  NOT NULL,
    name      VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE classrooms (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id         UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    branch_id         UUID        REFERENCES branches(id),
    classroom_type_id UUID        NOT NULL REFERENCES classroom_types(id),
    name              VARCHAR(50)  NOT NULL,
    capacity          SMALLINT    NOT NULL DEFAULT 30 CHECK (capacity > 0),
    floor             SMALLINT,
    building          VARCHAR(50),
    status            VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    description       TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMPTZ,
    UNIQUE (school_id, name)
);

CREATE TABLE student_classes (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id        UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    branch_id        UUID        REFERENCES branches(id),
    academic_year_id UUID        NOT NULL REFERENCES academic_years(id),
    name             VARCHAR(20)  NOT NULL,
    grade_level      SMALLINT    NOT NULL CHECK (grade_level BETWEEN 1 AND 11),
    section          VARCHAR(5)   NOT NULL,
    student_count    SMALLINT    NOT NULL DEFAULT 0 CHECK (student_count >= 0),
    shift            VARCHAR(10)  NOT NULL DEFAULT 'FIRST',
    home_room_id     UUID        REFERENCES classrooms(id),
    is_active        BOOLEAN     NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (school_id, academic_year_id, name)
);

CREATE TABLE subjects (
    id                         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id                  UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name                       VARCHAR(100) NOT NULL,
    code                       VARCHAR(20)  NOT NULL,
    color                      VARCHAR(7),
    is_core                    BOOLEAN     NOT NULL DEFAULT true,
    requires_classroom_type_id UUID        REFERENCES classroom_types(id),
    created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at                 TIMESTAMPTZ,
    UNIQUE (school_id, code)
);

CREATE TABLE teachers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id       UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id         UUID        REFERENCES users(id),
    full_name       VARCHAR(255) NOT NULL,
    short_name      VARCHAR(50),
    phone           VARCHAR(20),
    email           VARCHAR(255),
    photo_url       VARCHAR(500),
    employment_type VARCHAR(20)  NOT NULL DEFAULT 'FULL_TIME',
    min_weekly_load SMALLINT    NOT NULL DEFAULT 0  CHECK (min_weekly_load >= 0),
    max_weekly_load SMALLINT    NOT NULL DEFAULT 24 CHECK (max_weekly_load > 0),
    is_active       BOOLEAN     NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CHECK (max_weekly_load >= min_weekly_load)
);

CREATE TABLE teacher_subjects (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID    NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id UUID    NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    UNIQUE (teacher_id, subject_id)
);

CREATE TABLE teacher_availability (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id        UUID        NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    day_of_week       VARCHAR(10)  NOT NULL,
    period_from       SMALLINT    NOT NULL CHECK (period_from >= 1),
    period_to         SMALLINT    NOT NULL,
    availability_type VARCHAR(20)  NOT NULL DEFAULT 'AVAILABLE',
    UNIQUE (teacher_id, day_of_week, period_from, period_to),
    CHECK (period_to >= period_from)
);

CREATE TABLE teacher_unavailability (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID        NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    date       DATE        NOT NULL,
    reason     VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lesson_periods (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id     UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    shift         VARCHAR(10)  NOT NULL DEFAULT 'FIRST',
    period_number SMALLINT    NOT NULL CHECK (period_number >= 1),
    start_time    TIME        NOT NULL,
    end_time      TIME        NOT NULL,
    is_active     BOOLEAN     NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (school_id, shift, period_number),
    CHECK (end_time > start_time)
);

-- Indexes
CREATE INDEX idx_classrooms_school       ON classrooms(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_classrooms_type         ON classrooms(classroom_type_id);
CREATE INDEX idx_student_classes_school  ON student_classes(school_id, academic_year_id);
CREATE INDEX idx_subjects_school         ON subjects(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_teachers_school         ON teachers(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_teacher_subjects_teacher ON teacher_subjects(teacher_id);
CREATE INDEX idx_teacher_subjects_subject ON teacher_subjects(subject_id);
CREATE INDEX idx_teacher_avail_teacher   ON teacher_availability(teacher_id);
CREATE INDEX idx_lesson_periods_school   ON lesson_periods(school_id, shift);

-- Triggers
CREATE TRIGGER upd_classrooms      BEFORE UPDATE ON classrooms      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER upd_student_classes BEFORE UPDATE ON student_classes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER upd_subjects        BEFORE UPDATE ON subjects        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER upd_teachers        BEFORE UPDATE ON teachers        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER upd_lesson_periods  BEFORE UPDATE ON lesson_periods  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
