# Timetable Optimization Logic
## Algorithmic Design and Constraint Processing

---

## 1. Optimization Strategy

### 1.1 Two-Phase Approach

```
Phase 1: Construction Heuristic (FIRST_FIT_DECREASING)
    Goal: Find ANY valid (all-hard-constraints-satisfied) solution fast
    Strategy: Assign lessons in order of most-constrained first

    Ordering priority:
    1. Classes with most constraints first
    2. Subjects requiring specialized rooms first
    3. Teachers with narrow availability windows first
    4. Subjects with higher weekly hours first

Phase 2: Local Search (TABU SEARCH)
    Goal: Improve soft constraint score while maintaining hard constraints
    Move types:
    - ChangeMove:    Assign lesson to different LessonSlot
    - SwapMove:      Swap two lessons' LessonSlots
    - PillarChangeMove: Move multiple lessons of same class/teacher together
```

### 1.2 Search Space Analysis

```
For a typical school:
  Classes:    30
  Subjects per class: 8 avg
  Weekly hours per subject: 4 avg
  Working days: 5
  Periods per day: 6
  Classrooms: 20

Lessons to assign: 30 × 8 × 4 = 960 lessons
Possible slots: 5 × 6 × 20 = 600 slots

Search space = 600^960 ≈ 10^2500 (astronomically large)
→ Exhaustive search is impossible
→ Solver uses intelligent heuristics to navigate efficiently
```

---

## 2. Constraint Weight Configuration

```java
// Hard constraints (violation = -∞ effectively)
private static final int HARD_TEACHER_CONFLICT       = -1_000_000;
private static final int HARD_CLASS_CONFLICT         = -1_000_000;
private static final int HARD_ROOM_CONFLICT          = -1_000_000;
private static final int HARD_TEACHER_UNAVAILABLE    = -1_000_000;
private static final int HARD_ROOM_TYPE_MISMATCH     = -1_000_000;
private static final int HARD_MAX_LOAD_EXCEEDED      = -100_000;
private static final int HARD_SHIFT_MISMATCH         = -1_000_000;
private static final int HARD_MAX_DAILY_EXCEEDED     = -100_000;

// Soft constraints (violation reduces score)
private static final int SOFT_TEACHER_GAP            = -10;
private static final int SOFT_STUDENT_GAP            = -8;
private static final int SOFT_UNEVEN_DISTRIBUTION    = -5;
private static final int SOFT_NOT_MORNING_CORE       = -3;
private static final int SOFT_CONSECUTIVE_SAME_SUBJ  = -2;
private static final int SOFT_UNBALANCED_DAY         = -4;
private static final int SOFT_PREFERRED_SLOT         = +1;   // reward
private static final int SOFT_ROOM_TOO_LARGE         = -1;
```

---

## 3. Pre-solver Feasibility Check

Before invoking the solver, validate feasibility:

```java
@Service
public class FeasibilityChecker {

    public FeasibilityReport check(TimetableSolution problem) {
        List<String> errors = new ArrayList<>();

        // 1. Check total required lessons vs available slots
        long totalLessons = problem.getLessons().size();
        long totalSlots = problem.getLessonSlots().size();
        if (totalLessons > totalSlots) {
            errors.add(String.format(
                "Joylashtirish imkonsiz: %d dars uchun faqat %d slot mavjud",
                totalLessons, totalSlots
            ));
        }

        // 2. Check each specialized subject has enough specialized rooms
        Map<String, Long> requiredByType = problem.getLessons().stream()
            .filter(l -> l.getRequiredClassroomTypeCode() != null)
            .collect(Collectors.groupingBy(
                Lesson::getRequiredClassroomTypeCode,
                Collectors.counting()
            ));

        for (Map.Entry<String, Long> entry : requiredByType.entrySet()) {
            long availableSlots = problem.getLessonSlots().stream()
                .filter(s -> entry.getKey().equals(s.getClassroomTypeCode()))
                .count();
            if (entry.getValue() > availableSlots) {
                errors.add(String.format(
                    "%s xonasi uchun %d dars kerak, lekin %d slot mavjud",
                    entry.getKey(), entry.getValue(), availableSlots
                ));
            }
        }

        // 3. Check each teacher is not over-committed
        Map<UUID, Long> teacherLessonCounts = problem.getLessons().stream()
            .collect(Collectors.groupingBy(Lesson::getTeacherId, Collectors.counting()));

        for (TeacherFact teacher : problem.getTeachers()) {
            long count = teacherLessonCounts.getOrDefault(teacher.getId(), 0L);
            if (count > teacher.getMaxWeeklyLoad()) {
                errors.add(String.format(
                    "O'qituvchi %s: %d dars belgilangan, maksimal %d",
                    teacher.getName(), count, teacher.getMaxWeeklyLoad()
                ));
            }
        }

        // 4. Check available slots per teacher matches their lessons
        for (TeacherFact teacher : problem.getTeachers()) {
            long availableSlots = teacher.getAvailableSlotKeys().size()
                                  * problem.getClassrooms().size();
            long requiredLessons = teacherLessonCounts.getOrDefault(teacher.getId(), 0L);
            if (requiredLessons > availableSlots) {
                errors.add(String.format(
                    "O'qituvchi %s: mavjud slot (%d) darslar sonidan (%d) kam",
                    teacher.getName(), availableSlots, requiredLessons
                ));
            }
        }

        return new FeasibilityReport(errors.isEmpty(), errors);
    }
}
```

---

## 4. Incremental Optimization (Delta-Solving)

