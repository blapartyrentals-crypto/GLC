# ADR-0007 — Runtime de agentes aislado (mitigación LangGraph.js)

- **Estado:** Aceptado
- **Fecha:** 2026-09-13

## Contexto

El stack usa **LangGraph.js**, más joven y con menor ecosistema que LangGraph (Python). Queremos
usarlo sin comprometer la posibilidad de intercambiar el runtime de agentes si hace falta.

## Decisión

El runtime de agentes es un **módulo aislado** (`agents/runtime`) que:

- Expone una API mínima (plan, step, callback, tools).
- Se comunica con el resto vía **eventos del bus** y **contratos** (`@glc/contracts`).
- No comparte tipos de dominio con la aplicación principal (excepto los contratos públicos).

De esta forma, si en un perfil soberano conviene un runtime Python/LangGraph (sidecar), el
contrato se mantiene: el resto del sistema **no** se entera del cambio.

## Consecuencias

- Positivas: mitigación del riesgo de madurez de LangGraph.js; intercambio transparente.
- Negativas: una capa de indirección adicional; se debe mantener el contrato de eventos
  estable y versionado.

## Alternativas consideradas

- Adoptar LangGraph (Python) desde ya: maduro, pero duplicaría stack y complica el monorepo TS.
- No aislar: simple, pero acopla el sistema a un runtime inmaduro.