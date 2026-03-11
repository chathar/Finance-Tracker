import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';
import Alert from '../components/Alert';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', type: 'expense' });
    const [alertData, setAlertData] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/v1/categories', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setCategories(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertData({ type: '', text: '' });
        try {
            await axios.post('http://localhost:5000/api/v1/categories', formData, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            fetchCategories();
            setFormData({ name: '', type: 'expense' });
            setAlertData({ type: 'success', text: 'Category added successfully!' });
        } catch (err) {
            setAlertData({ type: 'error', text: 'Error adding category' });
        }
    };

    const deleteCategory = async (id) => {
        if (window.confirm('Delete this category?')) {
            try {
                await axios.delete(`http://localhost:5000/api/v1/categories/${id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                fetchCategories();
                setAlertData({ type: 'success', text: 'Category deleted successfully!' });
            } catch (err) {
                setAlertData({ type: 'error', text: 'Error deleting category' });
            }
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Categories</h1>
                <p className="text-sm md:text-base text-slate-400 mt-1">Customize how you label your transactions.</p>
            </header>

            <Alert 
                type={alertData.type} 
                message={alertData.text} 
                onClose={() => setAlertData({ type: '', text: '' })} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="glass p-8 rounded-3xl h-fit sticky top-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="w-6 h-6 text-primary-400" />
                        Add New Category
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Type</label>
                            <div className="flex gap-4 p-1 bg-white/5 rounded-2xl">
                                <button
                                    type="button"
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'text-slate-400 hover:text-white'}`}
                                    onClick={() => setType('expense')}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${type === 'income' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
                                    onClick={() => setType('income')}
                                >
                                    Income
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category Name</label>
                            <input
                                type="text"
                                required
                                className="w-full input-field"
                                placeholder="e.g. Subsistence"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="w-full btn-primary py-4">
                            Create Category
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((c) => (
                            <div key={c.id} className="glass p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${c.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary-500/20 text-primary-400'}`}>
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-lg">{c.name}</p>
                                        <p className="text-xs font-bold uppercase text-slate-500">{c.type}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteCategory(c.id)}
                                    className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    {categories.length === 0 && (
                        <div className="glass p-20 flex flex-col items-center rounded-3xl opacity-50">
                            <Tag className="w-16 h-16 mb-4" />
                            <p>Custom categories will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