When the user makes a manual edit, the system doesn't re-run the full solver. Instead:

```java
@Service
public class IncrementalTimetableService {

    /**
     * After a manual move, check only the affected constraints:
     * - Teacher conflicts for the moved lesson's teacher
     * - Class conflicts for the moved lesson's class
     * - Room conflicts for the moved lesson's room
     */
    public ConflictCheckResult checkMove(TimetableEntry moved,
                                          LessonSlot newSlot,
                                          List<TimetableEntry> allEntries) {
        List<ConflictViolation> violations = new ArrayList<>();

        String day = newSlot.getDayOfWeek().name();
        int period = newSlot.getPeriodNumber();
        UUID classroomId = newSlot.getClassroomId();

        // Teacher conflict
        allEntries.stream()
            .filter(e -> !e.getId().equals(moved.getId()))
            .filter(e -> e.getTeacherId().equals(moved.getTeacherId()))
            .filter(e -> e.getDayOfWeek().equals(day))
            .filter(e -> e.getPeriodNumber() == period)
            .findFirst()
            .ifPresent(conflict -> violations.add(
                ConflictViolation.hard("teacherConflict",
                    "O'qituvchi " + moved.getTeacherName() + " ushbu vaqtda band")
            ));

        // Class conflict
        allEntries.stream()
            .filter(e -> !e.getId().equals(moved.getId()))
            .filter(e -> e.getStudentClassId().equals(moved.getStudentClassId()))
            .filter(e -> e.getDayOfWeek().equals(day))
            .filter(e -> e.getPeriodNumber() == period)
            .findFirst()
            .ifPresent(conflict -> violations.add(
                ConflictViolation.hard("classConflict",
                    "Sinf " + moved.getStudentClassName() + " ushbu vaqtda band")
            ));

        // Room conflict
        allEntries.stream()
            .filter(e -> !e.getId().equals(moved.getId()))
            .filter(e -> e.getClassroomId().equals(classroomId))
            .filter(e -> e.getDayOfWeek().equals(day))
            .filter(e -> e.getPeriodNumber() == period)
            .findFirst()
            .ifPresent(conflict -> violations.add(
                ConflictViolation.hard("roomConflict",
                    "Xona " + newSlot.getClassroomName() + " ushbu vaqtda band")
            ));

        // Classroom type match
        if (moved.getRequiredClassroomTypeCode() != null &&
            !moved.getRequiredClassroomTypeCode().equals(newSlot.getClassroomTypeCode())) {
            violations.add(ConflictViolation.hard("classroomTypeMismatch",
                "Bu fan " + moved.getRequiredClassroomTypeCode() + " xonasini talab qiladi"));
        }

        return new ConflictCheckResult(violations);
    }
}
```

---

## 5. Quality Score Breakdown

```
Quality Score = (softPoints / maxSoftPoints) × 100

Components:
├── Teacher Gap Score (20% weight)
│     Score = 1 - (totalTeacherGaps / maxPossibleGaps)
│
├── Student Gap Score (15% weight)
│     Score = 1 - (totalStudentGaps / maxPossibleGaps)
│
├── Distribution Score (25% weight)
│     Score = 1 - (subjectConcentrationViolations / totalSubjects)
│
├── Morning Core Score (15% weight)
│     Score = (coreSubjectsInMorning / totalCoreSubjects)
│
├── Workload Balance Score (15% weight)
│     Score = 1 - (workloadVarianceAcrossDays / maxVariance)
│
└── Preference Score (10% weight)
      Score = (preferredSlotCount / totalLessons)

Total = Σ(component_score × weight)
```

---

## 6. Solver Configuration per Optimization Level

```
FAST (60 seconds):
  - Construction: FIRST_FIT
  - Local search: 60s limit, 30s unimproved limit
  - Use case: Quick preview, small schools

BALANCED (5 minutes):
  - Construction: FIRST_FIT_DECREASING
  - Local search: 300s limit, 60s unimproved limit
  - Use case: Standard daily use

THOROUGH (30 minutes):
  - Construction: FIRST_FIT_DECREASING
  - Local search: 1800s limit, 300s unimproved limit
  - Use case: Beginning of semester, maximum quality needed
```

---

## 7. Parallel Solving (Large Schools)

For schools with 100+ classes, use partition-based solving:

```
Strategy: Partition by grade level, solve in parallel, merge

Partition 1: Grades 1-4  (primary) → Solver instance 1
Partition 2: Grades 5-9  (middle)  → Solver instance 2
Partition 3: Grades 10-11 (senior) → Solver instance 3

Merge step: Resolve cross-partition teacher/room conflicts
```

---

## 8. Undo/Redo Stack

```java
@Component
public class TimetableEditHistory {
    private final Deque<TimetableEdit> undoStack = new ArrayDeque<>();
    private final Deque<TimetableEdit> redoStack = new ArrayDeque<>();
    private static final int MAX_HISTORY = 20;

    public void record(TimetableEdit edit) {
        undoStack.push(edit);
        if (undoStack.size() > MAX_HISTORY) undoStack.pollLast();
        redoStack.clear(); // new action clears redo
    }

    public Optional<TimetableEdit> undo() {
        if (undoStack.isEmpty()) return Optional.empty();
        TimetableEdit edit = undoStack.pop();
        redoStack.push(edit);
        return Optional.of(edit);
    }

    public Optional<TimetableEdit> redo() {
        if (redoStack.isEmpty()) return Optional.empty();
        TimetableEdit edit = redoStack.pop();
        undoStack.push(edit);
        return Optional.of(edit);
    }
}
```
