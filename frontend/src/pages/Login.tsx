import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import api from '../services/api';


const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login/', { username, password });
            login(response.data.access, response.data.refresh);
            navigate('/dashboard');
        } catch (err: any) {
            setError('Invalid username or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">            
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-24">
                <div className="w-full max-w-md">
                    
                    <h1 className="text-4xl font-bold text-[#1f3a52] text-center mb-10">Login</h1>

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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#2a4563] hover:bg-[#1f3a52] text-white font-medium py-3 px-4 rounded-md transition-colors mt-2"
                        >
                            {isLoading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-slate-500">
                        Not a member?{' '}
                        <button 
                            onClick={() => navigate('/register')} 
                            className="text-[#5b89ba] hover:underline"
                        >
                            Register now!
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-white border-l border-slate-100">
                <div className="w-full max-w-xl h-auto flex-grow flex items-center justify-center">
                    <img src="/pngtree-mental-health-problems-flat-illustration-head-png-image_6855459.png" alt="Mental Wellness Illustration" className="w-full h-auto object-contain" />
        
                </div>

                <h2 className="text-2xl font-semibold text-[#1f3a52] mt-8 mb-12">
                    Your mental wellness starts here!
                </h2>
                
            </div>
            
        </div>
    );
};

export default Login;