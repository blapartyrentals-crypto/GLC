# Seguridad y Cumplimiento

## 1. Modelo de amenazas (resumen)

| Activo | Amenaza principal | Mitigación |
|---|---|---|
| Datos de personas | Exfiltración, acceso no autorizado | Cifrado, RLS, ABAC, minimización |
| Claves | Robo de claves maestras | HSM/KMS, OpenBao, rotación |
| Agentes | Ejecución de código malicioso | Sandbox Firecracker/gVisor, sin egress no autorizado |
| Pipeline CI/CD | Inyección en la cadena | SLSA, imágenes firmadas, SBOM |
| Identidad | Phishing, robo de sesión | OIDC + MFA, sesiones cortas, mTLS |

## 2. Controles de seguridad

### 2.1 Identidad y acceso
- OIDC (Keycloak) con 2FA para humanos; SPIFFE/mTLS para servicios.
- RBAC mínimo + ABAC (OPA/Rego) para casos contextuales.
- **Least privilege** en roles y políticas de servicio.

### 2.2 Datos
- Cifrado en tránsito: TLS ≥ 1.3.
- Cifrado en reposo: AES-256; claves en KMS/HSM.
- RLS como segunda barrera multi-tenant.
- Backups cifrados; residencia de datos según perfil.

### 2.3 Aplicación
- Validación y sanitización de entradas (Zod en contratos).
- Sin secretos en repositorio (`.env` ignorado; solo `.env.example`).
- Logs de error sin datos sensibles.

### 2.4 Cadena de suministro (CRÍTICO para defensa)
1. **SBOM** generado en CI (CycloneDX).
2. **Firma de imágenes** con `cosign` y verificación en deploy (policy).
3. **Escaneo** de vulnerabilidades (Trivy) en imágenes y dependencias.
4. **SLSA** nivel ≥ 2 para el pipeline de release.
5. **Registry privado** (Harbor) con **espejo offline** para air-gap.

### 2.5 Ejecución de agentes
- Los agentes corren en **sandbox aislado** (Firecracker/gVisor) sin acceso de red al
  plano de datos salvo vía API controlada.
- Segregación de credenciales; cada runtime agente tiene un token acotado.

## 3. Cumplimiento (a definir por jurisdicción)

El stack habilita, pero **no sustituye**, la certificación normativa:

- Programas tipo FedRAMP / ENS / equivalentes por país.
- Auditoría de acceso con logs **tamper-evident** (append-only).
- Plan de respuesta a incidentes y retención de datos.

> Acción pendiente: definir la jurisdicción objetivo y los marcos regulatorios aplicables
> para priorizar la ruta de cumplimiento.

## 4. Controles técnicos de primera entrega

- [x] `.gitignore` para secretos y artefactos.
- [ ] Middleware de autenticación OIDC en API.
- [ ] Enforcer RLS por tenant en migraciones.
- [ ] Política OPA baseline (roles/permisos).
- [ ] SBOM + cosign + Trivy job en CI.
- [ ] Sandbox de agentes (gorbit isolation) en perfil sovereign.