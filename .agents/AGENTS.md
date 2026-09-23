# Reglas Particulares del Proyecto ite.ar (Landing Page Failover)

> **Área:** Landing Institucional de Respaldo y Failover Edge  
> **Constitución Maestra:** Hereda los principios universales de Frontend y Gobernanza de [`../ite/.agents/AGENTS.md`](../ite/.agents/AGENTS.md).  
> **URL Pública de Respaldo:** `https://gabrielow.github.io/ite.ar` (Failover automático desde `https://ite.ar`)  
> **Arquitectura:** Sitio Estático Puro (GitHub Pages + Cloudflare Edge)  

---

## 🏛️ 1. Rol en el Ecosistema y Failover 24/7

- **Origen Estático de Respaldo**: Aloja la versión estática de la landing page institucional desplegada automáticamente en GitHub Pages.
- **Failover Edge Automático**: El Cloudflare Worker `purple` en el borde redirige el tráfico hacia esta landing si la estación local o el motor Go de `ite-chat` no están disponibles (502, 503, 530).
- **Paridad Espejo**: Todo cambio visual o de copy debe reflejarse tanto en `landing/` de `ite-chat` como en este repositorio. Sincronización oficial mediante:
  ```powershell
  ..\ite\scripts\sync-landing.ps1
  ```

---

## ⚙️ 2. Arquitectura Estática y Resiliencia

- **100% Estático (Cero Runtime Backend)**: Prohibido introducir código Go (`*.go`), Node.js de servidor (`server.js`), ejecutables binarios (`*.exe`) o bases de datos.
- **Degradación Elegante (Graceful Degradation)**: Los scripts de cliente (`landing.js`) deben asumir que los endpoints locales de `ite-chat` (`:3002`) pueden estar fuera de línea. En caso de timeout o error de fetch, degradar con elegancia hacia contacto directo vía WhatsApp (`https://wa.me/...`) sin romper la UI ni emitir errores bloqueantes en consola.
- **Preservación de Archivos Raíz**: Mantener intacto `.nojekyll` para asegurar que GitHub Pages sirva los assets sin procesar Jekyll, y sincronizar metadatos en `landing.json`.
