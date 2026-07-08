import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TR } from '../../lib/tr';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/auth/login', { email, password });
            login(res.data.access_token, res.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || TR.auth.girisHatasi);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-ink text-ivory font-sans p-4">
            <div className="w-full max-w-md p-10 bg-carbon border border-seam">
                <div className="mb-10 text-center">
                    <Link to="/landing" className="font-display text-3xl font-light tracking-[0.25em] text-ivory">
                        MAISON
                    </Link>
                    <p className="text-taupe text-[10px] tracking-luxe uppercase mt-3">Atölyeye giriş yapın</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-800 text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] tracking-luxe text-taupe uppercase mb-2">{TR.auth.eposta}</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-4 py-2.5 bg-ink border border-seam focus:border-champagne focus:outline-none transition-colors text-ivory" />
                    </div>
                    <div>
                        <label className="block text-[10px] tracking-luxe text-taupe uppercase mb-2">{TR.auth.sifre}</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-4 py-2.5 bg-ink border border-seam focus:border-champagne focus:outline-none transition-colors text-ivory" />
                    </div>

                    <button type="submit"
                        className="w-full py-3.5 bg-ivory text-ink text-xs tracking-luxe uppercase hover:bg-champagne transition-colors">
                        {TR.auth.girisYap}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-taupe">
                    {TR.auth.hesabinizYokMu}{' '}
                    <Link to="/register" className="text-champagne hover:text-ivory transition-colors">{TR.auth.kayitOl}</Link>
                </div>
            </div>
        </div>
    );
};
