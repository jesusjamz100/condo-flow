# 📅 CondoFlow – Planificación por Sprints (Scrum)

## 🏁 Objetivo general
Finalizar y entregar una aplicación backend distribuida por microservicios para la gestión completa de un condominio antes del 30 de agosto, utilizando Spring Boot, OAuth2, PostgreSQL y Docker.

---

## 🚀 Sprint 1: Seguridad y Autenticación (Jun 29 – Jul 12)

### 🎯 Objetivos
- Configurar seguridad OAuth2 para autenticación.
- Crear `auth-service` y configurar flujo OAuth2 completo.
- Proteger microservicios mediante Resource Server (ya avanzado en `user-service`).
- Filtrar y enrutar tráfico con `gateway-service`.
- Iniciar documentación en Swagger.

### 📋 Historias de usuario
- Como **usuario**, quiero iniciar sesión con mi correo y contraseña para acceder al sistema.
- Como **administrador**, quiero asegurar que cada usuario solo tenga una sesión activa (Redis).

### ✅ Tareas
- [ ] Crear `auth-service` con soporte OAuth2 (password grant o token personalizado)
- [ ] Conectar `auth-service` con `user-service` para autenticación
- [ ] Configurar Redis para sesión única por usuario
- [ ] Configurar `gateway-service` como API Gateway + filtros de seguridad JWT
- [ ] Definir roles básicos: `ADMIN`, `RESIDENT`, `STAFF`
- [ ] Swagger: auth + user-service

---

## 🧱 Sprint 2: Gestión de Condominios (Jul 13 – Jul 26)

### 🎯 Objetivos
- Crear el `condo-service` para representar torres, apartamentos y alícuotas.
- Asociar apartamentos a usuarios.
- Normalizar la estructura de edificios (torres, pisos, apartamentos).
- Calcular la alícuota como % de participación del gasto total.

### 📋 Historias de usuario
- Como **administrador**, quiero registrar todos los apartamentos del condominio para asignar propietarios.
- Como **usuario**, quiero ver a qué torre y apartamento pertenezco.
- Como **administrador**, quiero definir la alícuota de cada apartamento.

### ✅ Tareas
- [ ] Crear modelo de dominio: Torre, Apartamento, Alicuota
- [ ] Precargar la estructura: Torres A-D, 16 pisos, apartamentos 1-1 hasta 16-2
- [ ] Asociar usuarios a apartamentos
- [ ] Endpoint: GET torre/apartamentos, POST apartamento/asignar-usuario
- [ ] Swagger: condo-service

---

## 💰 Sprint 3: Pagos y Gastos Comunes (Jul 27 – Aug 9)

### 🎯 Objetivos
- Implementar lógica de pagos mensuales (`payment-service`) y gastos comunes (`expense-service`)
- Aplicar reglas de descuento y multa según fecha de pago
- Registrar pagos de servicios externos (mantenimiento, luz, etc.)
- Distribuir gastos según alícuota por torre y apartamento

### 📋 Historias de usuario
- Como **usuario**, quiero ver mi deuda mensual y poder pagarla.
- Como **usuario**, quiero obtener un descuento si pago a tiempo.
- Como **administrador**, quiero registrar gastos como mantenimiento o conserjes.
- Como **administrador**, quiero que los gastos por torre solo se apliquen a sus residentes.

### ✅ Tareas
#### payment-service
- [ ] Crear modelo: Pago, CuotaMensual
- [ ] Lógica de cálculo con descuento (10% hasta día 5)
- [ ] Lógica de multa (10% después del mes vencido)
- [ ] Endpoint: POST pago, GET estado de cuenta

#### expense-service
- [ ] Registrar gastos comunes generales o por torre
- [ ] Calcular distribución por alícuota
- [ ] Endpoint: POST gasto, GET gastos por usuario/torre

---

## 📊 Sprint 4: Reportes, Integración y Deploy (Aug 10 – Aug 23)

### 🎯 Objetivos
- Generar reportes financieros por condominio, torre o apartamento
- Integrar todos los microservicios y validarlos
- Dockerizar todos los servicios
- Preparar documentación y pruebas

### 📋 Historias de usuario
- Como **administrador**, quiero generar un reporte de ingresos vs. gastos del mes actual.
- Como **administrador**, quiero descargar el reporte en PDF/CSV.
- Como **usuario**, quiero ver un historial de mis pagos.

### ✅ Tareas
#### report-service
- [ ] Generar reportes: resumen de pagos, deudas, gastos por torre
- [ ] Exportar como PDF/CSV (opcional o simulado)
- [ ] Endpoint: GET /report/monthly, /report/apt, /report/torre

#### Integración & DevOps
- [ ] Completar archivos `application.yml` centralizados en config-server
- [ ] Dockerizar todos los servicios y agregar a `docker-compose`
- [ ] Pruebas end-to-end con Postman o Swagger

---

## 🧹 Semana Final (Aug 24 – Aug 30)
### 🧪 Tareas
- [ ] Corrección de errores
- [ ] Revisión de Swagger de todos los servicios
- [ ] Validación funcional del sistema completo
- [ ] Preparación para presentación final