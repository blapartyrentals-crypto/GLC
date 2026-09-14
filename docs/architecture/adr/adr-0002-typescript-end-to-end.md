# ADR-0002 — TypeScript end-to-end

- **Estado:** Aceptado
- **Fecha:** 2026-09-13

## Contexto

El stack declara TypeScript en frontend y backend. Para agentes y engines es ventajoso un único
lenguaje con tipado estático compartido: menos fricción, contratos fuertes, y un estándar de
revisión de seguridad único.

## Decisión

**TypeScript en todas las capas** (Next.js, NestJS, engines, agentes). Los contratos se declaran
una vez en `@glc/contracts` y se comparten.

## Consecuencias

- Positivas: tipos compartidos, refactors seguros, menos lenguajes que auditar.
- Negativas: para engines de cómputo intensivo (Matching/Risk a gran escala) Node puede ser
  cuello; se mitiga permitiendo extraer un engine a Rust/Go en el futuro sin romper contratos
  (a través del bus de eventos y contratos, el lenguaje del worker es transparente).

## Alternativas consideradas

- Python para agentes (LangGraph): más maduro en modelos, pero duplicaría el stack. Moonontenido
  el runtime de agentes aislado (ADR-0007) para no acoplarnos.