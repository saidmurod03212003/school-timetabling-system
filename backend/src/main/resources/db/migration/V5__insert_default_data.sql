-- V5: Default seed data

-- Default roles
INSERT INTO roles (id, name, display_name, description) VALUES
    (uuid_generate_v4(), 'SUPER_ADMIN',      'Super Administrator',  'Tizimning to''liq boshqaruvchisi'),
    (uuid_generate_v4(), 'SCHOOL_ADMIN',     'Maktab Administratori','Maktab bo''yicha boshqaruvchi'),
    (uuid_generate_v4(), 'ACADEMIC_MANAGER', 'O''quv Ishlari Mudiri','O''quv jarayonlarini boshqaruvchi'),
    (uuid_generate_v4(), 'SCHEDULER',        'Jadvalchi',            'Dars jadvalini tuzuvchi'),
    (uuid_generate_v4(), 'TEACHER',          'O''qituvchi',          'O''qituvchi foydalanuvchi'),
    (uuid_generate_v4(), 'VIEWER',           'Kuzatuvchi',           'Faqat ko''rish huquqi');

-- Default permissions
INSERT INTO permissions (code, module, action, description) VALUES
    ('school:create',          'school',     'create',   'Yangi maktab yaratish'),
    ('school:read',            'school',     'read',     'Maktab ma''lumotlarini ko''rish'),
    ('school:update',          'school',     'update',   'Maktab ma''lumotlarini tahrirlash'),
    ('school:delete',          'school',     'delete',   'Maktabni o''chirish'),
    ('teacher:create',         'teacher',    'create',   'O''qituvchi qo''shish'),
    ('teacher:read',           'teacher',    'read',     'O''qituvchini ko''rish'),
    ('teacher:update',         'teacher',    'update',   'O''qituvchini tahrirlash'),
    ('teacher:delete',         'teacher',    'delete',   'O''qituvchini o''chirish'),
    ('classroom:manage',       'classroom',  'manage',   'Xonalarni boshqarish'),
    ('subject:manage',         'subject',    'manage',   'Fanlarni boshqarish'),
    ('curriculum:manage',      'curriculum', 'manage',   'O''quv rejani boshqarish'),
    ('timetable:generate',     'timetable',  'generate', 'Dars jadvalini avtomatik yaratish'),
    ('timetable:edit',         'timetable',  'edit',     'Dars jadvalini qo''lda tahrirlash'),
    ('timetable:publish',      'timetable',  'publish',  'Dars jadvalini nashr etish'),
    ('timetable:view',         'timetable',  'view',     'Dars jadvalini ko''rish'),
    ('timetable:export',       'timetable',  'export',   'Dars jadvalini eksport qilish'),
    ('report:view',            'report',     'view',     'Hisobotlarni ko''rish'),
    ('user:manage',            'user',       'manage',   'Foydalanuvchilarni boshqarish'),
    ('audit:view',             'audit',      'view',     'Audit jurnalini ko''rish'),
    ('availability:self-edit', 'teacher',    'self-edit','O''z mavjudligini tahrirlash');

-- Assign permissions to roles
-- SUPER_ADMIN gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'SUPER_ADMIN';

-- SCHOOL_ADMIN permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'SCHOOL_ADMIN'
AND p.code IN ('school:read','school:update','teacher:create','teacher:read','teacher:update',
               'teacher:delete','classroom:manage','subject:manage','curriculum:manage',
               'timetable:generate','timetable:edit','timetable:publish','timetable:view',
               'timetable:export','report:view','user:manage','audit:view');

-- ACADEMIC_MANAGER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ACADEMIC_MANAGER'
AND p.code IN ('teacher:create','teacher:read','teacher:update','classroom:manage',
               'subject:manage','curriculum:manage','timetable:generate','timetable:edit',
               'timetable:publish','timetable:view','timetable:export','report:view');

-- SCHEDULER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'SCHEDULER'
AND p.code IN ('teacher:read','timetable:generate','timetable:edit','timetable:view',
               'timetable:export','report:view');

-- TEACHER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'TEACHER'
AND p.code IN ('teacher:read','timetable:view','timetable:export','availability:self-edit');

-- VIEWER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'VIEWER'
AND p.code IN ('timetable:view','timetable:export');

-- Default notification templates
INSERT INTO notification_templates (code, title_uz, body_uz, channel) VALUES
    ('TIMETABLE_PUBLISHED',    'Dars jadval nashr etildi',     'Hurmatli {name}, {semester} uchun yangi dars jadval nashr etildi. Iltimos, jadvalga qarang.', 'IN_APP'),
    ('TIMETABLE_PUBLISHED_EMAIL', 'Dars jadval nashr etildi',  'Hurmatli {name},\n\n{semester} uchun yangi dars jadval nashr etildi.', 'EMAIL'),
    ('TIMETABLE_PUBLISHED_TG', 'Yangi jadval',                 '📅 Hurmatli {name}!\n{semester} uchun yangi dars jadval nashr etildi.', 'TELEGRAM'),
    ('SCHEDULE_CHANGED',       'Jadval o''zgartirildi',        'Dars jadvali o''zgartirildi. Yangi jadvalga qarang.', 'IN_APP'),
    ('WELCOME',                'Smart Jadvalga xush kelibsiz', 'Hurmatli {name}, tizimda ro''yxatdan o''tdingiz!', 'EMAIL'),
    ('PASSWORD_RESET',         'Parolni tiklash',              'Parolni tiklash uchun quyidagi havolaga bosing: {link}', 'EMAIL');
