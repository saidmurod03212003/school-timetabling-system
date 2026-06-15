package uz.edu.timetable.infrastructure.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "timetable_entries",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_entry_class_slot",
            columnNames = {"timetable_id", "student_class_id", "day_of_week", "period_number"}),
        @UniqueConstraint(name = "uk_entry_teacher_slot",
            columnNames = {"timetable_id", "teacher_id", "day_of_week", "period_number"}),
        @UniqueConstraint(name = "uk_entry_room_slot",
            columnNames = {"timetable_id", "classroom_id", "day_of_week", "period_number"})
    },
    indexes = {
        @Index(name = "idx_te_timetable", columnList = "timetable_id"),
        @Index(name = "idx_te_class", columnList = "student_class_id"),
        @Index(name = "idx_te_teacher", columnList = "teacher_id"),
        @Index(name = "idx_te_classroom", columnList = "classroom_id"),
        @Index(name = "idx_te_day_period", columnList = "day_of_week, period_number")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimetableEntryJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timetable_id", nullable = false)
    private TimetableJpaEntity timetable;

    @Column(name = "school_id", nullable = false)
    private UUID schoolId;

    @Column(name = "student_class_id", nullable = false)
    private UUID studentClassId;

    @Column(name = "subject_id", nullable = false)
    private UUID subjectId;

    @Column(name = "teacher_id", nullable = false)
    private UUID teacherId;

    @Column(name = "classroom_id", nullable = false)
    private UUID classroomId;

    @Column(name = "day_of_week", nullable = false, length = 10)
    private String dayOfWeek;

    @Column(name = "period_number", nullable = false)
    private int periodNumber;

    @Column(name = "lesson_period_id", nullable = false)
    private UUID lessonPeriodId;

    @Column(name = "is_pinned", nullable = false)
    private boolean isPinned;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
