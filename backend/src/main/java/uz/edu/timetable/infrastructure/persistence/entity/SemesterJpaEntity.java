package uz.edu.timetable.infrastructure.persistence.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "semesters")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SemesterJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "academic_year_id", nullable = false)
    private UUID academicYearId;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "semester_number", nullable = false)
    private int semesterNumber;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @JsonProperty("isCurrent")
    @Column(name = "is_current", nullable = false)
    private boolean isCurrent;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
