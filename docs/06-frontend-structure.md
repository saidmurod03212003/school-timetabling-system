# Frontend Folder Structure
## Next.js 15 / React 19 / TypeScript

---

```
frontend/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example
├── Dockerfile
├── public/
│   ├── logo.svg
│   ├── logo-dark.svg
│   └── icons/
│
└── src/
    ├── app/                                    ← App Router
    │   ├── globals.css
    │   ├── layout.tsx                          ← Root layout (fonts, providers)
    │   │
    │   ├── (auth)/                             ← Auth group (no sidebar)
    │   │   ├── layout.tsx
    │   │   ├── login/
    │   │   │   └── page.tsx                    ← Kirish sahifasi
    │   │   ├── forgot-password/
    │   │   │   └── page.tsx                    ← Parolni unutdim
    │   │   └── reset-password/
    │   │       └── page.tsx                    ← Parolni tiklash
    │   │
    │   └── (dashboard)/                        ← Protected group (with sidebar)
    │       ├── layout.tsx                      ← Dashboard layout
    │       ├── page.tsx                        ← Asosiy sahifa (Dashboard)
    │       │
    │       ├── schools/
    │       │   ├── page.tsx                    ← Maktablar ro'yxati
    │       │   ├── [id]/
    │       │   │   └── page.tsx                ← Maktab tafsilotlari
    │       │   └── new/
    │       │       └── page.tsx                ← Yangi maktab
    │       │
    │       ├── branches/
    │       │   ├── page.tsx                    ← Filiallar
    │       │   └── [id]/page.tsx
    │       │
    │       ├── academic-years/
    │       │   ├── page.tsx                    ← O'quv yillari
    │       │   └── [id]/
    │       │       ├── page.tsx
    │       │       └── semesters/
    │       │           └── page.tsx            ← Semestrlar
    │       │
    │       ├── classrooms/
    │       │   ├── page.tsx                    ← Xonalar ro'yxati
    │       │   ├── [id]/page.tsx
    │       │   └── new/page.tsx
    │       │
    │       ├── classes/
    │       │   ├── page.tsx                    ← Sinflar
    │       │   ├── [id]/page.tsx
    │       │   └── new/page.tsx
    │       │
    │       ├── subjects/
    │       │   ├── page.tsx                    ← Fanlar
    │       │   ├── [id]/page.tsx
    │       │   └── new/page.tsx
    │       │
    │       ├── teachers/
    │       │   ├── page.tsx                    ← O'qituvchilar
    │       │   ├── [id]/
    │       │   │   ├── page.tsx                ← O'qituvchi profili
    │       │   │   ├── subjects/page.tsx       ← Fanlar belgilash
    │       │   │   └── availability/page.tsx   ← Mavjudligi
    │       │   └── new/page.tsx
    │       │
    │       ├── lesson-periods/
    │       │   └── page.tsx                    ← Dars vaqtlari
    │       │
    │       ├── curriculum/
    │       │   ├── page.tsx                    ← O'quv reja ro'yxati
    │       │   ├── [id]/
    │       │   │   └── page.tsx                ← O'quv reja tafsilotlari
    │       │   └── new/page.tsx
    │       │
    │       ├── timetable/
    │       │   ├── page.tsx                    ← Jadvallar ro'yxati
    │       │   ├── generate/
    │       │   │   └── page.tsx                ← Jadval yaratish
    │       │   ├── [id]/
    │       │   │   ├── page.tsx                ← Jadval ko'rish (FullCalendar)
    │       │   │   ├── editor/
    │       │   │   │   └── page.tsx            ← Drag & Drop muharrir
    │       │   │   └── quality/
    │       │   │       └── page.tsx            ← Sifat ball
    │       │   └── by-class/[classId]/
    │       │       └── page.tsx                ← Sinf bo'yicha jadval
    │       │
    │       ├── reports/
    │       │   ├── page.tsx                    ← Hisobotlar dashboard
    │       │   ├── teacher-workload/page.tsx   ← O'qituvchi yuklamasi
    │       │   ├── classroom-utilization/page.tsx
    │       │   └── subject-distribution/page.tsx
    │       │
    │       ├── exports/
    │       │   └── page.tsx                    ← Eksport sahifasi
    │       │
    │       ├── notifications/
    │       │   └── page.tsx                    ← Bildirishnomalar
    │       │
    │       ├── users/
    │       │   ├── page.tsx                    ← Foydalanuvchilar
    │       │   ├── [id]/page.tsx
    │       │   └── roles/page.tsx
    │       │
    │       └── settings/
    │           ├── page.tsx                    ← Umumiy sozlamalar
    │           ├── school/page.tsx
    │           └── notifications/page.tsx
    │
    ├── components/                             ← Reusable components
    │   ├── ui/                                 ← Shadcn UI base components
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── form.tsx
    │   │   ├── dialog.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── table.tsx
    │   │   ├── badge.tsx
    │   │   ├── card.tsx
    │   │   ├── tabs.tsx
    │   │   ├── toast.tsx
    │   │   ├── tooltip.tsx
    │   │   ├── select.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── calendar.tsx
    │   │   ├── date-picker.tsx
    │   │   ├── avatar.tsx
    │   │   └── skeleton.tsx
    │   │
    │   ├── layout/
    │   │   ├── Sidebar.tsx                     ← Nav sidebar (Uzbek menu)
    │   │   ├── TopNavbar.tsx
    │   │   ├── Breadcrumb.tsx
    │   │   ├── Footer.tsx
    │   │   ├── ThemeToggle.tsx
    │   │   └── LanguageToggle.tsx
    │   │
    │   ├── dashboard/
    │   │   ├── StatsCard.tsx
    │   │   ├── RecentActivity.tsx
    │   │   ├── TimetableQualityGauge.tsx
    │   │   ├── WorkloadBarChart.tsx
    │   │   ├── ClassroomHeatmap.tsx
    │   │   └── SubjectPieChart.tsx
    │   │
    │   ├── timetable/
    │   │   ├── TimetableGrid.tsx               ← Main calendar grid
    │   │   ├── TimetableCell.tsx               ← Individual cell
    │   │   ├── LessonCard.tsx                  ← Draggable lesson card
    │   │   ├── ConflictBadge.tsx               ← Conflict indicator
    │   │   ├── TimetableToolbar.tsx
    │   │   ├── TimetableFilters.tsx
    │   │   ├── GenerationProgress.tsx          ← Solver progress bar
    │   │   ├── QualityScoreCard.tsx
    │   │   ├── ConstraintViolationList.tsx
    │   │   ├── DragOverlay.tsx
    │   │   └── SwapModal.tsx
    │   │
    │   ├── teacher/
    │   │   ├── TeacherCard.tsx
    │   │   ├── TeacherAvailabilityGrid.tsx     ← Weekly availability editor
    │   │   ├── WorkloadIndicator.tsx
    │   │   └── SubjectBadges.tsx
    │   │
    │   ├── curriculum/
    │   │   ├── CurriculumTable.tsx
    │   │   ├── CurriculumItemRow.tsx
    │   │   └── WeeklyHoursEditor.tsx
    │   │
    │   ├── common/
    │   │   ├── DataTable.tsx                   ← Generic sortable table
    │   │   ├── SearchInput.tsx
    │   │   ├── FilterPanel.tsx
    │   │   ├── ConfirmDialog.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   ├── ErrorBoundary.tsx
    │   │   ├── PageHeader.tsx
    │   │   ├── StatusBadge.tsx
    │   │   ├── Pagination.tsx
    │   │   └── ExportButton.tsx
    │   │
    │   └── forms/
    │       ├── SchoolForm.tsx
    │       ├── TeacherForm.tsx
    │       ├── ClassroomForm.tsx
    │       ├── SubjectForm.tsx
    │       ├── StudentClassForm.tsx
    │       └── CurriculumItemForm.tsx
    │
    ├── hooks/                                  ← Custom React hooks
    │   ├── useAuth.ts
    │   ├── useSchool.ts
    │   ├── useTimetable.ts
    │   ├── useTeachers.ts
    │   ├── useClassrooms.ts
    │   ├── useSubjects.ts
    │   ├── useCurriculum.ts
    │   ├── useNotifications.ts
    │   ├── useExport.ts
    │   ├── useDragDrop.ts                      ← DnD Kit integration
    │   └── useDebounce.ts
    │
    ├── store/                                  ← Zustand stores
    │   ├── authStore.ts
    │   ├── schoolStore.ts
    │   ├── timetableStore.ts
    │   ├── notificationStore.ts
    │   └── uiStore.ts
    │
    ├── lib/                                    ← Utilities
    │   ├── api/
    │   │   ├── client.ts                       ← Axios instance
    │   │   ├── auth.ts
    │   │   ├── schools.ts
    │   │   ├── teachers.ts
    │   │   ├── classrooms.ts
    │   │   ├── subjects.ts
    │   │   ├── classes.ts
    │   │   ├── curriculum.ts
    │   │   ├── timetable.ts
    │   │   ├── reports.ts
    │   │   └── notifications.ts
    │   ├── validations/                        ← Zod schemas
    │   │   ├── auth.schema.ts
    │   │   ├── school.schema.ts
    │   │   ├── teacher.schema.ts
    │   │   ├── classroom.schema.ts
    │   │   ├── curriculum.schema.ts
    │   │   └── timetable.schema.ts
    │   ├── utils.ts                            ← General utilities
    │   ├── constants.ts                        ← App constants
    │   ├── formatters.ts                       ← Date/number formatters
    │   └── timetable-helpers.ts               ← Timetable grid helpers
    │
    ├── types/                                  ← TypeScript types
    │   ├── auth.types.ts
    │   ├── school.types.ts
    │   ├── teacher.types.ts
    │   ├── classroom.types.ts
    │   ├── subject.types.ts
    │   ├── curriculum.types.ts
    │   ├── timetable.types.ts
    │   ├── notification.types.ts
    │   └── api.types.ts                        ← ApiResponse<T>, PageResponse<T>
    │
    ├── providers/                              ← Context providers
    │   ├── QueryProvider.tsx                   ← TanStack Query
    │   ├── ThemeProvider.tsx                   ← Next-themes
    │   ├── AuthProvider.tsx
    │   └── ToastProvider.tsx
    │
    └── config/
        ├── navigation.ts                       ← Sidebar nav config (Uzbek)
        ├── queryKeys.ts                        ← TanStack Query keys
        └── dayjs.config.ts                     ← Locale setup
```
