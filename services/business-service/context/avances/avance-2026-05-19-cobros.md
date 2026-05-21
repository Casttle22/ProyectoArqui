# Avance - 19 de Mayo 2026 (Integración Cobros)

## Objetivo

Integrar el microservicio de Cobros (`https://cobros-api.fly.dev`) al módulo de Negocios, siguiendo la secuencia de restaurantes: Crear Pedido → Cobro → Logística.

---

## Cambios Realizados

### 1. Nueva variable de entorno

**Archivo:** `src/config/env/env.validation.ts`

Se agregó `COBROS_API_URL` con default `https://cobros-api.fly.dev`.

### 2. Módulo CobrosClient

**Archivos creados:**

| Archivo | Propósito |
|---|---|
| `src/modules/cobros-client/cobros-client.module.ts` | Módulo NestJS que importa `HttpModule` y `ConfigModule` |
| `src/modules/cobros-client/cobros-client.service.ts` | Cliente HTTP para Cobros: `createPayment`, `getPayment`, `cancelPayment`, `checkHealth` |
| `src/modules/cobros-client/presentation/dto/create-cobros-payment.dto.ts` | DTO para crear cobro en Cobros (items, montos, método de pago, etc.) |
| `src/modules/cobros-client/presentation/dto/cobros-payment-response.dto.ts` | DTO de respuesta de Cobros |

#### CobrosClientService

Métodos expuestos:

- `createPayment(dto)` → `POST /api/cobros/payments` — Crear cobro en Cobros
- `getPayment(paymentId)` → `GET /api/cobros/payments/:paymentId` — Consultar cobro
- `cancelPayment(paymentId, reason)` → `PATCH /api/cobros/payments/:paymentId/cancel` — Cancelar cobro
- `checkHealth()` → `GET /api/cobros/health` — Health check

### 3. Nuevo endpoint de pago

```
POST /api/businesses/:businessId/orders/:businessOrderId/payment
```

Flujo:
1. Valida que el pedido no esté cancelado
2. Valida que no tenga un cobro ya procesado
3. Construye el payload con items y montos del pedido
4. Llama `POST /api/cobros/payments` a Cobros
5. Guarda `cobro_id` (payment_id) en `external_payment_code` del pedido
6. Retorna el detalle del cobro

### 4. Modificación del endpoint de despacho

**Endpoint:** `POST /api/businesses/:businessId/orders/:businessOrderId/dispatch`

Ahora **exige** que el pedido tenga `external_payment_code` (cobro_id). Si no tiene pago, rechaza con 400:
> "Payment has not been processed for this order. Call POST /api/businesses/:businessId/orders/:businessOrderId/payment first."

Se eliminó la creación de pago del dispatch — ahora cada paso es un endpoint independiente.

### 5. Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/config/env/env.validation.ts` | Se agregó `COBROS_API_URL` |
| `src/app.module.ts` | Se importó `CobrosClientModule` |
| `src/modules/orders/orders.module.ts` | Se importó `CobrosClientModule` |
| `src/modules/orders/application/services/orders.service.ts` | Se inyectó `CobrosClientService`. Se agregó `processPayment()`. Se modificó `requestLogisticsDispatch()` para validar cobro |
| `src/modules/orders/presentation/controllers/business-orders.controller.ts` | Se agregó endpoint `POST :businessOrderId/payment` |
| `src/modules/orders/presentation/dto/process-payment-response.dto.ts` | **Nuevo** DTO de respuesta del pago |
| `src/modules/orders/infrastructure/repositories/prisma-orders.repository.ts` | Se agregó método `updatePaymentCode()` |

---

## Estado Actual

- Secuencia de flujo: **Crear Pedido → Cobro → Despacho a Logística**
- Cada paso es un endpoint independiente
- El despacho rechaza pedidos sin cobro previo
- Pendiente: integrar Descuentos cuando esté disponible
