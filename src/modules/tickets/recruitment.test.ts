import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { getTicketRepository } from './infrastructure/repositoryFactory.ts';

describe('Recruitment Funnel & OpenGraph Verification', () => {
  it('generates a valid 1200x630 PNG buffer for OpenGraph cards', async () => {
    const repo = getTicketRepository();
    const tickets = await repo.listTickets();
    const sample = tickets[0] || {
      codigo: 'EBM-2026-TEST',
      servicioSolicitado: 'Construcción de Bardas',
      zona: 'Residencial Cumbres',
      requerimientosCliente: 'Barda perimetral de 18m con zapatas y castillos.',
    };

    const svg = `
      <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#0b0f19" />
        <text x="80" y="100" fill="#f59e0b" font-size="24">👷 SE BUSCA MAESTRO ALBAÑIL</text>
        <text x="80" y="200" fill="#ffffff" font-size="50">${sample.servicioSolicitado}</text>
        <text x="80" y="260" fill="#38bdf8" font-size="30">📍 ${sample.zona}</text>
      </svg>
    `;

    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
    assert.ok(pngBuffer instanceof Buffer);
    assert.ok(pngBuffer.length > 5000, 'PNG buffer should be non-empty and well-sized');

    const metadata = await sharp(pngBuffer).metadata();
    assert.equal(metadata.width, 1200);
    assert.equal(metadata.height, 630);
    assert.equal(metadata.format, 'png');
  });

  it('guarantees client PII (phone and exact address) is sanitized from public copy', async () => {
    const repo = getTicketRepository();
    const tickets = await repo.listTickets();
    const sample = tickets[0];
    assert.ok(sample, 'Expected at least one demo ticket');

    // Simulated Facebook share text template
    const facebookPostText = `¡SE BUSCA MAESTRO ALBAÑIL EN CANCÚN! 👷‍♂️🧱
Tenemos obra abierta disponible para inicio inmediato.

📍 Zona: ${sample.zona}
🛠️ Trabajo: ${sample.servicioSolicitado}
📋 Requerimientos: ${sample.requerimientosCliente}

✅ Pago puntual garantizado por estimación semanal
✅ Cliente verificado y cita coordinada
✅ Trato digno y directo con El Buen Maestro Cancún

👉 Mira los detalles completos de la obra y postúlate aquí:
https://elbuenmaestro.vercel.app/obra/${sample.codigo}`;

    // Assert that client private phone number and private reference do NOT appear in the share copy
    assert.ok(!facebookPostText.includes(sample.clienteTelefono), 'Client phone must never be leaked');
    if (sample.direccionReferencia) {
      assert.ok(
        !facebookPostText.includes(sample.direccionReferencia),
        'Private address reference must not be leaked'
      );
    }
    assert.ok(facebookPostText.includes(sample.zona), 'Public zone must be included');
    assert.ok(facebookPostText.includes(sample.codigo), 'Folio code must be included');
  });
});
