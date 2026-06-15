package uz.edu.timetable.infrastructure.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "teachers",
    indexes = {
        @Index(name = "idx_teachers_school_id", columnList = "school_id"),
        @Index(name = "idx_teachers_email", columnList = "email")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "short_name", length = 50)
    private String shortName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "employment_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    @Column(name = "min_weekly_load", nullable = false)
    private int minWeeklyLoad;

    @Column(name = "max_weekly_load", nullable = false)
    private int maxWeeklyLoad;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @JsonIgnore
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TeacherSubjectJpaEntity> teacherSubjects = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<TeacherAvailabilityJpaEntity> availability = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public enum EmploymentType { FULL_TIME, PART_TIME }
}
