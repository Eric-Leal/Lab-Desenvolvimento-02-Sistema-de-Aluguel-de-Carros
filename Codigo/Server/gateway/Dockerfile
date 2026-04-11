FROM eclipse-temurin:21-jdk-jammy AS build
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q
RUN find /app/target -maxdepth 1 -name "*.jar" ! -name "*-original.jar" -exec cp {} /app/target/app.jar \;

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/app.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]