package uz.edu.timetable.infrastructure.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "teacher_subjects",
    uniqueConstraints = @UniqueConstraint(columnNames = {"teacher_id", "subject_id"}),
    indexes = {
        @Index(name = "idx_teacher_subjects_teacher", columnList = "teacher_id"),
        @Index(name = "idx_teacher_subjects_subject", columnList = "subject_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherSubjectJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeacherJpaEntity teacher;

    @Column(name = "subject_id", nullable = false)
    private UUID subjectId;

    @Column(name = "is_primary", nullable = false)
    private boolean isPrimary;
}
