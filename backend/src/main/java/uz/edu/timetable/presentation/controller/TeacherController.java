package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.TeacherJpaEntity;
import uz.edu.timetable.infrastructure.persistence.entity.TeacherSubjectJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.TeacherJpaRepository;
import uz.edu.timetable.infrastructure.persistence.repository.TeacherSubjectJpaRepository;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherJpaRepository teacherRepo;
    private final TeacherSubjectJpaRepository teacherSubjectRepo;

    public record TeacherRequest(
        @NotNull UUID schoolId,
        @NotBlank String fullName,
        String shortName,
        String phone,
        String email,
        String employmentType,
        Integer minWeeklyLoad,
        Integer maxWeeklyLoad
    ) {}

    public record SubjectItem(@NotNull UUID subjectId, boolean isPrimary) {}

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeacherJpaEntity>>> list(
            @RequestParam(required = false) UUID schoolId) {
        List<TeacherJpaEntity> teachers = schoolId != null
            ? teacherRepo.findAllBySchoolIdAndDeletedAtIsNull(schoolId)
            : teacherRepo.findAll().stream().filter(t -> t.getDeletedAt() == null).toList();
        return ResponseEntity.ok(ApiResponse.ok(teachers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherJpaEntity>> get(@PathVariable UUID id) {
        return teacherRepo.findByIdAndDeletedAtIsNull(id)
            .map(t -> ResponseEntity.ok(ApiResponse.ok(t)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TeacherJpaEntity>> create(@Valid @RequestBody TeacherRequest req) {
        TeacherJpaEntity teacher = TeacherJpaEntity.builder()
            .schoolId(req.schoolId())
            .fullName(req.fullName())
            .shortName(req.shortName())
            .phone(req.phone())
            .email(req.email())
            .employmentType(req.employmentType() != null
                ? TeacherJpaEntity.EmploymentType.valueOf(req.employmentType())
                : TeacherJpaEntity.EmploymentType.FULL_TIME)
            .minWeeklyLoad(req.minWeeklyLoad() != null ? req.minWeeklyLoad() : 0)
            .maxWeeklyLoad(req.maxWeeklyLoad() != null ? req.maxWeeklyLoad() : 24)
            .isActive(true)
            .build();
        return ResponseEntity.ok(ApiResponse.ok(teacherRepo.save(teacher)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherJpaEntity>> update(
            @PathVariable UUID id, @Valid @RequestBody TeacherRequest req) {
        return teacherRepo.findByIdAndDeletedAtIsNull(id).map(teacher -> {
            teacher.setFullName(req.fullName());
            if (req.shortName() != null) teacher.setShortName(req.shortName());
            if (req.phone() != null) teacher.setPhone(req.phone());
            if (req.email() != null) teacher.setEmail(req.email());
            if (req.minWeeklyLoad() != null) teacher.setMinWeeklyLoad(req.minWeeklyLoad());
            if (req.maxWeeklyLoad() != null) teacher.setMaxWeeklyLoad(req.maxWeeklyLoad());
            return ResponseEntity.ok(ApiResponse.ok(teacherRepo.save(teacher)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        return teacherRepo.findByIdAndDeletedAtIsNull(id).map(teacher -> {
            teacher.setDeletedAt(Instant.now());
            teacherRepo.save(teacher);
            return ResponseEntity.ok(ApiResponse.<Void>ok(null));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ─── Subject management ───────────────────────────────────────────────

    @GetMapping("/{id}/subjects")
    public ResponseEntity<ApiResponse<List<TeacherSubjectJpaEntity>>> getSubjects(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(teacherSubjectRepo.findAllByTeacher_Id(id)));
    }

    @Transactional
    @PutMapping("/{id}/subjects")
    public ResponseEntity<ApiResponse<List<TeacherSubjectJpaEntity>>> setSubjects(
            @PathVariable UUID id,
            @RequestBody List<SubjectItem> items) {
        return teacherRepo.findByIdAndDeletedAtIsNull(id).map(teacher -> {
            teacherSubjectRepo.deleteAllByTeacherId(id);
            List<TeacherSubjectJpaEntity> saved = items.stream()
                .map(item -> teacherSubjectRepo.save(TeacherSubjectJpaEntity.builder()
                    .teacher(teacher)
                    .subjectId(item.subjectId())
                    .isPrimary(item.isPrimary())
                    .build()))
                .toList();
            return ResponseEntity.ok(ApiResponse.ok(saved));
        }).orElse(ResponseEntity.notFound().build());
    }
}
