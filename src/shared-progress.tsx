import { useEffect, useState, type FormEvent } from 'react';
import { books } from './books';

type Profile = { id: string; name: string };
type QuizResult = { id: string; bookId: string; mode: string; difficulty: string; correct: number; total: number };
type ProgressUpdate = Profile & { action: 'student'; finished: string[]; result?: QuizResult };
const profileKey = 'bookbattle-student';
const queueKey = 'bookbattle-progress-queue';

async function request<T>(body: object): Promise<T> {
  const response = await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new Error(data?.error ?? 'Shared progress is unavailable.');
  return data;
}

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

export function useStudentProgress() {
  const [profile, setProfile] = useState(() => read<Profile | null>(profileKey, null));
  const [syncFailed, setSyncFailed] = useState(false);

  async function sync() {
    try {
      await flushProgress();
      setSyncFailed(false);
    } catch {
      setSyncFailed(true);
    }
  }

  function share(student: Profile | null, finished: string[], result?: QuizResult) {
    if (!student) return;
    const queue = read<ProgressUpdate[]>(queueKey, []);
    localStorage.setItem(queueKey, JSON.stringify([...queue, { ...student, action: 'student', finished, result }]));
    void sync();
  }

  function saveName(name: string, finished: string[]) {
    const student = { id: profile?.id ?? crypto.randomUUID(), name: name.trim() };
    if (!student.name) return;
    localStorage.setItem(profileKey, JSON.stringify(student));
    setProfile(student);
    share(student, finished);
  }

  useEffect(() => {
    void sync();
    window.addEventListener('online', sync);
    return () => window.removeEventListener('online', sync);
  }, []);

  return { profile, saveName, share, sync, syncFailed };
}

let flushing: Promise<void> | undefined;
function flushProgress() {
  if (!flushing) {
    flushing = (async () => {
      for (let queue = read<ProgressUpdate[]>(queueKey, []); queue.length; queue = read(queueKey, [])) {
        await request(queue[0]);
        const latest = read<ProgressUpdate[]>(queueKey, []);
        localStorage.setItem(queueKey, JSON.stringify(latest.slice(1)));
      }
    })().finally(() => { flushing = undefined; });
  }
  return flushing;
}

type StudentRow = { name: string; updated_at: string; finished: string | null; sessions: number; correct: number; total: number };

export function AdminDashboard() {
  const [reset, setReset] = useState(false);
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setMessage('');
    try {
      if (reset) {
        await request({ action: 'reset', password: data.get('password'), resetKey: data.get('resetKey') });
        setReset(false);
        setMessage('Password saved. Sign in with your new password.');
      } else {
        const result = await request<{ students: StudentRow[] }>({ action: 'dashboard', password: data.get('password') });
        setStudents(result.students);
      }
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setBusy(false);
    }
  }

  return <section className="section">
    <h1>Admin dashboard</h1>
    {students ? <>
      <button className="secondary" onClick={() => setStudents(null)}>Sign out</button>
      <h2>Student progress</h2>
      {students.length === 0 && <p>No shared student progress yet.</p>}
      <div className="book-picker">{students.map((student, index) => {
        const finished = books.filter(book => student.finished?.split(',').includes(book.id));
        return <article className="book-choice" key={index}>
          <h3>{student.name}</h3>
          <span>Last active {new Date(student.updated_at.replace(' ', 'T') + 'Z').toLocaleString()}</span>
          <span>{finished.length} of {books.length} books finished</span>
          <span>{student.sessions} quizzes · {student.correct}/{student.total} correct</span>
          {finished.length > 0 && <details><summary>Finished books</summary>
            <ul>{finished.map(book => <li key={book.id}>{book.title}</li>)}</ul>
          </details>}
        </article>;
      })}</div>
    </> : <>
      <form className="progress-form" onSubmit={submit} key={String(reset)}>
        {reset && <label>Reset key <input type="password" name="resetKey" required autoComplete="off" /></label>}
        <label>{reset ? 'New password' : 'Admin password'} <input type="password" name="password" required
          minLength={reset ? 12 : undefined} maxLength={128} autoComplete={reset ? 'new-password' : 'current-password'} /></label>
        <button className="primary" disabled={busy}>{reset ? 'Save password' : 'Sign in'}</button>
      </form>
      <button className="secondary" disabled={busy} onClick={() => { setReset(!reset); setMessage(''); }}>
        {reset ? 'Back to sign in' : 'Set or reset password'}
      </button>
    </>}
    {message && <p role="status">{message}</p>}
  </section>;
}
