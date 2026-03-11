import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler
);

const Dashboard = () => {
    const [allTransactions, setAllTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filter, setFilter] = useState('monthly');
    const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [allTransactions, filter]);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/transactions', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setAllTransactions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const applyFilter = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let filtered = [...allTransactions];
        if (filter === 'monthly') {
            filtered = allTransactions.filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            });
        } else if (filter === 'yearly') {
            filtered = allTransactions.filter(t => {
                const d = new Date(t.date);
                return d.getFullYear() === currentYear;
            });
        }

        setFilteredTransactions(filtered);
        calculateStats(filtered);
    };

    const calculateStats = (data) => {
        const income = data.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
        const expense = data.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
        setStats({ income, expense, balance: income - expense });
    };

    const categoryData = {
        labels: [...new Set(filteredTransactions.filter(t => t.type === 'expense').map(t => t.category))],
        datasets: [{
            data: [...new Set(filteredTransactions.filter(t => t.type === 'expense').map(t => t.category))].map(cat =>
                filteredTransactions.filter(t => t.category === cat).reduce((acc, t) => acc + Number(t.amount), 0)
            ),
            backgroundColor: ['#0ea5e9', '#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6'],
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
        }]
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
                    <p className="text-slate-400 mt-1">Here's what's happening with your money.</p>
                </div>
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
                    {['monthly', 'yearly', 'all'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setFilter(p)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter === p ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:text-white'}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-3xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-20 h-20 text-white" />
                    </div>
                    <p className="text-slate-400 font-medium">Total Balance</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                    <div className="mt-4 flex items-center gap-2 text-primary-400 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>Updated just now</span>
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl group border border-white/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 font-medium">Monthly Income</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-emerald-400 mt-2">${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                        </div>
                        <div className="bg-emerald-500/20 p-3 rounded-2xl">
                            <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl group border border-white/5 md:col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 font-medium">Monthly Expenses</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-rose-400 mt-2">${stats.expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                        </div>
                        <div className="bg-rose-500/20 p-3 rounded-2xl">
                            <ArrowDownRight className="w-6 h-6 text-rose-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-6 md:p-8 rounded-3xl border border-white/5">
                    <h3 className="text-xl font-bold mb-6">Expense Distribution</h3>
                    <div className="h-[300px] flex items-center justify-center">
                        {filteredTransactions.length > 0 ? (
                            <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <p className="text-slate-500">No data available</p>
                        )}
                    </div>
                </div>

                <div className="glass p-6 md:p-8 rounded-3xl overflow-hidden border border-white/5">
                    <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
                    <div className="space-y-3 md:space-y-4">
                        {filteredTransactions.slice(0, 5).map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={`p-2.5 md:p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm md:text-base">{t.category}</p>
                                        <p className="text-[10px] md:text-sm text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <p className={`font-bold text-sm md:text-lg ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        ))}
                        {filteredTransactions.length === 0 && <p className="text-center text-slate-500 py-10">No transactions found for this period.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
