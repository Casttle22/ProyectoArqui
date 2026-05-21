# Análisis del Proyecto: pedidos-negocios

## Descripción General

Microservicio de gestión de negocios, pedidos, inventario, entregas y promociones para una plataforma de pedidos (tipo delivery/restaurantes). Construido con **NestJS v11**, **TypeScript**, **Prisma ORM v7**, y base de datos **MariaDB/MySQL**.

---

## Stack Tecnológico

| Tecnología | Detalle |
|---|---|
| Runtime | Node.js |
| Lenguaje | TypeScript 5.7+ |
| Framework | NestJS v11 |
| ORM | Prisma ORM v7.5 con driver MariaDB |
| Base de datos | MySQL / MariaDB |
| Validación | class-validator, class-transformer, Joi |
| Documentación API | Swagger (@nestjs/swagger + swagger-ui-express) |
| Testing | Jest (unitario) + Supertest (E2E) |
| Linting/Formato | ESLint 9 + Prettier + typescript-eslint |

---

## Estructura del Proyecto

```
services/business-service/
├── prisma/
│   ├── schema.prisma          # 16 modelos, 30+ enums
│   ├── seed.ts
│   └── migrations/
│       ├── 20260408_inventory_stable_baseline/
│       └── 20260416_delivery_external_refs/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── env/env.validation.ts
│   │   └── swagger/swagger.config.ts
│   ├── prisma/
│   │   ├── prisma.module.ts   # @Global()
│   │   └── prisma.service.ts
│   ├── health/
│   │   └── health.controller.ts
│   ├── common/                # Directorios placeholder
│   └── modules/
│       ├── business/          # Negocios (CRUD + disponibilidad)
│       ├── schedules/         # Horarios por negocio
│       ├── product-types/     # Tipos de producto
│       ├── products/          # Productos + stock + catálogo
│       ├── inventory/         # Inventario (reservas, movimientos)
│       ├── orders/            # Pedidos (ciclo de vida completo)
│       ├── deliveries/        # Entregas (logística)
│       ├── delivery-fee-adjustments/  # Ajustes de tarifa de envío
│       ├── promotions/        # Promociones (requests + references)
│       ├── metrics/           # Métricas diarias
│       └── support/           # Placeholder
├── test/
│   └── app.e2e-spec.ts
├── context/
│   ├── Contexto.md            # Este archivo
│   ├── avances/
│   └── postman/
├── docs/
│   └── integrations/logistica-negocios.md
└── package.json
```

---

## Modelos de Base de Datos (16 modelos)

| Modelo | Descripción |
|---|---|
| **business** | Negocio con nombre comercial/legal, tipo, estado, email único, tax_id único, soft-delete |
| **business_schedule** | Horario semanal por negocio (día, apertura, cierre) |
| **product_type** | Categoría de productos por negocio (soft-delete) |
| **product** | Producto por negocio + tipo, precio, estado, visible en catálogo (soft-delete) |
| **product_stock** | Stock disponible, reservado, alerta mínima (1:1 con product) |
| **inventory_movement** | Movimientos de inventario (entrada, salida, reserva, liberación, ajuste, etc.) |
| **inventory_reservation** | Reserva de inventario por negocio (activa, confirmada, liberada, expirada, cancelada) |
| **inventory_reservation_detail** | Detalle de productos en una reserva |
| **business_order** | Pedido con códigos externos, estados, snapshots financieros |
| **business_order_detail** | Detalle del pedido (producto, tipo, precios snapshot) |
| **business_order_status_history** | Historial de cambios de estado del pedido |
| **business_order_delivery** | Entrega asociada a un pedido (tipo, estado, códigos externos) |
| **business_order_delivery_status_history** | Historial de estados de entrega |
| **business_order_delivery_fee_adjustment** | Ajustes de tarifa de envío |
| **business_promotion_reference** | Promociones referenciadas desde sistema externo |
| **business_promotion_request** | Solicitudes de promoción del negocio al externo |
| **promotion_request_scope** | Alcance de una solicitud de promoción (productos/tipos) |
| **promotion_sync_history** | Historial de sincronización de promociones |
| **cancellation_penalty_rule** | Reglas de penalización por cancelación por negocio |
| **temporary_business_closure** | Cierres temporales programados |
| **daily_business_metric** | Métricas agregadas diarias por negocio |

---

## Endpoints Disponibles (~55+)

### Públicos

