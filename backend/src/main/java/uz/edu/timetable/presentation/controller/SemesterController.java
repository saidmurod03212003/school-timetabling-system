package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.SemesterJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.SemesterJpaRepository;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/semesters")
@RequiredArgsConstructor
public class SemesterController {

    private final SemesterJpaRepository semesterRepo;

    public record SemesterRequest(
        @NotNull UUID schoolId,
        @NotNull UUID academicYearId,
        @NotBlank String name,
        @NotNull Integer semesterNumber,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        Boolean isCurrent
    ) {}

    @GetMapping
    public ResponseEntity<ApiResponse<List<SemesterJpaEntity>>> list(
            @RequestParam(required = false) UUID schoolId,
            @RequestParam(required = false) UUID academicYearId) {
        List<SemesterJpaEntity> semesters;
        if (academicYearId != null) {
            semesters = semesterRepo.findAllByAcademicYearId(academicYearId);
        } else if (schoolId != null) {
            semesters = semesterRepo.findAllBySchoolId(schoolId);
        } else {
            semesters = semesterRepo.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(semesters));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SemesterJpaEntity>> get(@PathVariable UUID id) {
        return semesterRepo.findById(id)
            .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SemesterJpaEntity>> create(@Valid @RequestBody SemesterRequest req) {
        SemesterJpaEntity semester = SemesterJpaEntity.builder()
            .schoolId(req.schoolId())
            .academicYearId(req.academicYearId())
            .name(req.name())
            .semesterNumber(req.semesterNumber())
            .startDate(req.startDate())
            .endDate(req.endDate())
            .isCurrent(req.isCurrent() != null && req.isCurrent())
            .build();
        return ResponseEntity.ok(ApiResponse.ok(semesterRepo.save(semester)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SemesterJpaEntity>> update(
            @PathVariable UUID id, @Valid @RequestBody SemesterRequest req) {
        return semesterRepo.findById(id).map(s -> {
            s.setName(req.name());
            s.setStartDate(req.startDate());
            s.setEndDate(req.endDate());
            if (req.isCurrent() != null) s.setCurrent(req.isCurrent());
            return ResponseEntity.ok(ApiResponse.ok(semesterRepo.save(s)));
        }).orElse(ResponseEntity.notFound().build());
    }
}
