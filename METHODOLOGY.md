# 📅 CondoFlow – Planificación por Fases (Agile + Kanban personal)

## 🏁 Objetivo general
Finalizar y entregar una aplicación **full stack** distribuida por microservicios para la gestión completa de un condominio antes del 10 de septiembre, utilizando Spring Boot, Keycloak, PostgreSQL, Docker y un frontend en React + TypeScript.

---

## ⚙️ Fase 0: Configuración inicial (Jun 15 – Jun 28)
**Objetivo:** Montar el entorno completo de microservicios y la infraestructura base.

**Incluye:**
- `config-server`: configuración centralizada.
- `eureka-server`: descubrimiento de servicios.
- `gateway-service`: enrutamiento y seguridad vía Keycloak.
- Integración OAuth2 con Keycloak.
- Contenedores en `docker-compose` para PostgreSQL y Keycloak.
- Pruebas de conexión entre servicios.

---

## 🧱 Fase 1: condo-service (Jun 29 – Jul 12)
**Objetivo:** Implementar el microservicio de gestión de residentes y apartamentos.

**Incluye:**
- CRUD de residentes.
- CRUD de apartamentos.
- Asociación de residentes a apartamentos.

---

## 💰 Fase 2: payment-service (Jul 13 – Jul 26)
**Objetivo:** Implementar la gestión de pagos.

**Incluye:**
- CRUD de pagos.
- Aprobación de pagos.
- Lógica de aumento y decremento de balance de apartamento.

---

## 📊 Fase 3: expense-service y billing-service (Jul 27 – Aug 9)
**Objetivo:** Implementar la gestión de gastos y facturación.

**Incluye:**
- `expense-service`: registro de gastos generales y por torre, distribución proporcional según alícuota.
- `billing-service`: generación y gestión de facturas.

---

## 🔧 Fase 4: Integración y pruebas backend (Aug 10 – Aug 23)
**Objetivo:** Validar la integración entre microservicios y preparar despliegue.

**Incluye:**
- Pruebas de flujo completo: login → residentes → asignación → pago → gastos/facturas.
- Dockerización final y actualización de `docker-compose.yml`.
- Validación de seguridad y roles en Keycloak.

---

## 🖥️ Fase 5: Frontend administrador (Aug 24 – Sep 6)
**Objetivo:** Implementar la interfaz de administración.

**Incluye:**
- Panel de control para gestión de apartamentos, pagos, gastos y facturas.
- Integración con API Gateway y autenticación PKCE.
- UI con React, TypeScript, Material UI y TailwindCSS.

---

## 🏠 Fase 6: Frontend residente (Sep 7 – Sep 10)
**Objetivo:** Implementar la interfaz para residentes.

**Incluye:**
- Visualización apartamentos.
- Consulta de pagos, gastos y facturas.
- Funcionalidad de registro de pagos.