# ADR-0004 — Modelo agnóstico de IA vía LiteLLM Proxy

- **Estado:** Aceptado
- **Fecha:** 2026-09-13

## Contexto

El sistema usará modelos comerciales (pilot) y modelos locales/aprobados (sovereign). El cambio
de modelo no debe requerir cambios de código en los engines ni en los agentes.

## Decisión

Todos los accesos a modelos pasan por **LiteLLM Proxy**.

- El runtime de agentes y Document Intelligence hablan con LiteLLM vía API estándar.
- Las llaves y endpoints de modelos se configuran por perfil en OpenBao / envConfig.
- Soporta NVIDIA NIM-compatible, Qwen, modelos locales y comerciales.

## Consecuencias

- Positivas: portabilidad real del código entre perfiles; conmutación de modelo operativa sin
  release; telemetría de uso/unificada.
- Negativas: un punto más en la topología; un fallo de LiteLLM degrada la IA. Mitigación:
  run en HA y retry con fallback en el cliente.

## Alternativas consideradas

- LLM SDK directos por proveedor: rápido pero acopla código y hace la soberanía difícil.