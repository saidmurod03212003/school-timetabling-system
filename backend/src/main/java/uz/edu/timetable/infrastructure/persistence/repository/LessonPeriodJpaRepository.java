package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.LessonPeriodJpaEntity;

import java.util.List;
import java.util.UUID;

@Repository
public interface LessonPeriodJpaRepository extends JpaRepository<LessonPeriodJpaEntity, UUID> {
    List<LessonPeriodJpaEntity> findAllBySchoolIdOrderByShiftAscPeriodNumberAsc(UUID schoolId);
}
