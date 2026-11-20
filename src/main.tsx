import React, {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BookOpen, Trophy, Clock3, Users, Brain, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, XCircle, Sparkles, ShieldCheck, Target, Menu, X, Flag} from 'lucide-react';
import './style.css';
import { AdminDashboard, useStudentProgress } from './shared-progress';
import { books, type Book } from './books';
import { storyBanks } from './story-questions';
import { supplementalPrompts } from './supplemental-questions';
import { witchBoyDrafts, witchBoySource, type Difficulty } from './witch-boy-questions';
type Q={id:number;question:string;options:string[];answer:number;explanation:string;topic:string;status:'reviewed'|'draft';difficulty?:Difficulty;source?:string;clues?:string[]};
// Original demonstration questions. These are NOT official OBOB questions. Coaches should verify against the book before competition use.
const witchBoyQuestions:Q[]=[
{id:1,question:'What kind of magic does Aster want to learn?',options:['Shapeshifting','Witchcraft','Weather magic','Time travel'],answer:1,explanation:'Aster is drawn to witchcraft even though his family expects boys to learn shapeshifting.',topic:'Magic & traditions',status:'draft'},
{id:2,question:'What type of magic does Aster’s family traditionally teach boys?',options:['Witchcraft','Healing','Shapeshifting','Potion making'],answer:2,explanation:'Boys are expected to become shapeshifters, while girls are taught witchcraft.',topic:'Magic & traditions',status:'draft'},
{id:3,question:'What is the name of Aster’s friend from outside his magical family?',options:['Charlie','Rose','Mina','June'],answer:0,explanation:'Charlie becomes Aster’s friend and supports him.',topic:'Characters',status:'draft'},
{id:4,question:'Who wrote and illustrated The Witch Boy?',options:['Raina Telgemeier','Lee Knox Ostertag','Victoria Jamieson','Kazu Kibuishi'],answer:1,explanation:'Lee Knox Ostertag, credited as Molly Knox Ostertag in earlier editions, wrote and illustrated The Witch Boy.',topic:'Title & author',status:'draft'},
{id:5,question:'What happens to some boys in Aster’s family?',options:['They lose their memories','They mysteriously disappear','They turn into stone','They leave for school'],answer:1,explanation:'The disappearances become a central mystery in the story.',topic:'Plot',status:'draft'},
{id:6,question:'How does Aster learn about witchcraft when he is not supposed to?',options:['He watches the girls’ lessons','He attends a public school','Charlie gives him a spellbook','He learns from a stranger'],answer:0,explanation:'Aster secretly observes witchcraft lessons.',topic:'Plot',status:'draft'},
{id:7,question:'What is the central conflict Aster faces?',options:['He wants to become a professional athlete','He must choose between his interests and his family’s traditions','He cannot find his hometown','He wants to stop all magic'],answer:1,explanation:'Aster’s interest in witchcraft clashes with the gender-based rules of his family.',topic:'Themes',status:'draft'},
{id:8,question:'Which format best describes The Witch Boy?',options:['Poetry collection','Graphic novel','Play script','Nonfiction biography'],answer:1,explanation:'The Witch Boy tells its story using sequential art and dialogue in a graphic novel.',topic:'Book knowledge',status:'draft'}
];
const quizCoaches = {
  ready: {
    name: 'Page Turner the Owl', icon: '🦉',
    lines: ['Take a peek at each choice. Which one fits the story?', 'Think back to the scene. You might remember more than you expect.', 'Read the whole question before you swoop in.'],
  },
  correct: {
    name: 'Quiz Quokka', icon: '🐹',
    lines: ['You got it! I’m doing a tiny victory dance.', 'That detail stuck! Give your brain a high five.', 'Right on! I’d throw confetti, but it gets between the pages.'],
  },
  missed: {
    name: 'Bookmark Badger', icon: '🦡',
    lines: ['Even badgers lose their place. Read the answer and try the next one.', 'Good effort! Now you have one more detail to look for next time.', 'A tricky one! Let’s tuck the correct answer away for later.'],
  },
  timeout: {
    name: 'Tick-Tock Turtle', icon: '🐢',
    lines: ['Time slipped past us! Read the answer, then take a fresh start.', 'That clock was quick. Take a breath and get ready for the next question.', 'Even a turtle gets surprised by the timer. See what you can learn from this one.'],
  },
};

