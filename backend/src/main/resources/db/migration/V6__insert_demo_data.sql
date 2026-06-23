-- V6: Demo data for development

-- Demo school
INSERT INTO schools (id, name, short_name, address, phone, email, region, district, school_type, is_active)
VALUES (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '1-son Umumta''lim Maktabi',
    '1-son Maktab',
    'Toshkent shahri, Yunusobod tumani',
    '+998 71 123 45 67',
    'maktab1@edu.uz',
    'Toshkent shahri',
    'Yunusobod tumani',
    'SECONDARY',
    true
) ON CONFLICT DO NOTHING;

-- Classroom type
INSERT INTO classroom_types (id, school_id, code, name)
VALUES (
    'bbbbbbbb-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    'GENERAL',
    'Umumiy xona'
) ON CONFLICT DO NOTHING;

-- Academic year
INSERT INTO academic_years (id, school_id, name, start_date, end_date, is_current)
VALUES (
    'cccccccc-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '2024-2025',
    '2024-09-02',
    '2025-05-31',
    true
) ON CONFLICT DO NOTHING;

-- Semester 1
INSERT INTO semesters (id, academic_year_id, school_id, name, semester_number, start_date, end_date, is_current)
VALUES (
    'dddddddd-0000-0000-0000-000000000001',
    'cccccccc-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '1-semestr',
    1,
    '2024-09-02',
    '2024-12-31',
    true
) ON CONFLICT DO NOTHING;

-- Semester 2
INSERT INTO semesters (id, academic_year_id, school_id, name, semester_number, start_date, end_date, is_current)
VALUES (
    'dddddddd-0000-0000-0000-000000000002',
    'cccccccc-0000-0000-0000-000000000001',
    'aaaaaaaa-0000-0000-0000-000000000001',
    '2-semestr',
    2,
    '2025-01-13',
    '2025-05-31',
    false
) ON CONFLICT DO NOTHING;

-- Lesson periods (shift 1)
INSERT INTO lesson_periods (id, school_id, shift, period_number, start_time, end_time, is_active) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'FIRST', 1, '08:00', '08:45', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'FIRST', 2, '08:55', '09:40', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'FIRST', 3, '10:00', '10:45', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'FIRST', 4, '10:55', '11:40', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'FIRST', 5, '11:50', '12:35', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'FIRST', 6, '12:45', '13:30', true)
ON CONFLICT DO NOTHING;

-- Classrooms
INSERT INTO classrooms (id, school_id, classroom_type_id, name, capacity, floor, building, status) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '101-xona', 32, 1, 'Asosiy bino', 'ACTIVE'),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '102-xona', 30, 1, 'Asosiy bino', 'ACTIVE'),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '201-xona', 35, 2, 'Asosiy bino', 'ACTIVE'),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '202-xona', 30, 2, 'Asosiy bino', 'ACTIVE'),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Kompyuter xonasi', 25, 3, 'Asosiy bino', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- Subjects
INSERT INTO subjects (id, school_id, name, code, color, is_core) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Matematika',        'MATH',   '#6366f1', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'O''zbek tili',       'UZB',    '#3b82f6', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Ingliz tili',        'ENG',    '#10b981', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Fizika',             'PHYS',   '#f59e0b', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Kimyo',              'CHEM',   '#ef4444', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Biologiya',          'BIO',    '#8b5cf6', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Tarix',              'HIST',   '#ec4899', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Informatika',        'INFO',   '#14b8a6', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Jismoniy tarbiya',   'PE',     '#f97316', false),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Musiqa',             'MUS',    '#84cc16', false)
ON CONFLICT DO NOTHING;

-- Teachers
INSERT INTO teachers (id, school_id, full_name, short_name, phone, email, employment_type, min_weekly_load, max_weekly_load, is_active) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Karimov Jasur Aliyevich',      'J. Karimov',   '+998901234567', 'karimov@maktab.uz',   'FULL_TIME', 0, 24, true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Rahimova Malika Umarovna',     'M. Rahimova',  '+998901234568', 'rahimova@maktab.uz',  'FULL_TIME', 0, 24, true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Toshmatov Behruz Norqo''lovich','B. Toshmatov', '+998901234569', 'toshmatov@maktab.uz', 'FULL_TIME', 0, 20, true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Xasanova Dilnoza Ismoilovna',  'D. Xasanova',  '+998901234570', 'xasanova@maktab.uz',  'FULL_TIME', 0, 24, true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'Yusupov Sherzod Hamidovich',   'Sh. Yusupov',  '+998901234571', 'yusupov@maktab.uz',   'PART_TIME', 0, 12, true)
ON CONFLICT DO NOTHING;

