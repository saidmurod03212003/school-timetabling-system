# Backend Folder Structure
## Spring Boot 3 / Java 21 — Clean Architecture + DDD

---

```
backend/
├── pom.xml
├── Dockerfile
├── .env.example
│
└── src/
    ├── main/
    │   ├── java/
    │   │   └── uz/
    │   │       └── edu/
    │   │           └── timetable/
    │   │               │
    │   │               ├── TimetableApplication.java
    │   │               │
    │   │               ├── domain/                          ← DOMAIN LAYER
    │   │               │   ├── shared/
    │   │               │   │   ├── AggregateRoot.java
    │   │               │   │   ├── DomainEvent.java
    │   │               │   │   ├── ValueObject.java
    │   │               │   │   ├── EntityId.java
    │   │               │   │   └── DomainException.java
    │   │               │   │
    │   │               │   ├── school/
    │   │               │   │   ├── School.java              ← Aggregate Root
    │   │               │   │   ├── Branch.java
    │   │               │   │   ├── AcademicYear.java
    │   │               │   │   ├── Semester.java
    │   │               │   │   ├── SchoolSettings.java
    │   │               │   │   ├── SchoolId.java            ← Value Object
    │   │               │   │   ├── SchoolType.java          ← Enum
    │   │               │   │   ├── WorkingDay.java          ← Enum
    │   │               │   │   ├── SchoolRepository.java    ← Port (interface)
    │   │               │   │   └── events/
    │   │               │   │       └── SchoolCreatedEvent.java
    │   │               │   │
    │   │               │   ├── classroom/
    │   │               │   │   ├── Classroom.java
    │   │               │   │   ├── ClassroomType.java
    │   │               │   │   ├── ClassroomStatus.java
    │   │               │   │   ├── ClassroomId.java
    │   │               │   │   └── ClassroomRepository.java
    │   │               │   │
    │   │               │   ├── studentclass/
    │   │               │   │   ├── StudentClass.java
    │   │               │   │   ├── ClassShift.java
    │   │               │   │   ├── StudentClassId.java
    │   │               │   │   └── StudentClassRepository.java
    │   │               │   │
    │   │               │   ├── subject/
    │   │               │   │   ├── Subject.java
    │   │               │   │   ├── SubjectId.java
    │   │               │   │   └── SubjectRepository.java
    │   │               │   │
    │   │               │   ├── teacher/
    │   │               │   │   ├── Teacher.java             ← Aggregate Root
    │   │               │   │   ├── TeacherSubject.java
    │   │               │   │   ├── TeacherAvailability.java
    │   │               │   │   ├── TeacherUnavailability.java
    │   │               │   │   ├── TeacherId.java
    │   │               │   │   ├── AvailabilityType.java
    │   │               │   │   ├── EmploymentType.java
    │   │               │   │   └── TeacherRepository.java
    │   │               │   │
    │   │               │   ├── period/
    │   │               │   │   ├── LessonPeriod.java
    │   │               │   │   ├── LessonPeriodId.java
    │   │               │   │   └── LessonPeriodRepository.java
    │   │               │   │
    │   │               │   ├── curriculum/
    │   │               │   │   ├── Curriculum.java          ← Aggregate Root
    │   │               │   │   ├── CurriculumItem.java
    │   │               │   │   ├── CurriculumId.java
    │   │               │   │   └── CurriculumRepository.java
    │   │               │   │
    │   │               │   ├── timetable/
    │   │               │   │   ├── Timetable.java           ← Aggregate Root
    │   │               │   │   ├── TimetableEntry.java
    │   │               │   │   ├── TimetableStatus.java     ← Enum
    │   │               │   │   ├── QualityScore.java        ← Value Object
    │   │               │   │   ├── ConstraintViolation.java
    │   │               │   │   ├── TimetableId.java
    │   │               │   │   ├── TimetableRepository.java
    │   │               │   │   └── events/
    │   │               │   │       ├── TimetableGenerationStartedEvent.java
    │   │               │   │       ├── TimetableGenerationCompletedEvent.java
    │   │               │   │       ├── TimetableGenerationFailedEvent.java
    │   │               │   │       └── TimetablePublishedEvent.java
    │   │               │   │
    │   │               │   ├── user/
    │   │               │   │   ├── User.java
    │   │               │   │   ├── Role.java
    │   │               │   │   ├── Permission.java
    │   │               │   │   ├── UserId.java
    │   │               │   │   └── UserRepository.java
    │   │               │   │
    │   │               │   └── notification/
    │   │               │       ├── Notification.java
    │   │               │       ├── NotificationChannel.java
    │   │               │       ├── NotificationStatus.java
    │   │               │       └── NotificationRepository.java
    │   │               │
    │   │               ├── application/                     ← APPLICATION LAYER
    │   │               │   ├── shared/
    │   │               │   │   ├── UseCase.java
    │   │               │   │   ├── Command.java
    │   │               │   │   ├── Query.java
    │   │               │   │   └── ApplicationException.java
    │   │               │   │
    │   │               │   ├── auth/
    │   │               │   │   ├── commands/
    │   │               │   │   │   ├── LoginCommand.java
    │   │               │   │   │   ├── LoginCommandHandler.java
    │   │               │   │   │   ├── LogoutCommand.java
    │   │               │   │   │   ├── LogoutCommandHandler.java
    │   │               │   │   │   ├── RefreshTokenCommand.java
    │   │               │   │   │   ├── RefreshTokenCommandHandler.java
    │   │               │   │   │   ├── ResetPasswordCommand.java
    │   │               │   │   │   └── ResetPasswordCommandHandler.java
    │   │               │   │   └── queries/
    │   │               │   │       ├── GetCurrentUserQuery.java
    │   │               │   │       └── GetActiveSessionsQuery.java
    │   │               │   │
    │   │               │   ├── school/
    │   │               │   │   ├── commands/
    │   │               │   │   │   ├── CreateSchoolCommand.java
    │   │               │   │   │   ├── CreateSchoolCommandHandler.java
    │   │               │   │   │   ├── UpdateSchoolCommand.java
    │   │               │   │   │   └── UpdateSchoolCommandHandler.java
    │   │               │   │   └── queries/
    │   │               │   │       ├── GetSchoolQuery.java
    │   │               │   │       └── ListSchoolsQuery.java
    │   │               │   │
    │   │               │   ├── teacher/
    │   │               │   │   ├── commands/
    │   │               │   │   │   ├── CreateTeacherCommand.java
    │   │               │   │   │   ├── CreateTeacherCommandHandler.java
    │   │               │   │   │   ├── UpdateTeacherCommand.java
    │   │               │   │   │   ├── SetTeacherAvailabilityCommand.java
    │   │               │   │   │   └── AssignSubjectsCommand.java
    │   │               │   │   └── queries/
    │   │               │   │       ├── GetTeacherQuery.java
    │   │               │   │       ├── ListTeachersQuery.java
    │   │               │   │       └── GetTeacherWorkloadQuery.java
    │   │               │   │
    │   │               │   ├── curriculum/
    │   │               │   │   ├── commands/
    │   │               │   │   │   ├── CreateCurriculumCommand.java
    │   │               │   │   │   ├── AddCurriculumItemCommand.java
    │   │               │   │   │   └── UpdateCurriculumItemCommand.java
    │   │               │   │   └── queries/
    │   │               │   │       └── GetCurriculumQuery.java
    │   │               │   │
    │   │               │   └── timetable/
    │   │               │       ├── commands/
    │   │               │       │   ├── GenerateTimetableCommand.java
    │   │               │       │   ├── GenerateTimetableCommandHandler.java
    │   │               │       │   ├── PublishTimetableCommand.java
    │   │               │       │   ├── PublishTimetableCommandHandler.java
    │   │               │       │   ├── MoveLessonCommand.java
    │   │               │       │   ├── MoveLessonCommandHandler.java
    │   │               │       │   ├── PinLessonCommand.java
    │   │               │       │   └── SwapLessonsCommand.java
    │   │               │       └── queries/
    │   │               │           ├── GetTimetableQuery.java
    │   │               │           ├── GetTimetableByClassQuery.java
    │   │               │           ├── GetTimetableByTeacherQuery.java
    │   │               │           ├── GetTimetableByClassroomQuery.java
    │   │               │           ├── GetQualityScoreQuery.java
    │   │               │           └── GetConstraintViolationsQuery.java
    │   │               │
    │   │               ├── infrastructure/                  ← INFRASTRUCTURE LAYER
    │   │               │   ├── persistence/
    │   │               │   │   ├── config/
    │   │               │   │   │   ├── JpaConfig.java
    │   │               │   │   │   └── HikariConfig.java
    │   │               │   │   │
    │   │               │   │   ├── entity/                  ← JPA Entities
    │   │               │   │   │   ├── UserJpaEntity.java
    │   │               │   │   │   ├── SchoolJpaEntity.java
    │   │               │   │   │   ├── BranchJpaEntity.java
    │   │               │   │   │   ├── AcademicYearJpaEntity.java
    │   │               │   │   │   ├── SemesterJpaEntity.java
    │   │               │   │   │   ├── ClassroomJpaEntity.java
    │   │               │   │   │   ├── StudentClassJpaEntity.java
    │   │               │   │   │   ├── SubjectJpaEntity.java
    │   │               │   │   │   ├── TeacherJpaEntity.java
    │   │               │   │   │   ├── TeacherSubjectJpaEntity.java
    │   │               │   │   │   ├── CurriculumJpaEntity.java
    │   │               │   │   │   ├── CurriculumItemJpaEntity.java
    │   │               │   │   │   ├── TimetableJpaEntity.java
    │   │               │   │   │   ├── TimetableEntryJpaEntity.java
    │   │               │   │   │   └── NotificationJpaEntity.java
    │   │               │   │   │
    │   │               │   │   ├── repository/              ← Spring Data JPA
    │   │               │   │   │   ├── UserJpaRepository.java
    │   │               │   │   │   ├── SchoolJpaRepository.java
    │   │               │   │   │   ├── TeacherJpaRepository.java
    │   │               │   │   │   ├── TimetableJpaRepository.java
    │   │               │   │   │   ├── TimetableEntryJpaRepository.java
    │   │               │   │   │   └── ... (others)
    │   │               │   │   │
    │   │               │   │   └── adapter/                 ← Repository Adapters
    │   │               │   │       ├── UserRepositoryAdapter.java
    │   │               │   │       ├── SchoolRepositoryAdapter.java
    │   │               │   │       ├── TeacherRepositoryAdapter.java
    │   │               │   │       └── TimetableRepositoryAdapter.java
    │   │               │   │
    │   │               │   ├── solver/
    │   │               │   │   ├── domain/
    │   │               │   │   │   ├── TimetableSolution.java    ← @PlanningSolution
    │   │               │   │   │   ├── Lesson.java               ← @PlanningEntity
    │   │               │   │   │   ├── LessonSlot.java
    │   │               │   │   │   ├── LessonConflict.java
    │   │               │   │   │   └── TeacherSchedule.java
    │   │               │   │   ├── constraints/
    │   │               │   │   │   ├── TimetableConstraintProvider.java
    │   │               │   │   │   ├── HardConstraints.java
    │   │               │   │   │   └── SoftConstraints.java
    │   │               │   │   ├── SolverService.java
    │   │               │   │   ├── SolverJobTracker.java
    │   │               │   │   └── TimetableMapper.java
    │   │               │   │
    │   │               │   ├── cache/
    │   │               │   │   ├── RedisConfig.java
    │   │               │   │   ├── CacheService.java
    │   │               │   │   └── TimetableCacheService.java
    │   │               │   │
    │   │               │   ├── notification/
    │   │               │   │   ├── email/
    │   │               │   │   │   ├── EmailService.java
    │   │               │   │   │   └── EmailConfig.java
    │   │               │   │   ├── telegram/
    │   │               │   │   │   ├── TelegramService.java
    │   │               │   │   │   └── TelegramConfig.java
    │   │               │   │   └── NotificationDispatcher.java
    │   │               │   │
    │   │               │   ├── security/
    │   │               │   │   ├── JwtTokenProvider.java
    │   │               │   │   ├── JwtAuthFilter.java
    │   │               │   │   ├── SecurityConfig.java
    │   │               │   │   ├── CustomUserDetails.java
    │   │               │   │   ├── CustomUserDetailsService.java
    │   │               │   │   └── PasswordEncoderConfig.java
    │   │               │   │
    │   │               │   └── export/
    │   │               │       ├── PdfExportService.java
    │   │               │       ├── ExcelExportService.java
    │   │               │       └── CsvExportService.java
    │   │               │
    │   │               └── presentation/                    ← PRESENTATION LAYER
    │   │                   ├── config/
    │   │                   │   ├── CorsConfig.java
    │   │                   │   ├── OpenApiConfig.java
    │   │                   │   └── RateLimiterConfig.java
    │   │                   │
    │   │                   ├── controller/
    │   │                   │   ├── AuthController.java
    │   │                   │   ├── SchoolController.java
    │   │                   │   ├── BranchController.java
    │   │                   │   ├── AcademicYearController.java
    │   │                   │   ├── SemesterController.java
    │   │                   │   ├── ClassroomController.java
    │   │                   │   ├── StudentClassController.java
    │   │                   │   ├── SubjectController.java
    │   │                   │   ├── TeacherController.java
    │   │                   │   ├── LessonPeriodController.java
    │   │                   │   ├── CurriculumController.java
    │   │                   │   ├── TimetableController.java
    │   │                   │   ├── TimetableEditorController.java
    │   │                   │   ├── ReportController.java
    │   │                   │   ├── ExportController.java
    │   │                   │   ├── NotificationController.java
    │   │                   │   ├── UserController.java
    │   │                   │   └── DashboardController.java
    │   │                   │
    │   │                   ├── dto/
    │   │                   │   ├── request/
    │   │                   │   │   ├── auth/
    │   │                   │   │   │   ├── LoginRequest.java
    │   │                   │   │   │   ├── RefreshTokenRequest.java
    │   │                   │   │   │   ├── ForgotPasswordRequest.java
    │   │                   │   │   │   └── ResetPasswordRequest.java
    │   │                   │   │   ├── school/
    │   │                   │   │   │   ├── CreateSchoolRequest.java
    │   │                   │   │   │   └── UpdateSchoolRequest.java
    │   │                   │   │   ├── teacher/
    │   │                   │   │   │   ├── CreateTeacherRequest.java
    │   │                   │   │   │   ├── UpdateTeacherRequest.java
    │   │                   │   │   │   └── SetAvailabilityRequest.java
    │   │                   │   │   ├── curriculum/
    │   │                   │   │   │   ├── CreateCurriculumRequest.java
    │   │                   │   │   │   └── CurriculumItemRequest.java
    │   │                   │   │   └── timetable/
    │   │                   │   │       ├── GenerateTimetableRequest.java
    │   │                   │   │       ├── MoveLessonRequest.java
    │   │                   │   │       └── SwapLessonsRequest.java
    │   │                   │   │
    │   │                   │   └── response/
    │   │                   │       ├── ApiResponse.java      ← Generic wrapper
    │   │                   │       ├── PageResponse.java
    │   │                   │       ├── ErrorResponse.java
    │   │                   │       ├── auth/
    │   │                   │       │   ├── AuthResponse.java
    │   │                   │       │   └── UserResponse.java
    │   │                   │       ├── school/
    │   │                   │       │   └── SchoolResponse.java
    │   │                   │       ├── teacher/
    │   │                   │       │   ├── TeacherResponse.java
    │   │                   │       │   └── TeacherWorkloadResponse.java
    │   │                   │       ├── timetable/
    │   │                   │       │   ├── TimetableResponse.java
    │   │                   │       │   ├── TimetableEntryResponse.java
    │   │                   │       │   ├── QualityScoreResponse.java
    │   │                   │       │   └── ConstraintViolationResponse.java
    │   │                   │       └── dashboard/
    │   │                   │           ├── DashboardResponse.java
    │   │                   │           └── AnalyticsResponse.java
    │   │                   │
    │   │                   ├── mapper/                      ← MapStruct
    │   │                   │   ├── SchoolMapper.java
    │   │                   │   ├── TeacherMapper.java
    │   │                   │   ├── TimetableMapper.java
    │   │                   │   └── ...
    │   │                   │
    │   │                   └── exception/
    │   │                       ├── GlobalExceptionHandler.java
    │   │                       ├── ResourceNotFoundException.java
    │   │                       ├── ConflictException.java
    │   │                       ├── ValidationException.java
    │   │                       └── ForbiddenException.java
    │   │
    │   └── resources/
    │       ├── application.yml
    │       ├── application-dev.yml
    │       ├── application-prod.yml
    │       ├── db/
    │       │   └── migration/
    │       │       ├── V1__create_auth_tables.sql
    │       │       ├── V2__create_school_tables.sql
    │       │       ├── V3__create_resource_tables.sql
    │       │       ├── V4__create_curriculum_tables.sql
    │       │       ├── V5__create_timetable_tables.sql
    │       │       ├── V6__create_notification_tables.sql
    │       │       ├── V7__insert_default_roles.sql
    │       │       ├── V8__insert_default_permissions.sql
    │       │       └── V9__insert_default_classroom_types.sql
    │       ├── templates/
    │       │   ├── email/
    │       │   │   ├── password-reset.html
    │       │   │   ├── timetable-published.html
    │       │   │   └── welcome.html
    │       │   └── solverConfig.xml
    │       └── logback-spring.xml
    │
    └── test/
        └── java/
            └── uz/
                └── edu/
                    └── timetable/
                        ├── unit/
                        │   ├── domain/
                        │   └── application/
                        └── integration/
                            ├── auth/
                            ├── school/
                            ├── teacher/
                            ├── curriculum/
                            └── timetable/
```
