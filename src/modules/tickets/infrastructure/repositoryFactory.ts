import type { TicketRepository } from '../domain/types.ts';
import { LocalFallbackTicketRepository } from './localFallbackRepository.ts';
import { SupabaseTicketRepository } from './supabaseRepository.ts';

let cachedRepository: TicketRepository | null = null;

function isRealSupabaseConfigured(url?: string, key?: string): boolean {
  if (!url || !key) return false;
  if (url.includes('your-project-id') || key.includes('your-service-role-key')) return false;
  return url.startsWith('https://');
}

export function getTicketRepository(): TicketRepository {
  if (cachedRepository) return cachedRepository;

  const supabaseUrl =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_URL) ||
    process.env.SUPABASE_URL;
  const supabaseKey =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_SERVICE_ROLE_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_ANON_KEY) ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (isRealSupabaseConfigured(supabaseUrl, supabaseKey)) {
    cachedRepository = new SupabaseTicketRepository(supabaseUrl!, supabaseKey!);
  } else {
    cachedRepository = new LocalFallbackTicketRepository();
  }

  return cachedRepository;
}

export function getAdminPassword(): string {
  return (
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.ADMIN_PASSWORD) ||
    process.env.ADMIN_PASSWORD ||
    'elbuenmaestro2026'
  );
}
