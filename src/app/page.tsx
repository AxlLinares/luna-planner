"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Flame, Flower2, Star, Sparkles, Plus, ChevronRight, BookOpen } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CozyAnimePlanner() {
  const [view, setView] = useState<'cover' | 'planner'>('cover');
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { if (view === 'planner') fetchTasks(); }, [selectedDate, view]);

  async function fetchTasks() {
    let { data } = await supabase.from('tasks').select('*').eq('date', selectedDate).order('created_at', { ascending: true });
    setTasks(data || []);
  }

  async function addTask() {
    if (!newTask.trim()) return;
    await supabase.from('tasks').insert([{ title: newTask, date: selectedDate }]);
    setNewTask("");
    fetchTasks();
  }

  const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

  return (
    <main className="min-h-screen bg-[#FDF2E9] text-[#7B6651] font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* PANTALLA 1: PORTADA (Estilo Oso de la imagen) */}
        {view === 'cover' && (
          <motion.div 
            key="cover"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ x: -500, opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center p-10 text-center"
          >
            <div className="relative mb-8">
              <div className="w-64 h-64 bg-white rounded-full border-8 border-[#F5E8D3] flex items-center justify-center shadow-inner relative overflow-hidden">
                {/* Aquí puedes poner una imagen de Calcifer o Luna después */}
                <Moon className="w-32 h-32 text-yellow-300 fill-yellow-100 animate-pulse" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#FDF2E9_70%)] opacity-20" />
              </div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 border-2 border-dashed border-[#E5D3B3] rounded-full" />
            </div>
            
            <h1 className="text-3xl font-serif italic text-[#A68B6D] mb-2 tracking-tighter">Luna Digital Planner</h1>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4C3B3] mb-8 italic">Hecho por tu alquimista favorito ✨</p>
            
            <button 
              onClick={() => setView('planner')}
              className="bg-white px-8 py-3 rounded-full shadow-lg border-2 border-[#F5E8D3] hover:scale-105 transition-transform flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
            >
              Abrir Magia <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* PANTALLA 2: EL PLANNER DINÁMICO */}
        {view === 'planner' && (
          <motion.div 
            key="planner"
            initial={{ x: 500, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="min-h-screen p-4 flex flex-col max-w-lg mx-auto"
          >
            {/* Header: Calendario Fijo y Bonito */}
            <header className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-6 mb-4 shadow-sm border-2 border-white flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Flower2 className="w-4 h-4 text-pink-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4C3B3]">Daily Planner</span>
                <Flower2 className="w-4 h-4 text-pink-300" />
              </div>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-2xl font-serif italic bg-transparent outline-none text-[#A68B6D] text-center w-full"
              />
            </header>

            <div className="flex gap-4 flex-1 mb-20">
              {/* Columna Izquierda: Horarios */}
              <div className="w-1/3 bg-white/40 rounded-[2rem] p-4 flex flex-col gap-8 border border-white/50">
                {hours.map(h => (
                  <div key={h} className="text-[10px] font-bold text-[#D4C3B3] border-b border-[#E5D3B3]/30 pb-1">
                    {h} <span className="block h-4 mt-1 border-l-2 border-[#FDF2E9]" />
                  </div>
                ))}
              </div>

              {/* Columna Derecha: Tareas & Stickers */}
              <div className="flex-1 space-y-4">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border-2 border-white min-h-[300px] relative overflow-hidden">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-400" /> Tareas Anya
                  </h3>
                  
                  <div className="space-y-4">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 group">
                        <div className="w-4 h-4 rounded-full border-2 border-pink-200" />
                        <span className="text-sm font-medium text-[#7B6651]">{task.title}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 opacity-50">
                      <Plus className="w-4 h-4" />
                      <input 
                        placeholder="Añadir..." 
                        value={newTask} onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        className="bg-transparent outline-none text-sm w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Sticker Anime Abajo */}
                  <div className="absolute bottom-4 right-4 animate-bounce">
                    <Flame className="w-8 h-8 text-orange-400 fill-orange-100" />
                    <span className="text-[8px] block text-center font-bold">CALCIFER</span>
                  </div>
                </div>

                {/* Notas Boticaria */}
                <div className="bg-[#E9F3ED] rounded-[2rem] p-6 border-2 border-white shadow-sm">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8BA691] mb-2 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Diario
                  </h4>
                  <p className="text-[11px] italic text-[#8BA691]">"Hoy mi pócima de café quedó perfecta. Waku Waku!"</p>
                </div>
              </div>
            </div>

            {/* Navegación Inferior Estilo App */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg px-8 py-4 rounded-full shadow-2xl border border-white flex gap-12 text-[#D4C3B3]">
              <button onClick={() => setView('cover')}><Star className="w-5 h-5 hover:text-pink-300 transition-colors" /></button>
              <button className="text-pink-400"><Sparkles className="w-6 h-6" /></button>
              <button><Moon className="w-5 h-5 hover:text-yellow-400 transition-colors" /></button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}