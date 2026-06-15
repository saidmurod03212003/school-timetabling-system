package uz.edu.timetable.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "teacher_availability",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"teacher_id", "day_of_week", "period_from", "period_to"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherAvailabilityJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeacherJpaEntity teacher;

    @Column(name = "day_of_week", nullable = false, length = 10)
    private String dayOfWeek;

    @Column(name = "period_from", nullable = false)
    private int periodFrom;

    @Column(name = "period_to", nullable = false)
    private int periodTo;

    @Column(name = "availability_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private AvailabilityType availabilityType;

    public enum AvailabilityType { AVAILABLE, PREFERRED, UNAVAILABLE }
}
