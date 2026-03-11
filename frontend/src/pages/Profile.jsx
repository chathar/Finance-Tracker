import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Lock, ShieldCheck, Save, Loader2 } from 'lucide-react';
import Alert from '../components/Alert';

const Profile = () => {
    const [user, setUser] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/auth/me', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setUser(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });
        try {
            await axios.put('http://localhost:5000/api/v1/auth/profile', { name: user.name }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Error updating profile' });
        }
        setUpdating(false);
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setMessage({ type: 'error', text: 'New passwords do not match' });
        }
        setUpdating(true);
        setMessage({ type: '', text: '' });
        try {
            await axios.put('http://localhost:5000/api/v1/auth/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Error updating password' });
        }
        setUpdating(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <header className="px-4">
                <h1 className="text-3xl font-bold text-white">Account Settings</h1>
                <p className="text-slate-400 mt-1">Manage your personal information and security.</p>
            </header>

            <Alert 
                type={message.type} 
                message={message.text} 
                onClose={() => setMessage({ type: '', text: '' })} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
                {/* Profile Information */}
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-primary-500/20 p-3 rounded-2xl">
                            <User className="w-6 h-6 text-primary-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Profile Details</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    className="input-field input-with-icon"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1 opacity-50">Email Address (Read Only)</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    disabled
                                    className="input-field input-with-icon opacity-50 cursor-not-allowed"
                                    value={user.email}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={updating} className="w-full btn-primary py-4 flex items-center justify-center gap-2">
                            {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Update Name
                        </button>
                    </form>
                </div>

                {/* Password Change */}
                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-rose-500/20 p-3 rounded-2xl">
                            <Lock className="w-6 h-6 text-rose-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Security</h2>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    className="input-field input-with-icon"
                                    placeholder="••••••••"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    className="input-field input-with-icon"
                                    placeholder="••••••••"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirm New Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    className="input-field input-with-icon"
                                    placeholder="••••••••"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={updating} className="w-full btn-primary py-4 flex items-center justify-center gap-2">
                            {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
