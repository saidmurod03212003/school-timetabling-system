package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.LessonPeriodJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.LessonPeriodJpaRepository;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lesson-periods")
@RequiredArgsConstructor
public class LessonPeriodController {

    private final LessonPeriodJpaRepository periodRepo;

    public record PeriodRequest(
        @NotNull UUID schoolId,
        String shift,
        @NotNull Integer periodNumber,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime
    ) {}

    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonPeriodJpaEntity>>> list(
            @RequestParam(required = false) UUID schoolId) {
        List<LessonPeriodJpaEntity> periods = schoolId != null
            ? periodRepo.findAllBySchoolIdOrderByShiftAscPeriodNumberAsc(schoolId)
            : periodRepo.findAll();
        return ResponseEntity.ok(ApiResponse.ok(periods));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonPeriodJpaEntity>> get(@PathVariable UUID id) {
        return periodRepo.findById(id)
            .map(p -> ResponseEntity.ok(ApiResponse.ok(p)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LessonPeriodJpaEntity>> create(@Valid @RequestBody PeriodRequest req) {
        LessonPeriodJpaEntity period = LessonPeriodJpaEntity.builder()
            .schoolId(req.schoolId())
            .shift(req.shift() != null ? req.shift() : "FIRST")
            .periodNumber(req.periodNumber())
            .startTime(req.startTime())
            .endTime(req.endTime())
            .isActive(true)
            .build();
        return ResponseEntity.ok(ApiResponse.ok(periodRepo.save(period)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonPeriodJpaEntity>> update(
            @PathVariable UUID id, @Valid @RequestBody PeriodRequest req) {
        return periodRepo.findById(id).map(p -> {
            p.setPeriodNumber(req.periodNumber());
            p.setStartTime(req.startTime());
            p.setEndTime(req.endTime());
            if (req.shift() != null) p.setShift(req.shift());
            return ResponseEntity.ok(ApiResponse.ok(periodRepo.save(p)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        return periodRepo.findById(id).map(p -> {
            periodRepo.delete(p);
            return ResponseEntity.ok(ApiResponse.<Void>ok(null));
        }).orElse(ResponseEntity.notFound().build());
    }
}
