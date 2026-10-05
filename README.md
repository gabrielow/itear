# ite.ar — Landing Institucional & Failover Edge 24/7

Repositorio espejo y origen estático puro para el dominio **https://ite.ar**, desplegado automáticamente en **GitHub Pages** para garantizar disponibilidad ininterrumpida y respaldo en caliente (*failover*) gestionado por Cloudflare.

## 🏛️ Componentes y Páginas Incluidas
- **Página Principal**: `index.html` (Mobile-First, Dark Glassmorphism, Single Primary CTA a WhatsApp).
- **Error 404 Personalizado**: `404.html` (Página de error integrada a la marca con retorno al inicio y soporte).
- **Aviso Legal**: `aviso-legal.html` (Información del titular, condiciones de uso y jurisdicción).
- **Política de Privacidad**: `privacidad.html` (Cumplimiento de Ley 25.326, derechos ARCO y soberanía de datos On-Premise).
- **Indexación y SEO**: `robots.txt` y `sitemap.xml` para motores de búsqueda (Google, Bing).
- **Metadatos y PWA**: `site.webmanifest`, Open Graph, Twitter Cards y Schema.org JSON-LD dual (`SoftwareApplication` + `LocalBusiness`).
- **Assets Vectoriales**: `assets/favicon.svg`, `assets/whatsapp.svg`, `assets/logo.svg`, `assets/bot-preview.svg`.

## 🍪 Arquitectura Zero-Cookies
Este sitio web es **100% libre de cookies de rastreo**, no utiliza trackers invasivos ni perfilado de terceros, eliminando la necesidad de banners emergentes y garantizando una velocidad de carga instantánea (<100 ms).

## 🔄 Sincronización Canónica
Cualquier cambio en `ite-chat/landing` se sincroniza con este repositorio ejecutando:
```powershell
..\ite\scripts\sync-landing.ps1 -Apply
```
