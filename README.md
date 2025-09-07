# 🏢 CondoFlow – Gestión de Condominios

Plataforma **full stack** orientada a microservicios para facilitar la gestión de pagos, gastos y administración de residencias.  
Incluye **backend** (Java + Spring Boot) y **frontend** (React + TypeScript) en el mismo repositorio.  
Construida siguiendo principios DDD y una metodología ágil adaptada para trabajo individual.

---

## 📐 Estructura del proyecto
```text
condo-flow/
├── config-server/
├── discovery/
├── frontend/                # Aplicación React + TypeScript
├── gateway/
├── services/
│   ├── condo-service/
│   ├── payment-service/
│   ├── expense-service/
│   ├── billing-service/
│   └── report-service/      # Futuras versiones
├── .env.example
├── .gitignore
├── docker-compose.yml
├── init-db.sh
├── README.md
└── SPRINTS.md
```

---

## 🚀 Tecnologías principales

* **Backend**
  * Java 21
  * Spring Boot 3
  * Keycloak (OAuth2.0)
  * Spring Cloud Gateway, Eureka, Config Server
  * Kafka + Zookeeper
  * PostgreSQL
  * Docker & Docker Compose
  * Swagger / OpenAPI

- **Frontend**
    - React
    - TypeScript
    - Material UI
    - TailwindCSS
    - React OAuth2 Code PKCE
---

## 🔧 Cómo ejecutar

1. **Backend con Docker**
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
   6. Accede a los servicios:

    | Servicio         | URL                   |
    |------------------|-----------------------|
    | Config Server    | http://localhost:8888 |
    | Eureka Dashboard | http://localhost:8761 |
    | Gateway          | http://localhost:8222 |
    | Keycloak         | http://localhost:8080 |

2. **Backend con Docker**
    1. Ve a la carpeta `frontend`:
         ```bash
         cd frontend
         ```
    2. Crea un archivo .env copiando el ejemplo:
         ```bash
         cp .env.example .env
         ```
    3. Configura las variables en `.env`:
         ```dotenv
         VITE_API_BASE_URL=
         VITE_KEYCLOAK_AUTHORIZATION=
         VITE_KEYCLOAK_TOKEN=
         VITE_LOGOUT_ENDPOINT=
         ```
       > 💡 El archivo .env.example ya está incluido en el proyecto como referencia. No lo edites directamente.
    4. Instala dependencias (usando package-lock.json):
         ```bash
         npm ci
         ```
    5. Inicia el servidor de desarrollo:
         ```bash
         npm run dev
         ```

---

## 🧪 Servicios disponibles
- **condo-service:** torres, apartamentos, residentes
- **payment-service:** cuotas, pagos, lógica de descuento/multa
- **expense-service:** gastos comunes y distribución por torre
- **billing-service**: facturación y gestión de cobros
- **report-service:** generación de reportes financieros _(futuras versiones)_

---

## 📅 Metodología de trabajo
Este proyecto utiliza una metodología ágil adaptada para trabajo individual, basada en principios de Agile y Kanban personal:
* **Tablero Kanban** para organizar tareas en columnas: Pendiente, En progreso, Hecho.
* Iteraciones cortas y flexibles, priorizando entregas funcionales frecuentes.
* Revisión y ajuste continuo del flujo de trabajo según avances y bloqueos.

---

## ✍️ Autor
- Jesús Méndez (Venezuela)
- Proyecto universitario con enfoque profesional

---

> ⚠️ Este proyecto está en desarrollo activo y algunos servicios pueden estar en proceso de implementación.