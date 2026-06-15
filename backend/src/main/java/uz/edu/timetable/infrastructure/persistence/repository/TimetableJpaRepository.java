package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.TimetableJpaEntity;
import uz.edu.timetable.infrastructure.persistence.entity.TimetableJpaEntity.TimetableStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimetableJpaRepository extends JpaRepository<TimetableJpaEntity, UUID> {

    List<TimetableJpaEntity> findBySchoolIdAndSemesterIdOrderByCreatedAtDesc(
        UUID schoolId, UUID semesterId);

    List<TimetableJpaEntity> findBySchoolIdAndStatusOrderByCreatedAtDesc(
        UUID schoolId, TimetableStatus status);

    List<TimetableJpaEntity> findBySchoolIdAndStatusNotOrderByCreatedAtDesc(
        UUID schoolId, TimetableStatus status);

    Optional<TimetableJpaEntity> findBySchoolIdAndId(UUID schoolId, UUID id);

    @Query("SELECT t FROM TimetableJpaEntity t WHERE t.schoolId = :schoolId " +
           "AND t.semesterId = :semesterId AND t.status = 'PUBLISHED'")
    Optional<TimetableJpaEntity> findPublishedBySemester(
        @Param("schoolId") UUID schoolId,
        @Param("semesterId") UUID semesterId);
}
