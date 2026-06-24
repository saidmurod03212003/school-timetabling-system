package uz.edu.timetable.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy repairAndMigrate() {
        return flyway -> {
            var repairResult = flyway.repair();
            if (!repairResult.repairActions.isEmpty()) {
                log.warn("Flyway repair performed: {}", repairResult.repairActions);
            }
            flyway.migrate();
        };
    }
}
