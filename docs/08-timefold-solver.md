# Timefold Solver Design
## Timetable Optimization Engine

---

## 1. Overview

Timefold Solver (the successor to OptaPlanner) uses **Constraint Satisfaction Programming** to find the optimal assignment of lessons to time slots while satisfying hard and soft constraints.

### 1.1 Solver Configuration

```xml
<!-- src/main/resources/templates/solverConfig.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<solver xmlns="https://timefold.ai/xsd/solver">
  <solutionClass>uz.edu.timetable.infrastructure.solver.domain.TimetableSolution</solutionClass>
  <entityClass>uz.edu.timetable.infrastructure.solver.domain.Lesson</entityClass>

  <termination>
    <!-- Stop when: time exceeded OR score not improving for 60s -->
    <secondsSpentLimit>300</secondsSpentLimit>
    <unimprovedSecondsSpentLimit>60</unimprovedSecondsSpentLimit>
  </termination>

  <constructionHeuristic>
    <constructionHeuristicType>FIRST_FIT_DECREASING</constructionHeuristicType>
  </constructionHeuristic>

  <localSearch>
    <localSearchType>TABU_SEARCH</localSearchType>
    <acceptor>
      <entityTabuSize>7</entityTabuSize>
    </acceptor>
    <forager>
      <acceptedCountLimit>2000</acceptedCountLimit>
    </forager>
  </localSearch>
</solver>
```

---

## 2. Planning Domain Model

### 2.1 Planning Solution

```java
@PlanningSolution
public class TimetableSolution {

    // Problem facts (not changed by solver)
    @ProblemFactCollectionProperty
    private List<LessonSlot> lessonSlots;       // all possible (day, period, room) combos

    @ProblemFactCollectionProperty
    private List<StudentClassFact> studentClasses;

    @ProblemFactCollectionProperty
    private List<TeacherFact> teachers;

    @ProblemFactCollectionProperty
    private List<ClassroomFact> classrooms;

    @ProblemFactCollectionProperty
    private List<LessonPeriodFact> lessonPeriods;

    // Planning entities (solver assigns lessonSlot to each)
    @PlanningEntityCollectionProperty
    private List<Lesson> lessons;               // each curriculum item × weekly hours

    @PlanningScore(scoreDefinitionClass = HardSoftScore.class)
    private HardSoftScore score;

    // Getters/Setters...
}
```

### 2.2 Planning Entity (Lesson)

```java
@PlanningEntity
public class Lesson {

    private UUID id;
    private String subjectName;
    private UUID subjectId;
    private UUID studentClassId;
    private String studentClassName;
    private UUID teacherId;
    private String teacherName;
    private String requiredClassroomTypeCode;    // null = any room
    private int lessonIndex;                     // 1st Math, 2nd Math, etc.

    // Planning variable — solver assigns this
    @PlanningVariable(valueRangeProviderRefs = "lessonSlotRange")
    private LessonSlot lessonSlot;              // null = unassigned

    // Pinned lessons are not moved by solver
    @PlanningPin
    private boolean pinned;

    // Getters/Setters...
}
```

### 2.3 Lesson Slot (Timeslot + Room)

```java
public class LessonSlot {

    private UUID id;
    private DayOfWeek dayOfWeek;
    private int periodNumber;
    private UUID classroomId;
    private String classroomTypeCode;
    private int classroomCapacity;
    private String shift;                       // FIRST, SECOND
    private LocalTime startTime;
    private LocalTime endTime;

    // Getters...
}
```

### 2.4 Supporting Facts

```java
public class TeacherFact {
    private UUID id;
    private String name;
    private int minWeeklyLoad;
    private int maxWeeklyLoad;
    private Set<String> availableSlotKeys;     // "MONDAY_3", "TUESDAY_1"
    private Set<String> unavailableDates;      // "2024-10-15"
}

public class StudentClassFact {
    private UUID id;
    private String name;
    private int gradeLevel;
    private String shift;
}

public class ClassroomFact {
    private UUID id;
    private String name;
    private String typeCode;
    private int capacity;
}
```

