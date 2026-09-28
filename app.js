// ==========================================================================
// Adaptive Student Life Assistant - Main Application Logic
// Playful Neo-Pop / Soft Neubrutalism UI/UX Engine
// ==========================================================================

// Guard against SSR / Serverless function execution environments (Vercel Node.js runner)
if (typeof window === 'undefined') {
  globalThis.window = { location: { hash: '' }, scrollTo: () => {} };
}
if (typeof document === 'undefined') {
  globalThis.document = {
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ classList: { add: () => {}, remove: () => {} }, style: {}, setAttribute: () => {} })
  };
}

// Global Application State Store
const AppState = {
  // Current Student
  user: {
    id: 'jishnu',
    name: 'Jishnu',
    email: 'jishnu.v@campus.edu',
    major: 'Computer Science',
    year: '3rd Year',
    companion: 'both', // 'pomi', 'barnaby', 'both'
    streakDays: 7,
    coins: 350,
    waterLogged: 3,
    waterGoal: 6
  },

  // Daily Schedule Timeline
  schedule: [
    {
      id: 'sch-1',
      title: 'Discrete Math Lecture',
      category: 'class', // 'class', 'focus', 'downtime'
      timeRange: '09:00 - 10:30',
      location: 'Room 204 (Science Wing)',
      description: 'Prof. Chen covering Graph Theory & Tree Traversal proofs.',
      completed: true,
      icon: 'menu_book'
    },
    {
      id: 'sch-2',
      title: 'Coffee & Walk Break ☕',
      category: 'downtime',
      timeRange: '10:30 - 11:15',
      location: 'Quad Gardens',
      description: 'Grab an iced oat latte and stretch legs before the next session. No screens required.',
      completed: true,
      icon: 'local_cafe'
    },
    {
      id: 'sch-3',
      title: 'Database Systems Lecture',
      category: 'class',
      timeRange: '11:15 - 12:45',
      location: 'Hall B (Engineering Hub)',
      description: 'Relational schema mapping & Normalization hands-on demo.',
      completed: true,
      icon: 'database'
    },
    {
      id: 'sch-4',
      title: 'Lunch with Friends 🥗',
      category: 'downtime',
      timeRange: '12:45 - 14:00',
      location: 'North Dining Hall',
      description: 'Meeting Marco and Sarah for poke bowls. Recharge your social battery!',
      completed: false,
      icon: 'restaurant'
    },
    {
      id: 'sch-5',
      title: 'Solo Focus: Database ER Diagram',
      category: 'focus',
      timeRange: '14:30 - 15:15',
      location: 'Quiet Study Room 3',
      description: 'Finish drafting 4 entities in Draw.io before submitting milestone 1.',
      completed: false,
      icon: 'bolt',
      assignmentId: 'asg-1',
      durationMinutes: 45
    },
    {
      id: 'sch-6',
      title: 'Guilt-Free Free Time! 🎮 Close books & relax',
      category: 'downtime',
      timeRange: '17:00 Onwards',
      location: 'Dorm / Common Lounge',
      description: 'Your academic tasks for the day are officially wrapped. Play video games, cook dinner, or catch up on shows completely guilt-free.',
      completed: false,
      icon: 'sports_esports'
    }
  ],

  // Current Selected Homework for Large View
  selectedAssignmentId: 'asg-1',
  pendingFocusAssignmentId: null,

  // Assignments & Homework
  assignments: [
    {
      id: 'asg-1',
      title: 'ER DIAGRAM ASSIGNMENT',
      course: 'Database Systems (CS 340)',
      courseShort: 'CS 340',
      description: 'Customer and order relationship schema model with primary and foreign keys.',
      dueTimestamp: Date.now() + 6 * 3600 * 1000, // Due in 6 hours
      dueText: 'Due Tonight • 6h left',
      status: 'working', // 'todo', 'working', 'completed'
      effort: 'medium', // 'low', 'medium', 'high'
      durationMinutes: 45,
      estimatedTime: '45 min',
      steps: [
        { id: 's1', text: 'Step 1: Read requirements PDF & schema specs', done: true },
        { id: 's2', text: 'Step 2: Draft 3 tables (Customer, Order, LineItem)', done: false },
        { id: 's3', text: 'Step 3: Quick peer review & export SVG', done: false }
      ]
    },
    {
      id: 'asg-2',
      title: 'BANK ACCOUNT CLASSES',
      course: 'CS 201 • Object-Oriented',
      courseShort: 'CS 201',
      description: 'Create getters, setters, and a simple withdraw method. Easy test cases provided!',
      dueTimestamp: Date.now() + 21 * 3600 * 1000, // Due tomorrow 5 PM
      dueText: 'Tomorrow • 5:00 PM',
      status: 'todo',
      effort: 'medium',
      durationMinutes: 45,
      estimatedTime: '45 min',
      steps: [
        { id: 's2-1', text: 'Review bank account UML spec', done: false },
        { id: 's2-2', text: 'Code Account and SavingsAccount classes', done: false },
        { id: 's2-3', text: 'Run JUnit test suite & verify', done: false }
      ]
    },
    {
      id: 'asg-3',
      title: 'DISCRETE MATH PRACTICE PROBLEMS',
      course: 'MATH 180 • Discrete Mathematics',
      courseShort: 'MATH 180',
      description: 'Read Chapter 4 summary and check 5 truth tables. No formal writeup needed!',
      dueTimestamp: Date.now() + 50 * 3600 * 1000, // Due in ~2 days
      dueText: 'Friday • Anytime',
      status: 'todo',
      effort: 'low',
      durationMinutes: 30,
      estimatedTime: '30 min',
      steps: [
        { id: 's3-1', text: 'Read page 142 summary sheet', done: false },
        { id: 's3-2', text: 'Solve truth tables 1 through 3', done: false },
        { id: 's3-3', text: 'Self-check solutions in back of text', done: false }
      ]
    },
    {
      id: 'asg-4',
      title: 'WEB APPLICATION WIREFRAMES',
      course: 'DES 110 • Interaction Design',
      courseShort: 'DES 110',
      description: 'Low-fidelity layout sketches and primary user flows.',
      dueTimestamp: Date.now() - 14 * 3600 * 1000, // Completed yesterday
      dueText: 'Completed Yesterday',
      status: 'completed',
      effort: 'low',
      durationMinutes: 60,
      estimatedTime: '1 hour',
      steps: [
        { id: 's4-1', text: 'Sketch home feed layout', done: true },
        { id: 's4-2', text: 'Review color contrast standards', done: true }
      ]
    }
  ],

  // Focus Timer Session State
  timer: {
    activeAssignmentId: 'asg-1',
    activeStepIndex: 1, // current sprint step
    durationMinutes: 45,
    secondsRemaining: 45 * 60,
    isRunning: false,
    intervalId: null,
    totalSeconds: 45 * 60,
    sessionSecondsElapsed: 0,
    lastMilestoneAwarded: 0
  },

  // Focus Room Productivity Analytics Ledger
  analytics: {
    activeTab: 'fully', // 'fully', 'subject', 'day', 'weekly', 'monthly'
    totalSecondsLogged: 67500, // ~18 hours 45 mins baseline
    totalSessionsCompleted: 24,
    totalMilestoneSwagsEarned: 16,
    currentStreakDays: 7,
    subjects: [
      { id: 'cs', name: 'Computer Science', seconds: 28800, color: '#B71326' },
      { id: 'math', name: 'Discrete Mathematics', seconds: 18000, color: '#316255' },
      { id: 'phys', name: 'Physics Lab', seconds: 10800, color: '#D97706' },
      { id: 'des', name: 'Interaction Design', seconds: 7200, color: '#4F46E5' },
      { id: 'gen', name: 'General Studies', seconds: 2700, color: '#64748B' }
    ],
    dayWise: [
      { day: 'Mon', seconds: 12600, label: 'Monday' },
      { day: 'Tue', seconds: 10800, label: 'Tuesday' },
      { day: 'Wed', seconds: 14400, label: 'Wednesday' },
      { day: 'Thu', seconds: 9000, label: 'Thursday' },
      { day: 'Fri', seconds: 12600, label: 'Friday' },
      { day: 'Sat', seconds: 5400, label: 'Saturday' },
      { day: 'Sun', seconds: 2700, label: 'Sunday' }
    ],
    weekly: [
      { week: 'Week 1', hours: 14.5 },
      { week: 'Week 2', hours: 16.2 },
      { week: 'Week 3', hours: 13.8 },
      { week: 'This Week', hours: 18.75 }
    ],
    monthly: [
      { month: 'June', hours: 38 },
      { month: 'July', hours: 44 },
      { month: 'August', hours: 51 },
      { month: 'September', hours: 62.5 }
    ]
  },

  // Interactive Class Timetable Matrix
  timetable: {
    daysCount: 5, // e.g. 5 days (Mon-Fri)
    periodsCount: 5, // e.g. 5 periods
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    periods: [
      { id: 'p1', name: 'Period 1', time: '09:00 - 10:00' },
      { id: 'p2', name: 'Period 2', time: '10:15 - 11:15' },
      { id: 'p3', name: 'Period 3', time: '11:30 - 12:30' },
      { id: 'p4', name: 'Period 4', time: '13:30 - 14:30' },
      { id: 'p5', name: 'Period 5', time: '14:45 - 15:45' },
      { id: 'p6', name: 'Period 6', time: '16:00 - 17:00' },
      { id: 'p7', name: 'Period 7', time: '17:15 - 18:15' },
      { id: 'p8', name: 'Period 8', time: '18:30 - 19:30' }
    ],
    cells: {
      '0-0': { code: 'MATH 180', title: 'Discrete Math', room: 'Hall 204', instructor: 'Prof. Chen', color: 'blue' },
      '0-1': { code: 'CS 340', title: 'Database Systems', room: 'Lab B', instructor: 'Dr. Rao', color: 'coral' },
      '0-3': { code: 'CS 201', title: 'Data Structures', room: 'Room 101', instructor: 'Prof. Lin', color: 'yellow' },
      '1-0': { code: 'PHYS 102', title: 'Physics Lab', room: 'Sci 302', instructor: 'Dr. Watson', color: 'blue' },
      '1-2': { code: 'MATH 180', title: 'Discrete Math Tut', room: 'Hall 204', instructor: 'TA Sarah', color: 'gray' },
      '1-4': { code: 'CS 340', title: 'SQL Workshop', room: 'Lab B', instructor: 'Dr. Rao', color: 'coral' },
      '2-1': { code: 'CS 201', title: 'OOP in Java', room: 'Room 101', instructor: 'Prof. Lin', color: 'yellow' },
      '2-3': { code: 'ENG 210', title: 'Tech Writing', room: 'Arts 12', instructor: 'Prof. Evans', color: 'gray' },
      '3-0': { code: 'MATH 180', title: 'Discrete Math', room: 'Hall 204', instructor: 'Prof. Chen', color: 'blue' },
      '3-1': { code: 'CS 340', title: 'Database Systems', room: 'Lab B', instructor: 'Dr. Rao', color: 'coral' },
      '3-4': { code: 'REC 101', title: 'Campus Yoga & Breath', room: 'Gym 1', instructor: 'Coach Maya', color: 'green' },
      '4-0': { code: 'CS 201', title: 'Java Lab', room: 'Lab C', instructor: 'TA Marcus', color: 'yellow' },
      '4-2': { code: 'SEM 300', title: 'AI Ethics Seminar', room: 'Auditorium', instructor: 'Guest Speaker', color: 'blue' }
    }
  },

  // Digital Sticker Swags (Earned via Focus Sessions & Milestones)
  stickers: [
    { id: 'stk-1', name: 'Golden Carrot', emoji: '🥕', tier: 'Pomi Companion', desc: 'Completed a 25m Focus Block with zero distraction', unlocked: true },
    { id: 'stk-2', name: 'Night Cap Bear', emoji: '🐻', tier: 'Barnaby Shield', desc: 'Respected bedtime study curfew', unlocked: true },
    { id: 'stk-3', name: 'Flow State Spark', emoji: '⚡', tier: 'Deep Work', desc: 'Maintained intense uninterrupted focus', unlocked: true },
    { id: 'stk-4', name: 'Matcha Master', emoji: '🍵', tier: 'Calm Vibe', desc: 'Took peaceful breaks without screen fatigue', unlocked: true },
    { id: 'stk-5', name: 'Hydration Hero', emoji: '💧', tier: 'Wellness', desc: 'Hit daily water goal 3 days in a row', unlocked: false },
    { id: 'stk-6', name: '15-Min Turbo Boost', emoji: '⏱️', tier: '15-Min Milestone', desc: 'Focused continuously for 15 minutes', unlocked: false },
    { id: 'stk-7', name: 'Golden Hour Scholar', emoji: '🌅', tier: '15-Min Milestone', desc: 'Powered through 30 minutes of deep study', unlocked: false },
    { id: 'stk-8', name: 'Neon Phoenix', emoji: '🔥', tier: '15-Min Milestone', desc: 'Blazed through 45 minutes of productive momentum', unlocked: false },
    { id: 'stk-9', name: 'Champion Crown', emoji: '👑', tier: 'Victory Swag', desc: 'Conquered an entire focus block timer to 00:00!', unlocked: false },
    { id: 'stk-10', name: 'Grand Study Trophy', emoji: '🏆', tier: 'Victory Swag', desc: 'Completed full homework focus session with victory!', unlocked: false },
    { id: 'stk-11', name: 'Quantum Sprint', emoji: '🚀', tier: 'Mastery', desc: 'Finished deep focus blocks across multiple days', unlocked: false },
    { id: 'stk-12', name: 'Diamond Focus Gem', emoji: '💎', tier: 'Perfection', desc: 'Completed an entire homework milestone ahead of deadline', unlocked: false },
    { id: 'stk-13', name: 'Zen Study Garden', emoji: '🪴', tier: 'Mindfulness', desc: 'Completed serene study session with ambient soundscapes', unlocked: false },
    { id: 'stk-14', name: 'Cosmic Astronaut', emoji: '🧑‍🚀', tier: 'Deep Focus', desc: 'Explored deep subject concepts without distraction', unlocked: false },
    { id: 'stk-15', name: 'Midnight Owl', emoji: '🦉', tier: 'Wisdom', desc: 'Conquered challenging problem sets with patience', unlocked: false },
    { id: 'stk-16', name: 'Unstoppable Streak', emoji: '🌟', tier: 'Legendary', desc: '7-day consecutive focus streak champion', unlocked: false }
  ],

  // Streak Leaderboards (Global & College-Wise)
  leaderboard: {
    activeTab: 'global', // 'global' or 'college'
    global: [
      { rank: 1, name: 'Elena Rostova', college: 'ETH Zurich', major: 'CS & Robotics', streak: 42, hours: 148, swags: 8, avatar: 'ER' },
      { rank: 2, name: 'Marcus Sterling', college: 'Stanford University', major: 'Bioengineering', streak: 38, hours: 132, swags: 7, avatar: 'MS' },
      { rank: 3, name: 'Aanya Patel', college: 'State Campus Central', major: 'Pre-Med Biology', streak: 12, hours: 56, swags: 5, avatar: 'AP' },
      { rank: 4, name: 'Lucas Dubois', college: 'Sorbonne University', major: 'Mathematics', streak: 10, hours: 44, swags: 4, avatar: 'LD' },
      { rank: 5, name: 'Hana Tanaka', college: 'University of Tokyo', major: 'Informatics', streak: 9, hours: 41, swags: 4, avatar: 'HT' },
      { rank: 6, name: 'Liam O\'Connor', college: 'Trinity College Dublin', major: 'History & Arts', streak: 8, hours: 36, swags: 3, avatar: 'LO' },
      { rank: 7, name: 'Jishnu', college: 'State Campus Central', major: 'Computer Science', streak: 7, hours: 32, swags: 4, avatar: 'JV', isUser: true },
      { rank: 8, name: 'Priya Sharma', college: 'IIT Bombay', major: 'Electrical Eng', streak: 6, hours: 28, swags: 3, avatar: 'PS' }
    ],
    college: [
      { rank: 1, name: 'Devon Kim', college: 'State Campus Central', major: 'Software Eng', streak: 21, hours: 84, swags: 6, avatar: 'DK' },
      { rank: 2, name: 'Aanya Patel', college: 'State Campus Central', major: 'Pre-Med Biology', streak: 12, hours: 56, swags: 5, avatar: 'AP' },
      { rank: 3, name: 'Jishnu', college: 'State Campus Central', major: 'Computer Science', streak: 7, hours: 32, swags: 4, avatar: 'JV', isUser: true },
      { rank: 4, name: 'Samira Gomez', college: 'State Campus Central', major: 'Cognitive Science', streak: 5, hours: 22, swags: 3, avatar: 'SG' },
      { rank: 5, name: 'Tyler Brooks', college: 'State Campus Central', major: 'Architecture', streak: 4, hours: 18, swags: 2, avatar: 'TB' }
    ]
  }
};

