"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   ⚔️  NINDOPATH — Two paths. One rise.
   ─────────────────────────────────────────────────────────────────────────
   Single-file Next.js / React (TSX) productivity app for two ninjas.
   Deep orange + dark navy theme. Duolingo-style: home-first, bottom nav,
   big friendly buttons, mobile-first.
   ─────────────────────────────────────────────────────────────────────────
   Drop into Next.js app/page.tsx (or import as a component).
   Image assets:
     /public/avatars/{luffy,levi,anya,anya-bond,kakashi,sasuke,mikasa,tsunade,jiraiya}.png
     /public/pets/{shaggy_dog,ninja_pug,toad,tonton,pikachu,bond,huh_cat,panda}.png
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── TAGLINES (rotate daily) ─────────────────────────────────────────── */
const TAGLINES = [
  "Stronger together. Always.",
  "Two paths. One rise.",
  "Forge each other. Become legendary.",
  "Push each other. Surpass everything.",
  "Your rival is your greatest weapon.",
  "Grow fierce. Grow together.",
  "Side by side. Level by level.",
  "The strongest bonds forge the strongest ninjas.",
];
const AI_BONUS_TAGLINES = [
  "Train hard. Rise fearless. Together.",
  "Two flames. One blazing path.",
  "Stronger every day. Sharper every dawn.",
  "Iron sharpens iron. Ninjas sharpen ninjas.",
  "Path of shinobi. Built by two.",
];

/* ─── THEMES — Anime-first (10 total) ─────────────────────────────────── */
const THEMES: any = {
  naruto:   { name: "Naruto 🍥",          bg: "#0a1428", surface: "rgba(18,28,56,0.85)",  card: "rgba(249,115,22,0.06)", border: "rgba(249,115,22,0.35)", p: "#f97316", b: "#3b82f6", pk: "#f59e0b", g: "#10b981", text: "#fef3c7", muted: "#94a3b8", brand: "#ea580c", brand2: "#1e3a8a" },
  aot:      { name: "Attack on Titan ⚔️",  bg: "#0c1410", surface: "rgba(20,28,22,0.88)", card: "rgba(220,38,38,0.05)",  border: "rgba(220,38,38,0.30)",  p: "#dc2626", b: "#a16207", pk: "#9a3412", g: "#65a30d", text: "#fef3c7", muted: "#a8a29e", brand: "#b45309", brand2: "#7f1d1d" },
  demon:    { name: "Demon Slayer 🌊",     bg: "#08070c", surface: "rgba(20,12,30,0.88)", card: "rgba(20,184,166,0.06)", border: "rgba(20,184,166,0.30)", p: "#14b8a6", b: "#ec4899", pk: "#fbbf24", g: "#84cc16", text: "#ecfeff", muted: "#94a3b8", brand: "#0d9488", brand2: "#831843" },
  jjk:      { name: "Jujutsu Kaisen 👁️",   bg: "#0a0118", surface: "rgba(24,8,48,0.88)",  card: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.35)", p: "#8b5cf6", b: "#0ea5e9", pk: "#f43f5e", g: "#10b981", text: "#f3e8ff", muted: "#8b7ab0", brand: "#7c3aed", brand2: "#1e1b4b" },
  onepiece: { name: "One Piece 🏴‍☠️",      bg: "#0a1d2e", surface: "rgba(14,30,48,0.88)", card: "rgba(239,68,68,0.06)",  border: "rgba(239,68,68,0.30)",  p: "#ef4444", b: "#fbbf24", pk: "#0ea5e9", g: "#10b981", text: "#fef9c3", muted: "#a8c7e0", brand: "#dc2626", brand2: "#1e40af" },
  sakura:   { name: "Sakura 🌸",          bg: "#1a0a14", surface: "rgba(40,16,32,0.85)",  card: "rgba(236,72,153,0.06)", border: "rgba(236,72,153,0.30)", p: "#ec4899", b: "#a855f7", pk: "#f43f5e", g: "#10b981", text: "#fde6f0", muted: "#a87a92", brand: "#ec4899", brand2: "#7c3aed" },
  ocean:    { name: "Ocean 🌊",           bg: "#050d1a", surface: "rgba(8,24,52,0.85)",   card: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.30)", p: "#3b82f6", b: "#06b6d4", pk: "#a855f7", g: "#10b981", text: "#dbeafe", muted: "#7a8fb0", brand: "#0ea5e9", brand2: "#1e3a8a" },
  cyber:    { name: "Cyber 🌌",           bg: "#070714", surface: "rgba(18,14,40,0.85)",  card: "rgba(168,85,247,0.06)", border: "rgba(168,85,247,0.30)", p: "#a855f7", b: "#3b82f6", pk: "#ec4899", g: "#10b981", text: "#e2d9f3", muted: "#7c6fa0", brand: "#a855f7", brand2: "#3b82f6" },
  forest:   { name: "Forest 🌲",          bg: "#06140a", surface: "rgba(12,32,18,0.85)",  card: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.30)", p: "#10b981", b: "#84cc16", pk: "#f59e0b", g: "#22c55e", text: "#d1fae5", muted: "#6b9080", brand: "#10b981", brand2: "#16a34a" },
  galaxy:   { name: "Galaxy ✨",          bg: "#0a0218", surface: "rgba(24,8,48,0.85)",   card: "rgba(192,132,252,0.06)",border: "rgba(192,132,252,0.30)",p: "#c084fc", b: "#60a5fa", pk: "#f472b6", g: "#34d399", text: "#ede9fe", muted: "#8b7ab0", brand: "#c084fc", brand2: "#7c3aed" },
};

/* ─── RANKS (Naruto Shinobi) ──────────────────────────────────────────── */
const RANKS = [
  { name: "Academy Student",  emoji: "📖", min: 0 },
  { name: "Genin",            emoji: "🍃", min: 500 },
  { name: "Chunin",           emoji: "⚔️", min: 1500 },
  { name: "Tokubetsu Jonin",  emoji: "🌀", min: 3000 },
  { name: "Jonin",            emoji: "🔥", min: 5000 },
  { name: "ANBU",             emoji: "🦊", min: 8000 },
  { name: "Sannin",           emoji: "🐍", min: 12000 },
  { name: "Kage",             emoji: "👑", min: 18000 },
  { name: "Sage",             emoji: "🐸", min: 25000 },
  { name: "Legendary Hokage", emoji: "🌟", min: 40000 },
];
const getRank = (xp: number) => { let r = RANKS[0]; for (const x of RANKS) if (xp >= x.min) r = x; return r; };
const nextRank = (xp: number) => RANKS.find(r => r.min > xp) || RANKS[RANKS.length - 1];
const rankProgress = (xp: number) => { const c = getRank(xp), n = nextRank(xp); if (c.name === n.name) return 100; return ((xp - c.min) / (n.min - c.min)) * 100; };

/* ─── COLORS ─────────────────────────────────────────────────────────── */
const PRIORITY_COLORS: any = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
const CATEGORY_COLORS: any = { work: "#3b82f6", personal: "#a855f7", health: "#10b981", study: "#ec4899", other: "#6b7280" };

const EVENT_TYPES: any = {
  exam:     { label: "Exam",      icon: "📝", color: "#ef4444" },
  meeting:  { label: "Meeting",   icon: "🤝", color: "#3b82f6" },
  deadline: { label: "Deadline",  icon: "⏰", color: "#f59e0b" },
  birthday: { label: "Birthday",  icon: "🎂", color: "#ec4899" },
  selfcare: { label: "Self-care", icon: "🧘", color: "#10b981" },
  other:    { label: "Other",     icon: "📌", color: "#a855f7" },
};

/* ─── BADGES ─────────────────────────────────────────────────────────── */
const BADGES = [
  { id: "first_habit", icon: "🌱", name: "Seedling",      desc: "Complete first habit", tier: "common" },
  { id: "streak_3",    icon: "🔥", name: "On Fire",       desc: "3-day streak",         tier: "common" },
  { id: "streak_7",    icon: "⚡", name: "Thunder Week",   desc: "7-day streak",         tier: "rare" },
  { id: "streak_30",   icon: "💎", name: "Diamond Month", desc: "30-day streak",        tier: "epic" },
  { id: "streak_100",  icon: "🌌", name: "Eternal Flame", desc: "100-day streak",       tier: "legendary" },
  { id: "task_master", icon: "✅", name: "Task Master",    desc: "10 tasks done",        tier: "common" },
  { id: "task_legend", icon: "🏆", name: "Task Legend",    desc: "100 tasks done",       tier: "epic" },
  { id: "task_god",    icon: "🌠", name: "Task God",       desc: "1000 tasks done",      tier: "legendary" },
  { id: "pomo_5",      icon: "🍅", name: "Tomato Farmer",  desc: "5 Pomodoros",          tier: "common" },
  { id: "pomo_50",     icon: "🔴", name: "Focus Lord",     desc: "50 Pomodoros",         tier: "rare" },
  { id: "level_genin", icon: "🍃", name: "Genin Ascended", desc: "Reach Genin",          tier: "rare" },
  { id: "level_jonin", icon: "🔥", name: "Jonin Ascended", desc: "Reach Jonin",          tier: "epic" },
  { id: "level_kage",  icon: "👑", name: "Kage Ascended",  desc: "Reach Kage",           tier: "legendary" },
  { id: "combo_week",  icon: "🤝", name: "Combo Week",     desc: "7 combo days",         tier: "rare" },
  { id: "boss_slayer", icon: "⚔️", name: "Boss Slayer",    desc: "Win a Boss Battle",    tier: "rare" },
  { id: "journal_30",  icon: "📓", name: "Sage Scribe",    desc: "Journal 30 days",      tier: "epic" },
];
const TIER_GLOW: any = { common: "#10b981", rare: "#3b82f6", epic: "#a855f7", legendary: "#f97316" };

/* ─── AVATARS & PETS (image paths under /public) ─────────────────────── */
const AVATAR_OPTIONS = [
  { id: "luffy",     name: "Luffy",     file: "/avatars/luffy.png" },
  { id: "levi",      name: "Levi",      file: "/avatars/levi.png" },
  { id: "anya",      name: "Anya",      file: "/avatars/anya.png" },
  { id: "anya_bond", name: "Anya+Bond", file: "/avatars/anya-bond.png" },
  { id: "kakashi",   name: "Kakashi",   file: "/avatars/kakashi.png" },
  { id: "sasuke",    name: "Sasuke",    file: "/avatars/sasuke.png" },
  { id: "mikasa",    name: "Mikasa",    file: "/avatars/mikasa.png" },
  { id: "tsunade",   name: "Tsunade",   file: "/avatars/tsunade.png" },
  { id: "jiraiya",   name: "Jiraiya",   file: "/avatars/jiraiya.png" },
];
const PET_OPTIONS = [
  { id: "shaggy",  name: "Shaggy Pup",   file: "/pets/shaggy_dog.png", lines: ["Woof! You got this!", "*wags tail*", "Walk break? 🐾"] },
  { id: "pakkun",  name: "Ninja Pug",    file: "/pets/ninja_pug.png",  lines: ["*sigh* You're slacking.", "I'm watching, kid.", "Less scrolling, more grinding."] },
  { id: "toad",    name: "Sage Toad",    file: "/pets/toad.png",       lines: ["*croak* Wisdom comes to those who train.", "Sage mode: activate.", "Meditate, ninja."] },
  { id: "tonton",  name: "Tonton",       file: "/pets/tonton.png",     lines: ["Oink~ break time?", "Snack incoming!", "Tsunade-sama approves."] },
  { id: "pikachu", name: "Pikachu",      file: "/pets/pikachu.png",    lines: ["Pika pika!", "⚡ Thunderbolt procrastination!", "Pika-CHU!"] },
  { id: "bond",    name: "Bond",         file: "/pets/bond.png",       lines: ["*foresees you finishing*", "Tomorrow looks productive.", "I see victory."] },
  { id: "huh_cat", name: "Huh? Cat",     file: "/pets/huh_cat.png",    lines: ["Huh? You done yet?", "*confused mrrrp*", "Nya~ stop scrolling."] },
  { id: "panda",   name: "Bamboo Panda", file: "/pets/panda.png",      lines: ["*munch munch* you got this", "Chill mode 🎋", "Eat, sleep, focus, repeat."] },
];

const POMO_PRESETS = [5, 10, 15, 20, 25, 30, 45, 50, 60, 90, 120, 180];

const QUOTES = [
  "The pain you feel today is the strength you feel tomorrow. — Naruto",
  "If you don't like your destiny, don't accept it. — Naruto",
  "Hard work is worthless for those who don't believe in themselves. — Naruto",
  "A genius? Hardly. I just work harder than anyone else. — Rock Lee",
  "Discipline equals freedom. — Jocko Willink",
  "Small steps every day. The future is built quietly.",
  "Focus is saying no to a thousand good things.",
  "You don't rise to your goals, you fall to your systems. — James Clear",
  "Your future is created by what you do today, not tomorrow.",
  "A river cuts through rock by persistence, not power.",
  "Be the energy you want to attract.",
  "Do it scared. Do it tired. Just do it.",
  "Champions train, losers complain.",
  "Be so good they can't ignore you.",
];

const DAILY_QUESTS = [
  { text: "Complete 3 tasks before 6pm",  xp: 80,  emoji: "⚡" },
  { text: "Do 2 Pomodoros in a row",      xp: 60,  emoji: "🍅" },
  { text: "Finish all high-priority",     xp: 120, emoji: "🔥" },
  { text: "Log a journal entry today",    xp: 50,  emoji: "📓" },
  { text: "Complete every habit today",   xp: 150, emoji: "🌿" },
  { text: "Read for 30 minutes",          xp: 70,  emoji: "📚" },
  { text: "Hit 8 glasses of water",       xp: 40,  emoji: "💧" },
  { text: "Hit 10k steps",                xp: 90,  emoji: "🏃" },
  { text: "No phone for 1 focus session", xp: 100, emoji: "📵" },
  { text: "Meditate 10 minutes",          xp: 50,  emoji: "🧘" },
];

const NINJA_MISSIONS = [
  { id: "m1", text: "Complete a 50-min focus session", xp: 200, minutes: 50,   emoji: "🥷" },
  { id: "m2", text: "Finish 5 tasks in one day",        xp: 300, minutes: 1440, emoji: "🌀" },
  { id: "m3", text: "Read 20 pages in one sitting",     xp: 150, minutes: 60,   emoji: "📖" },
  { id: "m4", text: "Workout streak of 3 days",         xp: 250, minutes: 4320, emoji: "💪" },
];

const MONTHLY_REVIEW_QUESTIONS = [
  "What are 3 wins from this month?",
  "What's one mistake or late task — and what did it teach you?",
  "What habit gave you the biggest energy this month?",
  "What drained you the most?",
  "What 1 thing will you carry into next month?",
  "What 1 thing will you let go of?",
  "What did you celebrate (big or small)?",
  "If next month were a perfect 10/10, what would change?",
];

const WEEKLY_PLANNING_QUESTIONS = [
  "Top 3 goals this week?",
  "Energy level this week (1-10)?",
  "Any scheduling blockers or busy days?",
  "What 1 thing will you say NO to this week?",
  "How will you celebrate progress this Friday?",
];

