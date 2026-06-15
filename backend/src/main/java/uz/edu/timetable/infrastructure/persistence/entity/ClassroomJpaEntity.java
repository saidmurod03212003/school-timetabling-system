package uz.edu.timetable.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "classrooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClassroomJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "branch_id")
    private UUID branchId;

    @Column(name = "classroom_type_id", nullable = false)
    private UUID classroomTypeId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "capacity", nullable = false)
    private int capacity;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "building", length = 50)
    private String building;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "description")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
