FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml aot-jar.properties ./
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/rentalsService-0.1.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1", "-Xss256k", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]