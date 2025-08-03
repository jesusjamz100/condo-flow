# 📅 CondoFlow – Planificación por Sprints (Scrum)

## 🏁 Objetivo general
Finalizar y entregar una aplicación backend distribuida por microservicios para la gestión completa de un condominio antes del 10 de septiembre, utilizando Spring Boot, Keycloak, PostgreSQL, Kafka y Docker.

---

## ⚙️ Sprint 0: Configuración inicial (Jun 15 – Jun 28)

### 🎯 Objetivos
- Montar el entorno completo de microservicios.
- Configurar los servicios fundamentales y la infraestructura base.

### ✅ Tareas realizadas
- [x] Crear `config-server` para configuración centralizada
- [x] Crear `eureka-server` para descubrimiento de servicios
- [x] Crear `gateway-service` con filtros de seguridad y autenticación vía Keycloak
- [x] Integrar seguridad OAuth2 con Keycloak (sin auth-service propio)
- [x] Crear y configurar contenedores en `docker-compose` para:
  - PostgreSQL
  - Kafka + Zookeeper
  - Keycloak
- [x] Probar conexión entre servicios con Eureka y Gateway

---

## 🧱 Sprint 1: Residentes y gestión inicial (Jun 29 – Jul 12)

### 🎯 Objetivos
- Iniciar el desarrollo de `condo-service`
- Conectar usuarios Keycloak con perfiles extendidos de residentes
- CRUD de residentes

### 📋 Historias de usuario
- Como **administrador**, quiero crear, editar y eliminar residentes del condominio.
- Como **residente**, quiero que mi perfil esté vinculado a mi usuario Keycloak.

### ✅ Tareas
- [x] Crear modelo de `Residente` con vínculo a usuarios Keycloak
- [x] Implementar endpoints CRUD para residentes
- [ ] Implementar pruebas unitarias de residentes
- [ ] Documentar en Swagger

---

## 🏢 Sprint 2: Gestión de Torres y Apartamentos (Jul 13 – Jul 26)

### 🎯 Objetivos
- Modelar la estructura física del condominio (torres, pisos y apartamentos)
- Asignar residentes a apartamentos
- Calcular y almacenar alícuotas por apartamento

### 📋 Historias de usuario
- Como **administrador**, quiero definir la estructura del condominio (torres, pisos, apartamentos).
- Como **administrador**, quiero asignar y desasignar residentes a apartamentos.
- Como **administrador**, quiero definir la alícuota de cada apartamento.

### ✅ Tareas
- [ ] Modelo: Torre, Apartamento, Alicuota
- [ ] Precargar estructura A–D, 16 pisos, 4 aptos por piso (excepto PH)
- [ ] CRUD de apartamentos
- [ ] Asociar y desasociar residentes desde los apartamentos
- [ ] Endpoint: GET torre/apartamentos, POST apartamento/asignar-residente
- [ ] Documentar en Swagger

---

## 💰 Sprint 3: Pagos y Gastos Comunes (Jul 27 – Aug 9)

### 🎯 Objetivos
- Implementar `payment-service` y `expense-service`
- Aplicar lógica de descuentos y multas en pagos
- Registrar gastos generales o específicos por torre
- Distribuir gastos según alícuota

### 📋 Historias de usuario
- Como **residente**, quiero ver mis pagos pendientes y realizarlos.
- Como **residente**, quiero obtener un descuento si pago antes del día 5 del mes.
- Como **administrador**, quiero registrar gastos del condominio (mantenimiento, luz, etc.).
- Como **administrador**, quiero que gastos por torre se asignen solo a esa torre.

### ✅ Tareas

#### payment-service
- [ ] Modelo: Pago, CuotaMensual
- [ ] Descuento 10% si se paga antes del día 5
- [ ] Multa 10% si no se paga antes de fin de mes
- [ ] Endpoint: POST pago, GET estado de cuenta

#### expense-service
- [ ] Modelo: Gasto, GastoPorTorre
- [ ] Registro de gasto general o por torre
- [ ] Distribución proporcional según alícuota
- [ ] Endpoint: POST gasto, GET gastos por usuario/torre

---

## 🔧 Sprint 4: Integración, pruebas y deploy (Aug 10 – Aug 23)

### 🎯 Objetivos
- Realizar pruebas de integración y validación entre microservicios
- Preparar despliegue con Docker
- Documentar sistema y endpoints
- Lograr 80% del sistema completo y funcional para el 30 de agosto

### 📋 Historias de usuario
- Como **administrador**, quiero ver que todo el sistema funciona integrado.
- Como **usuario**, quiero recibir respuestas claras del sistema ante errores o acciones.

### ✅ Tareas
- [ ] Probar flujo completo: login → residentes → asignación → pago
- [ ] Documentar todos los endpoints en Swagger
- [ ] Dockerizar servicios faltantes y actualizar `docker-compose.yml`
- [ ] Validación de seguridad con roles en Keycloak
- [ ] Ajustes finales y revisión funcional

---

## 📦 Sprint 5: Entrega final y mejoras (Aug 24 – Sep 10)

### 🎯 Objetivos
- Corregir bugs y refinar la experiencia
- Optimizar consultas y manejo de errores
- Finalizar pruebas automatizadas y presentación

### ✅ Tareas
- [ ] Corregir errores encontrados en validaciones
- [ ] Optimizar lógica de cálculo de pagos/gastos
- [ ] Añadir pruebas unitarias e integración faltantes
- [ ] Preparar presentación/documentación final
- [ ] Verificar consistencia de roles y permisos en Keycloak