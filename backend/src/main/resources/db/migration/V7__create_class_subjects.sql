CREATE TABLE class_subjects (
    id         UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id   UUID    NOT NULL REFERENCES student_classes(id) ON DELETE CASCADE,
    subject_id UUID    NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    weekly_hours INTEGER NOT NULL DEFAULT 1,
    UNIQUE (class_id, subject_id)
);

CREATE INDEX idx_class_subjects_class   ON class_subjects(class_id);
CREATE INDEX idx_class_subjects_subject ON class_subjects(subject_id);
