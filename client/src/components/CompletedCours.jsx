import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { HiCheckCircle, HiXCircle, HiAcademicCap, HiArrowLeft } from "react-icons/hi2";

export default function CompletedCours() {
    const { courseId } = useParams();
    const token = localStorage.getItem("token");

    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const res = await axios.get(`/api/attempts/course/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAttempts(res.data.attempts);
            } catch (error) {
                console.error("Erreur chargement résultats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttempts();
    }, [courseId]);

    const allPassed = attempts.length > 0 && attempts.every(a => a.passed);

    if (loading) return (
        <div className="min-h-screen bg-[#070913] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#070913] font-sans antialiased text-slate-200 p-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Back */}
                <Link to="/student/cours"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-white transition-colors">
                    <HiArrowLeft size={16} />
                    Retour aux cours
                </Link>

                {/* Header */}
                <div className="bg-linear-to-br from-[#111327] to-[#0d0f1f] border border-slate-800 rounded-2xl p-8 text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${allPassed ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"}`}>
                        <HiAcademicCap size={36} />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        {allPassed ? "Félicitations ! 🎉" : "Cours terminé"}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {allPassed
                            ? "Vous avez réussi tous les quiz de ce cours."
                            : "Vous avez terminé toutes les leçons. Voici le détail de vos résultats."}
                    </p>
                </div>

                {/* Results */}
                {attempts.length === 0 ? (
                    <div className="bg-[#111327] border border-slate-800 rounded-2xl p-6 text-center">
                        <p className="text-slate-500 text-sm">Aucun quiz n'a été passé pour ce cours.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Résultats des quiz</h2>

                        {attempts.map((attempt) => (
                            <div key={attempt._id} className="bg-[#111327] border border-slate-800 rounded-2xl overflow-hidden">

                                {/* Quiz header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                                    <div>
                                        <p className="text-sm font-bold text-white">{attempt.quizId?.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Score minimum : <span className="text-indigo-400">{attempt.quizId?.passingScore}%</span>
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${attempt.passed
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                                        {attempt.passed
                                            ? <><HiCheckCircle size={14} /> {attempt.score}% — Réussi</>
                                            : <><HiXCircle size={14} /> {attempt.score}% — Échoué</>}
                                    </div>
                                </div>

                                {/* Questions detail */}
                                <div className="px-6 py-4 space-y-4">
                                    {attempt.quizId?.questions?.map((q, qIdx) => {
                                        const userAnswer = attempt.answers?.find(a => a.questionId?.toString() === q._id?.toString());
                                        const selected = userAnswer?.selected?.[0];
                                        const correct = q.correctAnswers?.[0];
                                        const isCorrect = selected === correct;

                                        return (
                                            <div key={qIdx} className="space-y-2">
                                                <p className="text-xs font-semibold text-slate-300">
                                                    Q{qIdx + 1} — {q.question}
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {q.options?.map((opt, oIdx) => {
                                                        const isSelected = opt === selected;
                                                        const isCorrectOpt = opt === correct;

                                                        let style = "border-slate-800 text-slate-500";
                                                        if (isCorrectOpt) style = "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
                                                        else if (isSelected && !isCorrectOpt) style = "border-rose-500/40 bg-rose-500/10 text-rose-400";

                                                        return (
                                                            <div key={oIdx} className={`text-xs px-3 py-2 rounded-xl border flex items-center justify-between gap-2 ${style}`}>
                                                                <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                                                {isCorrectOpt && <HiCheckCircle size={12} className="text-emerald-400 shrink-0" />}
                                                                {isSelected && !isCorrectOpt && <HiXCircle size={12} className="text-rose-400 shrink-0" />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Link to="/student/cours"
                    className="block w-full py-3 rounded-xl text-sm font-bold text-white text-center bg-indigo-600 hover:bg-indigo-500 transition-all">
                    Retour aux cours
                </Link>
            </div>
        </div>
    );
}