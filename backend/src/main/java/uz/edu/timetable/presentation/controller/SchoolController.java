package uz.edu.timetable.presentation.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.edu.timetable.infrastructure.persistence.entity.SchoolJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.SchoolJpaRepository;
import uz.edu.timetable.presentation.dto.response.ApiResponse;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolJpaRepository schoolRepo;

    public record SchoolRequest(
        @NotBlank String name,
        String shortName,
        String address,
        String phone,
        String email,
        String region,
        String district,
        String schoolType
    ) {}

    @GetMapping
    public ResponseEntity<ApiResponse<List<SchoolJpaEntity>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(schoolRepo.findAllByDeletedAtIsNull()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolJpaEntity>> get(@PathVariable UUID id) {
        return schoolRepo.findByIdAndDeletedAtIsNull(id)
            .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SchoolJpaEntity>> create(@Valid @RequestBody SchoolRequest req) {
        SchoolJpaEntity school = SchoolJpaEntity.builder()
            .name(req.name())
            .shortName(req.shortName())
            .address(req.address())
            .phone(req.phone())
            .email(req.email())
            .region(req.region())
            .district(req.district())
            .schoolType(req.schoolType() != null ? req.schoolType() : "SECONDARY")
            .isActive(true)
            .build();
        return ResponseEntity.ok(ApiResponse.ok(schoolRepo.save(school)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SchoolJpaEntity>> update(
            @PathVariable UUID id, @Valid @RequestBody SchoolRequest req) {
        return schoolRepo.findByIdAndDeletedAtIsNull(id).map(school -> {
            school.setName(req.name());
            if (req.shortName() != null) school.setShortName(req.shortName());
            if (req.address() != null) school.setAddress(req.address());
            if (req.phone() != null) school.setPhone(req.phone());
            if (req.email() != null) school.setEmail(req.email());
            if (req.region() != null) school.setRegion(req.region());
            if (req.district() != null) school.setDistrict(req.district());
            return ResponseEntity.ok(ApiResponse.ok(schoolRepo.save(school)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        return schoolRepo.findByIdAndDeletedAtIsNull(id).map(school -> {
            school.setDeletedAt(Instant.now());
            schoolRepo.save(school);
            return ResponseEntity.ok(ApiResponse.<Void>ok(null));
        }).orElse(ResponseEntity.notFound().build());
    }
}
