# Smart School Timetable Management and Optimization System
## Software Requirements Specification (SRS)
### Version 1.0 | Production Release

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Stakeholders and User Roles](#3-stakeholders-and-user-roles)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Stories](#6-user-stories)
7. [Business Rules](#7-business-rules)
8. [System Constraints](#8-system-constraints)
9. [Glossary](#9-glossary)

---

## 1. Introduction

### 1.1 Purpose
This SRS describes the functional and non-functional requirements for the **Smart School Timetable Management and Optimization System** — an enterprise-grade platform designed to automate, optimize, and manage academic timetabling for educational institutions in Uzbekistan.

### 1.2 Project Scope
The system covers:
- Multi-tenant school management
- Automated timetable generation using Timefold Solver (AI-based constraint satisfaction)
- Manual editing with conflict detection
- Teacher, classroom, and subject management
- Role-based access control
- Analytics, exports, and notifications

### 1.3 Intended Audience
- School Administrators
- Academic Managers
- Schedulers
- Teachers
- IT Development Team
- System Integrators

### 1.4 System Context
The platform operates as a web application accessed via browser. It is deployed on a VPS with Nginx reverse proxy. It integrates with:
- PostgreSQL (primary data store)
- Redis (caching and session management)
- Timefold Solver (constraint optimization engine)
- Telegram Bot API (notifications)
- SMTP (email notifications)

---

## 2. System Overview

### 2.1 High-Level Description
The system enables school administrators to define all academic resources (teachers, classrooms, subjects, classes, curriculum), then invoke an optimization engine that generates conflict-free, quality-maximized timetables. Schedulers can then manually refine the timetable via drag-and-drop.

### 2.2 System Architecture Summary
```
┌─────────────────────────────────────────┐
│         Next.js 15 Frontend             │
│     (React 19 + TypeScript + Tailwind)  │
└──────────────────┬──────────────────────┘
                   │ HTTPS / REST API
┌──────────────────▼──────────────────────┐
│         Nginx Reverse Proxy             │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      Spring Boot 3 / Java 21 Backend    │
│   (Clean Architecture + DDD + JWT)      │
├─────────────────┬────────────────────────┤
│  Timefold       │  Redis Cache           │
│  Solver Engine  │  (Sessions/Tokens)     │
└────────┬────────┴────────────────────────┘
         │
┌────────▼────────┐
│   PostgreSQL 16 │
└─────────────────┘
```

### 2.3 Key System Goals
| Goal | Description |
|------|-------------|
| Automation | Generate optimal timetables without manual scheduling |
| Quality | Score timetables using hard + soft constraint satisfaction |
| Scalability | Support 1000+ teachers, 500+ classrooms, 200+ classes |
| Usability | Full Uzbek UI, drag-and-drop editing |
| Reliability | 99.9% uptime, data integrity, audit trails |

---

## 3. Stakeholders and User Roles

### 3.1 Role Hierarchy

```
Super Admin
  └── School Admin
        └── Academic Manager
              └── Scheduler
                    ├── Teacher
                    └── Viewer
```

### 3.2 Role Definitions and Permissions

#### Super Admin
- Full system access across all schools
- Manage all schools and branches
- Manage system-wide settings
- Access all reports and analytics
- Manage system users and roles
- View audit logs
- Configure system parameters

#### School Admin
- Manage one school and its branches
- Create/manage academic years and semesters
- Manage school users
- Configure school settings
- Approve published timetables
- View all school reports

#### Academic Manager
- Manage curriculum (subjects, weekly hours)
- Manage teachers and their assignments
- Manage classrooms
- Manage classes/student groups
- Generate and publish timetables
- View analytics

#### Scheduler
- Generate timetables
- Edit timetables manually (drag-and-drop)
- Resolve conflicts
- Export timetables
- View reports

#### Teacher
- View own timetable
- Set availability/unavailability
- View classroom and subject assignments
- Receive notifications

#### Viewer
- View-only access to published timetables
- Export timetables (read-only)

---

## 4. Functional Requirements

### 4.1 Authentication Module

| ID | Requirement |
|----|-------------|
| AUTH-001 | System shall authenticate users via email/password with bcrypt hashing |
| AUTH-002 | System shall issue JWT access tokens (15 min expiry) and refresh tokens (7 days) |
| AUTH-003 | System shall invalidate refresh tokens on logout |
| AUTH-004 | System shall support password reset via email (OTP + token) |
| AUTH-005 | System shall lock accounts after 5 failed login attempts |
| AUTH-006 | System shall enforce role-based access control on all endpoints |
| AUTH-007 | System shall log all authentication events in audit log |
| AUTH-008 | System shall support session management (view/revoke active sessions) |

### 4.2 School Management Module

| ID | Requirement |
|----|-------------|
| SCH-001 | System shall support multi-tenant school management |
| SCH-002 | System shall manage school branches |
| SCH-003 | System shall manage academic years with start/end dates |
| SCH-004 | System shall manage semesters within academic years |
| SCH-005 | System shall allow per-school configuration (working days, shift times) |
| SCH-006 | System shall support first and second shift scheduling |

### 4.3 Classroom Management Module

| ID | Requirement |
|----|-------------|
| CLR-001 | System shall manage classrooms with type: Standard, Computer Lab, Physics Lab, Chemistry Lab, Biology Lab, Language Lab, Sports Hall |
| CLR-002 | System shall store classroom capacity |
| CLR-003 | System shall track classroom availability status (active/maintenance/unavailable) |
| CLR-004 | System shall link classrooms to branches |
| CLR-005 | System shall support classroom scheduling blackout periods |

### 4.4 Class Management Module

| ID | Requirement |
|----|-------------|
| CLS-001 | System shall manage student groups (e.g., 1-A, 5-B, 11-A) |
| CLS-002 | System shall store grade level (1-11) and section (A, B, C...) |
| CLS-003 | System shall store student count per class |
| CLS-004 | System shall assign shift to each class (first/second) |
| CLS-005 | System shall link classes to academic years |

### 4.5 Subject Management Module

| ID | Requirement |
|----|-------------|
| SUB-001 | System shall manage subjects with name and code |
| SUB-002 | System shall store default weekly lesson hours per subject |
| SUB-003 | System shall specify required classroom type per subject |
| SUB-004 | System shall support subjects: Mathematics, Physics, Chemistry, Biology, Informatics, History, Geography, English, Uzbek Language, Physical Education, and custom subjects |

### 4.6 Teacher Management Module

| ID | Requirement |
|----|-------------|
| TCH-001 | System shall store teacher profile: full name, phone, email, photo |
| TCH-002 | System shall assign multiple subjects to each teacher |
| TCH-003 | System shall configure teacher workload (min/max weekly hours) |
| TCH-004 | System shall manage teacher availability by day and time slot |
| TCH-005 | System shall manage teacher unavailability (sick leave, vacation) |
| TCH-006 | System shall display teacher workload dashboard |
| TCH-007 | System shall prevent over-scheduling beyond maximum load |

### 4.7 Lesson Period Management Module

| ID | Requirement |
|----|-------------|
| PER-001 | System shall allow administrators to configure lesson periods per school |
| PER-002 | Default periods: 7 lessons per day (08:00-14:25) with 5-10 min breaks |
| PER-003 | System shall support different period schedules for different shifts |
| PER-004 | System shall support different period schedules for different days |

### 4.8 Curriculum Management Module

| ID | Requirement |
|----|-------------|
| CUR-001 | System shall allow defining weekly lesson requirements per class per subject |
| CUR-002 | System shall validate total weekly hours do not exceed available periods |
| CUR-003 | System shall support curriculum templates by grade level |
| CUR-004 | System shall allow semester-specific curriculum definitions |

### 4.9 Timetable Generation Module

| ID | Requirement |
|----|-------------|
| TBL-001 | System shall generate timetable using Timefold Solver with hard/soft constraints |
| TBL-002 | System shall present progress status during generation |
| TBL-003 | System shall calculate and display timetable quality score (0-100) |
| TBL-004 | System shall support generation for: full school, single class, single teacher |
| TBL-005 | System shall allow setting solver time limit (30s to 30min) |
| TBL-006 | System shall store multiple timetable versions per semester |
| TBL-007 | System shall allow publishing/activating a timetable version |
| TBL-008 | System shall track constraint violation counts |

**Hard Constraints (must satisfy 100%):**
- HC-1: No class double-booking (same class, same time, different lessons)
- HC-2: No teacher double-booking (same teacher, same time, different lessons)
- HC-3: No classroom double-booking (same room, same time, different lessons)
- HC-4: All curriculum requirements must be fully satisfied
- HC-5: Teacher weekly load must not exceed maximum
- HC-6: Specialized subjects in appropriate classrooms only
- HC-7: Lessons must fall within teacher availability

**Soft Constraints (optimize to maximize):**
- SC-1: Minimize teacher gaps between lessons
- SC-2: Minimize student gaps (free periods within school day)
- SC-3: Evenly distribute lessons across weekdays
- SC-4: Schedule difficult subjects (Math, Physics) in first 4 periods
- SC-5: Avoid same subject on consecutive days
- SC-6: Balance teacher workloads across days
- SC-7: Maximize classroom utilization efficiency
- SC-8: Group same-subject lessons to minimize context switches

### 4.10 Manual Timetable Editor

| ID | Requirement |
|----|-------------|
| EDT-001 | System shall provide drag-and-drop timetable cell editing |
| EDT-002 | System shall detect and highlight conflicts in real-time |
| EDT-003 | System shall display constraint violations with explanations |
| EDT-004 | System shall recalculate quality score after manual changes |
| EDT-005 | System shall support undo/redo of up to 20 steps |
| EDT-006 | System shall allow swapping two lesson slots |
| EDT-007 | System shall allow adding/removing individual lessons |

### 4.11 Dashboard and Analytics

| ID | Requirement |
|----|-------------|
| DSH-001 | System shall display school-wide timetable statistics |
| DSH-002 | System shall show teacher workload report with bar charts |
| DSH-003 | System shall show classroom utilization heatmap by time/day |
| DSH-004 | System shall show subject distribution pie chart |
| DSH-005 | System shall display timetable quality metrics |
| DSH-006 | System shall show constraint violation summary |

### 4.12 Export Module

| ID | Requirement |
|----|-------------|
| EXP-001 | Export timetable as PDF (per class, teacher, classroom, full school) |
| EXP-002 | Export timetable as Excel (.xlsx) |
| EXP-003 | Export data as CSV |
| EXP-004 | PDF exports must be print-ready with school header/logo |
| EXP-005 | All exports must be in Uzbek language |

### 4.13 Notification Module

| ID | Requirement |
|----|-------------|
| NOT-001 | Send email notifications on timetable publish |
| NOT-002 | Send Telegram bot messages on timetable changes |
| NOT-003 | Display in-app notification feed |
| NOT-004 | Notify teachers of schedule changes |
| NOT-005 | Send system alerts (conflicts found, generation failed) |

---

## 5. Non-Functional Requirements

### 5.1 Performance
| Metric | Target |
|--------|--------|
| API response time (P95) | < 200ms |
| Timetable generation (small school <50 classes) | < 2 min |
| Timetable generation (large school 100+ classes) | < 10 min |
| Page load time (LCP) | < 2.5s |
| Concurrent users | 500+ |
| Database query time (P95) | < 50ms |

### 5.2 Availability
- System uptime: 99.9% (excluding planned maintenance)
- Planned maintenance: Sundays 02:00-04:00 UTC
- Data backup: Daily automated backups with 30-day retention
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour

### 5.3 Security
- OWASP Top 10 compliance
- TLS 1.3 for all communications
- bcrypt password hashing (cost factor 12)
- JWT with RS256 signing
- Rate limiting: 100 req/min per IP for public, 1000 req/min authenticated
- SQL injection prevention via parameterized queries
- XSS prevention via output encoding
- CSRF tokens on state-changing operations

### 5.4 Scalability
- Horizontal scaling via Docker containers
- Stateless backend (Redis for sessions)
- Database connection pooling (HikariCP)
- Redis caching for frequently accessed data
- CDN for static frontend assets

### 5.5 Usability
- All UI text in Uzbek language
- WCAG 2.1 Level AA accessibility
- Responsive design (desktop-first, minimum 1280px)
- Mobile-friendly (minimum 768px)
- Loading states for all async operations
- Error messages in Uzbek

### 5.6 Maintainability
- Test coverage > 80% (unit + integration)
- Clean Architecture pattern
- OpenAPI 3.0 documentation
- Structured logging (JSON format)
- Centralized error handling
- Database versioning via Flyway

---

## 6. User Stories

### Authentication
```
US-001: As a user, I want to log in with email and password so I can access the system.
US-002: As a user, I want to reset my password via email so I can regain access if I forget it.
US-003: As an admin, I want to revoke a user's session so I can terminate unauthorized access.
```

### Timetable Generation
```
US-010: As a Scheduler, I want to generate a timetable automatically so I can avoid
        hours of manual scheduling.
US-011: As an Academic Manager, I want to set a time limit for solver so I can control
        how long generation takes.
US-012: As a Scheduler, I want to see constraint violations so I can fix any issues.
US-013: As a Scheduler, I want to drag and drop lessons so I can fine-tune the timetable.
US-014: As a Teacher, I want to set my unavailable times so I'm not scheduled during
        those periods.
```

### Reports
```
US-020: As a School Admin, I want to export the full school timetable as PDF so I can
        distribute it to parents and teachers.
US-021: As an Academic Manager, I want to see teacher workload charts so I can ensure
        fair distribution.
US-022: As a Viewer, I want to see my class timetable without editing capabilities.
```

---

## 7. Business Rules

| ID | Rule |
|----|------|
| BR-001 | A timetable cannot be published if it has any hard constraint violations |
| BR-002 | A teacher cannot be assigned to more than one class at the same time slot |
| BR-003 | Weekly lesson count must exactly match curriculum requirements |
| BR-004 | Physics/Chemistry cannot be scheduled in a Standard classroom |
| BR-005 | Physical Education must be scheduled in the Sports Hall |
| BR-006 | A teacher's daily lesson count must not exceed (max_weekly_load / working_days) |
| BR-007 | Academic Year must have at least one active Semester |
| BR-008 | A class must be assigned to exactly one shift |
| BR-009 | A new timetable version supersedes but does not delete the previous version |
| BR-010 | Grade 1-4 students shall not have more than 5 lessons per day |
| BR-011 | Grade 5-9 students shall not have more than 6 lessons per day |
| BR-012 | Grade 10-11 students shall not have more than 7 lessons per day |

---

## 8. System Constraints

- Must run on a single VPS with minimum 4 CPU cores and 8GB RAM
- Must support PostgreSQL 16+
- Must support Java 21+ for backend
- Must support Node.js 20+ for frontend build
- Internet connection required for Telegram notifications
- SMTP server required for email notifications

---

## 9. Glossary

| Term | Definition |
|------|------------|
| Lesson Slot | A specific (day, period, classroom) combination where a lesson occurs |
| Hard Constraint | A rule that must never be violated; violation = invalid timetable |
| Soft Constraint | A rule that should ideally be satisfied; violation reduces quality score |
| Pinned Lesson | A lesson manually fixed to a specific slot, immune to solver changes |
| Academic Year | A school year (e.g., 2024-2025) |
| Semester | A half-year period (1st semester: Sep-Jan, 2nd semester: Feb-Jun) |
| Curriculum | The set of subjects and weekly hours required for a specific class |
| Quality Score | A 0-100 metric indicating how well soft constraints are satisfied |
| Shift | A school shift (morning: 08:00-14:25, afternoon: 13:00-18:00) |
