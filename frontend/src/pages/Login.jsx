import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wallet, Mail, Lock, LogIn } from 'lucide-react';
import Alert from '../components/Alert';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertData, setAlertData] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setAlertData({ type: '', text: '' });
        try {
            const res = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            window.location.reload();
        } catch (err) {
            setAlertData({ type: 'error', text: err.response?.data?.msg || 'Error logging in' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <div className="w-full max-w-md">
                <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="bg-primary-500 p-4 rounded-2xl mb-4 shadow-lg shadow-primary-500/20">
                            <Wallet className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Log in to track your expenses</p>
                    </div>

                    <Alert 
                        type={alertData.type} 
                        message={alertData.text} 
                        onClose={() => setAlertData({ type: '', text: '' })} 
                    />

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="input-field input-with-icon"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field input-with-icon"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg">
                            <LogIn className="w-5 h-5" />
                            Sign In
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-4">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
