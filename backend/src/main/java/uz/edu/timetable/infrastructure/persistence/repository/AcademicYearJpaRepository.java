package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.AcademicYearJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AcademicYearJpaRepository extends JpaRepository<AcademicYearJpaEntity, UUID> {
    List<AcademicYearJpaEntity> findAllBySchoolId(UUID schoolId);
    Optional<AcademicYearJpaEntity> findBySchoolIdAndIsCurrentTrue(UUID schoolId);
}