// Mascot Dialogue Banks
const PomiDialogues = {
  welcome: [
    "Ready for a calm, stress-free study day? Let's take it one step at a time.",
    "Bite-sized pieces so you never feel overwhelmed today!",
    "Breaking big papers and coding into 20-minute chunks makes everything easy!"
  ],
  running: [
    "You are doing wonderful! Focus on just this single tiny step.",
    "Gentle pace active. No rush, no stress—momentum is building!",
    "15 more minutes until your soothing tea break. Keep it steady!"
  ],
  paused: [
    "Taking a breath is wisdom, not laziness. Rest as long as you need.",
    "Paused calmly. Hydrate, roll your shoulders, and press play when ready."
  ],
  finished: [
    "Sprint accomplished! You did that with zero panic. Stand up and celebrate!",
    "High five! +50 Campus Coins credited to your study jar."
  ]
};

// Helper: Local Storage Sync
function loadSavedState() {
  try {
    const saved = localStorage.getItem('adaptive_student_assistant_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.user) AppState.user = parsed.user;
      if (parsed.schedule) AppState.schedule = parsed.schedule;
      if (parsed.assignments && Array.isArray(parsed.assignments)) {
        AppState.assignments = parsed.assignments.map((asg, idx) => {
          if (!asg.dueTimestamp) {
            asg.dueTimestamp = Date.now() + (idx + 1) * 8 * 3600 * 1000;
          }
          return asg;
        });
      }
      if (parsed.timetable) AppState.timetable = parsed.timetable;
      if (parsed.stickers) AppState.stickers = parsed.stickers;
    }
  } catch (e) {
    console.warn('Could not load localStorage state:', e);
  }
}

function persistState() {
  try {
    localStorage.setItem('adaptive_student_assistant_state', JSON.stringify({
      user: AppState.user,
      schedule: AppState.schedule,
      assignments: AppState.assignments,
      timetable: AppState.timetable,
      stickers: AppState.stickers
    }));
  } catch (e) {}
}

// Toast System
function showToast(message, icon = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span class="material-symbols-outlined text-[20px]">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  SoundSystem.playPop(520);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Confetti Particle Burst for Milestones
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const particles = [];
  const colors = ['#b71326', '#005da9', '#fef3c7', '#ffdad8', '#10b981', '#31302d'];

  for (let i = 0; i < 75; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() * 200 - 100),
      y: canvas.height / 3 + (Math.random() * 100 - 50),
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      dr: (Math.random() - 0.5) * 10,
      gravity: 0.45,
      opacity: 1
    });
  }

  let animationFrame;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.dr;
      p.opacity -= 0.012;
      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(updateConfetti);
    } else {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }
  updateConfetti();
}

