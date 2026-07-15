# Specification: Privacy and Cookies Policy Pages

## 1. Overview
This specification defines the requirements for the Privacy Policy page (`/politica-privacidad`) and the Cookie Policy page (`/politica-cookies`). These legal pages serve to comply with regulatory mandates while ensuring they do not interfere with the site's search engine optimization (SEO) architecture or display conversion elements.

## 2. Requirements

### 2.1 Owner Information
The legal pages MUST explicitly display the following identity details:
- Owner (Titular): `hstrejoluna`
- Contact Email: `hectortrejoluna23@gmail.com`

### 2.2 Layout and Presentation Constraints
- The legal pages MUST NOT display any lead capture sidebars, local SEO silo links, or standard conversion layouts.
- They MUST utilize a simplified, distraction-free layout containing only the legal text, contact information, and standard main header/footer navigation.

### 2.3 SEO and Linking Restrictions
- These pages MUST NOT be included in the internal SEO silo linking graph.
- Links targeting these pages MUST include the `rel="nofollow"` attribute.
- These pages MUST NOT contain links that feed back into the local SEO silo structure.

### 2.4 Legal Text Content (Spanish)
The pages MUST display professional, neutral Spanish policy text.

#### 2.4.1 Privacy Policy Text Draft (/politica-privacidad)
"**Política de Privacidad**

**1. Información del Titular**
El titular de este sitio web es hstrejoluna. Para cualquier consulta sobre la presente Política de Privacidad, puede contactarnos a través del correo electrónico: hectortrejoluna23@gmail.com.

**2. Tratamiento de Datos**
Este sitio web respeta la privacidad de sus usuarios. Los únicos datos de carácter personal que se recopilan son aquellos facilitados de forma voluntaria a través de los formularios de contacto. Estos datos se utilizarán exclusivamente para responder a las solicitudes de información y no se cederán a terceros, salvo obligación legal."

#### 2.4.2 Cookie Policy Text Draft (/politica-cookies)
"**Política de Cookies**

**1. Uso de Cookies**
Este sitio web utiliza cookies para mejorar la experiencia de usuario y analizar el tráfico de navegación.

**2. Tipos de Cookies y Consentimiento**
Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y cookies analíticas o publicitarias para recopilar estadísticas de uso. El usuario puede otorgar o rechazar el consentimiento para estas últimas a través del banner de consentimiento. Puede revocar o cambiar sus preferencias en cualquier momento."

## 3. Scenarios

### Scenario 1: Accessing the Privacy Policy Page
**Given** a user navigates to `/politica-privacidad`,
**When** the page loads,
**Then** the page MUST display the owner name "hstrejoluna" and email "hectortrejoluna23@gmail.com",
**And** the page MUST NOT display the lead capture sidebar or conversion forms,
**And** the page MUST NOT contain local SEO silo links.

### Scenario 2: Accessing the Cookie Policy Page
**Given** a user navigates to `/politica-cookies`,
**When** the page loads,
**Then** the page MUST display the owner name "hstrejoluna" and email "hectortrejoluna23@gmail.com",
**And** the page MUST NOT display the lead capture sidebar or conversion layouts.

### Scenario 3: Crawling Legal Pages for SEO Siloing
**Given** a search engine crawler traverses the website,
**When** scanning the main navigation or pages linking to the legal policies,
**Then** all links targeting `/politica-privacidad` and `/politica-cookies` MUST contain `rel="nofollow"`,
**And** the legal pages MUST NOT participate in the site's internal SEO link siloing structure.