/* ─── HELPERS ─────────────────────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const nowTs = () => Date.now();
const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const isoOf = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => { const c = new Date(d); c.setDate(c.getDate() + n); return c; };
const startOfWeek = (d: Date) => { const c = new Date(d); const day = (c.getDay() + 6) % 7; c.setDate(c.getDate() - day); c.setHours(0,0,0,0); return c; };
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth()+1, 0);
const fmtDate = (s: string) => { if (!s) return ""; const d = new Date(s); return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }); };
const weekKey = (d=new Date()) => isoOf(startOfWeek(d));
const monthKey = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
const yearKey = (d=new Date()) => String(d.getFullYear());
const dayOfYear = (d=new Date()) => { const s = new Date(d.getFullYear(),0,0); return Math.floor((d.getTime() - s.getTime()) / 86400000); };

/* ─── STORAGE ─────────────────────────────────────────────────────────── */
const LS_KEY = "nindopath_state_v1";
const loadState = () => { try { if (typeof window === "undefined") return null; const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const saveState = (s: any) => { try { if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {} };

/* ─── INITIAL STATE ───────────────────────────────────────────────────── */
const makeUser = (id: string, name: string, emoji: string, color: string, pet: string, avatar: string): any => ({
  id, name, emoji, color, avatar, pet,
  xp: 0, tasks: [], habits: [], timers: [],
  pomodoroSessions: 0, completedTasks: 0, badges: [],
  settings: { pomoDuration: 25, shortBreak: 5, longBreak: 15, nudgeHour: 21 },
  goals: { week: {}, month: {}, year: {} },
  journal: {},
  reading: [],
  courses: [],
  monthlyReviews: {},
  weeklyPlanning: {},
  timeCapsules: [],
});

const seedInitial = () => ({
  activeUser: "u1",
  theme: "naruto",
  taglinePool: [...TAGLINES],
  users: {
    u1: {
      ...makeUser("u1", "Hana", "🌸", "#f97316", "shaggy", "anya"),
      xp: 320,
      tasks: [
        { id: uid(), title: "Design landing page",   priority: "high",   category: "work",     done: false, notes: "Figma + Tailwind", dueDate: today(), subtasks: [], createdAt: nowTs(), reactions: [], customXp: 0 },
        { id: uid(), title: "Read 30 pages of novel",priority: "medium", category: "personal", done: false, notes: "",                 dueDate: "",       subtasks: [], createdAt: nowTs(), reactions: [], customXp: 0 },
        { id: uid(), title: "Morning yoga",          priority: "low",    category: "health",   done: true,  notes: "",                 dueDate: "",       subtasks: [], createdAt: nowTs(), reactions: [], customXp: 0 },
      ],
      habits: [
        { id: uid(), name: "🧘 Meditate 10min",  color: "#a855f7", streak: 5,  lastDone: today(), history: [today()], xpPerDay: 30, freq: "daily", customXp: 0 },
        { id: uid(), name: "📚 Study 1 hour",    color: "#3b82f6", streak: 3,  lastDone: "",      history: [],        xpPerDay: 50, freq: "daily", customXp: 0 },
        { id: uid(), name: "💧 Drink 8 glasses", color: "#10b981", streak: 12, lastDone: today(), history: [today()], xpPerDay: 20, freq: "daily", customXp: 0 },
      ],
      timers: [{ id: uid(), label: "Deep Work", duration: 25*60, remaining: 25*60, running: false, phase: "focus", notes: "" }],
    },
    u2: {
      ...makeUser("u2", "Riku", "🌊", "#3b82f6", "huh_cat", "sasuke"),
      xp: 180,
      tasks: [
        { id: uid(), title: "Implement auth",         priority: "high",   category: "work",  done: false, notes: "Firebase", dueDate: today(), subtasks: [], createdAt: nowTs(), reactions: [], customXp: 0 },
        { id: uid(), title: "Japanese N3 vocab",       priority: "medium", category: "study", done: false, notes: "Anki",     dueDate: "",       subtasks: [], createdAt: nowTs(), reactions: [], customXp: 0 },
      ],
      habits: [
        { id: uid(), name: "🏃 Run 5km",       color: "#ec4899", streak: 2, lastDone: "",      history: [],        xpPerDay: 60, freq: "daily", customXp: 0 },
        { id: uid(), name: "✍️ Journal daily",color: "#f59e0b", streak: 7, lastDone: today(), history: [today()], xpPerDay: 25, freq: "daily", customXp: 0 },
      ],
      timers: [{ id: uid(), label: "Coding Sprint", duration: 25*60, remaining: 25*60, running: false, phase: "focus", notes: "" }],
    },
  },
  events: [],
  celebrationWall: [],
  bossBattle: { week: "", title: "", target: 30, u1: 0, u2: 0, done: false },
  dailyQuest: { date: "", quest: null as any, doneBy: [] as string[] },
  ninjaMissions: [],
  combos: {},
  pvp: null as any,
  whiteboard: [] as any[],     // [{id,from,points:[[x,y]...],color,size}]
  notifications: [] as any[],
});

const ensureDefaults = (s: any) => {
  if (!s) return seedInitial();
  const base = seedInitial();
  for (const k of Object.keys(base)) if (s[k] === undefined) s[k] = (base as any)[k];
  for (const uk of ["u1","u2"]) {
    const u = s.users?.[uk]; if (!u) continue;
    if (!u.goals) u.goals = { week: {}, month: {}, year: {} };
    if (!u.journal) u.journal = {};
    if (!u.reading) u.reading = [];
    if (!u.courses) u.courses = [];
    if (!u.monthlyReviews) u.monthlyReviews = {};
    if (!u.weeklyPlanning) u.weeklyPlanning = {};
    if (!u.timeCapsules) u.timeCapsules = [];
    if (!u.avatar) u.avatar = uk === "u1" ? "anya" : "sasuke";
    if (!u.pet) u.pet = uk === "u1" ? "shaggy" : "huh_cat";
    (u.tasks||[]).forEach((t:any) => { if (!t.reactions) t.reactions=[]; if (t.customXp === undefined) t.customXp = 0; });
    (u.habits||[]).forEach((h:any) => { if (!h.freq) h.freq="daily"; if (h.customXp === undefined) h.customXp = 0; });
    (u.timers||[]).forEach((t:any) => { if (t.notes === undefined) t.notes = ""; });
    if (!u.settings.nudgeHour) u.settings.nudgeHour = 21;
  }
  if (!s.theme) s.theme = "naruto";
  if (!s.taglinePool || !s.taglinePool.length) s.taglinePool = [...TAGLINES];
  return s;
};

/* ─── CSS BUILDER ─────────────────────────────────────────────────────── */
const buildCSS = (themeKey: string) => {
  const t = THEMES[themeKey] || THEMES.naruto;
  return `
  @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Bowlby+One&family=Russo+One&family=Nunito:wght@400;700;800;900&display=swap');
  :root {
    --bg: ${t.bg}; --surface: ${t.surface}; --card: ${t.card}; --border: ${t.border};
    --p: ${t.p}; --b: ${t.b}; --pk: ${t.pk}; --g: ${t.g};
    --brand: ${t.brand}; --brand2: ${t.brand2};
    --text: ${t.text}; --muted: ${t.muted};
    --r: 18px; --r-sm: 12px;
  }
  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
  body { background: var(--bg); color: var(--text); font-family: 'Nunito', system-ui, sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-thumb { background: var(--brand); border-radius: 3px; }
  .brushy { font-family: 'Bangers', 'Bowlby One', system-ui; letter-spacing: 2px; }
  .strong { font-family: 'Russo One', system-ui; letter-spacing: 0.5px; }
  .glass {
    background: var(--surface);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: var(--r);
  }
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 16px;
  }
  .btn {
    display:inline-flex; align-items:center; justify-content: center;
    gap:8px; padding:12px 18px; border-radius: 999px;
    border: none; font-weight:800; font-size:14px; cursor:pointer;
    transition: all .15s; outline:none; font-family: inherit;
    letter-spacing: .3px;
  }
  .btn:active { transform: scale(0.96); }
  .btn-p { background: linear-gradient(135deg, var(--brand), var(--p)); color:#fff; box-shadow: 0 4px 14px var(--brand)55; }
  .btn-p:hover { box-shadow: 0 6px 20px var(--brand)88; transform: translateY(-1px); }
  .btn-b { background: linear-gradient(135deg, var(--brand2), var(--b)); color:#fff; box-shadow: 0 4px 14px var(--brand2)55; }
  .btn-b:hover { transform: translateY(-1px); }
  .btn-g { background: linear-gradient(135deg, #047857, var(--g)); color:#fff; box-shadow: 0 4px 14px #10b98155; }
  .btn-ghost { background: var(--card); color: var(--text); border:1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface); transform: translateY(-1px); }
  .btn-icon {
    padding:8px; border-radius:12px; background: var(--card);
    border:1px solid var(--border); color: var(--text); cursor:pointer;
    display:inline-flex; align-items:center; justify-content:center;
    transition: all .15s; font-size: 16px;
  }
  .btn-icon:hover { background: var(--surface); border-color: var(--brand); }
  .input, .select, textarea.input {
    width:100%; background: rgba(0,0,0,0.3);
    border:1px solid var(--border); border-radius: var(--r-sm);
    color: var(--text); font-family: inherit; font-size:14px;
    padding:10px 14px; outline:none; transition: all .15s;
  }
  .input:focus, .select:focus, textarea.input:focus {
    border-color: var(--brand);
    box-shadow: 0 0 0 3px var(--brand)33;
  }
  .input::placeholder, textarea.input::placeholder { color: var(--muted); }
  .tag {
    display:inline-flex; align-items:center; gap:4px;
    padding: 3px 10px; border-radius: 999px;
    font-size:11px; font-weight:800; letter-spacing:.5px;
  }
  .badge {
    display:inline-flex; align-items:center; justify-content:center;
    min-width:22px; height:22px; padding:0 8px;
    border-radius: 999px; font-size: 11px; font-weight:900;
    font-family: 'Russo One', monospace;
  }
  .progress-bar { height: 10px; border-radius: 999px; background: rgba(255,255,255,0.06); overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 999px; transition: width .5s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes confetti-fall { 0%{transform:translateY(-100px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
  @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes wiggle { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-4deg)} 75%{transform:rotate(4deg)} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
  @keyframes burst { 0%{transform:scale(0.5);opacity:0} 50%{transform:scale(1.2);opacity:1} 100%{transform:scale(1);opacity:1} }
  .anim-fade { animation: fadeIn 0.3s ease forwards; }
  .anim-float { animation: float 3s ease-in-out infinite; }
  .anim-pulse { animation: pulse 2s ease-in-out infinite; }
  .anim-burst { animation: burst 0.4s ease forwards; }
  .confetti-piece { position: fixed; width: 12px; height: 12px; pointer-events: none; z-index: 9999; animation: confetti-fall 1.5s ease-in forwards; }
  .xp-pop { position: fixed; font-family: 'Russo One', monospace; font-size: 22px; font-weight:900; pointer-events:none; z-index:9998; text-shadow: 0 0 12px currentColor; }
  /* Top bar */
  .topbar {
    position: sticky; top: 0; z-index: 50;
    background: var(--surface); border-bottom: 1px solid var(--border);
    backdrop-filter: blur(20px); padding: 12px 16px;
  }
  /* Bottom nav */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
    background: var(--surface); border-top: 1px solid var(--border);
    backdrop-filter: blur(20px); padding: 8px 16px 18px; padding-bottom: max(18px, env(safe-area-inset-bottom));
    display: flex; gap: 8px;
  }
  .nav-btn {
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content: center;
    gap: 2px; padding: 8px 4px; border-radius: 16px; border: none; background: transparent;
    color: var(--muted); cursor: pointer; transition: all .15s; font-family: inherit;
  }
  .nav-btn .ico { font-size: 22px; }
  .nav-btn .lbl { font-size: 11px; font-weight: 800; letter-spacing: 0.5px; }
  .nav-btn.active { color: var(--brand); transform: translateY(-2px); }
  .nav-btn.active .ico { animation: burst 0.3s ease; }
  /* Task card */
  .task-row {
    display:flex; align-items:flex-start; gap: 12px;
    padding: 14px; border-radius: var(--r-sm);
    background: var(--card); border: 2px solid transparent;
    transition: all .15s; margin-bottom: 10px;
  }
  .task-row:hover { border-color: var(--border); }
  .task-row.done { opacity: 0.5; }
  .task-check {
    width: 28px; height: 28px; border-radius: 50%;
    border: 3px solid var(--muted); background: transparent;
    cursor: pointer; flex-shrink: 0; display:flex; align-items:center; justify-content:center;
    transition: all .15s;
  }
  .task-check.checked {
    background: linear-gradient(135deg, var(--brand), var(--g));
    border-color: var(--g);
    box-shadow: 0 0 16px var(--brand)55;
  }
  /* Calendar */
  .cal-grid { display:grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .cal-day { aspect-ratio: 1; border-radius: 8px; background: var(--card); border: 1px solid transparent; padding: 4px; cursor:pointer; transition: all .15s; min-height: 56px; display: flex; flex-direction: column; }
  .cal-day:hover { border-color: var(--border); }
  .cal-day.today { border-color: var(--brand); box-shadow: 0 0 10px var(--brand)55; }
  .cal-day.other-month { opacity: 0.35; }
  .cal-day-num { font-size: 11px; color: var(--muted); font-family: 'Russo One', monospace; font-weight: 900; }
  /* Heatmap */
  .heatmap-big { display: grid; grid-template-columns: repeat(53, 1fr); gap: 2px; }
  .heatmap-cell { aspect-ratio: 1; border-radius: 2px; min-width: 8px; }
  /* Pet */
  .mini-pet { position: fixed; bottom: 90px; right: 16px; z-index: 40; cursor:pointer; user-select:none; }
  .mini-pet img { width: 80px; height: 80px; object-fit: contain; border-radius: 50%; border: 3px solid var(--brand); background: var(--surface); box-shadow: 0 4px 16px var(--brand)44; animation: float 4s ease-in-out infinite; }
  .mini-pet:hover img { animation: wiggle .5s ease infinite; }
  .pet-bubble { position: fixed; bottom: 180px; right: 16px; background: var(--surface); border: 1px solid var(--brand); padding: 10px 14px; border-radius: 14px; font-size: 13px; max-width: 240px; z-index: 40; backdrop-filter: blur(20px); animation: fadeIn .3s ease; }
  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 1000; display:flex; align-items:center; justify-content:center; padding: 16px; }
  .modal { width: 100%; max-width: 540px; padding: 24px; max-height: 90vh; overflow-y: auto; animation: fadeIn .2s ease; }
  /* Toast */
  .toast { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); padding: 14px 20px; border-radius: 16px; background: var(--surface); border: 2px solid var(--brand); z-index: 9999; max-width: 90vw; box-shadow: 0 6px 24px var(--brand)55; animation: fadeIn .25s ease; }
  /* Focus mode */
  .focus-mode {
    position: fixed; inset: 0; z-index: 5000;
    background: radial-gradient(circle at center, var(--brand2), var(--bg) 70%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 20px; gap: 20px;
  }
  .focus-time { font-family: 'Russo One', monospace; font-size: 96px; color: var(--brand); text-shadow: 0 0 32px var(--brand); }
  /* Whiteboard */
  .whiteboard-canvas { background: rgba(0,0,0,0.4); border-radius: 12px; border: 1px solid var(--border); display: block; touch-action: none; cursor: crosshair; max-width: 100%; }
  /* Mobile */
  @media (max-width: 700px) {
    .grid-2 { grid-template-columns: 1fr !important; }
    .grid-3 { grid-template-columns: 1fr 1fr !important; }
    .mini-pet img { width: 64px; height: 64px; }
    .focus-time { font-size: 64px; }
    .heatmap-big { grid-template-columns: repeat(26, 1fr); }
    .cal-day { min-height: 44px; }
  }
  @media (max-width: 420px) {
    .btn { padding: 10px 14px; font-size: 13px; }
    .modal { padding: 16px; }
  }
  /* Pad bottom for nav */
  .shell { padding-bottom: 96px; }
  `;
};

/* ═══════════════════════════════════════════════════════════════════════
   AI ENGINE (mocked)
   ═════════════════════════════════════════════════════════════════════ */
const AI = {
  prioritize(tasks: any[]) {
    const o: any = { high: 3, medium: 2, low: 1 };
    return [...tasks].sort((a,b) => (o[b.priority]||0) - (o[a.priority]||0));
  },
  breakdown(goal: string) {
    return ["Research", "Outline", "Draft", "Review", "Polish", "Ship"].map(v => `${v}: ${goal}`);
  },
  weeklySummary(user: any) {
    const tDone = user.tasks.filter((t:any)=>t.done).length;
    const hDone = user.habits.filter((h:any)=>h.lastDone===today()).length;
    return `🥷 ${user.name}: ${tDone} tasks · ${hDone} habits today · ${user.xp} XP · ${getRank(user.xp).name}. Next: ${nextRank(user.xp).name}.`;
  },
  moodSuggest(idx: number) {
    return ["Try 1 small win today.", "Pick a low-priority task + rest.", "Run a 25-min Pomodoro.", "Stack 1-2 medium tasks.", "Two deep work blocks!"][idx] || "Match effort to energy.";
  },
  procrastination(tasks: any[]) {
    const n = Date.now();
    return tasks.filter((t:any) => !t.done && (n - (t.createdAt||n))/86400000 > 3);
  },
  habitCoach(u: any) {
    if (!u.habits.length) return "Start tiny — 1 habit, 2 minutes today.";
    const best = u.habits.reduce((a:any,b:any) => a.streak >= b.streak ? a : b);
    return `Strongest: "${best.name}" (${best.streak}d). Stack a new habit right after.`;
  },
  studyPlan(examDate: string, topics: string[]) {
    if (!examDate || !topics.length) return [];
    const days = Math.max(1, Math.ceil((new Date(examDate).getTime() - Date.now()) / 86400000));
    const per = Math.max(1, Math.ceil(topics.length / Math.max(1, days - 1)));
    return Array.from({length: days}, (_, i) => ({ day: i+1, date: isoOf(addDays(new Date(), i)), tasks: topics.slice(i*per, (i+1)*per).length ? topics.slice(i*per, (i+1)*per) : ["Review previous topics"] }));
  },
  newTagline() {
    return AI_BONUS_TAGLINES[Math.floor(Math.random() * AI_BONUS_TAGLINES.length)];
  },
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════════════════════════ */
export default function NindoPath() {
  const [state, setState] = useState<any>(() => ensureDefaults(loadState()));
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const [activeTab, setActiveTab] = useState<"home"|"plan"|"progress"|"dojo">("home");
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [focusMode, setFocusMode] = useState<any>(null); // {timerId, userId}
  const [toast, setToast] = useState<any>(null);
  const [confetti, setConfetti] = useState<any[]>([]);
  const [xpPops, setXpPops] = useState<any[]>([]);
  const [petBubble, setPetBubble] = useState<string>("");
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);

  /* persist */
  useEffect(() => { saveState(state); }, [state]);

  /* CSS injection + theme */
  useEffect(() => {
    let el = document.getElementById("nindopath-css") as HTMLStyleElement | null;
    if (!el) { el = document.createElement("style"); el.id = "nindopath-css"; document.head.appendChild(el); }
    el.textContent = buildCSS(state.theme || "naruto");
  }, [state.theme]);

  /* Daily quest + boss rotation */
  useEffect(() => {
    setState((s:any) => {
      const ns = { ...s };
      if (ns.dailyQuest?.date !== today()) {
        ns.dailyQuest = { date: today(), quest: DAILY_QUESTS[Math.floor(Math.random() * DAILY_QUESTS.length)], doneBy: [] };
      }
      const wk = weekKey();
      if (ns.bossBattle?.week !== wk) {
        ns.bossBattle = { week: wk, title: "🏯 Demon of Procrastination", target: 30, u1: 0, u2: 0, done: false };
      }
      return ns;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Monday weekly planning prompt */
  useEffect(() => {
    const isMonday = new Date().getDay() === 1;
    const wk = weekKey();
    const u = state.users[state.activeUser];
    if (isMonday && u && !u.weeklyPlanning?.[wk]) {
      setShowWeeklyPlan(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Notification permission */
  useEffect(() => {
    try { if (typeof Notification !== "undefined" && Notification.permission === "default") Notification.requestPermission(); } catch {}
  }, []);

  /* Calendar reminders */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const fired = new Set<string>();
      let changed = false;
      state.events?.forEach((ev: any) => {
        (ev.reminders || []).forEach((rem: any) => {
          const key = `${ev.id}:${rem.type}`;
          if (rem.fired) { fired.add(key); return; }
          const evD = new Date(`${ev.date}T${ev.time || "09:00"}:00`);
          const ms = evD.getTime() - now.getTime();
          let trig = false;
          if (rem.type === "1day" && ms > 0 && ms <= 86400000) trig = true;
          else if (rem.type === "1hr" && ms > 0 && ms <= 3600000) trig = true;
          else if (rem.type === "15min" && ms > 0 && ms <= 900000) trig = true;
          else if (rem.type === "ontime" && ms > -60000 && ms <= 60000) trig = true;
          if (trig) {
            pushToast(`🔔 ${EVENT_TYPES[ev.type]?.icon || "📌"} ${ev.title}`, `${ev.date}${ev.time ? " · " + ev.time : ""}`);
            try { if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification(ev.title, { body: ev.date }); } catch {}
            rem.fired = true; changed = true;
          }
        });
      });
      if (changed) setState((s:any) => ({ ...s, events: s.events }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.events]);

  /* Habit nudge at 9pm */
  useEffect(() => {
    const check = () => {
      const hr = new Date().getHours();
      const u = state.users[state.activeUser];
      const partnerId = state.activeUser === "u1" ? "u2" : "u1";
      const partner = state.users[partnerId];
      if (hr >= (u.settings.nudgeHour || 21)) {
        const partnerDone = partner.habits.every((h:any) => h.lastDone === today());
        if (!partnerDone && !sessionStorage.getItem(`nudge_${partnerId}_${today()}`)) {
          pushToast(`🥷 Nudge from ${u.name}`, `${partner.name} hasn't finished today's habits yet!`);
          sessionStorage.setItem(`nudge_${partnerId}_${today()}`, "1");
        }
      }
    };
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.users]);

  /* Pet talk rotation */
  useEffect(() => {
    const u = state.users[state.activeUser];
    const pet = PET_OPTIONS.find(p => p.id === u.pet) || PET_OPTIONS[0];
    const tick = () => {
      const line = pet.lines[Math.floor(Math.random() * pet.lines.length)];
      setPetBubble(line);
      setTimeout(() => setPetBubble(""), 4500);
    };
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [state.activeUser, state.users]);

  const pushToast = useCallback((title: string, body: string) => {
    setToast({ title, body });
    setTimeout(() => setToast(null), 4500);
  }, []);

  const burstConfetti = useCallback((double = false) => {
    const colors = ["#f97316","#3b82f6","#ec4899","#10b981","#f59e0b","#a855f7"];
    const pieces = Array.from({ length: double ? 80 : 36 }, () => ({ id: uid(), x: Math.random() * window.innerWidth, color: colors[Math.floor(Math.random() * colors.length)] }));
    setConfetti(p => [...p, ...pieces]);
    setTimeout(() => setConfetti(p => p.filter(c => !pieces.find(x => x.id === c.id))), 2500);
  }, []);

  const xpPop = useCallback((amount: number, color = "#f97316") => {
    const p = { id: uid(), amount, color, x: window.innerWidth - 100 - Math.random() * 60, y: 100 + Math.random() * 40 };
    setXpPops(a => [...a, p]);
    setTimeout(() => setXpPops(a => a.filter(x => x.id !== p.id)), 1300);
  }, []);

  const awardXp = useCallback((userId: string, amount: number) => {
    setState((s:any) => {
      const u = s.users[userId];
      const prev = getRank(u.xp).name;
      const next = u.xp + amount;
      const newRank = getRank(next).name;
      if (newRank !== prev) {
        pushToast(`🎉 Rank Up!`, `${u.name} ascended to ${newRank}`);
        burstConfetti(true);
      }
      return { ...s, users: { ...s.users, [userId]: { ...u, xp: next } } };
    });
    xpPop(amount, state.users[userId]?.color || "#f97316");
  }, [state.users, pushToast, burstConfetti, xpPop]);

  /* Task ops */
  const addTask = (userId: string, t: any) => setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], tasks: [t, ...s.users[userId].tasks] } } }));
  const toggleTask = (userId: string, taskId: string) => {
    const task = state.users[userId].tasks.find((t:any) => t.id === taskId);
    if (!task) return;
    setState((s:any) => {
      const u = s.users[userId];
      const tasks = u.tasks.map((x:any) => x.id === taskId ? { ...x, done: !x.done, completedAt: !x.done ? nowTs() : null } : x);
      return { ...s, users: { ...s.users, [userId]: { ...u, tasks, completedTasks: tasks.filter((x:any)=>x.done).length } } };
    });
    if (!task.done) {
      const xp = task.customXp > 0 ? task.customXp : (task.priority === "high" ? 50 : task.priority === "medium" ? 30 : 15);
      awardXp(userId, xp);
      burstConfetti();
      setState((s:any) => ({ ...s, bossBattle: { ...s.bossBattle, [userId]: (s.bossBattle?.[userId] || 0) + 1 } }));
      if (task.priority === "high") {
        const w = { id: uid(), user: userId, text: `Crushed: ${task.title}`, emoji: "🔥", ts: nowTs(), reactions: [] };
        setState((s:any) => ({ ...s, celebrationWall: [w, ...(s.celebrationWall||[])].slice(0, 50) }));
        burstConfetti(true);
        pushToast("🎉 Victory!", `${state.users[userId].name} crushed it!`);
      }
    }
  };
  const deleteTask = (userId: string, taskId: string) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], tasks: s.users[userId].tasks.filter((t:any)=>t.id!==taskId) } } }));
  const editTask = (userId: string, taskId: string, u: any) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], tasks: s.users[userId].tasks.map((t:any) => t.id === taskId ? { ...t, ...u } : t) } } }));
  const reactToTask = (userId: string, taskId: string, emoji: string, fromId: string) => {
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], tasks: s.users[userId].tasks.map((t:any) => t.id === taskId ? { ...t, reactions: [...(t.reactions||[]), { emoji, from: fromId, ts: nowTs() }] } : t) } } }));
    pushToast("Reaction sent!", `${emoji} → ${state.users[userId].name}`);
  };

  /* Habit ops */
  const addHabit = (userId: string, h: any) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], habits: [...s.users[userId].habits, h] } } }));
  const toggleHabit = (userId: string, habitId: string) => {
    const h = state.users[userId].habits.find((x:any)=>x.id===habitId);
    if (!h || h.lastDone === today()) return;
    const yesterday = isoOf(addDays(new Date(), -1));
    const newStreak = h.lastDone === yesterday ? h.streak + 1 : 1;
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], habits: s.users[userId].habits.map((x:any) => x.id === habitId ? { ...x, lastDone: today(), history: [...(x.history||[]), today()], streak: newStreak } : x) } } }));
    awardXp(userId, h.customXp > 0 ? h.customXp : h.xpPerDay);
    // combo
    const other = userId === "u1" ? "u2" : "u1";
    const otherDone = state.users[other].habits.some((x:any) => x.lastDone === today());
    if (otherDone) {
      const k = today();
      if (!state.combos?.[k]) {
        setState((s:any) => ({ ...s, combos: { ...(s.combos || {}), [k]: true } }));
        awardXp(userId, h.xpPerDay); awardXp(other, h.xpPerDay);
        pushToast("🤝 COMBO STREAK!", "Both ninjas hit a habit — DOUBLE XP!");
        burstConfetti(true);
      }
    }
  };
  const deleteHabit = (userId: string, habitId: string) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], habits: s.users[userId].habits.filter((h:any)=>h.id!==habitId) } } }));
  const editHabit = (userId: string, habitId: string, u: any) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], habits: s.users[userId].habits.map((h:any) => h.id === habitId ? { ...h, ...u } : h) } } }));

  /* Timer ops */
  const addTimer = (userId: string) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], timers: [...s.users[userId].timers, { id: uid(), label: "New Timer", duration: 25*60, remaining: 25*60, running: false, phase: "focus", notes: "" }] } } }));
  const updateTimer = (userId: string, timerId: string, action: string, payload?: any) => {
    setState((s:any) => {
      const u = s.users[userId];
      const timers = u.timers.map((t:any) => {
        if (t.id !== timerId) return t;
        if (action === "tick") return t.remaining > 0 ? { ...t, remaining: t.remaining - 1 } : { ...t, running: false };
        if (action === "toggle") return t.remaining === 0 ? { ...t, remaining: t.duration, running: true } : { ...t, running: !t.running };
        if (action === "reset") return { ...t, remaining: t.duration, running: false };
        if (action === "setDuration") return { ...t, duration: payload * 60, remaining: payload * 60, running: false };
        if (action === "label") return { ...t, label: payload };
        if (action === "notes") return { ...t, notes: payload };
        return t;
      });
      let pomos = u.pomodoroSessions;
      const just = u.timers.find((t:any)=>t.id===timerId && t.remaining > 0) && timers.find((t:any)=>t.id===timerId && t.remaining === 0);
      if (just) { pomos += 1; pushToast("✅ Pomodoro complete!", `${u.name} finished a focus session.`); burstConfetti(); }
      return { ...s, users: { ...s.users, [userId]: { ...u, timers, pomodoroSessions: pomos } } };
    });
  };
  const deleteTimer = (userId: string, timerId: string) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], timers: s.users[userId].timers.filter((t:any)=>t.id!==timerId) } } }));

  /* Calendar */
  const addEvent = (e: any) => setState((s:any) => ({ ...s, events: [...(s.events||[]), e] }));
  const editEvent = (id: string, u: any) => setState((s:any) => ({ ...s, events: s.events.map((e:any) => e.id === id ? { ...e, ...u } : e) }));
  const deleteEvent = (id: string) => setState((s:any) => ({ ...s, events: s.events.filter((e:any) => e.id !== id) }));

  /* Goals */
  const updateGoals = (userId: string, scope: string, key: string, goals: any[]) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], goals: { ...s.users[userId].goals, [scope]: { ...s.users[userId].goals[scope], [key]: goals } } } } }));

  /* Journal */
  const updateJournal = (userId: string, date: string, entry: any) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], journal: { ...s.users[userId].journal, [date]: { ...(s.users[userId].journal?.[date] || {}), ...entry } } } } }));

  /* Reading/Courses */
  const upsertReading = (userId: string, b: any) => setState((s:any) => {
    const arr = s.users[userId].reading;
    const idx = arr.findIndex((x:any) => x.id === b.id);
    const next = idx === -1 ? [b, ...arr] : arr.map((x:any, i:number) => i === idx ? b : x);
    return { ...s, users: { ...s.users, [userId]: { ...s.users[userId], reading: next } } };
  });
  const deleteReading = (userId: string, id: string) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], reading: s.users[userId].reading.filter((x:any)=>x.id!==id) } } }));
  const upsertCourse = (userId: string, c: any) => setState((s:any) => {
    const arr = s.users[userId].courses;
    const idx = arr.findIndex((x:any) => x.id === c.id);
    const next = idx === -1 ? [c, ...arr] : arr.map((x:any, i:number) => i === idx ? c : x);
    return { ...s, users: { ...s.users, [userId]: { ...s.users[userId], courses: next } } };
  });
  const deleteCourse = (userId: string, id: string) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], courses: s.users[userId].courses.filter((x:any)=>x.id!==id) } } }));

  /* Settings */
  const setTheme = (k: string) => setState((s:any) => ({ ...s, theme: k }));
  const updateUser = (userId: string, u: any) => setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], ...u } } }));
  const setActiveUser = (id: string) => setState((s:any) => ({ ...s, activeUser: id }));

  /* Time Capsule */
  const addCapsule = (userId: string, msg: string, unlock: string) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], timeCapsules: [...(s.users[userId].timeCapsules || []), { id: uid(), msg, unlock, createdAt: nowTs() }] } } }));
  const deleteCapsule = (userId: string, id: string) =>
    setState((s:any) => ({ ...s, users: { ...s.users, [userId]: { ...s.users[userId], timeCapsules: s.users[userId].timeCapsules.filter((c:any)=>c.id!==id) } } }));

  /* Export */
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nindopath-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* Today's tagline */
  const tagline = state.taglinePool[dayOfYear() % state.taglinePool.length];
  const refreshTagline = () => {
    setState((s:any) => ({ ...s, taglinePool: [...s.taglinePool, AI.newTagline()] }));
    pushToast("New tagline added!", "AI generated a fresh one for the pool.");
  };

  /* Productivity score */
  const productivityScore = (u: any) => {
    const tToday = u.tasks.filter((t:any) => t.done && t.completedAt && isoOf(new Date(t.completedAt)) === today()).length;
    const hToday = u.habits.filter((h:any) => h.lastDone === today()).length;
    const pomos = Math.min(u.pomodoroSessions, 6);
    const j = u.journal?.[today()] || {};
    const w = ((j.sleep || 0) + (j.health || 0) + (j.productivity || 0) + (j.selfcare || 0)) / 4;
    return Math.min(100, Math.round(tToday * 12 + hToday * 14 + pomos * 6 + w * 4));
  };

  const active = state.users[state.activeUser];
  const partnerId = state.activeUser === "u1" ? "u2" : "u1";
  const partner = state.users[partnerId];
  const pet = PET_OPTIONS.find(p => p.id === active.pet) || PET_OPTIONS[0];
  const avatar = AVATAR_OPTIONS.find(a => a.id === active.avatar) || AVATAR_OPTIONS[0];
  const rank = getRank(active.xp);
  const next = nextRank(active.xp);
  const prog = rankProgress(active.xp);
  const score = productivityScore(active);

  /* ──────── Focus mode ──────── */
  if (focusMode) {
    const u = state.users[focusMode.userId];
    const t = u.timers.find((x:any) => x.id === focusMode.timerId);
    if (!t) { setFocusMode(null); return null; }
    return (
      <FocusModeView timer={t} userId={focusMode.userId} onExit={() => setFocusMode(null)} onUpdate={updateTimer} />
    );
  }

  return (
    <div className="shell" style={{ minHeight: "100vh", position: "relative" }}>
      {/* Confetti */}
      {confetti.map(c => (
        <div key={c.id} className="confetti-piece" style={{ left: c.x, top: 0, background: c.color, borderRadius: Math.random() > 0.5 ? "50%" : "2px", animationDuration: `${1 + Math.random()}s`, animationDelay: `${Math.random() * 0.3}s` }} />
      ))}
      {/* XP pops */}
      {xpPops.map(p => (
        <div key={p.id} className="xp-pop" style={{ left: p.x, top: p.y, color: p.color, animation: "fadeIn 0.2s ease, xp-pop 1.2s ease forwards" }}>+{p.amount} XP</div>
      ))}
      {/* Toast */}
      {toast && (
        <div className="toast">
          <div style={{ fontWeight: 900, fontSize: 14 }}>{toast.title}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{toast.body}</div>
        </div>
      )}

      {/* Pet */}
      <div className="mini-pet" onClick={() => { setPetBubble(pet.lines[Math.floor(Math.random() * pet.lines.length)]); setTimeout(() => setPetBubble(""), 3500); }}>
        <img src={pet.file} alt={pet.name} onError={(e:any) => { e.target.outerHTML = `<div style="font-size:64px;text-align:center">🐾</div>`; }} />
      </div>
      {petBubble && <div className="pet-bubble">{petBubble}</div>}

      {/* Top bar */}
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div className="brushy" style={{ fontSize: 24, color: "var(--brand)", lineHeight: 1, textShadow: "0 0 12px var(--brand)55" }}>
            ⚔ NINDOPATH
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn-icon" title="Settings" onClick={() => setShowSettings(true)}>⚙️</button>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }} onClick={refreshTagline}>
          <span style={{ color: "var(--brand)" }}>✦</span> {tagline}
        </div>

        {/* User switcher + rank */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          {(["u1","u2"] as const).map(uid_ => {
            const u = state.users[uid_];
            const av = AVATAR_OPTIONS.find(a => a.id === u.avatar) || AVATAR_OPTIONS[0];
            const isActive = state.activeUser === uid_;
            return (
              <div key={uid_} onClick={() => setActiveUser(uid_)} style={{
                display: "flex", alignItems: "center", gap: 8, flex: 1,
                padding: "8px 12px", borderRadius: 14, cursor: "pointer",
                background: isActive ? "var(--card)" : "transparent",
                border: isActive ? "2px solid var(--brand)" : "2px solid transparent",
                transition: "all .15s",
              }}>
                <img src={av.file} alt={av.name} onError={(e:any) => { e.target.outerHTML = `<div style="font-size:28px">${u.emoji}</div>`; }} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid ${u.color}` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="strong" style={{ fontSize: 13, color: isActive ? "var(--brand)" : "var(--text)" }}>{u.name}</span>
                    <span className="badge" style={{ background: `${u.color}33`, color: u.color, fontSize: 9 }}>{getRank(u.xp).emoji}</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: 4, height: 6 }}>
                    <div className="progress-fill" style={{ width: `${rankProgress(u.xp)}%`, background: `linear-gradient(90deg, ${u.color}, ${u.color}aa)` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px" }}>
        {activeTab === "home" && (
          <HomeView state={state} setState={setState} active={active} partner={partner} partnerId={partnerId}
            score={score} rank={rank} next={next} prog={prog}
            onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} onEditTask={editTask} onReact={reactToTask}
            onToggleHabit={toggleHabit} onAddHabit={addHabit} onDeleteHabit={deleteHabit} onEditHabit={editHabit}
            onUpdateTimer={updateTimer} onAddTimer={addTimer} onDeleteTimer={deleteTimer}
            onAward={awardXp} onConfetti={burstConfetti} pushToast={pushToast}
            onFocusMode={(timerId: string, userId: string) => setFocusMode({ timerId, userId })} />
        )}
        {activeTab === "plan" && (
          <PlanView state={state} active={active} setState={setState}
            onAddEvent={addEvent} onEditEvent={editEvent} onDeleteEvent={deleteEvent}
            onUpdateGoals={updateGoals} />
        )}
        {activeTab === "progress" && (
          <ProgressView state={state} active={active} />
        )}
        {activeTab === "dojo" && (
          <DojoView state={state} setState={setState} active={active} activeUserId={state.activeUser} partner={partner} partnerId={partnerId}
            onUpdateJournal={updateJournal}
            onUpsertReading={upsertReading} onDeleteReading={deleteReading}
            onUpsertCourse={upsertCourse} onDeleteCourse={deleteCourse}
            onAddCapsule={addCapsule} onDeleteCapsule={deleteCapsule}
            pushToast={pushToast} onConfetti={burstConfetti}
            onAward={awardXp} onExport={exportData} />
        )}
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {[
          { id: "home",     ico: "🏠", lbl: "HOME" },
          { id: "plan",     ico: "📅", lbl: "PLAN" },
          { id: "progress", ico: "📊", lbl: "PROGRESS" },
          { id: "dojo",     ico: "🥷", lbl: "DOJO" },
        ].map(t => (
          <button key={t.id} className={`nav-btn ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id as any)}>
            <div className="ico">{t.ico}</div>
            <div className="lbl">{t.lbl}</div>
          </button>
        ))}
      </div>

      {/* Modals */}
      {showSettings && (
        <SettingsModal state={state} onClose={() => setShowSettings(false)} onSetTheme={setTheme} onUpdateUser={updateUser} onExport={exportData} pushToast={pushToast} />
      )}
      {showWeeklyPlan && (
        <WeeklyPlanModal user={active} onClose={() => setShowWeeklyPlan(false)} onSave={(answers:any) => {
          setState((s:any) => ({ ...s, users: { ...s.users, [active.id]: { ...active, weeklyPlanning: { ...active.weeklyPlanning, [weekKey()]: answers } } } }));
          pushToast("Week locked in!", "Stay focused, ninja 🥷");
          setShowWeeklyPlan(false);
        }} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HOME VIEW (today only — Duolingo-style focused)
   ═════════════════════════════════════════════════════════════════════ */
function HomeView({ state, setState, active, partner, partnerId, score, rank, next, prog,
  onAddTask, onToggleTask, onDeleteTask, onEditTask, onReact,
  onToggleHabit, onAddHabit, onDeleteHabit, onEditHabit,
  onUpdateTimer, onAddTimer, onDeleteTimer, onAward, onConfetti, pushToast, onFocusMode }: any) {
  const todayTasks = AI.prioritize(active.tasks.filter((t:any) => !t.done)).slice(0, 5);
  const dq = state.dailyQuest;
  const boss = state.bossBattle;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hero stat */}
      <div className="glass anim-fade" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 1 }}>YOUR RANK</div>
            <div className="strong" style={{ fontSize: 24, color: "var(--brand)" }}>{rank.emoji} {rank.name}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>TODAY'S SCORE</div>
            <div className="strong" style={{ fontSize: 32, color: score >= 70 ? "var(--g)" : score >= 40 ? "var(--brand)" : "#ef4444" }}>{score}<span style={{ fontSize: 14, color: "var(--muted)" }}>/100</span></div>
          </div>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${prog}%`, background: "linear-gradient(90deg, var(--brand), var(--p))" }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
          <span>{active.xp} XP</span><span>To {next.name}: {next.min - active.xp} XP</span>
        </div>
      </div>

      {/* Daily Quest */}
      {dq?.quest && (
        <div className="card anim-fade" style={{ borderColor: "var(--brand)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 40 }}>{dq.quest.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "var(--brand)", letterSpacing: 1, fontWeight: 800 }}>DAILY QUEST</div>
              <div style={{ fontWeight: 800, fontSize: 15, marginTop: 2 }}>{dq.quest.text}</div>
              <div style={{ fontSize: 11, color: "var(--g)" }}>+{dq.quest.xp} XP</div>
            </div>
            <button className={dq.doneBy.includes(active.id) ? "btn btn-ghost" : "btn btn-p"}
              disabled={dq.doneBy.includes(active.id)}
              onClick={() => {
                setState((s:any) => ({ ...s, dailyQuest: { ...s.dailyQuest, doneBy: [...s.dailyQuest.doneBy, active.id] } }));
                onAward(active.id, dq.quest.xp);
                pushToast("✨ Quest claimed!", `+${dq.quest.xp} XP`);
              }}>
              {dq.doneBy.includes(active.id) ? "✓" : "Claim"}
            </button>
          </div>
        </div>
      )}

      {/* Boss Battle */}
      <div className="card anim-fade" style={{ borderColor: "#ef4444aa" }}>
        <div style={{ fontSize: 10, color: "#ef4444", letterSpacing: 1, fontWeight: 800 }}>⚔ WEEKLY BOSS</div>
        <div style={{ fontWeight: 800, fontSize: 15, marginTop: 4 }}>{boss.title}</div>
        <div className="progress-bar" style={{ marginTop: 8 }}>
          <div className="progress-fill" style={{ width: `${Math.min(100, ((boss.u1+boss.u2)/boss.target)*100)}%`, background: "linear-gradient(90deg, #ef4444, var(--brand))" }} />
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{boss.u1 + boss.u2} / {boss.target} tasks</div>
        {boss.u1 + boss.u2 >= boss.target && !boss.done && (
          <button className="btn btn-g" style={{ marginTop: 10, width: "100%" }}
            onClick={() => {
              setState((s:any) => ({ ...s, bossBattle: { ...s.bossBattle, done: true } }));
              onAward("u1", 300); onAward("u2", 300); onConfetti(true);
              pushToast("🏆 Boss Defeated!", "+300 XP each");
            }}>Claim Reward (+300 XP each)</button>
        )}
      </div>

      {/* Today's tasks */}
      <TodayTasks active={active} partner={partner} partnerId={partnerId}
        onAddTask={onAddTask} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onEditTask={onEditTask} onReact={onReact} />

      {/* Today's habits */}
      <TodayHabits active={active} partner={partner}
        onToggleHabit={onToggleHabit} onAddHabit={onAddHabit} onDeleteHabit={onDeleteHabit} onEditHabit={onEditHabit} />

      {/* Focus timer (compact) */}
      <FocusTimer user={active} onUpdate={onUpdateTimer} onAdd={onAddTimer} onDelete={onDeleteTimer} onFocusMode={onFocusMode} />
    </div>
  );
}

/* ─── Today Tasks ──────────────────────────────────────────────────── */
function TodayTasks({ active, partner, partnerId, onAddTask, onToggleTask, onDeleteTask, onEditTask, onReact }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", priority: "medium", category: "work", notes: "", dueDate: "", customXp: 0 });
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? active.tasks : active.tasks.slice(0, 5);

  const add = () => {
    if (!form.title.trim()) return;
    onAddTask(active.id, { ...form, id: uid(), done: false, subtasks: [], createdAt: nowTs(), reactions: [] });
    setForm({ title: "", priority: "medium", category: "work", notes: "", dueDate: "", customXp: 0 });
    setShowAdd(false);
  };

  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="strong" style={{ fontSize: 15 }}>📋 Today's Tasks</div>
        <button className="btn btn-p" onClick={() => setShowAdd(s => !s)}>+ Add Task</button>
      </div>

      {showAdd && (
        <div className="anim-fade card" style={{ marginBottom: 12, background: "var(--card)" }}>
          <input className="input" placeholder="Task title…" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} onKeyDown={e => e.key === "Enter" && add()} autoFocus style={{ marginBottom: 8 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            <select className="select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="high">🔴 High</option><option value="medium">🟡 Med</option><option value="low">🟢 Low</option>
            </select>
            <select className="select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="work">💼 Work</option><option value="personal">🏠 Personal</option><option value="health">💪 Health</option><option value="study">📚 Study</option><option value="other">🗂 Other</option>
            </select>
            <input className="input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <input className="input" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ marginBottom: 8 }} />
          <input className="input" type="number" placeholder="Custom XP (0 = use defaults)" value={form.customXp} onChange={e => setForm({ ...form, customXp: Number(e.target.value) })} style={{ marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-p" onClick={add}>Add</button>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✨</div>
          <div>All clear! Add a task above.</div>
        </div>
      ) : list.map((t:any) => (
        <TaskRow key={t.id} task={t} owner={active.id} viewerId={active.id} partnerId={partnerId}
          onToggle={() => onToggleTask(active.id, t.id)}
          onDelete={() => onDeleteTask(active.id, t.id)}
          onEdit={(u:any) => onEditTask(active.id, t.id, u)}
          onReact={(emo:string) => onReact(active.id, t.id, emo, partnerId)} />
      ))}

      {/* Partner tasks (with react) */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
        <div className="strong" style={{ fontSize: 13, marginBottom: 8, color: "var(--muted)" }}>👀 {partner.name}'s tasks (react!)</div>
        {partner.tasks.filter((t:any) => !t.done).slice(0, 4).map((t:any) => (
          <TaskRow key={t.id} task={t} owner={partnerId} viewerId={active.id} partnerId={active.id} readOnly
            onReact={(emo:string) => onReact(partnerId, t.id, emo, active.id)} />
        ))}
        {partner.tasks.filter((t:any)=>!t.done).length === 0 && <div style={{ fontSize: 12, color: "var(--muted)" }}>Partner has cleared everything! 🎉</div>}
      </div>

      {active.tasks.length > 5 && (
        <button className="btn btn-ghost" style={{ width: "100%", marginTop: 10 }} onClick={() => setShowAll(s => !s)}>
          {showAll ? "Show less" : `Show all (${active.tasks.length})`}
        </button>
      )}
    </div>
  );
}

function TaskRow({ task, owner, viewerId, partnerId, readOnly, onToggle, onDelete, onEdit, onReact }: any) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [showReact, setShowReact] = useState(false);
  const overdue = task.dueDate && !task.done && new Date(task.dueDate) < new Date(today());

  return (
    <div className={`task-row ${task.done ? "done" : ""}`} style={{ borderColor: overdue ? "#ef4444aa" : undefined }}>
      {!readOnly && (
        <div className={`task-check ${task.done ? "checked" : ""}`} onClick={onToggle}>
          {task.done && <span style={{ fontSize: 16, color: "#fff" }}>✓</span>}
        </div>
      )}
      {readOnly && <div style={{ fontSize: 24 }}>{task.done ? "✅" : "⬜"}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} onBlur={() => { if (title.trim()) onEdit({ title }); setEditing(false); }} onKeyDown={e => e.key === "Enter" && (e.target as HTMLInputElement).blur()} autoFocus />
        ) : (
          <div style={{ fontWeight: 700, fontSize: 14, textDecoration: task.done ? "line-through" : "none" }}>{task.title}</div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
          <span className="tag" style={{ background: `${PRIORITY_COLORS[task.priority]}22`, color: PRIORITY_COLORS[task.priority] }}>{task.priority}</span>
          <span className="tag" style={{ background: `${CATEGORY_COLORS[task.category]}22`, color: CATEGORY_COLORS[task.category] }}>{task.category}</span>
          {task.dueDate && <span className="tag" style={{ background: overdue ? "#ef444433" : "rgba(255,255,255,0.06)", color: overdue ? "#ef4444" : "var(--muted)" }}>📅 {fmtDate(task.dueDate)}{overdue ? " · overdue" : ""}</span>}
          {task.customXp > 0 && <span className="tag" style={{ background: "var(--brand)22", color: "var(--brand)" }}>+{task.customXp} XP</span>}
        </div>
        {task.notes && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>💬 {task.notes}</div>}
        {/* Reactions */}
        {task.reactions?.length > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
            {task.reactions.slice(-8).map((r:any, i:number) => <span key={i} style={{ fontSize: 14 }}>{r.emoji}</span>)}
          </div>
        )}
      </div>
      {readOnly ? (
        <div style={{ position: "relative" }}>
          <button className="btn-icon" onClick={() => setShowReact(s => !s)}>💬</button>
          {showReact && (
            <div style={{ position: "absolute", right: 0, top: 40, display: "flex", gap: 4, background: "var(--surface)", padding: 8, borderRadius: 12, border: "1px solid var(--border)", zIndex: 10 }}>
              {["🔥","💪","👏","🌸","⚔️","💜"].map(e => <button key={e} onClick={() => { onReact(e); setShowReact(false); }} style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer", padding: 4 }}>{e}</button>)}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 4 }}>
          {!task.done && <button className="btn-icon" onClick={() => setEditing(true)}>✎</button>}
          <button className="btn-icon" style={{ color: "#ef4444" }} onClick={() => { if (confirm("Delete this task?")) onDelete(); }}>🗑</button>
        </div>
      )}
    </div>
  );
}

/* ─── Today Habits ─────────────────────────────────────────────────── */
function TodayHabits({ active, partner, onToggleHabit, onAddHabit, onDeleteHabit, onEditHabit }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", color: "#f97316", xpPerDay: 30, freq: "daily", customXp: 0 });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const days14 = useMemo(() => Array.from({ length: 14 }, (_, i) => isoOf(addDays(new Date(), -(13 - i)))), []);

  const add = () => {
    if (!form.name.trim()) return;
    onAddHabit(active.id, { ...form, id: uid(), streak: 0, lastDone: "", history: [] });
    setForm({ name: "", color: "#f97316", xpPerDay: 30, freq: "daily", customXp: 0 });
    setShowAdd(false);
  };

  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="strong" style={{ fontSize: 15 }}>🌿 Habits</div>
        <button className="btn btn-p" onClick={() => setShowAdd(s => !s)}>+ Habit</button>
      </div>

      {showAdd && (
        <div className="anim-fade card" style={{ marginBottom: 12, background: "var(--card)" }}>
          <input className="input" placeholder="Habit name (with emoji)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} autoFocus style={{ marginBottom: 8 }} />
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: 44, height: 36, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }} />
            <select className="select" value={form.xpPerDay} onChange={e => setForm({ ...form, xpPerDay: Number(e.target.value) })}>
              {[10,20,30,50,60,80,100].map(n => <option key={n} value={n}>{n} XP/day</option>)}
            </select>
            <select className="select" value={form.freq} onChange={e => setForm({ ...form, freq: e.target.value })}>
              <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
            </select>
            <input className="input" type="number" placeholder="Custom XP" value={form.customXp} onChange={e => setForm({ ...form, customXp: Number(e.target.value) })} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-p" onClick={add}>Add</button>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {active.habits.map((h:any) => (
        <div key={h.id} className="card" style={{ marginBottom: 10 }}>
          {editId === h.id ? (
            <div className="anim-fade">
              <input className="input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ marginBottom: 8 }} />
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                <input type="color" value={editForm.color} onChange={e => setEditForm({ ...editForm, color: e.target.value })} style={{ width: 44, height: 36, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }} />
                <select className="select" value={editForm.xpPerDay} onChange={e => setEditForm({ ...editForm, xpPerDay: Number(e.target.value) })}>
                  {[10,20,30,50,60,80,100].map(n => <option key={n} value={n}>{n} XP</option>)}
                </select>
                <select className="select" value={editForm.freq} onChange={e => setEditForm({ ...editForm, freq: e.target.value })}>
                  <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
                </select>
                <input className="input" type="number" placeholder="Custom XP" value={editForm.customXp || 0} onChange={e => setEditForm({ ...editForm, customXp: Number(e.target.value) })} />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-p" onClick={() => { onEditHabit(active.id, h.id, editForm); setEditId(null); }}>Save</button>
                <button className="btn btn-ghost" onClick={() => setEditId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, alignSelf: "stretch", background: h.color, borderRadius: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{h.name}</div>
                  <div style={{ display: "flex", gap: 6, fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    <span style={{ color: h.color, fontWeight: 800 }}>🔥 {h.streak}d</span>
                    <span>+{h.customXp > 0 ? h.customXp : h.xpPerDay} XP · {h.freq}</span>
                  </div>
                </div>
                {h.lastDone !== today() && <button onClick={() => onToggleHabit(active.id, h.id)} className="btn btn-p" style={{ padding: "8px 16px" }}>Check ✓</button>}
                {h.lastDone === today() && <div style={{ width: 32, height: 32, borderRadius: "50%", background: h.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 900 }}>✓</div>}
                <button className="btn-icon" onClick={() => { setEditId(h.id); setEditForm({ name: h.name, color: h.color, xpPerDay: h.xpPerDay, freq: h.freq, customXp: h.customXp || 0 }); }}>✎</button>
                <button className="btn-icon" style={{ color: "#ef4444" }} onClick={() => { if (confirm(`Delete "${h.name}"?`)) onDeleteHabit(active.id, h.id); }}>🗑</button>
              </div>
              {/* 14d heatmap */}
              <div style={{ display: "flex", gap: 3, marginTop: 10 }}>
                {days14.map(d => {
                  const done = (h.history || []).includes(d);
                  const isToday = d === today();
                  return <div key={d} style={{ width: 14, height: 14, borderRadius: 3, background: done ? h.color : "rgba(255,255,255,0.06)", border: isToday ? `1px solid ${h.color}88` : "none", opacity: done ? 1 : 0.5 }} title={d} />;
                })}
              </div>
            </>
          )}
        </div>
      ))}
      {active.habits.length === 0 && (
        <div style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>🌱</div>
          <div>Build your first habit!</div>
        </div>
      )}
    </div>
  );
}

/* ─── Focus Timer (compact on home, expand to full focus mode) ───── */
function FocusTimer({ user, onUpdate, onAdd, onDelete, onFocusMode }: any) {
  const refs = useRef<any>({});
  useEffect(() => {
    user.timers.forEach((t:any) => {
      if (t.running && !refs.current[t.id]) {
        refs.current[t.id] = setInterval(() => onUpdate(user.id, t.id, "tick"), 1000);
      } else if (!t.running && refs.current[t.id]) {
        clearInterval(refs.current[t.id]); delete refs.current[t.id];
      }
    });
    return () => Object.values(refs.current).forEach((i:any) => clearInterval(i));
  }, [user.timers, user.id]);

  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="strong" style={{ fontSize: 15 }}>🍅 Focus</div>
        <button className="btn btn-p" onClick={() => onAdd(user.id)}>+ Timer</button>
      </div>
      {user.timers.map((t:any) => (
        <div key={t.id} className="card" style={{ marginBottom: 10 }}>
          <input className="input" value={t.label} onChange={e => onUpdate(user.id, t.id, "label", e.target.value)} style={{ marginBottom: 8, fontWeight: 700 }} />
          <div className="strong" style={{ fontSize: 36, textAlign: "center", color: "var(--brand)", margin: "8px 0", textShadow: "0 0 12px var(--brand)55" }}>{formatTime(t.remaining)}</div>
          <div className="progress-bar" style={{ marginBottom: 10 }}>
            <div className="progress-fill" style={{ width: `${(1 - t.remaining/t.duration)*100}%`, background: "var(--brand)" }} />
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
            {POMO_PRESETS.map(m => (
              <button key={m} onClick={() => onUpdate(user.id, t.id, "setDuration", m)}
                className={t.duration === m*60 ? "btn btn-p" : "btn btn-ghost"}
                style={{ padding: "4px 8px", fontSize: 11 }}>
                {m < 60 ? `${m}m` : `${Math.floor(m/60)}h${m%60 ? (m%60)+"m" : ""}`}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <button className={t.running ? "btn btn-ghost" : "btn btn-p"} onClick={() => onUpdate(user.id, t.id, "toggle")} style={{ flex: 1 }}>{t.running ? "⏸ Pause" : "▶ Start"}</button>
            <button className="btn btn-ghost" onClick={() => onUpdate(user.id, t.id, "reset")}>↺</button>
            <button className="btn btn-ghost" onClick={() => onFocusMode(t.id, user.id)}>🎯 Focus</button>
            <button className="btn-icon" style={{ color: "#ef4444" }} onClick={() => onDelete(user.id, t.id)}>🗑</button>
          </div>
          <textarea className="input" placeholder="📝 Notes (what are you working on?)" value={t.notes || ""} onChange={e => onUpdate(user.id, t.id, "notes", e.target.value)} rows={2} style={{ fontSize: 12, resize: "vertical" }} />
        </div>
      ))}
      <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>🍅 {user.pomodoroSessions} sessions completed</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PLAN VIEW (calendar + goals weekly/monthly/yearly)
   ═════════════════════════════════════════════════════════════════════ */
function PlanView({ state, active, setState, onAddEvent, onEditEvent, onDeleteEvent, onUpdateGoals }: any) {
  const [tab, setTab] = useState<"calendar"|"goals">("calendar");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 6 }}>
        <button className={tab === "calendar" ? "btn btn-p" : "btn btn-ghost"} onClick={() => setTab("calendar")} style={{ flex: 1 }}>📅 Calendar</button>
        <button className={tab === "goals" ? "btn btn-p" : "btn btn-ghost"} onClick={() => setTab("goals")} style={{ flex: 1 }}>🎯 Goals</button>
      </div>
      {tab === "calendar" && <CalendarView events={state.events || []} onAdd={onAddEvent} onEdit={onEditEvent} onDelete={onDeleteEvent} />}
      {tab === "goals" && <GoalsView user={active} onUpdate={(scope:any, key:any, goals:any) => onUpdateGoals(active.id, scope, key, goals)} />}
    </div>
  );
}

function CalendarView({ events, onAdd, onEdit, onDelete }: any) {
  const [view, setView] = useState<"month"|"week">("month");
  const [cursor, setCursor] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ id: "", title: "", date: today(), time: "09:00", type: "deadline", notes: "", reminders: [{ type: "1day", fired: false }] });

  const openNew = (d: string) => { setEditing(null); setForm({ id: uid(), title: "", date: d, time: "09:00", type: "deadline", notes: "", reminders: [{ type: "1day", fired: false }] }); setShowModal(true); };
  const openEdit = (ev: any) => { setEditing(ev); setForm({ ...ev }); setShowModal(true); };
  const save = () => { if (!form.title.trim()) return; if (editing) onEdit(form.id, form); else onAdd(form); setShowModal(false); };
  const del = () => { if (editing && confirm("Delete this event?")) { onDelete(editing.id); setShowModal(false); } };

  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = startOfWeek(monthStart);
  const cells: Date[] = [];
  let d = new Date(gridStart);
  for (let i = 0; i < 42; i++) { cells.push(new Date(d)); d = addDays(d, 1); }
  const weekCells = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(cursor), i));
  const byDate: any = {};
  events.forEach((e: any) => { byDate[e.date] = (byDate[e.date] || []).concat(e); });

  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button className="btn-icon" onClick={() => setCursor(addDays(cursor, view === "month" ? -30 : -7))}>‹</button>
          <span className="strong" style={{ fontSize: 16 }}>{cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>
          <button className="btn-icon" onClick={() => setCursor(addDays(cursor, view === "month" ? 30 : 7))}>›</button>
          <button className="btn btn-ghost" onClick={() => setCursor(new Date())}>Today</button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className={view === "month" ? "btn btn-p" : "btn btn-ghost"} onClick={() => setView("month")}>Month</button>
          <button className={view === "week" ? "btn btn-p" : "btn btn-ghost"} onClick={() => setView("week")}>Week</button>
          <button className="btn btn-p" onClick={() => openNew(today())}>+ Event</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        {Object.entries(EVENT_TYPES).map(([k, v]: any) => <span key={k} className="tag" style={{ background: v.color + "22", color: v.color }}>{v.icon} {v.label}</span>)}
      </div>

      <div className="cal-grid" style={{ marginBottom: 4 }}>
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, color: "var(--muted)", letterSpacing: 1 }}>{d}</div>)}
      </div>
      <div className="cal-grid">
        {(view === "month" ? cells : weekCells).map((day, i) => {
          const iso = isoOf(day);
          const other = day.getMonth() !== cursor.getMonth();
          const isToday = iso === today();
          const evs = byDate[iso] || [];
          return (
            <div key={i} className={`cal-day ${isToday ? "today" : ""} ${view === "month" && other ? "other-month" : ""}`} onClick={() => openNew(iso)}>
              <div className="cal-day-num">{day.getDate()}</div>
              {evs.slice(0, 2).map((ev:any) => (
                <div key={ev.id} onClick={e => { e.stopPropagation(); openEdit(ev); }} style={{ background: EVENT_TYPES[ev.type]?.color + "44", color: EVENT_TYPES[ev.type]?.color, fontSize: 9, padding: "1px 3px", borderRadius: 3, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {EVENT_TYPES[ev.type]?.icon} {ev.title}
                </div>
              ))}
              {evs.length > 2 && <div style={{ fontSize: 9, color: "var(--muted)" }}>+{evs.length - 2}</div>}
            </div>
          );
        })}
      </div>

      {/* Upcoming */}
      <div style={{ marginTop: 14 }}>
        <div className="strong" style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>UPCOMING</div>
        {events.filter((e:any) => new Date(e.date) >= new Date(today())).sort((a:any,b:any) => a.date.localeCompare(b.date)).slice(0, 6).map((ev:any) => (
          <div key={ev.id} className="card" style={{ display: "flex", gap: 10, marginBottom: 8, cursor: "pointer" }} onClick={() => openEdit(ev)}>
            <div style={{ fontSize: 24 }}>{EVENT_TYPES[ev.type]?.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{ev.title}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{ev.date} · {ev.time}</div>
              <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                {(ev.reminders || []).map((r:any, i:number) => <span key={i} className="tag" style={{ background: "var(--card)", color: "var(--muted)" }}>🔔 {r.type}</span>)}
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && <div style={{ textAlign: "center", padding: 16, color: "var(--muted)" }}>No events yet</div>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="glass modal" onClick={e => e.stopPropagation()}>
            <div className="strong" style={{ fontSize: 18, marginBottom: 12 }}>{editing ? "Edit Event" : "New Event"}</div>
            <input className="input" placeholder="Title (e.g. Website Deadline)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus style={{ marginBottom: 8 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input type="date" className="input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              <input type="time" className="input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              <select className="select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {Object.entries(EVENT_TYPES).map(([k, v]: any) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <textarea className="input" placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} style={{ marginBottom: 10, resize: "vertical" }} />
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: 1 }}>REMINDERS</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {["1day","1hr","15min","ontime"].map(rt => {
                const on = form.reminders.some((r:any) => r.type === rt);
                return (
                  <button key={rt} className={on ? "btn btn-p" : "btn btn-ghost"} style={{ padding: "4px 10px", fontSize: 11 }}
                    onClick={() => {
                      let next = form.reminders.filter((r:any) => r.type !== rt);
                      if (!on) next = [...next, { type: rt, fired: false }];
                      setForm({ ...form, reminders: next });
                    }}>
                    🔔 {rt === "1day" ? "1 day before" : rt === "1hr" ? "1 hr before" : rt === "15min" ? "15 min before" : "On time"}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-p" onClick={save}>{editing ? "Save" : "Create"}</button>
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
              {editing && <button className="btn btn-ghost" style={{ color: "#ef4444" }} onClick={del}>🗑 Delete</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GoalsView({ user, onUpdate }: any) {
  const [scope, setScope] = useState<"week"|"month"|"year">("week");
  const key = scope === "week" ? weekKey() : scope === "month" ? monthKey() : yearKey();
  const list = user.goals[scope]?.[key] || [];
  const [text, setText] = useState("");
  const add = () => {
    if (!text.trim() || list.length >= 3) return;
    onUpdate(scope, key, [...list, { id: uid(), text, done: false, breakdown: [] }]);
    setText("");
  };
  const toggle = (id: string) => onUpdate(scope, key, list.map((g:any) => g.id === id ? { ...g, done: !g.done } : g));
  const del = (id: string) => onUpdate(scope, key, list.filter((g:any) => g.id !== id));
  const breakdown = (g: any) => onUpdate(scope, key, list.map((x:any) => x.id === g.id ? { ...x, breakdown: AI.breakdown(g.text) } : x));

  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {(["week","month","year"] as const).map(s => (
          <button key={s} className={scope === s ? "btn btn-p" : "btn btn-ghost"} onClick={() => setScope(s)} style={{ flex: 1, textTransform: "capitalize" }}>{s}</button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>🎯 3 big goals max · {scope} of {key}</div>
      {list.length < 3 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          <input className="input" placeholder={`Big ${scope} goal…`} value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} />
          <button className="btn btn-p" onClick={add}>Add</button>
        </div>
      )}
      {list.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "var(--muted)" }}>No big goals yet. Pick 3 max — quality over quantity.</div>}
      {list.map((g:any) => (
        <div key={g.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className={`task-check ${g.done ? "checked" : ""}`} onClick={() => toggle(g.id)}>{g.done && <span style={{ color: "#fff" }}>✓</span>}</div>
            <div style={{ flex: 1, fontWeight: 700, textDecoration: g.done ? "line-through" : "none", opacity: g.done ? 0.6 : 1 }}>{g.text}</div>
            <button className="btn-icon" onClick={() => breakdown(g)}>🪄</button>
            <button className="btn-icon" style={{ color: "#ef4444" }} onClick={() => del(g.id)}>🗑</button>
          </div>
          {g.breakdown?.length > 0 && (
            <div style={{ marginTop: 10, paddingLeft: 38 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>AI Breakdown:</div>
              {g.breakdown.map((b:string, i:number) => <div key={i} style={{ fontSize: 12, padding: "3px 0" }}>• {b}</div>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PROGRESS VIEW (stats, heatmap, monthly zoom, achievements, reports)
   ═════════════════════════════════════════════════════════════════════ */
function ProgressView({ state, active }: any) {
  const u1 = state.users.u1, u2 = state.users.u2;
  const [tab, setTab] = useState<"overview"|"heatmap"|"achievements"|"reports">("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
        {[
          { id: "overview", label: "📊 Overview" },
          { id: "heatmap", label: "🟩 Heatmap" },
          { id: "achievements", label: "🏆 Achievements" },
          { id: "reports", label: "📈 Reports" },
        ].map(t => (
          <button key={t.id} className={tab === t.id ? "btn btn-p" : "btn btn-ghost"} onClick={() => setTab(t.id as any)} style={{ whiteSpace: "nowrap" }}>{t.label}</button>
        ))}
      </div>

      {tab === "overview" && <OverviewStats u1={u1} u2={u2} />}
      {tab === "heatmap" && <HeatmapView u1={u1} u2={u2} />}
      {tab === "achievements" && <AchievementsView state={state} />}
      {tab === "reports" && <ReportsView state={state} />}
    </div>
  );
}

function OverviewStats({ u1, u2 }: any) {
  const todC1 = [0,0,0,0], todC2 = [0,0,0,0];
  for (const u of [u1, u2]) {
    const buckets = u === u1 ? todC1 : todC2;
    u.tasks.forEach((t:any) => {
      if (t.done && t.completedAt) {
        const h = new Date(t.completedAt).getHours();
        if (h < 12) buckets[0]++; else if (h < 17) buckets[1]++; else if (h < 22) buckets[2]++; else buckets[3]++;
      }
    });
  }
  const cat: any = { work:0, personal:0, health:0, study:0, other:0 };
  [...u1.tasks, ...u2.tasks].filter((t:any) => t.done).forEach((t:any) => cat[t.category] = (cat[t.category]||0) + 1);
  const bd = [0,0,0,0,0,0,0];
  [...u1.tasks, ...u2.tasks].forEach((t:any) => { if (t.done && t.completedAt) bd[new Date(t.completedAt).getDay()]++; });
  const best = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][bd.indexOf(Math.max(...bd))];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }} className="grid-3">
        {[
          { lbl: "Tasks", v1: u1.tasks.filter((t:any)=>t.done).length, v2: u2.tasks.filter((t:any)=>t.done).length, ico: "✅" },
          { lbl: "Habits Today", v1: u1.habits.filter((h:any)=>h.lastDone===today()).length, v2: u2.habits.filter((h:any)=>h.lastDone===today()).length, ico: "🌿" },
          { lbl: "Pomos", v1: u1.pomodoroSessions, v2: u2.pomodoroSessions, ico: "🍅" },
          { lbl: "XP", v1: u1.xp, v2: u2.xp, ico: "⭐" },
        ].map(s => (
          <div key={s.lbl} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24 }}>{s.ico}</div>
            <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 1, margin: "4px 0" }}>{s.lbl.toUpperCase()}</div>
            <div className="strong" style={{ fontSize: 14 }}><span style={{ color: u1.color }}>{s.v1}</span> <span style={{ color: "var(--muted)" }}>/</span> <span style={{ color: u2.color }}>{s.v2}</span></div>
          </div>
        ))}
      </div>

      {/* Compare */}
      <div className="glass" style={{ padding: 16 }}>
        <div className="strong" style={{ fontSize: 14, marginBottom: 10 }}>📊 Compare Stats</div>
        {[
          { lbl: "XP", v1: u1.xp, v2: u2.xp },
          { lbl: "Tasks done", v1: u1.tasks.filter((t:any)=>t.done).length, v2: u2.tasks.filter((t:any)=>t.done).length },
          { lbl: "Pomodoros", v1: u1.pomodoroSessions, v2: u2.pomodoroSessions },
          { lbl: "Habit streaks", v1: u1.habits.reduce((a:number,h:any)=>a+h.streak,0), v2: u2.habits.reduce((a:number,h:any)=>a+h.streak,0) },
        ].map(s => {
          const max = Math.max(1, s.v1, s.v2);
          return (
            <div key={s.lbl} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, marginBottom: 4, display: "flex", justifyContent: "space-between" }}><span>{s.lbl}</span><span style={{ color: "var(--muted)" }}>{s.v1} vs {s.v2}</span></div>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ flex: 1 }}><div className="progress-bar"><div className="progress-fill" style={{ width: `${(s.v1/max)*100}%`, background: u1.color }} /></div></div>
                <div style={{ flex: 1 }}><div className="progress-bar"><div className="progress-fill" style={{ width: `${(s.v2/max)*100}%`, background: u2.color }} /></div></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="glass" style={{ padding: 14 }}>
          <div className="strong" style={{ fontSize: 13, marginBottom: 8 }}>⏰ Time of Day</div>
          {["Morning","Afternoon","Evening","Night"].map((p, i) => (
            <div key={p} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, display: "flex", justifyContent: "space-between" }}><span>{p}</span><span style={{ color: "var(--muted)" }}>{todC1[i]} / {todC2[i]}</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(100, (todC1[i]+todC2[i])*15)}%`, background: ["#fbbf24","#3b82f6","#a855f7","#1e293b"][i] }} /></div>
            </div>
          ))}
        </div>
        <div className="glass" style={{ padding: 14 }}>
          <div className="strong" style={{ fontSize: 13, marginBottom: 8 }}>🗂 Categories</div>
          {Object.entries(cat).map(([k,v]:any) => (
            <div key={k} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, display: "flex", justifyContent: "space-between" }}><span style={{ color: CATEGORY_COLORS[k] }}>{k}</span><span style={{ color: "var(--muted)" }}>{v}</span></div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(100, v*10)}%`, background: CATEGORY_COLORS[k] }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>📅 Best day of week</div>
        <div className="strong" style={{ fontSize: 22, color: "var(--brand)" }}>{best}</div>
      </div>
    </>
  );
}

function HeatmapView({ u1, u2 }: any) {
  const days = useMemo(() => {
    const arr = [];
    const start = addDays(new Date(), -364);
    for (let i = 0; i < 365; i++) {
      const d = isoOf(addDays(start, i));
      const c1 = u1.habits.reduce((a:number, h:any) => a + (h.history?.includes(d) ? 1 : 0), 0);
      const c2 = u2.habits.reduce((a:number, h:any) => a + (h.history?.includes(d) ? 1 : 0), 0);
      arr.push({ d, c: c1 + c2 });
    }
    return arr;
  }, [u1, u2]);
  const max = Math.max(1, ...days.map(d => d.c));

  // Monthly zoom
  const [zoomMonth, setZoomMonth] = useState(monthKey());
  const months = useMemo(() => Array.from(new Set(days.map(d => d.d.slice(0,7)))).sort(), [days]);
  const zoomDays = days.filter(d => d.d.startsWith(zoomMonth));
  const zoomD = new Date(zoomMonth + "-01");
  const zoomStart = startOfWeek(zoomD);
  const zoomCells: Date[] = [];
  let zd = new Date(zoomStart);
  for (let i = 0; i < 42; i++) { zoomCells.push(new Date(zd)); zd = addDays(zd, 1); }
  const dayCount: any = {};
  zoomDays.forEach(d => dayCount[d.d] = d.c);

  return (
    <>
      <div className="glass" style={{ padding: 16 }}>
        <div className="strong" style={{ fontSize: 14, marginBottom: 10 }}>🟩 365-Day Streak (combined)</div>
        <div className="heatmap-big">
          {days.map(d => (
            <div key={d.d} className="heatmap-cell" title={`${d.d}: ${d.c} habits`} style={{ background: d.c === 0 ? "rgba(255,255,255,0.04)" : `rgba(249,115,22, ${0.2 + 0.8 * d.c / max})` }} />
          ))}
        </div>
      </div>

      <div className="glass" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <div className="strong" style={{ fontSize: 14 }}>🔍 Monthly Zoom</div>
          <select className="select" value={zoomMonth} onChange={e => setZoomMonth(e.target.value)}>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="cal-grid">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, color: "var(--muted)" }}>{d}</div>)}
          {zoomCells.map((day, i) => {
            const iso = isoOf(day);
            const inMonth = iso.startsWith(zoomMonth);
            const c = dayCount[iso] || 0;
            const opacity = c > 0 ? 0.25 + 0.75 * (c / max) : 0.08;
            return (
              <div key={i} style={{ aspectRatio: "1", borderRadius: 6, background: c > 0 ? `rgba(249,115,22,${opacity})` : "rgba(255,255,255,0.04)", border: iso === today() ? "2px solid var(--brand)" : "1px solid transparent", opacity: inMonth ? 1 : 0.25, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }} title={`${iso}: ${c}`}>{day.getDate()}</div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AchievementsView({ state }: any) {
  return (
    <div className="glass" style={{ padding: 16 }}>
      <div className="strong" style={{ fontSize: 14, marginBottom: 10 }}>🏆 Achievement Gallery</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
        {BADGES.map(b => {
          const has1 = state.users.u1.badges.includes(b.id);
          const has2 = state.users.u2.badges.includes(b.id);
          const unlocked = has1 || has2;
          const glow = TIER_GLOW[b.tier];
          return (
            <div key={b.id} className="card" style={{ textAlign: "center", opacity: unlocked ? 1 : 0.4, border: `1px solid ${unlocked ? glow : "var(--border)"}`, boxShadow: unlocked ? `0 0 12px ${glow}55` : "none" }}>
              <div style={{ fontSize: 36, filter: unlocked ? "none" : "grayscale(100%)" }}>{b.icon}</div>
              <div className="strong" style={{ fontSize: 11, color: unlocked ? glow : "var(--muted)", marginTop: 4 }}>{b.name}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>{b.tier}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReportsView({ state }: any) {
  const [tab, setTab] = useState<"weekly"|"monthly"|"yearly"|"review">("weekly");
  const u1 = state.users.u1, u2 = state.users.u2;
  let report = "";
  if (tab === "weekly") {
    const sw = startOfWeek(new Date()).getTime();
    const t1 = u1.tasks.filter((t:any) => t.done && t.completedAt && t.completedAt >= sw).length;
    const t2 = u2.tasks.filter((t:any) => t.done && t.completedAt && t.completedAt >= sw).length;
    report = `🗓 WEEKLY (${isoOf(startOfWeek(new Date()))} → ${today()})\n\n🌸 Hana: ${t1} tasks · 🌊 Riku: ${t2} tasks\nCombined XP: ${u1.xp + u2.xp}\n\n💜 Small wins compound. Sunday = reflection day. Pick 1 to celebrate, 1 to refine.`;
  } else if (tab === "monthly") {
    const late = [...u1.tasks, ...u2.tasks].filter((t:any) => t.dueDate && !t.done && new Date(t.dueDate) < new Date()).length;
    const streaks = [...u1.habits, ...u2.habits].reduce((a:number,h:any) => a + h.streak, 0);
    report = `🌙 MONTHLY REFLECTION (${monthKey()})\n\n• Celebrations: every habit you held → real wins\n• Late dues: ${late} tasks past due\n• Habit streak power: ${streaks}d combined\n\n🌸 You showed up. Most people don't. Be proud of effort, not just wins.`;
  } else if (tab === "yearly") {
    report = `🌟 YEARLY REVIEW (${yearKey()})\n\nTotal XP: ${u1.xp + u2.xp}\nThat's compounded daily effort.\n\nLook back: longest streaks, big breakthroughs.\nNext year: aim 10% smarter, not 100% harder.\n\nBe so good you can't ignore yourself.`;
  }

  if (tab === "review") {
    return <GuidedMonthlyReview state={state} />;
  }

  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {(["weekly","monthly","yearly","review"] as const).map(s => (
          <button key={s} className={tab === s ? "btn btn-p" : "btn btn-ghost"} onClick={() => setTab(s)}>{s}</button>
        ))}
      </div>
      <div className="glass" style={{ padding: 16 }}>
        <pre style={{ fontFamily: "inherit", whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6 }}>{report}</pre>
      </div>
    </>
  );
}

