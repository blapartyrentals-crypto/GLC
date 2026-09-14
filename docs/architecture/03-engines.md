# Plataforma de Engines

Los 11 engines del stack viven como **paquetes aislados** del monorepo. Cada engine expone un
contrato TypeScript (`@glc/contracts`) y se comunica vía **eventos** (o HTTP síncrono para
consultas administrativas). Ningún engine depende de otro directamente: dependen del contrato y
del bus.

## Principios

1. **Aislamiento:** cada engine es un paquete con su propio `domain/`, `application/` e `infra/`.
2. **Contratos:** el paquete `@glc/contracts` define tipos, schemas de eventos y errores.
3. **Eventos:** publica/consume mensajes versionados (respetando compatibilidad hacia atrás).
4. **Persistencia:** cada engine declara sus tablas; la migración se maneja de forma agregada
   con RLS por tenant.
5. **Portabilidad:** no se importan detalles de infraestructura dentro de la lógica del engine.

## Los 11 engines

| # | Engine | Responsabilidad | Eventos clave (borrador) |
|---|---|---|---|
| 1 | **Identity** | Ciclo de vida de identidad ciudadana/institucional, verificación, vinculación | `identity.created`, `identity.verified` |
| 2 | **Mobility** | Desplazamientos, rutas, permisos de tránsito, movilidad civil | `mobility.route_requested`, `mobility.movement_authorized` |
| 3 | **Eligibility** | Evaluación de elegibilidad para programas/servicios | `eligibility.assessed` |
| 4 | **Policy / Rules** | Reglas de negocio versionadas, evaluación ABAC/reglas | `policy.rule_activated` |
| 5 | **Matching** | Emparejamiento (personas ↔ servicios ↔ oferta) con pgvector | `matching.suggestions_ready` |
| 6 | **Recommendation** | Recomendaciones personalizadas | `recommendation.generated` |
| 7 | **Risk** | Scoring de riesgo, controles, alertas | `risk.score_changed`, `risk.alert` |
| 8 | **Partner** | Ciclo de vida de partners, contratos, catálogo | `partner.registered`, `partner.contract_signed` |
| 9 | **Document Intelligence** | OCR, extracción, clasificación de documentos (modelos pluggables) | `document.ingested`, `document.classified` |
| 10 | **Payment** | Orquestación de pagos multi-proveedor | `payment.created`, `payment.settled` |
| 11 | **Notification** | Entrega de notificaciones (email, push, in-app) | `notification.queued`, `notification.delivered` |

## Estructura de un engine

```
engines/<engine>/src/
  index.ts            # exporta el módulo/contrato del engine
  domain/             # entidades, reglas de dominio, puertos (interfaces)
  application/        # casos de uso (sin dependencias externas)
  infra/              # adaptadores (DB, brokers, proveedores)
  events/             # esquemas de eventos emitidos/consumidos
  test/               # unit + contract tests
```

## Regla de oro

> Un engine **depende de contratos**, no de otro engine. La composición ocurre en la capa de
> aplicación (NestJS) orquestando flujos vía eventos y comandos.