// Router & View Switcher
function switchView(viewName) {
  const views = ['schedule', 'assignments', 'timer', 'rewards', 'login', 'register'];
  if (!views.includes(viewName)) viewName = 'schedule';

  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.style.display = (v === viewName) ? 'block' : 'none';
  });

  // Highlight header tab buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    const target = btn.dataset.view;
    if (target === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Highlight mobile bottom nav
  document.querySelectorAll('.mobile-nav-item').forEach(btn => {
    const target = btn.dataset.view;
    if (target === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Window scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update hash without jump
  if (history.pushState) {
    history.pushState(null, null, `#${viewName}`);
  }

  if (viewName === 'timer') {
    syncFocusTimerChecklist();
    renderFocusAnalytics(AppState.analytics.activeTab);
  } else if (viewName === 'assignments') {
    renderAssignments();
  } else if (viewName === 'rewards') {
    renderStickers();
    renderLeaderboard();
  } else if (viewName === 'schedule') {
    renderSchedule();
    renderMyDayPendingHomeworks();
  }

  SoundSystem.playPop(480);
}

// Profile Switcher (Jishnu, Aanya, Guest)
function switchUserProfile(profileKey) {
  if (profileKey === 'aanya') {
    AppState.user.id = 'aanya';
    AppState.user.name = 'Aanya';
    AppState.user.email = 'aanya.patel@campus.edu';
    AppState.user.major = 'Pre-Med Biology';
    AppState.user.year = '2nd Year';
    AppState.user.streakDays = 12;
  } else if (profileKey === 'jishnu') {
    AppState.user.id = 'jishnu';
    AppState.user.name = 'Jishnu';
    AppState.user.email = 'jishnu.v@campus.edu';
    AppState.user.major = 'Computer Science';
    AppState.user.year = '3rd Year';
    AppState.user.streakDays = 7;
  }
  persistState();
  renderApp();
  showToast(`Welcome back, ${AppState.user.name}! Desk loaded.`, 'waving_hand');
}

// Render Water Tracker & Selectable Cup Matrix
function updateWaterUI() {
  const pillText = document.getElementById('water-pill-text');
  const greetingWaterText = document.getElementById('greeting-water-text');
  const countDisplay = document.getElementById('water-count-display');
  const goalDisplay = document.getElementById('water-goal-display');
  const goalInput = document.getElementById('water-goal-input');

  if (pillText) {
    pillText.textContent = `${AppState.user.waterLogged}/${AppState.user.waterGoal} Glasses`;
  }
  if (greetingWaterText) {
    greetingWaterText.textContent = `Water goal: ${AppState.user.waterLogged} of ${AppState.user.waterGoal} glasses logged today`;
  }
  if (countDisplay) {
    countDisplay.textContent = AppState.user.waterLogged;
  }
  if (goalDisplay) {
    goalDisplay.textContent = AppState.user.waterGoal;
  }
  if (goalInput) {
    goalInput.value = AppState.user.waterGoal;
  }

  renderHydrationCups();
}

function renderHydrationCups() {
  const container = document.getElementById('hydration-cups-container');
  if (!container) return;

  container.innerHTML = '';
  for (let i = 1; i <= AppState.user.waterGoal; i++) {
    const isFilled = i <= AppState.user.waterLogged;
    const cup = document.createElement('div');
    cup.className = `hydration-cup ${isFilled ? 'filled' : ''}`;
    cup.title = `Glass ${i}: Click to ${isFilled ? 'remove' : 'fill'}`;
    cup.onclick = () => toggleSpecificCup(i);

    cup.innerHTML = `
      <div class="cup-water-fill"></div>
      <span class="cup-label">${i}</span>
    `;
    container.appendChild(cup);
  }
}

function toggleSpecificCup(cupNumber) {
  if (cupNumber === AppState.user.waterLogged) {
    // If clicking the current max filled cup, step back by 1
    AppState.user.waterLogged--;
    SoundSystem.playPop(350);
  } else {
    AppState.user.waterLogged = cupNumber;
    SoundSystem.playPop(440 + cupNumber * 30);
  }

  if (AppState.user.waterLogged >= AppState.user.waterGoal) {
    AppState.user.waterLogged = AppState.user.waterGoal;
    SoundSystem.playSuccessChime();
    triggerConfetti();
    showToast(`🌊 Daily Goal of ${AppState.user.waterGoal} glasses achieved! High energy unlocked!`, 'celebration');
  } else {
    showToast(`💧 ${AppState.user.waterLogged} of ${AppState.user.waterGoal} glasses drank today.`, 'water_drop');
  }

  persistState();
  updateWaterUI();
}

function changeWater(delta) {
  if (delta > 0) {
    if (AppState.user.waterLogged < AppState.user.waterGoal) {
      AppState.user.waterLogged++;
      SoundSystem.playPop(520);
      if (AppState.user.waterLogged === AppState.user.waterGoal) {
        SoundSystem.playSuccessChime();
        triggerConfetti();
        showToast(`🎉 Daily hydration goal achieved! Keep shining!`, 'celebration');
      } else {
        showToast(`💧 +1 glass drank! (${AppState.user.waterLogged}/${AppState.user.waterGoal})`, 'water_drop');
      }
    } else {
      AppState.user.waterLogged++;
      SoundSystem.playPop(600);
      showToast(`💧 Bonus glass logged! (${AppState.user.waterLogged}/${AppState.user.waterGoal})`, 'water_drop');
    }
  } else if (delta < 0) {
    if (AppState.user.waterLogged > 0) {
      AppState.user.waterLogged--;
      SoundSystem.playPop(340);
      showToast(`Removed 1 glass. (${AppState.user.waterLogged}/${AppState.user.waterGoal})`, 'remove');
    }
  }
  persistState();
  updateWaterUI();
}

function resetWater() {
  const modal = document.getElementById('reset-water-modal');
  if (modal) {
    modal.classList.add('open');
    SoundSystem.playPop(340);
  } else {
    if (confirm('Are you sure you want to reset your logged water glasses for today, friend?')) {
      confirmResetWater();
    }
  }
}

function closeResetWaterModal() {
  const modal = document.getElementById('reset-water-modal');
  if (modal) modal.classList.remove('open');
}

function confirmResetWater() {
  AppState.user.waterLogged = 0;
  persistState();
  updateWaterUI();
  closeResetWaterModal();
  SoundSystem.playPop(280);
  showToast('💧 Water count reset to 0 for a fresh start with Pomi!', 'refresh');
}

function sipWater() {
  changeWater(1);
}

function setDailyWaterGoal(newGoal) {
  const goal = parseInt(newGoal);
  if (!isNaN(goal) && goal >= 1 && goal <= 16) {
    AppState.user.waterGoal = goal;
    if (AppState.user.waterLogged > goal) {
      AppState.user.waterLogged = goal;
    }
    persistState();
    updateWaterUI();
    SoundSystem.playPop(550);
    showToast(`🎯 Daily hydration goal set to ${goal} glasses!`, 'flag');
  }
}

// Schedule Time Parsing for Chronological Sorting
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 9999;
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (match) {
    let hrs = parseInt(match[1]);
    const mins = parseInt(match[2]);
    if (timeStr.toLowerCase().includes('pm') && hrs < 12) {
      hrs += 12;
    } else if (timeStr.toLowerCase().includes('am') && hrs === 12) {
      hrs = 0;
    }
    return hrs * 60 + mins;
  }
  if (timeStr.toLowerCase().includes('tomorrow')) return 2400;
  return 1800;
}

// Schedule Rendering & Actions
function renderSchedule(filterCategory = 'all') {
  const timelineContainer = document.getElementById('timeline-container');
  if (!timelineContainer) return;

  const filtered = AppState.schedule
    .filter(item => {
      if (filterCategory === 'all') return true;
      return item.category === filterCategory;
    })
    .sort((a, b) => parseTimeToMinutes(a.timeRange) - parseTimeToMinutes(b.timeRange));

  timelineContainer.innerHTML = '';

  filtered.forEach(item => {
    let nodeBg = 'bg-surface-container-high text-on-surface-variant';
    let cardBg = 'bg-surface-container-lowest';
    let badgeClass = 'pill-badge-gray';

    if (item.category === 'class') {
      nodeBg = 'bg-tertiary text-on-tertiary';
      badgeClass = 'pill-badge-blue';
    } else if (item.category === 'focus') {
      nodeBg = 'bg-primary text-on-primary';
      cardBg = 'bg-surface-container-lowest border-l-4 border-l-primary';
      badgeClass = 'pill-badge-coral';
    } else if (item.category === 'downtime') {
      nodeBg = 'bg-surface-container-highest text-on-surface';
      cardBg = 'bg-surface-container-low';
      badgeClass = 'pill-badge-gray';
    }

    const itemEl = document.createElement('div');
    itemEl.className = 'timeline-item';
    itemEl.innerHTML = `
      <div class="timeline-node ${nodeBg} shadow-sm">
        <span class="material-symbols-outlined text-[18px]">${item.icon}</span>
      </div>
      <div class="neo-card ${cardBg} flex-1 p-space-md sm:p-space-lg transition-transform hover:translate-x-1">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span class="pill-badge ${badgeClass}">
            ${item.timeRange} • ${item.category.toUpperCase()}
          </span>
          <span class="font-label-sm text-on-surface-variant flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">location_on</span>
            ${item.location}
          </span>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 class="font-headline-md text-on-surface ${item.completed ? 'line-through opacity-70' : ''}">${item.title}</h4>
            <p class="font-body-md text-on-surface-variant mt-1">${item.description}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button class="btn-pill ${item.completed ? 'btn-soft' : 'btn-outline'} btn-sm" onclick="toggleScheduleItem('${item.id}')" title="Mark complete">
              <span class="material-symbols-outlined text-[16px]">${item.completed ? 'check_circle' : 'radio_button_unchecked'}</span>
              <span>${item.completed ? 'Completed' : 'Check Off'}</span>
            </button>
            <button class="btn-pill btn-soft btn-sm text-red-600 hover:bg-red-50 flex items-center gap-1" onclick="deleteScheduleItem('${item.id}')" title="Delete event from schedule">
              <span class="material-symbols-outlined text-[16px]">delete</span>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    `;
    timelineContainer.appendChild(itemEl);
  });
}

function deleteScheduleItem(id) {
  const idx = AppState.schedule.findIndex(i => i.id === id);
  if (idx !== -1) {
    const deleted = AppState.schedule.splice(idx, 1)[0];
    persistState();
    renderSchedule();
    SoundSystem.playPop(300);
    showToast(`Deleted "${deleted.title}" from your schedule.`, 'delete');
  }
}

function toggleScheduleItem(id) {
  const item = AppState.schedule.find(i => i.id === id);
  if (item) {
    item.completed = !item.completed;
    if (item.completed) {
      SoundSystem.playSuccessChime();
      showToast(`Great job! Marked "${item.title}" complete.`, 'check_circle');
    } else {
      SoundSystem.playPop();
    }
    persistState();
    renderSchedule();
  }
}

// "Feeling Tired? Push Study to Tomorrow" Action
function pushStudyTomorrow() {
  const toast = document.getElementById('push-toast');
  const focusItem = AppState.schedule.find(i => i.category === 'focus');
  if (focusItem) {
    focusItem.timeRange = 'Tomorrow @ 2:00 PM';
    focusItem.location = 'Library Pod 4';
    focusItem.description = 'Postponed with zero stress! Rest well and return with fresh energy.';
    persistState();
    renderSchedule();
  }
  if (toast) {
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 5000);
  }
  SoundSystem.playGentleBell();
  showToast('🌙 Study block gracefully shifted to tomorrow. Zero guilt guarantee active!', 'bedtime');
}

// ==========================================================================
// Homework Hub & Task Manager
// Left: Large Selected Homework View with To-Do checklist & "Start Focus Block"
// Right: All Added Homeworks List with interactive selection
// ==========================================================================

// Helper: Calculate Exact Due Date / Time & Time Left or "Missed it!"
function getHomeworkDueStatus(asg) {
  const now = Date.now();
  let ts = asg.dueTimestamp;
  if (!ts) {
    ts = now + 24 * 3600 * 1000;
  }
  const dueDate = new Date(ts);
  const dueFormatted = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
    ' • ' + dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const diffMs = ts - now;

  if (asg.status === 'completed') {
    return {
      dueFormatted: dueFormatted,
      timeLeftText: 'Completed ✨',
      isMissed: false,
      isCompleted: true,
      badgeClass: 'pill-badge-gray font-bold'
    };
  }

  if (diffMs <= 0) {
    return {
      dueFormatted: dueFormatted,
      timeLeftText: 'Missed it!',
      isMissed: true,
      isCompleted: false,
      badgeClass: 'pill-badge-coral font-bold text-red-600 bg-red-100 border border-red-300'
    };
  }

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let timeLeft = '';
  let badgeClass = 'pill-badge-yellow';

  if (diffDays > 0) {
    const remHours = diffHours % 24;
    timeLeft = `${diffDays}d ${remHours > 0 ? remHours + 'h ' : ''}left`;
    badgeClass = 'pill-badge-blue font-bold';
  } else if (diffHours > 0) {
    const remMins = diffMins % 60;
    timeLeft = `${diffHours}h ${remMins > 0 ? remMins + 'm ' : ''}left`;
    badgeClass = diffHours <= 3 ? 'pill-badge-coral font-bold animate-pulse' : 'pill-badge-yellow font-bold';
  } else {
    timeLeft = `${Math.max(diffMins, 1)}m left`;
    badgeClass = 'pill-badge-coral font-bold animate-pulse';
  }

  return {
    dueFormatted: dueFormatted,
    timeLeftText: timeLeft,
    isMissed: false,
    isCompleted: false,
    badgeClass: badgeClass
  };
}

// Render Card 1 on My Day: Homeworks Pending (Scrollable, Top 2 visible initially, sorted by due date)
function renderMyDayPendingHomeworks() {
  const container = document.getElementById('myday-pending-homeworks-list');
  const badge = document.getElementById('myday-hw-pending-badge');
  if (!container) return;

  // Filter only pending homeworks (not completed) & sort by due date ascending
  const pending = AppState.assignments
    .filter(a => a.status !== 'completed')
    .sort((a, b) => (a.dueTimestamp || 0) - (b.dueTimestamp || 0));

  if (badge) {
    badge.textContent = `${pending.length} Pending`;
  }

  if (pending.length === 0) {
    container.innerHTML = `
      <li class="p-3 text-center rounded-xl bg-surface-container-low text-xs text-on-surface-variant border border-dashed border-hairline-border">
        🎉 All caught up! Zero pending homeworks.
      </li>
    `;
    return;
  }

  container.innerHTML = pending.map(asg => {
    const status = getHomeworkDueStatus(asg);
    const duration = asg.durationMinutes || 25;
    return `
      <li class="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer border border-hairline-border flex flex-col gap-1.5" onclick="selectHomeworkAndGoToHub('${asg.id}')" title="Click to view details in Homework Hub">
        <div class="flex items-center justify-between gap-1">
          <span class="font-headline-sm text-xs font-bold text-on-surface line-clamp-1 flex-1 uppercase">${asg.title}</span>
          <span class="pill-badge ${status.badgeClass} text-[10px] shrink-0">
            ${status.isMissed ? '⚠️ Missed it!' : status.timeLeftText}
          </span>
        </div>
        <div class="flex items-center justify-between text-[11px] text-on-surface-variant font-label-sm">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-tertiary">schedule</span>
            <span>${status.dueFormatted}</span>
          </span>
          <span class="text-secondary font-semibold">⏱️ ${duration}m</span>
        </div>
      </li>
    `;
  }).join('');
}

function selectHomeworkAndGoToHub(assignmentId) {
  selectHomework(assignmentId);
  switchView('assignments');
}

function selectHomework(assignmentId) {
  AppState.selectedAssignmentId = assignmentId;
  persistState();
  renderAssignments();
  SoundSystem.playPop();
}

function renderAssignments(filterStatus = 'all') {
  const container = document.getElementById('all-homeworks-right-list');
  const largeView = document.getElementById('selected-homework-large-view');
  if (!largeView || !container) return;

  // Always arrange homeworks in homework hub by due date (earliest due first)
  AppState.assignments.sort((a, b) => (a.dueTimestamp || 0) - (b.dueTimestamp || 0));

  // Ensure a valid selected assignment
  let selectedAsg = AppState.assignments.find(a => a.id === AppState.selectedAssignmentId);
  if (!selectedAsg && AppState.assignments.length > 0) {
    selectedAsg = AppState.assignments[0];
    AppState.selectedAssignmentId = selectedAsg.id;
  }

  // 1. Render Left Side: Large Selected Homework View
  if (!selectedAsg) {
    largeView.innerHTML = `
      <div class="text-center py-12 flex flex-col items-center">
        <span class="material-symbols-outlined text-[48px] text-secondary opacity-50 mb-2">menu_book</span>
        <h3 class="font-headline-md text-on-surface">No Homework Added Yet</h3>
        <p class="font-body-md text-on-surface-variant max-w-sm mt-1 mb-4">Click below to add your first homework with custom steps and focus duration.</p>
        <button class="btn-pill btn-primary" onclick="openAddHomeworkModal()">+ Add New Homework</button>
      </div>
    `;
  } else {
    const totalSteps = selectedAsg.steps ? selectedAsg.steps.length : 0;
    const completedSteps = selectedAsg.steps ? selectedAsg.steps.filter(s => s.done).length : 0;
    const percentDone = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    const duration = selectedAsg.durationMinutes || 25;
    const dueInfo = getHomeworkDueStatus(selectedAsg);

    largeView.innerHTML = `
      <!-- Header Badges -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div class="flex flex-wrap items-center gap-2">
          <span class="pill-badge pill-badge-coral font-bold">Selected Task</span>
          ${selectedAsg.course ? `<span class="pill-badge pill-badge-blue font-bold">${selectedAsg.course}</span>` : ''}
          <span class="pill-badge pill-badge-yellow flex items-center gap-1 font-bold">
            <span class="material-symbols-outlined text-[14px]">timer</span>
            <span>⏱️ ${duration}m Focus Sprint</span>
          </span>
        </div>
        <!-- Due Date / Time & Time Left Display -->
        <div class="flex items-center gap-1 font-label-md font-bold ${dueInfo.isMissed ? 'text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200' : 'text-primary'}">
          <span class="material-symbols-outlined text-[18px]">${dueInfo.isMissed ? 'warning' : 'schedule'}</span>
          <span>Due: ${dueInfo.dueFormatted} • <span class="${dueInfo.isMissed ? 'underline font-extrabold' : ''}">${dueInfo.timeLeftText}</span></span>
        </div>
      </div>

      <!-- Title & Subject Info -->
      <div>
        <h2 class="font-headline-lg text-on-surface leading-tight uppercase">${selectedAsg.title}</h2>
        <p class="font-body-md text-on-surface-variant mt-1">${selectedAsg.description || (selectedAsg.course ? selectedAsg.course + ' study block.' : 'Focused academic task.')}</p>
      </div>

      <!-- Progress Meter (if steps exist) -->
      ${totalSteps > 0 ? `
        <div class="neo-card-subtle p-space-md rounded-2xl">
          <div class="flex items-center justify-between font-label-md mb-2">
            <span class="text-on-surface font-bold">Goal Checklist Progress</span>
            <span class="text-primary font-bold">${completedSteps} of ${totalSteps} Steps Complete (${percentDone}%)</span>
          </div>
          <div class="chunky-bar">
            <div class="chunky-bar-fill" style="width: ${percentDone}%;"></div>
          </div>
        </div>
      ` : ''}

      <!-- Steps To-Do List (Interactive Checklist) -->
      <div class="space-y-space-sm">
        <div class="flex items-center justify-between">
          <span class="font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
            ${totalSteps > 0 ? `Steps to Achieve Goal (${completedSteps}/${totalSteps}):` : 'Goal Steps (Optional):'}
          </span>
          <span class="text-xs text-secondary">Click step to mark done</span>
        </div>

        <div class="space-y-2 mt-2" id="selected-hw-steps-container">
          ${totalSteps > 0 ? selectedAsg.steps.map((step, idx) => `
            <div class="hw-step-row ${step.done ? 'is-done' : ''} cursor-pointer" onclick="toggleAssignmentStep('${selectedAsg.id}', '${step.id}')">
              <input type="checkbox" class="hw-step-checkbox" ${step.done ? 'checked' : ''} onclick="event.stopPropagation(); toggleAssignmentStep('${selectedAsg.id}', '${step.id}')">
              <span class="font-body-md flex-1 ${step.done ? 'line-through text-on-surface-variant' : 'text-on-surface font-semibold'}">
                ${step.text}
              </span>
              <span class="pill-badge ${step.done ? 'pill-badge-gray' : 'pill-badge-coral'} text-xs">
                ${step.done ? 'Done! ✨' : `Step ${idx + 1}`}
              </span>
            </div>
          `).join('') : `
            <div class="p-4 rounded-xl bg-surface-container-low text-center border border-dashed border-hairline-border">
              <span class="material-symbols-outlined text-secondary text-[24px]">task_alt</span>
              <p class="font-body-sm text-on-surface-variant mt-1">No steps specified for this homework — ready for pure deep focus!</p>
            </div>
          `}
        </div>

        <!-- Quick Inline Add Step Form -->
        <div class="flex items-center gap-2 pt-1">
          <input type="text" id="inline-step-input" class="form-input py-1.5 px-3 text-sm flex-1" placeholder="+ Add a step to achieve this goal..." onkeydown="if(event.key==='Enter'){event.preventDefault(); addInlineStepToSelected();}"/>
          <button class="btn-pill btn-soft btn-sm text-xs font-bold" type="button" onclick="addInlineStepToSelected()">+ Add Step</button>
        </div>
      </div>

      <!-- Big Prominent Action Buttons -->
      <div class="pt-space-sm flex flex-col sm:flex-row items-center gap-space-sm">
        <button class="btn-pill btn-primary btn-lg flex-1 w-full flex items-center justify-center gap-2 text-base font-bold shadow-md hover:scale-[1.01] transition-transform" onclick="triggerStartHomeworkFocus('${selectedAsg.id}')" type="button">
          <span class="material-symbols-outlined text-[24px]">play_circle</span>
          <span>Start ${duration}m Focus Block</span>
        </button>
        <button class="btn-pill btn-soft w-full sm:w-auto flex items-center justify-center gap-1" onclick="postponeAssignment('${selectedAsg.id}')" type="button">
          <span class="material-symbols-outlined text-[18px]">bedtime</span>
          <span>Postpone (+24h)</span>
        </button>
      </div>
    `;
  }

  // 2. Render Right Side: All Homeworks List (arranged by due date)
  container.innerHTML = '';
  const filteredList = AppState.assignments.filter(asg => {
    if (filterStatus === 'all') return true;
    return asg.status === filterStatus;
  });

  if (filteredList.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center neo-card text-on-surface-variant">
        <p class="font-body-sm">No homeworks in this status filter.</p>
      </div>
    `;
  } else {
    filteredList.forEach(asg => {
      const isSelected = asg.id === AppState.selectedAssignmentId;
      const totalSteps = asg.steps ? asg.steps.length : 0;
      const doneSteps = asg.steps ? asg.steps.filter(s => s.done).length : 0;
      const duration = asg.durationMinutes || 25;
      const dueInfo = getHomeworkDueStatus(asg);

      const card = document.createElement('div');
      card.className = `hw-card flex flex-col gap-2.5 ${isSelected ? 'is-selected' : ''}`;
      card.onclick = () => selectHomework(asg.id);

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5 flex-wrap">
            ${asg.course ? `<span class="pill-badge pill-badge-blue text-[11px] font-bold">${asg.course}</span>` : ''}
            <span class="pill-badge pill-badge-yellow text-[11px] font-bold">⏱️ ${duration}m</span>
            ${isSelected ? `<span class="pill-badge pill-badge-coral text-[11px] font-bold">Viewing</span>` : ''}
          </div>
          <!-- Time Left / Missed it! Badge -->
          <span class="pill-badge ${dueInfo.badgeClass} text-[11px]">
            ${dueInfo.isMissed ? '⚠️ Missed it!' : dueInfo.timeLeftText}
          </span>
        </div>

        <div>
          <h3 class="font-headline-sm text-on-surface font-bold leading-snug">${asg.title}</h3>
          <div class="flex items-center gap-1 text-xs text-secondary mt-1">
            <span class="material-symbols-outlined text-[13px]">schedule</span>
            <span>Due: ${dueInfo.dueFormatted}</span>
          </div>
          ${asg.description ? `<p class="font-body-sm text-on-surface-variant line-clamp-1 mt-1">${asg.description}</p>` : ''}
        </div>

        <div class="flex items-center justify-between pt-1 border-t border-hairline-border">
          <div class="flex items-center gap-1 text-xs text-on-surface-variant font-bold">
            <span class="material-symbols-outlined text-[15px] ${doneSteps > 0 && doneSteps === totalSteps ? 'text-primary' : 'text-secondary'}">checklist</span>
            <span>${totalSteps > 0 ? `${doneSteps}/${totalSteps} Steps Done` : 'Freeform'}</span>
          </div>

          <button class="btn-pill ${isSelected ? 'btn-primary' : 'btn-soft'} btn-sm text-xs flex items-center gap-1" onclick="event.stopPropagation(); triggerStartHomeworkFocus('${asg.id}')" type="button">
            <span class="material-symbols-outlined text-[15px]">play_arrow</span>
            <span>Focus (${duration}m)</span>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Update tabs counters
  const todoCount = AppState.assignments.filter(a => a.status === 'todo').length;
  const workingCount = AppState.assignments.filter(a => a.status === 'working').length;
  const doneCount = AppState.assignments.filter(a => a.status === 'completed').length;
  
  const todoTab = document.getElementById('tab-count-todo');
  const workingTab = document.getElementById('tab-count-working');
  const completedTab = document.getElementById('tab-count-completed');
  const allBadge = document.getElementById('all-hw-count-badge');

  if (todoTab) todoTab.textContent = todoCount;
  if (workingTab) workingTab.textContent = workingCount;
  if (completedTab) completedTab.textContent = doneCount;
  if (allBadge) allBadge.textContent = AppState.assignments.length;
}

function addInlineStepToSelected() {
  const input = document.getElementById('inline-step-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const asg = AppState.assignments.find(a => a.id === AppState.selectedAssignmentId);
  if (!asg) return;
  if (!asg.steps) asg.steps = [];

  asg.steps.push({
    id: 's-' + Date.now(),
    text: text,
    done: false
  });

  input.value = '';
  persistState();
  renderAssignments();
  renderMyDayPendingHomeworks();
  syncFocusTimerChecklist();
  SoundSystem.playPop();
  showToast(`Added step to "${asg.title}"!`, 'task_alt');
}

function toggleAssignmentStep(assignmentId, stepId) {
  const asg = AppState.assignments.find(a => a.id === assignmentId);
  if (!asg || !asg.steps) return;
  const step = asg.steps.find(s => s.id === stepId);
  if (!step) return;

  step.done = !step.done;
  if (step.done) {
    SoundSystem.playSuccessChime();
    AppState.user.coins += 10;
    showToast(`Step finished! +10 Coins earned!`, 'auto_awesome');
    
    // If all steps done, celebrate!
    if (asg.steps.every(s => s.done)) {
      asg.status = 'completed';
      triggerConfetti();
      showToast(`🎉 All steps completed for "${asg.title}"! Superb work!`, 'celebration');
    }
  } else {
    SoundSystem.playPop();
  }
  persistState();
  renderAssignments();
  renderMyDayPendingHomeworks();
  syncFocusTimerChecklist();
}

function postponeAssignment(id) {
  const asg = AppState.assignments.find(a => a.id === id);
  if (asg) {
    asg.dueTimestamp = Date.now() + 24 * 3600 * 1000;
    asg.dueText = 'Postponed +24h';
    persistState();
    renderAssignments();
    renderMyDayPendingHomeworks();
    SoundSystem.playGentleBell();
    showToast(`Barnaby safely postponed "${asg.title}" by 24h. Enjoy your evening without academic guilt.`, 'night_shelter');
  }
}

// ==========================================================================
// Add Homework Modal Dynamic Helpers
// ==========================================================================

function openAddHomeworkModal() {
  const modal = document.getElementById('add-homework-modal');
  if (modal) modal.classList.add('open');
  SoundSystem.playPop();
}

function closeAddHomeworkModal() {
  const modal = document.getElementById('add-homework-modal');
  if (modal) modal.classList.remove('open');
}

function addModalStepField() {
  const container = document.getElementById('modal-steps-container');
  if (!container) return;
  const nextNum = container.children.length + 1;
  const row = document.createElement('div');
  row.className = 'modal-step-input-row';
  row.innerHTML = `
    <span class="text-xs font-bold text-on-surface-variant w-5 text-center">${nextNum}.</span>
    <input type="text" class="form-input flex-1 py-1.5 text-sm modal-step-item" placeholder="Step ${nextNum}: Type goal action item (Optional)">
    <button type="button" class="modal-step-remove-btn" onclick="removeModalStepField(this)" title="Remove step">
      <span class="material-symbols-outlined text-[16px]">close</span>
    </button>
  `;
  container.appendChild(row);
  SoundSystem.playPop(520);
}

function removeModalStepField(btn) {
  const row = btn.closest('.modal-step-input-row');
  if (row) {
    row.remove();
    // Re-index remaining rows
    const container = document.getElementById('modal-steps-container');
    if (container) {
      Array.from(container.children).forEach((child, idx) => {
        const label = child.querySelector('span');
        if (label) label.textContent = `${idx + 1}.`;
      });
    }
  }
}

function selectModalDuration(minutes) {
  const hiddenInput = document.getElementById('new-hw-selected-duration');
  const customInput = document.getElementById('new-hw-custom-minutes');
  if (hiddenInput) hiddenInput.value = minutes;
  if (customInput) customInput.value = '';

  document.querySelectorAll('#hw-timer-preset-group .timer-pill-btn').forEach(btn => {
    if (parseInt(btn.dataset.minutes) === minutes) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  SoundSystem.playPop();
}

function handleCustomModalDuration(val) {
  const mins = parseInt(val);
  const hiddenInput = document.getElementById('new-hw-selected-duration');
  if (!isNaN(mins) && mins > 0) {
    if (hiddenInput) hiddenInput.value = mins;
    document.querySelectorAll('#hw-timer-preset-group .timer-pill-btn').forEach(btn => {
      btn.classList.remove('active');
    });
  }
}

function setQuickDueDateTime(hoursAhead) {
  const d = new Date(Date.now() + hoursAhead * 3600 * 1000);
  const pad = n => String(n).padStart(2, '0');
  const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const input = document.getElementById('new-hw-due-datetime');
  if (input) input.value = formatted;
  SoundSystem.playPop();
}

function handleAddHomeworkSubmit(e) {
  e.preventDefault();
  const titleInput = document.getElementById('new-hw-title');
  const courseInput = document.getElementById('new-hw-course');
  const dueDateTimeInput = document.getElementById('new-hw-due-datetime');
  const durationInput = document.getElementById('new-hw-selected-duration');

  const title = titleInput ? titleInput.value.trim() : '';
  const course = courseInput ? courseInput.value.trim() : '';
  const dueDateTimeVal = dueDateTimeInput ? dueDateTimeInput.value : '';
  const durationMinutes = durationInput ? (parseInt(durationInput.value) || 25) : 25;

  if (!title) return;

  let dueTimestamp = Date.now() + 24 * 3600 * 1000;
  if (dueDateTimeVal) {
    const parsed = new Date(dueDateTimeVal).getTime();
    if (!isNaN(parsed)) {
      dueTimestamp = parsed;
    }
  }

  // Collect steps (optional)
  const stepsList = [];
  document.querySelectorAll('.modal-step-item').forEach((input, idx) => {
    const val = input.value.trim();
    if (val) {
      stepsList.push({
        id: 's-' + Date.now() + '-' + (idx + 1),
        text: val,
        done: false
      });
    }
  });

  const newAssignment = {
    id: 'asg-' + Date.now(),
    title: title.toUpperCase(),
    course: course || '',
    courseShort: course ? course.split(' ')[0] : 'ACADEMIC',
    description: course ? `${course} focus assignment.` : 'Focused academic study session.',
    dueTimestamp: dueTimestamp,
    dueText: 'Due ' + new Date(dueTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    status: 'todo',
    effort: durationMinutes >= 60 ? 'high' : durationMinutes >= 35 ? 'medium' : 'low',
    durationMinutes: durationMinutes,
    estimatedTime: `${durationMinutes} min`,
    steps: stepsList
  };

  AppState.assignments.push(newAssignment);
  AppState.selectedAssignmentId = newAssignment.id; // Automatically select this new homework!
  persistState();
  renderAssignments();
  renderMyDayPendingHomeworks();
  closeAddHomeworkModal();
  document.getElementById('add-hw-form').reset();

  SoundSystem.playSuccessChime();
  showToast(`Added "${title}" with due date and ${durationMinutes}m focus timer!`, 'task_alt');
}

// ==========================================================================
// Focus Room Timer Navigation & Conflict Handling
// ==========================================================================

function triggerStartHomeworkFocus(assignmentId) {
  const asg = AppState.assignments.find(a => a.id === assignmentId);
  if (!asg) return;

  // Check if a timer is ALREADY RUNNING in the focus room
  if (AppState.timer.isRunning) {
    const currentRunningAsg = AppState.assignments.find(a => a.id === AppState.timer.activeAssignmentId);
    const mins = Math.floor(AppState.timer.secondsRemaining / 60);
    const secs = AppState.timer.secondsRemaining % 60;
    const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const runningNameEl = document.getElementById('conflict-running-name');
    const timeLeftEl = document.getElementById('conflict-time-left');
    const newNameEl = document.getElementById('conflict-new-name');
    const newDurationEl = document.getElementById('conflict-new-duration');

    if (runningNameEl) runningNameEl.textContent = currentRunningAsg ? currentRunningAsg.title : 'Active Session';
    if (timeLeftEl) timeLeftEl.textContent = timeFormatted;
    if (newNameEl) newNameEl.textContent = asg.title;
    if (newDurationEl) newDurationEl.textContent = `${asg.durationMinutes || 25} minutes`;

    AppState.pendingFocusAssignmentId = assignmentId;

    const modal = document.getElementById('timer-conflict-modal');
    if (modal) modal.classList.add('open');
    SoundSystem.playPop(340);
    return;
  }

  // Not currently running — apply homework timer directly
  applyHomeworkToFocusTimer(assignmentId);
}

function confirmCancelOlderTimer() {
  clearInterval(AppState.timer.intervalId);
  AppState.timer.isRunning = false;
  closeTimerConflictModal();

  if (AppState.pendingFocusAssignmentId) {
    applyHomeworkToFocusTimer(AppState.pendingFocusAssignmentId);
    showToast('Older timer canceled. Ready to focus on new task!', 'timer');
  }
}

function keepCurrentRunningTimer() {
  closeTimerConflictModal();
  switchView('timer');
  showToast('Resuming active focus session without interruption.', 'timer');
}

function closeTimerConflictModal() {
  const modal = document.getElementById('timer-conflict-modal');
  if (modal) modal.classList.remove('open');
  AppState.pendingFocusAssignmentId = null;
}

function applyHomeworkToFocusTimer(assignmentId) {
  const asg = AppState.assignments.find(a => a.id === assignmentId);
  if (!asg) return;

  AppState.timer.activeAssignmentId = assignmentId;
  const duration = asg.durationMinutes || 25;

  setTimerDuration(duration);
  AppState.timer.sessionSecondsElapsed = 0;
  AppState.timer.lastMilestoneAwarded = 0;

  switchView('timer');
  syncFocusTimerChecklist();
  renderFocusAnalytics(AppState.analytics.activeTab);
  showToast(`Focus Room ready: ${duration}m sprint for ${asg.title}!`, 'timer');
}

function syncFocusTimerChecklist() {
  const badgeEl = document.getElementById('timer-sprint-badge');
  const checklistEl = document.getElementById('sprint-checklist-container');
  const counterEl = document.getElementById('timer-task-counter');
  
  const currentAsg = AppState.assignments.find(a => a.id === AppState.timer.activeAssignmentId) || AppState.assignments[0];
  if (!currentAsg || !checklistEl) return;

  if (badgeEl) {
    badgeEl.textContent = `Focus Target: ${currentAsg.title}`;
  }

  const steps = currentAsg.steps || [];
  const doneCount = steps.filter(s => s.done).length;
  if (counterEl) {
    counterEl.textContent = `${doneCount} of ${steps.length} Done`;
  }

  if (steps.length === 0) {
    checklistEl.innerHTML = `
      <div class="p-3 bg-surface-container-low rounded-xl text-center border border-dashed border-hairline-border">
        <p class="font-body-sm text-on-surface-variant">No sub-steps required for this task. Focus freely!</p>
      </div>
    `;
    return;
  }

  checklistEl.innerHTML = steps.map((step, idx) => `
    <label class="group flex items-center gap-space-md p-space-md rounded-xl cursor-pointer transition-colors ${
      step.done ? 'bg-surface-container-low text-on-surface-variant' : 'bg-surface-container-lowest hover:bg-surface-container-low shadow-sm'
    }">
      <input type="checkbox" class="w-6 h-6 rounded-lg accent-primary cursor-pointer" ${step.done ? 'checked' : ''} onchange="toggleAssignmentStep('${currentAsg.id}', '${step.id}')">
      <span class="font-body-lg flex-1 select-none ${step.done ? 'line-through text-on-surface-variant' : 'text-on-surface font-semibold'}">
        ${step.text}
      </span>
      <span class="material-symbols-outlined ${step.done ? 'text-primary' : 'text-secondary opacity-40'} text-[20px]">
        ${step.done ? 'check_circle' : 'radio_button_unchecked'}
      </span>
    </label>
  `).join('');
}

// Focus Inspiration Text & Final Stretch Super Encouragement Banks
const FocusInspirations = [
  "Small, steady steps today create monumental victories tomorrow.",
  "Focus is not about doing more; it is about honoring this single moment.",
  "You don't have to be extreme, just consistent. You are doing great!",
  "Deep breath in, calm mind on. One task at a time.",
  "Progress over perfection every single day.",
  "You are capable of far more than you realize. Keep this gentle pace!"
];

const FinalStretchQuotes = [
  "⚡ ALMOST DONE! You're in the final stretch, keep going!",
  "🔥 90% CONQUERED! Just a few minutes left—finish strong!",
  "🌟 SO CLOSE TO VICTORY! Keep pushing, you're almost at the summit!",
  "🚀 FINAL STRETCH POWER! Stand tall and bring it home!"
];

function setTimerDuration(minutes) {
  clearInterval(AppState.timer.intervalId);
  AppState.timer.isRunning = false;
  AppState.timer.durationMinutes = minutes;
  AppState.timer.totalSeconds = minutes * 60;
  AppState.timer.secondsRemaining = minutes * 60;
  updateTimerDisplay();
  
  // Set fresh inspirational quote above timer
  const inspirationEl = document.getElementById('timer-inspiration-text');
  const inspirationBox = document.getElementById('timer-inspiration-container');
  if (inspirationEl) {
    inspirationEl.textContent = `"${FocusInspirations[Math.floor(Math.random() * FocusInspirations.length)]}"`;
  }
  if (inspirationBox) {
    inspirationBox.className = 'inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low border border-hairline-border text-center shadow-xs transition-all duration-300';
  }

  // Highlight active button pill
  document.querySelectorAll('.duration-pill').forEach(btn => {
    if (parseInt(btn.dataset.min) === minutes) {
      btn.className = 'duration-pill px-space-md py-space-xs rounded-full font-label-sm bg-primary text-on-primary font-bold shadow-sm';
    } else {
      btn.className = 'duration-pill px-space-md py-space-xs rounded-full font-label-sm bg-surface-container-lowest hover:bg-surface-container text-on-surface transition-all';
    }
  });

  const pauseBtn = document.getElementById('timer-pause-btn');
  if (pauseBtn) {
    pauseBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">play_arrow</span><span>Start Studying</span>`;
    pauseBtn.classList.remove('btn-charcoal');
    pauseBtn.classList.add('btn-primary');
  }

  SoundSystem.playPop();
}

