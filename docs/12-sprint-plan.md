# Sprint Plan
## Agile Development — 2-Week Sprints

---

## Sprint Cadence
- Sprint Duration: 2 weeks
- Team: 2 Backend devs + 1 Frontend dev + 1 Full-stack + 1 QA
- Story Points: Fibonacci scale (1, 2, 3, 5, 8, 13)
- Velocity Target: 40 SP/sprint

---

## Sprint 1: Foundation & Auth (Weeks 1-2)
**Goal:** Running infrastructure + authentication

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | Setup Docker Compose (PG, Redis, Nginx) | 3 | BE |
| 2 | Initialize Spring Boot project + Flyway | 2 | BE |
| 3 | Initialize Next.js 15 + Tailwind + Shadcn | 2 | FE |
| 4 | GitHub Actions CI pipeline | 3 | BE |
| 5 | Implement JWT auth (login/logout/refresh) | 8 | BE |
| 6 | Spring Security + role-based access | 5 | BE |
| 7 | Password reset via email OTP | 5 | BE |
| 8 | Login page (Uzbek UI) + auth store | 5 | FE |
| 9 | Audit log implementation | 3 | BE |
| 10 | Rate limiting + account lockout | 3 | BE |
| **Total** | | **39** | |

**Definition of Done:**
- [ ] Login/logout works with JWT
- [ ] Refresh token rotation works
- [ ] Password reset email sent
- [ ] Login UI is in Uzbek
- [ ] All auth tests pass

---

## Sprint 2: School + Branch Management (Weeks 3-4)
**Goal:** Multi-tenant school data management

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | School CRUD API + tests | 5 | BE |
| 2 | Branch CRUD API | 3 | BE |
| 3 | Academic Year + Semester API | 5 | BE |
| 4 | School Settings API | 3 | BE |
| 5 | Dashboard layout + sidebar (Uzbek nav) | 5 | FE |
| 6 | School management pages (Uzbek) | 5 | FE |
| 7 | Branch management pages | 3 | FE |
| 8 | Academic year + semester pages | 5 | FE |
| 9 | TanStack Query + Zustand setup | 3 | FE |
| 10 | Role permission guards on routes | 3 | FE |
| **Total** | | **40** | |

---

## Sprint 3: Classroom + Subject Management (Weeks 5-6)
**Goal:** Classroom and subject resource management

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | Classroom type + classroom API | 5 | BE |
| 2 | Subject API with classroom type requirements | 5 | BE |
| 3 | Student class API (1-A, 5-B etc) | 5 | BE |
| 4 | Lesson period configuration API | 3 | BE |
| 5 | Classroom management UI (Uzbek) | 5 | FE |
| 6 | Subject management UI | 5 | FE |
| 7 | Student class management UI | 5 | FE |
| 8 | Lesson period settings UI | 3 | FE |
| 9 | DataTable component with sort/filter | 3 | FE |
| **Total** | | **39** | |

---

## Sprint 4: Teacher Management (Weeks 7-8)
**Goal:** Complete teacher resource management

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | Teacher CRUD API | 5 | BE |
| 2 | Teacher-subject assignment API | 3 | BE |
| 3 | Teacher availability management API | 5 | BE |
| 4 | Teacher workload calculation service | 5 | BE |
| 5 | Teacher list + profile UI | 5 | FE |
| 6 | Weekly availability grid component | 8 | FE |
| 7 | Teacher workload indicator | 5 | FE |
| 8 | Subject assignment UI | 3 | FE |
| **Total** | | **39** | |

---

## Sprint 5: Curriculum Module (Weeks 9-10)
**Goal:** Define weekly lesson requirements per class

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | Curriculum + curriculum item API | 8 | BE |
| 2 | Curriculum validation service | 5 | BE |
| 3 | Curriculum template functionality | 5 | BE |
| 4 | Curriculum builder UI | 8 | FE |
| 5 | Weekly hours inline editor | 5 | FE |
| 6 | Teacher assignment in curriculum | 5 | FE |
| 7 | Curriculum lock/unlock | 3 | BE+FE |
| **Total** | | **39** | |

---

## Sprint 6: Timefold Solver — Core (Weeks 11-12)
**Goal:** Working timetable generation engine

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | Timefold dependency + planning domain model | 8 | BE |
| 2 | Hard constraint implementation (9 constraints) | 13 | BE |
| 3 | Solver configuration (solverConfig.xml) | 3 | BE |
| 4 | SolverService + async execution | 5 | BE |
| 5 | SolverJobTracker (Redis progress) | 5 | BE |
| 6 | Feasibility checker pre-validation | 5 | BE |
| **Total** | | **39** | |

---

## Sprint 7: Solver Soft Constraints + Timetable API (Weeks 13-14)
**Goal:** Quality optimization + timetable data APIs

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | Soft constraint implementation (8 constraints) | 13 | BE |
| 2 | Quality score calculation + display | 5 | BE |
| 3 | Timetable generation API + status polling | 5 | BE |
| 4 | Timetable CRUD + versioning API | 8 | BE |
| 5 | By-class/teacher/classroom query APIs | 5 | BE |
| 6 | Publish/archive workflow | 3 | BE |
| **Total** | | **39** | |

