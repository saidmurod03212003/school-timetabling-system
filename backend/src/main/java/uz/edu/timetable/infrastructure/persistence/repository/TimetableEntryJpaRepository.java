package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.TimetableEntryJpaEntity;

import java.util.List;
import java.util.UUID;

@Repository
public interface TimetableEntryJpaRepository extends JpaRepository<TimetableEntryJpaEntity, UUID> {

    List<TimetableEntryJpaEntity> findByTimetable_Id(UUID timetableId);

    List<TimetableEntryJpaEntity> findByTimetable_IdAndStudentClassId(
        UUID timetableId, UUID studentClassId);

    List<TimetableEntryJpaEntity> findByTimetable_IdAndTeacherId(
        UUID timetableId, UUID teacherId);

    List<TimetableEntryJpaEntity> findByTimetable_IdAndClassroomId(
        UUID timetableId, UUID classroomId);

    List<TimetableEntryJpaEntity> findByTimetable_IdAndDayOfWeek(
        UUID timetableId, String dayOfWeek);

    @Query("SELECT e FROM TimetableEntryJpaEntity e WHERE e.timetable.id = :timetableId " +
           "AND e.teacherId = :teacherId AND e.dayOfWeek = :day AND e.periodNumber = :period")
    List<TimetableEntryJpaEntity> findTeacherConflicts(
        @Param("timetableId") UUID timetableId,
        @Param("teacherId") UUID teacherId,
        @Param("day") String day,
        @Param("period") int period);

    @Query("SELECT e FROM TimetableEntryJpaEntity e WHERE e.timetable.id = :timetableId " +
           "AND e.studentClassId = :classId AND e.dayOfWeek = :day AND e.periodNumber = :period")
    List<TimetableEntryJpaEntity> findClassConflicts(
        @Param("timetableId") UUID timetableId,
        @Param("classId") UUID classId,
        @Param("day") String day,
        @Param("period") int period);

    @Modifying
    @Query("DELETE FROM TimetableEntryJpaEntity e WHERE e.timetable.id = :timetableId")
    void deleteAllByTimetableId(@Param("timetableId") UUID timetableId);
}
