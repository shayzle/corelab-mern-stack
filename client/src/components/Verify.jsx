import { Link } from "react-router-dom";

function Verify() {
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

                <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] border border-slate-800/80 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent" />
                    
                    <div className="flex justify-center mb-6">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/30">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500/10 opacity-75" />
                            <svg className="h-6 w-6 text-[#a582ff]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-xl font-bold tracking-tight text-white">
                            Inscription réussie !
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Merci de votre intérêt. Votre compte est actuellement en attente de <span className="font-semibold text-[#a582ff]">validation par un administrateur</span> avant de pouvoir vous connecter.
                        </p>
                    </div>

                    <div className="mt-8">
                        <Link 
                            to="/login" 
                            className="w-full flex justify-center py-3 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
                        >
                            Retour à la page de connexion
                        </Link>
                    </div>

                    <div className="mt-6 text-[11px] text-slate-500 font-medium">
                        Vous recevrez un e-mail dès que votre demande aura été examinée.
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Verify;