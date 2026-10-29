import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { getTicketRepository } from '../../../../modules/tickets/infrastructure/repositoryFactory.ts';

export const prerender = false;

function escapeXml(unsafe: string): string {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function wrapText(text: string, maxCharsPerLine = 60, maxLines = 3): string[] {
  const words = (text || '').trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
      if (lines.length === maxLines - 1) {
        break;
      }
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (words.length > 0 && lines.length === maxLines) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\.*$/, '...');
  }

  return lines;
}

export const GET: APIRoute = async ({ params }) => {
  const { codigo = '' } = params;
  const repo = getTicketRepository();
  const ticket = codigo ? await repo.getTicketByCodigo(codigo) : null;

  const servicio = ticket?.servicioSolicitado || 'Se Buscan Maestros Albañiles';
  const zona = ticket?.zona ? `Cancún · ${ticket.zona}` : 'Cancún y Riviera Maya';
  const codigoLabel = ticket?.codigo || 'CONVOCATORIA';
  const reqText =
    ticket?.requerimientosCliente ||
    'Buscamos maestros con experiencia en Cancún. Pago puntual garantizado por avance semanal, trato digno y clientes calificados todos los días.';

  const wrappedReqs = wrapText(reqText, 58, 3);
  const reqYPositions = [365, 400, 435];

  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0b0f19" />
        <stop offset="60%" stop-color="#141c2e" />
        <stop offset="100%" stop-color="#070a10" />
      </linearGradient>
      <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#fbbf24" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" stop-opacity="0.85" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)" />

    <!-- Blueprint Grid Lines Subtle -->
    <g stroke="#334155" stroke-width="0.5" opacity="0.25">
      <line x1="0" y1="100" x2="1200" y2="100" />
      <line x1="0" y1="200" x2="1200" y2="200" />
      <line x1="0" y1="300" x2="1200" y2="300" />
      <line x1="0" y1="400" x2="1200" y2="400" />
      <line x1="0" y1="500" x2="1200" y2="500" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="600" y1="0" x2="600" y2="630" />
      <line x1="800" y1="0" x2="800" y2="630" />
      <line x1="1000" y1="0" x2="1000" y2="630" />
    </g>

    <!-- Outer Frame -->
    <rect x="36" y="36" width="1128" height="558" rx="20" fill="none" stroke="#243044" stroke-width="2" />

    <!-- Top Badge Row -->
    <g transform="translate(72, 70)">
      <rect width="440" height="46" rx="23" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="1.8" />
      <text x="22" y="30" fill="#f59e0b" font-size="20" font-weight="bold" font-family="system-ui, -apple-system, sans-serif">
        👷 SE BUSCA MAESTRO ALBAÑIL
      </text>
    </g>

    <g transform="translate(930, 70)">
      <rect width="198" height="46" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text x="99" y="29" fill="#94a3b8" font-size="18" font-family="monospace" font-weight="bold" text-anchor="middle">
        ${escapeXml(codigoLabel)}
      </text>
    </g>

    <!-- Headline (Servicio) -->
    <text x="72" y="195" fill="#ffffff" font-size="50" font-weight="800" font-family="system-ui, -apple-system, sans-serif" letter-spacing="-0.5">
      ${escapeXml(servicio)}
    </text>

    <!-- Zone / Location -->
    <g transform="translate(72, 235)">
      <text x="0" y="0" fill="#38bdf8" font-size="28" font-weight="600" font-family="system-ui, -apple-system, sans-serif">
        📍 ${escapeXml(zona)}
      </text>
    </g>

    <!-- Requirements Card Box -->
    <rect x="72" y="275" width="1056" height="195" rx="16" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5" />

    <text x="100" y="318" fill="#f59e0b" font-size="16" font-weight="bold" font-family="system-ui, -apple-system, sans-serif" letter-spacing="1">
      DETALLES DE LA OBRA / REQUERIMIENTOS:
    </text>

    ${wrappedReqs
      .map(
        (line, idx) => `
    <text x="100" y="${reqYPositions[idx] || 365}" fill="#e2e8f0" font-size="23" font-family="system-ui, -apple-system, sans-serif">
      ${escapeXml(line)}
    </text>`
      )
      .join('')}

    <!-- Bottom Trust & Brand Footer -->
    <g transform="translate(72, 535)">
      <!-- Check 1 -->
      <circle cx="12" cy="-4" r="12" fill="#10b981" fill-opacity="0.2" />
      <text x="12" y="2" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">✓</text>
      <text x="32" y="0" fill="#10b981" font-size="20" font-weight="bold" font-family="system-ui, -apple-system, sans-serif">
        Pago Semanal Garantizado
      </text>

      <!-- Check 2 -->
      <circle cx="342" cy="-4" r="12" fill="#10b981" fill-opacity="0.2" />
      <text x="342" y="2" fill="#10b981" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">✓</text>
      <text x="362" y="0" fill="#10b981" font-size="20" font-weight="bold" font-family="system-ui, -apple-system, sans-serif">
        Cliente Verificado
      </text>

      <!-- Brand URL -->
      <text x="1056" y="0" fill="#f59e0b" font-size="22" font-weight="bold" text-anchor="end" font-family="system-ui, -apple-system, sans-serif">
        elbuenmaestrocancun.com
      </text>
    </g>
  </svg>
  `.trim();

  try {
    const pngBuffer = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();

    return new Response(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
};
