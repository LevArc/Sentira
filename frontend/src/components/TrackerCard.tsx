import React, { type ReactNode } from 'react';

interface TrackerCardProps {
    title: string;
    subtitle: string;
    icon?: ReactNode; 
    children: ReactNode; 
}

const TrackerCard: React.FC<TrackerCardProps> = ({ title, subtitle, icon, children }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative">
            {icon && (
                <div className="absolute top-6 right-6 text-[#4b749f]">
                    {icon}
                </div>
            )}
            
            <h2 className="text-xl font-bold text-slate-800 mb-1">{title}</h2>
            <p className="text-sm text-slate-500 mb-4">{subtitle}</p>
            
            <div>
                {children}
            </div>
        </div>
    );
};

export default TrackerCard;