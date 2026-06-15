# API Specification
## REST API — Spring Boot 3 / Java 21
### Base URL: `/api/v1`

---

## Response Envelope

```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 0, "size": 20, "total": 150, "totalPages": 8 },
  "timestamp": "2024-09-01T08:00:00Z"
}

// Error
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "O'qituvchi topilmadi",
    "details": [ { "field": "teacherId", "message": "Noto'g'ri identifikator" } ]
  },
  "timestamp": "2024-09-01T08:00:00Z"
}
```

---

## 1. Authentication API

### POST `/api/v1/auth/login`
```json
// Request
{
  "email": "admin@school.uz",
  "password": "SecurePass123!"
}

// Response 200
{
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "admin@school.uz",
      "fullName": "Abdullayev Akbar",
      "roles": ["SCHOOL_ADMIN"],
      "schoolId": "uuid",
      "permissions": ["timetable:generate", "teacher:manage"]
    }
  }
}

// Error 401
{ "error": { "code": "INVALID_CREDENTIALS", "message": "Email yoki parol noto'g'ri" } }
// Error 423
{ "error": { "code": "ACCOUNT_LOCKED", "message": "Hisob vaqtincha bloklangan" } }
```

### POST `/api/v1/auth/refresh`
```json
// Request
{ "refreshToken": "eyJhbGci..." }
// Response 200 — returns new access + refresh tokens
```

### POST `/api/v1/auth/logout`
```json
// Request (authenticated)
{ "refreshToken": "eyJhbGci..." }
// Response 204 No Content
```

### POST `/api/v1/auth/forgot-password`
```json
// Request
{ "email": "teacher@school.uz" }
// Response 200 — sends OTP to email
```

### POST `/api/v1/auth/reset-password`
```json
// Request
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
// Response 200
```

### GET `/api/v1/auth/me`
```json
// Response 200 — current user profile
```

### GET `/api/v1/auth/sessions`
```json
// Response 200 — list of active sessions with device info
```

### DELETE `/api/v1/auth/sessions/{sessionId}`
```json
// Response 204 — revoke specific session
```

---

## 2. Schools API

### GET `/api/v1/schools`
```
Query params:
  ?page=0&size=20&sort=name:asc&search=maktab
```
```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "name": "1-sonli Umumta'lim Maktabi",
      "shortName": "1-MAKTAB",
      "address": "Toshkent sh., Yunusobod tumani",
      "schoolType": "SECONDARY",
      "isActive": true,
      "branchCount": 2
    }
  ],
  "meta": { "total": 15, "page": 0, "size": 20 }
}
```

### POST `/api/v1/schools`
```json
// Request
{
  "name": "1-sonli Umumta'lim Maktabi",
  "shortName": "1-MAKTAB",
  "address": "Toshkent sh., Yunusobod tumani",
  "phone": "+998712345678",
  "email": "school1@edu.uz",
  "region": "Toshkent",
  "district": "Yunusobod",
  "schoolType": "SECONDARY"
}
// Response 201
```

### GET `/api/v1/schools/{id}`
### PUT `/api/v1/schools/{id}`
### DELETE `/api/v1/schools/{id}`  ← Soft delete

### GET `/api/v1/schools/{id}/settings`
### PUT `/api/v1/schools/{id}/settings`
```json
// Request
{
  "workingDays": ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],
  "shiftsCount": 1,
  "maxDailyLessonsPrimary": 5,
  "maxDailyLessonsMiddle": 6,
  "maxDailyLessonsSenior": 7
}
```

---

## 3. Branches API

### GET `/api/v1/schools/{schoolId}/branches`
### POST `/api/v1/schools/{schoolId}/branches`
```json
{
  "name": "Asosiy bino",
  "address": "Ko'cha 1-uy"
}
```
### GET `/api/v1/schools/{schoolId}/branches/{id}`
### PUT `/api/v1/schools/{schoolId}/branches/{id}`
### DELETE `/api/v1/schools/{schoolId}/branches/{id}`

---

## 4. Academic Years API

### GET `/api/v1/schools/{schoolId}/academic-years`
### POST `/api/v1/schools/{schoolId}/academic-years`
```json
{
  "name": "2024-2025",
  "startDate": "2024-09-02",
  "endDate": "2025-06-25",
  "isCurrent": true
}
```
### GET `/api/v1/schools/{schoolId}/academic-years/{id}`
### PUT `/api/v1/schools/{schoolId}/academic-years/{id}`
### PATCH `/api/v1/schools/{schoolId}/academic-years/{id}/set-current`

---

## 5. Semesters API

### GET `/api/v1/schools/{schoolId}/academic-years/{yearId}/semesters`
### POST `/api/v1/schools/{schoolId}/academic-years/{yearId}/semesters`
```json
{
  "name": "1-semestr",
  "semesterNumber": 1,
  "startDate": "2024-09-02",
  "endDate": "2025-01-25",
  "isCurrent": true
}
```

