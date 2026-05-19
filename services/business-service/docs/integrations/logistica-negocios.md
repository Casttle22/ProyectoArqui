# Integracion Logistica - Negocios

## Objetivo

Este documento define el lado NEGOCIOS de la integracion con LOGISTICA sin acoplar este servicio a rutas o conceptos de Restaurantes.

## Stack de Integracion

- **Logistics API Base**: `http://localhost:3002` (configurable via `BROKER_SERVICE_URL`). El Broker enruta las peticiones a Logística como proxy.
- **Cliente HTTP**: `@nestjs/axios` (HttpModule con timeout 10s)
- **Autenticacion**: Ninguna por ahora (servicios internos)

## Endpoint oficial que debe consumir LOGISTICA

- `GET /api/internal/business-orders/:externalOrderCode/logistics-payload`

Alias util para pruebas operativas desde NEGOCIOS:

- `GET /api/businesses/:businessId/orders/:businessOrderId/logistics`

Ambos endpoints devuelven el mismo payload y usan la misma logica interna.

## Respuesta esperada

```json
{
  "sourceService": "business-service",
  "sourceType": "business",
  "businessId": 1,
  "businessOrderId": 25,
  "externalOrderCode": "ORD-10001",
  "branchId": 0,
  "branchName": null,
  "businessName": "Farmacia Central",
  "originAddress": "6a avenida 1-23 zona 1, Guatemala",
  "originLat": null,
  "originLng": null,
  "customerId": 99,
  "customerName": null,
  "customerPhone": null,
  "destinationAddress": null,
  "destinationLat": null,
  "destinationLng": null,
  "items": [
    {
      "productId": 10,
      "name": "Acetaminofen 500mg",
      "quantity": 2,
      "unitPrice": 15
    }
  ],
  "subtotalBase": 30,
  "totalPaid": 30,
  "currency": "GTQ",
  "notes": null
}
```

## Regla de branchId / sucursal_id en NEGOCIOS

NEGOCIOS no maneja sucursales en este servicio.

- `branchId` debe enviarse como `0`
- `branchName` debe enviarse como `null`

Si LOGISTICA necesita un equivalente de `sucursal_id`, debe tratarlo como `0` o `null` para NEGOCIOS.

## Campos reales y campos no disponibles

Campos reales que hoy salen desde NEGOCIOS:

- `businessId`
- `businessOrderId`
- `externalOrderCode`
- `businessName`
- `originAddress`
- `customerId`
- `items`
- `subtotalBase`
- `totalPaid`
- `currency`

Campos que hoy no existen en el esquema actual y por eso salen como `null`:

- `branchName`
- `originLat`
- `originLng`
- `customerName`
- `customerPhone`
- `destinationAddress`
- `destinationLat`
- `destinationLng`
- `notes`

## Flujo recomendado NEGOCIOS -> LOGISTICA -> NEGOCIOS

1. LOGISTICA consulta el payload del pedido en NEGOCIOS.
2. LOGISTICA crea su entrega usando su propio endpoint para NEGOCIOS.
3. Cuando LOGISTICA ya tenga su identificador de entrega, debe enlazarla en NEGOCIOS con:
   - `POST /api/internal/business-orders/delivery/link`
4. Para consultar el snapshot local de entrega en NEGOCIOS:
   - `GET /api/internal/business-orders/:externalOrderCode/delivery`
   - `GET /api/internal/business-orders/delivery/by-logistics-order/:externalLogisticsOrderCode`
5. Para reportar cambios de estado desde LOGISTICA hacia NEGOCIOS:
   - `POST /api/internal/business-orders/delivery/update-status`

## Campos esperados para delivery/link

LOGISTICA debe devolver o conservar, como minimo, alguno de estos identificadores para el enlace posterior:

- `externalOrderCode` del pedido de NEGOCIOS
- `externalDeliveryCode` si LOGISTICA maneja un id propio de entrega
- `externalLogisticsOrderCode` si LOGISTICA maneja un codigo de orden logistica

## Que no debe hacerse

