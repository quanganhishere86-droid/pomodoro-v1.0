/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Monitor, Coffee, Bell, CheckSquare, Check, Trash2, Globe } from 'lucide-react';
import { motion } from 'motion/react';
// To use an uploaded image, ensure it is in the /src/assets/images folder and import it here:
import frutigerBg from './assets/images/1375142.png';
import emeraldBg from './assets/images/emerald_frutiger_bg_1788966584032.jpg';
import sunsetBg from './assets/images/sunset_dorfic_bg_1788966610792.jpg';

// Timer presets
const PRESETS = [
  { id: 'classic', labelEn: 'Classic (25/5)', labelVi: 'Cơ bản (25/5)', work: 25 * 60, break: 5 * 60 },
  { id: 'deep', labelEn: 'Deep Work (50/10)', labelVi: 'Tập trung sâu (50/10)', work: 50 * 60, break: 10 * 60 },
  { id: 'sprint', labelEn: 'Sprint (15/5)', labelVi: 'Chạy nước rút (15/5)', work: 15 * 60, break: 5 * 60 },
];
const TOTAL_CYCLES = 4; // 4 cycles

// Translations
type Language = 'en' | 'vi';
const TRANSLATIONS = {
  en: {
    inputPlaceholder: 'Write to autotick!',
    session: 'POMODORO SESSION',
    cycles: 'Cycles',
    learn: 'Learn',
    relax: 'Relax',
    playlist: 'Focus Playlist',
    todo: 'To-Do List',
    addTask: 'Add a new task...',
    addBtn: 'Add',
    noTasks: 'No tasks yet. Add one!',
    breakTitle: 'Break Time!',
    breakBody: 'Great job focusing. Time to relax and recharge.',
    doneTitle: 'All Done!',
    doneBody: "You've completed your session!",
    focusTitle: 'Focus Time!',
    focusBody: "Break is over. Let's get back to learning.",
    taskNotFound: "This task isn't in the to-do list.",
    langName: 'Tiếng Việt',
  },
  vi: {
    inputPlaceholder: 'Hãy viết tên môn bạn hoàn thành để autotick!',
    session: 'PHIÊN POMODORO',
    cycles: 'Chu kỳ',
    learn: 'Học',
    relax: 'Nghỉ ngơi',
    playlist: 'Nhạc tập trung',
    todo: 'Danh sách công việc',
    addTask: 'Thêm công việc mới...',
    addBtn: 'Thêm',
    noTasks: 'Chưa có công việc nào. Hãy thêm một cái!',
    breakTitle: 'Giờ nghỉ!',
    breakBody: 'Làm tốt lắm. Đến lúc nghỉ ngơi và nạp lại năng lượng.',
    doneTitle: 'Hoàn thành!',
    doneBody: 'Bạn đã hoàn thành phiên làm việc của mình!',
    focusTitle: 'Đến giờ tập trung!',
    focusBody: 'Đã hết giờ nghỉ. Quay lại làm việc nào.',
    taskNotFound: 'Công việc này không có trong danh sách.',
    langName: 'English',
  }
};

