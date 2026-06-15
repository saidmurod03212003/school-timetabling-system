package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.ClassroomJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassroomJpaRepository extends JpaRepository<ClassroomJpaEntity, UUID> {
    List<ClassroomJpaEntity> findAllBySchoolIdAndDeletedAtIsNull(UUID schoolId);
    Optional<ClassroomJpaEntity> findByIdAndDeletedAtIsNull(UUID id);
}