---

## Sprint 8: Timetable UI + Calendar View (Weeks 15-16)
**Goal:** Timetable display and generation UI

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | Generation wizard UI | 8 | FE |
| 2 | Solver progress bar + live status | 5 | FE |
| 3 | Quality score gauge component | 3 | FE |
| 4 | Constraint violation list UI | 5 | FE |
| 5 | TimetableGrid component (main calendar) | 8 | FE |
| 6 | TimetableCell + LessonCard components | 5 | FE |
| 7 | Filter by class/teacher/classroom | 5 | FE |
| **Total** | | **39** | |

---

## Sprint 9: Drag & Drop Editor (Weeks 17-18)
**Goal:** Interactive timetable editor

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | DnD Kit integration + draggable lessons | 8 | FE |
| 2 | Droppable cells + visual feedback | 5 | FE |
| 3 | Real-time conflict detection on drop | 8 | FE+BE |
| 4 | Conflict badge + error display | 3 | FE |
| 5 | Undo/Redo (20 steps) | 5 | FE |
| 6 | Pin/Unpin lesson | 3 | FE+BE |
| 7 | Swap lesson modal | 5 | FE |
| 8 | Editor save + auto-draft | 3 | FE |
| **Total** | | **40** | |

---

## Sprint 10: Analytics Dashboard (Weeks 19-20)
**Goal:** Reporting and analytics

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | Workload report API + caching | 5 | BE |
| 2 | Classroom utilization API | 5 | BE |
| 3 | Subject distribution API | 3 | BE |
| 4 | Dashboard summary API | 3 | BE |
| 5 | Dashboard page + stat cards | 5 | FE |
| 6 | Teacher workload bar chart | 5 | FE |
| 7 | Classroom utilization heatmap | 8 | FE |
| 8 | Subject distribution pie chart | 5 | FE |
| **Total** | | **39** | |

---

## Sprint 11: Export Module (Weeks 21-22)
**Goal:** PDF, Excel, CSV exports

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | PDF export (iText — class view) | 8 | BE |
| 2 | PDF export (teacher/classroom/full school) | 5 | BE |
| 3 | Excel export (Apache POI) | 8 | BE |
| 4 | CSV export | 3 | BE |
| 5 | Export API with format/type params | 3 | BE |
| 6 | Export page UI + format selection | 5 | FE |
| 7 | Download progress indicator | 3 | FE |
| 8 | Print-friendly CSS for in-browser print | 5 | FE |
| **Total** | | **40** | |

---

## Sprint 12: Notifications (Weeks 23-24)
**Goal:** All notification channels

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | In-app notification service + API | 5 | BE |
| 2 | Email notification (Spring Mail + templates) | 8 | BE |
| 3 | Telegram bot integration | 8 | BE |
| 4 | Notification settings API | 3 | BE |
| 5 | Notification bell + dropdown UI | 5 | FE |
| 6 | Notification full page | 3 | FE |
| 7 | Notification settings UI | 3 | FE |
| 8 | Trigger notifications on timetable publish | 3 | BE |
| **Total** | | **38** | |

---

## Sprint 13: Security + Performance (Weeks 25-26)
**Goal:** Production security and performance

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | OWASP security audit + fixes | 8 | BE |
| 2 | Content-Security-Policy headers | 3 | BE+FE |
| 3 | SQL injection audit | 5 | BE |
| 4 | Load testing + bottleneck fixes | 8 | BE |
| 5 | Redis caching for hot paths | 5 | BE |
| 6 | Database index optimization | 5 | BE |
| 7 | Frontend bundle optimization | 3 | FE |
| 8 | Connection pool tuning | 3 | BE |
| **Total** | | **40** | |

---

## Sprint 14: UAT + Go-Live (Weeks 27-28)
**Goal:** Production deployment and go-live

| # | Story | SP | Owner |
|---|-------|----|-------|
| 1 | End-to-end test suite (Playwright) | 8 | QA |
| 2 | UAT with school administrators | 5 | All |
| 3 | Bug fixes from UAT | 8 | All |
| 4 | Production Docker Compose setup | 5 | BE |
| 5 | Nginx SSL + domain configuration | 3 | BE |
| 6 | Monitoring setup (Uptime Kuma) | 3 | BE |
| 7 | Backup automation scripts | 3 | BE |
| 8 | Runbook + operator docs | 3 | All |
| **Total** | | **38** | |

---

## Sprint Velocity Summary

| Sprint | Focus | SP |
|--------|-------|-----|
| 1 | Foundation + Auth | 39 |
| 2 | School Management | 40 |
| 3 | Classrooms + Subjects | 39 |
| 4 | Teachers | 39 |
| 5 | Curriculum | 39 |
| 6 | Solver Core | 39 |
| 7 | Solver Soft + APIs | 39 |
| 8 | Timetable UI | 39 |
| 9 | DnD Editor | 40 |
| 10 | Analytics | 39 |
| 11 | Exports | 40 |
| 12 | Notifications | 38 |
| 13 | Security + Perf | 40 |
| 14 | UAT + Go-Live | 38 |
| **Total** | | **538** |
