# ---- Stage 1: build ----
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# copiar pom y bajar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# copiar codigo y compilar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Stage 2: runtime ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# copiar JAR generado
COPY --from=builder /app/target/*.jar app.jar

# Exponer el puerto (ajústalo por servicio)
EXPOSE 8761

ENTRYPOINT ["java","-jar","/app/app.jar"]