package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.StudentClassJpaEntity;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentClassJpaRepository extends JpaRepository<StudentClassJpaEntity, UUID> {
    List<StudentClassJpaEntity> findAllBySchoolId(UUID schoolId);
    List<StudentClassJpaEntity> findAllBySchoolIdAndAcademicYearId(UUID schoolId, UUID academicYearId);
}
