# 🏢 CondoFlow – Gestión de Condominios

Plataforma backend orientada a microservicios para facilitar la gestión de pagos, gastos y administración de residencias. Construida con Spring Boot 6, Spring Cloud y Docker, siguiendo principios DDD y metodología Scrum.

---

## 📐 Estructura del proyecto
```text
condo-flow/
├── services/
│   ├── auth-service/
│   ├── user-service/
│   ├── condo-service/
│   ├── payment-service/
│   ├── expense-service/
│   └── report-service/
├── gateway/
│   └── gateway-service/
├── config-server/
├── eureka-server/
├── docker/
│   └── docker-compose.yml
└── README.md
```

---

## 🚀 Tecnologías principales
- Java 21
- Spring Boot 3
- Spring Cloud Gateway, Eureka, Config Server
- Kafka + Zookeeper
- Redis (sesión única)
- PostgreSQL
- Docker & Docker Compose
- Swagger / OpenAPI

---

## 🔧 Cómo ejecutar con Docker
1. Clona el proyecto:
```bash
git clone https://github.com/jesusjamz100/condo-flow.git
cd condo-flow/docker
```
2. Construye las imágenes:
```bash
docker-compose build
```
3. Levanta todos los servicios:
```bash
docker-compose up
```
4. Accede a los servicios: \
| Servicio | URL |
| ------------- | ------------- |
| Config Server | http://localhost:8888 |
| Eureka Dashboard | http://localhost:8761 |
| Gateway | http://localhost:8222 |

---

## 🧪 Servicios disponibles
- **auth-service:** login, logout, JWT, sesión única (Redis)
- **user-service:** registro y gestión de usuarios
- **condo-service:** torres, apartamentos, alícuotas
- **payment-service:** cuotas, pagos, lógica de descuento/multa
- **expense-service:** gastos comunes y distribución por torre
- **report-service:** generación de reportes financieros

---

## 📅 Metodología Scrum
Este proyecto sigue una planificación por sprints de dos semanas. Consulta el archivo SPRINTS.md (o sección del README) para ver la planificación y tareas de cada entrega.

---

## ✍️ Autor
- Jesús Méndez (Venezuela)
- Proyecto universitario con enfoque profesional

---

> ⚠️ Este proyecto está en desarrollo activo y algunos servicios pueden estar en proceso de implementación.