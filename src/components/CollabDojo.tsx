"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Palette & Design Tokens ────────────────────────────────────────────────
const CSS = `
  

  :root {
    --bg:        #070714;
    --surface:   rgba(18,14,40,0.82);
    --border:    rgba(139,92,246,0.25);
    --glow-p:    #a855f7;
    --glow-b:    #3b82f6;
    --glow-pk:   #ec4899;
    --glow-g:    #10b981;
    --text:      #e2d9f3;
    --muted:     #7c6fa0;
    --card:      rgba(255,255,255,0.04);
    --card-h:    rgba(255,255,255,0.07);
    --r:         14px;
    --r-sm:      8px;
    --shadow-p:  0 0 24px rgba(168,85,247,0.3);
    --shadow-b:  0 0 24px rgba(59,130,246,0.3);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: var(--bg); color: var(--text); font-family: 'Nunito', sans-serif; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--glow-p); border-radius: 2px; }

  .orbitron { font-family: 'Orbitron', monospace; }
  .fira { font-family: 'Fira Code', monospace; }

  .glass {
    background: var(--surface);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: var(--r);
  }

  .glow-p { box-shadow: var(--shadow-p); border-color: rgba(168,85,247,0.5); }
  .glow-b { box-shadow: var(--shadow-b); border-color: rgba(59,130,246,0.5); }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 999px; border: none;
    font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 13px;
    cursor: pointer; transition: all .2s; outline: none;
    letter-spacing: 0.3px;
  }
  .btn:active { transform: scale(0.96); }

  .btn-p { background: linear-gradient(135deg,#7c3aed,#a855f7); color:#fff; }
  .btn-p:hover { box-shadow: 0 0 18px rgba(168,85,247,0.6); filter:brightness(1.1); }

  .btn-b { background: linear-gradient(135deg,#1d4ed8,#3b82f6); color:#fff; }
  .btn-b:hover { box-shadow: 0 0 18px rgba(59,130,246,0.6); filter:brightness(1.1); }

  .btn-pk { background: linear-gradient(135deg,#be185d,#ec4899); color:#fff; }
  .btn-pk:hover { box-shadow: 0 0 18px rgba(236,72,153,0.6); filter:brightness(1.1); }

  .btn-g { background: linear-gradient(135deg,#065f46,#10b981); color:#fff; }
  .btn-g:hover { box-shadow: 0 0 18px rgba(16,185,129,0.6); filter:brightness(1.1); }

  .btn-ghost {
    background: var(--card); color: var(--text);
    border: 1px solid var(--border);
  }
  .btn-ghost:hover { background: var(--card-h); }

  .btn-icon {
    padding: 6px; border-radius: 8px;
    background: var(--card); border: 1px solid var(--border);
    color: var(--muted); cursor: pointer; display:inline-flex;
    transition: all .15s;
  }
  .btn-icon:hover { color: var(--text); background: var(--card-h); }

  .input {
    width: 100%; background: rgba(0,0,0,0.3);
    border: 1px solid var(--border); border-radius: var(--r-sm);
    color: var(--text); font-family: 'Nunito', sans-serif;
    font-size: 14px; padding: 9px 12px; outline: none;
    transition: border-color .2s;
  }
  .input:focus { border-color: var(--glow-p); box-shadow: 0 0 12px rgba(168,85,247,0.2); }
  .input::placeholder { color: var(--muted); }

  .select {
    background: rgba(0,0,0,0.3); border: 1px solid var(--border);
    border-radius: var(--r-sm); color: var(--text);
    font-family: 'Nunito', sans-serif; font-size: 13px;
    padding: 8px 10px; outline: none; cursor: pointer;
  }
  .select:focus { border-color: var(--glow-p); }

  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 700;
    letter-spacing: 0.5px;
  }

  .badge {
    display: inline-flex; align-items: center; justify-content:center;
    min-width: 20px; height: 20px; padding: 0 5px;
    border-radius: 999px; font-size: 10px; font-weight: 800;
    font-family: 'Orbitron', monospace;
  }

  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(168,85,247,0.4)} 70%{box-shadow:0 0 0 20px rgba(168,85,247,0)} 100%{box-shadow:0 0 0 0 rgba(168,85,247,0)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes strikethrough { from{width:0} to{width:100%} }
  @keyframes confetti-fall { 0%{transform:translateY(-100px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
  @keyframes breathe { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.04);opacity:1} }
  @keyframes particle-drift {
    0%{transform:translate(0,0) scale(1);opacity:0.6}
    33%{transform:translate(30px,-40px) scale(1.2);opacity:0.9}
    66%{transform:translate(-20px,-80px) scale(0.8);opacity:0.4}
    100%{transform:translate(10px,-120px) scale(0.5);opacity:0}
  }
  @keyframes xp-pop { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-50px) scale(1.3);opacity:0} }
  @keyframes level-up { 0%{transform:scale(0.5) rotate(-10deg);opacity:0} 50%{transform:scale(1.1) rotate(2deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes streak-bounce { 0%,100%{transform:scale(1)} 40%{transform:scale(1.25)} 70%{transform:scale(0.95)} }

  .anim-fade { animation: fadeIn 0.3s ease forwards; }
  .anim-breathe { animation: breathe 3s ease-in-out infinite; }
  .anim-float { animation: float 4s ease-in-out infinite; }
  .anim-pulse { animation: pulse-ring 2s infinite; }

  .progress-bar {
    height: 6px; border-radius: 999px;
    background: rgba(255,255,255,0.08); overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 999px;
    transition: width 0.5s ease;
  }

  .tab-bar {
    display: flex; gap: 4px; padding: 4px;
    background: rgba(0,0,0,0.3); border-radius: 999px;
    border: 1px solid var(--border);
  }
  .tab-btn {
    flex: 1; padding: 8px 16px; border-radius: 999px; border: none;
    font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 13px;
    cursor: pointer; transition: all .2s; color: var(--muted); background: transparent;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .tab-btn.active {
    background: linear-gradient(135deg,#7c3aed,#a855f7);
    color: #fff; box-shadow: 0 0 16px rgba(168,85,247,0.4);
  }
  .tab-btn:not(.active):hover { color: var(--text); background: var(--card); }

  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px 12px; border-bottom: 1px solid var(--border);
  }

  .scrollable { overflow-y: auto; max-height: calc(100vh - 280px); padding: 4px; }

  .task-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px; border-radius: var(--r-sm);
    background: var(--card); border: 1px solid transparent;
    transition: all .2s; margin-bottom: 6px; cursor: default;
    position: relative; overflow: hidden;
  }
  .task-item:hover { background: var(--card-h); border-color: var(--border); }
  .task-item.done { opacity: 0.55; }

  .task-checkbox {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid var(--muted); background: transparent;
    cursor: pointer; flex-shrink: 0; margin-top: 2px;
    transition: all .2s; display: flex; align-items: center; justify-content: center;
  }
  .task-checkbox.checked {
    background: linear-gradient(135deg,#7c3aed,#a855f7);
    border-color: transparent; box-shadow: 0 0 10px rgba(168,85,247,0.5);
  }

  .circle-timer {
    position: relative; display: flex; align-items: center; justify-content: center;
  }
  .circle-timer svg { transform: rotate(-90deg); }

  .habit-card {
    padding: 14px 16px; border-radius: var(--r-sm);
    background: var(--card); border: 1px solid var(--border);
    margin-bottom: 8px; transition: all .2s;
  }
  .habit-card:hover { background: var(--card-h); }

  .heatmap-cell {
    width: 12px; height: 12px; border-radius: 2px;
    transition: all .15s; cursor: default;
  }
  .heatmap-cell:hover { transform: scale(1.3); }

  .confetti-piece {
    position: fixed; width: 10px; height: 10px;
    pointer-events: none; z-index: 9999;
    animation: confetti-fall 1.5s ease-in forwards;
  }

  .particle {
    position: absolute; border-radius: 50%;
    pointer-events: none; animation: particle-drift linear infinite;
  }

  .xp-pop {
    position: fixed; font-family: 'Orbitron', monospace;
    font-size: 18px; font-weight: 900; pointer-events: none;
    z-index: 9998; animation: xp-pop 1.2s ease-out forwards;
    text-shadow: 0 0 20px currentColor;
  }

  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 800; flex-shrink: 0;
  }

  .stat-card {
    padding: 14px; border-radius: var(--r-sm);
    background: var(--card); border: 1px solid var(--border);
    text-align: center;
  }

  .priority-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 6px;
  }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px); z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .modal {
    width: 100%; max-width: 440px; padding: 28px;
    animation: fadeIn 0.2s ease forwards;
  }

  .tooltip {
    position: relative;
  }
  .tooltip::after {
    content: attr(data-tip); position: absolute; bottom: 120%; left: 50%;
    transform: translateX(-50%); background: rgba(0,0,0,0.9);
    color: var(--text); font-size: 11px; padding: 4px 8px;
    border-radius: 4px; white-space: nowrap; opacity: 0;
    transition: opacity .15s; pointer-events: none; z-index: 100;
  }
  .tooltip:hover::after { opacity: 1; }

  .ambient-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
  }
  .orb {
    position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12;
  }

  @media (max-width: 900px) {
    .split-layout { flex-direction: column !important; }
    .scrollable { max-height: 400px; }
  }
`;