---

## 6. Classrooms API

### GET `/api/v1/schools/{schoolId}/classrooms`
```
?type=COMPUTER_LAB&status=ACTIVE&branchId=uuid
```
```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "name": "101",
      "classroomType": { "code": "STANDARD", "name": "Oddiy xona" },
      "capacity": 35,
      "floor": 1,
      "status": "ACTIVE",
      "branchName": "Asosiy bino"
    }
  ]
}
```

### POST `/api/v1/schools/{schoolId}/classrooms`
```json
{
  "branchId": "uuid",
  "classroomTypeId": "uuid",
  "name": "Kompyuter xona 1",
  "capacity": 30,
  "floor": 2
}
```

### GET `/api/v1/schools/{schoolId}/classrooms/{id}`
### PUT `/api/v1/schools/{schoolId}/classrooms/{id}`
### DELETE `/api/v1/schools/{schoolId}/classrooms/{id}`

### GET `/api/v1/schools/{schoolId}/classroom-types`

---

## 7. Student Classes API

### GET `/api/v1/schools/{schoolId}/classes`
```
?academicYearId=uuid&gradeLevel=5&shift=FIRST
```
```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "name": "5-A",
      "gradeLevel": 5,
      "section": "A",
      "studentCount": 32,
      "shift": "FIRST",
      "homeRoom": { "id": "uuid", "name": "501" }
    }
  ]
}
```

### POST `/api/v1/schools/{schoolId}/classes`
```json
{
  "academicYearId": "uuid",
  "branchId": "uuid",
  "gradeLevel": 5,
  "section": "A",
  "studentCount": 32,
  "shift": "FIRST",
  "homeRoomId": "uuid"
}
```

---

## 8. Subjects API

### GET `/api/v1/schools/{schoolId}/subjects`
### POST `/api/v1/schools/{schoolId}/subjects`
```json
{
  "name": "Matematika",
  "code": "MATH",
  "color": "#4F46E5",
  "isCore": true,
  "requiresClassroomTypeId": null
}
```
### GET `/api/v1/schools/{schoolId}/subjects/{id}`
### PUT `/api/v1/schools/{schoolId}/subjects/{id}`
### DELETE `/api/v1/schools/{schoolId}/subjects/{id}`

---

## 9. Teachers API

### GET `/api/v1/schools/{schoolId}/teachers`
```
?subjectId=uuid&isActive=true&search=Aliyev
```
```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "fullName": "Aliyev Akbar Abdurahmonovich",
      "shortName": "Aliyev A.A.",
      "phone": "+998901234567",
      "email": "aliyev@school.uz",
      "subjects": [
        { "id": "uuid", "name": "Matematika", "isPrimary": true },
        { "id": "uuid", "name": "Informatika", "isPrimary": false }
      ],
      "minWeeklyLoad": 12,
      "maxWeeklyLoad": 24,
      "currentWeeklyLoad": 18,
      "isActive": true
    }
  ]
}
```

### POST `/api/v1/schools/{schoolId}/teachers`
```json
{
  "fullName": "Aliyev Akbar Abdurahmonovich",
  "shortName": "Aliyev A.A.",
  "phone": "+998901234567",
  "email": "aliyev@school.uz",
  "minWeeklyLoad": 12,
  "maxWeeklyLoad": 24,
  "subjectIds": ["uuid1", "uuid2"],
  "primarySubjectId": "uuid1"
}
```

### GET `/api/v1/schools/{schoolId}/teachers/{id}`
### PUT `/api/v1/schools/{schoolId}/teachers/{id}`
### DELETE `/api/v1/schools/{schoolId}/teachers/{id}`

### PUT `/api/v1/schools/{schoolId}/teachers/{id}/subjects`
```json
{
  "subjectIds": ["uuid1", "uuid2"],
  "primarySubjectId": "uuid1"
}
```

### GET `/api/v1/schools/{schoolId}/teachers/{id}/availability`
### PUT `/api/v1/schools/{schoolId}/teachers/{id}/availability`
```json
{
  "availability": [
    {
      "dayOfWeek": "MONDAY",
      "periodFrom": 1,
      "periodTo": 6,
      "availabilityType": "AVAILABLE"
    },
    {
      "dayOfWeek": "WEDNESDAY",
      "periodFrom": 5,
      "periodTo": 7,
      "availabilityType": "UNAVAILABLE"
    }
  ]
}
```

