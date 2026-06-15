-- V2: School management tables

CREATE TABLE schools (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    short_name  VARCHAR(50),
    logo_url    VARCHAR(500),
    address     TEXT,
    phone       VARCHAR(20),
    email       VARCHAR(255),
    region      VARCHAR(100),
    district    VARCHAR(100),
    school_type VARCHAR(50)  NOT NULL DEFAULT 'SECONDARY',
    is_active   BOOLEAN      NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE branches (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name      VARCHAR(255) NOT NULL,
    address   TEXT,
    phone     VARCHAR(20),
    is_active BOOLEAN     NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE academic_years (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id  UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name       VARCHAR(50)  NOT NULL,
    start_date DATE        NOT NULL,
    end_date   DATE        NOT NULL,
    is_current BOOLEAN     NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (school_id, name),
    CHECK (start_date < end_date)
);

CREATE TABLE semesters (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID        NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    school_id        UUID        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name             VARCHAR(50)  NOT NULL,
    semester_number  SMALLINT    NOT NULL CHECK (semester_number IN (1, 2)),
    start_date       DATE        NOT NULL,
    end_date         DATE        NOT NULL,
    is_current       BOOLEAN     NOT NULL DEFAULT false,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (academic_year_id, semester_number),
    CHECK (start_date < end_date)
);

CREATE TABLE school_settings (
    id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id                   UUID        NOT NULL UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
    working_days                TEXT[]      NOT NULL DEFAULT ARRAY['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY'],
    shifts_count                SMALLINT    NOT NULL DEFAULT 1 CHECK (shifts_count IN (1, 2)),
    max_daily_lessons_primary   SMALLINT    NOT NULL DEFAULT 5,
    max_daily_lessons_middle    SMALLINT    NOT NULL DEFAULT 6,
    max_daily_lessons_senior    SMALLINT    NOT NULL DEFAULT 7,
    telegram_chat_id            VARCHAR(100),
    telegram_bot_token          VARCHAR(255),
    smtp_host                   VARCHAR(255),
    smtp_port                   INT,
    smtp_username               VARCHAR(255),
    smtp_password_encrypted     VARCHAR(500),
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_schools_active        ON schools(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_branches_school       ON branches(school_id);
CREATE INDEX idx_academic_years_school ON academic_years(school_id);
CREATE INDEX idx_semesters_year        ON semesters(academic_year_id);
CREATE INDEX idx_semesters_school      ON semesters(school_id);
CREATE INDEX idx_semesters_current     ON semesters(school_id, is_current) WHERE is_current = true;

-- Trigger: only one current academic year per school
CREATE OR REPLACE FUNCTION ensure_single_current_year()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_current = true THEN
        UPDATE academic_years SET is_current = false
        WHERE school_id = NEW.school_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER single_current_year
BEFORE INSERT OR UPDATE ON academic_years
FOR EACH ROW WHEN (NEW.is_current = true)
EXECUTE FUNCTION ensure_single_current_year();

-- Trigger: updated_at auto update
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER upd_schools         BEFORE UPDATE ON schools         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER upd_branches        BEFORE UPDATE ON branches        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER upd_academic_years  BEFORE UPDATE ON academic_years  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER upd_semesters       BEFORE UPDATE ON semesters       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
