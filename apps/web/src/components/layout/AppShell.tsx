import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAgUiStore } from '../../agents/AgUiCore';
import { useAuth } from '../../context/AuthContext';
import { TR } from '../../lib/tr';
import { LogOut, User, Settings } from 'lucide-react';

interface NavItem { to: string; label: string; highlight?: boolean; }

const NAV_ITEMS: NavItem[] = [
    { to: '/strateji', label: TR.kenarCubugu.strateji },
    { to: '/trend', label: TR.kenarCubugu.trendAI },
    { to: '/koleksiyon', label: TR.kenarCubugu.koleksiyon },
    { to: '/tasarim', label: TR.kenarCubugu.tasarim, highlight: true },
    { to: '/maliyet', label: TR.kenarCubugu.maliyetlendirme },
    { to: '/ornekleme', label: TR.kenarCubugu.ornekleme },
    { to: '/analiz', label: TR.kenarCubugu.analiz },
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { status, message } = useAgUiStore();
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'GM' || user?.role === 'ADMIN';

    return (
        <div className="flex h-screen bg-stone-950 text-stone-100 font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-stone-800 p-4 flex flex-col shrink-0">
                <NavLink to="/" className="block mb-8">
                    <h1 className="text-xl font-bold tracking-widest text-white">
                        VIBE<span className="text-stone-500">ERP</span>
                    </h1>
                </NavLink>

                <nav className="space-y-1 flex-1 overflow-y-auto">
                    {NAV_ITEMS.map(({ to, label, highlight }) => (
                        <NavLink key={to} to={to} className={({ isActive }) =>
                            `block w-full text-left px-3 py-2 rounded text-sm transition-colors ${isActive
                                ? 'bg-white text-black font-medium'
                                : highlight
                                    ? 'text-white hover:bg-stone-800'
                                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                            }`
                        }>
                            {label}
                        </NavLink>
                    ))}

                    {isAdmin && (
                        <>
                            <div className="h-px bg-stone-800 my-3" />
                            <NavLink to="/admin" className={({ isActive }) =>
                                `block w-full text-left px-3 py-2 rounded text-sm transition-colors ${isActive ? 'bg-white text-black font-medium' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'}`
                            }>
                                {TR.kenarCubugu.admin}
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* User Section */}
                <div className="mt-4 pt-4 border-t border-stone-800 space-y-3">
                    <NavLink to="/ayarlar" className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors ${isActive ? 'text-white' : 'text-stone-500 hover:text-stone-300'}`
                    }>
                        <Settings size={13} />
                        {TR.kenarCubugu.ayarlar}
                    </NavLink>

                    <div className="flex items-center gap-3 px-1">
                        <div className="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 shrink-0">
                            <User size={13} />
                        </div>
                        <div className="overflow-hidden flex-1">
                            <div className="text-xs font-medium text-white truncate">{user?.name ?? user?.email}</div>
                            <div className="text-xs text-stone-600 truncate">{user?.role}</div>
                        </div>
                        <button onClick={logout} title={TR.kenarCubugu.cikisYap}
                            className="text-stone-600 hover:text-red-400 transition-colors shrink-0">
                            <LogOut size={13} />
                        </button>
                    </div>
                </div>

                {/* AG-UI Guardian */}
                <div className={`mt-3 p-3 rounded border ${status === 'BLOCKED'
                    ? 'border-red-500/60 bg-red-900/20'
                    : status === 'THINKING'
                        ? 'border-blue-500/60 bg-blue-900/20'
                        : 'border-stone-800'
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${status === 'IDLE' ? 'bg-green-500' :
                            status === 'BLOCKED' ? 'bg-red-500 animate-pulse' :
                                'bg-blue-400 animate-bounce'
                            }`} />
                        <span className="text-xs font-mono uppercase text-stone-500">{TR.agui.baslik}</span>
                    </div>
                    <p className="text-xs text-stone-400 leading-tight">
                        {message ?? TR.agui.bekliyor}
                    </p>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-auto bg-stone-900 p-8">
                {children}
            </main>
        </div>
    );
};
