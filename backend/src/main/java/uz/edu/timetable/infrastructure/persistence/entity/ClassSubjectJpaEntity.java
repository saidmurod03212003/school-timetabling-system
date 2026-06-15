package uz.edu.timetable.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "class_subjects",
    uniqueConstraints = @UniqueConstraint(columnNames = {"class_id", "subject_id"}),
    indexes = {
        @Index(name = "idx_class_subjects_class",   columnList = "class_id"),
        @Index(name = "idx_class_subjects_subject", columnList = "subject_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassSubjectJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "class_id", nullable = false)
    private UUID classId;

    @Column(name = "subject_id", nullable = false)
    private UUID subjectId;

    @Column(name = "weekly_hours", nullable = false)
    private int weeklyHours;
}
