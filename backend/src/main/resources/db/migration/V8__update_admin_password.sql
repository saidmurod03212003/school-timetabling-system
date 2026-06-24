-- V8: Update admin password and remove demo hint dependency
-- New password: SmartJadval@2026 (BCrypt strength 12)
UPDATE users
SET password_hash = '$2b$12$eK7DQbzAqj/isjP/MPzSpeNMLdZHOY7NWsKYN0OPcPtsesruLSPPG',
    updated_at    = NOW()
WHERE email = 'admin@timetable.uz'
  AND deleted_at IS NULL;

-- Invalidate all existing refresh tokens for admin (force re-login)
DELETE FROM refresh_tokens
WHERE user_id = (
    SELECT id FROM users WHERE email = 'admin@timetable.uz' AND deleted_at IS NULL
);
