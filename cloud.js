// ==========================================================================
// Seon Study Room - Cloud Backend & Auth Engine (Supabase Integration)
// Phase 2: Real Cloud Database, User Authentication & Live Cross-Device Sync
// ==========================================================================

const CloudEngine = (function() {
  let client = null;
  let currentUser = null;
  let syncInProgress = false;

  const STORAGE_KEYS = {
    URL: 'seon_supabase_url',
    KEY: 'seon_supabase_key',
    MODE: 'seon_cloud_mode' // 'cloud' | 'local'
  };

  // Default SQL Setup script that users can run in Supabase SQL editor with 1 click
  const SQL_SCHEMA = `-- =======================================================
-- Seon Study Room: Supabase Database Schema & Security
-- Paste into Supabase -> SQL Editor -> Run
-- =======================================================

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  major text default 'Computer Science',
  year text default '3rd Year',
  streak_days integer default 1,
  coins integer default 100,
  water_logged integer default 0,
  water_goal integer default 6,
  companion text default 'both',
  total_study_minutes integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Homework Tasks Table
create table if not exists public.homework (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  course text,
  course_short text,
  description text,
  due_timestamp bigint,
  due_text text,
  status text default 'todo',
  effort text default 'medium',
  duration_minutes integer default 25,
  steps jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Daily Schedule Table
create table if not exists public.schedule (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  category text default 'class',
  time_range text not null,
  location text default 'Campus',
  description text,
  completed boolean default false,
  icon text default 'school',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Focus Session Logs Table
create table if not exists public.focus_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  duration_minutes integer not null,
  subject text default 'General Studies',
  milestones integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.homework enable row level security;
alter table public.schedule enable row level security;
alter table public.focus_logs enable row level security;

-- RLS Policies (Users can only access their own data)
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Public Leaderboard View Policy
create policy "Public leaderboard profiles read" on public.profiles for select using (true);

create policy "Users manage own homework" on public.homework for all using (auth.uid() = user_id);
create policy "Users manage own schedule" on public.schedule for all using (auth.uid() = user_id);
create policy "Users manage own focus_logs" on public.focus_logs for all using (auth.uid() = user_id);
`;

  function isConfigured() {
    const url = localStorage.getItem(STORAGE_KEYS.URL);
    const key = localStorage.getItem(STORAGE_KEYS.KEY);
    return Boolean(url && key && client);
  }

  function getStoredCredentials() {
    return {
      url: localStorage.getItem(STORAGE_KEYS.URL) || '',
      key: localStorage.getItem(STORAGE_KEYS.KEY) || ''
    };
  }

  function init() {
    const { url, key } = getStoredCredentials();
    if (url && key && window.supabase && window.supabase.createClient) {
      try {
        client = window.supabase.createClient(url, key);
        listenAuthChanges();
        checkCurrentSession();
      } catch (e) {
        console.warn('Could not initialize Supabase client:', e);
      }
    }
    updateCloudStatusUI();
  }

  async function connect(url, key) {
    if (!url || !key) {
      throw new Error('Supabase URL and Anon Key are required.');
    }
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error('Supabase client SDK is not loaded. Check internet connection.');
    }

    try {
      const testClient = window.supabase.createClient(url.trim(), key.trim());
      // Test connectivity by checking auth session
      const { data, error } = await testClient.auth.getSession();
      if (error && !error.message.includes('Auth session')) {
        throw error;
      }
      
      client = testClient;
      localStorage.setItem(STORAGE_KEYS.URL, url.trim());
      localStorage.setItem(STORAGE_KEYS.KEY, key.trim());
      localStorage.setItem(STORAGE_KEYS.MODE, 'cloud');

      listenAuthChanges();
      await checkCurrentSession();
      updateCloudStatusUI();
      return true;
    } catch (err) {
      console.error('Connection failed:', err);
      throw err;
    }
  }

  function disconnect() {
    localStorage.removeItem(STORAGE_KEYS.URL);
    localStorage.removeItem(STORAGE_KEYS.KEY);
    localStorage.setItem(STORAGE_KEYS.MODE, 'local');
    client = null;
    currentUser = null;
    updateCloudStatusUI();
  }

  async function checkCurrentSession() {
    if (!client) return;
    try {
      const { data: { session } } = await client.auth.getSession();
      currentUser = session ? session.user : null;
      updateCloudStatusUI();
      if (currentUser) {
        await pullFromCloud();
      }
    } catch (e) {
      console.warn('Error checking session:', e);
    }
  }

  function listenAuthChanges() {
    if (!client) return;
    client.auth.onAuthStateChange(async (event, session) => {
      currentUser = session ? session.user : null;
      updateCloudStatusUI();
      if (event === 'SIGNED_IN' && currentUser) {
        SoundSystem.playFanfare();
        showToast(`Cloud Sanctuary Connected: Welcome ${currentUser.email}!`, 'cloud_done');
        await pullFromCloud();
      } else if (event === 'SIGNED_OUT') {
        showToast('Signed out from Cloud Sanctuary. Local Mode active.', 'cloud_off');
      }
    });
  }

  // --- Real Auth Actions ---
  async function signUp(email, password, name, major = 'Computer Science', year = '3rd Year') {
    if (!client) throw new Error('Cloud Sanctuary not configured. Enter Supabase credentials first.');
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { name, major, year }
      }
    });
    if (error) throw error;
    
    currentUser = data.user;
    if (currentUser) {
      // Upsert initial profile
      await client.from('profiles').upsert({
        id: currentUser.id,
        email: email,
        name: name,
        major: major,
        year: year,
        streak_days: AppState.user.streakDays || 1,
        coins: AppState.user.coins || 100,
        water_logged: AppState.user.waterLogged || 0,
        water_goal: AppState.user.waterGoal || 6,
        companion: AppState.user.companion || 'both'
      });
      // Push local data to cloud
      await pushToCloud();
    }
    return data;
  }

  async function signIn(email, password) {
    if (!client) throw new Error('Cloud Sanctuary not configured. Enter Supabase credentials first.');
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    currentUser = data.user;
    await pullFromCloud();
    return data;
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
    currentUser = null;
    updateCloudStatusUI();
  }

  // --- Real Database Sync Operations ---
  async function pushToCloud() {
    if (!client || !currentUser || syncInProgress) return;
    syncInProgress = true;
    updateCloudStatusUI('syncing');

    try {
      const uid = currentUser.id;

      // 1. Sync User Profile & Stats
      await client.from('profiles').upsert({
        id: uid,
        email: currentUser.email,
        name: AppState.user.name,
        major: AppState.user.major,
        year: AppState.user.year,
        streak_days: AppState.user.streakDays,
        coins: AppState.user.coins,
        water_logged: AppState.user.waterLogged,
        water_goal: AppState.user.waterGoal,
        companion: AppState.user.companion,
        total_study_minutes: Math.floor((AppState.analytics.totalSecondsLogged || 0) / 60),
        updated_at: new Date().toISOString()
      });

      // 2. Sync Homework (Batch upsert)
      if (AppState.assignments && AppState.assignments.length > 0) {
        const hwRows = AppState.assignments.map(asg => ({
          id: asg.id,
          user_id: uid,
          title: asg.title,
          course: asg.course || '',
          course_short: asg.courseShort || '',
          description: asg.description || '',
          due_timestamp: asg.dueTimestamp || Date.now(),
          due_text: asg.dueText || '',
          status: asg.status || 'todo',
          effort: asg.effort || 'medium',
          duration_minutes: asg.durationMinutes || 25,
          steps: asg.steps || [],
          updated_at: new Date().toISOString()
        }));
        await client.from('homework').upsert(hwRows);
      }

      // 3. Sync Daily Schedule
      if (AppState.schedule && AppState.schedule.length > 0) {
        const schRows = AppState.schedule.map(s => ({
          id: s.id,
          user_id: uid,
          title: s.title,
          category: s.category || 'class',
          time_range: s.timeRange || '',
          location: s.location || 'Campus',
          description: s.description || '',
          completed: Boolean(s.completed),
          icon: s.icon || 'school',
          updated_at: new Date().toISOString()
        }));
        await client.from('schedule').upsert(schRows);
      }

      updateCloudStatusUI('synced');
    } catch (err) {
      console.warn('Cloud push sync warning:', err);
      updateCloudStatusUI('error');
    } finally {
      syncInProgress = false;
    }
  }

  async function pullFromCloud() {
    if (!client || !currentUser || syncInProgress) return;
    syncInProgress = true;
    updateCloudStatusUI('syncing');

    try {
      const uid = currentUser.id;

      // 1. Pull Profile
      const { data: profile } = await client.from('profiles').select('*').eq('id', uid).single();
      if (profile) {
        AppState.user.name = profile.name || AppState.user.name;
        AppState.user.email = profile.email || currentUser.email;
        AppState.user.major = profile.major || AppState.user.major;
        AppState.user.year = profile.year || AppState.user.year;
        AppState.user.streakDays = profile.streak_days ?? AppState.user.streakDays;
        AppState.user.coins = profile.coins ?? AppState.user.coins;
        AppState.user.waterLogged = profile.water_logged ?? AppState.user.waterLogged;
        AppState.user.waterGoal = profile.water_goal ?? AppState.user.waterGoal;
        AppState.user.companion = profile.companion || AppState.user.companion;
      }

      // 2. Pull Homework
      const { data: hwList } = await client.from('homework').select('*').eq('user_id', uid);
      if (hwList && hwList.length > 0) {
        AppState.assignments = hwList.map(h => ({
          id: h.id,
          title: h.title,
          course: h.course,
          courseShort: h.course_short,
          description: h.description,
          dueTimestamp: Number(h.due_timestamp),
          dueText: h.due_text,
          status: h.status,
          effort: h.effort,
          durationMinutes: h.duration_minutes,
          estimatedTime: `${h.duration_minutes} min`,
          steps: Array.isArray(h.steps) ? h.steps : []
        }));
      }

      // 3. Pull Schedule
      const { data: schList } = await client.from('schedule').select('*').eq('user_id', uid);
      if (schList && schList.length > 0) {
        AppState.schedule = schList.map(s => ({
          id: s.id,
          title: s.title,
          category: s.category,
          timeRange: s.time_range,
          location: s.location,
          description: s.description,
          completed: s.completed,
          icon: s.icon
        }));
      }

      // Save merged cloud data locally and re-render
      persistState();
      renderApp();
      updateCloudStatusUI('synced');
    } catch (err) {
      console.warn('Cloud pull sync error:', err);
      updateCloudStatusUI('error');
    } finally {
      syncInProgress = false;
    }
  }

  // Record a completed focus session log in the cloud
  async function logFocusSession(durationMinutes, subject = 'General Studies', milestones = 0) {
    if (!client || !currentUser) return;
    try {
      await client.from('focus_logs').insert({
        user_id: currentUser.id,
        duration_minutes: durationMinutes,
        subject: subject,
        milestones: milestones
      });
      // Also update total study minutes on profile
      await pushToCloud();
    } catch (e) {
      console.warn('Failed to log cloud focus session:', e);
    }
  }

  // Live Cross-User Global Leaderboard
  async function fetchLiveLeaderboard() {
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('profiles')
        .select('id, name, major, streak_days, total_study_minutes, coins')
        .order('streak_days', { ascending: false })
        .limit(20);

      if (error || !data) return null;

      return data.map((p, idx) => ({
        rank: idx + 1,
        name: p.name || 'Scholar',
        college: 'Connected Campus',
        major: p.major || 'General Studies',
        streak: p.streak_days || 1,
        hours: Math.round((p.total_study_minutes || 0) / 60 * 10) / 10,
        swags: Math.min(Math.floor((p.coins || 0) / 50), 16),
        avatar: (p.name || 'SC').slice(0, 2).toUpperCase(),
        isUser: currentUser && currentUser.id === p.id
      }));
    } catch (e) {
      return null;
    }
  }

  function updateCloudStatusUI(stateOverride) {
    const pill = document.getElementById('header-cloud-pill');
    const icon = document.getElementById('cloud-pill-icon');
    const text = document.getElementById('cloud-pill-text');
    const deskStatus = document.getElementById('desk-cloud-status-badge');

    if (!pill || !icon || !text) return;

    if (stateOverride === 'syncing') {
      icon.textContent = 'sync';
      icon.className = 'material-symbols-outlined text-[16px] text-tertiary animate-spin';
      text.textContent = 'Syncing...';
      if (deskStatus) {
        deskStatus.className = 'pill-badge pill-badge-yellow text-xs font-bold';
        deskStatus.textContent = 'Syncing with Supabase...';
      }
      return;
    }

    if (isConfigured() && currentUser) {
      icon.textContent = 'cloud_done';
      icon.className = 'material-symbols-outlined text-[16px] text-emerald-600';
      text.textContent = 'Cloud Synced';
      pill.className = 'status-pill cursor-pointer border-emerald-300 bg-emerald-50 text-emerald-900';
      if (deskStatus) {
        deskStatus.className = 'pill-badge pill-badge-coral bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold';
        deskStatus.textContent = `🟢 Connected as ${currentUser.email}`;
      }
    } else if (isConfigured() && !currentUser) {
      icon.textContent = 'cloud_queue';
      icon.className = 'material-symbols-outlined text-[16px] text-amber-600';
      text.textContent = 'Sign In to Sync';
      pill.className = 'status-pill cursor-pointer border-amber-300 bg-amber-50 text-amber-900';
      if (deskStatus) {
        deskStatus.className = 'pill-badge pill-badge-yellow text-xs font-bold';
        deskStatus.textContent = '🟡 Cloud Configured (Ready to Sign In)';
      }
    } else {
      icon.textContent = 'cloud_off';
      icon.className = 'material-symbols-outlined text-[16px] text-secondary';
      text.textContent = 'Local Mode';
      pill.className = 'status-pill cursor-pointer text-secondary';
      if (deskStatus) {
        deskStatus.className = 'pill-badge pill-badge-gray text-xs font-bold';
        deskStatus.textContent = '💾 Offline / Local Storage Mode';
      }
    }
  }

  return {
    init,
    connect,
    disconnect,
    isConfigured,
    getStoredCredentials,
    getCurrentUser: () => currentUser,
    signUp,
    signIn,
    signOut,
    pushToCloud,
    pullFromCloud,
    logFocusSession,
    fetchLiveLeaderboard,
    updateCloudStatusUI,
    getSQLSchema: () => SQL_SCHEMA
  };
})();
