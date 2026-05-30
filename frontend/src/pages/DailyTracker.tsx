import React, { useState } from 'react';
import api from '../services/api';
import TrackerCard from '../components/TrackerCard'; 
import Navbar from '../components/Navbar';
import { 
    Utensils, Moon, 
    Coffee, Dumbbell, GlassWater 
} from 'lucide-react';

const DailyTracker: React.FC = () => { 
    const [mood, setMood] = useState('Neutral');
    const [calories, setCalories] = useState<number | ''>('');
    const [sleepHours, setSleepHours] = useState<number | ''>('');
    const [caffeine, setCaffeine] = useState<number | ''>('');
    const [exerciseCompleted, setExerciseCompleted] = useState<boolean>(false);
    const [waterGlasses, setWaterGlasses] = useState<number | ''>('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setMessage('');
        try {
            await api.post('/tracker/today/', {
                mood,
                calories: Number(calories) || 0,
                sleep_hours: Number(sleepHours) || 0,
                caffeine_mg: Number(caffeine) || 0,
                exercise_completed: exerciseCompleted,
                water_glasses: Number(waterGlasses) || 0
            });
            setMessage('Daily log saved successfully! AI is analyzing your data.');
        } catch (error) {
            setMessage('Failed to save data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const moodOptions = [
        { 
            label: 'Very Sad', 
            icon: <img src="./very-sad.png" alt="Very Sad" className="w-8 h-8 object-contain" /> 
        },
        { 
            label: 'Sad', 
            icon: <img src="./sad.png" alt="Sad" className="w-8 h-8 object-contain" /> 
        }, 
        { 
            label: 'Neutral', 
            icon: <img src="./neutral.png" alt="Neutral" className="w-8 h-8 object-contain" /> 
        },
        { 
            label: 'Happy', 
            icon: <img src="./happy.png" alt="Happy" className="w-8 h-8 object-contain" /> 
        },
        { 
            label: 'Very Happy', 
            icon: <img src="./very-happy.png" alt="Very Happy" className="w-8 h-8 object-contain" /> 
        }, 
    ];
    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            

            <Navbar />

            <div className="max-w-4xl mx-auto mt-8 px-4">
                
                <div className="bg-[#4b749f] rounded-xl p-8 text-white mb-8 shadow-sm">
                    <h1 className="text-3xl font-bold mb-2">Sentira</h1>
                    <p className="text-blue-100">Your mental wellness starts here!</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 text-center font-medium ${message.includes('saved') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    <TrackerCard title="Daily Mood" subtitle="How's your mood today?">
                        <div className="flex justify-between bg-[#e5f0f9] rounded-lg p-2">
                            {moodOptions.map((m, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setMood(m.label)}
                                    className={`p-2 rounded-md transition-colors ${mood === m.label ? 'bg-[#C5E1F6] text-white shadow-md' : 'text-[#4b749f] hover:bg-white'}`}
                                >
                                    {m.icon}
                                </button>
                            ))}
                        </div>
                    </TrackerCard>

                    <TrackerCard title="Food" subtitle="Estimated calories consumed" icon={<Utensils className="w-8 h-8" />}>
                        <input 
                            type="number" 
                            value={calories}
                            onChange={(e) => setCalories(Number(e.target.value))}
                            placeholder="Add Calories"
                            className="w-full bg-[#e5f0f9] text-[#2a4563] placeholder-[#8ba3bd] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4b749f]"
                        />
                    </TrackerCard>

                    <TrackerCard title="Sleep" subtitle="How many hours did you sleep today?" icon={<Moon className="w-8 h-8" />}>
                        <div className="flex items-center space-x-3">
                            <input 
                                type="number" 
                                value={sleepHours}
                                onChange={(e) => setSleepHours(Number(e.target.value))}
                                placeholder="Enter Data"
                                step="0.5"
                                className="flex-grow bg-[#e5f0f9] text-[#2a4563] placeholder-[#8ba3bd] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4b749f]"
                            />
                            <span className="font-semibold text-slate-600">/8 hours</span>
                        </div>
                    </TrackerCard>

                    <TrackerCard title="Caffeine Intake" subtitle="Did you have any coffee today?" icon={<Coffee className="w-8 h-8" />}>
                        <input 
                            type="number" 
                            value={caffeine}
                            onChange={(e) => setCaffeine(Number(e.target.value))}
                            placeholder="e.g 200 mg"
                            className="w-full bg-[#e5f0f9] text-[#2a4563] placeholder-[#8ba3bd] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4b749f]"
                        />
                    </TrackerCard>

                    <TrackerCard title="Exercise" subtitle="Did you do some exercise?" icon={<Dumbbell className="w-8 h-8" />}>
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => setExerciseCompleted(true)}
                                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${exerciseCompleted ? 'bg-[#4b749f] text-white' : 'bg-[#e5f0f9] text-[#4b749f] hover:bg-blue-100'}`}
                            >
                                Yes
                            </button>
                            <button 
                                onClick={() => setExerciseCompleted(false)}
                                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${!exerciseCompleted ? 'bg-[#4b749f] text-white' : 'bg-[#e5f0f9] text-[#4b749f] hover:bg-blue-100'}`}
                            >
                                No
                            </button>
                        </div>
                    </TrackerCard>

                    <TrackerCard title="Water Intake" subtitle="How much water did you drink?" icon={<GlassWater className="w-8 h-8" />}>
                        <input 
                            type="number" 
                            value={waterGlasses}
                            onChange={(e) => setWaterGlasses(Number(e.target.value))}
                            placeholder="e.g 3 glasses"
                            className="w-full bg-[#e5f0f9] text-[#2a4563] placeholder-[#8ba3bd] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#4b749f]"
                        />
                    </TrackerCard>

                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-[#2a4563] hover:bg-[#1f3a52] text-white font-bold py-4 rounded-xl shadow-md transition-colors disabled:opacity-70"
                >
                    {isSubmitting ? 'Saving...' : 'Log Entry'}
                </button>

            </div>
        </div>
    );
};

export default DailyTracker;