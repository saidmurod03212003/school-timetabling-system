# Build stage - Maven + Java 25
FROM maven:3.9-eclipse-temurin-25-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn clean package -DskipTests -q

# Runtime stage
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

RUN addgroup -S timetable && adduser -S timetable -G timetable
USER timetable:timetable

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
    "-jar", \
    "-Xms256m", \
    "-Xmx512m", \
    "-XX:+UseG1GC", \
    "-XX:MaxGCPauseMillis=200", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "/app/app.jar"]
