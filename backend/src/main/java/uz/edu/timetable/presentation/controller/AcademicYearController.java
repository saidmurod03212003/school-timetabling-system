package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.AcademicYearJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.AcademicYearJpaRepository;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/academic-years")
@RequiredArgsConstructor
public class AcademicYearController {

    private final AcademicYearJpaRepository yearRepo;

    public record YearRequest(
        @NotNull UUID schoolId,
        @NotBlank String name,
        @NotNull LocalDate startDate,
        @NotNull LocalDate endDate,
        Boolean isCurrent
    ) {}

    @GetMapping
    public ResponseEntity<ApiResponse<List<AcademicYearJpaEntity>>> list(
            @RequestParam(required = false) UUID schoolId) {
        List<AcademicYearJpaEntity> years = schoolId != null
            ? yearRepo.findAllBySchoolId(schoolId)
            : yearRepo.findAll();
        return ResponseEntity.ok(ApiResponse.ok(years));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicYearJpaEntity>> get(@PathVariable UUID id) {
        return yearRepo.findById(id)
            .map(y -> ResponseEntity.ok(ApiResponse.ok(y)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AcademicYearJpaEntity>> create(@Valid @RequestBody YearRequest req) {
        AcademicYearJpaEntity year = AcademicYearJpaEntity.builder()
            .schoolId(req.schoolId())
            .name(req.name())
            .startDate(req.startDate())
            .endDate(req.endDate())
            .isCurrent(req.isCurrent() != null && req.isCurrent())
            .build();
        return ResponseEntity.ok(ApiResponse.ok(yearRepo.save(year)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicYearJpaEntity>> update(
            @PathVariable UUID id, @Valid @RequestBody YearRequest req) {
        return yearRepo.findById(id).map(year -> {
            year.setName(req.name());
            year.setStartDate(req.startDate());
            year.setEndDate(req.endDate());
            if (req.isCurrent() != null) year.setCurrent(req.isCurrent());
            return ResponseEntity.ok(ApiResponse.ok(yearRepo.save(year)));
        }).orElse(ResponseEntity.notFound().build());
    }
}
