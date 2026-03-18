"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Flame, Flower2, Star, Sparkles, Plus, ChevronRight, BookOpen, Trash2, Heart } from 'lucide-react';

// --- 1. CONFIGURACIÓN DE SUPABASE ---
// Usamos un fallback ('||') para que Vercel no de error durante el build si no detecta las llaves un segundo.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LunaPlannerFinal() {
  // --- 2. ESTADOS (VARIABLES DE LA APP) ---
  const [view, setView] = useState<'cover' | 'planner'>('cover'); // Controla si vemos la portada o la agenda
  const [tasks, setTasks] = useState<any[]>([]);                 // Lista de tareas de Supabase
  const [newTask, setNewTask] = useState("");                    // Texto de la nueva tarea
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Fecha elegida
  
  // Estados para el Oráculo Lunar
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  // --- 3. LÓGICA DE DATOS (FUNCIONES) ---
  
  // Cargar tareas cada vez que cambia la fecha o entramos a la agenda
  useEffect(() => { 
    if (view === 'planner') fetchTasks(); 
  }, [selectedDate, view]);

  async function fetchTasks() {
    let { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('date', selectedDate)
      .order('created_at', { ascending: true });
    setTasks(data || []);
  }

  async function addTask() {
    if (!newTask.trim()) return;
    await supabase.from('tasks').insert([{ title: newTask, date: selectedDate }]);
    setNewTask("");
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

  // Función del Oráculo Lunar ✨
  const animeQuotes = [
    "🌙 ¡Por el poder del Prisma Lunar! Hoy vas a brillar.",
    "🥜 ¡Waku Waku! Anya dice que lo harás increíble hoy.",
    "🌸 ¡Libérate! Todo saldrá bien, como dice Sakura.",
    "🔥 ¡Mírame! Soy un demonio poderoso y tú también. - Calcifer",
    "🧪 Esta pócima dice que hoy es un gran día para ti. - Maomao",
    "✨ Intercambio equivalente: ¡da lo mejor y recibirás lo mejor!",
    "😏 Heh... Anya sabe que eres la mejor.",
    "🌿 Una boticaria siempre mantiene la calma. ¡Tú puedes!",
    "🌟 ¡En el nombre de la Luna, hoy conquistarás tus metas!"
  ];

  const triggerOracle = () => {
    const randomQuote = animeQuotes[Math.floor(Math.random() * animeQuotes.length)];
    setCurrentQuote(randomQuote);
    setShowQuote(true);
    setTimeout(() => setShowQuote(false), 4000); // Se oculta tras 4 segundos
  };

  // --- 4. DISEÑO (FRONTEND) ---
  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

  return (
    <main className="min-h-screen bg-[#FDF2E9] text-[#7B6651] font-sans overflow-x-hidden relative">
      
      {/* ANIMACIÓN DE TRANSICIÓN ENTRE PANTALLAS */}
      <AnimatePresence mode="wait">
        
        {/* --- PANTALLA A: LA PORTADA --- */}
        {view === 'cover' && (
          <motion.div 
            key="cover"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ x: -500, opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="relative mb-8">
              <div className="w-64 h-64 bg-white rounded-full border-8 border-[#F5E8D3] flex items-center justify-center shadow-inner relative overflow-hidden">
                <Moon className="w-32 h-32 text-yellow-300 fill-yellow-100 animate-pulse" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#FDF2E9_70%)] opacity-20" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
                className="absolute -inset-4 border-2 border-dashed border-[#E5D3B3] rounded-full" 
              />
            </div>
            
            <h1 className="text-4xl font-serif italic text-[#A68B6D] mb-2 tracking-tighter">Luna Planner</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4C3B3] mb-12 italic">The Alchemist's Digital Journal ✨</p>
            
            <button 
              onClick={() => setView('planner')}
              className="bg-white px-10 py-4 rounded-full shadow-lg border-2 border-[#F5E8D3] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A68B6D]"
            >
              Abrir Magia <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* --- PANTALLA B: LA AGENDA --- */}
        {view === 'planner' && (
          <motion.div 
            key="planner"
            initial={{ x: 500, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="min-h-screen p-4 flex flex-col max-w-lg mx-auto pb-32"
          >
            {/* Header: Calendario Aesthetic */}
            <header className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 mb-6 shadow-sm border-2 border-white flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Flower2 className="w-4 h-4 text-pink-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4C3B3]">Planificando...</span>
                <Flower2 className="w-4 h-4 text-pink-300" />
              </div>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-2xl font-serif italic bg-transparent outline-none text-[#A68B6D] text-center w-full cursor-pointer"
              />
            </header>

            <div className="flex gap-4 flex-1">
              {/* Columna Izquierda: Horarios (Decorativo/Guía) */}
              <div className="w-16 bg-white/40 rounded-[2rem] py-8 flex flex-col gap-12 border border-white/50 items-center">
                {hours.map(h => (
                  <div key={h} className="text-[9px] font-bold text-[#D4C3B3] vertical-text">
                    {h}
                  </div>
                ))}
              </div>

              {/* Columna Derecha: Tareas & Stickers */}
              <div className="flex-1 space-y-4">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border-2 border-white min-h-[400px] relative overflow-hidden">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-[#A68B6D]">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Tareas de hoy
                  </h3>
                  
                  {/* Lista de Tareas con Animación */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {tasks.map(task => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                          key={task.id} 
                          className="flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3 flex-1" onClick={() => toggleTask(task.id, task.is_completed)}>
                            <div className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${task.is_completed ? 'bg-pink-100 border-pink-200' : 'border-pink-50'}`}>
                              {task.is_completed && <Star className="w-3 h-3 text-pink-400 fill-pink-400" />}
                            </div>
                            <span className={`text-sm ${task.is_completed ? 'line-through text-gray-300' : 'text-[#7B6651] font-medium'}`}>
                              {task.title}
                            </span>
                          </div>
                          <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3 text-red-200 hover:text-red-400" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Input para nueva tarea */}
                    <div className="flex items-center gap-3 pt-4 border-t border-pink-50/50 mt-4">
                      <Plus className="w-4 h-4 text-pink-200" />
                      <input 
                        placeholder="Nueva aventura..." 
                        value={newTask} 
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        className="bg-transparent outline-none text-sm w-full placeholder:text-gray-200"
                      />
                      <button onClick={addTask} className="text-pink-300 hover:text-pink-500">
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Sticker de Calcifer (Decoración) */}
                  <div className="absolute bottom-6 right-6 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
                    <Flame className="w-8 h-8 text-orange-400 fill-orange-100 animate-bounce" />
                    <span className="text-[7px] font-bold tracking-tighter">CALCIFER</span>
                  </div>
                </div>

                {/* Diario Estilo Boticaria (The Apothecary Diaries) */}
                <div className="bg-[#E9F3ED] rounded-[2rem] p-6 border-2 border-white shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><Flower2 /></div>
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-[#8BA691] mb-2 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Notas de Boticaria
                  </h4>
                  <p className="text-[11px] italic text-[#8BA691] leading-relaxed">
                    "Incluso las alquimistas necesitan descansar. No olvides beber agua y sonreír."
                  </p>
                </div>
              </div>
            </div>

            {/* --- NAVEGACIÓN INFERIOR (ESTILO APP) --- */}
            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl px-10 py-5 rounded-full shadow-2xl border border-white flex gap-16 items-center z-40">
              {/* Botón Volver a Portada */}
              <button onClick={() => setView('cover')} className="text-[#D4C3B3] hover:text-pink-300 transition-all">
                <Heart className="w-5 h-5 fill-current" />
              </button>
              
              {/* Botón Central Mágico */}
              <button onClick={addTask} className="bg-pink-400 p-3 rounded-full text-white shadow-lg shadow-pink-200 active:scale-90 transition-all">
                <Sparkles className="w-6 h-6" />
              </button>
              
              {/* EL ORÁCULO LUNAR ✨ */}
              <button onClick={triggerOracle} className="relative group">
                <Moon className="w-6 h-6 text-[#D4C3B3] hover:text-yellow-400 transition-all group-active:rotate-12" />
                <div className="absolute -inset-2 bg-yellow-200 blur-xl opacity-0 group-hover:opacity-30 transition-opacity rounded-full" />
              </button>
            </nav>

            {/* POPUP DEL ORÁCULO LUNAR */}
            <AnimatePresence>
              {showQuote && (
                <motion.div 
                  initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
                  className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 w-72 bg-white/95 backdrop-blur-lg border-2 border-pink-100 p-6 rounded-[2.5rem] shadow-2xl text-center"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-400 text-white text-[8px] px-3 py-1 rounded-full font-bold uppercase tracking-[0.2em]">
                    Consejo Lunar
                  </div>
                  <p className="text-sm italic font-serif text-[#A68B6D] leading-relaxed">
                    "{currentQuote}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}