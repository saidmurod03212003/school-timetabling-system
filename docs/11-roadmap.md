# Development Roadmap
## Smart School Timetable Management and Optimization System

---

## Phase Overview

```
Phase 1: Foundation          (Weeks 1-4)   ← Infrastructure + Auth + School
Phase 2: Resource Management (Weeks 5-8)   ← Teachers + Classrooms + Subjects
Phase 3: Core Engine         (Weeks 9-14)  ← Curriculum + Solver + Timetable
Phase 4: UI & Editor         (Weeks 15-18) ← Frontend + DnD Editor + Calendar
Phase 5: Analytics & Export  (Weeks 19-22) ← Reports + Charts + PDF/Excel
Phase 6: Notifications       (Weeks 23-24) ← Email + Telegram + In-App
Phase 7: Production          (Weeks 25-28) ← Security + Performance + Deploy
```

---

## Phase 1: Foundation (Weeks 1-4)

### Week 1: Project Setup
- [ ] Initialize Spring Boot 3 project (Maven, Java 21)
- [ ] Initialize Next.js 15 project (TypeScript, Tailwind, Shadcn)
- [ ] Setup Docker Compose (Postgres, Redis, Backend, Frontend, Nginx)
- [ ] Configure Flyway migrations
- [ ] Setup GitHub repository with branch strategy
- [ ] Configure CI/CD pipeline (GitHub Actions)
- [ ] Setup logging (Logback, structured JSON logs)
- [ ] Configure Swagger/OpenAPI 3.0

### Week 2: Authentication
- [ ] Design user, role, permission tables (Flyway V1)
- [ ] Implement JWT provider (access + refresh tokens)
- [ ] Implement Spring Security configuration
- [ ] Build AuthController (login, logout, refresh)
- [ ] Build password reset flow (email OTP)
- [ ] Implement rate limiting (Bucket4j)
- [ ] Implement account lockout after 5 failures
- [ ] Implement audit logging
- [ ] Write integration tests for auth flows
- [ ] Build login page (Uzbek UI)

### Week 3: School Management Backend
- [ ] School, Branch, AcademicYear, Semester tables (Flyway V2)
- [ ] CRUD APIs for School, Branch, AcademicYear, Semester
- [ ] School Settings API
- [ ] Role-based access control for school operations
- [ ] Write tests

### Week 4: School Management Frontend
- [ ] Dashboard layout (sidebar, navbar, theme toggle)
- [ ] School list, create, edit, delete pages (Uzbek)
- [ ] Branch management pages
- [ ] Academic Year + Semester management
- [ ] TanStack Query integration
- [ ] Zustand auth + school store

**Phase 1 Deliverable:** Running system with auth and school management

---

## Phase 2: Resource Management (Weeks 5-8)

### Week 5: Classroom Module
- [ ] Classroom types and classrooms tables (Flyway V3)
- [ ] Classroom CRUD API
- [ ] Classroom type management
- [ ] Frontend: Classroom list, form, detail pages
- [ ] Classroom status management (active/maintenance)

### Week 6: Subject + Student Class Module
- [ ] Subjects and student_classes tables (Flyway V4)
- [ ] Subject CRUD API with classroom type requirements
- [ ] Student Class CRUD API
- [ ] Frontend: Subject management pages (Uzbek)
- [ ] Frontend: Class management (1-A, 5-B...) pages

### Week 7: Teacher Module — Core
- [ ] Teacher tables (Flyway V5)
- [ ] Teacher CRUD API
- [ ] Teacher-subject assignment API
- [ ] Teacher availability management API
- [ ] Teacher workload calculation service
- [ ] Frontend: Teacher list, profile pages

### Week 8: Teacher Module — Availability UI
- [ ] Weekly availability grid component (visual timetable grid)
- [ ] Teacher unavailability (date-specific) management
- [ ] Workload indicator component
- [ ] Teacher workload preview
- [ ] Lesson periods configuration API + UI

**Phase 2 Deliverable:** All resource management working

---

## Phase 3: Core Engine (Weeks 9-14)

### Week 9: Curriculum Module
- [ ] Curriculum tables (Flyway V6)
- [ ] Curriculum CRUD API
- [ ] Curriculum item management (subject + teacher + weekly hours)
- [ ] Validation: total hours vs available periods
- [ ] Curriculum template functionality
- [ ] Frontend: Curriculum builder UI

### Week 10: Curriculum Frontend + Validation
- [ ] Curriculum table UI with inline editing
- [ ] Weekly hours validation (visual feedback)
- [ ] Curriculum copy from previous semester
- [ ] Teacher assignment within curriculum
- [ ] Curriculum lock/unlock functionality

### Week 11: Timefold Solver Setup
- [ ] Add Timefold Solver dependency
- [ ] Implement planning domain (TimetableSolution, Lesson, LessonSlot)
- [ ] Configure solverConfig.xml
- [ ] Implement TimetableConstraintProvider (hard constraints)
- [ ] Unit test each hard constraint
- [ ] Implement SolverService with async execution
- [ ] Implement SolverJobTracker (Redis-based progress)

