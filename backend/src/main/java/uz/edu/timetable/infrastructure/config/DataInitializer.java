package uz.edu.timetable.infrastructure.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uz.edu.timetable.infrastructure.persistence.entity.RoleJpaEntity;
import uz.edu.timetable.infrastructure.persistence.entity.UserJpaEntity;
import uz.edu.timetable.infrastructure.persistence.repository.RoleJpaRepository;
import uz.edu.timetable.infrastructure.persistence.repository.UserJpaRepository;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserJpaRepository userRepository;
    private final RoleJpaRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_PASSWORD:changeme-set-ADMIN_PASSWORD-env-var}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        createDefaultAdminIfNotExists();
    }

    private void createDefaultAdminIfNotExists() {
        String adminEmail = "admin@timetable.uz";

        if (userRepository.existsByEmailAndDeletedAtIsNull(adminEmail)) {
            return;
        }

        RoleJpaEntity superAdminRole = roleRepository.findByName("SUPER_ADMIN")
                .orElseGet(() -> {
                    log.warn("SUPER_ADMIN role not found in DB, creating it...");
                    RoleJpaEntity r = new RoleJpaEntity();
                    r.setName("SUPER_ADMIN");
                    r.setDisplayName("Super Administrator");
                    r.setDescription("Tizimning to'liq boshqaruvchisi");
                    return roleRepository.save(r);
                });

        UserJpaEntity admin = UserJpaEntity.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .fullName("Super Administrator")
                .isActive(true)
                .isEmailVerified(true)
                .failedLoginAttempts(0)
                .roles(Set.of(superAdminRole))
                .build();

        userRepository.save(admin);

        log.info("═══════════════════════════════════════════════");
        log.info("✓ Default admin user created:");
        log.info("  Email   : {}", adminEmail);
        log.info("  Password: Admin1234!");
        log.info("═══════════════════════════════════════════════");
    }
}
