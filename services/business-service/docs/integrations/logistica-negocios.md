# Integracion Logistica - Negocios

## Objetivo

Este documento define el lado NEGOCIOS de la integracion con LOGISTICA sin acoplar este servicio a rutas o conceptos de Restaurantes.

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
