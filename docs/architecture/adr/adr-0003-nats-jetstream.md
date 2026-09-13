# ADR-0003 — Event-driven con NATS JetStream

- **Estado:** Aceptado
- **Fecha:** 2026-09-13

## Contexto

El stack pide "event-driven". Se necesita un broker: soberano, air-gap friendly, ligero, que
pueda operar en un cluster K8s propio y en premisas sin internet.

## Decisión

**NATS JetStream** como broker de eventos por defecto.

- Publicación/consumo por subjects versionados (`glc.<domain>.<event>.v1`).
- Durabilidad con streams y consumidores.
- Compatible con perfil sovereign (no requiere servicios externos).

## Consecuencias

- Positivas: liviano, de fácil operación, tolerante a particiones con JetStream, licencia
  open-source, sirve para comercial y sovereign.
- Negativas: ecosistema de conectores menor que Kafka. Si el volumen futuro exige re-partitioning
  masivo o un conector específico, se puede evaluar Redpanda/Kafka sin tocar los contratos de
  eventos (es una decisión de infra, no de código).

## Alternativas consideradas

- Kafka/Redpanda: potente, pero para arrancar añade operación y recursos.
- Redis Streams: suficiente para colas BullMQ, pero como backbone de eventos soberano es
  menos robusto en persistencia/durabilidad que JetStream.