type ThemeType = 'blue' | 'emerald' | 'orange';
const THEMES = {
  blue: {
    container: 'theme-blue',
    text: 'text-blue-900',
    textLight: 'text-blue-800',
    textMuted: 'text-blue-900/50',
    textMutedStrike: 'text-blue-900/40',
    ring: 'focus:ring-blue-300/40',
    placeholder: 'placeholder-blue-900/50',
    bgLight: 'bg-blue-900/20',
    btnActiveBg: 'bg-blue-500',
    btnActiveBorder: 'border-blue-500',
    btnInactiveBorder: 'border-blue-400',
    btnIconHover: 'text-blue-600',
    timerLearnColor: '#2989d8',
    timerRelaxColor: '#34d399',
  },
  emerald: {
    container: 'theme-emerald',
    text: 'text-emerald-900',
    textLight: 'text-emerald-800',
    textMuted: 'text-emerald-900/50',
    textMutedStrike: 'text-emerald-900/40',
    ring: 'focus:ring-emerald-300/40',
    placeholder: 'placeholder-emerald-900/50',
    bgLight: 'bg-emerald-900/20',
    btnActiveBg: 'bg-emerald-500',
    btnActiveBorder: 'border-emerald-500',
    btnInactiveBorder: 'border-emerald-400',
    btnIconHover: 'text-emerald-600',
    timerLearnColor: '#059669',
    timerRelaxColor: '#14b8a6',
  },
  orange: {
    container: 'theme-orange',
    text: 'text-orange-900',
    textLight: 'text-orange-800',
    textMuted: 'text-orange-900/50',
    textMutedStrike: 'text-orange-900/40',
    ring: 'focus:ring-orange-300/40',
    placeholder: 'placeholder-orange-900/50',
    bgLight: 'bg-orange-900/20',
    btnActiveBg: 'bg-orange-500',
    btnActiveBorder: 'border-orange-500',
    btnInactiveBorder: 'border-orange-400',
    btnIconHover: 'text-orange-600',
    timerLearnColor: '#ea580c',
    timerRelaxColor: '#f59e0b',
  },
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const TimerRing = ({ time, maxTime, color, isActiveMode }: { time: number, maxTime: number, color: string, isActiveMode: boolean }) => {
  // If it's not the active mode, we want the ring to look full (0 progress).
  const percentage = isActiveMode ? ((maxTime - time) / maxTime) * 100 : 0;
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
      <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r="45" fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray="283"
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      {/* Inner Glossy Sphere */}
      <div className="absolute inset-2 rounded-full shadow-[inset_0_4px_12px_rgba(255,255,255,1),_inset_0_-8px_16px_var(--theme-glass-shadow)] bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center">
        <span className="timer-font text-5xl sm:text-6xl text-slate-800 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)] tracking-tight">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('blue');
  const [lang, setLang] = useState<Language>('en');
  
  const t = THEMES[currentTheme];
  const l = TRANSLATIONS[lang];

  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [workTime, setWorkTime] = useState(PRESETS[0].work);
  const [breakTime, setBreakTime] = useState(PRESETS[0].break);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [taskLabel, setTaskLabel] = useState('');
  const [todos, setTodos] = useState<{id: string, text: string, completed: boolean}[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Sound effect for when the timer ends
  const endAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A pleasant chime/bell sound for when a timer completes
    const endAudio = new Audio("https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg");
    endAudio.volume = 0.5;
    endAudioRef.current = endAudio;
  }, []);

  const playClickSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {
      console.log('Audio play prevented:', e);
    }
  };

  const playEndSound = () => {
    if (endAudioRef.current) {
      endAudioRef.current.currentTime = 0;
      endAudioRef.current.play().catch(e => console.log('Audio play prevented:', e));
    }
  };

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const action = isActive ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: action, args: [] }),
        '*'
      );
    }
  }, [isActive]);

  // Request Notification permission
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        } else {
          alert("Please allow notifications in your browser settings to get alerts when the timer ends!");
        }
      });
    }
  };

  const notifyUser = (title: string, body: string) => {
    playEndSound();
    
    // Fallback to standard alert if notifications are disabled/denied
    if (!notificationsEnabled || Notification.permission !== 'granted') {
      // Use setTimeout to allow state to update before blocking the UI
      setTimeout(() => alert(`${title}\n\n${body}`), 100);
      return;
    }

    try {
      new Notification(title, { body, icon: '/favicon.ico' });
    } catch (e) {
      console.log("Browser blocked notification, falling back to alert", e);
      setTimeout(() => alert(`${title}\n\n${body}`), 100);
    }
  };

  useEffect(() => {
    let interval: number | null = null;

    if (isActive) {
      interval = window.setInterval(() => {
        if (mode === 'work') {
          setWorkTime((w) => {
            if (w <= 1) {
              setMode('break');
              setBreakTime(activePreset.break);
              notifyUser(l.breakTitle, l.breakBody);
              return activePreset.work; // visually reset for next round
            }
            return w - 1;
          });
        } else {
          setBreakTime((b) => {
            if (b <= 1) {
              setCyclesCompleted((c) => {
                const next = c + 1;
                if (next >= TOTAL_CYCLES) {
                  setIsActive(false);
                  notifyUser(l.doneTitle, l.doneBody);
                } else {
                  setMode('work');
                  notifyUser(l.focusTitle, l.focusBody);
                }
                return next;
              });
              return activePreset.break; // visually reset for next round
            }
            return b - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isActive, mode, notificationsEnabled, activePreset]);

  const toggleTimer = () => {
    playClickSound();
    setIsActive(!isActive);
    if (!isActive && !notificationsEnabled) {
      requestNotificationPermission();
    }
  };

  const resetTimer = () => {
    playClickSound();
    setIsActive(false);
    setMode('work');
    setWorkTime(activePreset.work);
    setBreakTime(activePreset.break);
    setCyclesCompleted(0);
  };

  const changePreset = (preset: typeof PRESETS[0]) => {
    playClickSound();
    setActivePreset(preset);
    setIsActive(false);
    setMode('work');
    setWorkTime(preset.work);
    setBreakTime(preset.break);
  };

  const handleMainInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      playClickSound();
      e.currentTarget.blur();
      
      const trimmedLabel = taskLabel.trim();
      if (trimmedLabel !== '') {
        const existingTodoIndex = todos.findIndex(t => t.text.trim().toLowerCase() === trimmedLabel.toLowerCase());
        
        if (existingTodoIndex !== -1) {
          const newTodos = [...todos];
          newTodos[existingTodoIndex] = { ...newTodos[existingTodoIndex], completed: true };
          setTodos(newTodos);
          setTaskLabel('');
        } else {
          alert(l.taskNotFound || "Task not found in the to-do list!");
        }
      }
    }
  };

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      playClickSound();
      setTodos([{ id: Date.now().toString(), text: newTodo.trim(), completed: false }, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    playClickSound();
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    playClickSound();
    setTodos(todos.filter(t => t.id !== id));
  };

  // Background bubbles generator
  const bubbles = Array.from({ length: 15 }).map((_, i) => {
    const size = Math.random() * 60 + 20;
    return (
      <div
        key={i}
        className="bubble"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          animationDuration: `${Math.random() * 4 + 4}s`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    );
  });

  return (
    <div className={`${t.container} min-h-screen w-full relative overflow-x-hidden p-4 sm:p-6 flex flex-col items-center py-10 text-gray-800`}>
      {/* Frutiger Aero Wallpaper */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${currentTheme === 'emerald' ? emeraldBg : currentTheme === 'orange' ? sunsetBg : frutigerBg})`,
        }}
      />

      {/* Decorative Bubbles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {bubbles}
      </div>

      {/* Theme & Language Selectors */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-end gap-2 z-50">
        <div className="aero-panel px-3 py-2 rounded-full flex gap-2">
          {(['blue', 'emerald', 'orange'] as ThemeType[]).map((theme) => (
            <button
              key={theme}
              onClick={() => setCurrentTheme(theme)}
              className={`w-6 h-6 rounded-full border shadow-inner transition-transform active:scale-90 ${currentTheme === theme ? 'scale-110 border-white ring-2 ring-white/50' : 'border-black/10 hover:scale-105'}`}
              style={{
                background: theme === 'blue' ? '#2989d8' : theme === 'emerald' ? '#10b981' : '#f59e0b'
              }}
              aria-label={`Switch to ${theme} theme`}
              title={theme.charAt(0).toUpperCase() + theme.slice(1) + " Theme"}
            />
          ))}
        </div>
        <button
          onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
          className="aero-btn px-4 py-1.5 rounded-full flex items-center gap-1.5"
          title={l.langName}
        >
          <Globe size={14} className={t.text} />
          <span className={`text-xs font-bold ${t.text} uppercase tracking-wider`}>{lang}</span>
        </button>
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center space-y-8 sm:space-y-12">
        
        {/* Header & Cycles Info */}
        <div className="flex flex-col items-center space-y-4 w-full">
          {/* Preset Selector */}
          <div className="aero-inset p-1.5 rounded-full flex space-x-2 mb-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => changePreset(preset)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
                  activePreset.id === preset.id 
                    ? `aero-btn-primary shadow-md` 
                    : `${t.text} hover:bg-white/40`
                }`}
              >
                {lang === 'en' ? preset.labelEn : preset.labelVi}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={taskLabel}
            onChange={(e) => setTaskLabel(e.target.value)}
            onKeyDown={handleMainInputKeyDown}
            placeholder={l.inputPlaceholder}
            className={`aero-inset w-full sm:w-[480px] px-6 py-4 rounded-full text-center text-lg sm:text-xl font-bold ${t.text} ${t.placeholder} focus:outline-none focus:ring-4 ${t.ring} transition-all`}
          />
          <div className="aero-panel px-6 py-2.5 rounded-full flex items-center space-x-4 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
            <span className={`${t.text} font-bold text-sm sm:text-lg tracking-wide`}>{l.session}</span>
            <div className={`w-px h-6 bg-black/10`}></div>
            <div className={`flex items-center space-x-1 ${t.textLight}`}>
              <span className="font-black text-xl">{cyclesCompleted}</span>
              <span className="opacity-60 text-sm">/ {TOTAL_CYCLES}</span>
              <span className="ml-1 text-xs sm:text-sm uppercase tracking-wider font-semibold opacity-80">{l.cycles}</span>
            </div>
          </div>
        </div>

        {/* Main Central Timer Dashboard */}
        <div className="aero-panel w-full max-w-2xl mx-auto flex flex-col items-center relative overflow-hidden rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          {/* Subtle glossy overlay on the dashboard itself */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[40px]"></div>

          {/* Mode Tabs / Indicators */}
          <div className="aero-inset p-1.5 rounded-full mb-8 flex relative z-10">
             <div className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all duration-300 ${mode === 'work' ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-slate-800' : 'text-slate-700/60 opacity-80'}`}>
                <Monitor size={18} /> {l.learn}
             </div>
             <div className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all duration-300 ${mode === 'break' ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] text-slate-800' : 'text-slate-700/60 opacity-80'}`}>
                <Coffee size={18} /> {l.relax}
             </div>
          </div>

          <div className="relative z-10">
            <TimerRing 
              time={mode === 'work' ? workTime : breakTime} 
              maxTime={mode === 'work' ? activePreset.work : activePreset.break} 
              color={mode === 'work' ? t.timerLearnColor : t.timerRelaxColor} 
              isActiveMode={true} 
            />
          </div>

          {/* Integrated Hardware Controls */}
          <div className="flex items-center space-x-8 mt-10 relative z-10">
            <button
              onClick={resetTimer}
              className={`aero-btn w-14 h-14 rounded-full flex items-center justify-center ${t.text}`}
              aria-label="Reset Timer"
            >
              <RotateCcw size={22} />
            </button>
            <button
              onClick={toggleTimer}
              className={`aero-btn-primary w-24 h-24 rounded-full flex items-center justify-center`}
              aria-label={isActive ? "Pause" : "Play"}
            >
              {isActive ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
            </button>
            <button
              onClick={requestNotificationPermission}
              className={`aero-btn w-14 h-14 rounded-full flex items-center justify-center ${notificationsEnabled ? t.btnIconHover : t.text}`}
              title="Enable Notifications"
            >
              <Bell size={22} fill={notificationsEnabled ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
          {/* Todo List */}
          <div className="aero-panel p-6 rounded-[24px] flex flex-col relative overflow-hidden h-[350px] flex-1">
             <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[24px]"></div>
             <h3 className={`text-xl font-bold ${t.text} mb-4 flex items-center gap-2 relative z-10 drop-shadow-sm`}>
               <CheckSquare size={22} className="opacity-80" />
               {l.todo}
             </h3>
             <div className="flex gap-2 mb-4 relative z-10">
               <input 
                 type="text" 
                 value={newTodo} 
                 onChange={e => setNewTodo(e.target.value)}
                 onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
                 placeholder={l.addTask}
                 className={`aero-inset flex-1 px-4 py-2 ${t.text} ${t.placeholder} focus:outline-none focus:ring-2 ${t.ring} text-sm font-semibold`}
               />
               <button onClick={addTodo} className={`aero-btn px-5 py-2 rounded-lg ${t.text} font-bold text-sm`}>{l.addBtn}</button>
             </div>
             <div className="flex flex-col space-y-2 overflow-y-auto pr-2 flex-1 relative z-10">
               {todos.map(todo => (
                 <div key={todo.id} className="group flex items-center gap-3 p-3 aero-panel !bg-white/30 rounded-xl shrink-0 transition-transform hover:-translate-y-0.5 hover:shadow-md">
                   <button onClick={() => toggleTodo(todo.id)} className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center border transition-all ${todo.completed ? `bg-emerald-500 border-emerald-600 shadow-inner text-white` : `bg-white/50 border-white shadow-sm`}`}>
                     {todo.completed && <Check size={16} strokeWidth={4} />}
                   </button>
                   <span className={`flex-1 text-sm font-semibold truncate ${todo.completed ? `line-through opacity-50` : t.text}`} title={todo.text}>
                     {todo.text}
                   </span>
                   <button onClick={() => deleteTodo(todo.id)} className={`transition-opacity opacity-0 group-hover:opacity-100 shrink-0 text-red-500/70 hover:text-red-600`}>
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
               {todos.length === 0 && (
                 <p className={`${t.textMuted} text-center italic py-4 text-sm font-medium m-auto`}>{l.noTasks}</p>
               )}
             </div>
          </div>

          {/* Music Player */}
          <div className="aero-panel rounded-[24px] flex flex-col relative overflow-hidden lg:w-[380px] shrink-0 border-t-white/80">
            {/* Player Top Bar */}
            <div className="bg-gradient-to-b from-white/70 to-white/30 border-b border-white/40 px-4 py-2 flex items-center justify-between shadow-sm relative z-10">
              <div className="flex items-center gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner border border-red-500/30"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-inner border border-yellow-500/30"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400 shadow-inner border border-green-500/30"></div>
                 </div>
              </div>
              <h3 className="text-xs font-bold tracking-widest text-slate-600 uppercase drop-shadow-sm">{l.playlist}</h3>
              <div className="w-10"></div> {/* spacer to center title */}
            </div>
            
            {/* Player Body */}
            <div className="p-4 flex-1 flex flex-col bg-slate-900/10 shadow-inner relative">
               <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"></div>
               <div className="w-full aspect-[16/9] rounded-lg overflow-hidden relative z-10 shadow-[0_4px_12px_rgba(0,0,0,0.3)] bg-black border border-white/20">
                 <iframe
                   ref={iframeRef}
                   src="https://www.youtube.com/embed/Cz2YCRmDOFk?list=PLpAq7EdVNuyvS1o92EEvdHtdeXAUJR4CJ&enablejsapi=1&autoplay=0"
                   title="YouTube video player"
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                   className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                 ></iframe>
               </div>
               
               {/* Decorative Playback Bar */}
               <div className="mt-4 flex flex-col gap-2 relative z-10">
                 <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden border border-white/10 shadow-inner">
                   <div className="h-full w-1/3 bg-blue-400 rounded-full"></div>
                 </div>
                 <div className="flex justify-between text-[10px] font-bold text-slate-700/60 font-mono">
                   <span>00:00</span>
                   <span>-LIVE</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