- NEGOCIOS no debe fingir ser Restaurantes.
- NEGOCIOS no debe exponer rutas con `/restaurantes/...` como contrato oficial.
- No se deben crear tablas ni modelos de sucursales para esta integracion.

## Solicitud limpia para el equipo de LOGISTICA

LOGISTICA deberia exponer una ruta propia para negocios, por ejemplo:

- `POST /api/logistica/entregas/negocios/:businessId/pedidos/:businessOrderId`

usando `branchId` o `sucursal_id` como `0` o `null` para este dominio.

---

## Integracion Actual (LogisticsClientModule)

Se implemento un modulo de integracion directa con el microservicio de Logistica.

### Componentes Implementados

| Componente | Archivo | Proposito |
|---|---|---|
| `LogisticsClientService` | `src/modules/logistics-client/logistics-client.service.ts` | Cliente HTTP para consumir APIs de Logistica |
| `LogisticsCallbackController` | `src/modules/logistics-client/presentation/controllers/logistics-callback.controller.ts` | Endpoint callback para notificaciones de Logistica |
| `LogisticsClientModule` | `src/modules/logistics-client/logistics-client.module.ts` | Modulo NestJS registrado globalmente |

### Metodos del LogisticsClientService

| Metodo | Endpoint de Logistica | Proposito |
|---|---|---|
| `createDelivery(dto)` | `POST /api/logistica/entregas` | Crear una entrega en el modulo de logistica |
| `getDelivery(id)` | `GET /api/logistica/entregas/:id` | Consultar detalle de una entrega |
| `getDeliveryHistory(id)` | `GET /api/logistica/entregas/:id/historial` | Obtener historial de estados |
| `listDeliveries(modulo, page, limit)` | `GET /api/logistica/entregas?modulo_origen=...` | Listar entregas con filtros |
| `checkHealth()` | `GET /health` | Verificar disponibilidad de Logistica |

### Endpoint de Callback (Logistica → Negocios)

Logistica notifica cambios de estado a:

```
PATCH /api/negocios/{negocioId}/pedidos/{pedidoId}/estado-logistica
```

**Request Body:**
```json
{
  "negocioId": 1,
  "pedidoId": 25,
  "estado": "courier_assigned",
  "codigo_entrega": "DEL-12345",
  "codigo_orden_logistica": "LOG-ORD-10001",
  "repartidor_id": 27,
  "observacion": "Courier assigned to order"
}
```

**Estados soportados:**
- `pending_assignment`, `courier_assigned`, `ready_for_pickup`, `picked_up`, `in_transit`, `delivered`, `delivery_failed`, `cancelled`

### Endpoint de Despacho (Negocios → Logistica)

Para enviar un pedido a Logistica manualmente:

```
POST /api/businesses/{businessId}/orders/{businessOrderId}/dispatch
```

Este endpoint:
1. Valida que el pedido este en estado `confirmed`, `preparing` o `ready_for_pickup`
2. Construye el payload de entrega con los datos del pedido
3. Llama a Logistica para crear la entrega (`POST /api/logistica/entregas`)
4. Vincula la entrega localmente (`business_order_delivery`)
5. Retorna el detalle de la entrega creada (tanto en logistica como local)

### Flujo Completo Recomendado

```
[NEGOCIOS]                          [LOGISTICA]
    |                                    |
    |── POST /api/logistica/entregas ───>|  (crear entrega)
    |<── 201 { id, estado, ... } ────────|
    |                                    |
    |── (vincula delivery local)         |
    |                                    |
    |                                    |── PATCH /api/negocios/{id}/pedidos/{id}/estado-logistica
    |<────────────────────────────────────|  (notifica cambio de estado)
    |                                    |
    |── GET /api/logistica/entregas/:id ─>|  (consultar estado)
    |<── 200 { estado, ... } ────────────|
```

### Variables de Entorno

| Variable | Default | Descripcion |
|---|---|---|
| `BROKER_SERVICE_URL` | `http://localhost:3002` | URL base del Broker. El Broker actúa como proxy y enruta `/api/logistica/*` hacia Logística. |
