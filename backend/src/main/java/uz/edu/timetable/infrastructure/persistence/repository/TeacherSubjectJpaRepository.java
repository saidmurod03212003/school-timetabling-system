package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.TeacherSubjectJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeacherSubjectJpaRepository extends JpaRepository<TeacherSubjectJpaEntity, UUID> {
    List<TeacherSubjectJpaEntity> findAllByTeacher_Id(UUID teacherId);
    Optional<TeacherSubjectJpaEntity> findByTeacher_IdAndSubjectId(UUID teacherId, UUID subjectId);
    List<TeacherSubjectJpaEntity> findAllBySubjectId(UUID subjectId);

    @Modifying
    @Query("DELETE FROM TeacherSubjectJpaEntity ts WHERE ts.teacher.id = :teacherId")
    void deleteAllByTeacherId(@Param("teacherId") UUID teacherId);
}
