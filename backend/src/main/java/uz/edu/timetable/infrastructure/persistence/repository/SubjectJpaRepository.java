package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.SubjectJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectJpaRepository extends JpaRepository<SubjectJpaEntity, UUID> {
    List<SubjectJpaEntity> findAllBySchoolIdAndDeletedAtIsNull(UUID schoolId);
    Optional<SubjectJpaEntity> findByIdAndDeletedAtIsNull(UUID id);
    boolean existsBySchoolIdAndCodeAndDeletedAtIsNull(UUID schoolId, String code);
}
