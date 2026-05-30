import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Activity, Lightbulb } from 'lucide-react';

interface DailyLog {
    mood: string;
    sleep_hours: number;
    exercise_completed: boolean;
    water_glasses: number;
    caffeine_mg: number;
    calories: number;
    well_being_score: number; 
    recommendations?: string[];
}

const Analysis: React.FC = () => {
    const [logData, setLogData] = useState<DailyLog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTodayLog = async () => {
            try {
                const response = await api.get('/tracker/today/');
                if (response.data && response.data.message) {
                    console.log("Backend says no data yet:", response.data.message);
                    setLogData(null); 
                } else {
                    setLogData(response.data);
                }
                
            } catch (error: any) {
                console.log("Error fetching logs.");
                setLogData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodayLog();
    }, []);

    const StatBar = ({ label, value, max, textValue }: { label: string, value: number, max: number, textValue: string }) => {
        const percentage = Math.min((value / max) * 100, 100);
        
        return (
            <div className="flex items-center justify-between mb-4">
                <span className="w-24 font-bold text-slate-800">{label}</span>
                <div className="flex-grow mx-4 bg-slate-100 rounded-md h-6 overflow-hidden">
                    <div 
                        className="bg-[#1f3a52] h-full rounded-md transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <span className="w-16 text-right font-medium text-[#4b749f]">{textValue}</span>
            </div>
        );
    };

    const CircularProgress = ({ score }: { score: number }) => {
        const safeScore = Math.min(Math.max(score, 0), 100);
        const radius = 36;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (safeScore / 100) * circumference;

        return (
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/20"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="text-white transition-all duration-1000 ease-out"
                    />
                </svg>
                <span className="absolute text-2xl font-bold text-white">
                    {safeScore}
                </span>
            </div>
        );
    };
    
    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-12">
            <Navbar />

            <div className="max-w-4xl mx-auto mt-8 px-4">
                <h1 className="text-3xl font-bold text-[#1f3a52] mb-8">Daily Analysis</h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b749f]"></div>
                    </div>
                ) : logData ? (                    
                    <div className="space-y-6 animate-fade-in">                        
                        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                            <StatBar 
                                label="Sleep" 
                                value={logData.sleep_hours} 
                                max={8} 
                                textValue={`${logData.sleep_hours}/8h`} 
                            />
                            <StatBar 
                                label="Water" 
                                value={logData.water_glasses} 
                                max={8} 
                                textValue={`${logData.water_glasses}/8`} 
                            />
                            <StatBar 
                                label="Caffeine" 
                                value={logData.caffeine_mg} 
                                max={400} 
                                textValue={`${logData.caffeine_mg}mg`} 
                            />
                            <StatBar 
                                label="Food" 
                                value={logData.calories} 
                                max={2500} 
                                textValue={`${logData.calories}cal`} 
                            />
                            
                            <div className="flex items-center justify-between mb-2 mt-4">
                                <span className="w-24 font-bold text-slate-800">Exercise</span>
                                <div className="flex-grow mx-4">
                                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${logData.exercise_completed ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {logData.exercise_completed ? 'Completed' : 'Skipped'}
                                    </span>
                                </div>
                                <span className="w-16 text-right font-medium text-[#4b749f]">
                                    {logData.exercise_completed ? '1/1' : '0/1'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#4b749f] rounded-xl p-8 text-white shadow-sm flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold mb-1">
                                    Well-being Score : {logData.well_being_score}
                                </h2>
                                <p className="text-blue-100">
                                    {logData.well_being_score > 60? "Your well-being score is good!": "You've got this. Take some time for you today."}
                                </p>
                            </div>
                            <CircularProgress score={logData.well_being_score} />
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative">
                            <Lightbulb className="absolute top-8 right-8 w-6 h-6 text-[#4b749f]" />
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Recommendations</h2>
                            
                            <ul className="space-y-4 text-slate-600 list-disc list-inside">
                                {logData.recommendations ? (
                                    logData.recommendations.map((rec, idx) => (
                                        <li key={idx}>{rec}</li>
                                    ))
                                ) : (
                                    <>
                                        <li>Drink 2-3 additional glasses of water per day to hit recommended water intake</li>
                                        <li>Eat more nutritious foods and don't skip meals</li>
                                        <li>Meditate for 15-30 minutes daily to increase focus and mood</li>
                                    </>
                                )}
                            </ul>
                        </div>

                    </div>

                ) : (
                    
                    <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-[#e5f0f9] rounded-full flex items-center justify-center mb-6">
                            <Activity className="w-12 h-12 text-[#4b749f]" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">
                            No Data to Analyze Yet
                        </h2>
                        
                        <p className="text-slate-500 max-w-md mx-auto">
                            We need a little more information to generate your well-being score and personalized AI recommendations. Head over to the Daily Tracker to log your first entry for today!
                        </p>
                    </div>

                )}

            </div>
        </div>
    );
};

export default Analysis;