### GET `/api/v1/schools/{schoolId}/teachers/{id}/workload`
```json
// Response
{
  "data": {
    "teacherId": "uuid",
    "teacherName": "Aliyev A.A.",
    "maxWeeklyLoad": 24,
    "currentWeeklyLoad": 18,
    "utilizationPercent": 75,
    "byDay": [
      { "day": "MONDAY", "lessonCount": 4 },
      { "day": "TUESDAY", "lessonCount": 3 }
    ]
  }
}
```

---

## 10. Lesson Periods API

### GET `/api/v1/schools/{schoolId}/lesson-periods`
```json
// Response
{
  "data": [
    { "id": "uuid", "shift": "FIRST", "periodNumber": 1, "startTime": "08:00", "endTime": "08:45" },
    { "id": "uuid", "shift": "FIRST", "periodNumber": 2, "startTime": "08:55", "endTime": "09:40" },
    { "id": "uuid", "shift": "FIRST", "periodNumber": 3, "startTime": "09:50", "endTime": "10:35" },
    { "id": "uuid", "shift": "FIRST", "periodNumber": 4, "startTime": "10:55", "endTime": "11:40" },
    { "id": "uuid", "shift": "FIRST", "periodNumber": 5, "startTime": "11:50", "endTime": "12:35" },
    { "id": "uuid", "shift": "FIRST", "periodNumber": 6, "startTime": "12:45", "endTime": "13:30" },
    { "id": "uuid", "shift": "FIRST", "periodNumber": 7, "startTime": "13:40", "endTime": "14:25" }
  ]
}
```

### POST `/api/v1/schools/{schoolId}/lesson-periods`
### PUT `/api/v1/schools/{schoolId}/lesson-periods/{id}`
### DELETE `/api/v1/schools/{schoolId}/lesson-periods/{id}`

---

## 11. Curriculum API

### GET `/api/v1/schools/{schoolId}/curricula`
```
?semesterId=uuid&classId=uuid
```

### POST `/api/v1/schools/{schoolId}/curricula`
```json
{
  "semesterId": "uuid",
  "studentClassId": "uuid",
  "items": [
    { "subjectId": "uuid", "teacherId": "uuid", "weeklyHours": 5 },
    { "subjectId": "uuid", "teacherId": "uuid", "weeklyHours": 3 },
    { "subjectId": "uuid", "teacherId": "uuid", "weeklyHours": 2 }
  ]
}
```

### GET `/api/v1/schools/{schoolId}/curricula/{id}`
### PUT `/api/v1/schools/{schoolId}/curricula/{id}`
### POST `/api/v1/schools/{schoolId}/curricula/{id}/items`
### PUT `/api/v1/schools/{schoolId}/curricula/{id}/items/{itemId}`
### DELETE `/api/v1/schools/{schoolId}/curricula/{id}/items/{itemId}`

---

## 12. Timetable API

### GET `/api/v1/schools/{schoolId}/timetables`
```
?semesterId=uuid&status=PUBLISHED
```

### POST `/api/v1/schools/{schoolId}/timetables/generate`
```json
// Request — triggers solver
{
  "semesterId": "uuid",
  "name": "2024-2025 1-semestr asosiy jadval",
  "solverDurationSeconds": 300,
  "includedClassIds": [],    // empty = all classes
  "optimizationLevel": "BALANCED"  // FAST, BALANCED, THOROUGH
}
// Response 202 Accepted
{
  "data": {
    "timetableId": "uuid",
    "status": "GENERATING",
    "estimatedCompletionAt": "2024-09-01T08:05:00Z"
  }
}
```

### GET `/api/v1/schools/{schoolId}/timetables/{id}`
```json
// Response
{
  "data": {
    "id": "uuid",
    "name": "2024-2025 1-semestr asosiy jadval",
    "status": "GENERATED",
    "solverDurationSeconds": 287,
    "qualityScore": {
      "overallScore": 87.5,
      "hardScore": 0,
      "softScore": -125,
      "hardConstraintViolations": 0
    },
    "generationCompletedAt": "2024-09-01T08:04:47Z"
  }
}
```

### GET `/api/v1/schools/{schoolId}/timetables/{id}/status`
```json
// Polling endpoint during generation
{
  "data": {
    "status": "GENERATING",
    "progressPercent": 65,
    "currentScore": -450,
    "bestScore": -200,
    "elapsedSeconds": 187
  }
}
```

### GET `/api/v1/schools/{schoolId}/timetables/{id}/entries`
```
?classId=uuid&teacherId=uuid&classroomId=uuid&dayOfWeek=MONDAY
```
```json
// Response
{
  "data": [
    {
      "id": "uuid",
      "dayOfWeek": "MONDAY",
      "periodNumber": 1,
      "startTime": "08:00",
      "endTime": "08:45",
      "subject": { "id": "uuid", "name": "Matematika", "color": "#4F46E5" },
      "teacher": { "id": "uuid", "name": "Aliyev A.A." },
      "classroom": { "id": "uuid", "name": "301" },
      "studentClass": { "id": "uuid", "name": "5-A" },
      "isPinned": false
    }
  ]
}
```