| Método | Ruta | Módulo | Descripción |
|---|---|---|---|
| `GET` | `/api/health` | Health | Health check |
| `GET` | `/api/businesses` | Business | Listar negocios (filtros: search, status, type, includeDeleted) |
| `GET` | `/api/businesses/:businessId` | Business | Obtener negocio por ID |
| `POST` | `/api/businesses` | Business | Crear negocio |
| `PATCH` | `/api/businesses/:businessId` | Business | Actualizar negocio |
| `PATCH` | `/api/businesses/:businessId/retire` | Business | Retirar negocio |
| `PATCH` | `/api/businesses/:businessId/restore` | Business | Restaurar negocio |
| `PATCH` | `/api/businesses/:businessId/availability` | Business | Actualizar disponibilidad (estado + cierre temporal) |
| `GET` | `/api/businesses/:businessId/schedules` | Schedules | Listar horarios |
| `GET` | `/api/businesses/:businessId/schedules/:scheduleId` | Schedules | Obtener horario |
| `POST` | `/api/businesses/:businessId/schedules` | Schedules | Crear horario |
| `PATCH` | `/api/businesses/:businessId/schedules/:scheduleId` | Schedules | Actualizar horario |
| `GET` | `/api/businesses/:businessId/product-types` | Product Types | Listar tipos de producto |
| `GET` | `/api/businesses/:businessId/product-types/:productTypeId` | Product Types | Obtener tipo de producto |
| `POST` | `/api/businesses/:businessId/product-types` | Product Types | Crear tipo de producto |
| `PATCH` | `/api/businesses/:businessId/product-types/:productTypeId` | Product Types | Actualizar tipo de producto |
| `DELETE` | `/api/businesses/:businessId/product-types/:productTypeId` | Product Types | Soft-delete tipo de producto |
| `PATCH` | `/api/businesses/:businessId/product-types/:productTypeId/restore` | Product Types | Restaurar tipo de producto |
| `GET` | `/api/businesses/:businessId/products` | Products | Listar productos (filtros: status, typeId, visibleInCatalog, search, includeDeleted) |
| `GET` | `/api/businesses/:businessId/products/:productId` | Products | Obtener producto |
| `POST` | `/api/businesses/:businessId/products` | Products | Crear producto (con stock) |
| `PATCH` | `/api/businesses/:businessId/products/:productId` | Products | Actualizar producto |
| `DELETE` | `/api/businesses/:businessId/products/:productId` | Products | Soft-delete producto |
| `PATCH` | `/api/businesses/:businessId/products/:productId/restore` | Products | Restaurar producto |
| `GET` | `/api/businesses/:businessId/catalog` | Catalog | Catálogo visible agrupado por tipo |
| `GET` | `/api/businesses/:businessId/inventory` | Inventory | Inventario completo |
| `GET` | `/api/businesses/:businessId/inventory/products/:productId` | Inventory | Stock de un producto específico |
| `PATCH` | `/api/businesses/:businessId/inventory/products/:productId/stock` | Inventory | Actualizar stock manual |
| `POST` | `/api/businesses/:businessId/orders` | Orders | Crear pedido (con reserva de inventario) |
| `GET` | `/api/businesses/:businessId/orders` | Orders | Listar pedidos (filtros: status, customerId, search) |
| `GET` | `/api/businesses/:businessId/orders/:businessOrderId` | Orders | Obtener pedido |
| `GET` | `/api/businesses/:businessId/orders/:businessOrderId/logistics` | Orders | Obtener payload logístico |
| `PATCH` | `/api/businesses/:businessId/orders/:businessOrderId/preparing` | Orders | Mover a "preparando" |
| `PATCH` | `/api/businesses/:businessId/orders/:businessOrderId/ready-for-pickup` | Orders | Mover a "listo para recoger" |
| `GET` | `/api/metrics/daily` | Metrics | Métrica diaria |
| `GET` | `/api/metrics/range` | Metrics | Métricas por rango |
| `GET` | `/api/metrics/summary` | Metrics | Resumen de métricas |
| `POST` | `/api/metrics/rebuild` | Metrics | Reconstruir métricas |
| `POST` | `/api/promotions/requests` | Promotions | Crear solicitud de promoción |
| `GET` | `/api/promotions/requests` | Promotions | Buscar solicitudes |
| `GET` | `/api/promotions/requests/:id` | Promotions | Solicitud por ID |
| `PATCH` | `/api/promotions/requests/:id/external-response` | Promotions | Responder solicitud |
| `POST` | `/api/promotions/references/sync` | Promotions | Sincronizar referencia |
| `GET` | `/api/promotions/references` | Promotions | Buscar referencias |
| `GET` | `/api/promotions/sync-history` | Promotions | Historial de sincronización |

### Internos (integración con otros servicios)

