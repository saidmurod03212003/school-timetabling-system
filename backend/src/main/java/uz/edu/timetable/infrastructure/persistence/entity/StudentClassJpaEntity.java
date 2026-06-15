package uz.edu.timetable.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "student_classes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentClassJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "branch_id")
    private UUID branchId;

    @Column(name = "academic_year_id", nullable = false)
    private UUID academicYearId;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "grade_level", nullable = false)
    private int gradeLevel;

    @Column(name = "section", nullable = false, length = 5)
    private String section;

    @Column(name = "student_count", nullable = false)
    private int studentCount;

    @Column(name = "shift", length = 10)
    private String shift;

    @Column(name = "home_room_id")
    private UUID homeRoomId;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
