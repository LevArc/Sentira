import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import api from '../services/api';


const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        setIsLoading(true);

        try {
            await api.post('/auth/register/', { username, password });
            
            navigate('/login');
            
        } catch (err: any) {
             setError(err.response?.data?.username?.[0] || 'Registration failed. Username may be taken.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24">
                <div className="w-full max-w-md">
                    
                    <h1 className="text-4xl font-bold text-[#1f3a52] text-center mb-10">Register</h1>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <InputField
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username..."
                            required
                        />

                        <InputField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password..."
                            required
                        />

                        <InputField
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Enter password..."
                            required
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#2a4563] hover:bg-[#1f3a52] text-white font-medium py-3 px-4 rounded-md transition-colors mt-6"
                        >
                            {isLoading ? 'Creating account...' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm font-medium text-slate-500">
                        Already a member?{' '}
                        <button 
                            onClick={() => navigate('/login')} 
                            className="text-[#5b89ba] hover:underline"
                        >
                            Login now!
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-white border-l border-slate-100">
                
                <div className="w-full max-w-xl h-auto flex-grow flex items-center justify-center">
                    <img 
                        src="/pngtree-mental-health-problems-flat-illustration-head-png-image_6855459.png"
                        alt="Mental Wellness Illustration" 
                        className="w-full h-auto object-contain" 
                    />
                </div>

                <h2 className="text-2xl font-semibold text-[#1f3a52] mt-8 mb-12">
                    Your mental wellness starts here!
                </h2>
                
            </div>
            
        </div>
    );
};

export default Register;