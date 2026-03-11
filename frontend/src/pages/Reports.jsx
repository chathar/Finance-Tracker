import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BarChart3, TrendingUp, TrendingDown, ArrowLeftRight, Calendar } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Reports = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/transactions', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setTransactions(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // Prepare data for Trend Chart (Last 6 Months)
    const getTrendData = () => {
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            last6Months.push({
                month: d.toLocaleString('default', { month: 'short' }),
                year: d.getFullYear(),
                monthIdx: d.getMonth()
            });
        }

        const incomeData = last6Months.map(m => 
            transactions
                .filter(t => t.type === 'income' && new Date(t.date).getMonth() === m.monthIdx && new Date(t.date).getFullYear() === m.year)
                .reduce((acc, t) => acc + Number(t.amount), 0)
        );

        const expenseData = last6Months.map(m => 
            transactions
                .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === m.monthIdx && new Date(t.date).getFullYear() === m.year)
                .reduce((acc, t) => acc + Number(t.amount), 0)
        );

        return {
            labels: last6Months.map(m => m.month),
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#f43f5e',
                    backgroundColor: 'rgba(244, 63, 94, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };
    };

    if (loading) return <div className="p-8 text-white">Loading reports...</div>;

    return (
        <div className="space-y-8 pb-10">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-8 h-8 text-primary-500" />
                    <h1 className="text-3xl font-bold text-white">Financial Reports</h1>
                </div>
                <p className="text-slate-400">Deep dive into your spending habits and income trends.</p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {/* Trend Analysis */}
                <div className="glass p-8 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-primary-400" />
                            Income vs Expenses Trend
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="w-4 h-4" />
                            <span>Last 6 Months</span>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <Line 
                            data={getTrendData()} 
                            options={{ 
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        labels: { color: '#94a3b8', font: { weight: 'bold' } }
                                    }
                                },
                                scales: {
                                    y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                                    x: { ticks: { color: '#64748b' }, grid: { display: false } }
                                }
                            }} 
                        />
                    </div>
                </div>

                {/* Monthly Summary Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-3xl border border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                            Top Income Sources
                        </h2>
                        <div className="space-y-4">
                            {[...new Set(transactions.filter(t => t.type === 'income').map(t => t.category))].map(cat => {
                                const amount = transactions.filter(t => t.category === cat && t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
                                return (
                                    <div key={cat} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <span className="font-medium text-slate-300">{cat}</span>
                                        <span className="font-bold text-emerald-400">${amount.toLocaleString()}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-rose-400">
                            <TrendingDown className="w-6 h-6" />
                            Highest Expense Categories
                        </h2>
                        <div className="space-y-4">
                            {[...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))].map(cat => {
                                const amount = transactions.filter(t => t.category === cat && t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
                                return (
                                    <div key={cat} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <span className="font-medium text-slate-300">{cat}</span>
                                        <span className="font-bold text-rose-400">${amount.toLocaleString()}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