// ─── Utilities ───────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const daysSince = (dateStr) => Math.floor((Date.now() - new Date(dateStr)) / 86400000);

const PRIORITY_COLORS = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
const CATEGORY_COLORS = { work: "#3b82f6", personal: "#a855f7", health: "#10b981", study: "#ec4899", other: "#6b7280" };
const BADGES = [
  { id: "first_habit", icon: "🌱", name: "Seedling", desc: "Complete your first habit", xp: 50 },
  { id: "streak_3", icon: "🔥", name: "On Fire", desc: "3-day streak", xp: 100 },
  { id: "streak_7", icon: "⚡", name: "Thunder Week", desc: "7-day streak", xp: 250 },
  { id: "task_master", icon: "✅", name: "Task Master", desc: "Complete 10 tasks", xp: 150 },
  { id: "pomodoro_5", icon: "🍅", name: "Tomato Farmer", desc: "Complete 5 Pomodoros", xp: 200 },
  { id: "level_5", icon: "🌟", name: "Rising Star", desc: "Reach Level 5", xp: 300 },
];

const XP_PER_LEVEL = 500;
const getLevel = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;
const getLevelProgress = (xp) => ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

// ─── Initial Data ─────────────────────────────────────────────────────────────
const makeUser = (id, name, emoji, color) => ({
  id, name, emoji, color,
  xp: 0, tasks: [], habits: [], timers: [],
  pomodoroSessions: 0, completedTasks: 0, streaks: {},
  badges: [], settings: { pomoDuration: 25, shortBreak: 5, longBreak: 15 },
});

