-- V9: Comprehensive 2025-2026 academic year data
-- Adds 2025-2026 year, all grades 1-11 (A/B sections), 28 teachers,
-- 22 classrooms with specialized types, 16 subjects, full curricula,
-- class_subjects and a published sample timetable.

-- ─── Classroom types ────────────────────────────────────────────────────────
INSERT INTO classroom_types (id, school_id, code, name) VALUES
  ('bb000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'COMPUTER_LAB',  'Kompyuter xonasi'),
  ('bb000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'SCIENCE_LAB',   'Kimyo/Fizika laboratoriyasi'),
  ('bb000000-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'GYM',           'Sport zali'),
  ('bb000000-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', 'ART_ROOM',      'Tasviriy san''at xonasi'),
  ('bb000000-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001', 'MUSIC_ROOM',    'Musiqa xonasi'),
  ('bb000000-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001', 'LIBRARY',       'Kutubxona')
ON CONFLICT DO NOTHING;

-- ─── Academic year 2025-2026 ────────────────────────────────────────────────
INSERT INTO academic_years (id, school_id, name, start_date, end_date, is_current) VALUES
  ('cc000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', '2025-2026', '2025-09-01', '2026-05-30', false)
ON CONFLICT DO NOTHING;

-- ─── Semesters 2025-2026 ────────────────────────────────────────────────────
INSERT INTO semesters (id, academic_year_id, school_id, name, semester_number, start_date, end_date, is_current) VALUES
  ('dd000000-0000-0000-0000-000000000003', 'cc000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', '1-semestr', 1, '2025-09-01', '2025-12-31', false),
  ('dd000000-0000-0000-0000-000000000004', 'cc000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', '2-semestr', 2, '2026-01-12', '2026-05-30', false)
ON CONFLICT DO NOTHING;

-- ─── Extra classrooms ───────────────────────────────────────────────────────
-- General classrooms
INSERT INTO classrooms (id, school_id, classroom_type_id, name, capacity, floor, building, status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '104-xona', 32, 1, 'Asosiy bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '105-xona', 30, 1, 'Asosiy bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '204-xona', 32, 2, 'Asosiy bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '205-xona', 30, 2, 'Asosiy bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '301-xona', 35, 3, 'Asosiy bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '302-xona', 32, 3, 'Asosiy bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '303-xona', 30, 3, 'Asosiy bino', 'ACTIVE'),
-- Specialized rooms
  ('c1000000-0000-0000-0000-000000000008', 'aaaaaaaa-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000002', 'Kompyuter xonasi 1', 30, 2, 'Yangi bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000009', 'aaaaaaaa-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000002', 'Kompyuter xonasi 2', 30, 2, 'Yangi bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000010', 'aaaaaaaa-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000003', 'Kimyo laboratoriyasi', 28, 1, 'Yangi bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000003', 'Fizika laboratoriyasi', 28, 1, 'Yangi bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000012', 'aaaaaaaa-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000004', 'Sport zali', 80,  1, 'Sport bino',  'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000013', 'aaaaaaaa-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000005', 'Tasviriy san''at xonasi', 28, 2, 'Yangi bino', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000014', 'aaaaaaaa-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000006', 'Musiqa xonasi', 35, 3, 'Yangi bino', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- ─── Subjects (additional) ───────────────────────────────────────────────────
INSERT INTO subjects (id, school_id, name, code, color, is_core) VALUES
  ('s0000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Rus tili',           'RUS',  '#64748b', true),
  ('s0000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Geografiya',         'GEO',  '#0ea5e9', true),
  ('s0000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'Algebra',            'ALG',  '#7c3aed', true),
  ('s0000000-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'Geometriya',         'GEOM', '#4f46e5', true),
  ('s0000000-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', 'Ona tili',           'ONA',  '#2563eb', true),
  ('s0000000-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001', 'Adabiyot',           'ADBYT','#db2777', true),
  ('s0000000-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001', 'Texnologiya',        'TECH', '#d97706', false),
  ('s0000000-0000-0000-0000-000000000008', 'aaaaaaaa-0000-0000-0000-000000000001', 'Tasviriy san''at',   'ART',  '#059669', false),
  ('s0000000-0000-0000-0000-000000000009', 'aaaaaaaa-0000-0000-0000-000000000001', 'Dunyoqarash',        'WORLD','#0891b2', true),
  ('s0000000-0000-0000-0000-000000000010', 'aaaaaaaa-0000-0000-0000-000000000001', 'Milliy istiqlol',    'MII',  '#65a30d', true),
  ('s0000000-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 'Iqtisodiyot asoslari','IQTIS','#f97316', false)
ON CONFLICT DO NOTHING;

-- ─── Teachers (new 18, all with fixed UUIDs for referencing) ─────────────────
INSERT INTO teachers (id, school_id, full_name, short_name, phone, email, employment_type, min_weekly_load, max_weekly_load, is_active) VALUES
  ('t0000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Qodirov Mansur Xudoyberdiyevich',   'M. Qodirov',    '+998901230001', 'qodirov@maktab.uz',    'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Ibragimova Sabohat Rahimjonovna',   'S. Ibragimova', '+998901230002', 'ibragimova@maktab.uz', 'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'Ergashev Dilshod Hamzayevich',      'D. Ergashev',   '+998901230003', 'ergashev@maktab.uz',   'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', 'Nazarova Hulkar Muxtorovona',       'H. Nazarova',   '+998901230004', 'nazarova@maktab.uz',   'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000005', 'aaaaaaaa-0000-0000-0000-000000000001', 'Tursunov Bahodir Salimovich',       'B. Tursunov',   '+998901230005', 'tursunov@maktab.uz',   'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000006', 'aaaaaaaa-0000-0000-0000-000000000001', 'Xoliqova Feruza Abdullayevna',      'F. Xoliqova',   '+998901230006', 'xoliqova@maktab.uz',   'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000007', 'aaaaaaaa-0000-0000-0000-000000000001', 'Askarov Ulugbek Normatovich',       'U. Askarov',    '+998901230007', 'askarov@maktab.uz',    'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000008', 'aaaaaaaa-0000-0000-0000-000000000001', 'Mirzayeva Nargiza Pulatovna',       'N. Mirzayeva',  '+998901230008', 'mirzayeva@maktab.uz',  'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000009', 'aaaaaaaa-0000-0000-0000-000000000001', 'Razzaqov Javlon Bekmurodovich',     'J. Razzaqov',   '+998901230009', 'razzaqov@maktab.uz',   'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000010', 'aaaaaaaa-0000-0000-0000-000000000001', 'Sotvoldiyeva Maftuna Xurshidovna',  'M. Sotvoldiyeva','+998901230010','sotvoldiyeva@maktab.uz','FULL_TIME',0, 24, true),
  ('t0000000-0000-0000-0000-000000000011', 'aaaaaaaa-0000-0000-0000-000000000001', 'Holmatov Ibrohim Yusupovich',       'I. Holmatov',   '+998901230011', 'holmatov@maktab.uz',   'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000012', 'aaaaaaaa-0000-0000-0000-000000000001', 'Abdullayeva Muazzam Toxirovna',     'M. Abdullayeva','+998901230012', 'abdullayeva@maktab.uz','FULL_TIME', 0, 20, true),
  ('t0000000-0000-0000-0000-000000000013', 'aaaaaaaa-0000-0000-0000-000000000001', 'Usmonov Shuhrat Qodiraliyevich',    'Sh. Usmonov',   '+998901230013', 'usmonov@maktab.uz',    'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000014', 'aaaaaaaa-0000-0000-0000-000000000001', 'Yo''ldosheva Dilrabo Baxtiyor qizi','D. Yo''ldosheva','+998901230014','yoldosheva@maktab.uz', 'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000015', 'aaaaaaaa-0000-0000-0000-000000000001', 'Bekmurodov Sanjar Mamatisaqovich',  'S. Bekmurodov', '+998901230015', 'bekmurodov@maktab.uz', 'FULL_TIME', 0, 24, true),
  ('t0000000-0000-0000-0000-000000000016', 'aaaaaaaa-0000-0000-0000-000000000001', 'Norqo''ziyeva Sitora Axmedovna',    'S. Norqo''ziyeva','+998901230016','norqoziyeva@maktab.uz','FULL_TIME',0, 20, true),
  ('t0000000-0000-0000-0000-000000000017', 'aaaaaaaa-0000-0000-0000-000000000001', 'Maxmudov Bobur Xasanovich',         'B. Maxmudov',   '+998901230017', 'maxmudov@maktab.uz',   'PART_TIME', 0, 12, true),
  ('t0000000-0000-0000-0000-000000000018', 'aaaaaaaa-0000-0000-0000-000000000001', 'Qosimova Zulfiya Erkinovna',        'Z. Qosimova',   '+998901230018', 'qosimova@maktab.uz',   'PART_TIME', 0, 12, true)
ON CONFLICT DO NOTHING;

-- ─── Teacher → Subject assignments (new teachers) ───────────────────────────
INSERT INTO teacher_subjects (id, teacher_id, subject_id, is_primary) VALUES
-- Matematika (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='MATH'), true),
-- O'zbek tili (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000002',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='UZB'), true),
-- Ingliz tili (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000003',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='ENG'), true),
-- Fizika (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000004',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PHYS'), true),
-- Kimyo (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000005',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='CHEM'), true),
-- Biologiya (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000006',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='BIO'), true),
-- Tarix (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000007',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='HIST'), true),
-- Informatika (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000008',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='INFO'), true),
-- JT / PE (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000009',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PE'), true),
-- Musiqa (2nd teacher)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000010',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='MUS'), true),
-- Rus tili
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000011', 's0000000-0000-0000-0000-000000000001', true),
-- Geografiya
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000012', 's0000000-0000-0000-0000-000000000002', true),
-- Algebra
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000013', 's0000000-0000-0000-0000-000000000003', true),
-- Geometriya (same teacher as Algebra)
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000013', 's0000000-0000-0000-0000-000000000004', false),
-- Ona tili / Adabiyot
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000014', 's0000000-0000-0000-0000-000000000005', true),
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000014', 's0000000-0000-0000-0000-000000000006', false),
-- Texnologiya
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000015', 's0000000-0000-0000-0000-000000000007', true),
-- Tasviriy san'at
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000016', 's0000000-0000-0000-0000-000000000008', true),
-- Dunyoqarash / Milliy istiqlol
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000017', 's0000000-0000-0000-0000-000000000009', true),
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000017', 's0000000-0000-0000-0000-000000000010', false),
-- Iqtisodiyot asoslari
  (uuid_generate_v4(), 't0000000-0000-0000-0000-000000000018', 's0000000-0000-0000-0000-000000000011', true)
ON CONFLICT DO NOTHING;

-- ─── Student classes 2025-2026 — grades 1-11 with A and B sections ───────────
-- IDs: sc[grade][section] — sc1A, sc1B … sc11A, sc11B (and sc9B, sc10B)
INSERT INTO student_classes (id, school_id, academic_year_id, name, grade_level, section, student_count, shift, is_active) VALUES
  ('sc000001-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '1A',  1,  'A', 28, 'FIRST',  true),
  ('sc000001-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '1B',  1,  'B', 27, 'SECOND', true),
  ('sc000002-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '2A',  2,  'A', 30, 'FIRST',  true),
  ('sc000002-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '2B',  2,  'B', 29, 'SECOND', true),
  ('sc000003-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '3A',  3,  'A', 31, 'FIRST',  true),
  ('sc000003-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '3B',  3,  'B', 30, 'SECOND', true),
  ('sc000004-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '4A',  4,  'A', 32, 'FIRST',  true),
  ('sc000004-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '4B',  4,  'B', 30, 'SECOND', true),
  ('sc000005-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '5A',  5,  'A', 28, 'FIRST',  true),
  ('sc000005-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '5B',  5,  'B', 29, 'SECOND', true),
  ('sc000006-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '6A',  6,  'A', 30, 'FIRST',  true),
  ('sc000006-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '6B',  6,  'B', 28, 'SECOND', true),
  ('sc000007-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '7A',  7,  'A', 31, 'FIRST',  true),
  ('sc000007-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '7B',  7,  'B', 30, 'SECOND', true),
  ('sc000008-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '8A',  8,  'A', 32, 'FIRST',  true),
  ('sc000008-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '8B',  8,  'B', 30, 'SECOND', true),
  ('sc000009-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '9A',  9,  'A', 33, 'FIRST',  true),
  ('sc000009-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '9B',  9,  'B', 31, 'SECOND', true),
  ('sc000010-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '10A', 10, 'A', 30, 'FIRST',  true),
  ('sc000010-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '10B', 10, 'B', 28, 'SECOND', true),
  ('sc000011-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '11A', 11, 'A', 27, 'FIRST',  true),
  ('sc000011-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000002', '11B', 11, 'B', 25, 'SECOND', true)
ON CONFLICT DO NOTHING;

-- ─── class_subjects — weekly hours per class per subject ─────────────────────
-- Grades 1-4 (primary): Matematika 5h, O'zbek tili 5h, Rus tili 2h, Ingliz tili 2h, Ona tili 3h, Adabiyot 2h, JT 3h, Musiqa 2h, Tasviriy san'at 2h, Texnologiya 2h, Dunyoqarash 1h
-- Grades 5-9 (middle): Matematika/Algebra/Geometriya 4h each, O'zbek tili 3h, Ingliz tili 3h, Rus tili 2h, Fizika/Kimyo/Bio 3h, Tarix 2h, Geo 2h, Info 2h, JT 2h, Musiqa/Art 1h, Tech 1h
-- Grades 10-11 (senior): Algebra 4h, Geometriya 2h, Fizika 3h, Kimyo 3h, Bio 3h, Info 3h, Ingliz 3h, O'zbek 2h, Tarix 2h, Geo 2h, Iqtisodiyot 2h, JT 2h, Milliy istiqlol 1h

-- Helper: resolve subject IDs once as references
-- Grades 1-4 class_subjects
DO $$
DECLARE
  v_math  UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='MATH');
  v_uzb   UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='UZB');
  v_eng   UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='ENG');
  v_rus   UUID := 's0000000-0000-0000-0000-000000000001';
  v_ona   UUID := 's0000000-0000-0000-0000-000000000005';
  v_adb   UUID := 's0000000-0000-0000-0000-000000000006';
  v_jt    UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PE');
  v_mus   UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='MUS');
  v_art   UUID := 's0000000-0000-0000-0000-000000000008';
  v_tech  UUID := 's0000000-0000-0000-0000-000000000007';
  v_world UUID := 's0000000-0000-0000-0000-000000000009';
  v_phys  UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PHYS');
  v_chem  UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='CHEM');
  v_bio   UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='BIO');
  v_hist  UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='HIST');
  v_geo   UUID := 's0000000-0000-0000-0000-000000000002';
  v_info  UUID := (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='INFO');
  v_alg   UUID := 's0000000-0000-0000-0000-000000000003';
  v_geom  UUID := 's0000000-0000-0000-0000-000000000004';
  v_mii   UUID := 's0000000-0000-0000-0000-000000000010';
  v_iqt   UUID := 's0000000-0000-0000-0000-000000000011';

  -- Primary class IDs (grades 1-4)
  cls UUID;
  primary_classes UUID[] := ARRAY[
    'sc000001-0000-0000-0000-000000000001'::UUID, 'sc000001-0000-0000-0000-000000000002'::UUID,
    'sc000002-0000-0000-0000-000000000001'::UUID, 'sc000002-0000-0000-0000-000000000002'::UUID,
    'sc000003-0000-0000-0000-000000000001'::UUID, 'sc000003-0000-0000-0000-000000000002'::UUID,
    'sc000004-0000-0000-0000-000000000001'::UUID, 'sc000004-0000-0000-0000-000000000002'::UUID
  ];
  middle_classes UUID[] := ARRAY[
    'sc000005-0000-0000-0000-000000000001'::UUID, 'sc000005-0000-0000-0000-000000000002'::UUID,
    'sc000006-0000-0000-0000-000000000001'::UUID, 'sc000006-0000-0000-0000-000000000002'::UUID,
    'sc000007-0000-0000-0000-000000000001'::UUID, 'sc000007-0000-0000-0000-000000000002'::UUID,
    'sc000008-0000-0000-0000-000000000001'::UUID, 'sc000008-0000-0000-0000-000000000002'::UUID,
    'sc000009-0000-0000-0000-000000000001'::UUID, 'sc000009-0000-0000-0000-000000000002'::UUID
  ];
  senior_classes UUID[] := ARRAY[
    'sc000010-0000-0000-0000-000000000001'::UUID, 'sc000010-0000-0000-0000-000000000002'::UUID,
    'sc000011-0000-0000-0000-000000000001'::UUID, 'sc000011-0000-0000-0000-000000000002'::UUID
  ];
BEGIN
  -- Primary grades 1-4
  FOREACH cls IN ARRAY primary_classes LOOP
    INSERT INTO class_subjects (class_id, subject_id, weekly_hours) VALUES
      (cls, v_math,  5), (cls, v_uzb,   5), (cls, v_rus,   2),
      (cls, v_ona,   3), (cls, v_adb,   2), (cls, v_eng,   2),
      (cls, v_jt,    3), (cls, v_mus,   2), (cls, v_art,   2),
      (cls, v_tech,  2), (cls, v_world, 1)
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Middle grades 5-9
  FOREACH cls IN ARRAY middle_classes LOOP
    INSERT INTO class_subjects (class_id, subject_id, weekly_hours) VALUES
      (cls, v_alg,  4), (cls, v_geom, 2), (cls, v_uzb,  3),
      (cls, v_eng,  3), (cls, v_rus,  2), (cls, v_phys, 3),
      (cls, v_chem, 3), (cls, v_bio,  3), (cls, v_hist, 2),
      (cls, v_geo,  2), (cls, v_info, 2), (cls, v_jt,   2),
      (cls, v_mus,  1), (cls, v_art,  1), (cls, v_tech, 1),
      (cls, v_mii,  1)
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Senior grades 10-11
  FOREACH cls IN ARRAY senior_classes LOOP
    INSERT INTO class_subjects (class_id, subject_id, weekly_hours) VALUES
      (cls, v_alg,  4), (cls, v_geom, 2), (cls, v_phys, 3),
      (cls, v_chem, 3), (cls, v_bio,  3), (cls, v_info, 3),
      (cls, v_eng,  3), (cls, v_uzb,  2), (cls, v_hist, 2),
      (cls, v_geo,  2), (cls, v_iqt,  2), (cls, v_jt,   2),
      (cls, v_mii,  1)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- ─── Timetable (published, 2025-2026 semester 1) ────────────────────────────
INSERT INTO timetables (id, school_id, semester_id, name, status, published_at, created_by)
VALUES (
  'tt000000-0000-0000-0000-000000000002',
  'aaaaaaaa-0000-0000-0000-000000000001',
  'dd000000-0000-0000-0000-000000000003',
  '2025-2026 yil 1-semestr dars jadvali',
  'PUBLISHED',
  NOW(),
  NULL
) ON CONFLICT DO NOTHING;

-- ─── Timetable entries — Mon–Fri, periods 1–6 for key classes ───────────────
-- We use subqueries to resolve lesson_period_id (from V6 data, shift=FIRST)
-- 5A (sc000005-0000-0000-0000-000000000001), FIRST shift, rooms 101/201/lab/gym
INSERT INTO timetable_entries (id, timetable_id, school_id, student_class_id, subject_id, teacher_id, classroom_id, day_of_week, period_number, lesson_period_id, is_pinned) VALUES
-- 5A Monday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000003','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000005','Monday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000005','t0000000-0000-0000-0000-000000000014',
   'c1000000-0000-0000-0000-000000000005','Monday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='ENG'),
   't0000000-0000-0000-0000-000000000003',
   'c1000000-0000-0000-0000-000000000006','Monday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='BIO'),
   't0000000-0000-0000-0000-000000000006',
   'c1000000-0000-0000-0000-000000000010','Monday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PE'),
   't0000000-0000-0000-0000-000000000009',
   'c1000000-0000-0000-0000-000000000012','Monday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false),

-- 5A Tuesday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000004','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000005','Tuesday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='UZB'),
   't0000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000005','Tuesday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='HIST'),
   't0000000-0000-0000-0000-000000000007',
   'c1000000-0000-0000-0000-000000000006','Tuesday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000003','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000005','Tuesday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='INFO'),
   't0000000-0000-0000-0000-000000000008',
   'c1000000-0000-0000-0000-000000000008','Tuesday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false),

-- 5A Wednesday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000003','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000005','Wednesday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='ENG'),
   't0000000-0000-0000-0000-000000000003',
   'c1000000-0000-0000-0000-000000000006','Wednesday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PHYS'),
   't0000000-0000-0000-0000-000000000004',
   'c1000000-0000-0000-0000-000000000011','Wednesday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000001','t0000000-0000-0000-0000-000000000011',
   'c1000000-0000-0000-0000-000000000006','Wednesday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='MUS'),
   't0000000-0000-0000-0000-000000000010',
   'c1000000-0000-0000-0000-000000000014','Wednesday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false),

-- 5A Thursday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000004','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000005','Thursday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='CHEM'),
   't0000000-0000-0000-0000-000000000005',
   'c1000000-0000-0000-0000-000000000010','Thursday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='UZB'),
   't0000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000005','Thursday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000002','t0000000-0000-0000-0000-000000000012',
   'c1000000-0000-0000-0000-000000000006','Thursday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000008','t0000000-0000-0000-0000-000000000016',
   'c1000000-0000-0000-0000-000000000013','Thursday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false),

-- 5A Friday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000003','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000005','Friday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='BIO'),
   't0000000-0000-0000-0000-000000000006',
   'c1000000-0000-0000-0000-000000000010','Friday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000006','t0000000-0000-0000-0000-000000000014',
   'c1000000-0000-0000-0000-000000000005','Friday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PE'),
   't0000000-0000-0000-0000-000000000009',
   'c1000000-0000-0000-0000-000000000012','Friday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000005-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000007','t0000000-0000-0000-0000-000000000015',
   'c1000000-0000-0000-0000-000000000007','Friday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false)
ON CONFLICT DO NOTHING;

-- ─── 9A full week timetable (senior-mid grade) ───────────────────────────────
INSERT INTO timetable_entries (id, timetable_id, school_id, student_class_id, subject_id, teacher_id, classroom_id, day_of_week, period_number, lesson_period_id, is_pinned) VALUES
-- Monday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000003','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000003','Monday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PHYS'),
   't0000000-0000-0000-0000-000000000004',
   'c1000000-0000-0000-0000-000000000011','Monday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='ENG'),
   't0000000-0000-0000-0000-000000000003',
   'c1000000-0000-0000-0000-000000000004','Monday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='CHEM'),
   't0000000-0000-0000-0000-000000000005',
   'c1000000-0000-0000-0000-000000000010','Monday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='INFO'),
   't0000000-0000-0000-0000-000000000008',
   'c1000000-0000-0000-0000-000000000009','Monday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='UZB'),
   't0000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000003','Monday',6,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=6 AND shift='FIRST'),false),
-- Tuesday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000004','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000003','Tuesday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='BIO'),
   't0000000-0000-0000-0000-000000000006',
   'c1000000-0000-0000-0000-000000000010','Tuesday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='HIST'),
   't0000000-0000-0000-0000-000000000007',
   'c1000000-0000-0000-0000-000000000004','Tuesday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000002','t0000000-0000-0000-0000-000000000012',
   'c1000000-0000-0000-0000-000000000004','Tuesday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PE'),
   't0000000-0000-0000-0000-000000000009',
   'c1000000-0000-0000-0000-000000000012','Tuesday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false),
-- Wednesday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000003','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000003','Wednesday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PHYS'),
   't0000000-0000-0000-0000-000000000004',
   'c1000000-0000-0000-0000-000000000011','Wednesday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='ENG'),
   't0000000-0000-0000-0000-000000000003',
   'c1000000-0000-0000-0000-000000000004','Wednesday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='CHEM'),
   't0000000-0000-0000-0000-000000000005',
   'c1000000-0000-0000-0000-000000000010','Wednesday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000001','t0000000-0000-0000-0000-000000000011',
   'c1000000-0000-0000-0000-000000000004','Wednesday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false),
-- Thursday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000004','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000003','Thursday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='BIO'),
   't0000000-0000-0000-0000-000000000006',
   'c1000000-0000-0000-0000-000000000010','Thursday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='INFO'),
   't0000000-0000-0000-0000-000000000008',
   'c1000000-0000-0000-0000-000000000009','Thursday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='UZB'),
   't0000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000003','Thursday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000002','t0000000-0000-0000-0000-000000000012',
   'c1000000-0000-0000-0000-000000000004','Thursday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='HIST'),
   't0000000-0000-0000-0000-000000000007',
   'c1000000-0000-0000-0000-000000000004','Thursday',6,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=6 AND shift='FIRST'),false),
-- Friday
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001','s0000000-0000-0000-0000-000000000003','t0000000-0000-0000-0000-000000000013',
   'c1000000-0000-0000-0000-000000000003','Friday',1,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=1 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PHYS'),
   't0000000-0000-0000-0000-000000000004',
   'c1000000-0000-0000-0000-000000000011','Friday',2,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=2 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='CHEM'),
   't0000000-0000-0000-0000-000000000005',
   'c1000000-0000-0000-0000-000000000010','Friday',3,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=3 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='ENG'),
   't0000000-0000-0000-0000-000000000003',
   'c1000000-0000-0000-0000-000000000004','Friday',4,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=4 AND shift='FIRST'),false),
  (uuid_generate_v4(),'tt000000-0000-0000-0000-000000000002','aaaaaaaa-0000-0000-0000-000000000001',
   'sc000009-0000-0000-0000-000000000001',
   (SELECT id FROM subjects WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND code='PE'),
   't0000000-0000-0000-0000-000000000009',
   'c1000000-0000-0000-0000-000000000012','Friday',5,
   (SELECT id FROM lesson_periods WHERE school_id='aaaaaaaa-0000-0000-0000-000000000001' AND period_number=5 AND shift='FIRST'),false)
ON CONFLICT DO NOTHING;

-- ─── Quality score for the new timetable ────────────────────────────────────
INSERT INTO timetable_quality_scores (timetable_id, overall_score, hard_score, soft_score, hard_constraint_violations, soft_constraint_penalties)
VALUES ('tt000000-0000-0000-0000-000000000002', 92.50, 0, -18, 0, 18)
ON CONFLICT DO NOTHING;
