# -------- BUILD STAGE --------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests


# -------- RUN STAGE --------
FROM eclipse-temurin:21-jdk

WORKDIR /app

# copy ONLY jar from build stage
COPY --from=build /app/target/*.jar app.jar

# run it
CMD ["java", "-jar", "app.jar"]