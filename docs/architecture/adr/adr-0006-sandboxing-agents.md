# ADR-0006 — Sandboxing de agentes con Firecracker/gVisor

- **Estado:** Aceptado
- **Fecha:** 2026-09-13

## Contexto

Los agentes ejecutan código y herramientas que pueden ser no confiables. Ejecutarlos en el
plano de datos sería un riesgo inaceptable en perfiles civiles y de defensa.

## Decisión

Ejecución de agentes en **sandboxes aislados** con **Firecracker-compatible** (VM micro) o
**gVisor** (user-space kernel) según proveedor de infraestructura.

- Cada ejecución de agente recibe un runtime efímero sin acceso al plano de datos salvo por
  API controlada.
- Credenciales acotadas por runtime (token con scope limitado).
- Sin egress no autorizado de datos.

## Consecuencias

- Positivas: aislamiento fuerte; fallo de un sandbox no compromete el cluster.
- Negativas: complejidad operativa (orquestar microVM/gVisor) y latencia de arranque. Mitigación:
  pool de sandboxes precalentados (futuro) y límites de coincidencia.

## Alternativas consideradas

- Contenedores del mismo cluster: más simple pero menor aislamiento para código arbitrario.
- VMs completas: máximo aislamiento pero costo y overhead altos.