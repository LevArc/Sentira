import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Calendar as CalendarIcon, CheckSquare, ListTodo } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    task_date: string;
    start_time: string;
    end_time: string;
    is_completed: boolean;
}

const Calendar: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const getTodayDateString = () => {
        return new Date().toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const today = getTodayDateString();
                const response = await api.get(`/tasks/?date=${today}`);
                setTasks(response.data);
            } catch (error) {
                console.error("Failed to fetch tasks.", error);
            } finally {
                setIsLoadingTasks(false);
            }
        };

        fetchTasks();
    }, []);

    const toggleTask = async (id: number, currentStatus: boolean) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));

        try {
            await api.patch(`/tasks/${id}/`, { is_completed: !currentStatus });
        } catch (error) {
            console.error("Failed to update task.");
            setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: currentStatus } : t));
        }
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;

        setIsAdding(true);
        try {
            const today = getTodayDateString();
            // Matches POST /tasks/
            const response = await api.post('/tasks/', {
                title: newTaskTitle,
                task_date: today,
                start_time: startTime || "00:00:00", 
                end_time: endTime || "23:59:00"      
            });

            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
            setStartTime('');
            setEndTime('');
        } catch (error) {
            console.error("Failed to add task.");
        } finally {
            setIsAdding(false);
        }
    };

    const completedTasks = tasks.filter(t => t.is_completed).length;
    const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    const sortedTasks = [...tasks].sort((a, b) =>
        (a.start_time || "").localeCompare(b.start_time || "")
    );
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const calendarDays = [
        26, 27, 28, 29, 30, 31, 1,
        2, 3, 4, 5, 6, 7, 8,
        9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22,
        23, 24, 25, 26, 27, 28, 29,
        30, 31, 1, 2, 3, 4, 5
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <Navbar />

            <div className="max-w-4xl mx-auto mt-8 px-4">

                <div className="bg-[#9bb2ca] rounded-xl p-8 shadow-sm mb-6 transition-all duration-500">
                    <h1 className="text-3xl font-bold text-[#1f3a52] mb-4">Today's Task</h1>

                    <div className="w-full bg-white/40 rounded-full h-6 mb-6 overflow-hidden">
                        <div
                            className="bg-[#4a9f87] h-6 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>

                    {isLoadingTasks ? (
                        <div className="bg-white/50 rounded-lg p-6 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f3a52]"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="bg-white/60 rounded-lg p-8 border-2 border-dashed border-white flex flex-col items-center justify-center text-center">
                            <ListTodo className="w-12 h-12 text-[#1f3a52] opacity-50 mb-3" />
                            <p className="text-[#1f3a52] font-semibold text-lg">Your day is entirely clear!</p>
                            <p className="text-[#1f3a52]/70 text-sm">Use the form below to schedule your first task.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg p-2 space-y-1">
                            {sortedTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 relative">
                                    <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#2a4563] rounded-r-md"></div>
                                    <div className="pl-4">
                                        <h3 className={`font-bold text-lg transition-colors ${task.is_completed ? 'text-slate-400 line-through' : 'text-[#1f3a52]'}`}>
                                            {task.title}
                                        </h3>
                                        <p className="text-sm text-[#8ba3bd] font-medium">
                                            {task.start_time.substring(0, 5)} {task.end_time ? `- ${task.end_time.substring(0, 5)}` : ''}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleTask(task.id, task.is_completed)}
                                        className="text-[#2a4563] hover:scale-110 transition-transform"
                                    >
                                        {task.is_completed ? (
                                            <CheckSquare className="w-8 h-8 text-[#2a4563]" />
                                        ) : (
                                            <div className="w-8 h-8 rounded bg-[#e5f0f9] border border-[#9bb2ca]/30"></div>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative">
                        <CalendarIcon className="absolute top-8 right-8 w-6 h-6 text-[#1f3a52]" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Add Task</h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Add Task Title"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="w-full bg-[#e5f0f9] text-[#2a4563] placeholder-[#8ba3bd] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4b749f]"
                            />

                            <div className="flex space-x-4">
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="flex-1 bg-[#e5f0f9] text-[#2a4563] placeholder-[#8ba3bd] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4b749f]"
                                />
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="flex-1 bg-[#e5f0f9] text-[#2a4563] placeholder-[#8ba3bd] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4b749f]"
                                />
                            </div>

                            <button
                                onClick={handleAddTask}
                                disabled={isAdding || !newTaskTitle.trim()}
                                className="w-full mt-4 bg-[#2a4563] hover:bg-[#1f3a52] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isAdding ? 'Adding...' : 'Add New Task'}
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="grid grid-cols-7 gap-1 mb-4 text-center">
                            {weekDays.map((day, i) => (
                                <div key={i} className="text-xs font-bold text-slate-800">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-sm">
                            {calendarDays.map((day, idx) => {
                                const isFaded = idx < 6 || idx > 36;
                                const isToday = day === parseInt(getTodayDateString().slice(-2)) && !isFaded;

                                return (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-center w-8 h-8 mx-auto rounded ${isFaded ? 'text-slate-300' : 'text-slate-600 font-medium'} ${isToday ? 'bg-[#9bb2ca] text-white font-bold' : ''}`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Calendar;