### Week 12: Solver Soft Constraints + Quality Score
- [ ] Implement all 8 soft constraints
- [ ] Quality score calculation algorithm
- [ ] Pre-solver feasibility check
- [ ] Timetable generation API (POST /timetables/generate)
- [ ] Status polling API (GET /timetables/{id}/status)
- [ ] Integration tests for solver with sample data

### Week 13: Timetable Data Layer
- [ ] Timetable tables (Flyway V7)
- [ ] TimetableEntry CRUD
- [ ] Publish/archive workflow
- [ ] Conflict detection service
- [ ] By-class / by-teacher / by-classroom query APIs
- [ ] Timetable versioning

### Week 14: Solver Testing + Optimization
- [ ] Load test with realistic school data (30 classes, 50 teachers)
- [ ] Tune constraint weights
- [ ] Tune solver configuration (time limit, tabu size)
- [ ] Benchmark generation time
- [ ] Fix any solver performance issues

**Phase 3 Deliverable:** Working timetable generation engine

---

## Phase 4: UI + Drag & Drop Editor (Weeks 15-18)

### Week 15: Timetable Generation UI
- [ ] Generation wizard UI (select semester, settings, time limit)
- [ ] Progress bar with live solver status polling
- [ ] Quality score display (gauge chart)
- [ ] Constraint violation list UI
- [ ] Published timetable view (read-only grid)

### Week 16: Timetable Grid Component
- [ ] Main TimetableGrid component (FullCalendar or custom)
- [ ] TimetableCell component
- [ ] LessonCard component with subject color
- [ ] Conflict highlighting (red border)
- [ ] Filter by class / teacher / classroom
- [ ] Day/period labels in Uzbek

### Week 17: Drag & Drop Editor
- [ ] DnD Kit integration
- [ ] Draggable LessonCard
- [ ] Droppable TimetableCell
- [ ] Real-time conflict detection on drop
- [ ] Visual conflict indicator
- [ ] Undo/Redo functionality (20 steps)
- [ ] Pin/Unpin lesson toggle

### Week 18: Editor Refinements
- [ ] Swap lesson modal
- [ ] Add lesson to empty slot
- [ ] Remove lesson from slot
- [ ] Editor toolbar (save, undo, redo, filter, zoom)
- [ ] Auto-save draft edits
- [ ] Publish button with confirmation

**Phase 4 Deliverable:** Full UI with drag-and-drop editor

---

## Phase 5: Analytics & Exports (Weeks 19-22)

### Week 19: Dashboard Analytics Backend
- [ ] Teacher workload report API
- [ ] Classroom utilization report API
- [ ] Subject distribution report API
- [ ] Dashboard summary API
- [ ] Caching for report endpoints

### Week 20: Dashboard Frontend
- [ ] Dashboard page with stat cards
- [ ] Teacher workload bar chart (Recharts)
- [ ] Classroom utilization heatmap
- [ ] Subject distribution pie chart
- [ ] Quality metrics panel

### Week 21: Export Backend
- [ ] PDF export (Apache PDFBox or iText)
- [ ] Excel export (Apache POI)
- [ ] CSV export
- [ ] Export by class, teacher, classroom, full school
- [ ] Uzbek language PDF templates with school logo

### Week 22: Export Frontend
- [ ] Export page with format + type selection
- [ ] Download progress UI
- [ ] Print-optimized PDF preview
- [ ] Bulk export (entire school)

**Phase 5 Deliverable:** Analytics dashboard + exports working

---

## Phase 6: Notifications (Weeks 23-24)

### Week 23: Notification Backend
- [ ] Notification tables (Flyway V8)
- [ ] In-app notification service
- [ ] Email notification service (Spring Mail + Thymeleaf)
- [ ] Telegram bot integration
- [ ] Notification templates (timetable published, schedule changed)
- [ ] Notification settings API

### Week 24: Notification Frontend
- [ ] Notification bell icon with unread count
- [ ] Notification dropdown list
- [ ] Full notification page
- [ ] Notification settings page
- [ ] Mark as read / read all

**Phase 6 Deliverable:** Full notification system

---

## Phase 7: Production Hardening (Weeks 25-28)

### Week 25: Security Hardening
- [ ] Penetration testing (OWASP Top 10)
- [ ] XSS headers (Content-Security-Policy)
- [ ] SQL injection audit
- [ ] CORS configuration review
- [ ] Sensitive data encryption at rest
- [ ] Secrets management (Docker secrets)

### Week 26: Performance & Scalability
- [ ] Load testing (JMeter / k6)
- [ ] Database query optimization (EXPLAIN ANALYZE)
- [ ] Redis caching for hot endpoints
- [ ] Connection pool tuning
- [ ] Frontend bundle optimization
- [ ] Image optimization (Next.js Image)

### Week 27: Testing & QA
- [ ] End-to-end tests (Playwright)
- [ ] Unit test coverage > 80%
- [ ] Integration test suite
- [ ] UAT with real school administrators
- [ ] Bug fixes from UAT

### Week 28: Deployment & Go-Live
- [ ] Production Docker Compose
- [ ] Nginx SSL/TLS configuration
- [ ] Domain setup
- [ ] Monitoring setup (Uptime Kuma / Prometheus)
- [ ] Backup automation
- [ ] Runbook documentation
- [ ] Go-live

**Total Timeline: 28 weeks (~7 months)**
