# Guía de Alineación Google Business Profile (GBP) — El Buen Maestro

Guía estratégica para configurar y optimizar el perfil de **Google Business Profile (GBP)** alineado al 100% con la arquitectura SEO, schemas JSON-LD y cobertura geográfica del micrositio **El Buen Maestro**.

---

## 1. Categorías GBP (Primary & Secondary)

- **Categoría Principal (Primary Category)**: `Albañil` / `Masonry Contractor`
- **Categorías Secundarias (Secondary Categories)**:
  - `Contratista general` (General Contractor)
  - `Servicio de remodelación` (Remodeling Service)
  - `Contratista de suelos y pisos` (Flooring Contractor)
  - `Servicio de reparación y mantenimiento` (Building Restorer / Repair Service)

---

## 2. Cobertura Geográfica y Áreas de Servicio (Service Area)

Configurar como **Negocio de Área de Servicio (SAB)** en Cancún, Quintana Roo.

**Municipios y Código Postal**:
- Municipio: **Benito Juárez, Quintana Roo (Cancún)**
- Código Postal principal: **77500** y zonas aledañas

**Colonias y Zonas Clave (Spoke Coverage)**:
1. Zona Hotelera Cancún
2. Centro Cancún
3. Puerto Cancún
4. Alfredo V. Bonfil
5. Cumbres Cancún
6. Gran Santa Fe
7. Jardines del Sur
8. Prado Norte
9. Puerto Juárez
10. Villas del Mar
11. Villas Otoch

---

## 3. Descripción de la Empresa (E-E-A-T Copy — Max 750 caracteres)

```text
¿Buscás albañiles profesionales en Cancún con disponibilidad inmediata y garantía por escrito? En El Buen Maestro ofrecemos servicios integrales de albañilería y construcción residencial y comercial en todo Benito Juárez. Especialistas en construcción de bardas perimetrales de block, colocación de pisos y porcelanatos, remodelación de interiores con acabado anti-salitre y reparación de grietas o humedades causadas por el clima caribeño. Atendemos en Zona Hotelera, Cumbres, Puerto Cancún, Centro y zonas conurbadas. Cotización gratuita en menos de 24 horas y atención personalizada. Llámanos o escríbenos al 998 493 4110.
```

---

## 4. Lista de Servicios (GBP Services Dashboard)

Añadir los siguientes servicios estructurados dentro de la ficha de GBP:

1. **Construcción de Bardas Perimetrales**
   - *Descripción*: Muros de block, castillos y cadenas de concreto armado. Refuerzo estructural resistente a vientos y salitre marino en Cancún.
2. **Colocación de Pisos y Azulejos**
   - *Descripción*: Instalación de porcelanatos, losetas y mosaicos en pisos y muros. Preparación y nivelación de firme de concreto.
3. **Remodelación y Acabados de Interiores/Exteriores**
   - *Descripción*: Enjarre, repello, afines, yeso y aplicación de selladores impermeables especiales para alta humedad.
4. **Reparación de Grietas y Humedades Estructurales**
   - *Descripción*: Diagnóstico y corrección de filtraciones, grietas en losas/muros y eflorescencia salina en edificaciones costeras.

---

## 5. Verificación de Consistencia NAP (Name, Address, Phone)

- **Nombre Exacto del Negocio**: `El Buen Maestro - Albañiles en Cancún`
- **Teléfono Principal**: `998 493 4110` (Formato internacional: `+52 998 493 4110`)
- **Sitio Web URL**: `https://elbuenmaestro.vercel.app/`
- **Geo-Coordenadas Referenciales**: `21.1619, -86.8515` (Cancún, Q.R.)
- **Alineación de Schema JSON-LD**:
  - `LocalBusiness` / `ProfessionalService` en `src/content/pages/index.md` y `Layout.astro`.
  - Asegurar coincidencia exacta del teléfono `+529984934110` y los nombres de las zonas en `areaServed`.