---

## 3. Constraint Provider

```java
@ConstraintConfiguration
public class TimetableConstraintProvider implements ConstraintProvider {

    @Override
    public Constraint[] defineConstraints(ConstraintFactory factory) {
        return new Constraint[]{
            // === HARD CONSTRAINTS ===
            teacherConflict(factory),
            studentClassConflict(factory),
            classroomConflict(factory),
            teacherAvailability(factory),
            classroomTypeMatch(factory),
            teacherMaxWeeklyLoad(factory),
            teacherMinWeeklyLoad(factory),
            shiftMatchConstraint(factory),
            maxDailyLessonsPerClass(factory),

            // === SOFT CONSTRAINTS ===
            teacherGapMinimization(factory),
            studentGapMinimization(factory),
            distributeSubjectsEvenly(factory),
            morningPreferenceForCoreSubjects(factory),
            avoidConsecutiveSameSubject(factory),
            balanceTeacherWorkloadAcrossDays(factory),
            classroomUtilization(factory),
            preferredTimeSlots(factory)
        };
    }

    // ─── HARD CONSTRAINTS ────────────────────────────────────────────────────

    /** HC-1: Two lessons for the same teacher cannot be at the same time */
    private Constraint teacherConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                Joiners.equal(l -> l.getLessonSlot().getDayOfWeek()),
                Joiners.equal(l -> l.getLessonSlot().getPeriodNumber()),
                Joiners.equal(Lesson::getTeacherId))
            .filter((l1, l2) -> l1.getLessonSlot() != null && l2.getLessonSlot() != null)
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("teacherConflict");
    }

    /** HC-2: Two lessons for the same student class cannot be at the same time */
    private Constraint studentClassConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                Joiners.equal(l -> l.getLessonSlot().getDayOfWeek()),
                Joiners.equal(l -> l.getLessonSlot().getPeriodNumber()),
                Joiners.equal(Lesson::getStudentClassId))
            .filter((l1, l2) -> l1.getLessonSlot() != null && l2.getLessonSlot() != null)
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("studentClassConflict");
    }

    /** HC-3: Two lessons in the same classroom cannot be at the same time */
    private Constraint classroomConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                Joiners.equal(l -> l.getLessonSlot().getDayOfWeek()),
                Joiners.equal(l -> l.getLessonSlot().getPeriodNumber()),
                Joiners.equal(l -> l.getLessonSlot().getClassroomId()))
            .filter((l1, l2) -> l1.getLessonSlot() != null && l2.getLessonSlot() != null)
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("classroomConflict");
    }

    /** HC-4: Teacher must be available at assigned time */
    private Constraint teacherAvailability(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(lesson -> lesson.getLessonSlot() != null)
            .filter(lesson -> !isTeacherAvailable(lesson))
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("teacherAvailability");
    }

    /** HC-5: Subject must use appropriate classroom type */
    private Constraint classroomTypeMatch(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(lesson -> lesson.getLessonSlot() != null
                && lesson.getRequiredClassroomTypeCode() != null
                && !lesson.getRequiredClassroomTypeCode()
                          .equals(lesson.getLessonSlot().getClassroomTypeCode()))
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("classroomTypeMatch");
    }

    /** HC-6: Teacher weekly load must not exceed maximum */
    private Constraint teacherMaxWeeklyLoad(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(l -> l.getLessonSlot() != null)
            .groupBy(Lesson::getTeacherId, ConstraintCollectors.count())
            .filter((teacherId, count) -> count > getTeacherMaxLoad(teacherId))
            .penalize(HardSoftScore.ONE_HARD,
                (teacherId, count) -> count - getTeacherMaxLoad(teacherId))
            .asConstraint("teacherMaxWeeklyLoad");
    }

    /** HC-7: Class shift must match classroom shift */
    private Constraint shiftMatchConstraint(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(l -> l.getLessonSlot() != null)
            .filter(l -> !getClassShift(l.getStudentClassId())
                         .equals(l.getLessonSlot().getShift()))
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("shiftMismatch");
    }

    /** HC-8: Maximum lessons per day per class (grade-based) */
    private Constraint maxDailyLessonsPerClass(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(l -> l.getLessonSlot() != null)
            .groupBy(Lesson::getStudentClassId,
                     l -> l.getLessonSlot().getDayOfWeek(),
                     ConstraintCollectors.count())
            .filter((classId, day, count) -> count > getMaxDailyLessons(classId))
            .penalize(HardSoftScore.ONE_HARD,
                (classId, day, count) -> count - getMaxDailyLessons(classId))
            .asConstraint("maxDailyLessonsPerClass");
    }

    /** HC-9: Teacher minimum weekly load must be satisfied */
    private Constraint teacherMinWeeklyLoad(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(l -> l.getLessonSlot() != null)
            .groupBy(Lesson::getTeacherId, ConstraintCollectors.count())
            .filter((teacherId, count) -> count < getTeacherMinLoad(teacherId))
            .penalize(HardSoftScore.ONE_HARD,
                (teacherId, count) -> getTeacherMinLoad(teacherId) - count)
            .asConstraint("teacherMinWeeklyLoad");
    }

    // ─── SOFT CONSTRAINTS ────────────────────────────────────────────────────

    /** SC-1: Minimize gaps between lessons for teachers */
    private Constraint teacherGapMinimization(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                Joiners.equal(Lesson::getTeacherId),
                Joiners.equal(l -> l.getLessonSlot().getDayOfWeek()))
            .filter((l1, l2) -> l1.getLessonSlot() != null && l2.getLessonSlot() != null)
            .penalize(HardSoftScore.ONE_SOFT,
                (l1, l2) -> calculateGap(l1.getLessonSlot(), l2.getLessonSlot()))
            .asConstraint("teacherGapMinimization");
    }

    /** SC-2: Minimize student gaps within a day */
    private Constraint studentGapMinimization(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                Joiners.equal(Lesson::getStudentClassId),
                Joiners.equal(l -> l.getLessonSlot().getDayOfWeek()))
            .filter((l1, l2) -> l1.getLessonSlot() != null && l2.getLessonSlot() != null)
            .penalize(HardSoftScore.ONE_SOFT,
                (l1, l2) -> calculateGap(l1.getLessonSlot(), l2.getLessonSlot()))
            .asConstraint("studentGapMinimization");
    }

    /** SC-3: Distribute subjects evenly across weekdays */
    private Constraint distributeSubjectsEvenly(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(l -> l.getLessonSlot() != null)
            .groupBy(Lesson::getStudentClassId,
                     Lesson::getSubjectId,
                     l -> l.getLessonSlot().getDayOfWeek(),
                     ConstraintCollectors.count())
            .filter((classId, subjectId, day, count) -> count > 1)
            .penalize(HardSoftScore.ofSoft(5), (classId, subjectId, day, count) -> count - 1)
            .asConstraint("distributeSubjectsEvenly");
    }

    /** SC-4: Core subjects (Math, Physics) should be in morning periods (1-4) */
    private Constraint morningPreferenceForCoreSubjects(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(l -> l.getLessonSlot() != null && l.isCoreSubject())
            .filter(l -> l.getLessonSlot().getPeriodNumber() > 4)
            .penalize(HardSoftScore.ofSoft(3))
            .asConstraint("morningPreferenceForCoreSubjects");
    }

    /** SC-5: Avoid same subject on consecutive days */
    private Constraint avoidConsecutiveSameSubject(ConstraintFactory factory) {
        return factory.forEachUniquePair(Lesson.class,
                Joiners.equal(Lesson::getStudentClassId),
                Joiners.equal(Lesson::getSubjectId))
            .filter((l1, l2) -> l1.getLessonSlot() != null && l2.getLessonSlot() != null
                && areConsecutiveDays(l1.getLessonSlot().getDayOfWeek(),
                                     l2.getLessonSlot().getDayOfWeek()))
            .penalize(HardSoftScore.ofSoft(2))
            .asConstraint("avoidConsecutiveSameSubject");
    }

    /** SC-6: Balance teacher workload across days */
    private Constraint balanceTeacherWorkloadAcrossDays(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(l -> l.getLessonSlot() != null)
            .groupBy(Lesson::getTeacherId,
                     l -> l.getLessonSlot().getDayOfWeek(),
                     ConstraintCollectors.count())
            .filter((teacherId, day, count) -> count > 6)
            .penalize(HardSoftScore.ofSoft(4), (teacherId, day, count) -> count - 6)
            .asConstraint("balanceTeacherWorkload");
    }

    /** SC-7: Prefer teacher's preferred time slots */
    private Constraint preferredTimeSlots(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(l -> l.getLessonSlot() != null && isPreferredSlot(l))
            .reward(HardSoftScore.ofSoft(1))
            .asConstraint("preferredTimeSlots");
    }

    /** SC-8: Maximize classroom utilization (avoid very large rooms for small classes) */
    private Constraint classroomUtilization(ConstraintFactory factory) {
        return factory.forEach(Lesson.class)
            .filter(l -> l.getLessonSlot() != null)
            .filter(l -> l.getLessonSlot().getClassroomCapacity() > getClassStudentCount(l) * 2)
            .penalize(HardSoftScore.ofSoft(1))
            .asConstraint("classroomUtilization");
    }

    // Helper methods (injected via constructor or static maps)
    private boolean isTeacherAvailable(Lesson lesson) { /* ... */ return true; }
    private int getTeacherMaxLoad(UUID teacherId) { /* ... */ return 24; }
    private int getTeacherMinLoad(UUID teacherId) { /* ... */ return 0; }
    private String getClassShift(UUID classId) { /* ... */ return "FIRST"; }
    private int getMaxDailyLessons(UUID classId) { /* ... */ return 7; }
    private int calculateGap(LessonSlot s1, LessonSlot s2) {
        if (!s1.getDayOfWeek().equals(s2.getDayOfWeek())) return 0;
        return Math.max(0, Math.abs(s1.getPeriodNumber() - s2.getPeriodNumber()) - 1);
    }
    private boolean areConsecutiveDays(DayOfWeek d1, DayOfWeek d2) {
        return Math.abs(d1.getValue() - d2.getValue()) == 1;
    }
    private boolean isPreferredSlot(Lesson lesson) { return false; }
    private int getClassStudentCount(Lesson lesson) { return 30; }
}
```

