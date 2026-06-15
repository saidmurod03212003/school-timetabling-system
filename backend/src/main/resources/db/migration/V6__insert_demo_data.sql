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