function GuidedMonthlyReview({ state }: any) {
  const active = state.users[state.activeUser];
  const [revMonth, setRevMonth] = useState(monthKey());
  const reviews = active.monthlyReviews || {};
  const current = reviews[revMonth] || {};
  const [answers, setAnswers] = useState<any>(current);
  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div className="strong" style={{ fontSize: 14 }}>📝 Guided Monthly Review</div>
        <input type="month" className="select" value={revMonth} onChange={e => { setRevMonth(e.target.value); setAnswers(reviews[e.target.value] || {}); }} />
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>End-of-month structured reflection. Be honest. Be kind to yourself.</div>
      {MONTHLY_REVIEW_QUESTIONS.map((q, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "var(--brand)", marginBottom: 4, fontWeight: 700 }}>Q{i+1}. {q}</div>
          <textarea className="input" value={answers[q] || ""} onChange={e => setAnswers({ ...answers, [q]: e.target.value })} rows={3} placeholder="Your answer…" style={{ resize: "vertical" }} />
        </div>
      ))}
      <button className="btn btn-p" onClick={() => {
        active.monthlyReviews = { ...reviews, [revMonth]: answers };
        saveState(state);
        alert("Review saved 📝");
      }} style={{ width: "100%" }}>💾 Save Review</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DOJO VIEW (sensei, journal, library, social, whiteboard, time capsule)
   ═════════════════════════════════════════════════════════════════════ */
