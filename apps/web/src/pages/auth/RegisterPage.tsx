import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('/auth/register', { name, email, password });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-ink text-ivory font-sans p-4">
            <div className="w-full max-w-md p-10 bg-carbon border border-seam">
                <div className="mb-10 text-center">
                    <Link to="/landing" className="font-display text-3xl font-light tracking-[0.25em] text-ivory">
                        MAISON
                    </Link>
                    <p className="text-taupe text-[10px] tracking-luxe uppercase mt-3">Atölyeye katılın</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-800 text-red-200 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[10px] tracking-luxe text-taupe uppercase mb-2">Ad Soyad</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-ink border border-seam focus:border-champagne focus:outline-none transition-colors text-ivory"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] tracking-luxe text-taupe uppercase mb-2">E-posta</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-ink border border-seam focus:border-champagne focus:outline-none transition-colors text-ivory"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] tracking-luxe text-taupe uppercase mb-2">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-ink border border-seam focus:border-champagne focus:outline-none transition-colors text-ivory"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-ivory text-ink text-xs tracking-luxe uppercase hover:bg-champagne transition-colors"
                    >
                        Kayıt Ol
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-taupe">
                    Zaten hesabınız var mı?{' '}
                    <Link to="/login" className="text-champagne hover:text-ivory transition-colors">
                        Giriş Yapın
                    </Link>
                </div>
            </div>
        </div>
    );
};