function toggleTimer() {
  const pauseBtn = document.getElementById('timer-pause-btn');
  const pomiText = document.getElementById('pomi-speech-text');

  if (AppState.timer.isRunning) {
    // Pause
    clearInterval(AppState.timer.intervalId);
    AppState.timer.isRunning = false;
    if (pauseBtn) {
      pauseBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">play_arrow</span><span>Resume Studying (Ready)</span>`;
      pauseBtn.classList.remove('btn-primary');
      pauseBtn.classList.add('btn-charcoal');
    }
    if (pomiText) {
      pomiText.textContent = PomiDialogues.paused[Math.floor(Math.random() * PomiDialogues.paused.length)];
    }
    SoundSystem.playPop(380);
  } else {
    // Start / Resume
    AppState.timer.isRunning = true;
    AppState.timer.intervalId = setInterval(timerTick, 1000);
    if (pauseBtn) {
      pauseBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">pause</span><span>Pause (Catch My Breath)</span>`;
      pauseBtn.classList.remove('btn-charcoal');
      pauseBtn.classList.add('btn-primary');
    }
    if (pomiText) {
      pomiText.textContent = PomiDialogues.running[Math.floor(Math.random() * PomiDialogues.running.length)];
    }
    SoundSystem.playPop(580);
  }
}

