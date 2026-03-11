import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit3, Search, Filter, Receipt, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import Alert from '../components/Alert';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
    const [categories, setCategories] = useState([]);
    const [alertData, setAlertData] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/transactions', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/categories', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/v1/transactions/${editingId}`, formData, config);
                setAlertData({ type: 'success', text: 'Transaction updated successfully!' });
            } else {
                await axios.post('http://localhost:5000/api/v1/transactions', formData, config);
                setAlertData({ type: 'success', text: 'Transaction added successfully!' });
            }

            closeModal();
            fetchTransactions();
        } catch (err) {
            setAlertData({ type: 'error', text: isEditing ? 'Error updating transaction' : 'Error adding transaction' });
        }
    };

    const openEditModal = (t) => {
        setFormData({
            type: t.type,
            amount: t.amount,
            category: t.category,
            description: t.description || '',
            date: new Date(t.date).toISOString().split('T')[0]
        });
        setIsEditing(true);
        setEditingId(t.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
    };

    const deleteTransaction = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            try {
                await axios.delete(`http://localhost:5000/api/v1/transactions/${id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                fetchTransactions();
                setAlertData({ type: 'success', text: 'Transaction deleted successfully!' });
            } catch (err) {
                setAlertData({ type: 'error', text: 'Error deleting transaction' });
            }
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Transactions</h1>
                    <p className="text-sm md:text-base text-slate-400 mt-1">Manage all your income and expenses.</p>
                </div>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setFormData({ type: 'expense', amount: '', category: 'Food', description: '', date: new Date().toISOString().split('T')[0] });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary flex items-center justify-center gap-2 py-3 px-6"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Transaction</span>
                </button>
            </header>

            <Alert 
                type={alertData.type} 
                message={alertData.text} 
                onClose={() => setAlertData({ type: '', text: '' })} 
            />

            {/* Transactions Table */}
            <div className="glass rounded-3xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px] md:min-w-0">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-semibold text-slate-400">Date</th>
                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-semibold text-slate-400">Category</th>
                                <th className="hidden lg:table-cell px-6 py-4 text-sm font-semibold text-slate-400">Description</th>
                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-semibold text-slate-400">Type</th>
                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-semibold text-slate-400 text-right">Amount</th>
                                <th className="px-4 md:px-6 py-4 text-xs md:text-sm font-semibold text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-4 md:px-6 py-4 text-sm font-medium text-slate-300">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-4 md:px-6 py-4">
                                        <span className="bg-primary-500/10 text-primary-400 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border border-primary-500/20">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4 text-slate-400">{t.description || '-'}</td>
                                    <td className="px-4 md:px-6 py-4 font-bold">
                                        <div className="flex items-center gap-2">
                                            {t.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
                                            <span className={`capitalize text-[10px] md:text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {t.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`px-4 md:px-6 py-4 text-right font-bold text-sm md:text-lg ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(t)}
                                            className="p-2 text-slate-500 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                                        >
                                            <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {transactions.length === 0 && (
                        <div className="py-20 flex flex-col items-center text-slate-500">
                            <Receipt className="w-12 h-12 md:w-16 md:h-16 opacity-20 mb-4" />
                            <p className="text-sm md:text-base text-center px-4">No transactions found. Add your first one!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Transaction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
                    <div className="glass w-full max-w-lg rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-white/10 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Transaction' : 'New Transaction'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-4 p-1 bg-white/5 rounded-2xl">
                                <button
                                    type="button"
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${formData.type === 'expense' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:text-white'}`}
                                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${formData.type === 'income' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
                                    onClick={() => setFormData({ ...formData, type: 'income' })}
                                >
                                    Income
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full input-field text-xl font-bold"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full input-field"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
                                <select
                                    className="w-full input-field appearance-none cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {formData.type === 'expense' ? (
                                        <>
                                            <option>Food</option>
                                            <option>Transport</option>
                                            <option>Rent</option>
                                            <option>Utilities</option>
                                            <option>Entertainment</option>
                                            <option>Shopping</option>
                                        </>
                                    ) : (
                                        <>
                                            <option>Salary</option>
                                            <option>Freelance</option>
                                            <option>Investment</option>
                                        </>
                                    )}
                                    {categories.filter(c => c.type === formData.type).map(c => (
                                        <option key={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                                <input
                                    type="text"
                                    className="w-full input-field"
                                    placeholder="What was this for?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full btn-primary py-4 text-lg">
                                {isEditing ? 'Update Transaction' : 'Save Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
