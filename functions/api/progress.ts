import { books } from '../../src/books';

interface Statement {
  bind(...values: (string | number)[]): Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
}

interface Environment {
  PROGRESS_DB?: {
    prepare(sql: string): Statement;
    batch(statements: Statement[]): Promise<unknown>;
  };
  ADMIN_RESET_KEY?: string;
}

const bookIds = new Set(books.map(book => book.id));
const modes = new Set(['practice', 'speed', 'review']);
const levels = new Set(['easy', 'medium', 'hard', 'all']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const encoder = new TextEncoder();

function json(value: unknown, status = 200) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
}

function sameSecret(a: string, b: string) {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  let mismatch = left.length ^ right.length;
  for (let i = 0; i < left.length; i++) mismatch |= left[i] ^ (right[i] ?? 0);
  return mismatch === 0;
}

async function passwordHash(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: 100000 },
    key, 256,
  );
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost({ request, env }: { request: Request; env: Environment }) {
  const db = env.PROGRESS_DB;
  if (!db) return json({ error: 'Shared progress is not configured yet.' }, 503);

  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  if (Number(request.headers.get('Content-Length')) > 16_384) return json({ error: 'Request too large.' }, 413);

  try {
    const raw = await request.text();
    if (raw.length > 16_384) return json({ error: 'Request too large.' }, 413);
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object') return json({ error: 'Invalid request.' }, 400);

    if (body.action === 'student') {
      const { id, name, finished, result } = body;
      if (typeof id !== 'string' || !uuid.test(id) || typeof name !== 'string'
        || !name.trim() || name.length > 40 || !Array.isArray(finished)
        || finished.length > books.length || finished.some(book => !bookIds.has(book))) {
        return json({ error: 'Invalid student information.' }, 400);
      }
      if (result != null && (typeof result.id !== 'string' || !uuid.test(result.id)
        || !bookIds.has(result.bookId) || !modes.has(result.mode) || !levels.has(result.difficulty)
        || !Number.isInteger(result.total) || result.total < 1 || result.total > 40
        || !Number.isInteger(result.correct) || result.correct < 0 || result.correct > result.total)) {
        return json({ error: 'Invalid quiz result.' }, 400);
      }
      const statements = [
        db.prepare('INSERT INTO students (id, name) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, updated_at = CURRENT_TIMESTAMP').bind(id, name.trim()),
        db.prepare('DELETE FROM finished_books WHERE student_id = ?').bind(id),
        ...[...new Set<string>(finished)].map(book => db.prepare('INSERT INTO finished_books VALUES (?, ?)').bind(id, book)),
      ];
      if (result) {
        statements.push(db.prepare(
          'INSERT INTO quiz_results (id, student_id, book_id, mode, difficulty, correct, total) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING',
        ).bind(result.id, id, result.bookId, result.mode, result.difficulty, result.correct, result.total));
      }
      await db.batch(statements);
      return json({ ok: true });
    }

    if (body.action !== 'dashboard' && body.action !== 'reset') return json({ error: 'Unknown action.' }, 400);
    const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
    const minute = Math.floor(Date.now() / 60_000);
    const attempt = await db.prepare(
      'INSERT INTO admin_attempts VALUES (?, ?, 1) ON CONFLICT(ip) DO UPDATE SET attempts = CASE WHEN minute = excluded.minute THEN MIN(attempts + 1, 16) ELSE 1 END, minute = excluded.minute RETURNING attempts',
    ).bind(ip, minute).first<{ attempts: number }>();
    if (!attempt || attempt.attempts > 15) return json({ error: 'Try again in a minute.' }, 429);

    if (body.action === 'reset') {
      if (!env.ADMIN_RESET_KEY || typeof body.resetKey !== 'string' || !sameSecret(env.ADMIN_RESET_KEY, body.resetKey)) {
        return json({ error: 'Incorrect reset key.' }, 401);
      }
      if (typeof body.password !== 'string' || body.password.length < 12 || body.password.length > 128) {
        return json({ error: 'Use a password of 12–128 characters.' }, 400);
      }
      const salt = crypto.randomUUID();
      const hash = await passwordHash(body.password, salt);
      await db.batch([
        db.prepare('INSERT INTO admin_password VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET salt = excluded.salt, hash = excluded.hash').bind(salt, hash),
      ]);
      return json({ ok: true });
    }

    const saved = await db.prepare('SELECT salt, hash FROM admin_password WHERE id = 1').first<{ salt: string; hash: string }>();
    if (!saved || typeof body.password !== 'string' || body.password.length > 128
      || !sameSecret(saved.hash, await passwordHash(body.password, saved.salt))) {
      return json({ error: 'Incorrect admin password.' }, 401);
    }
    const { results } = await db.prepare(`
      SELECT s.name, s.updated_at,
        (SELECT GROUP_CONCAT(f.book_id) FROM finished_books f WHERE f.student_id = s.id) AS finished,
        COUNT(q.id) AS sessions, COALESCE(SUM(q.correct), 0) AS correct,
        COALESCE(SUM(q.total), 0) AS total
      FROM students s LEFT JOIN quiz_results q ON q.student_id = s.id
      GROUP BY s.id ORDER BY s.name COLLATE NOCASE, s.id
    `).all();
    return json({ students: results });
  } catch (error) {
    if (error instanceof SyntaxError) return json({ error: 'Invalid request.' }, 400);
    return json({ error: 'Shared progress is temporarily unavailable.' }, 503);
  }
}

