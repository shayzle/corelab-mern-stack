import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Connecting');
        setError('');

        try {
            const res = await axios.post('http://localhost:4242/api/auth/login', { email, password });
            setStatus(`Success: ${res.data.message}`);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                if (res.data.user.role === "admin") {
                    navigate("/admin/dashboard");
                } else if (res.data.user.role === "student") {
                    navigate("/student/dashboard");
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue lors de la connexion.");
            setStatus('');
        }
    }

    return (
        <div className="min-h-screen bg-[#070913] font-sans antialiased flex flex-col items-center justify-center relative text-slate-200 px-4 overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md space-y-8 relative z-10">

                <div className="flex flex-col items-center justify-center select-none text-center">
                    <div className="flex items-center gap-2 tracking-tight">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.174L10.74 3.7a1.665 1.665 0 012.52 0l6.48 6.474m-16.48 0L10.74 16.65a1.665 1.665 0 002.52 0l6.48-6.474M4.26 10.174h15.48" />
                            </svg>
                        </div>
                        <span className="text-3xl font-bold text-white tracking-tight">
                            Alt<span className="text-[#a582ff] ml-0.5">Learn</span>
                        </span>
                    </div>
                    <span className="mt-2 text-[9px] font-bold tracking-[0.25em] text-slate-500 uppercase">
                        Learn Modern, Future Modern
                    </span>
                </div>

                <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent"></div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold tracking-tight text-white">Connexion à votre espace</h2>
                        <p className="text-xs text-slate-400 mt-1">Veuillez renseigner vos identifiants d'accès.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Adresse Email
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                                placeholder="nom@exemple.com"
                                className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Mot de passe
                                </label>
                            </div>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                        </div>

                        {status && !error && (
                            <p className="text-xs text-indigo-400 font-medium animate-pulse text-center">{status}...</p>
                        )}

                        {error && (
                            <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-center">
                                <p className="text-xs font-semibold text-rose-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
                        >
                            Se connecter
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-900/60 text-center">
                        <p className="text-xs text-slate-500">
                            Pas encore membre ?{" "}
                            <a href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Créer un compte étudiant
                            </a >
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;