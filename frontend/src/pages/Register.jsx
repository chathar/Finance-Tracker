import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../components/Alert';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertData, setAlertData] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setAlertData({ type: '', text: '' });
        try {
            const res = await axios.post('http://localhost:5000/api/v1/auth/register', { name, email, password });
            localStorage.setItem('token', res.data.token);
            window.location.reload();
        } catch (err) {
            setAlertData({ type: 'error', text: err.response?.data?.msg || 'Error registering' });
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
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-slate-400">Start managing your finances today</p>
                    </div>

                    <Alert 
                        type={alertData.type} 
                        message={alertData.text} 
                        onClose={() => setAlertData({ type: '', text: '' })} 
                    />

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="input-field input-with-icon"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                            <UserPlus className="w-5 h-5" />
                            Sign Up
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-4">
                            Log in instead
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
