# Observabilidad

## 1. Principios

- **OpenTelemetry** como API única (traces, métricas, logs).
- Instrumentación ligada al código, no al proveedor.
- En perfil Sovereign, el *backend* de observabilidad corre **bajo control del cliente**, y los
  datos de telemetría se consideran datos sensibles (residencia obligatoria).

## 2. Stack recomendado por perfil

| Perfil | Backend | Notas |
|---|---|---|
| Commercial | Backend del proveedor o LGTM hosted | Rapidez de adopción |
| Sovereign | **Grafana LGTM** (Loki + Tempo + Mimir) o **SigNoz** | Self-hosted, sin egress de telemetría |

## 3. Señales a instrumentar (v1)

- **Red:** latencia REST/WS por endpoint, errores por contrato.
- **Eventos:** tiempo de procesamiento por tipo de evento y engine, cola BullMQ (profundidad,
  retries, dead-letter).
- **IA:** latencia y tokens por modelo/provider (vía LiteLLM), fallos por endpoint.
- **Negocio:** métricas de engines (decisiones de elegibilidad, matching, scoring de riesgo,
  pagos).
- **Infra:** K8s (Kubernetes Events, resource usage) y Postgres (slow queries, connections).

## 4. Trazabilidad distribuida

- Propagación W3C Trace Context en REST, WebSockets, NATS y BullMQ.
- `trace_id` visible en logs y audit log para correlación.
- Headers sensible: nunca loguear tokens, bodies de documentos ni datos personales.

## 5. Alertas (borrador)

1. Error rate REST > 1% (5m) → crítica.
2. Cola BullMQ con retries persistentes > umbral → aviso.
3. Proveedor de modelos degrade (latencia/5xx) → cambiar ruta en LiteLLM.
4. Slow query Postgres > umbral → optimize/índice.

## 6. Coste y soberanía

En sovereign: la telemetría se retiene N meses según política, luego se purga/archiva cifrada.
El costo del backend de observabilidad debe presupuestarse como componente propio.