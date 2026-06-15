package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.SchoolJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolJpaRepository extends JpaRepository<SchoolJpaEntity, UUID> {
    List<SchoolJpaEntity> findAllByDeletedAtIsNull();
    Optional<SchoolJpaEntity> findByIdAndDeletedAtIsNull(UUID id);
}
