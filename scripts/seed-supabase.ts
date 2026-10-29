/**
 * Script to test connection to Supabase (local or cloud) and seed initial demo data.
 * Run with: npm run db:seed
 */
import { createClient } from '@supabase/supabase-js';

// Default credentials for local Supabase Docker stack (from `supabase start`)
const DEFAULT_LOCAL_URL = 'http://127.0.0.1:54321';
const DEFAULT_LOCAL_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4Mzg3OTYwMH0.local-service-role-key-placeholder';

const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_LOCAL_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  DEFAULT_LOCAL_SERVICE_ROLE_KEY;

console.log(`\n👷‍♂️ [El Buen Maestro] Comprobando conexión a Supabase...`);
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Key configurada: ${supabaseKey ? 'Sí (longitud: ' + supabaseKey.length + ')' : 'No'}\n`);

const client = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function main() {
  try {
    // 1. Test basic table query
    const { data: maestros, error: maestrosError } = await client
      .from('maestros')
      .select('*')
      .order('nombre');

    if (maestrosError) {
      console.error(`❌ Error al conectar con la tabla 'maestros':`, maestrosError.message);
      console.error(`💡 Pista: Si estás usando Supabase local, asegúrate de haber ejecutado 'npm run db:start'.`);
      console.error(`💡 Si usas Supabase Cloud, verifica que hayas corrido supabase/schema.sql en el SQL Editor.`);
      process.exit(1);
    }

    console.log(`✅ Conexión exitosa a PostgreSQL. Maestros encontrados: ${maestros?.length ?? 0}`);

    // 2. Check storage bucket
    const { data: buckets, error: bucketsError } = await client.storage.listBuckets();
    if (bucketsError) {
      console.warn(`⚠️ Advertencia al listar buckets de Storage:`, bucketsError.message);
    } else {
      const hasBucket = buckets?.some((b) => b.name === 'obras-evidencias');
      if (hasBucket) {
        console.log(`✅ Bucket de Storage 'obras-evidencias' verificado y disponible.`);
      } else {
        console.log(`ℹ️ Creando bucket 'obras-evidencias'...`);
        const { error: createErr } = await client.storage.createBucket('obras-evidencias', {
          public: true,
        });
        if (createErr) {
          console.warn(`⚠️ No se pudo crear el bucket automáticamente: ${createErr.message}`);
        } else {
          console.log(`✅ Bucket 'obras-evidencias' creado exitosamente.`);
        }
      }
    }

    // 3. Seed Maestros if empty
    if (!maestros || maestros.length === 0) {
      console.log(`🌱 Insertando 2 maestros albañiles de muestra...`);
      const { error: seedMaestrosErr } = await client.from('maestros').insert([
        {
          nombre: 'Maestro Roberto Cauich',
          telefono: '529981112233',
          especialidad: 'Bardas, Estructuras y Obra Gris',
          pin: '1024',
          activo: true,
        },
        {
          nombre: 'Maestro Miguel Pech',
          telefono: '529984445566',
          especialidad: 'Pisos, Azulejos y Acabados Finos',
          pin: '2048',
          activo: true,
        },
      ]);
      if (seedMaestrosErr) {
        console.error(`❌ Error insertando maestros:`, seedMaestrosErr.message);
      } else {
        console.log(`✅ Maestros insertados: Roberto Cauich (PIN 1024) y Miguel Pech (PIN 2048).`);
      }
    } else {
      console.log(`ℹ️ Los maestros ya estaban registrados:`);
      for (const m of maestros) {
        console.log(`   - ${m.nombre} (${m.especialidad}) | PIN: ${m.pin}`);
      }
    }

    // 4. Verify Tickets
    const { data: tickets, error: ticketsErr } = await client
      .from('tickets')
      .select('id, codigo, estado, cliente_nombre, zona');

    if (ticketsErr) {
      console.error(`❌ Error consultando tabla 'tickets':`, ticketsErr.message);
    } else {
      console.log(`✅ Tabla 'tickets' lista. Registros actuales: ${tickets?.length ?? 0}`);
      if (tickets && tickets.length > 0) {
        for (const t of tickets) {
          console.log(`   - [${t.codigo}] ${t.cliente_nombre} (${t.zona}) -> Estado: ${t.estado}`);
        }
      }
    }

    console.log(`\n🎉 Base de datos lista y operativa para pruebas locales y producción.\n`);
  } catch (err: any) {
    console.error(`❌ Fallo inesperado en el script de seed:`, err?.message || err);
    process.exit(1);
  }
}

main();
