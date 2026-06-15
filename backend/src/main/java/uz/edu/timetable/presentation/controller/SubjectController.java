package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.SubjectJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.SubjectJpaRepository;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectJpaRepository subjectRepo;

    public record SubjectRequest(
        @NotNull UUID schoolId,
        @NotBlank String name,
        @NotBlank String code,
        String color,
        Boolean isCore
    ) {}

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectJpaEntity>>> list(
            @RequestParam(required = false) UUID schoolId) {
        List<SubjectJpaEntity> subjects = schoolId != null
            ? subjectRepo.findAllBySchoolIdAndDeletedAtIsNull(schoolId)
            : subjectRepo.findAll().stream().filter(s -> s.getDeletedAt() == null).toList();
        return ResponseEntity.ok(ApiResponse.ok(subjects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectJpaEntity>> get(@PathVariable UUID id) {
        return subjectRepo.findByIdAndDeletedAtIsNull(id)
            .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectJpaEntity>> create(@Valid @RequestBody SubjectRequest req) {
        SubjectJpaEntity subject = SubjectJpaEntity.builder()
            .schoolId(req.schoolId())
            .name(req.name())
            .code(req.code())
            .color(req.color() != null ? req.color() : "#6366f1")
            .isCore(req.isCore() != null ? req.isCore() : true)
            .build();
        return ResponseEntity.ok(ApiResponse.ok(subjectRepo.save(subject)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectJpaEntity>> update(
            @PathVariable UUID id, @Valid @RequestBody SubjectRequest req) {
        return subjectRepo.findByIdAndDeletedAtIsNull(id).map(subject -> {
            subject.setName(req.name());
            subject.setCode(req.code());
            if (req.color() != null) subject.setColor(req.color());
            if (req.isCore() != null) subject.setCore(req.isCore());
            return ResponseEntity.ok(ApiResponse.ok(subjectRepo.save(subject)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        return subjectRepo.findByIdAndDeletedAtIsNull(id).map(subject -> {
            subject.setDeletedAt(Instant.now());
            subjectRepo.save(subject);
            return ResponseEntity.ok(ApiResponse.<Void>ok(null));
        }).orElse(ResponseEntity.notFound().build());
    }
}