| Método | Ruta | Módulo | Descripción |
|---|---|---|---|
| `GET` | `/api/internal/business-orders/:externalOrderCode` | Orders | Pedido por código externo |
| `GET` | `/api/internal/business-orders/:externalOrderCode/logistics-payload` | Orders | Payload logístico por código externo |
| `POST` | `/api/internal/business-orders/confirm-order` | Orders | Confirmar pedido (consume reserva) |
| `POST` | `/api/internal/business-orders/evaluate-cancellation-penalty` | Orders | Evaluar penalización |
| `POST` | `/api/internal/business-orders/cancel` | Orders | Cancelar pedido |
| `GET` | `/api/internal/businesses/:businessId/base-catalog` | Catalog | Catálogo base interno |
| `POST` | `/api/internal/business-orders/validate-and-reserve` | Inventory | Validar stock y reservar |
| `POST` | `/api/internal/business-orders/release-reservation` | Inventory | Liberar reserva |
| `POST` | `/api/internal/business-orders/confirm` | Inventory | Confirmar reserva |
| `POST` | `/api/internal/business-orders/delivery/link` | Deliveries | Vincular entrega a pedido |
| `GET` | `/api/internal/business-orders/:externalOrderCode/delivery` | Deliveries | Entrega por código de pedido |
| `GET` | `/api/internal/business-orders/delivery/by-logistics-order/:code` | Deliveries | Entrega por código logístico |
| `POST` | `/api/internal/business-orders/delivery/update-status` | Deliveries | Actualizar estado de entrega |
| `POST` | `/api/internal/business-orders/delivery/fee-adjustments/request` | Fee Adjustments | Solicitar ajuste de tarifa |
| `GET` | `/api/internal/business-orders/delivery/fee-adjustments/by-order/:code` | Fee Adjustments | Ajustes por código de pedido |
| `GET` | `/api/internal/business-orders/delivery/fee-adjustments/by-logistics-order/:code` | Fee Adjustments | Ajustes por código logístico |
| `POST` | `/api/internal/business-orders/delivery/fee-adjustments/resolve` | Fee Adjustments | Resolver ajuste |

---

## Patrones Arquitectónicos

1. **Modular monolith con capas DDD**: Cada módulo sigue estructura `presentation/` → `application/` → `domain/` → `infrastructure/`
2. **Repository pattern**: Acceso a BD mediante repositorios con inyección de dependencias
3. **Soft-deletes**: `business`, `product`, `product_type` usan `deleted_at`
4. **Snapshot pattern**: Pedidos y entregas preservan valores históricos (precios, nombres)
5. **Máquina de estados**: Pedidos y entregas con transiciones estrictas y auditoría completa
6. **Prefijo global**: `/api`
7. **Swagger**: Documentación automática en `/api/docs`
8. **Módulos con raw SQL**: `promotions` y `metrics` usan consultas SQL directas (no Prisma queries)

---

## Flujo de Pedido (Order Lifecycle)

```
pending_validation → reserved → confirmed → preparing → ready_for_pickup → dispatched → delivered
                                                                                        → cancelled
```

1. **Creación**: Valida negocio y productos, calcula snapshots financieros, reserva inventario
2. **Confirmación**: Consume la reserva (solo desde `reserved`)
3. **Preparación**: Marca como `preparing`
4. **Listo para recoger**: Marca como `ready_for_pickup`
5. **Despacho y entrega**: Gestionado por el módulo de deliveries
6. **Cancelación**: Evalúa penalización según reglas del negocio, libera inventario

---

## Módulos Implementados vs Pendientes

| Módulo | Estado |
|---|---|
| Health | Completado |
| Business | Completado |
| Schedules | Completado |
| Product Types | Completado |
| Products | Completado |
| Inventory | Completado |
| Orders | Completado |
| Deliveries | Completado |
| Delivery Fee Adjustments | Completado |
| Promotions | Completado |
| Metrics | Completado |
| Support | Placeholder (vacío) |

---

## Testing

- **Unitarios**: Configurados con Jest (ts-jest), pero sin tests implementados aún
- **E2E**: Un test boilerplate en `test/app.e2e-spec.ts` (fallará porque la ruta `/` no existe)
- Scripts: `npm test`, `npm run test:watch`, `npm run test:cov`, `npm run test:e2e`

---

## Variables de Entorno (validadas con Joi)

| Variable | Requerida | Default |
|---|---|---|
| `NODE_ENV` | No | `development` |
| `PORT` | No | `3000` |
| `DATABASE_URL` | **Sí** | — |

---

## Colección de Postman

Se encuentra disponible en:
```
context/postman/LOGISTICA-RESTAURANTES-NEGOCIOS.postman_collection.json
```
