package uz.edu.timetable.infrastructure.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uz.edu.timetable.infrastructure.persistence.entity.UserJpaEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserJpaRepository extends JpaRepository<UserJpaEntity, UUID> {

    Optional<UserJpaEntity> findByEmailAndDeletedAtIsNull(String email);

    Optional<UserJpaEntity> findByIdAndDeletedAtIsNull(UUID id);

    boolean existsByEmailAndDeletedAtIsNull(String email);

    @Query(value = """
            SELECT p.code FROM permissions p
            JOIN role_permissions rp ON p.id = rp.permission_id
            JOIN user_roles ur ON rp.role_id = ur.role_id
            WHERE ur.user_id = :userId
            """, nativeQuery = true)
    List<String> findPermissionCodesByUserId(@Param("userId") UUID userId);

    @Modifying
    @Query("UPDATE UserJpaEntity u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.id = :id")
    void incrementFailedAttempts(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE UserJpaEntity u SET u.failedLoginAttempts = 0, u.lockedUntil = null WHERE u.id = :id")
    void resetFailedAttempts(@Param("id") UUID id);
}