-- Student classes (5A, 5B, 9A, 11A)
INSERT INTO student_classes (id, school_id, academic_year_id, name, grade_level, section, student_count, shift, is_active) VALUES
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '5A',  5,  'A', 28, 'FIRST', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '5B',  5,  'B', 30, 'FIRST', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '9A',  9,  'A', 32, 'FIRST', true),
    (uuid_generate_v4(), 'aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '11A', 11, 'A', 27, 'FIRST', true)
ON CONFLICT DO NOTHING;

-- Update admin user's school_id
UPDATE users SET school_id = 'aaaaaaaa-0000-0000-0000-000000000001'
WHERE email = 'admin@timetable.uz';

-- Additional demo teachers for a full 10-subject timetable
INSERT INTO teachers (id, school_id, full_name, short_name, phone, email, employment_type, min_weekly_load, max_weekly_load, is_active) VALUES
    ('eeeeeeee-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Azimov Sardor Saydjanovich',     'S. Azimov',    '+998901234572', 'azimov@maktab.uz',    'FULL_TIME', 0, 24, true),
    ('eeeeeeee-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Sultonova Lola Ravshanovna',      'L. Sultonova', '+998901234573', 'sultonova@maktab.uz', 'FULL_TIME', 0, 24, true),
    ('eeeeeeee-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'Muhammadov Sardor Shavkatovich',  'S. Muhammadov', '+998901234574', 'muhammadov@maktab.uz', 'FULL_TIME', 0, 24, true),
    ('eeeeeeee-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'O''yatova Nilufar Shukurillayevna','N. O''yatova', '+998901234575', 'oyatova@maktab.uz',   'FULL_TIME', 0, 24, true),
    ('eeeeeeee-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', 'Nahidova Dilbar Javlonovna',      'D. Nahidova',   '+998901234576', 'nahidova@maktab.uz',  'FULL_TIME', 0, 24, true)
ON CONFLICT DO NOTHING;

-- Add extra classrooms for a full-grade timetable
INSERT INTO classrooms (id, school_id, classroom_type_id, name, capacity, floor, building, status) VALUES
    ('11111111-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '103-xona', 30, 1, 'Asosiy bino', 'ACTIVE'),
    ('11111111-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '203-xona', 32, 2, 'Asosiy bino', 'ACTIVE'),
    ('11111111-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Kompyuter xonasi 2', 25, 3, 'Asosiy bino', 'ACTIVE'),
    ('11111111-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Seminar xonasi', 28, 1, 'Asosiy bino', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- Add additional student classes from grades 6 through 10
INSERT INTO student_classes (id, school_id, academic_year_id, name, grade_level, section, student_count, shift, is_active) VALUES
    ('ffffffff-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '6A',  6,  'A', 29, 'FIRST', true),
    ('ffffffff-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '7A',  7,  'A', 28, 'FIRST', true),
    ('ffffffff-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '8A',  8,  'A', 30, 'FIRST', true),
    ('ffffffff-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'cccccccc-0000-0000-0000-000000000001', '10A', 10, 'A', 31, 'FIRST', true)
ON CONFLICT DO NOTHING;

-- Ensure each subject has a dedicated teacher assignment for demo scheduling
INSERT INTO teacher_subjects (id, teacher_id, subject_id, is_primary) VALUES
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'karimov@maktab.uz'),    (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'MATH'), true),
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'rahimova@maktab.uz'), (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'UZB'), true),
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'toshmatov@maktab.uz'),(SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'ENG'), true),
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'xasanova@maktab.uz'), (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'PHYS'), true),
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'yusupov@maktab.uz'), (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'CHEM'), true),
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'azimov@maktab.uz'), (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'BIO'), true),
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'sultonova@maktab.uz'), (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'HIST'), true),
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'muhammadov@maktab.uz'),(SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'INFO'), true),
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'oyatova@maktab.uz'),  (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'PE'),   true),
    (uuid_generate_v4(), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'nahidova@maktab.uz'), (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'MUS'),  true)
ON CONFLICT DO NOTHING;

-- Create a sample Monday timetable for grades 5 through 11
INSERT INTO timetables (id, school_id, semester_id, name, status, created_by) VALUES
    ('99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'dddddddd-0000-0000-0000-000000000001', 'Demo 5-11 sinflar jadvali', 'DRAFT', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO timetable_entries (id, timetable_id, school_id, student_class_id, subject_id, teacher_id, classroom_id, day_of_week, period_number, lesson_period_id, is_pinned) VALUES
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '5A'),  (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'MATH'),  (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'karimov@maktab.uz'), (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '101-xona'), 'Monday', 1, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 1 AND shift = 'FIRST'), false),
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '5B'),  (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'UZB'),   (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'sultonova@maktab.uz'), (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '102-xona'), 'Monday', 1, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 1 AND shift = 'FIRST'), false),
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '6A'),  (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'ENG'),   (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'toshmatov@maktab.uz'), (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '201-xona'), 'Monday', 1, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 1 AND shift = 'FIRST'), false),
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '7A'),  (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'PHYS'),  (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'xasanova@maktab.uz'), (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '202-xona'), 'Monday', 1, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 1 AND shift = 'FIRST'), false),
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '8A'),  (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'CHEM'), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'yusupov@maktab.uz'), (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = 'Kompyuter xonasi'), 'Monday', 1, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 1 AND shift = 'FIRST'), false),
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '9A'),  (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'BIO'),  (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'azimov@maktab.uz'), (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = 'Kompyuter xonasi 2'), 'Monday', 1, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 1 AND shift = 'FIRST'), false),
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '10A'), (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'HIST'), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'sultonova@maktab.uz'), (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = 'Seminar xonasi'), 'Monday', 1, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 1 AND shift = 'FIRST'), false),
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '11A'), (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'INFO'), (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'muhammadov@maktab.uz'), (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = 'Seminar xonasi'), 'Monday', 2, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 2 AND shift = 'FIRST'), false),
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '5A'),  (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'PE'),   (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'oyatova@maktab.uz'),  (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = 'Seminar xonasi'), 'Monday', 3, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 3 AND shift = 'FIRST'), false),
    (uuid_generate_v4(), '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', (SELECT id FROM student_classes WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = '5B'),  (SELECT id FROM subjects WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND code = 'MUS'),  (SELECT id FROM teachers WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND email = 'nahidova@maktab.uz'), (SELECT id FROM classrooms WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND name = 'Seminar xonasi'), 'Monday', 4, (SELECT id FROM lesson_periods WHERE school_id = 'aaaaaaaa-0000-0000-0000-000000000001' AND period_number = 4 AND shift = 'FIRST'), false)
ON CONFLICT DO NOTHING;
