# Prefijos de API en business-service

## Regla general

1. El prefijo global real del servicio sigue siendo `/api`.
2. Las rutas publicas ahora soportan dos formas:
   - `/api/...`
   - `/api/negocios/...`
3. Las rutas internas oficiales siguen en `/api/internal/...`.
4. `/api/negocios/internal/...` no es el contrato oficial y no debe usarse como integracion principal.
5. El callback especifico de Logistica se mantiene en:
   - `PATCH /api/negocios/:businessId/pedidos/:businessOrderId/estado-logistica`

## Health soportado

- `GET /api/health`
- `GET /api/negocios/health`

## Convencion actual

- Las rutas publicas antiguas no se reemplazan.
- Las rutas publicas nuevas bajo `/api/negocios/...` son alias compatibles.
- Las rutas internas bajo `/api/internal/...` siguen siendo el contrato estable para integraciones entre microservicios.

## Tabla de prefijos

| Modulo | Ruta antigua | Ruta alias nueva | Observaciones |
|---|---|---|---|
| Health | `/api/health` | `/api/negocios/health` | Alias publico agregado |
| Businesses | `/api/businesses` | `/api/negocios/businesses` | CRUD y operaciones de estado mantienen ambas rutas |
| Schedules | `/api/businesses/:businessId/schedules` | `/api/negocios/businesses/:businessId/schedules` | Alias publico agregado |
| Product Types | `/api/businesses/:businessId/product-types` | `/api/negocios/businesses/:businessId/product-types` | Alias publico agregado |
| Products | `/api/businesses/:businessId/products` | `/api/negocios/businesses/:businessId/products` | Alias publico agregado |
| Catalog | `/api/businesses/:businessId/catalog` | `/api/negocios/businesses/:businessId/catalog` | Alias publico agregado |
| Inventory | `/api/businesses/:businessId/inventory` | `/api/negocios/businesses/:businessId/inventory` | Alias publico agregado |
| Orders | `/api/businesses/:businessId/orders` | `/api/negocios/businesses/:businessId/orders` | Incluye `logistics`, `preparing`, `ready-for-pickup`, `payment` y `dispatch` |
| Promotions | `/api/promotions/...` | `/api/negocios/promotions/...` | Alias publico agregado |
| Metrics | `/api/metrics/...` | `/api/negocios/metrics/...` | Alias publico agregado |
| Orders internos | `/api/internal/business-orders/...` | No aplica | Contrato oficial de integracion |
| Deliveries internos | `/api/internal/business-orders/delivery/...` | No aplica | Contrato oficial de Logistica |
| Delivery Fee Adjustments internos | `/api/internal/business-orders/delivery/fee-adjustments/...` | No aplica | Contrato oficial interno |
| Logistics callback | No aplica | `/api/negocios/:businessId/pedidos/:businessOrderId/estado-logistica` | Endpoint especifico para callback entrante desde Logistica |

## Rutas internas oficiales

- `GET /api/internal/business-orders/:externalOrderCode`
- `GET /api/internal/business-orders/:externalOrderCode/logistics-payload`
- `POST /api/internal/business-orders/confirm-order`
- `POST /api/internal/business-orders/evaluate-cancellation-penalty`
- `POST /api/internal/business-orders/cancel`
- `POST /api/internal/business-orders/validate-and-reserve`
- `POST /api/internal/business-orders/release-reservation`
- `POST /api/internal/business-orders/confirm`
- `POST /api/internal/business-orders/delivery/link`
- `GET /api/internal/business-orders/:externalOrderCode/delivery`
- `GET /api/internal/business-orders/delivery/by-logistics-order/:externalLogisticsOrderCode`
- `POST /api/internal/business-orders/delivery/update-status`
- `POST /api/internal/business-orders/delivery/fee-adjustments/request`
- `GET /api/internal/business-orders/delivery/fee-adjustments/by-order/:externalOrderCode`
- `GET /api/internal/business-orders/delivery/fee-adjustments/by-logistics-order/:externalLogisticsOrderCode`
- `POST /api/internal/business-orders/delivery/fee-adjustments/resolve`

## Nota para integraciones

- Si otro microservicio ya consume `/api/internal/...`, no necesita cambiar nada.
- Si otro consumidor necesita alinearse con la convencion publica de la plataforma, puede usar los alias `/api/negocios/...` solo para rutas publicas.