function DojoView({ state, setState, active, activeUserId, partner, partnerId, onUpdateJournal,
  onUpsertReading, onDeleteReading, onUpsertCourse, onDeleteCourse,
  onAddCapsule, onDeleteCapsule, pushToast, onConfetti, onAward, onExport }: any) {
  const [tab, setTab] = useState<"sensei"|"journal"|"library"|"social"|"whiteboard"|"capsule">("sensei");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
        {[
          { id: "sensei",    label: "🥷 Sensei" },
          { id: "journal",   label: "📓 Journal" },
          { id: "library",   label: "📚 Library" },
          { id: "social",    label: "🤝 Social" },
          { id: "whiteboard",label: "🎨 Whiteboard" },
          { id: "capsule",   label: "⏳ Capsule" },
        ].map(t => (
          <button key={t.id} className={tab === t.id ? "btn btn-p" : "btn btn-ghost"} onClick={() => setTab(t.id as any)} style={{ whiteSpace: "nowrap" }}>{t.label}</button>
        ))}
      </div>
      {tab === "sensei" && <SenseiPanel active={active} state={state} />}
      {tab === "journal" && <JournalPanel user={active} onUpdate={(d:string, e:any) => onUpdateJournal(activeUserId, d, e)} />}
      {tab === "library" && <LibraryPanel user={active} onUpsertReading={(b:any) => onUpsertReading(activeUserId, b)} onDeleteReading={(id:string) => onDeleteReading(activeUserId, id)} onUpsertCourse={(c:any) => onUpsertCourse(activeUserId, c)} onDeleteCourse={(id:string) => onDeleteCourse(activeUserId, id)} />}
      {tab === "social" && <SocialPanel state={state} setState={setState} active={active} pushToast={pushToast} onConfetti={onConfetti} />}
      {tab === "whiteboard" && <WhiteboardPanel state={state} setState={setState} userId={activeUserId} />}
      {tab === "capsule" && <CapsulePanel user={active} onAdd={(m:string, u:string) => onAddCapsule(activeUserId, m, u)} onDelete={(id:string) => onDeleteCapsule(activeUserId, id)} />}
    </div>
  );
}