---

## 4. Solver Service

```java
@Service
@RequiredArgsConstructor
public class SolverService {

    private final SolverManager<TimetableSolution, UUID> solverManager;
    private final TimetableMapper timetableMapper;
    private final TimetableRepository timetableRepository;
    private final SolverJobTracker jobTracker;

    @Async
    public CompletableFuture<Void> solve(UUID timetableId, TimetableSolution problem,
                                          int timeLimitSeconds) {
        jobTracker.start(timetableId);

        SolverJob<TimetableSolution, UUID> job = solverManager.solve(
            timetableId,
            problem,
            solution -> handleBestSolution(timetableId, solution)
        );

        return job.getFinalBestSolutionFuture()
            .thenAccept(finalSolution -> {
                saveFinalTimetable(timetableId, finalSolution);
                jobTracker.complete(timetableId);
            })
            .exceptionally(ex -> {
                jobTracker.fail(timetableId, ex.getMessage());
                return null;
            });
    }

    private void handleBestSolution(UUID timetableId, TimetableSolution solution) {
        // Called every time solver finds a better solution
        jobTracker.updateProgress(timetableId, solution.getScore());
    }

    private void saveFinalTimetable(UUID timetableId, TimetableSolution solution) {
        List<TimetableEntry> entries = timetableMapper.toEntries(solution, timetableId);
        QualityScore score = calculateQualityScore(solution.getScore());
        timetableRepository.saveEntries(timetableId, entries, score);
    }

    private QualityScore calculateQualityScore(HardSoftScore score) {
        if (score.hardScore() < 0) {
            return QualityScore.withViolations(score.hardScore(), score.softScore());
        }
        // 0-100 score based on soft score
        double normalized = Math.max(0, 100 + (score.softScore() / 10.0));
        return QualityScore.of(Math.min(100, normalized), score.hardScore(), score.softScore());
    }

    public SolverJobStatus getStatus(UUID timetableId) {
        return jobTracker.getStatus(timetableId);
    }

    public void stopSolver(UUID timetableId) {
        solverManager.terminateEarly(timetableId);
    }
}
```

