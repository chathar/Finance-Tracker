import React from 'react';
import { ShieldCheck, CircleAlert, Info, XCircle, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
    if (!message) return null;

    const config = {
        success: {
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-400',
            border: 'border-emerald-500/20',
            icon: ShieldCheck
        },
        error: {
            bg: 'bg-rose-500/10',
            text: 'text-rose-400',
            border: 'border-rose-500/20',
            icon: XCircle
        },
        warning: {
            bg: 'bg-amber-500/10',
            text: 'text-amber-400',
            border: 'border-amber-500/20',
            icon: CircleAlert
        },
        info: {
            bg: 'bg-primary-500/10',
            text: 'text-primary-400',
            border: 'border-primary-500/20',
            icon: Info
        }
    };

    const style = config[type] || config.info;
    const Icon = style.icon;

    return (
        <div className={`mx-4 mb-6 p-4 rounded-2xl flex items-center gap-3 border transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${style.bg} ${style.text} ${style.border}`}>
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium flex-grow">{message}</p>
            {onClose && (
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default Alert;
