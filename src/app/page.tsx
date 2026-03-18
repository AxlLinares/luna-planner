"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Flame, Flower2, Star, Sparkles, Plus, ChevronRight, BookOpen, Trash2, Heart, Clock } from 'lucide-react';

// --- CONFIG SUPABASE ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UltimateLunaPlanner() {
  // --- ESTADOS ---
  const [view, setView] = useState<'cover' | 'planner'>('cover');
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showInputFor, setShowInputFor] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  
  // Estados Oráculo
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

  const animeQuotes = [
    "🌙 ¡Por el poder del Prisma Lunar! Hoy vas a brillar.",
    "🥜 ¡Waku Waku! Anya dice que lo harás increíble.",
    "🌸 ¡Libérate! Todo saldrá bien, como dice Sakura.",
    "🔥 ¡Mírame! Soy un demonio poderoso. - Calcifer",
    "🧪 Esta pócima dice que hoy es un gran día. - Maomao",
    "✨ Intercambio equivalente: ¡Da amor y recibirás magia!",
    "😏 Heh... Anya sabe que eres la mejor.",
    "🌟 ¡En el nombre de la Luna, hoy conquistarás tus metas!"
  ];

  // --- LÓGICA ---
  useEffect(() => { if (view === 'planner') fetchTasks(); }, [selectedDate, view]);

  async function fetchTasks() {
    let { data } = await supabase.from('tasks').select('*').eq('date', selectedDate);
    setTasks(data || []);
  }

  async function addTask(timeSlot: string) {
    if (!newTaskText.trim()) return;
    await supabase.from('tasks').insert([{ title: newTaskText, date: selectedDate, time_slot: timeSlot }]);
    setNewTaskText("");
    setShowInputFor(null);
    fetchTasks();
  }

  async function toggleTask(id: string, status: boolean) {
    await supabase.from('tasks').update({ is_completed: !status }).eq('id', id);
    fetchTasks();
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id);
    fetchTasks();
  }

  const triggerOracle = () => {
    setCurrentQuote(animeQuotes[Math.floor(Math.random() * animeQuotes.length)]);
    setShowQuote(true);
    setTimeout(() => setShowQuote(false), 4000);
  };

  return (
    <main className="min-h-screen bg-[#FDF2E9] text-[#7B6651] font-sans overflow-x-hidden relative">
      <AnimatePresence mode="wait">
        
        {/* --- 1. PORTADA MAGICAL GIRL --- */}
        {view === 'cover' && (
          <motion.div key="cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ x: -500, opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="relative mb-8">
              <div className="w-64 h-64 bg-white rounded-full border-8 border-[#F5E8D3] flex items-center justify-center shadow-inner overflow-hidden">
                <Moon className="w-32 h-32 text-yellow-300 fill-yellow-100 animate-pulse" />
              </div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border-2 border-dashed border-[#E5D3B3] rounded-full" />
            </div>
            <h1 className="text-4xl font-serif italic text-[#A68B6D] mb-2 tracking-tighter">Luna Planner</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4C3B3] mb-12 italic">Journal of a Modern Alchemist ✨</p>
            <button onClick={() => setView('planner')}
              className="bg-white px-10 py-4 rounded-full shadow-lg border-2 border-[#F5E8D3] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A68B6D]"
            >
              Abrir Magia <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* --- 2. AGENDA COMPLETA (TIMELINE + ANIME) --- */}
        {view === 'planner' && (
          <motion.div key="planner" initial={{ x: 500, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="min-h-screen p-4 max-w-lg mx-auto pb-32"
          >
            {/* Header Calendario Sakura */}
            <header className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 mb-6 shadow-sm border-2 border-white flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 text-pink-300">
                <Flower2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4C3B3]">Selecciona el Hechizo</span>
                <Flower2 className="w-4 h-4" />
              </div>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                className="text-2xl font-serif italic bg-transparent outline-none text-[#A68B6D] text-center w-full" />
            </header>

            {/* TIMELINE CON TAREAS */}
            <div className="bg-white/60 rounded-[3rem] p-6 border-2 border-white shadow-inner mb-6">
              <div className="space-y-2">
                {hours.map((hour) => {
                  const tasksInHour = tasks.filter(t => t.time_slot === hour);
                  return (
                    <div key={hour} className="group relative border-b border-[#E5D3B3]/20 py-4 flex items-start gap-4">
                      <div className="w-12 text-[10px] font-bold text-[#D4C3B3] pt-1 font-mono">{hour}</div>
                      <div className="flex-1">
                        {tasksInHour.map(task => (
                          <motion.div key={task.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center justify-between bg-white/80 p-3 rounded-2xl mb-2 shadow-sm border border-pink-50"
                          >
                            <div className="flex items-center gap-3" onClick={() => toggleTask(task.id, task.is_completed)}>
                              {task.is_completed ? <Star className="w-4 h-4 text-pink-400 fill-pink-400" /> : <Star className="w-4 h-4 text-pink-100" />}
                              <span className={`text-sm font-medium ${task.is_completed ? 'line-through text-gray-300' : 'text-[#7B6651]'}`}>{task.title}</span>
                            </div>
                            <button onClick={() => deleteTask(task.id)}><Trash2 className="w-3 h-3 text-red-100 hover:text-red-300" /></button>
                          </motion.div>
                        ))}
                        {showInputFor === hour ? (
                          <div className="flex gap-2">
                            <input autoFocus value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask(hour)}
                              placeholder="Nueva misión..." className="bg-white/95 p-3 rounded-xl text-sm w-full outline-none ring-2 ring-pink-100" />
                            <button onClick={() => addTask(hour)} className="text-pink-400"><Sparkles className="w-5 h-5" /></button>
                          </div>
                        ) : (
                          <button onClick={() => setShowInputFor(hour)} className="text-[10px] text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 italic">
                            <Plus className="w-3 h-3" /> Añadir recordatorio
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DIARIO DE BOTICARIA (The Apothecary Diaries) */}
            <div className="bg-[#E9F3ED] rounded-[2.5rem] p-8 border-2 border-white shadow-sm mb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><BookOpen className="w-12 h-12" /></div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8BA691] mb-3 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Notas de Boticaria 🧪
              </h4>
              <p className="text-[12px] italic text-[#8BA691] leading-relaxed">
                "Incluso las alquimistas necesitan descansar. Recuerda beber agua y sonreír, el mundo es mejor así."
              </p>
            </div>

            {/* STICKER FLOTANTE DE CALCIFER */}
            <div className="fixed bottom-32 right-8 pointer-events-none flex flex-col items-center">
               <Flame className="w-10 h-10 text-orange-400 fill-orange-100 animate-bounce" />
               <span className="text-[8px] font-bold tracking-widest text-orange-300">CALCIFER</span>
            </div>

            {/* NAV INFERIOR (ESTILO APP CON ORÁCULO) */}
            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl px-12 py-5 rounded-full shadow-2xl border border-white flex gap-16 items-center z-40">
              <button onClick={() => setView('cover')}><Heart className="w-5 h-5 text-[#D4C3B3] fill-current hover:text-pink-300" /></button>
              <button className="bg-pink-400 p-3 rounded-full text-white shadow-lg shadow-pink-200"><Sparkles className="w-6 h-6" /></button>
              <button onClick={triggerOracle} className="relative group">
                <Moon className="w-6 h-6 text-[#D4C3B3] hover:text-yellow-400 transition-all group-active:rotate-12" />
                <div className="absolute -inset-2 bg-yellow-200 blur-xl opacity-0 group-hover:opacity-30 rounded-full" />
              </button>
            </nav>

            {/* POPUP DEL ORÁCULO LUNAR */}
            <AnimatePresence>
              {showQuote && (
                <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
                  className="fixed bottom-36 left-1/2 -translate-x-1/2 z-50 w-72 bg-white/95 backdrop-blur-lg border-2 border-pink-100 p-6 rounded-[2.5rem] shadow-2xl text-center"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-400 text-white text-[8px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">Consejo Lunar</div>
                  <p className="text-sm italic font-serif text-[#A68B6D]">"{currentQuote}"</p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}