// Timer Tick with 15-Minute Milestone Swags & End-of-Timer Victory Swag
function timerTick() {
  if (AppState.timer.secondsRemaining > 0) {
    AppState.timer.secondsRemaining--;
    AppState.timer.sessionSecondsElapsed++;
    
    // Log focus time live to analytics
    logFocusTimeToAnalytics(1);
    updateTimerDisplay();

    // Motivational quote midway
    if (AppState.timer.secondsRemaining === Math.floor(AppState.timer.totalSeconds / 2)) {
      const pomiText = document.getElementById('pomi-speech-text');
      if (pomiText) pomiText.textContent = "Halfway milestone achieved! Keep steady, your tea break is close.";
      SoundSystem.playPop(660);
    }

    // Super encouraging comments near the end of timer (near 90% elapsed, i.e. <= 10% remaining)
    const isFinalStretch = AppState.timer.secondsRemaining <= Math.ceil(AppState.timer.totalSeconds * 0.10);
    const inspirationEl = document.getElementById('timer-inspiration-text');
    const inspirationBox = document.getElementById('timer-inspiration-container');
    const pomiText = document.getElementById('pomi-speech-text');

    if (isFinalStretch) {
      const quoteIdx = Math.floor(AppState.timer.secondsRemaining / 4) % FinalStretchQuotes.length;
      const superComment = FinalStretchQuotes[quoteIdx];
      if (inspirationEl) {
        inspirationEl.textContent = superComment;
      }
      if (pomiText && AppState.timer.secondsRemaining % 4 === 0) {
        pomiText.textContent = superComment;
      }
      if (inspirationBox) {
        inspirationBox.className = 'inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border-2 border-amber-400 text-amber-900 font-bold text-center shadow-md scale-105 transition-all duration-300 animate-pulse';
      }
    }

    // 15-Minute Milestone Award:
    // Every 15 minutes of elapsed focus (900 seconds), award a digital sticker swag!
    const minutesElapsed = Math.floor(AppState.timer.sessionSecondsElapsed / 60);
    if (minutesElapsed > 0 && minutesElapsed % 15 === 0 && minutesElapsed > AppState.timer.lastMilestoneAwarded) {
      AppState.timer.lastMilestoneAwarded = minutesElapsed;
      awardFocusSticker('milestone_15m', minutesElapsed);
      AppState.user.coins += 25;
      AppState.analytics.totalMilestoneSwagsEarned++;
      persistState();
    }

  } else {
    // Completed Focus Block!
    clearInterval(AppState.timer.intervalId);
    AppState.timer.isRunning = false;
    AppState.user.coins += 50;
    AppState.analytics.totalSessionsCompleted++;
    persistState();

    SoundSystem.playFanfare();
    triggerConfetti();

    // Award VICTORY SWAG at the end of the focus timer!
    awardFocusSticker('victory');

    const currentAsg = AppState.assignments.find(a => a.id === AppState.timer.activeAssignmentId);
    const pomiText = document.getElementById('pomi-speech-text');
    if (pomiText) {
      pomiText.textContent = `VICTORY! You conquered the full ${AppState.timer.durationMinutes}m focus block for ${currentAsg ? currentAsg.title : 'your study goal'}! Stand up and celebrate!`;
    }
    showToast(`🏆 Focus Block Finished! Victory Swag +50 Coins earned!`, 'celebration');

    const pauseBtn = document.getElementById('timer-pause-btn');
    if (pauseBtn) {
      pauseBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">play_arrow</span><span>Start Studying</span>`;
    }
  }
}