---

## 5. Input Data Preparation

```java
@Component
@RequiredArgsConstructor
public class TimetableProblemLoader {

    public TimetableSolution loadProblem(UUID semesterId, UUID schoolId,
                                          List<UUID> classIds) {
        // 1. Load all lesson slots (day × period × classroom combos)
        List<LessonSlot> slots = buildLessonSlots(schoolId);

        // 2. Load lessons from curriculum items
        List<Lesson> lessons = buildLessons(semesterId, classIds);

        // 3. Load supporting facts
        List<TeacherFact> teachers = loadTeacherFacts(schoolId);
        List<StudentClassFact> classes = loadClassFacts(semesterId, classIds);
        List<ClassroomFact> classrooms = loadClassroomFacts(schoolId);

        TimetableSolution solution = new TimetableSolution();
        solution.setLessonSlots(slots);
        solution.setLessons(lessons);
        solution.setTeachers(teachers);
        solution.setStudentClasses(classes);
        solution.setClassrooms(classrooms);

        return solution;
    }

    private List<Lesson> buildLessons(UUID semesterId, List<UUID> classIds) {
        // For each curriculum item with weeklyHours=5, create 5 Lesson instances
        return curriculumRepository.findBySemesterAndClasses(semesterId, classIds)
            .stream()
            .flatMap(item -> IntStream.range(0, item.getWeeklyHours())
                .mapToObj(i -> new Lesson(
                    UUID.randomUUID(),
                    item.getSubjectId(),
                    item.getSubjectName(),
                    item.getStudentClassId(),
                    item.getStudentClassName(),
                    item.getTeacherId(),
                    item.getTeacherName(),
                    item.getRequiredClassroomTypeCode(),
                    i + 1,
                    false   // not pinned
                ))
            )
            .collect(Collectors.toList());
    }

    private List<LessonSlot> buildLessonSlots(UUID schoolId) {
        List<LessonPeriod> periods = lessonPeriodRepository.findBySchool(schoolId);
        List<Classroom> classrooms = classroomRepository.findActiveBySchool(schoolId);
        SchoolSettings settings = settingsRepository.findBySchool(schoolId);

        return settings.getWorkingDays().stream()
            .flatMap(day -> periods.stream()
                .flatMap(period -> classrooms.stream()
                    .map(room -> new LessonSlot(
                        UUID.randomUUID(),
                        DayOfWeek.valueOf(day),
                        period.getPeriodNumber(),
                        room.getId(),
                        room.getClassroomTypeCode(),
                        room.getCapacity(),
                        period.getShift(),
                        period.getStartTime(),
                        period.getEndTime()
                    ))
                )
            )
            .collect(Collectors.toList());
    }
}
```

---

## 6. Quality Score Calculation

```
Score = 100 × (1 - |softPenalties| / maxPossiblePenalties)

Hard violations reduce score drastically:
  hard_score = 0       → valid timetable (can be published)
  hard_score < 0       → invalid (cannot publish)

Score bands:
  90-100: Excellent (optimal distribution)
  75-89:  Good (minor soft violations)
  60-74:  Acceptable (some gaps/imbalances)
  40-59:  Poor (significant issues)
  0-39:   Unacceptable (major hard violations)
```
