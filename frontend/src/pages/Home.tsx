import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
    CheckSquare, 
    ListTodo, 
    Activity, 
    Smile, 
    Meh, 
    Frown, 
    Coffee 
} from 'lucide-react';

interface DailyLog {
    mood: string;
    well_being_score?: number;
}

interface Task {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    is_completed: boolean;
}

const Home: React.FC = () => {
    const { user } = useAuth();
    const [logData, setLogData] = useState<DailyLog | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getTodayDateString = () => {
        return new Date().toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const today = getTodayDateString();
            
            try {
                const logResponse = await api.get('/tracker/today/');
                if (logResponse.data && logResponse.data.message) {
                    setLogData(null);
                } else {
                    setLogData(logResponse.data);
                }
            } catch (error) {
                console.error("No log data found.");
                setLogData(null);
            }

            try {
                const tasksResponse = await api.get(`/tasks/?date=${today}`);
                setTasks(tasksResponse.data);
            } catch (error) {
                console.error("Failed to fetch tasks.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const toggleTask = async (id: number, currentStatus: boolean) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
        try {
            await api.patch(`/tasks/${id}/`, { is_completed: !currentStatus });
        } catch (error) {
            setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: currentStatus } : t));
        }
    };

    const CircularProgress = ({ score }: { score: number }) => {
        const safeScore = Math.min(Math.max(score, 0), 100);
        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (safeScore / 100) * circumference;

        return (
            <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="transform -rotate-90 w-16 h-16">
                    <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[#9bb2ca]/30" />
                    <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="text-[#4b749f] transition-all duration-1000 ease-out" />
                </svg>
                <span className="absolute text-sm font-bold text-[#4b749f]">{safeScore}</span>
            </div>
        );
    };

    const renderMoodIcon = (mood: string) => {
        const m = mood.toLowerCase();
        if (m.includes('happy') || m.includes('good')) return <Smile className="w-10 h-10 text-white" />;
        if (m.includes('sad') || m.includes('bad')) return <Frown className="w-10 h-10 text-white" />;
        return <Meh className="w-10 h-10 text-white" />;
    };

    const sortedTasks = [...tasks].sort((a, b) => 
        (a.start_time || "").localeCompare(b.start_time || "")
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <Navbar />

            <div className="max-w-4xl mx-auto mt-8 px-4">
                
                <div className="bg-[#4b749f] rounded-xl p-8 text-white mb-6 shadow-sm">
                    <h1 className="text-3xl font-bold mb-1">
                        Hello, {user?.username || 'User'}
                    </h1>
                    <p className="text-blue-100 opacity-90">
                        I hope you are having a wonderful day!
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4b749f]"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">Today's Mood</h2>
                                    {logData ? (
                                        <p className="text-sm text-slate-500">
                                            It looks like you're feeling <span className="font-semibold text-[#4b749f] lowercase">{logData.mood}</span> today.
                                        </p>
                                    ) : (
                                        <p className="text-sm text-slate-400">
                                            You haven't logged your mood today.
                                        </p>
                                    )}
                                </div>
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${logData ? 'bg-[#2a4563]' : 'bg-slate-200'}`}>
                                    {logData ? renderMoodIcon(logData.mood) : <Coffee className="w-8 h-8 text-slate-400" />}
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 mb-1">Well-Being Score</h2>
                                    {logData && logData.well_being_score ? (
                                        <p className="text-sm text-slate-500">{logData.well_being_score > 60 ? "Amazing! Keep up the good habits." :"Listen to your body and rest if you need to."}</p>
                                    ) : (
                                        <p className="text-sm text-slate-400">Log your daily tracker to see your score.</p>
                                    )}
                                </div>
                                {logData && logData.well_being_score ? (
                                    <CircularProgress score={logData.well_being_score} />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-200">
                                        <Activity className="w-6 h-6 text-slate-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#9bb2ca] rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold text-[#1f3a52] mb-6">Today's To Do List</h2>
                            
                            {tasks.length === 0 ? (
                                <div className="bg-white/60 rounded-lg p-8 border-2 border-dashed border-white flex flex-col items-center justify-center text-center">
                                    <ListTodo className="w-10 h-10 text-[#1f3a52] opacity-50 mb-3" />
                                    <p className="text-[#1f3a52] font-semibold">No tasks scheduled yet.</p>
                                    <p className="text-[#1f3a52]/70 text-sm">Head over to the Calendar to plan your day!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sortedTasks.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2a4563]"></div>
                                            
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
                    </>
                )}

            </div>
        </div>
    );
};

export default Home;