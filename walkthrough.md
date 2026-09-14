# Walkthrough: Configuración y Verificación de Antojo en ite-chat

## 🎯 Objetivo Cumplido
1. Actualización y unificación del número oficial de **Antojo** a `3743548914` en todo el ecosistema.
2. Configuración, siembra y verificación del acceso a `ite-chat` (`:3002`) para **Antojo** con aislamiento multi-tenant físico estricto (100% separado de Jardín América).
3. Auditoría y verificación de las credenciales para **todas las jerarquías** (Superadmin Global, Administrador de Organización, y Colaborador/Asistente).

---

## 🔑 Matriz de Credenciales y Jerarquías en `ite-chat`

| Jerarquía / Rol | Organización (`org_id`) | Usuario | Contraseña | Alcance y Permisos |
| :--- | :---: | :---: | :---: | :--- |
| 👑 **Superadmin Global** | Multi-Tenant Global | `superadmin` | `admin123` | Control total del sistema, auditoría de logs, y capacidad de conmutar entre organizaciones mediante header `X-Org-Id`. |
| 🏛️ **Administrador Jardín América** | `org-default` | `admin` | `admin` | Administración completa de trámites, turnos, configuración y difusión de Jardín América. |
| 🧑‍💼 **Asistente Turnos Jardín América** | `org-default` | `jardinamerica.ar` | `jardinamerica.ar` | Carga y gestión operativa de turnos ANSES/municipales. |
| 🍔 **Administrador Antojo** | `antojo` | `antojo` | `antojo26` | Administración total de Antojo: pedidos delivery, catálogo, configuración básica, Drawflow FSM y CRM. |
| 🛵 **Colaborador Antojo** | `antojo` | `asistente_antojo` | `antojo26` | Operador de cocina y delivery: gestión de pedidos, visualización de CRM y turnos de retiro en mostrador. |

---

## 🛡️ Aislamiento Multi-Tenant Físico (Jardín América vs Antojo)

1. **Bases de Datos SQLite Independientes**:
   - `data/tenants/org-default.db`: **Jardín América** preservado al 100% con sus **8.352 contactos ciudadanos** y **41 turnos activos**.
   - `data/tenants/antojo.db`: Creado automáticamente con su propio esquema, configuración gastronómica, delivery (Ottawa 264) y plantilla Drawflow activa `tpl_antojo_rotiseria`.
2. **Anti-Spoofing Validado**:
   - Peticiones con token de `antojo` que intentan inyectar `X-Org-Id: org-default` son rechazadas de inmediato con **`403 Forbidden`** (`"Aislamiento de organización: no autorizado para acceder a otro tenant"`).
   - Solo `superadmin` puede auditar organizaciones arbitrarias.
3. **Persistencia Dinámica por Petición**:
   - Todos los handlers de `ite-chat` (`/api/v1/...`) resuelven en caliente la base de datos correspondiente al tenant del JWT mediante `s.getTenantRepo(c)`.

---

## 🧪 Resultados de Verificación Empírica

### 1. Pruebas de Login y Consulta de Configuración
```text
=== TEST LOGIN SUPERADMIN ===
✅ LOGIN OK: user_id=superadmin, org_id=org-default, org_nombre=Jardín América — Turnos, rol=superadmin
   Config Básica: {"org_nombre":"Jardín América","turno_prefijo":"JA","pedido_prefijo":"JA"}

=== TEST LOGIN JARDÍN AMÉRICA (ADMIN) ===
✅ LOGIN OK: user_id=admin, org_id=org-default, org_nombre=Jardín América — Turnos, rol=admin
   Config Básica: {"org_nombre":"Jardín América","turno_prefijo":"JA","pedido_prefijo":"JA"}

=== TEST LOGIN JARDÍN AMÉRICA (ASISTENTE) ===
✅ LOGIN OK: user_id=jardinamerica.ar, org_id=org-default, org_nombre=Jardín América — Turnos, rol=asistente

=== TEST LOGIN ANTOJO (ADMIN) ===
✅ LOGIN OK: user_id=antojo, org_id=antojo, org_nombre=Antojo — Rotisería & Sabores Regionales, rol=admin
   Config Básica: {"org_nombre":"Antojo — Rotisería & Sabores Regionales","turno_prefijo":"TUR","pedido_prefijo":"ANT"}

=== TEST LOGIN ANTOJO (COLABORADOR) ===
✅ LOGIN OK: user_id=asistente_antojo, org_id=antojo, org_nombre=Antojo — Rotisería & Sabores Regionales, rol=colaborador
```

### 2. Pruebas de Seguridad y Anti-Spoofing
```text
=== TEST ANTI-SPOOFING (Antojo -> org-default) ===
Status: 403 Forbidden
Body: {"error":"Aislamiento de organización: no autorizado para acceder a otro tenant"}

=== TEST SUPERADMIN SWITCH (Superadmin -> antojo vía X-Org-Id) ===
Status: 200 OK
Body: {"org_nombre":"Antojo — Rotisería & Sabores Regionales","turno_prefijo":"TUR","pedido_prefijo":"ANT"}
```

### 3. Flujo Interactivo y Plantilla Drawflow Antojo
```text
=== TEMPLATES FLUJO ANTOJO ===
Status: 200 OK
Template ID: tpl_antojo_rotiseria
Nombre: "Antojo — Rotisería & Delivery"
Horario cocina: 19:00 a 23:30 hs
Mensaje inactivo: "⚠️ En este momento la cocina de Antojo se encuentra cerrada. Nuestro horario de atención es de 19:00 a 23:30 hs."
Enlace Tienda: https://soldemayo.ar
```

### 4. Integración de Catálogo con `ite-eco` (:4000)
```text
=== CATALOGO ANTOJO DESDE ITE-ECO ===
Status: 200 OK
Responde catálogo en tiempo real con 3 artículos sincronizados.
```

---

## 🚀 Estado de Ejecución
- **Motor `ite-chat`**: Ejecutándose en puerto `:3002` mediante ventana visible dedicada (`powershell.exe`).
- **Túnel Cloudflare**: `ite-go-tunnel` (`https://ite.ar`).
- **Archivos de Verificación Limpios**: `go test ./...` pasa al 100% de manera exitosa en todos los paquetes.