const INITIAL_STATE = {
  activeUser: "u1",
  users: {
    u1: { ...makeUser("u1", "Hana", "🌸", "#a855f7"), xp: 120,
      tasks: [
        { id: uid(), title: "Design the landing page", priority: "high", category: "work", done: false, notes: "Use Figma + TailwindCSS", dueDate: today(), subtasks: [], createdAt: Date.now() },
        { id: uid(), title: "Read 30 pages of novel", priority: "medium", category: "personal", done: false, notes: "", dueDate: "", subtasks: [], createdAt: Date.now() },
        { id: uid(), title: "Morning yoga session", priority: "low", category: "health", done: true, notes: "", dueDate: "", subtasks: [], createdAt: Date.now() },
      ],
      habits: [
        { id: uid(), name: "🧘 Meditate 10min", color: "#a855f7", streak: 5, lastDone: today(), history: [today()], xpPerDay: 30 },
        { id: uid(), name: "📚 Study 1 hour", color: "#3b82f6", streak: 3, lastDone: "", history: [], xpPerDay: 50 },
        { id: uid(), name: "💧 Drink 8 glasses", color: "#10b981", streak: 12, lastDone: today(), history: [today()], xpPerDay: 20 },
      ],
      timers: [{ id: uid(), label: "Deep Work", duration: 25 * 60, remaining: 25 * 60, running: false, phase: "focus" }],
    },
    u2: { ...makeUser("u2", "Riku", "🌊", "#3b82f6"), xp: 85,
      tasks: [
        { id: uid(), title: "Implement auth system", priority: "high", category: "work", done: false, notes: "Firebase Auth", dueDate: today(), subtasks: [], createdAt: Date.now() },
        { id: uid(), title: "Learn Japanese N3 vocab", priority: "medium", category: "study", done: false, notes: "Anki deck", dueDate: "", subtasks: [], createdAt: Date.now() },
      ],
      habits: [
        { id: uid(), name: "🏃 Run 5km", color: "#ec4899", streak: 2, lastDone: "", history: [], xpPerDay: 60 },
        { id: uid(), name: "✍️ Journal daily", color: "#f59e0b", streak: 7, lastDone: today(), history: [today()], xpPerDay: 25 },
      ],
      timers: [{ id: uid(), label: "Coding Sprint", duration: 25 * 60, remaining: 25 * 60, running: false, phase: "focus" }],
    },
  },
  confetti: [],
  xpPops: [],
  activeTab: "tasks",
  notification: null,
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

function AmbientBg() {
  return (
    <div className="ambient-bg">
      <div className="orb" style={{ width: 600, height: 600, background: "#7c3aed", top: -200, left: -100, animation: "float 8s ease-in-out infinite" }} />
      <div className="orb" style={{ width: 500, height: 500, background: "#1d4ed8", bottom: -150, right: -100, animation: "float 10s ease-in-out infinite reverse" }} />
      <div className="orb" style={{ width: 300, height: 300, background: "#be185d", top: "40%", left: "45%", animation: "float 12s ease-in-out infinite 2s" }} />
      {[...Array(18)].map((_, i) => (
        <div key={i} className="particle" style={{
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          background: ["#a855f7", "#3b82f6", "#ec4899", "#10b981"][i % 4],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${8 + Math.random() * 12}s`,
          animationDelay: `${Math.random() * 8}s`,
          opacity: 0.5,
        }} />
      ))}
    </div>
  );
}

function Confetti({ pieces }) {
  return pieces.map(p => (
    <div key={p.id} className="confetti-piece" style={{
      left: p.x, top: 0,
      background: p.color,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      animationDuration: `${1 + Math.random()}s`,
      animationDelay: `${Math.random() * 0.3}s`,
    }} />
  ));
}

function XpPops({ pops }) {
  return pops.map(p => (
    <div key={p.id} className="xp-pop" style={{ left: p.x, top: p.y, color: p.color }}>
      +{p.amount} XP
    </div>
  ));
}

function UserHeader({ user, isActive, onClick }) {
  const level = getLevel(user.xp);
  const progress = getLevelProgress(user.xp);
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
      background: isActive ? "rgba(168,85,247,0.12)" : "transparent",
      borderBottom: `1px solid ${isActive ? "rgba(168,85,247,0.4)" : "var(--border)"}`,
      cursor: "pointer", transition: "all .2s",
    }}>
      <div className="avatar" style={{ background: `${user.color}22`, border: `2px solid ${user.color}`, fontSize: 20 }}>
        {user.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="orbitron" style={{ fontSize: 14, fontWeight: 700, color: isActive ? user.color : "var(--text)" }}>{user.name}</span>
          <span className="badge" style={{ background: `${user.color}33`, color: user.color, fontSize: 9 }}>LVL {level}</span>
          {isActive && <span style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>● YOU</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div className="progress-bar" style={{ flex: 1 }}>
            <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${user.color},${user.color}aa)` }} />
          </div>
          <span className="fira" style={{ fontSize: 10, color: "var(--muted)" }}>{user.xp % XP_PER_LEVEL}/{XP_PER_LEVEL}</span>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, color: "var(--muted)" }}>Tasks</div>
        <div className="orbitron" style={{ fontSize: 13, color: user.color }}>{user.tasks.filter(t => t.done).length}/{user.tasks.length}</div>
      </div>
    </div>
  );
}

function TaskPanel({ user, isOwner, onAddTask, onToggleTask, onDeleteTask, onEditTask }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", priority: "medium", category: "work", notes: "", dueDate: "" });

  const filtered = user.tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "done" ? t.done : !t.done);
    return matchSearch && matchFilter;
  });

  const handleAdd = () => {
    if (!newTask.title.trim()) return;
    onAddTask(user.id, { ...newTask, id: uid(), done: false, subtasks: [], createdAt: Date.now() });
    setNewTask({ title: "", priority: "medium", category: "work", notes: "", dueDate: "" });
    setShowAdd(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{user.emoji}</span>
          <span className="orbitron" style={{ fontSize: 13, fontWeight: 700 }}>{user.name}'s Tasks</span>
          <span className="badge" style={{ background: "rgba(168,85,247,0.2)", color: "#a855f7" }}>
            {user.tasks.filter(t => !t.done).length}
          </span>
        </div>
        {isOwner && (
          <button className="btn btn-p" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => setShowAdd(!showAdd)}>
            + Add
          </button>
        )}
      </div>

      <div style={{ padding: "10px 16px", display: "flex", gap: 8, borderBottom: "1px solid var(--border)" }}>
        <input className="input" placeholder="🔍 Search tasks…" value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 12 }} />
        <select className="select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="done">Done</option>
        </select>
      </div>

      {showAdd && isOwner && (
        <div className="anim-fade" style={{ padding: "12px 16px", background: "rgba(168,85,247,0.08)", borderBottom: "1px solid var(--border)" }}>
          <input className="input" placeholder="Task title…" value={newTask.title}
            onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            style={{ marginBottom: 8 }} autoFocus />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select className="select" style={{ flex: 1 }} value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <select className="select" style={{ flex: 1 }} value={newTask.category} onChange={e => setNewTask(p => ({ ...p, category: e.target.value }))}>
              <option value="work">💼 Work</option>
              <option value="personal">🏠 Personal</option>
              <option value="health">💪 Health</option>
              <option value="study">📚 Study</option>
              <option value="other">🗂 Other</option>
            </select>
            <input type="date" className="input" style={{ flex: 1 }} value={newTask.dueDate}
              onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))} />
          </div>
          <input className="input" placeholder="Notes (optional)…" value={newTask.notes}
            onChange={e => setNewTask(p => ({ ...p, notes: e.target.value }))}
            style={{ marginBottom: 8, fontSize: 12 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-p" onClick={handleAdd}>Add Task</button>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="scrollable" style={{ padding: "10px 12px", flex: 1 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
            <div style={{ fontSize: 13 }}>{search ? "No tasks match" : "All clear! Add a task."}</div>
          </div>
        )}
        {filtered.map(task => (
          <TaskItem key={task.id} task={task} isOwner={isOwner}
            onToggle={() => onToggleTask(user.id, task.id)}
            onDelete={() => onDeleteTask(user.id, task.id)}
            onEdit={(updates) => onEditTask(user.id, task.id, updates)}
          />
        ))}
      </div>

      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 16 }}>
        {["work", "personal", "health", "study"].map(cat => {
          const count = user.tasks.filter(t => t.category === cat && !t.done).length;
          return count > 0 ? (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: CATEGORY_COLORS[cat] }} />
              <span style={{ fontSize: 11, color: "var(--muted)" }}>{count}</span>
            </div>
          ) : null;
        })}
        <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>
          {user.tasks.filter(t => t.done).length} done
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task, isOwner, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const saveEdit = () => {
    if (editTitle.trim()) onEdit({ title: editTitle });
    setEditing(false);
  };

  return (
    <div className={`task-item anim-fade ${task.done ? "done" : ""}`}>
      <div className={`task-checkbox ${task.done ? "checked" : ""}`} onClick={isOwner ? onToggle : undefined}
        style={{ cursor: isOwner ? "pointer" : "default" }}>
        {task.done && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input className="input" value={editTitle} onChange={e => setEditTitle(e.target.value)}
            onBlur={saveEdit} onKeyDown={e => e.key === "Enter" && saveEdit()} autoFocus
            style={{ fontSize: 13, padding: "4px 8px" }} />
        ) : (
          <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
            <span style={{
              fontSize: 13, fontWeight: 600, color: task.done ? "var(--muted)" : "var(--text)",
              textDecoration: task.done ? "line-through" : "none",
              transition: "all 0.3s",
            }}>{task.title}</span>
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 5 }}>
          <span className="tag" style={{ background: `${PRIORITY_COLORS[task.priority]}22`, color: PRIORITY_COLORS[task.priority] }}>
            {task.priority}
          </span>
          <span className="tag" style={{ background: `${CATEGORY_COLORS[task.category] || "#6b7280"}22`, color: CATEGORY_COLORS[task.category] || "#6b7280" }}>
            {task.category}
          </span>
          {task.dueDate && (
            <span className="tag" style={{ background: "rgba(255,255,255,0.06)", color: "var(--muted)", fontSize: 10 }}>
              📅 {task.dueDate}
            </span>
          )}
        </div>
        {task.notes && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, fontStyle: "italic" }}>{task.notes}</div>}
      </div>
      {isOwner && (
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {!task.done && (
            <button className="btn-icon" onClick={() => setEditing(true)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          )}
          <button className="btn-icon" style={{ color: "#ef4444" }} onClick={onDelete}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

function PomodoroPanel({ user, isOwner, onTimerUpdate, onAddTimer }) {
  const intervalRefs = useRef({});

  useEffect(() => {
    user.timers.forEach(timer => {
      if (timer.running && !intervalRefs.current[timer.id]) {
        intervalRefs.current[timer.id] = setInterval(() => {
          onTimerUpdate(user.id, timer.id, "tick");
        }, 1000);
      } else if (!timer.running && intervalRefs.current[timer.id]) {
        clearInterval(intervalRefs.current[timer.id]);
        delete intervalRefs.current[timer.id];
      }
    });
    return () => Object.values(intervalRefs.current).forEach(clearInterval);
  }, [user.timers, user.id]);

  const settings = user.settings;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{user.emoji}</span>
          <span className="orbitron" style={{ fontSize: 13, fontWeight: 700 }}>{user.name}'s Timers</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>🍅 {user.pomodoroSessions} sessions</span>
          {isOwner && (
            <button className="btn btn-p" style={{ padding: "6px 14px", fontSize: 12 }}
              onClick={() => onAddTimer(user.id)}>+ Timer</button>
          )}
        </div>
      </div>
      <div className="scrollable" style={{ padding: "16px", flex: 1 }}>
        {user.timers.map(timer => (
          <TimerCard key={timer.id} timer={timer} isOwner={isOwner} userColor={user.color}
            onToggle={() => onTimerUpdate(user.id, timer.id, "toggle")}
            onReset={() => onTimerUpdate(user.id, timer.id, "reset")}
          />
        ))}
        {user.timers.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>⏱️</div>
            <div style={{ fontSize: 13 }}>No timers yet</div>
          </div>
        )}
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
          Focus: {settings.pomoDuration}m · Short break: {settings.shortBreak}m · Long break: {settings.longBreak}m
        </div>
      </div>
    </div>
  );
}

function TimerCard({ timer, isOwner, userColor, onToggle, onReset }) {
  const pct = timer.remaining / timer.duration;
  const r = 70, circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const phaseColor = timer.phase === "focus" ? userColor : timer.phase === "short" ? "#10b981" : "#f59e0b";
  const isDone = timer.remaining === 0;

  return (
    <div className="glass" style={{ padding: 20, marginBottom: 16, border: `1px solid ${phaseColor}44`,
      boxShadow: timer.running ? `0 0 30px ${phaseColor}33` : "none", transition: "all .3s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{timer.label}</div>
          <div style={{ fontSize: 11, color: phaseColor, textTransform: "uppercase", letterSpacing: 1 }}>
            {isDone ? "✅ Done!" : timer.phase === "focus" ? "🎯 Focus" : timer.phase === "short" ? "☕ Short break" : "🌙 Long break"}
          </div>
        </div>
        {timer.running && (
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: phaseColor,
            animation: "pulse-ring 1.5s infinite", boxShadow: `0 0 10px ${phaseColor}` }} />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div className="circle-timer" style={{ width: 160, height: 160 }}>
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="80" cy="80" r={r} fill="none" stroke={phaseColor} strokeWidth="8"
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${phaseColor})`, transition: "stroke-dasharray 0.5s ease" }} />
          </svg>
          <div className={`anim-breathe`} style={{ position: "absolute", textAlign: "center" }}>
            <div className="orbitron" style={{ fontSize: 28, fontWeight: 900, color: isDone ? phaseColor : "var(--text)",
              textShadow: isDone ? `0 0 20px ${phaseColor}` : "none" }}>
              {formatTime(timer.remaining)}
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>
              {Math.round((1 - pct) * 100)}% done
            </div>
          </div>
        </div>
      </div>
      {isOwner && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button className={`btn ${timer.running ? "btn-ghost" : "btn-p"}`} onClick={onToggle}>
            {timer.running ? "⏸ Pause" : isDone ? "🔄 Next" : "▶ Start"}
          </button>
          <button className="btn btn-ghost" onClick={onReset}>↺ Reset</button>
        </div>
      )}
    </div>
  );
}

function HabitPanel({ user, isOwner, onToggleHabit, onAddHabit, onDeleteHabit }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", color: "#a855f7", xpPerDay: 30 });
  const level = getLevel(user.xp);
  const progress = getLevelProgress(user.xp);

  const handleAdd = () => {
    if (!newHabit.name.trim()) return;
    onAddHabit(user.id, { ...newHabit, id: uid(), streak: 0, lastDone: "", history: [] });
    setNewHabit({ name: "", color: "#a855f7", xpPerDay: 30 });
    setShowAdd(false);
  };

  const getLast14Days = () => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  };
  const days14 = getLast14Days();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{user.emoji}</span>
          <span className="orbitron" style={{ fontSize: 13, fontWeight: 700 }}>{user.name}'s Habits</span>
        </div>
        {isOwner && (
          <button className="btn btn-p" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => setShowAdd(!showAdd)}>
            + Habit
          </button>
        )}
      </div>

      {/* XP Bar */}
      <div style={{ padding: "12px 16px", background: "rgba(168,85,247,0.06)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="orbitron" style={{ fontSize: 12, color: user.color }}>LEVEL {level}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {user.badges.slice(0, 4).map(b => (
                <span key={b} className="tooltip" data-tip={BADGES.find(x => x.id === b)?.name || b}
                  style={{ fontSize: 16, cursor: "default" }}>{BADGES.find(x => x.id === b)?.icon}</span>
              ))}
            </div>
          </div>
          <span className="fira" style={{ fontSize: 11, color: "var(--muted)" }}>{user.xp} XP</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${user.color},${user.color}88)`, boxShadow: `0 0 10px ${user.color}55` }} />
        </div>
      </div>

      {showAdd && isOwner && (
        <div className="anim-fade" style={{ padding: "12px 16px", background: "rgba(168,85,247,0.08)", borderBottom: "1px solid var(--border)" }}>
          <input className="input" placeholder="Habit name (with emoji)…" value={newHabit.name}
            onChange={e => setNewHabit(p => ({ ...p, name: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            style={{ marginBottom: 8 }} autoFocus />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>Color</span>
              <input type="color" value={newHabit.color} onChange={e => setNewHabit(p => ({ ...p, color: e.target.value }))}
                style={{ width: 32, height: 28, borderRadius: 6, border: "none", cursor: "pointer", background: "none" }} />
            </div>
            <select className="select" value={newHabit.xpPerDay} onChange={e => setNewHabit(p => ({ ...p, xpPerDay: Number(e.target.value) }))}>
              <option value={20}>20 XP/day</option>
              <option value={30}>30 XP/day</option>
              <option value={50}>50 XP/day</option>
              <option value={60}>60 XP/day</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-p" onClick={handleAdd}>Add Habit</button>
            <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="scrollable" style={{ padding: "12px", flex: 1 }}>
        {user.habits.map(habit => (
          <HabitCard key={habit.id} habit={habit} isOwner={isOwner} days14={days14}
            onToggle={() => onToggleHabit(user.id, habit.id)}
            onDelete={() => onDeleteHabit(user.id, habit.id)}
          />
        ))}
        {user.habits.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
            <div style={{ fontSize: 13 }}>Build your first habit!</div>
          </div>
        )}
      </div>

      {/* Badges */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Achievements</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {BADGES.map(b => {
            const unlocked = user.badges.includes(b.id);
            return (
              <div key={b.id} className="tooltip" data-tip={`${b.name}: ${b.desc}`}
                style={{ fontSize: unlocked ? 18 : 14, opacity: unlocked ? 1 : 0.25, transition: "all .2s",
                  filter: unlocked ? "none" : "grayscale(100%)", cursor: "default",
                  animation: unlocked ? "streak-bounce 0.5s ease" : "none" }}>
                {b.icon}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HabitCard({ habit, isOwner, days14, onToggle, onDelete }) {
  const doneToday = habit.lastDone === today();
  const canCheck = isOwner && !doneToday;

  return (
    <div className="habit-card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 4, borderRadius: 2, alignSelf: "stretch", background: habit.color, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{habit.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 11, color: habit.color, fontWeight: 800 }}>
              🔥 {habit.streak} day streak
            </span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>+{habit.xpPerDay} XP/day</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {isOwner && (
            <button onClick={canCheck ? onToggle : undefined} style={{
              width: 32, height: 32, borderRadius: "50%", border: `2px solid ${doneToday ? "transparent" : habit.color}`,
              background: doneToday ? habit.color : "transparent", cursor: canCheck ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: doneToday ? `0 0 12px ${habit.color}66` : "none",
              transition: "all .25s",
            }}>
              {doneToday ? <span style={{ fontSize: 14 }}>✓</span> : <span style={{ fontSize: 12, color: habit.color }}>○</span>}
            </button>
          )}
          {!doneToday && isOwner && (
            <button className="btn-icon" style={{ color: "#ef4444" }} onClick={onDelete}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            </button>
          )}
        </div>
      </div>
      {/* Mini Heatmap */}
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {days14.map(d => {
          const done = habit.history.includes(d);
          const isToday = d === today();
          return (
            <div key={d} className="heatmap-cell" style={{
              background: done ? habit.color : "rgba(255,255,255,0.06)",
              boxShadow: isToday && done ? `0 0 8px ${habit.color}` : "none",
              border: isToday ? `1px solid ${habit.color}66` : "none",
              opacity: done ? 1 : 0.4,
            }} />
          );
        })}
        <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: 4 }}>14d</span>
      </div>
    </div>
  );
}

function StatsPanel({ users }) {
  const u1 = users.u1, u2 = users.u2;
  const total1 = u1.tasks.filter(t => t.done).length;
  const total2 = u2.tasks.filter(t => t.done).length;
  const habits1 = u1.habits.filter(h => h.lastDone === today()).length;
  const habits2 = u2.habits.filter(h => h.lastDone === today()).length;

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="orbitron" style={{ fontSize: 13, fontWeight: 700, color: "var(--glow-p)", textAlign: "center", letterSpacing: 2 }}>
        ⚡ TODAY'S SNAPSHOT
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Tasks Done", v1: total1, v2: total2, icon: "✅" },
          { label: "Habits Done", v1: habits1, v2: habits2, icon: "🌿" },
          { label: "Pomodoros", v1: u1.pomodoroSessions, v2: u2.pomodoroSessions, icon: "🍅" },
          { label: "Total XP", v1: u1.xp, v2: u2.xp, icon: "⭐" },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>
                <div style={{ fontSize: 10, color: u1.color }}>🌸 {u1.name}</div>
                <div className="orbitron" style={{ fontSize: 18, color: u1.color }}>{stat.v1}</div>
              </div>
              <div style={{ width: 1, background: "var(--border)" }} />
              <div>
                <div style={{ fontSize: 10, color: u2.color }}>🌊 {u2.name}</div>
                <div className="orbitron" style={{ fontSize: 18, color: u2.color }}>{stat.v2}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>XP Leaderboard</div>
        {[u1, u2].sort((a, b) => b.xp - a.xp).map((u, i) => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
            background: "var(--card)", borderRadius: 8, marginBottom: 6,
            border: `1px solid ${i === 0 ? "rgba(251,191,36,0.3)" : "var(--border)"}` }}>
            <span style={{ fontSize: 16 }}>{i === 0 ? "👑" : "🥈"}</span>
            <span style={{ fontSize: 18 }}>{u.emoji}</span>
            <span style={{ fontWeight: 700, flex: 1 }}>{u.name}</span>
            <span className="orbitron" style={{ color: u.color, fontSize: 14 }}>{u.xp} XP</span>
          </div>
        ))}
      </div>

      <AIQuote />
    </div>
  );
}

function AIQuote() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: "Give me ONE short (max 2 sentences) anime-inspired motivational quote for a productivity study session. Make it feel cozy, poetic, and encouraging. Just the quote, no attribution needed.",
          }],
        }),
      });
      const d = await res.json();
      setQuote(d.content?.[0]?.text || "Keep going — every small step lights the path ahead. ✨");
    } catch {
      setQuote("Every dawn is a blank canvas. Paint it with your focus. 🌸");
    }
    setLoading(false);
  };

  useEffect(() => { fetchQuote(); }, []);

  return (
    <div style={{ padding: "14px 16px", background: "rgba(168,85,247,0.08)", borderRadius: 10,
      border: "1px solid rgba(168,85,247,0.2)" }}>
      <div style={{ fontSize: 10, color: "var(--glow-p)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>✨ AI Sensei says</div>
      {loading ? (
        <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>Channeling wisdom…</div>
      ) : (
        <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, fontStyle: "italic" }}>{quote}</div>
      )}
      <button className="btn btn-ghost" style={{ marginTop: 10, fontSize: 11, padding: "4px 12px" }} onClick={fetchQuote}>
        🔄 New quote
      </button>
    </div>
  );
}