function SenseiPanel({ active, state }: any) {
  const [chat, setChat] = useState<any[]>([{ from: "sensei", text: `Welcome, ${active.name}. What's on your mind?` }]);
  const [input, setInput] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  const [examDate, setExamDate] = useState("");
  const [topics, setTopics] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const m = input.toLowerCase();
    setChat(c => [...c, { from: "you", text: input }]);
    setInput("");
    setTimeout(() => {
      let reply = "Pick 1 small task. 25 min. Begin. Momentum is built, not summoned.";
      if (m.includes("focus") || m.includes("today")) reply = "Top task. 25 min timer. Phone away. Begin.";
      else if (m.includes("week") || m.includes("review")) reply = AI.weeklySummary(active);
      else if (m.includes("habit")) reply = AI.habitCoach(active);
      else if (m.includes("priority")) { const tasks = AI.prioritize(active.tasks.filter((t:any)=>!t.done)).slice(0,3); reply = "Top 3: " + (tasks.map((t:any)=>t.title).join(" → ") || "no active tasks"); }
      else if (m.includes("procrast")) { const pp = AI.procrastination(active.tasks); reply = pp.length ? "Sitting > 3 days:\n" + pp.map((t:any)=>"• "+t.title).join("\n") : "No procrastination flags. You're moving."; }
      else if (m.includes("mood") || m.includes("tired")) reply = AI.moodSuggest(2);
      setChat(c => [...c, { from: "sensei", text: reply }]);
    }, 350);
  };

  const plan = AI.studyPlan(examDate, topics.split(",").map(t => t.trim()).filter(Boolean));

  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button className={!showPlan ? "btn btn-p" : "btn btn-ghost"} onClick={() => setShowPlan(false)}>💬 Chat</button>
        <button className={showPlan ? "btn btn-p" : "btn btn-ghost"} onClick={() => setShowPlan(true)}>📚 Study Plan</button>
      </div>

      {!showPlan ? (
        <>
          <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 10 }}>
            {chat.map((m, i) => (
              <div key={i} style={{ marginBottom: 8, padding: 10, borderRadius: 12, background: m.from === "you" ? "var(--card)" : "rgba(249,115,22,0.1)" }}>
                <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2 }}>{m.from === "you" ? "You" : "Sensei 🥷"}</div>
                <div style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input className="input" placeholder='Try: "what should I focus on today?"' value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
            <button className="btn btn-p" onClick={send}>Send</button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <input type="date" className="input" value={examDate} onChange={e => setExamDate(e.target.value)} style={{ minWidth: 160 }} />
            <input className="input" placeholder="Topics, comma separated" value={topics} onChange={e => setTopics(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          </div>
          {plan.length === 0 ? <div style={{ color: "var(--muted)", fontSize: 12 }}>Enter exam date + topics</div> :
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {plan.map((p:any) => (
                <div key={p.day} className="card" style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <div className="strong" style={{ width: 40, color: "var(--brand)" }}>D{p.day}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.date}</div>
                    {p.tasks.map((t:string, i:number) => <div key={i} style={{ fontSize: 13 }}>• {t}</div>)}
                  </div>
                </div>
              ))}
            </div>
          }
        </>
      )}
    </div>
  );
}

