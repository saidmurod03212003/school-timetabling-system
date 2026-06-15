package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.ClassSubjectJpaEntity;
import uz.edu.timetable.infrastructure.persistence.entity.StudentClassJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.ClassSubjectJpaRepository;
import uz.edu.timetable.infrastructure.persistence.repository.StudentClassJpaRepository;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class StudentClassController {

    private final StudentClassJpaRepository classRepo;
    private final ClassSubjectJpaRepository classSubjectRepo;

    public record ClassRequest(
        @NotNull UUID schoolId,
        @NotNull UUID academicYearId,
        @NotBlank String name,
        @NotNull Integer gradeLevel,
        @NotBlank String section,
        Integer studentCount,
        String shift
    ) {}

    public record SubjectItem(@NotNull UUID subjectId, int weeklyHours) {}

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentClassJpaEntity>>> list(
            @RequestParam(required = false) UUID schoolId,
            @RequestParam(required = false) UUID academicYearId) {
        List<StudentClassJpaEntity> classes;
        if (schoolId != null && academicYearId != null) {
            classes = classRepo.findAllBySchoolIdAndAcademicYearId(schoolId, academicYearId);
        } else if (schoolId != null) {
            classes = classRepo.findAllBySchoolId(schoolId);
        } else {
            classes = classRepo.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(classes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentClassJpaEntity>> get(@PathVariable UUID id) {
        return classRepo.findById(id)
            .map(c -> ResponseEntity.ok(ApiResponse.ok(c)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentClassJpaEntity>> create(@Valid @RequestBody ClassRequest req) {
        StudentClassJpaEntity studentClass = StudentClassJpaEntity.builder()
            .schoolId(req.schoolId())
            .academicYearId(req.academicYearId())
            .name(req.name())
            .gradeLevel(req.gradeLevel())
            .section(req.section())
            .studentCount(req.studentCount() != null ? req.studentCount() : 0)
            .shift(req.shift() != null ? req.shift() : "FIRST")
            .isActive(true)
            .build();
        return ResponseEntity.ok(ApiResponse.ok(classRepo.save(studentClass)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentClassJpaEntity>> update(
            @PathVariable UUID id, @Valid @RequestBody ClassRequest req) {
        return classRepo.findById(id).map(c -> {
            c.setName(req.name());
            c.setGradeLevel(req.gradeLevel());
            c.setSection(req.section());
            if (req.studentCount() != null) c.setStudentCount(req.studentCount());
            if (req.shift() != null) c.setShift(req.shift());
            return ResponseEntity.ok(ApiResponse.ok(classRepo.save(c)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        return classRepo.findById(id).map(c -> {
            classRepo.delete(c);
            return ResponseEntity.ok(ApiResponse.<Void>ok(null));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ─── Subject management ───────────────────────────────────────────────

    @GetMapping("/{id}/subjects")
    public ResponseEntity<ApiResponse<List<ClassSubjectJpaEntity>>> getSubjects(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(classSubjectRepo.findAllByClassId(id)));
    }

    @Transactional
    @PutMapping("/{id}/subjects")
    public ResponseEntity<ApiResponse<List<ClassSubjectJpaEntity>>> setSubjects(
            @PathVariable UUID id,
            @RequestBody List<SubjectItem> items) {
        classSubjectRepo.deleteAllByClassId(id);
        List<ClassSubjectJpaEntity> saved = items.stream()
            .map(item -> classSubjectRepo.save(ClassSubjectJpaEntity.builder()
                .classId(id)
                .subjectId(item.subjectId())
                .weeklyHours(item.weeklyHours() > 0 ? item.weeklyHours() : 1)
                .build()))
            .toList();
        return ResponseEntity.ok(ApiResponse.ok(saved));
    }
}
