import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

const initialForm = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'student',
};

const roleOptions = [
    { value: 'student', label: 'Étudiant'},
    { value: 'admin', label: 'Équipe Pédagogique (Admin)' },
];

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
        
        if (value.trim().length === 0) {
            setError('Ce champ est obligatoire.');
        } else {
            setError(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (!formData.firstname.trim() || !formData.lastname.trim() || !formData.email.trim() || !formData.password.trim()) {
            setError('Tous les champs sont obligatoires.');
            setIsSubmitting(false);
            return;
        }

        try {
            await axios.post('http://localhost:4242/api/auth/register', formData);
            setFormData(initialForm);
            setError(null);
            navigate('/verify');
        } catch (err) {
            const message = err.response?.data?.message ?? "Une erreur est survenue.";
            setError(`Erreur: ${message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070913] font-sans antialiased flex flex-col items-center justify-center relative text-slate-200 px-4 py-12 overflow-hidden">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

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
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent" />
                    
                    <div className="mb-6">
                        <h2 className="text-xl font-bold tracking-tight text-white">Créer un compte</h2>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Rejoignez la plateforme dès aujourd'hui.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="firstname" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Prénom
                                </label>
                                <input
                                    id="firstname"
                                    name="firstname"
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="lastname" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Nom
                                </label>
                                <input
                                    id="lastname"
                                    name="lastname"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Adresse Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="nom@exemple.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="role" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Type de compte
                            </label>

                            <div className="relative">
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer appearance-none"
                                >
                                    {roleOptions.map((option) => (
                                        <option key={option.value} value={option.value} className="bg-[#111327]">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-center">
                                <p className="text-xs font-semibold text-rose-400">{error}</p>
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-900/60 text-center">
                        <p className="text-xs text-slate-500">
                            Vous avez déjà un compte ?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Se connecter ici
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Register;