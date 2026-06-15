package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.ClassroomJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.ClassroomJpaRepository;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classrooms")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomJpaRepository classroomRepo;

    public record ClassroomRequest(
        @NotNull UUID schoolId,
        @NotNull UUID classroomTypeId,
        @NotBlank String name,
        Integer capacity,
        Integer floor,
        String building
    ) {}

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassroomJpaEntity>>> list(
            @RequestParam(required = false) UUID schoolId) {
        List<ClassroomJpaEntity> classrooms = schoolId != null
            ? classroomRepo.findAllBySchoolIdAndDeletedAtIsNull(schoolId)
            : classroomRepo.findAll().stream().filter(c -> c.getDeletedAt() == null).toList();
        return ResponseEntity.ok(ApiResponse.ok(classrooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassroomJpaEntity>> get(@PathVariable UUID id) {
        return classroomRepo.findByIdAndDeletedAtIsNull(id)
            .map(c -> ResponseEntity.ok(ApiResponse.ok(c)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClassroomJpaEntity>> create(@Valid @RequestBody ClassroomRequest req) {
        ClassroomJpaEntity classroom = ClassroomJpaEntity.builder()
            .schoolId(req.schoolId())
            .classroomTypeId(req.classroomTypeId())
            .name(req.name())
            .capacity(req.capacity() != null ? req.capacity() : 30)
            .floor(req.floor())
            .building(req.building())
            .status("ACTIVE")
            .build();
        return ResponseEntity.ok(ApiResponse.ok(classroomRepo.save(classroom)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassroomJpaEntity>> update(
            @PathVariable UUID id, @Valid @RequestBody ClassroomRequest req) {
        return classroomRepo.findByIdAndDeletedAtIsNull(id).map(c -> {
            c.setName(req.name());
            if (req.capacity() != null) c.setCapacity(req.capacity());
            if (req.floor() != null) c.setFloor(req.floor());
            if (req.building() != null) c.setBuilding(req.building());
            return ResponseEntity.ok(ApiResponse.ok(classroomRepo.save(c)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        return classroomRepo.findByIdAndDeletedAtIsNull(id).map(c -> {
            c.setDeletedAt(Instant.now());
            classroomRepo.save(c);
            return ResponseEntity.ok(ApiResponse.<Void>ok(null));
        }).orElse(ResponseEntity.notFound().build());
    }
}
