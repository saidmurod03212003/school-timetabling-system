package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.TeacherJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeacherJpaRepository extends JpaRepository<TeacherJpaEntity, UUID> {
    List<TeacherJpaEntity> findAllBySchoolIdAndDeletedAtIsNull(UUID schoolId);
    Optional<TeacherJpaEntity> findByIdAndDeletedAtIsNull(UUID id);
    boolean existsBySchoolIdAndEmailAndDeletedAtIsNull(UUID schoolId, String email);
}
