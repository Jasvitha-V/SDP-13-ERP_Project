FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

# FIX PERMISSION
RUN chmod +x mvnw

# Build project
RUN ./mvnw clean package -DskipTests

# Run app
CMD ["java", "-jar", "target/edu-erp-backend-0.0.1-SNAPSHOT.jar"]