# Reglas del Proyecto ite.ar: Landing Page de Respaldo y Failover Edge

> **Área:** Gobernanza Integral del Agente de Inteligencia Artificial  
> **Eje de Arquitectura:** Landing Page Estática Pura, Respaldo 24/7 en GitHub Pages y Failover Cloudflare Edge  
> **Ecosistema:** `ite.ar` (Landing de Respaldo), `ite-chat` (Motor WhatsApp & Landing Activa), `ite-eco` (E-commerce) e `ite` (Meta-Orquestador SSOT)  
> **URL Pública de Respaldo:** `https://gabrielow.github.io/ite.ar` (Failover automático desde `https://ite.ar`)  

---

## 🏛️ Pilar 1: Integridad Operativa y del Workspace

### 1.1. Rol en el Ecosistema y Failover 24/7
- **Origen Estático de Respaldo**: Este repositorio aloja la versión estática de la landing page institucional desplegada automáticamente en GitHub Pages.
- **Failover Transparente Edge**: El Cloudflare Worker `purple` en el borde de Cloudflare redirige el tráfico hacia esta landing si la estación de trabajo local o el motor Go de `ite-chat` están apagados o responden con errores `502`, `503` o `530`.
- **Reciprocidad y Sincronización Autorizada**: Se autoriza formalmente la lectura, consulta y sincronización de assets estáticos y código de landing con los proyectos hermanos:
  - **`ite-chat`** (`../ite-chat/landing`): Fuente Única de Verdad (SSOT) del diseño y componentes dinámicos de la landing.
  - **`ite`** (`../ite`): Meta-Orquestador y SSOT de gobernanza global e infraestructura de túneles.
- **Aislamiento de Contexto**: Prohibido incorporar dependencias o referencias externas ajenas al ecosistema ITe.

### 1.2. Rutas Relativas Universales
- Toda referencia a assets, estilos o scripts debe ser estrictamente relativa a la raíz del sitio web (`assets/...`, `landing.css`, `landing.js`, `landing.json`).
- Prohibido el uso de rutas absolutas locales (`C:\Users\...`, `file:///...`).

---

## ⚙️ Pilar 2: Arquitectura Estática y Cero Runtime Backend

### 2.1. Prohibición Absoluta de Backend o Binarios
- **100% Estático**: Este repositorio es un sitio web estático puro servido directamente por GitHub Pages y CDNs.
- **Prohibición de Código de Servidor**: Queda terminantemente prohibido introducir código Go (`*.go`), Node.js de servidor (`server.js`), ejecutables binarios (`*.exe`) o bases de datos en este repositorio.

### 2.2. Tolerancia a Fallos y Degradación Elegante (Graceful Degradation)
- Todo script de cliente (`landing.js`) debe asumir que el motor local de `ite-chat` (`:3002`) puede estar fuera de línea.
- Si una petición AJAX/Fetch a los endpoints de la API falla, la interfaz debe degradar con elegancia, ofreciendo contacto directo a través de enlaces `https://wa.me/...` sin romper la navegación ni mostrar errores en la consola.

### 2.3. Cero Residuos y Preservación de Archivos Raíz
- Preservar el archivo `.nojekyll` en la raíz para garantizar que GitHub Pages sirva correctamente todos los assets sin procesar Jekyll.
- Mantener los metadatos de configuración en `landing.json`.

---

## 🎨 Pilar 3: Sistema de Diseño Frontend (Mobile-First y Paridad Espejo)

Ver especificación canónica en [SHARED_FRONTEND_DESIGN_SYSTEM_SPEC.md](../../ite/docs/architecture/SHARED_FRONTEND_DESIGN_SYSTEM_SPEC.md).

### 3.1. Mobile-First Progresivo (`min-width`)
- La base visual se diseña para pantallas móviles (320px-480px) y se amplía exclusivamente mediante `@media (min-width: ...)`.
- Prohibido el enfoque desktop-first con `max-width`.

### 3.2. Rendimiento y Cero Layout Shifts (CLS)
- Todas las imágenes, banners y logos en `assets/` deben contar con dimensiones reservadas o `aspect-ratio` nativo y atributos `loading="lazy"` y `decoding="async"`.
- Prohibido el uso de librerías CSS externas pesadas; utilizar Vanilla CSS puro sobre variables CSS de `landing.css`.

### 3.3. Ergonomía Táctil y Paridad con `ite-chat/landing`
- Touch targets mínimos de 44x44px en botones de llamada a la acción (CTA) y selectores.
- **Paridad Espejo**: Cualquier cambio en el contenido o diseño debe reflejarse en `landing/` de `ite-chat` para mantener sincronizada la experiencia entre el entorno activo y el entorno de failover.

---

## 🤖 Pilar 4: Ciclo de Vida del Agente y Presupuesto de Tokens

### 4.1. Clasificación de Cambios

#### ⚙️ TRIVIAL (Corrección puntual de textos, estilos o enlaces)
1. Analizar alcance del cambio.
2. Aplicar modificación de forma directa y limpia en `index.html`, `landing.css`, `landing.js` o `landing.json`.
3. Replicar el cambio en `../ite-chat/landing/` para preservar la paridad.

#### 🔧 COMPLEJO (Rediseño estructural o incorporación de nuevas secciones)
1. Realizar el diseño y prototipado prioritariamente en `../ite-chat/landing/`.
2. Validar visualmente y mediante pruebas responsive.
3. Sincronizar hacia `ite.ar` mediante el script `../ite/scripts/sync-landing.ps1`.
4. Verificar que no se hayan introducido rutas absolutas ni dependencias de backend.
