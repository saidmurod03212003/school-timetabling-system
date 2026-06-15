package uz.edu.timetable.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "timetables",
    indexes = {
        @Index(name = "idx_timetables_school_semester", columnList = "school_id, semester_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "semester_id", nullable = false)
    private UUID semesterId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TimetableStatus status;

    @Column(name = "generation_started_at")
    private Instant generationStartedAt;

    @Column(name = "generation_completed_at")
    private Instant generationCompletedAt;

    @Column(name = "solver_duration_seconds")
    private Integer solverDurationSeconds;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "published_by")
    private UUID publishedBy;

    @OneToMany(mappedBy = "timetable", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TimetableEntryJpaEntity> entries = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "created_by")
    private UUID createdBy;

    public enum TimetableStatus {
        DRAFT, GENERATING, GENERATED, PUBLISHED, ARCHIVED, FAILED
    }
}