function updateTimerDisplay() {
  const countdownEl = document.getElementById('timer-countdown-text');
  const progressRing = document.getElementById('timer-progress-ring');
  if (!countdownEl) return;

  const mins = Math.floor(AppState.timer.secondsRemaining / 60);
  const secs = AppState.timer.secondsRemaining % 60;
  countdownEl.textContent = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

  if (progressRing) {
    const maxOffset = 263.89; // Circumference for r=42
    const fraction = AppState.timer.secondsRemaining / AppState.timer.totalSeconds;
    const newOffset = maxOffset * (1 - fraction);
    progressRing.style.strokeDashoffset = newOffset;
  }
}

function resetTimer() {
  clearInterval(AppState.timer.intervalId);
  AppState.timer.isRunning = false;
  AppState.timer.secondsRemaining = AppState.timer.totalSeconds;
  AppState.timer.sessionSecondsElapsed = 0;
  AppState.timer.lastMilestoneAwarded = 0;
  updateTimerDisplay();

  const inspirationEl = document.getElementById('timer-inspiration-text');
  const inspirationBox = document.getElementById('timer-inspiration-container');
  if (inspirationEl) {
    inspirationEl.textContent = `"${FocusInspirations[Math.floor(Math.random() * FocusInspirations.length)]}"`;
  }
  if (inspirationBox) {
    inspirationBox.className = 'inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-low border border-hairline-border text-center shadow-xs transition-all duration-300';
  }

  const pauseBtn = document.getElementById('timer-pause-btn');
  if (pauseBtn) {
    pauseBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">play_arrow</span><span>Start Studying</span>`;
    pauseBtn.classList.remove('btn-charcoal');
    pauseBtn.classList.add('btn-primary');
  }
  SoundSystem.playPop();
  showToast('Timer reset to starting duration.', 'restart_alt');
}

// ==========================================================================
// Digital Sticker Swags Awarding (15-Min Milestones & Victory Swags)
// ==========================================================================

function awardFocusSticker(rewardType = 'milestone_15m', milestoneMinutes = 15) {
  let stickerToUnlock = null;

  if (rewardType === 'victory') {
    // Prefer victory-tier sticker
    stickerToUnlock = AppState.stickers.find(s => !s.unlocked && s.tier.includes('Victory')) 
                   || AppState.stickers.find(s => !s.unlocked);
  } else if (rewardType === 'milestone_15m') {
    // Prefer 15-min milestone sticker
    stickerToUnlock = AppState.stickers.find(s => !s.unlocked && s.tier.includes('Milestone'))
                   || AppState.stickers.find(s => !s.unlocked);
  } else {
    stickerToUnlock = AppState.stickers.find(s => !s.unlocked);
  }

  // If all catalog stickers already unlocked, award dynamic star prestige swag
  if (!stickerToUnlock) {
    const newStkId = 'stk-bonus-' + Date.now();
    stickerToUnlock = {
      id: newStkId,
      name: rewardType === 'victory' ? `Summit Crown #${AppState.stickers.length + 1}` : `15m Flow Star #${AppState.stickers.length + 1}`,
      emoji: rewardType === 'victory' ? '👑' : '⭐',
      tier: rewardType === 'victory' ? 'Victory Swag' : '15-Min Milestone',
      desc: rewardType === 'victory' 
        ? `Completed a full victorious focus block!`
        : `Achieved ${milestoneMinutes} minutes of focused deep study!`,
      unlocked: true
    };
    AppState.stickers.push(stickerToUnlock);
  } else {
    stickerToUnlock.unlocked = true;
  }

  persistState();
  renderStickers();
  renderLeaderboard();
  SoundSystem.playFanfare();
  triggerConfetti();
  showStickerUnlockedCelebration(stickerToUnlock, rewardType, milestoneMinutes);
}

function showStickerUnlockedCelebration(sticker, rewardType = 'general', milestoneMinutes = 15) {
  const modal = document.getElementById('sticker-unlocked-modal');
  const iconEl = document.getElementById('unlocked-sticker-emoji');
  const nameEl = document.getElementById('unlocked-sticker-name');
  const descEl = document.getElementById('unlocked-sticker-desc');
  const badgeEl = document.getElementById('unlocked-sticker-badge');

  if (iconEl) iconEl.textContent = sticker.emoji;
  if (nameEl) nameEl.textContent = sticker.name;
  if (descEl) descEl.textContent = sticker.desc;

  if (badgeEl) {
    if (rewardType === 'victory') {
      badgeEl.textContent = '🏆 VICTORY SWAG UNLOCKED!';
      badgeEl.className = 'pill-badge pill-badge-coral mb-1 font-bold text-xs uppercase shadow-sm';
    } else if (rewardType === 'milestone_15m') {
      badgeEl.textContent = `🌟 ${milestoneMinutes}-MIN FOCUS MILESTONE SWAG!`;
      badgeEl.className = 'pill-badge pill-badge-yellow mb-1 font-bold text-xs uppercase shadow-sm';
    } else {
      badgeEl.textContent = '✨ NEW DIGITAL STICKER SWAG!';
      badgeEl.className = 'pill-badge pill-badge-yellow mb-1 font-bold text-xs uppercase shadow-sm';
    }
  }

  if (modal) modal.classList.add('open');
  showToast(`✨ NEW SWAG UNLOCKED: ${sticker.name}!`, 'stars');
}

// ==========================================================================
// Focus Room Analytics View
// Divisions: Fully (Total), Each Subject, Day-Wise, Weekly, Monthly
// ==========================================================================