type RoundLevel = Difficulty | 'all';
const levelLabels: Record<RoundLevel, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  all: 'All levels',
};
const roundLevels: RoundLevel[] = ['easy', 'medium', 'hard', 'all'];

type Mode = 'practice' | 'speed' | 'review';
const modeLabels: Record<Mode, string> = {
  practice: 'Solo Practice',
  speed: 'Speed Round',
  review: 'Review Mistakes',
};
const legacyBookId = 'witch-boy';

function questionsFor(book: Book): Q[] {
  if (book.id === legacyBookId) {
    const existing = witchBoyQuestions.map((question): Q => ({
      ...question,
      difficulty: [5, 6, 7].includes(question.id) ? 'medium' : 'easy',
    }));
    const drafts = (Object.keys(witchBoyDrafts) as Difficulty[]).flatMap((difficulty, tier) =>
      witchBoyDrafts[difficulty].map(([question, correct, ...wrong], index): Q => {
        const options: string[] = [...wrong];
        const answer = (index + tier) % 4;
        options.splice(answer, 0, correct);
        return {
          id: 100 + tier * 100 + index,
          question, options, answer, difficulty,
          topic: difficulty === 'hard' ? 'Story analysis' : 'Story knowledge',
          explanation: correct,
          status: 'draft',
          source: witchBoySource,
        };
      })
    );
    return [...existing, ...drafts];
  }

  const distractors = books.filter(other => other.id !== book.id).slice(0, 3);
  const explanation = `${book.title} is by ${book.author}.`;
  const storyQuestions = storyBanks[book.id].prompts.map(([question, correct, ...wrong], index): Q => {
    const answer = (index + 2) % 4;
    const options = [...wrong];
    options.splice(answer, 0, correct);
    return { id: index + 3, question, options, answer, explanation: `Correct answer: ${correct}`, topic: 'Story knowledge', status: 'draft' };
  });
  const titleQuestions: Q[] = [
    { id: 1, question: `Who wrote ${book.title}?`, options: [distractors[0].author, book.author, distractors[1].author, distractors[2].author], answer: 1, explanation, topic: 'Title & author', status: 'draft' },
    { id: 2, question: `Which title is by ${book.author}?`, options: [distractors[0].title, distractors[1].title, book.title, distractors[2].title], answer: 2, explanation, topic: 'Title & author', status: 'draft' },
  ];
  const additionalQuestions = supplementalPrompts[book.id].trim().split('\n').map((line, index): Q => {
    const [question, correct, ...options] = line.split('|');
    const answer = (index + 1) % 4;
    options.splice(answer, 0, correct);
    return {
      id: 20 + index, question, options, answer, explanation: correct,
      topic: 'Story knowledge', status: 'draft',
    };
  });
  const details = [...storyQuestions, ...additionalQuestions];
  const recall = [...titleQuestions, ...details].map((question, index): Q => ({
    ...question,
    difficulty: index < 10 ? 'easy' : 'medium',
  }));
  const mediumCount = recall.length - 10;

  return [
    ...recall,
    ...Array.from({length: 15 - mediumCount}, (_, index) => matchingQuestion(details, 'medium', index)),
    ...Array.from({length: 15}, (_, index) => matchingQuestion(details, 'hard', index)),
  ];

}

function matchingQuestion(details: Q[], difficulty: 'medium' | 'hard', index: number): Q {
  const offsets = difficulty === 'medium' ? [0, 4 + Math.floor(index / details.length)] : [0, 3, 7 + Math.floor(index / details.length)];
  const clues = offsets.map(offset => details[(index + offset) % details.length]);
  const answers = clues.map(clue => clue.options[clue.answer]);
  const format = (values: string[]) => values.map((value, slot) => `${slot + 1}) ${value}`).join('  ·  ');
  const correct = format(answers);
  const distractors = [0, 1, 2].map(choice => format(answers.map((answer, slot) => {
    if (slot !== choice % clues.length) return answer;
    const clue = clues[slot];
    return clue.options[(clue.answer + 1 + Math.floor(choice / clues.length)) % clue.options.length];
  })));
  const answer = index % 4;
  distractors.splice(answer, 0, correct);
  return {
    id: (difficulty === 'medium' ? 100 : 200) + index,
    question: 'Which option answers every clue correctly?',
    clues: clues.map(clue => clue.question),
    options: distractors,
    answer, difficulty,
    explanation: correct,
    topic: 'Combined story clues',
    status: 'draft',
  };
}

