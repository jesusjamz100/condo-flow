# 🏢 CondoFlow – Gestión de Condominios

Plataforma backend orientada a microservicios para facilitar la gestión de pagos, gastos y administración de residencias. Construida con Spring Boot 6, Spring Cloud y Docker, siguiendo principios DDD y metodología Scrum.

---

## 📐 Estructura del proyecto
```text
condo-flow/
├── services/
│   ├── condo-service/
│   ├── payment-service/
│   ├── expense-service/
│   └── report-service/
├── gateway/
├── config-server/
├── eureka-server/
├── .gitignore
├── docker-compose.yml
├── init-db.sh
├── SPRINTS.md
└── README.md
```

---

## 🚀 Tecnologías principales
- Java 21
- Spring Boot 3
- Keycloak (OAuth2.0)
- Spring Cloud Gateway, Eureka, Config Server
- Kafka + Zookeeper
- PostgreSQL
- Docker & Docker Compose
- Swagger / OpenAPI

---

## 🔧 Cómo ejecutar con Docker
1. Clona el proyecto:
```bash
git clone https://github.com/jesusjamz100/condo-flow.git
```
2. Crea un archivo `.env` con las variables de entorno necesarias. Puedes hacerlo manualmente o copiando el archivo de ejemplo:
```bash
cp .env.example .env
```
3. Abre el archivo `.env` y configura tus variables:
```dotenv
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_contraseña
POSTGRES_DB=nombre_de_tu_db
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
```
> 💡 El archivo .env.example ya está incluido en el proyecto como referencia. No lo edites directamente.
4. Construye las imágenes:
```bash
docker-compose build
```
5. Levanta todos los servicios:
```bash
docker-compose up
```
> ✅ ¡Listo! La aplicación debería estar corriendo en tu entorno local con Docker.
6. Accede a los servicios: \
| Servicio | URL |
| ------------- | ------------- |
| Config Server | http://localhost:8888 |
| Eureka Dashboard | http://localhost:8761 |
| Gateway | http://localhost:8222 |
| Keycloak | http://localhost:8080 |

---

## 🧪 Servicios disponibles
- **condo-service:** torres, apartamentos, residentes
- **payment-service:** cuotas, pagos, lógica de descuento/multa
- **expense-service:** gastos comunes y distribución por torre
- **report-service:** generación de reportes financieros (Se implementará en futuras versiones)

---

## 📅 Metodología Scrum
Este proyecto sigue una planificación por sprints de dos semanas. Consulta el archivo SPRINTS.md para ver la planificación y tareas de cada entrega.

---

## ✍️ Autor
- Jesús Méndez (Venezuela)
- Proyecto universitario con enfoque profesional

---

> ⚠️ Este proyecto está en desarrollo activo y algunos servicios pueden estar en proceso de implementación.