function Notification({ notif }) {
  if (!notif) return null;
  return (
    <div className="anim-fade" style={{
      position: "fixed", top: 20, right: 20, zIndex: 2000,
      padding: "12px 20px", borderRadius: 12,
      background: "rgba(10,5,30,0.95)", border: `1px solid ${notif.color || "var(--border)"}`,
      boxShadow: `0 0 24px ${notif.color || "var(--glow-p)"}44`,
      maxWidth: 320, backdropFilter: "blur(20px)",
    }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{notif.title}</div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{notif.msg}</div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function CollabDojo() {
  const [state, setState] = useState(INITIAL_STATE);
  const notifTimeout = useRef(null);

  const showNotif = useCallback((title, msg, color = "#a855f7") => {
    setState(s => ({ ...s, notification: { title, msg, color } }));
    clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(() => setState(s => ({ ...s, notification: null })), 3500);
  }, []);

  const spawnConfetti = useCallback((x = window.innerWidth / 2) => {
    const colors = ["#a855f7", "#3b82f6", "#ec4899", "#10b981", "#f59e0b", "#fff"];
    const pieces = [...Array(30)].map(() => ({
      id: uid(), x: x + (Math.random() - 0.5) * 200,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setState(s => ({ ...s, confetti: pieces }));
    setTimeout(() => setState(s => ({ ...s, confetti: [] })), 2000);
  }, []);

  const spawnXpPop = useCallback((amount, color = "#a855f7") => {
    const pop = { id: uid(), x: Math.random() * (window.innerWidth - 100) + 50, y: window.innerHeight / 2, amount, color };
    setState(s => ({ ...s, xpPops: [...s.xpPops, pop] }));
    setTimeout(() => setState(s => ({ ...s, xpPops: s.xpPops.filter(p => p.id !== pop.id) })), 1300);
  }, []);

  const grantXP = useCallback((userId, amount) => {
    setState(s => {
      const user = s.users[userId];
      const oldLevel = getLevel(user.xp);
      const newXp = user.xp + amount;
      const newLevel = getLevel(newXp);
      const badgesNew = [...user.badges];

      // badge checks
      const completedTasks = user.tasks.filter(t => t.done).length;
      if (completedTasks >= 10 && !badgesNew.includes("task_master")) {
        badgesNew.push("task_master");
        setTimeout(() => showNotif("🏆 Achievement!", "Task Master unlocked!", "#f59e0b"), 500);
      }
      if (newLevel >= 5 && !badgesNew.includes("level_5")) {
        badgesNew.push("level_5");
        setTimeout(() => showNotif("🌟 Level Up!", "Rising Star badge earned!", "#f59e0b"), 500);
      }

      if (newLevel > oldLevel) {
        setTimeout(() => { showNotif("⚡ LEVEL UP!", `${user.name} reached Level ${newLevel}!`, user.color); spawnConfetti(); }, 200);
      }
      return { ...s, users: { ...s.users, [userId]: { ...user, xp: newXp, badges: badgesNew } } };
    });
    spawnXpPop(amount);
  }, [showNotif, spawnConfetti, spawnXpPop]);

  const handleToggleTask = useCallback((userId, taskId) => {
    setState(s => {
      const user = s.users[userId];
      const tasks = user.tasks.map(t => {
        if (t.id !== taskId) return t;
        const nowDone = !t.done;
        return { ...t, done: nowDone };
      });
      const toggledTask = tasks.find(t => t.id === taskId);
      if (toggledTask.done) {
        setTimeout(() => {
          grantXP(userId, 50);
          spawnConfetti();
          showNotif("✅ Task Complete!", `+50 XP earned!`, "#10b981");
        }, 100);
      }
      return { ...s, users: { ...s.users, [userId]: { ...user, tasks } } };
    });
  }, [grantXP, spawnConfetti, showNotif]);

  const handleAddTask = useCallback((userId, task) => {
    setState(s => ({
      ...s, users: {
        ...s.users,
        [userId]: { ...s.users[userId], tasks: [...s.users[userId].tasks, task] },
      },
    }));
  }, []);

  const handleDeleteTask = useCallback((userId, taskId) => {
    setState(s => ({
      ...s, users: {
        ...s.users,
        [userId]: { ...s.users[userId], tasks: s.users[userId].tasks.filter(t => t.id !== taskId) },
      },
    }));
  }, []);

  const handleEditTask = useCallback((userId, taskId, updates) => {
    setState(s => ({
      ...s, users: {
        ...s.users,
        [userId]: {
          ...s.users[userId],
          tasks: s.users[userId].tasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
        },
      },
    }));
  }, []);

  const handleTimerUpdate = useCallback((userId, timerId, action) => {
    setState(s => {
      const user = s.users[userId];
      const timers = user.timers.map(t => {
        if (t.id !== timerId) return t;
        if (action === "toggle") return { ...t, running: !t.running };
        if (action === "reset") return { ...t, running: false, remaining: t.duration, phase: "focus" };
        if (action === "tick") {
          if (t.remaining <= 1) {
            const nextPhase = t.phase === "focus" ? "short" : "focus";
            const nextDuration = nextPhase === "short" ? user.settings.shortBreak * 60 : user.settings.pomoDuration * 60;
            const sessions = t.phase === "focus" ? user.pomodoroSessions + 1 : user.pomodoroSessions;
            if (t.phase === "focus") {
              setTimeout(() => {
                grantXP(userId, 100);
                showNotif("🍅 Pomodoro Done!", `+100 XP · ${sessions} sessions today`, "#ec4899");
              }, 100);
              // badge
              if (sessions >= 5) {
                setState(ss => {
                  const u = ss.users[userId];
                  if (!u.badges.includes("pomodoro_5")) {
                    setTimeout(() => showNotif("🏅 Badge!", "Tomato Farmer unlocked!", "#ec4899"), 800);
                    return { ...ss, users: { ...ss.users, [userId]: { ...u, badges: [...u.badges, "pomodoro_5"] } } };
                  }
                  return ss;
                });
              }
              return { ...t, running: false, remaining: nextDuration, phase: nextPhase, pomodoroSessions: sessions };
            }
            return { ...t, running: false, remaining: nextDuration, phase: nextPhase };
          }
          return { ...t, remaining: t.remaining - 1 };
        }
        return t;
      });
      const sessions = timers.find(t => t.id === timerId)?.pomodoroSessions ?? user.pomodoroSessions;
      return { ...s, users: { ...s.users, [userId]: { ...user, timers, pomodoroSessions: sessions ?? user.pomodoroSessions } } };
    });
  }, [grantXP, showNotif]);

  const handleAddTimer = useCallback((userId) => {
    setState(s => {
      const user = s.users[userId];
      const timer = { id: uid(), label: `Timer ${user.timers.length + 1}`, duration: user.settings.pomoDuration * 60, remaining: user.settings.pomoDuration * 60, running: false, phase: "focus" };
      return { ...s, users: { ...s.users, [userId]: { ...user, timers: [...user.timers, timer] } } };
    });
  }, []);

  const handleToggleHabit = useCallback((userId, habitId) => {
    setState(s => {
      const user = s.users[userId];
      const todayStr = today();
      const habits = user.habits.map(h => {
        if (h.id !== habitId) return h;
        if (h.lastDone === todayStr) return h;
        const newHistory = [...h.history, todayStr];
        const newStreak = h.streak + 1;
        const badgesNew = [...user.badges];

        if (newStreak >= 3 && !badgesNew.includes("streak_3")) {
          badgesNew.push("streak_3");
          setTimeout(() => showNotif("🔥 Streak Badge!", "On Fire — 3-day streak!", "#f59e0b"), 500);
        }
        if (newStreak >= 7 && !badgesNew.includes("streak_7")) {
          badgesNew.push("streak_7");
          setTimeout(() => showNotif("⚡ Week Streak!", "Thunder Week badge earned!", "#3b82f6"), 500);
        }
        if (!badgesNew.includes("first_habit")) {
          badgesNew.push("first_habit");
        }

        setTimeout(() => {
          grantXP(userId, h.xpPerDay);
          showNotif(`🌿 Habit Done!`, `${h.name} · +${h.xpPerDay} XP · 🔥 ${newStreak} day streak`, h.color);
          spawnConfetti();
        }, 100);

        setState(ss => ({ ...ss, users: { ...ss.users, [userId]: { ...ss.users[userId], badges: badgesNew } } }));
        return { ...h, lastDone: todayStr, history: newHistory, streak: newStreak };
      });
      return { ...s, users: { ...s.users, [userId]: { ...user, habits } } };
    });
  }, [grantXP, showNotif, spawnConfetti]);

  const handleAddHabit = useCallback((userId, habit) => {
    setState(s => ({
      ...s, users: {
        ...s.users,
        [userId]: { ...s.users[userId], habits: [...s.users[userId].habits, habit] },
      },
    }));
  }, []);

  const handleDeleteHabit = useCallback((userId, habitId) => {
    setState(s => ({
      ...s, users: {
        ...s.users,
        [userId]: { ...s.users[userId], habits: s.users[userId].habits.filter(h => h.id !== habitId) },
      },
    }));
  }, []);

  const { users, activeTab, activeUser, confetti, xpPops, notification } = state;
  const u1 = users.u1, u2 = users.u2;

  const tabIcon = { tasks: "✅", pomodoro: "⏱️", habits: "🌿" };

  const renderPanel = (user, isOwner) => {
    if (activeTab === "tasks") return (
      <TaskPanel user={user} isOwner={isOwner}
        onAddTask={handleAddTask} onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask} onEditTask={handleEditTask} />
    );
    if (activeTab === "pomodoro") return (
      <PomodoroPanel user={user} isOwner={isOwner}
        onTimerUpdate={handleTimerUpdate} onAddTimer={handleAddTimer} />
    );
    if (activeTab === "habits") return (
      <HabitPanel user={user} isOwner={isOwner}
        onToggleHabit={handleToggleHabit} onAddHabit={handleAddHabit}
        onDeleteHabit={handleDeleteHabit} />
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <AmbientBg />
      <Confetti pieces={confetti} />
      <XpPops pops={xpPops} />
      <Notification notif={notification} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid var(--border)", background: "rgba(7,7,20,0.8)", backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="anim-float" style={{ fontSize: 24 }}>⛩️</div>
            <div>
              <div className="orbitron" style={{ fontSize: 18, fontWeight: 900,
                background: "linear-gradient(135deg,#a855f7,#3b82f6,#ec4899)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 2 }}>
                COLLAB DŌJŌ
              </div>
              <div className="fira" style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 3 }}>
                COLLABORATIVE PRODUCTIVITY
              </div>
            </div>
          </div>

          <div className="tab-bar">
            {["tasks", "pomodoro", "habits"].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setState(s => ({ ...s, activeTab: tab }))}>
                {tabIcon[tab]} <span style={{ textTransform: "capitalize" }}>{tab}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Switch user:</span>
            {[u1, u2].map(u => (
              <button key={u.id} onClick={() => setState(s => ({ ...s, activeUser: u.id }))}
                className="btn" style={{
                  padding: "6px 12px", fontSize: 12,
                  background: activeUser === u.id ? `${u.color}33` : "var(--card)",
                  border: `1px solid ${activeUser === u.id ? u.color : "var(--border)"}`,
                  color: activeUser === u.id ? u.color : "var(--muted)",
                }}>
                {u.emoji} {u.name}
              </button>
            ))}
          </div>
        </header>

        {/* Main layout */}
        <div style={{ flex: 1, display: "flex", gap: 0, overflow: "hidden" }}>
          {/* Left Panel — User 1 */}
          <div className="glass split-layout" style={{
            flex: 1, margin: "16px 8px 16px 16px",
            border: activeUser === "u1" ? `1px solid ${u1.color}55` : "1px solid var(--border)",
            boxShadow: activeUser === "u1" ? `0 0 32px ${u1.color}22` : "none",
            display: "flex", flexDirection: "column", overflow: "hidden",
            transition: "all .3s",
          }}>
            <UserHeader user={u1} isActive={activeUser === "u1"} onClick={() => setState(s => ({ ...s, activeUser: "u1" }))} />
            {renderPanel(u1, activeUser === "u1")}
          </div>

          {/* Center Stats */}
          <div className="glass" style={{
            width: 240, margin: "16px 0", flexShrink: 0,
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
              <div className="orbitron" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 2 }}>WORKSPACE</div>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              <StatsPanel users={users} />
            </div>
          </div>

          {/* Right Panel — User 2 */}
          <div className="glass split-layout" style={{
            flex: 1, margin: "16px 16px 16px 8px",
            border: activeUser === "u2" ? `1px solid ${u2.color}55` : "1px solid var(--border)",
            boxShadow: activeUser === "u2" ? `0 0 32px ${u2.color}22` : "none",
            display: "flex", flexDirection: "column", overflow: "hidden",
            transition: "all .3s",
          }}>
            <UserHeader user={u2} isActive={activeUser === "u2"} onClick={() => setState(s => ({ ...s, activeUser: "u2" }))} />
            {renderPanel(u2, activeUser === "u2")}
          </div>
        </div>

        {/* Footer */}
        <footer style={{ padding: "8px 24px", borderTop: "1px solid var(--border)",
          background: "rgba(7,7,20,0.8)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="fira" style={{ fontSize: 10, color: "var(--muted)" }}>
            🌸 Built with Next.js · Firebase · TailwindCSS · shadcn/ui
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--muted)" }}>
            <span>🍅 {u1.pomodoroSessions + u2.pomodoroSessions} sessions</span>
            <span>✅ {[...u1.tasks, ...u2.tasks].filter(t => t.done).length} tasks</span>
            <span>⭐ {u1.xp + u2.xp} XP earned</span>
          </div>
          <div className="fira" style={{ fontSize: 10, color: "var(--muted)" }}>
            今日も頑張れ！ Keep grinding ✨
          </div>
        </footer>
      </div>
    </>
  );
}
