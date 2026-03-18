"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Flame, Flower2, Star, Sparkles, Plus, ChevronRight, BookOpen, Trash2, Clock } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LunaPlannerTimeline() {
  const [view, setView] = useState<'cover' | 'planner'>('cover');
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showInputFor, setShowInputFor] = useState<string | null>(null); // Controla qué hora estamos editando
  const [newTaskText, setNewTaskText] = useState("");

  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

  useEffect(() => { if (view === 'planner') fetchTasks(); }, [selectedDate, view]);

  async function fetchTasks() {
    let { data } = await supabase.from('tasks').select('*').eq('date', selectedDate);
    setTasks(data || []);
  }

  async function addTask(timeSlot: string) {
    if (!newTaskText.trim()) return;
    await supabase.from('tasks').insert([{ 
      title: newTaskText, 
      date: selectedDate, 
      time_slot: timeSlot 
    }]);
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

  return (
    <main className="min-h-screen bg-[#FDF2E9] text-[#7B6651] font-sans overflow-x-hidden">
      <AnimatePresence mode="wait">
        
        {/* --- PANTALLA COVER --- */}
        {view === 'cover' && (
          <motion.div key="cover" exit={{ x: -500, opacity: 0 }} className="h-screen flex flex-col items-center justify-center p-10 text-center">
             <Moon className="w-32 h-32 text-yellow-300 fill-yellow-100 animate-pulse mb-8" />
             <h1 className="text-4xl font-serif italic text-[#A68B6D] mb-2">Luna Planner</h1>
             <button onClick={() => setView('planner')} className="bg-white px-10 py-4 rounded-full shadow-lg border-2 border-[#F5E8D3] text-xs font-bold uppercase tracking-widest text-[#A68B6D]">
               Empezar el día ✨
             </button>
          </motion.div>
        )}

        {/* --- PANTALLA PLANNER CON TIMELINE --- */}
        {view === 'planner' && (
          <motion.div key="planner" initial={{ x: 500, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="min-h-screen p-4 max-w-lg mx-auto pb-20">
            
            {/* Header Calendario */}
            <header className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 mb-6 shadow-sm border-2 border-white text-center">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="text-2xl font-serif italic bg-transparent outline-none text-[#A68B6D] cursor-pointer" />
            </header>

            {/* TIMELINE (ESTILO LA IMAGEN QUE PASASTE) */}
            <div className="bg-white/60 rounded-[3rem] p-6 border-2 border-white shadow-inner">
              <div className="space-y-0">
                {hours.map((hour) => {
                  const tasksInHour = tasks.filter(t => t.time_slot === hour);
                  
                  return (
                    <div key={hour} className="group relative border-b border-[#E5D3B3]/20 py-4 flex items-start gap-4">
                      {/* Lado Izquierdo: La Hora */}
                      <div className="w-12 text-[10px] font-bold text-[#D4C3B3] pt-1">
                        {hour}
                      </div>

                      {/* Lado Derecho: Las Tareas o el Input */}
                      <div className="flex-1 min-h-[40px]">
                        {tasksInHour.map(task => (
                          <motion.div 
                            key={task.id} 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex items-center justify-between bg-white/80 p-2 rounded-xl mb-2 shadow-sm border border-pink-50"
                          >
                            <div className="flex items-center gap-2" onClick={() => toggleTask(task.id, task.is_completed)}>
                              <Star className={`w-3 h-3 ${task.is_completed ? 'text-pink-400 fill-pink-400' : 'text-pink-100'}`} />
                              <span className={`text-sm ${task.is_completed ? 'line-through text-gray-300' : 'text-[#7B6651]'}`}>{task.title}</span>
                            </div>
                            <button onClick={() => deleteTask(task.id)}><Trash2 className="w-3 h-3 text-red-100 hover:text-red-300" /></button>
                          </motion.div>
                        ))}

                        {/* Botón para añadir en esta hora específica */}
                        {showInputFor === hour ? (
                          <div className="flex gap-2">
                            <input 
                              autoFocus
                              value={newTaskText}
                              onChange={(e) => setNewTaskText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && addTask(hour)}
                              placeholder="Escribe el recordatorio..."
                              className="bg-white/90 p-2 rounded-xl text-sm w-full outline-none ring-2 ring-pink-100"
                            />
                            <button onClick={() => addTask(hour)} className="text-pink-400"><Sparkles className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setShowInputFor(hour)}
                            className="text-[10px] text-pink-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 italic"
                          >
                            <Plus className="w-3 h-3" /> Añadir a las {hour}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticker Flotante de Calcifer */}
            <div className="fixed bottom-24 right-6 pointer-events-none">
               <Flame className="w-10 h-10 text-orange-400 fill-orange-100 animate-bounce opacity-60" />
            </div>

            {/* Nav Inferior */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg px-10 py-4 rounded-full shadow-2xl border border-white flex gap-12 items-center">
              <button onClick={() => setView('cover')}><BookOpen className="w-5 h-5 text-[#D4C3B3]" /></button>
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-400 shadow-inner">
                <Clock className="w-5 h-5" />
              </div>
              <button><Moon className="w-5 h-5 text-[#D4C3B3]" /></button>
            </nav>

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}