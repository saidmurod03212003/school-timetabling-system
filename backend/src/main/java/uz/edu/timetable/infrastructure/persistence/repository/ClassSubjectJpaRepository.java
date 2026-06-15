package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.ClassSubjectJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassSubjectJpaRepository extends JpaRepository<ClassSubjectJpaEntity, UUID> {
    List<ClassSubjectJpaEntity> findAllByClassId(UUID classId);
    Optional<ClassSubjectJpaEntity> findByClassIdAndSubjectId(UUID classId, UUID subjectId);

    @Modifying
    @Query("DELETE FROM ClassSubjectJpaEntity cs WHERE cs.classId = :classId")
    void deleteAllByClassId(@Param("classId") UUID classId);
}
