package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.SemesterJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SemesterJpaRepository extends JpaRepository<SemesterJpaEntity, UUID> {
    List<SemesterJpaEntity> findAllBySchoolId(UUID schoolId);
    List<SemesterJpaEntity> findAllByAcademicYearId(UUID academicYearId);
    Optional<SemesterJpaEntity> findBySchoolIdAndIsCurrentTrue(UUID schoolId);
}
