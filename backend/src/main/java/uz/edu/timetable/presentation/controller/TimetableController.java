package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.*;
import uz.edu.timetable.infrastructure.persistence.entity.TimetableJpaEntity.TimetableStatus;
import uz.edu.timetable.infrastructure.persistence.repository.*;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/schools/{schoolId}/timetables")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableJpaRepository      timetableRepo;
    private final TimetableEntryJpaRepository entryRepo;
    private final SubjectJpaRepository        subjectRepo;
    private final TeacherJpaRepository        teacherRepo;
    private final ClassroomJpaRepository      classroomRepo;
    private final StudentClassJpaRepository   classRepo;
    private final LessonPeriodJpaRepository   periodRepo;
    private final ClassSubjectJpaRepository   classSubjectRepo;
    private final TeacherSubjectJpaRepository teacherSubjectRepo;

    private static final String[] DAYS = {
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"
    };

    public record GenerateRequest(
        @NotNull UUID semesterId,
        @NotBlank String name,
        Integer solverDurationSeconds,
        String optimizationLevel
    ) {}

    public record EntryDto(
        UUID   id,
        UUID   studentClassId,
        String className,
        UUID   subjectId,
        String subjectName,
        String subjectColor,
        UUID   teacherId,
        String teacherName,
        UUID   classroomId,
        String classroomName,
        String dayOfWeek,
        int    periodNumber,
        String startTime,
        String endTime
    ) {}

    @GetMapping
    public ResponseEntity<ApiResponse<List<TimetableJpaEntity>>> list(
            @PathVariable UUID schoolId,
            @RequestParam(required = false) UUID semesterId) {
        List<TimetableJpaEntity> timetables = semesterId != null
            ? timetableRepo.findBySchoolIdAndSemesterIdOrderByCreatedAtDesc(schoolId, semesterId)
            : timetableRepo.findBySchoolIdAndStatusNotOrderByCreatedAtDesc(schoolId, TimetableStatus.ARCHIVED);
        return ResponseEntity.ok(ApiResponse.ok(timetables));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TimetableJpaEntity>> get(
            @PathVariable UUID schoolId, @PathVariable UUID id) {
        return timetableRepo.findBySchoolIdAndId(schoolId, id)
            .map(t -> ResponseEntity.ok(ApiResponse.ok(t)))
            .orElse(ResponseEntity.notFound().build());
    }

    @Transactional
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generate(
            @PathVariable UUID schoolId,
            @Valid @RequestBody GenerateRequest req) {

        TimetableJpaEntity timetable = TimetableJpaEntity.builder()
            .schoolId(schoolId)
            .semesterId(req.semesterId())
            .name(req.name())
            .status(TimetableStatus.GENERATED)
            .solverDurationSeconds(req.solverDurationSeconds() != null ? req.solverDurationSeconds() : 300)
            .build();
        TimetableJpaEntity saved = timetableRepo.save(timetable);

        generateDemoEntries(saved, schoolId);

        Map<String, Object> result = Map.of(
            "timetableId", saved.getId().toString(),
            "status", saved.getStatus().name()
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus(
            @PathVariable UUID schoolId, @PathVariable UUID id) {
        return timetableRepo.findBySchoolIdAndId(schoolId, id)
            .map(t -> {
                Map<String, Object> status = Map.of(
                    "status", t.getStatus().name(),
                    "progressPercent", 100,
                    "elapsedSeconds", 0
                );
                return ResponseEntity.ok(ApiResponse.ok(status));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/entries")
    public ResponseEntity<ApiResponse<List<EntryDto>>> entries(
            @PathVariable UUID schoolId, @PathVariable UUID id) {
        List<TimetableEntryJpaEntity> raw = entryRepo.findByTimetable_Id(id);

        Map<UUID, SubjectJpaEntity>      subjects   = subjectRepo.findAllBySchoolIdAndDeletedAtIsNull(schoolId).stream()
            .collect(Collectors.toMap(SubjectJpaEntity::getId, s -> s));
        Map<UUID, String>                teachers   = teacherRepo.findAllBySchoolIdAndDeletedAtIsNull(schoolId).stream()
            .collect(Collectors.toMap(TeacherJpaEntity::getId, TeacherJpaEntity::getFullName));
        Map<UUID, String>                classrooms = classroomRepo.findAllBySchoolIdAndDeletedAtIsNull(schoolId).stream()
            .collect(Collectors.toMap(ClassroomJpaEntity::getId, ClassroomJpaEntity::getName));
        Map<UUID, String>                classes    = classRepo.findAllBySchoolId(schoolId).stream()
            .collect(Collectors.toMap(StudentClassJpaEntity::getId, StudentClassJpaEntity::getName));
        Map<UUID, LessonPeriodJpaEntity> periods    = periodRepo.findAllBySchoolIdOrderByShiftAscPeriodNumberAsc(schoolId).stream()
            .collect(Collectors.toMap(LessonPeriodJpaEntity::getId, p -> p));

        List<EntryDto> dtos = raw.stream().map(e -> {
            SubjectJpaEntity      sub    = subjects.get(e.getSubjectId());
            LessonPeriodJpaEntity period = periods.get(e.getLessonPeriodId());
            return new EntryDto(
                e.getId(),
                e.getStudentClassId(),
                classes.getOrDefault(e.getStudentClassId(), "?"),
                e.getSubjectId(),
                sub != null ? sub.getName() : "?",
                sub != null && sub.getColor() != null ? sub.getColor() : "#6366f1",
                e.getTeacherId(),
                teachers.getOrDefault(e.getTeacherId(), "?"),
                e.getClassroomId(),
                classrooms.getOrDefault(e.getClassroomId(), "?"),
                e.getDayOfWeek(),
                e.getPeriodNumber(),
                period != null ? period.getStartTime().toString() : "",
                period != null ? period.getEndTime().toString() : ""
            );
        }).toList();

        return ResponseEntity.ok(ApiResponse.ok(dtos));
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<Void>> publish(
            @PathVariable UUID schoolId, @PathVariable UUID id) {
        return timetableRepo.findBySchoolIdAndId(schoolId, id)
            .map(t -> {
                t.setStatus(TimetableStatus.PUBLISHED);
                t.setPublishedAt(Instant.now());
                timetableRepo.save(t);
                return ResponseEntity.ok(ApiResponse.<Void>ok(null));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/violations")
    public ResponseEntity<ApiResponse<List<Object>>> violations(
            @PathVariable UUID schoolId, @PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(List.of()));
    }

    @GetMapping("/{id}/quality-score")
    public ResponseEntity<ApiResponse<Map<String, Object>>> qualityScore(
            @PathVariable UUID schoolId, @PathVariable UUID id) {
        Map<String, Object> score = Map.of(
            "overallScore", 0, "hardScore", 0, "softScore", 0,
            "hardConstraintViolations", 0, "softConstraintPenalties", 0
        );
        return ResponseEntity.ok(ApiResponse.ok(score));
    }

    // ─── Demo generation ─────────────────────────────────────────────────────

    private void generateDemoEntries(TimetableJpaEntity timetable, UUID schoolId) {
        List<StudentClassJpaEntity>   classes    = classRepo.findAllBySchoolId(schoolId);
        List<SubjectJpaEntity>        subjects   = subjectRepo.findAllBySchoolIdAndDeletedAtIsNull(schoolId);
        List<TeacherJpaEntity>        teachers   = teacherRepo.findAllBySchoolIdAndDeletedAtIsNull(schoolId);
        List<ClassroomJpaEntity>      classrooms = classroomRepo.findAllBySchoolIdAndDeletedAtIsNull(schoolId);
        List<LessonPeriodJpaEntity>   periods    = periodRepo.findAllBySchoolIdOrderByShiftAscPeriodNumberAsc(schoolId);

        if (classes.isEmpty() || subjects.isEmpty() || teachers.isEmpty()
                || classrooms.isEmpty() || periods.isEmpty()) return;

        // Period number → entity
        Map<Integer, LessonPeriodJpaEntity> periodByNumber = periods.stream()
            .collect(Collectors.toMap(LessonPeriodJpaEntity::getPeriodNumber, p -> p, (a, b) -> a));

        // Subject → teacher IDs who teach it
        Map<UUID, List<UUID>> subjectTeachers = new HashMap<>();
        for (TeacherJpaEntity t : teachers) {
            for (TeacherSubjectJpaEntity ts : teacherSubjectRepo.findAllByTeacher_Id(t.getId())) {
                subjectTeachers.computeIfAbsent(ts.getSubjectId(), k -> new ArrayList<>()).add(t.getId());
            }
        }
        List<UUID> allTeacherIds = teachers.stream().map(TeacherJpaEntity::getId).toList();
        List<UUID> allClassroomIds = classrooms.stream().map(ClassroomJpaEntity::getId).toList();

        // Slot tracking: "DAY-PERIOD" → used teacherIds / classroomIds
        Map<String, Set<UUID>> usedTeachers   = new HashMap<>();
        Map<String, Set<UUID>> usedClassrooms = new HashMap<>();

        int maxPeriodsPerDay = Math.min(6, periods.size());

        List<TimetableEntryJpaEntity> entries = new ArrayList<>();

        for (StudentClassJpaEntity cls : classes) {
            // Class subjects (ordered) or fall back to all school subjects
            List<UUID> subjectIds = classSubjectRepo.findAllByClassId(cls.getId()).stream()
                .map(ClassSubjectJpaEntity::getSubjectId).toList();
            if (subjectIds.isEmpty()) {
                subjectIds = subjects.stream().map(SubjectJpaEntity::getId).toList();
            }

            for (String day : DAYS) {
                int periodsToAssign = Math.min(maxPeriodsPerDay, subjectIds.size());
                for (int p = 1; p <= periodsToAssign; p++) {
                    String slotKey = day + "-" + p;
                    UUID subjectId = subjectIds.get((p - 1) % subjectIds.size());

                    // Pick an available teacher who teaches this subject
                    List<UUID> eligible = subjectTeachers.getOrDefault(subjectId, Collections.emptyList());
                    if (eligible.isEmpty()) eligible = allTeacherIds;

                    Set<UUID> takenTeachers   = usedTeachers.getOrDefault(slotKey, Collections.emptySet());
                    Set<UUID> takenClassrooms = usedClassrooms.getOrDefault(slotKey, Collections.emptySet());

                    UUID teacherId = null;
                    for (UUID tid : eligible) {
                        if (!takenTeachers.contains(tid)) { teacherId = tid; break; }
                    }
                    if (teacherId == null) {
                        for (UUID tid : allTeacherIds) {
                            if (!takenTeachers.contains(tid)) { teacherId = tid; break; }
                        }
                    }
                    if (teacherId == null) continue;

                    UUID classroomId = null;
                    for (UUID rid : allClassroomIds) {
                        if (!takenClassrooms.contains(rid)) { classroomId = rid; break; }
                    }
                    if (classroomId == null) continue;

                    LessonPeriodJpaEntity lp = periodByNumber.get(p);
                    if (lp == null) continue;

                    usedTeachers.computeIfAbsent(slotKey, k -> new HashSet<>()).add(teacherId);
                    usedClassrooms.computeIfAbsent(slotKey, k -> new HashSet<>()).add(classroomId);

                    entries.add(TimetableEntryJpaEntity.builder()
                        .timetable(timetable)
                        .schoolId(schoolId)
                        .studentClassId(cls.getId())
                        .subjectId(subjectId)
                        .teacherId(teacherId)
                        .classroomId(classroomId)
                        .dayOfWeek(day)
                        .periodNumber(p)
                        .lessonPeriodId(lp.getId())
                        .isPinned(false)
                        .build());
                }
            }
        }

        entryRepo.saveAll(entries);
    }
}