### POST `/api/v1/schools/{schoolId}/timetables/{id}/publish`
```json
// Response 200 — publishes timetable, notifies teachers
```

### POST `/api/v1/schools/{schoolId}/timetables/{id}/entries/move`
```json
// Manual move (editor)
{
  "entryId": "uuid",
  "newDayOfWeek": "TUESDAY",
  "newPeriodNumber": 3,
  "newClassroomId": "uuid"
}
// Response 200 with updated entry + any new violations
```

### POST `/api/v1/schools/{schoolId}/timetables/{id}/entries/swap`
```json
{
  "entryId1": "uuid",
  "entryId2": "uuid"
}
```

### PATCH `/api/v1/schools/{schoolId}/timetables/{id}/entries/{entryId}/pin`
```json
{ "isPinned": true }
```

### GET `/api/v1/schools/{schoolId}/timetables/{id}/violations`
```json
// Response
{
  "data": [
    {
      "constraintType": "HARD",
      "constraintName": "teacherConflict",
      "description": "Aliyev A.A. dushanba 3-darsda 2 ta sinfda bir vaqtda rejalashtirilgan",
      "impactScore": -1000,
      "affectedEntries": ["uuid1", "uuid2"]
    }
  ]
}
```

### GET `/api/v1/schools/{schoolId}/timetables/{id}/by-class/{classId}`
### GET `/api/v1/schools/{schoolId}/timetables/{id}/by-teacher/{teacherId}`
### GET `/api/v1/schools/{schoolId}/timetables/{id}/by-classroom/{classroomId}`

---

## 13. Reports API

### GET `/api/v1/schools/{schoolId}/reports/teacher-workload`
```
?timetableId=uuid
```

### GET `/api/v1/schools/{schoolId}/reports/classroom-utilization`
```
?timetableId=uuid
```

### GET `/api/v1/schools/{schoolId}/reports/subject-distribution`
```
?timetableId=uuid&classId=uuid
```

### GET `/api/v1/schools/{schoolId}/reports/dashboard`

---

## 14. Export API

### GET `/api/v1/schools/{schoolId}/timetables/{id}/export`
```
?format=PDF&type=BY_CLASS&classId=uuid
?format=EXCEL&type=FULL_SCHOOL
?format=CSV&type=BY_TEACHER&teacherId=uuid

format: PDF | EXCEL | CSV
type:   BY_CLASS | BY_TEACHER | BY_CLASSROOM | FULL_SCHOOL
```
```
Response: file download (Content-Disposition: attachment)
```

---

## 15. Notifications API

### GET `/api/v1/notifications`
```
?status=UNREAD&page=0&size=20
```

### PATCH `/api/v1/notifications/{id}/read`
### PATCH `/api/v1/notifications/read-all`
### DELETE `/api/v1/notifications/{id}`

### GET `/api/v1/notifications/settings`
### PUT `/api/v1/notifications/settings`
```json
{
  "emailEnabled": true,
  "telegramEnabled": true,
  "telegramChatId": "123456789",
  "inAppEnabled": true
}
```

---

## 16. Users API

### GET `/api/v1/users`
### POST `/api/v1/users`
```json
{
  "email": "user@school.uz",
  "fullName": "To'liq Ism",
  "roleIds": ["uuid"],
  "schoolId": "uuid"
}
```
### GET `/api/v1/users/{id}`
### PUT `/api/v1/users/{id}`
### PATCH `/api/v1/users/{id}/activate`
### PATCH `/api/v1/users/{id}/deactivate`
### GET `/api/v1/roles`
### GET `/api/v1/permissions`

---

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email yoki parol noto'g'ri |
| `TOKEN_EXPIRED` | 401 | Token muddati tugagan |
| `TOKEN_INVALID` | 401 | Token noto'g'ri |
| `ACCOUNT_LOCKED` | 423 | Hisob bloklangan |
| `FORBIDDEN` | 403 | Ruxsat yo'q |
| `RESOURCE_NOT_FOUND` | 404 | Resurs topilmadi |
| `DUPLICATE_RESOURCE` | 409 | Bunday ma'lumot allaqachon mavjud |
| `VALIDATION_ERROR` | 422 | Validatsiya xatosi |
| `TIMETABLE_CONFLICT` | 422 | Jadval ziddiyati |
| `SOLVER_BUSY` | 429 | Solver band, keyinroq urinib ko'ring |
| `RATE_LIMIT_EXCEEDED` | 429 | So'rovlar chegarasi oshib ketdi |
| `INTERNAL_ERROR` | 500 | Ichki xato |
