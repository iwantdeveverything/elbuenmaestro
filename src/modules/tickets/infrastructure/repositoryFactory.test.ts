import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isRealSupabaseConfigured } from './repositoryFactory.ts';

describe('isRealSupabaseConfigured', () => {
  it('accepts local Docker Supabase URLs (127.0.0.1 and localhost over http)', () => {
    assert.equal(isRealSupabaseConfigured('http://127.0.0.1:54321', 'local-service-key'), true);
    assert.equal(isRealSupabaseConfigured('http://localhost:54321', 'local-service-key'), true);
  });

  it('keeps accepting hosted Supabase URLs over https', () => {
    assert.equal(isRealSupabaseConfigured('https://abcd1234.supabase.co', 'service-key'), true);
  });

  it('rejects missing values, .env.example placeholders, and plain-http remote hosts', () => {
    assert.equal(isRealSupabaseConfigured(undefined, 'key'), false);
    assert.equal(isRealSupabaseConfigured('https://abcd1234.supabase.co', undefined), false);
    assert.equal(
      isRealSupabaseConfigured('https://your-project-id.supabase.co', 'your-service-role-key-here'),
      false
    );
    assert.equal(isRealSupabaseConfigured('http://example.com', 'key'), false);
  });
});