function switchAnalyticsTab(tab) {
  AppState.analytics.activeTab = tab;
  document.querySelectorAll('.analytics-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`tab-btn-${tab}`);
  if (activeBtn) activeBtn.classList.add('active');
  renderFocusAnalytics(tab);
  SoundSystem.playPop();
}

function formatSecondsToPretty(totalSecs) {
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m`;
}

function logFocusTimeToAnalytics(seconds) {
  AppState.analytics.totalSecondsLogged += seconds;

  // Credit active subject
  const currentAsg = AppState.assignments.find(a => a.id === AppState.timer.activeAssignmentId);
  const subjectName = currentAsg && currentAsg.course ? currentAsg.course : 'General Studies';
  
  let subjObj = AppState.analytics.subjects.find(s => subjectName.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(subjectName.toLowerCase()));
  if (!subjObj) {
    subjObj = AppState.analytics.subjects[0]; // fallback to CS
  }
  if (subjObj) {
    subjObj.seconds += seconds;
  }

  // Credit today
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDay = days[new Date().getDay()];
  const dayEntry = AppState.analytics.dayWise.find(d => d.day === todayDay);
  if (dayEntry) {
    dayEntry.seconds += seconds;
  }

  // Periodic visual refresh if analytics is visible
  if (AppState.analytics.totalSecondsLogged % 10 === 0) {
    renderFocusAnalytics(AppState.analytics.activeTab);
  }
}

function renderFocusAnalytics(tab = 'fully') {
  const container = document.getElementById('analytics-content-container');
  if (!container) return;

  const totalSecs = AppState.analytics.totalSecondsLogged;
  const formattedTotal = formatSecondsToPretty(totalSecs);

  if (tab === 'fully') {
    // 1. Fully (Total Study Time & Key Metrics)
    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-lg">
        <div class="analytics-stat-card border-l-4 border-l-primary">
          <span class="font-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Total Study Invested</span>
          <div class="analytics-stat-value text-primary">${formattedTotal}</div>
          <span class="font-body-sm text-secondary">Logged across all subjects</span>
        </div>

        <div class="analytics-stat-card border-l-4 border-l-tertiary">
          <span class="font-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Focus Blocks Finished</span>
          <div class="analytics-stat-value text-tertiary">${AppState.analytics.totalSessionsCompleted} Blocks</div>
          <span class="font-body-sm text-secondary">100% completion rate</span>
        </div>

        <div class="analytics-stat-card border-l-4 border-l-amber-500">
          <span class="font-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Milestone Swags</span>
          <div class="analytics-stat-value text-amber-600">${AppState.analytics.totalMilestoneSwagsEarned} Earned</div>
          <span class="font-body-sm text-secondary">Awarded on every 15 min focus</span>
        </div>

        <div class="analytics-stat-card border-l-4 border-l-blue-600">
          <span class="font-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Current Habit Streak</span>
          <div class="analytics-stat-value text-blue-600">${AppState.user.streakDays} Days 🔥</div>
          <span class="font-body-sm text-secondary">Gentle study consistency</span>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-surface-container-low border border-hairline-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
            <span class="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <div>
            <h4 class="font-label-lg text-on-surface font-bold">Sanity & Focus Quotient: 96% (Optimal Rhythm)</h4>
            <p class="font-body-sm text-on-surface-variant">Zero burnout detected. You take healthy hydration breathers between sprints.</p>
          </div>
        </div>
        <button class="btn-pill btn-charcoal btn-sm text-xs font-bold shrink-0" onclick="switchAnalyticsTab('subject')">
          View Subject Distribution →
        </button>
      </div>
    `;

  } else if (tab === 'subject') {
    // 2. Each Subject Breakdown
    const subjects = AppState.analytics.subjects;
    container.innerHTML = `
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between pb-1">
          <span class="font-label-sm uppercase tracking-wider text-on-surface-variant font-bold">Subject Time Allocations</span>
          <span class="font-label-sm text-secondary">Percentage of total ${formattedTotal} study time</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${subjects.map(sub => {
            const pct = totalSecs > 0 ? Math.round((sub.seconds / totalSecs) * 100) : 0;
            const subPretty = formatSecondsToPretty(sub.seconds);
            return `
              <div class="analytics-subject-row">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-3.5 h-3.5 rounded-full shadow-sm" style="background-color: ${sub.color};"></span>
                    <span class="font-headline-sm text-on-surface font-bold text-base">${sub.name}</span>
                  </div>
                  <span class="font-label-lg font-bold text-on-surface">${subPretty} <span class="text-secondary text-xs">(${pct}%)</span></span>
                </div>
                <div class="analytics-bar-bg">
                  <div class="analytics-bar-fill" style="width: ${pct}%; background-color: ${sub.color};"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

  } else if (tab === 'day') {
    // 3. Day-Wise Breakdown (Mon-Sun Bar Chart)
    const days = AppState.analytics.dayWise;
    const currentDayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    const maxDaySecs = Math.max(...days.map(d => d.seconds), 14400);

    container.innerHTML = `
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-headline-sm text-on-surface font-bold">7-Day Study Cadence</h4>
            <p class="font-body-sm text-on-surface-variant">Daily hours spent focused across the current academic week.</p>
          </div>
          <span class="pill-badge pill-badge-coral font-bold text-xs">Today: ${currentDayName}</span>
        </div>

        <div class="chart-bars-wrapper">
          ${days.map(d => {
            const heightPct = Math.round((d.seconds / maxDaySecs) * 100);
            const isToday = d.day === currentDayName;
            const hoursVal = (d.seconds / 3600).toFixed(1) + 'h';
            return `
              <div class="chart-bar-col">
                <span class="chart-bar-val">${hoursVal}</span>
                <div class="chart-bar-pillar ${isToday ? 'is-today' : 'is-primary'}" style="height: ${Math.max(heightPct, 12)}%;" title="${d.label}: ${formatSecondsToPretty(d.seconds)}"></div>
                <span class="chart-bar-label ${isToday ? 'text-primary font-bold' : ''}">${d.day}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="flex items-center justify-between text-xs text-on-surface-variant pt-1 font-bold">
          <span>Daily Target: ~2.5 hrs/day</span>
          <span>Weekly Total: ${(days.reduce((acc, d) => acc + d.seconds, 0) / 3600).toFixed(1)} hrs logged</span>
        </div>
      </div>
    `;

  } else if (tab === 'weekly') {
    // 4. Weekly Comparison
    const weeks = AppState.analytics.weekly;
    const maxHrs = Math.max(...weeks.map(w => w.hours), 20);

    container.innerHTML = `
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-headline-sm text-on-surface font-bold">Weekly Study Comparison</h4>
            <p class="font-body-sm text-on-surface-variant">Focus volume compared week-over-week.</p>
          </div>
          <span class="pill-badge pill-badge-yellow font-bold text-xs">+18% Focus Surge</span>
        </div>

        <div class="chart-bars-wrapper">
          ${weeks.map((w, idx) => {
            const heightPct = Math.round((w.hours / maxHrs) * 100);
            const isThisWeek = idx === weeks.length - 1;
            return `
              <div class="chart-bar-col">
                <span class="chart-bar-val">${w.hours}h</span>
                <div class="chart-bar-pillar ${isThisWeek ? 'is-today' : ''}" style="height: ${heightPct}%;" title="${w.week}: ${w.hours} hours"></div>
                <span class="chart-bar-label ${isThisWeek ? 'text-primary font-bold' : ''}">${w.week}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="p-3 rounded-xl bg-surface-container-low border border-hairline-border flex items-center justify-between">
          <span class="font-body-sm text-on-surface">Average weekly study output: <strong>15.8 hours</strong></span>
          <span class="pill-badge pill-badge-coral font-bold text-xs">Consistent Rhythm</span>
        </div>
      </div>
    `;

  } else if (tab === 'monthly') {
    // 5. Monthly History
    const months = AppState.analytics.monthly;
    const targetMonthHrs = 75;

    container.innerHTML = `
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-headline-sm text-on-surface font-bold">Monthly Semester Arc</h4>
            <p class="font-body-sm text-on-surface-variant">Accumulated focus hours per month (Target: 75 hrs/month).</p>
          </div>
          <span class="pill-badge pill-badge-blue font-bold text-xs">Semester Fall 2026</span>
        </div>

        <div class="flex flex-col gap-3">
          ${months.map(m => {
            const pct = Math.min(Math.round((m.hours / targetMonthHrs) * 100), 100);
            return `
              <div class="p-3.5 rounded-2xl bg-surface-container-lowest border border-hairline-border flex flex-col gap-2">
                <div class="flex items-center justify-between font-label-md">
                  <span class="font-bold text-on-surface text-base">${m.month} 2026</span>
                  <span class="text-primary font-bold">${m.hours} hrs <span class="text-secondary font-normal">/ 75 hrs goal (${pct}%)</span></span>
                </div>
                <div class="analytics-bar-bg">
                  <div class="analytics-bar-fill bg-primary" style="width: ${pct}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

function claimEarlyCoins() {
  const claimBtn = document.getElementById('claim-coins-btn');
  AppState.user.coins += 50;
  persistState();
  if (claimBtn) {
    claimBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">stars</span><span>+50 Coins Added!</span>`;
    claimBtn.classList.remove('btn-primary');
    claimBtn.classList.add('btn-soft');
  }
  SoundSystem.playSuccessChime();
  triggerConfetti();

  // Award Digital Sticker Swag!
  awardFocusSticker();

  showToast('🪙 +50 Campus Coins credited to your study jar! High five!', 'stars');
}

// Gentle Care Corner & Safe Exit Modal
function openGentleExitModal() {
  const modal = document.getElementById('gentle-exit-modal');
  if (modal) modal.classList.add('open');
  SoundSystem.playGentleBell();
}

function closeGentleExitModal() {
  const modal = document.getElementById('gentle-exit-modal');
  if (modal) modal.classList.remove('open');
}

function confirmGentleExit() {
  clearInterval(AppState.timer.intervalId);
  AppState.timer.isRunning = false;
  closeGentleExitModal();
  switchView('schedule');
  showToast('🌙 Barnaby secured your study streak. Go drink a warm beverage and recharge!', 'self_improvement');
}

// Box Breathing Visual Modal
let breathingInterval = null;
function openBreathingModal() {
  const modal = document.getElementById('breathing-modal');
  if (!modal) return;
  modal.classList.add('open');

  const orb = document.getElementById('breathing-orb');
  const instruction = document.getElementById('breathing-instruction');

  function runCycle() {
    if (!orb || !instruction) return;
    // Inhale (4s)
    orb.className = 'breathing-orb inhale';
    instruction.textContent = 'Inhale slowly through your nose... (1, 2, 3, 4)';
    SoundSystem.playPop(300);

    setTimeout(() => {
      // Hold (4s)
      orb.className = 'breathing-orb hold';
      instruction.textContent = 'Hold your breath gently... (1, 2, 3, 4)';
      setTimeout(() => {
        // Exhale (4s)
        orb.className = 'breathing-orb exhale';
        instruction.textContent = 'Softly breathe out like a breeze... (1, 2, 3, 4)';
      }, 4000);
    }, 4000);
  }

  runCycle();
  breathingInterval = setInterval(runCycle, 12000);
}

function closeBreathingModal() {
  const modal = document.getElementById('breathing-modal');
  if (modal) modal.classList.remove('open');
  if (breathingInterval) clearInterval(breathingInterval);
}

// Ambient Soundscape Selector
function setupAmbientControls() {
  const buttons = document.querySelectorAll('.soundscape-pill');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const soundType = btn.dataset.sound;
      const isNowActive = SoundSystem.startAmbient(soundType);

      buttons.forEach(b => {
        b.classList.remove('bg-primary-fixed', 'border-primary');
        b.classList.add('bg-surface-container-low');
      });

      if (isNowActive) {
        btn.classList.add('bg-primary-fixed', 'border-primary');
        btn.classList.remove('bg-surface-container-low');
        showToast(`🎧 Soundscape active: ${soundType.toUpperCase()}`, 'volume_up');
      } else {
        showToast('🔇 Ambient soundscape paused.', 'volume_off');
      }
    });
  });
}

// ==========================================================================
// Interactive Timetable Matrix Logic
// ==========================================================================
function renderTimetable() {
  const container = document.getElementById('timetable-render-container');
  if (!container) return;

  const { daysCount, periodsCount, days, periods, cells } = AppState.timetable;

  let html = `
    <div class="timetable-wrapper">
      <table class="timetable-table">
        <thead>
          <tr>
            <th class="timetable-header-day">Day</th>
  `;

  for (let p = 0; p < periodsCount; p++) {
    const period = periods[p] || { name: `Period ${p + 1}`, time: '09:00 - 10:00' };
    html += `
      <th class="timetable-period-th">
        <div class="period-title">${period.name}</div>
        <div class="period-time-badge" onclick="openEditPeriodTimeModal(${p})" title="Click to edit period timing">
          <span class="material-symbols-outlined text-[12px]">schedule</span>
          <span>${period.time}</span>
          <span class="material-symbols-outlined text-[12px] opacity-60">edit</span>
        </div>
      </th>
    `;
  }

  html += `
          </tr>
        </thead>
        <tbody>
  `;

  for (let d = 0; d < daysCount; d++) {
    const dayName = days[d] || `Day ${d + 1}`;
    html += `
      <tr>
        <td class="timetable-header-day">
          <div class="font-headline-md text-on-surface text-sm sm:text-base">${dayName.slice(0, 3).toUpperCase()}</div>
          <span class="font-body-sm text-secondary text-xs">${dayName}</span>
        </td>
    `;

    for (let p = 0; p < periodsCount; p++) {
      const cellKey = `${d}-${p}`;
      const cell = cells[cellKey];

      if (cell) {
        let tagBg = 'bg-primary-fixed text-primary border-primary/20';
        if (cell.color === 'blue') tagBg = 'bg-tertiary-fixed text-tertiary border-blue-200';
        if (cell.color === 'yellow') tagBg = 'bg-butter-yellow text-amber-900 border-yellow-300';
        if (cell.color === 'green') tagBg = 'bg-emerald-100 text-emerald-900 border-emerald-300';
        if (cell.color === 'purple') tagBg = 'bg-purple-100 text-purple-900 border-purple-300';
        if (cell.color === 'gray') tagBg = 'bg-surface-container text-secondary border-hairline-border';

        html += `
          <td class="timetable-cell" onclick="openEditCellModal(${d}, ${p})">
            <div class="cell-subject-card ${tagBg}">
              <div class="flex items-center justify-between">
                <span class="cell-code">${cell.code || 'CLASS'}</span>
                <span class="material-symbols-outlined text-[14px] opacity-60">edit</span>
              </div>
              <div class="cell-title font-bold">${cell.title}</div>
              <div class="cell-meta">
                <span class="material-symbols-outlined text-[13px]">location_on</span>
                <span>${cell.room || 'Campus'}</span>
                ${cell.instructor ? `• <span>${cell.instructor}</span>` : ''}
              </div>
            </div>
          </td>
        `;
      } else {
        html += `
          <td class="timetable-cell" onclick="openEditCellModal(${d}, ${p})">
            <button class="cell-empty-btn" type="button">
              <span class="material-symbols-outlined text-[16px] mr-1">add</span>
              <span>Add Subject</span>
            </button>
          </td>
        `;
      }
    }

    html += `</tr>`;
  }

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// Timetable Grid Dimension Config Modal
function openEditTimetableConfigModal() {
  const modal = document.getElementById('timetable-config-modal');
  const daysSelect = document.getElementById('tt-days-count');
  const periodsSelect = document.getElementById('tt-periods-count');

  if (daysSelect) daysSelect.value = AppState.timetable.daysCount;
  if (periodsSelect) periodsSelect.value = AppState.timetable.periodsCount;

  if (modal) modal.classList.add('open');
  SoundSystem.playPop();
}

function closeEditTimetableConfigModal() {
  const modal = document.getElementById('timetable-config-modal');
  if (modal) modal.classList.remove('open');
}

function saveTimetableConfig(e) {
  if (e && e.preventDefault) e.preventDefault();
  const daysCount = parseInt(document.getElementById('tt-days-count').value) || 5;
  const periodsCount = parseInt(document.getElementById('tt-periods-count').value) || 5;

  AppState.timetable.daysCount = Math.min(Math.max(daysCount, 1), 7);
  AppState.timetable.periodsCount = Math.min(Math.max(periodsCount, 1), 8);

  persistState();
  renderTimetable();
  closeEditTimetableConfigModal();
  SoundSystem.playSuccessChime();
  showToast(`Timetable adjusted to ${AppState.timetable.daysCount} days and ${AppState.timetable.periodsCount} periods!`, 'view_timeline');
}

// Cell Subject Editing Modal
let currentEditingCell = { day: 0, period: 0 };

function openEditCellModal(dayIdx, periodIdx) {
  currentEditingCell = { day: dayIdx, period: periodIdx };
  const cellKey = `${dayIdx}-${periodIdx}`;
  const cell = AppState.timetable.cells[cellKey];

  const modal = document.getElementById('cell-edit-modal');
  const dayName = AppState.timetable.days[dayIdx] || `Day ${dayIdx + 1}`;
  const period = AppState.timetable.periods[periodIdx] || { name: `Period ${periodIdx + 1}`, time: '' };

  document.getElementById('cell-modal-slot-desc').textContent = `${dayName} • ${period.name} (${period.time})`;
  document.getElementById('cell-input-code').value = cell ? (cell.code || '') : '';
  document.getElementById('cell-input-title').value = cell ? (cell.title || '') : '';
  document.getElementById('cell-input-room').value = cell ? (cell.room || '') : '';
  document.getElementById('cell-input-instructor').value = cell ? (cell.instructor || '') : '';
  document.getElementById('cell-input-color').value = cell ? (cell.color || 'blue') : 'blue';

  const deleteBtn = document.getElementById('cell-delete-btn');
  if (deleteBtn) {
    deleteBtn.style.display = cell ? 'inline-flex' : 'none';
  }

  if (modal) modal.classList.add('open');
  SoundSystem.playPop();
}

function closeEditCellModal() {
  const modal = document.getElementById('cell-edit-modal');
  if (modal) modal.classList.remove('open');
}

function saveCellData(e) {
  if (e && e.preventDefault) e.preventDefault();
  const { day, period } = currentEditingCell;
  const cellKey = `${day}-${period}`;

  const title = document.getElementById('cell-input-title').value.trim();
  const code = document.getElementById('cell-input-code').value.trim();
  const room = document.getElementById('cell-input-room').value.trim();
  const instructor = document.getElementById('cell-input-instructor').value.trim();
  const color = document.getElementById('cell-input-color').value;

  if (!title) {
    alert('Please enter a subject or class title.');
    return;
  }

  AppState.timetable.cells[cellKey] = {
    code: code || 'CLASS',
    title: title,
    room: room || 'Main Campus',
    instructor: instructor,
    color: color
  };

  persistState();
  renderTimetable();
  closeEditCellModal();
  SoundSystem.playSuccessChime();
  showToast(`Updated timetable block for ${title}!`, 'school');
}

function clearCurrentCell() {
  const { day, period } = currentEditingCell;
  const cellKey = `${day}-${period}`;
  delete AppState.timetable.cells[cellKey];

  persistState();
  renderTimetable();
  closeEditCellModal();
  SoundSystem.playPop(320);
  showToast('Class block cleared from timetable slot.', 'delete');
}

// Period Timing Edit Modal
let currentEditingPeriodIdx = 0;

function openEditPeriodTimeModal(periodIdx) {
  currentEditingPeriodIdx = periodIdx;
  const modal = document.getElementById('period-time-modal');
  const period = AppState.timetable.periods[periodIdx] || { name: `Period ${periodIdx + 1}`, time: '09:00 - 10:00' };

  document.getElementById('period-time-name').value = period.name;
  document.getElementById('period-time-range').value = period.time;

  if (modal) modal.classList.add('open');
  SoundSystem.playPop();
}

function closeEditPeriodTimeModal() {
  const modal = document.getElementById('period-time-modal');
  if (modal) modal.classList.remove('open');
}

function savePeriodTime(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('period-time-name').value.trim();
  const time = document.getElementById('period-time-range').value.trim();

  if (!time) {
    alert('Please enter a valid time range (e.g. 09:00 - 10:00).');
    return;
  }

  AppState.timetable.periods[currentEditingPeriodIdx] = {
    id: `p${currentEditingPeriodIdx + 1}`,
    name: name || `Period ${currentEditingPeriodIdx + 1}`,
    time: time
  };

  persistState();
  renderTimetable();
  closeEditPeriodTimeModal();
  SoundSystem.playSuccessChime();
  showToast(`Updated timing for ${name || 'Period'}!`, 'schedule');
}

// ==========================================================================
// Digital Sticker Swags Logic
// ==========================================================================
function renderStickers() {
  const container = document.getElementById('stickers-display-grid');
  const unlockedCountEl = document.getElementById('stickers-unlocked-count');
  if (!container) return;

  const total = AppState.stickers.length;
  const unlocked = AppState.stickers.filter(s => s.unlocked).length;

  if (unlockedCountEl) unlockedCountEl.textContent = `${unlocked} of ${total} Swags Unlocked`;

  container.innerHTML = AppState.stickers.map(stk => `
    <div class="sticker-card ${stk.unlocked ? 'unlocked' : 'locked'}" onclick="showStickerDetailsModal('${stk.id}')">
      <div class="sticker-icon-disc">
        <span>${stk.emoji}</span>
      </div>
      <div class="sticker-name">${stk.name}</div>
      <div class="sticker-tier">${stk.unlocked ? stk.tier : '🔒 Locked'}</div>
      <span class="pill-badge ${stk.unlocked ? 'pill-badge-coral' : 'pill-badge-gray'} text-[9px] mt-2">
        ${stk.unlocked ? 'Equipped Badge' : 'Earn via Focus'}
      </span>
    </div>
  `).join('');
}

function closeStickerUnlockedModal() {
  const modal = document.getElementById('sticker-unlocked-modal');
  if (modal) modal.classList.remove('open');
}

function showStickerDetailsModal(stickerId) {
  const stk = AppState.stickers.find(s => s.id === stickerId);
  if (!stk) return;
  const modal = document.getElementById('sticker-details-modal');
  if (!modal) return;

  document.getElementById('stk-detail-emoji').textContent = stk.emoji;
  document.getElementById('stk-detail-name').textContent = stk.name;
  document.getElementById('stk-detail-desc').textContent = stk.desc;
  document.getElementById('stk-detail-tier').textContent = stk.tier;
  document.getElementById('stk-detail-status').textContent = stk.unlocked ? 'Unlocked & Active Swag' : 'Locked (Complete focus sprints to earn)';

  modal.classList.add('open');
  SoundSystem.playPop();
}

function closeStickerDetailsModal() {
  const modal = document.getElementById('sticker-details-modal');
  if (modal) modal.classList.remove('open');
}

function equipStickerBadge() {
  closeStickerDetailsModal();
  SoundSystem.playSuccessChime();
  showToast('🎖️ Sticker swag pinned to your campus badge!', 'verified');
}

// ==========================================================================
// Streak Leaderboard (Global & College-Wise)
// ==========================================================================
function renderLeaderboard(tab = AppState.leaderboard.activeTab) {
  AppState.leaderboard.activeTab = tab;
  const tbody = document.getElementById('leaderboard-tbody');
  const globalBtn = document.getElementById('lb-tab-global');
  const collegeBtn = document.getElementById('lb-tab-college');

  if (globalBtn && collegeBtn) {
    if (tab === 'global') {
      globalBtn.className = 'pill-badge pill-badge-coral cursor-pointer';
      collegeBtn.className = 'pill-badge pill-badge-gray cursor-pointer';
    } else {
      globalBtn.className = 'pill-badge pill-badge-gray cursor-pointer';
      collegeBtn.className = 'pill-badge pill-badge-coral cursor-pointer';
    }
  }

  if (!tbody) return;

  const data = AppState.leaderboard[tab] || AppState.leaderboard.global;
  tbody.innerHTML = data.map(item => {
    let rankClass = 'rank-other';
    if (item.rank === 1) rankClass = 'rank-1';
    if (item.rank === 2) rankClass = 'rank-2';
    if (item.rank === 3) rankClass = 'rank-3';

    const isUser = item.isUser || item.name.toLowerCase() === AppState.user.name.toLowerCase();

    return `
      <tr class="${isUser ? 'is-user' : ''}">
        <td class="text-center">
          <div class="rank-badge ${rankClass}">
            ${item.rank === 1 ? '👑 1' : item.rank === 2 ? '🥈 2' : item.rank === 3 ? '🥉 3' : item.rank}
          </div>
        </td>
        <td>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-label-md flex-shrink-0">
              ${item.avatar}
            </div>
            <div>
              <div class="font-label-lg text-on-surface flex items-center gap-1.5">
                <span>${item.name}</span>
                ${isUser ? '<span class="pill-badge pill-badge-coral text-[9px]">YOU</span>' : ''}
              </div>
              <div class="font-body-sm text-on-surface-variant">${item.major}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="college-chip">
            <span class="material-symbols-outlined text-[13px] text-tertiary">school</span>
            <span>${item.college}</span>
          </span>
        </td>
        <td>
          <div class="flex items-center gap-1.5 font-headline-md text-primary text-base">
            <span class="material-symbols-outlined text-[18px]">local_fire_department</span>
            <span>${item.streak} Days</span>
          </div>
        </td>
        <td>
          <span class="font-body-md text-on-surface font-semibold">${item.hours}h Logged</span>
        </td>
        <td class="text-center">
          <span class="pill-badge pill-badge-yellow">${item.swags} 🎖️ Swags</span>
        </td>
      </tr>
    `;
  }).join('');
}

// Global App Initializer
function renderApp() {
  // Update Header Badges
  const streakEl = document.getElementById('header-streak-count');
  const userInitials = document.getElementById('user-initials');
  const userName = document.getElementById('header-user-name');
  const greetingStudentName = document.getElementById('greeting-student-name');

  if (streakEl) streakEl.textContent = `${AppState.user.streakDays} Days Unbroken`;
  if (userInitials) userInitials.textContent = AppState.user.name.slice(0, 2).toUpperCase();
  if (userName) userName.textContent = AppState.user.name;
  if (greetingStudentName) greetingStudentName.textContent = AppState.user.name;

  updateWaterUI();
  renderSchedule();
  renderMyDayPendingHomeworks();
  renderTimetable();
  renderStickers();
  renderLeaderboard();
  renderAssignments();
  syncFocusTimerChecklist();
  updateTimerDisplay();
  renderFocusAnalytics(AppState.analytics.activeTab);
}

// Window Event Listeners (Client-side execution only)
if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
    renderApp();
    setupAmbientControls();

    // Initialize modal due datetime default to tomorrow same hour
    setQuickDueDateTime(24);

    // Periodic refresh for live time-left countdowns every 30 seconds
    setInterval(() => {
      renderMyDayPendingHomeworks();
      if (document.getElementById('view-assignments') && document.getElementById('view-assignments').style.display !== 'none') {
        renderAssignments();
      }
    }, 30000);

    // Route hash check
    const hash = window.location.hash.replace('#', '') || 'schedule';
    switchView(hash);

    // Tab click listeners
    document.querySelectorAll('.nav-tab-btn, .mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.dataset.view;
        if (target) switchView(target);
      });
    });

    // Homework modal
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (openModalBtn) openModalBtn.addEventListener('click', openAddHomeworkModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAddHomeworkModal);

    const hwForm = document.getElementById('newHomeworkForm');
    if (hwForm) hwForm.addEventListener('submit', handleAddHomeworkSubmit);
  });
}