function JournalPanel({ user, onUpdate }: any) {
  const [d, setD] = useState(today());
  const entry = user.journal?.[d] || {};
  const update = (k: string, v: any) => onUpdate(d, { [k]: v });
  const moods = ["😞","😕","😐","🙂","😄"];
  const slider = (label: string, key: string, color: string) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span>{label}</span><span style={{ color }}>{entry[key] || 0}/10</span></div>
      <input type="range" min={0} max={10} value={entry[key] || 0} onChange={e => update(key, Number(e.target.value))} style={{ width: "100%", accentColor: color }} />
      <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
        {Array.from({length:10}, (_,i) => <div key={i} style={{ flex: 1, height: 8, borderRadius: 2, background: i < (entry[key]||0) ? `${color}${Math.min(255, 80 + i*15).toString(16)}` : "rgba(255,255,255,0.04)" }} />)}
      </div>
    </div>
  );

  const wellness = useMemo(() => {
    const w = ((entry.sleep||0) + (entry.health||0) + (10 - (entry.stress||0)) + (entry.productivity||0) + (entry.selfcare||0)) / 5;
    return Math.round(w * 10);
  }, [entry]);

  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <input type="date" className="input" value={d} onChange={e => setD(e.target.value)} style={{ maxWidth: 200 }} />
        <select className="select" value={entry.privacy || "private"} onChange={e => update("privacy", e.target.value)}>
          <option value="private">🔒 Private</option><option value="shared">🤝 Shared</option>
        </select>
      </div>
      <textarea className="input" placeholder="What's on your mind today?" value={entry.note || ""} onChange={e => update("note", e.target.value)} rows={4} style={{ marginBottom: 12, resize: "vertical" }} />
      <button className="btn btn-ghost" onClick={() => update("note", (entry.note || "") + "\n\n" + `Today I felt ___. What stood out: ___. Grateful for: ___. Tomorrow I will: ___.`)} style={{ marginBottom: 12 }}>✨ AI Writing Help</button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="grid-2">
        <div>
          {slider("😴 Sleep",         "sleep",        "#a855f7")}
          {slider("💪 Health",        "health",       "#10b981")}
          {slider("😰 Stress",        "stress",       "#ef4444")}
          {slider("🚀 Productivity",  "productivity", "#3b82f6")}
        </div>
        <div>
          {slider("🧘 Self-care",     "selfcare",     "#ec4899")}
          {slider("🌐 Website work",  "website",      "#f59e0b")}
          {slider("🏋️ Workout",       "workout",      "#84cc16")}
          {slider("⭐ Rate the day",   "rating",       "#fbbf24")}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="strong" style={{ fontSize: 13, marginBottom: 6 }}>😊 Mood</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-around" }}>
          {moods.map((m, i) => (
            <button key={m} onClick={() => update("mood", i)} style={{ fontSize: 28, padding: 8, borderRadius: 12, border: entry.mood === i ? "2px solid var(--brand)" : "2px solid transparent", background: entry.mood === i ? "var(--card)" : "transparent", cursor: "pointer" }}>{m}</button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 8 }}>{AI.moodSuggest(entry.mood || 2)}</div>
      </div>

      <div className="card" style={{ marginTop: 10 }}>
        <div className="strong" style={{ fontSize: 13, marginBottom: 6 }}>🌙 Cycle (optional)</div>
        <select className="select" value={entry.cyclePhase || ""} onChange={e => update("cyclePhase", e.target.value)}>
          <option value="">— Not tracking today —</option>
          <option value="menstrual">Menstrual</option><option value="follicular">Follicular</option>
          <option value="ovulation">Ovulation</option><option value="luteal">Luteal</option>
        </select>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>Sync expectations with your cycle. Follicular = ambition. Luteal = rest & reflection.</div>
      </div>

      <div className="card" style={{ marginTop: 10 }}>
        <div className="strong" style={{ fontSize: 13, marginBottom: 6 }}>💖 Wellness Score</div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${wellness}%`, background: "linear-gradient(90deg, var(--brand), var(--g))" }} /></div>
        <div style={{ fontSize: 12, color: "var(--g)", marginTop: 4 }}>{wellness}/100</div>
      </div>
    </div>
  );
}

function LibraryPanel({ user, onUpsertReading, onDeleteReading, onUpsertCourse, onDeleteCourse }: any) {
  const [tab, setTab] = useState<"books"|"courses">("books");
  const [bookForm, setBookForm] = useState<any>({ title: "", pagesTotal: 200, pagesRead: 0, dailyGoal: 20 });
  const [courseForm, setCourseForm] = useState<any>({ name: "", percent: 0 });
  return (
    <div className="glass" style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button className={tab === "books" ? "btn btn-p" : "btn btn-ghost"} onClick={() => setTab("books")} style={{ flex: 1 }}>📖 Books</button>
        <button className={tab === "courses" ? "btn btn-p" : "btn btn-ghost"} onClick={() => setTab("courses")} style={{ flex: 1 }}>🎓 Courses</button>
      </div>

      {tab === "books" && (
        <>
          <div className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <input className="input" placeholder="Title" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} style={{ flex: 2, minWidth: 140 }} />
              <input className="input" type="number" placeholder="Total" value={bookForm.pagesTotal} onChange={e => setBookForm({ ...bookForm, pagesTotal: Number(e.target.value) })} style={{ width: 90 }} />
              <input className="input" type="number" placeholder="Goal/day" value={bookForm.dailyGoal} onChange={e => setBookForm({ ...bookForm, dailyGoal: Number(e.target.value) })} style={{ width: 90 }} />
              <button className="btn btn-p" onClick={() => { if (bookForm.title.trim()) { onUpsertReading({ ...bookForm, id: uid(), history: {} }); setBookForm({ title: "", pagesTotal: 200, pagesRead: 0, dailyGoal: 20 }); } }}>+ Add</button>
            </div>
          </div>
          {user.reading.map((b:any) => (
            <div key={b.id} className="card" style={{ marginBottom: 8, display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 24 }}>📖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{b.title}</div>
                <div className="progress-bar" style={{ marginTop: 4 }}><div className="progress-fill" style={{ width: `${(b.pagesRead/b.pagesTotal)*100}%`, background: "var(--brand)" }} /></div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{b.pagesRead}/{b.pagesTotal} pages · goal {b.dailyGoal}/day</div>
              </div>
              <button className="btn btn-ghost" onClick={() => { const p = Number(prompt("Pages read?")); if (p) onUpsertReading({ ...b, pagesRead: Math.min(b.pagesTotal, b.pagesRead + p), history: { ...(b.history||{}), [today()]: (b.history?.[today()]||0) + p } }); }}>+ Log</button>
              <button className="btn-icon" style={{ color: "#ef4444" }} onClick={() => onDeleteReading(b.id)}>🗑</button>
            </div>
          ))}
        </>
      )}

      {tab === "courses" && (
        <>
          <div className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <input className="input" placeholder="Course name" value={courseForm.name} onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} style={{ flex: 2, minWidth: 140 }} />
              <input className="input" type="number" min={0} max={100} placeholder="%" value={courseForm.percent} onChange={e => setCourseForm({ ...courseForm, percent: Number(e.target.value) })} style={{ width: 80 }} />
              <button className="btn btn-p" onClick={() => { if (courseForm.name.trim()) { onUpsertCourse({ ...courseForm, id: uid(), history: {} }); setCourseForm({ name: "", percent: 0 }); } }}>+ Add</button>
            </div>
          </div>
          {user.courses.map((c:any) => (
            <div key={c.id} className="card" style={{ marginBottom: 8, display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 24 }}>🎓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div className="progress-bar" style={{ marginTop: 4 }}><div className="progress-fill" style={{ width: `${c.percent}%`, background: "linear-gradient(90deg, var(--g), var(--brand))" }} /></div>
              </div>
              <input type="number" className="input" min={0} max={100} value={c.percent} onChange={e => onUpsertCourse({ ...c, percent: Math.max(0, Math.min(100, Number(e.target.value))) })} style={{ width: 80 }} />
              <button className="btn-icon" style={{ color: "#ef4444" }} onClick={() => onDeleteCourse(c.id)}>🗑</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function SocialPanel({ state, setState, active, pushToast, onConfetti }: any) {
  const wall = state.celebrationWall || [];
  return (
    <div className="glass" style={{ padding: 16 }}>
      <div className="strong" style={{ fontSize: 14, marginBottom: 10 }}>🎉 Celebration Wall</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button className="btn btn-p" onClick={() => {
          const t = prompt(`Celebrate what, ${active.name}?`);
          if (t) {
            const item = { id: uid(), user: active.id, text: t, emoji: "🎉", ts: nowTs(), reactions: [] };
            setState((s:any) => ({ ...s, celebrationWall: [item, ...(s.celebrationWall || [])].slice(0, 50) }));
            onConfetti(true);
          }
        }}>+ Share Win</button>
      </div>
      {wall.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "var(--muted)" }}>No wins posted yet — first one's on you!</div>}
      {wall.map((w:any) => (
        <div key={w.id} className="card" style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ fontSize: 22 }}>{w.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{state.users[w.user]?.name}: {w.text}</div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>{new Date(w.ts).toLocaleString()}</div>
              {w.reactions?.length > 0 && <div style={{ marginTop: 4 }}>{w.reactions.join("")}</div>}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["🔥","💪","👏","🌸","⚔️"].map(e => (
                <button key={e} className="btn-icon" onClick={() => {
                  setState((s:any) => ({ ...s, celebrationWall: s.celebrationWall.map((x:any) => x.id === w.id ? { ...x, reactions: [...(x.reactions || []), e] } : x) }));
                }}>{e}</button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WhiteboardPanel({ state, setState, userId }: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#f97316");
  const [size, setSize] = useState(4);
  const stroke = useRef<any>(null);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    (state.whiteboard || []).forEach((s: any) => {
      ctx.strokeStyle = s.color; ctx.lineWidth = s.size; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath();
      s.points.forEach((p: any, i: number) => i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]));
      ctx.stroke();
    });
  }, [state.whiteboard]);

  const getPos = (e: any) => {
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return [x * (c.width / r.width), y * (c.height / r.height)];
  };

  const onDown = (e: any) => { setDrawing(true); stroke.current = { id: uid(), from: userId, points: [getPos(e)], color, size }; };
  const onMove = (e: any) => {
    if (!drawing || !stroke.current) return;
    stroke.current.points.push(getPos(e));
    const c = canvasRef.current!; const ctx = c.getContext("2d")!;
    const pts = stroke.current.points; if (pts.length < 2) return;
    ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(pts[pts.length-2][0], pts[pts.length-2][1]); ctx.lineTo(pts[pts.length-1][0], pts[pts.length-1][1]); ctx.stroke();
  };
  const onUp = () => { if (!drawing || !stroke.current) return; setState((s:any) => ({ ...s, whiteboard: [...(s.whiteboard||[]), stroke.current] })); setDrawing(false); stroke.current = null; };

  return (
    <div className="glass" style={{ padding: 16 }}>
      <div className="strong" style={{ fontSize: 14, marginBottom: 10 }}>🎨 Shared Whiteboard</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 44, height: 36, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }} />
        <select className="select" value={size} onChange={e => setSize(Number(e.target.value))} style={{ width: 100 }}>
          {[2,4,6,10,16].map(s => <option key={s} value={s}>{s}px</option>)}
        </select>
        <button className="btn btn-ghost" onClick={() => { if (confirm("Clear whiteboard?")) setState((s:any) => ({ ...s, whiteboard: [] })); }}>Clear</button>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>Both ninjas share this canvas</div>
      </div>
      <canvas ref={canvasRef} width={800} height={500} className="whiteboard-canvas"
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
        style={{ width: "100%", height: 400 }} />
    </div>
  );
}

function CapsulePanel({ user, onAdd, onDelete }: any) {
  const [msg, setMsg] = useState("");
  const [unlock, setUnlock] = useState(isoOf(addDays(new Date(), 30)));
  return (
    <div className="glass" style={{ padding: 16 }}>
      <div className="strong" style={{ fontSize: 14, marginBottom: 10 }}>⏳ Time Capsule</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>Write a message to your future self. Locked until your chosen date.</div>
      <textarea className="input" placeholder="Dear future me…" value={msg} onChange={e => setMsg(e.target.value)} rows={4} style={{ resize: "vertical", marginBottom: 8 }} />
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input type="date" className="input" value={unlock} onChange={e => setUnlock(e.target.value)} />
        <button className="btn btn-p" onClick={() => { if (msg.trim()) { onAdd(msg, unlock); setMsg(""); } }}>🔒 Lock</button>
      </div>
      {(user.timeCapsules || []).map((c:any) => {
        const locked = c.unlock > today();
        return (
          <div key={c.id} className="card" style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 24 }}>{locked ? "🔒" : "🔓"}</div>
              <div style={{ flex: 1 }}>
                {locked ? (
                  <>
                    <div style={{ fontWeight: 700 }}>Sealed message</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>Unlocks {fmtDate(c.unlock)}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{c.msg}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>Written {new Date(c.createdAt).toLocaleDateString()}</div>
                  </>
                )}
              </div>
              <button className="btn-icon" style={{ color: "#ef4444" }} onClick={() => onDelete(c.id)}>🗑</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SETTINGS MODAL
   ═════════════════════════════════════════════════════════════════════ */
function SettingsModal({ state, onClose, onSetTheme, onUpdateUser, onExport, pushToast }: any) {
  const active = state.users[state.activeUser];
  const [name, setName] = useState(active.name);
  const [emoji, setEmoji] = useState(active.emoji);
  const [color, setColor] = useState(active.color);
  const [avatar, setAvatar] = useState(active.avatar);
  const [pet, setPet] = useState(active.pet);
  const [nudgeHour, setNudgeHour] = useState(active.settings.nudgeHour || 21);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div className="strong" style={{ fontSize: 18 }}>⚙️ Settings</div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        {/* Theme */}
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: 1 }}>THEME</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
          {Object.entries(THEMES).map(([k, v]: any) => (
            <button key={k} className={state.theme === k ? "btn btn-p" : "btn btn-ghost"} onClick={() => onSetTheme(k)} style={{ padding: "6px 12px", fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: v.p, display: "inline-block", marginRight: 6 }}></span>
              {v.name}
            </button>
          ))}
        </div>

        {/* Profile */}
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: 1 }}>PROFILE — {active.name}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 8, marginBottom: 8 }}>
          <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Emoji" value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={4} />
          <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ border: "none", borderRadius: 8, height: 42, cursor: "pointer", background: "none" }} />
        </div>

        {/* Avatar picker */}
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: 1, marginTop: 12 }}>AVATAR</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 6, marginBottom: 12 }}>
          {AVATAR_OPTIONS.map(a => (
            <button key={a.id} onClick={() => setAvatar(a.id)} style={{ padding: 4, borderRadius: 12, border: avatar === a.id ? "3px solid var(--brand)" : "2px solid transparent", background: "var(--card)", cursor: "pointer" }}>
              <img src={a.file} alt={a.name} onError={(e:any) => e.target.style.display = "none"} style={{ width: "100%", aspectRatio: "1", borderRadius: 8, objectFit: "cover", display: "block" }} />
              <div style={{ fontSize: 9, marginTop: 2 }}>{a.name}</div>
            </button>
          ))}
        </div>

        {/* Pet picker */}
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: 1 }}>PET</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: 6, marginBottom: 12 }}>
          {PET_OPTIONS.map(p => (
            <button key={p.id} onClick={() => setPet(p.id)} style={{ padding: 4, borderRadius: 12, border: pet === p.id ? "3px solid var(--brand)" : "2px solid transparent", background: "var(--card)", cursor: "pointer" }}>
              <img src={p.file} alt={p.name} onError={(e:any) => e.target.style.display = "none"} style={{ width: "100%", aspectRatio: "1", borderRadius: 8, objectFit: "cover", display: "block" }} />
              <div style={{ fontSize: 9, marginTop: 2 }}>{p.name}</div>
            </button>
          ))}
        </div>

        {/* Buddy nudge */}
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: 1 }}>HABIT BUDDY NUDGE</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12 }}>If partner hasn't logged habits by</span>
          <input type="number" min={6} max={23} className="input" value={nudgeHour} onChange={e => setNudgeHour(Number(e.target.value))} style={{ width: 70 }} />
          <span style={{ fontSize: 12 }}>:00</span>
        </div>

        {/* Save */}
        <button className="btn btn-p" style={{ width: "100%", marginBottom: 8 }} onClick={() => {
          onUpdateUser(active.id, { name: name.trim() || active.name, emoji: emoji.trim() || active.emoji, color, avatar, pet, settings: { ...active.settings, nudgeHour } });
          pushToast("Saved", "Profile updated 🥷"); onClose();
        }}>💾 Save Profile</button>

        {/* Data */}
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, letterSpacing: 1, marginTop: 12 }}>DATA</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={onExport}>⬇ Export JSON</button>
          <button className="btn btn-ghost" onClick={() => { try { Notification.requestPermission(); } catch {} }}>🔔 Enable Notifications</button>
          <button className="btn btn-ghost" style={{ color: "#ef4444" }} onClick={() => { if (confirm("Reset ALL data? This cannot be undone.")) { localStorage.removeItem(LS_KEY); location.reload(); } }}>🗑 Reset</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   WEEKLY PLANNING MODAL (Monday popup)
   ═════════════════════════════════════════════════════════════════════ */
function WeeklyPlanModal({ user, onClose, onSave }: any) {
  const [answers, setAnswers] = useState<any>({});
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass modal" onClick={e => e.stopPropagation()}>
        <div className="strong" style={{ fontSize: 20, marginBottom: 10, color: "var(--brand)" }}>🌅 Monday Setup</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>5 min · Pre-load your week, ninja</div>
        {WEEKLY_PLANNING_QUESTIONS.map((q, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: "var(--brand)", marginBottom: 4 }}>Q{i+1}. {q}</div>
            <textarea className="input" rows={2} value={answers[q] || ""} onChange={e => setAnswers({ ...answers, [q]: e.target.value })} style={{ resize: "vertical" }} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-p" onClick={() => onSave(answers)} style={{ flex: 1 }}>💾 Save & Begin Week</button>
          <button className="btn btn-ghost" onClick={onClose}>Skip</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FOCUS MODE (full-screen distraction-free)
   ═════════════════════════════════════════════════════════════════════ */
function FocusModeView({ timer, userId, onExit, onUpdate }: any) {
  const ref = useRef<any>(null);
  useEffect(() => {
    if (timer.running && !ref.current) {
      ref.current = setInterval(() => onUpdate(userId, timer.id, "tick"), 1000);
    } else if (!timer.running && ref.current) {
      clearInterval(ref.current); ref.current = null;
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [timer.running, timer.id, userId, onUpdate]);

  return (
    <div className="focus-mode">
      <div className="brushy" style={{ fontSize: 16, color: "var(--muted)", letterSpacing: 4 }}>⚔ FOCUS MODE</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>{timer.label}</div>
      <div className="focus-time anim-pulse">{formatTime(timer.remaining)}</div>
      {timer.notes && (
        <div className="card" style={{ maxWidth: 500, width: "100%" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, letterSpacing: 1 }}>WORKING ON</div>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>{timer.notes}</div>
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <button className={timer.running ? "btn btn-ghost" : "btn btn-p"} onClick={() => onUpdate(userId, timer.id, "toggle")} style={{ fontSize: 16, padding: "14px 28px" }}>{timer.running ? "⏸ Pause" : "▶ Start"}</button>
        <button className="btn btn-ghost" onClick={() => onUpdate(userId, timer.id, "reset")} style={{ fontSize: 16, padding: "14px 28px" }}>↺ Reset</button>
        <button className="btn btn-ghost" onClick={onExit} style={{ fontSize: 16, padding: "14px 28px" }}>← Exit</button>
      </div>
    </div>
  );
}