function questionsAtDifficulty(book: Book, difficulty: RoundLevel): Q[] {
  const questions = questionsFor(book);
  return difficulty === 'all'
    ? questions
    : questions.filter(question => question.difficulty === difficulty);
}

type History={date:string;correct:number;total:number;mode:string;missed:number[];bookId?:string};
const readHistory=():History[]=>{try{return JSON.parse(localStorage.getItem('bookbattle-history')||'[]')}catch{return []}};
const finishedKey = 'bookbattle-finished-books';
function readFinished(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(finishedKey) ?? '[]');
    return Array.isArray(saved) ? books.filter(book => saved.includes(book.id)).map(book => book.id) : [];
  } catch {
    return [];
  }
}
function App(){
const [page,setPage]=useState<'home'|'library'|'difficulty'|'quiz'|'results'|'progress'|'admin'>(()=>location.pathname === '/admin' ? 'admin' : 'home');
const [mode,setMode]=useState<Mode>('practice');
const [book,setBook]=useState<Book|null>(null);
const [finished,setFinished]=useState(readFinished);
const student = useStudentProgress();
const [difficulty,setDifficulty]=useState<RoundLevel>('all');
const [order,setOrder]=useState<Q[]>([]);const [index,setIndex]=useState(0);const [chosen,setChosen]=useState<number|null>(null);const [responses,setResponses]=useState<Record<number,number>>({});const [history,setHistory]=useState<History[]>(readHistory);const [seconds,setSeconds]=useState(15);const [menu,setMenu]=useState(false);const [flagged,setFlagged]=useState<number[]>([]);
const active=order[index];
const coach = quizCoaches[chosen === null ? 'ready' : chosen === -1 ? 'timeout' : chosen === active?.answer ? 'correct' : 'missed'];
const coachLine = coach.lines[index % coach.lines.length];
const correct=order.filter(q=>responses[q.id]===q.answer).length;const missed=order.filter(q=>responses[q.id]!==undefined&&responses[q.id]!==q.answer).map(q=>q.id);
useEffect(()=>{if(page!=='quiz'||mode!=='speed'||chosen!==null)return; if(seconds<=0){setChosen(-1);setResponses(p=>({...p,[active.id]:-1}));return;}const timer=setTimeout(()=>setSeconds(s=>s-1),1000);return()=>clearTimeout(timer)},[page,mode,chosen,seconds,active]);
function toggleFinished(id: string) {
  const updated = finished.includes(id) ? finished.filter(bookId => bookId !== id) : [...finished, id];
  localStorage.setItem(finishedKey, JSON.stringify(updated));
  setFinished(updated);
  student.share(student.profile, updated);
}

function chooseBook(nextMode: Mode) {
  setMode(nextMode);
  nav('library');
}

function start(selectedBook: Book, nextMode: Mode, level: RoundLevel) {
  const questions = questionsAtDifficulty(selectedBook, level);
  setDifficulty(level);
  const pastSessions = history.filter(session => (session.bookId ?? legacyBookId) === selectedBook.id);
  const review = questions.filter(question => pastSessions.some(session => session.missed.includes(question.id)));
  const pool = nextMode === 'review' && review.length ? review : questions;
  setBook(selectedBook);
  setMode(nextMode);
  setOrder([...pool].sort(() => Math.random() - .5));
  setIndex(0);
  setChosen(null);
  setResponses({});
  setSeconds(15);
  setFlagged([]);
  setPage('quiz');
  window.scrollTo(0,0);
}
function pick(i:number){if(chosen!==null)return;setChosen(i);setResponses(p=>({...p,[active.id]:i}))}
function next(){if(index===order.length-1){const h={date:new Date().toISOString(),correct,total:order.length,mode,missed,bookId:book?.id};const updated=[h,...history].slice(0,100);setHistory(updated);localStorage.setItem('bookbattle-history',JSON.stringify(updated));if(book && student.profile) student.share(student.profile, finished, {id:crypto.randomUUID(),bookId:book.id,mode,difficulty,correct,total:order.length});setPage('results')}else{setIndex(i=>i+1);setChosen(null);setSeconds(15)}}
const nav=(p:'home'|'library'|'difficulty'|'progress')=>{if(location.pathname==='/admin') window.history.replaceState(null,'','/');setPage(p);setMenu(false);window.scrollTo(0,0)};
return <><header className="top"><div className="wrap topinner"><button className="brand" onClick={()=>nav('home')}><span className="brandicon"><BookOpen size={23}/></span><span>Book<span className="brandaccent">Battle</span><small>OBOB PRACTICE HUB</small></span></button><nav className={menu?'open':''}><button className={page==='home'?'selected':''} onClick={()=>nav('home')}>Discover</button><button onClick={()=>chooseBook('practice')}>Practice</button><button className={page==='progress'?'selected':''} onClick={()=>nav('progress')}>My Progress</button></nav><span className="unofficial">Unofficial community project</span><button className="hamburger" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></header>
<main className="wrap">{page==='admin'&&<AdminDashboard/>}{student.syncFailed&&page!=='admin'&&<p role="status">Shared progress could not sync. <button className="secondary" onClick={()=>void student.sync()}>Retry sync</button></p>}{page==='home'&&<><section className="hero"><div><span className="eyebrow"><Sparkles size={15}/> READ. REMEMBER. CONQUER.</span><h1>Every great reader<br/>is a <em>battle champion.</em></h1><p>Fun, focused practice for Oregon Battle of the Books. Master the stories, sharpen your memory, and get ready to shine with your team.</p><div className="actions"><button className="primary" onClick={()=>chooseBook('practice')}>Start practicing <ArrowRight size={18}/></button><button className="secondary" onClick={()=>nav('progress')}>View my progress</button></div><div className="herofoot"><span><ShieldCheck size={16}/> No account required</span><span><BookOpen size={16}/> Free to practice</span></div></div><div className="heroart"><div className="bookstack"><div className="book b1">READ<br/>PLAY<br/>LEARN <span>✦</span></div><div className="book b2">BOOK<br/>BATTLE</div><div className="book b3">READ<br/>MORE</div></div><div className="artbubble">Your next<br/><b>adventure</b><br/>starts here! ✨</div></div></section>

<section className="section"><div className="sectionheading"><div><span className="eyebrow dark">TRAIN YOUR WAY</span><h2>Choose your battle mode</h2></div></div><div className="modes"><button onClick={()=>chooseBook('practice')}><span className="modeicon purple"><Brain/></span><h3>Solo Practice</h3><p>Take your time, learn from explanations, and build confidence.</p><span>Let's go <ArrowRight size={16}/></span></button><button onClick={()=>chooseBook('speed')}><span className="modeicon orange"><Clock3/></span><h3>Speed Round</h3><p>15 seconds per question. Practice thinking quickly under pressure.</p><span>Beat the clock <ArrowRight size={16}/></span></button><button onClick={()=>chooseBook('review')}><span className="modeicon green"><Target/></span><h3>Review Mistakes</h3><p>Focus on questions you've missed in previous practice sessions.</p><span>Improve accuracy <ArrowRight size={16}/></span></button></div></section><section className="notice"><ShieldCheck size={22}/><div><b>Built for learning, not collecting data.</b><p>Practice works without an account. Enter a first name or nickname to share progress with your coach. Questions are original demonstration drafts, not official OBOB questions; verify them against the book before competition use.</p></div></section></>}
{page==='library'&&<section className="section">
  <button className="back" onClick={()=>nav('home')}><ArrowLeft size={16}/> Back to discover</button>
  <div className="sectionheading">
    <div><span className="eyebrow dark">THE LIBRARY</span><h2>Choose a book</h2><p>{modeLabels[mode]} · <span aria-live="polite">{finished.length} of {books.length} books finished</span></p></div>
    <span className="pill">2026–27 • Grades 3–5</span>
  </div>
  <form className="progress-form student-name" onSubmit={event=>{
    event.preventDefault();
    student.saveName(String(new FormData(event.currentTarget).get('studentName') ?? ''), finished);
  }}>
    <label>Student first name or nickname <input name="studentName" maxLength={40} required defaultValue={student.profile?.name} /></label>
    <button className="secondary">Save name</button>
    <small>Optional. A saved name shares this browser’s finished books and future quiz scores with the admin.</small>
  </form>
  <div className="book-picker">
    {books.map(title => <article className="book-choice" key={title.id}>
      <BookOpen size={20} aria-hidden="true"/>
      <h3>{title.title}</h3>
      <span>{title.author}</span>
      <label className="finished-book">
        <input type="checkbox" checked={finished.includes(title.id)} onChange={()=>toggleFinished(title.id)} aria-label={`Finished reading ${title.title}`}/>
        Finished reading
      </label>
      <button className="secondary" onClick={()=>{setBook(title);nav('difficulty')}} aria-label={`Choose difficulty for ${title.title}`}>
        Choose difficulty
      </button>
    </article>)}
  </div>
  <section className="practice-resources" aria-labelledby="practice-packets">
    <h3 id="practice-packets">Download more practice questions</h3>
    <p>Unofficial 2026–27 Grades 3–5 packets from Cedar Mill &amp; Bethany Community Libraries.</p>
    <ul className="packet-links">
      {Array.from({length: 12}, (_, index) => index + 1).map(set => <li key={set}>
        <a href={`https://library.cedarmill.org/wp-content/uploads/2026/09/OBOB_2027_Set-${String(set).padStart(2, '0')}.pdf`}>Set {set} (PDF)</a>
      </li>)}
    </ul>
  </section>
</section>}
{page==='difficulty'&&book&&<section className="section">
  <button className="back" onClick={()=>chooseBook(mode)}><ArrowLeft size={16}/> Back to books</button>
  <div className="sectionheading">
    <div><span className="eyebrow dark">{modeLabels[mode]} · {book.title}</span><h2>Choose a difficulty</h2></div>
  </div>
  <div className="book-picker">
    {roundLevels.map(level => <button className="book-choice" key={level} onClick={()=>start(book,mode,level)}>
      <strong>{levelLabels[level]}</strong>
      <span>{questionsAtDifficulty(book, level).length} questions</span>
    </button>)}
  </div>
</section>}
{page==='quiz'&&book&&<section className="quizpage"><button className="back" onClick={()=>chooseBook(mode)}><ArrowLeft size={16}/> Back to books</button><div className="quizshell"><div className="quiztop"><div><span className="eyebrow dark">{book.title}</span><h2>{modeLabels[mode]} · {levelLabels[difficulty]}</h2></div><span className="pill">Question {index+1} of {order.length}</span></div><div className="track"><div style={{width:`${(index+1)/order.length*100}%`}}/></div><div className="quizmeta"><span><BookOpen size={16}/> {active.topic}{active.difficulty && ` · ${active.difficulty}`}</span>{mode==='speed'&&<span className={seconds<=5?'urgent':''}><Clock3 size={16}/> {seconds}s left</span>}</div><h3>{active.question}</h3>{active.clues && <ol className="story-clues">{active.clues.map(clue => <li key={clue}>{clue}</li>)}</ol>}<div className="choices">{active.options.map((option,i)=><button key={i} disabled={chosen!==null} className={chosen!==null?(i===active.answer?'right':i===chosen?'wrong':'muted'):''} onClick={()=>pick(i)}><span className="letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{chosen!==null&&i===active.answer&&<CheckCircle2 size={19}/>} {chosen!==null&&i===chosen&&i!==active.answer&&<XCircle size={19}/>}</button>)}</div><div className="quiz-coach" role="status">
  <span className="coach-icon" aria-hidden="true">{coach.icon}</span>
  <div><b>{coach.name}</b><p>{coachLine}</p></div>
</div>{chosen!==null&&<div className="feedback"><b>{chosen===active.answer?'Correct!':chosen===-1?'Time’s up!':'Here’s the correct answer'}</b><p>{active.explanation}</p>{(active.source ?? storyBanks[book.id]?.source) && <p><a href={active.source ?? storyBanks[book.id]?.source}>Story reference</a></p>}<button className="primary" onClick={next}>{index===order.length-1?'See results':'Next question'} <ArrowRight size={17}/></button></div>}<div className="quizbottom"><span><Flag size={15}/> Draft question • verify with the book</span><button onClick={()=>setFlagged(p=>p.includes(active.id)?p.filter(x=>x!==active.id):[...p,active.id])}>{flagged.includes(active.id)?'Flagged for review':'Flag question'}</button></div></div></section>}
{page==='results'&&book&&<section className="resultpage"><div className="resultcard"><span className="resulticon"><Trophy size={34}/></span><span className="eyebrow dark">SESSION COMPLETE</span><h1>You finished the round!</h1><p>You completed your {mode==='speed'?'speed round':'practice round'} for {book.title}.</p><div className="bigscore">{correct}<span> / {order.length}</span></div><div className="scorelabel">{Math.round(correct/order.length*100)}% correct</div><div className="track"><div style={{width:`${correct/order.length*100}%`}}/></div><div className="actions center"><button className="primary" onClick={()=>start(book,mode,difficulty)}>Try another round <RotateCcw size={17}/></button><button className="secondary" onClick={()=>nav('progress')}>My progress <ArrowRight size={17}/></button><button className="secondary" onClick={()=>nav('difficulty')}>Change difficulty</button><button className="secondary" onClick={()=>chooseBook(mode)}>Choose another book</button></div></div><h2>Review your answers</h2><div className="reviewlist">{order.map((q,i)=><div key={q.id} className="reviewrow"><span className={responses[q.id]===q.answer?'good':'bad'}>{responses[q.id]===q.answer?<CheckCircle2 size={19}/>:<XCircle size={19}/>}</span><div><b>{i+1}. {q.question}</b>{q.clues && <ol>{q.clues.map(clue => <li key={clue}>{clue}</li>)}</ol>}<p>Correct answer: {q.options[q.answer]}</p></div></div>)}</div></section>}
{page==='progress'&&<section className="progresspage"><button className="back" onClick={()=>chooseBook(mode)}><ArrowLeft size={16}/> Back to books</button><span className="eyebrow dark">YOUR READING JOURNEY</span><h1>My Progress</h1><p>Your results are saved in this browser. If you save a name in the book library, future scores are also shared with your coach.</p><div className="stats"><div><span>Sessions completed</span><b>{history.length}</b></div><div><span>Questions answered</span><b>{history.reduce((s,h)=>s+h.total,0)}</b></div><div><span>Overall accuracy</span><b>{history.length?Math.round(history.reduce((s,h)=>s+h.correct,0)/history.reduce((s,h)=>s+h.total,0)*100):0}%</b></div></div><h2>Recent sessions</h2>{history.length?<div className="sessionlist">{history.map((h,i)=><div key={i}><span>{new Date(h.date).toLocaleDateString()} · {modeLabels[h.mode as Mode]} · {books.find(title=>title.id===(h.bookId ?? legacyBookId))?.title}</span><b>{h.correct}/{h.total} correct</b></div>)}</div>:<div className="empty"><Brain size={35}/><h3>No practice sessions yet</h3><p>Complete your first quiz to see your progress here.</p></div>}<div className="actions"><button className="primary" onClick={()=>chooseBook('practice')}>Practice now <ArrowRight size={17}/></button>{history.length>0&&<button className="secondary" onClick={()=>{if(window.confirm('Delete all locally saved practice results?')){localStorage.removeItem('bookbattle-history');setHistory([])}}}>Clear saved results</button>}</div></section>}</main><footer><div className="wrap footinner"><span><BookOpen size={18}/> BookBattle</span><p>Unofficial OBOB practice project · Not affiliated with Oregon Battle of the Books.</p><a href="/admin">Admin</a></div></footer></>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
