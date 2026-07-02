import React, { useState } from "react";
import axios from "axios";
import { HiLockClosed } from "react-icons/hi2";
import { IoWarning } from "react-icons/io5";

export default function ChangePasswordModal({ user, token, onPasswordChanged }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!user?.isFirstLogin) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            return setError("Les mots de passe ne correspondent pas.");
        }

        if (password.length < 6) {
            return setError("Le mot de passe doit contenir au moins 6 caractères.");
        }

        setLoading(true);
        try {
            await axios.patch(
                `http://localhost:4242/api/user/${user.id}/password`,
                { password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onPasswordChanged();
        } catch (err) {
            setError(err.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            
            <div className="w-full max-w-md bg-linear-to-b from-[#111327] to-[#0d0f1f] rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden animate-in zoom-in-95 duration-200 relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent" />

                <div className="p-6 text-center border-b border-slate-900/60">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 mb-3 text-[#a582ff]">
                        <HiLockClosed size={22} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white">Première connexion</h2>
                    <p className="text-slate-400 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                        Pour des raisons de sécurité, veuillez modifier votre mot de passe pour débloquer votre espace <span className="text-[#a582ff] font-semibold">AltLearn</span>.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {error && (
                        <div className="flex items-start gap-2.5 bg-rose-500/5 border border-rose-500/10 text-rose-400 p-3 rounded-xl text-xs font-medium">
                            <IoWarning size={16} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Confirmez le mot de passe
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Mise à jour..." : "Activer mon espace"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}