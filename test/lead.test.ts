import { test } from 'node:test';
import assert from 'node:assert';
import { POST } from '../src/pages/api/lead.ts';

// Helper to create a mocked Astro context with a Request object
function mockAstroContext(bodyData: any, isJson = true): any {
  const request = new Request('http://localhost:4321/api/lead', {
    method: 'POST',
    headers: isJson ? { 'Content-Type': 'application/json' } : {},
    body: isJson ? JSON.stringify(bodyData) : bodyData,
  });

  return { request };
}

test('API lead endpoint - success on valid data', async () => {
  const payload = {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '9981234567',
    location: 'Centro',
    description: 'Necesito una barda perimetral de 15 metros.',
    email_confirm: '', // Empty honeypot
  };

  const context = mockAstroContext(payload);
  const response = await POST(context);

  assert.strictEqual(response.status, 200);
  const data = await response.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.message, 'Lead received');
});

test('API lead endpoint - honeypot filtering (returns 200 but deceives bot)', async () => {
  const payload = {
    name: 'Bot Spam',
    email: 'spam@bot.com',
    phone: '0000000000',
    location: 'Zona Hotelera',
    description: 'Spam description',
    email_confirm: 'gotcha@bot.com', // Filled honeypot!
  };

  const context = mockAstroContext(payload);
  const response = await POST(context);

  assert.strictEqual(response.status, 200);
  const data = await response.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.message, 'Lead received');
});

test('API lead endpoint - fails validation on missing fields', async () => {
  const fields = ['name', 'email', 'phone', 'location', 'description'];

  for (const field of fields) {
    const payload: any = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '9981234567',
      location: 'Centro',
      description: 'Necesito una barda perimetral de 15 metros.',
    };
    
    // Delete one field at a time to test validation
    delete payload[field];

    const context = mockAstroContext(payload);
    const response = await POST(context);

    assert.strictEqual(response.status, 400);
    const data = await response.json();
    assert.strictEqual(data.success, false);
    assert.match(data.message, /requerido/);
  }
});

test('API lead endpoint - fails validation on invalid JSON', async () => {
  const context = mockAstroContext('not-a-json', false);
  const response = await POST(context);

  assert.strictEqual(response.status, 400);
  const data = await response.json();
  assert.strictEqual(data.success, false);
  assert.match(data.message, /JSON/);
});
