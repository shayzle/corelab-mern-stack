import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { HiArrowLeft, HiArrowRight, HiChevronLeft, HiPlay, HiCheckCircle } from "react-icons/hi2";

export default function LessonPage() {
    const { courseId } = useParams();
    const token = localStorage.getItem("token");

    const [lessons, setLessons] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResult, setQuizResult] = useState(null);
    const [quizPending, setQuizPending] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await axios.get(`http://localhost:4242/api/courses/${courseId}/lessons`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLessons(res.data.lessons);

                const progressRes = await axios.get(`http://localhost:4242/api/progress/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (progressRes.data.progress) {
                    setCurrentIndex(progressRes.data.progress.lastLessonIndex);
                }
            } catch (error) {
                console.error("Error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [courseId, token]);

    const saveProgress = async (newIndex, lessonId) => {
        try {
            await axios.post(`http://localhost:4242/api/progress/${courseId}`,
                {
                    lastLessonIndex: newIndex,
                    lessonId,
                    totalLessons: lessons.length
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de la progression");
        }
    };

    const submitQuiz = async () => {
        const quiz = activeQuiz;
        let correct = 0;

        quiz.questions.forEach((q, i) => {
            if (quizAnswers[i] === q.correctAnswers[0]) correct++;
        });

        const score = Math.round((correct / quiz.questions.length) * 100);
        const passed = score >= quiz.passingScore;

        // Enregistrer l'attempt
        await axios.post(`/api/attempts`, {
            quizId: quiz._id,
            score,
            passed,
            answers: quiz.questions.map((q, i) => ({
                questionId: q._id,
                selected: [quizAnswers[i]]
            }))
        }, { headers: { Authorization: `Bearer ${token}` } });

        setQuizResult({ score, passed, passingScore: quiz.passingScore });
    };

    const handleNext = async () => {
        const finishedLessonId = lessons[currentIndex]._id;

        try {
            const res = await axios.get(`/api/quizzes/lesson/${finishedLessonId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.quizzes && res.data.quizzes.length > 0) {
                setQuizPending(res.data.quizzes[0]);
                return;
            }
        } catch (error) {
            console.error("Erreur quiz", error);
        }

        if (currentIndex === lessons.length - 1) {
            saveProgress(currentIndex, finishedLessonId);
            navigate(`/student/cours/${courseId}/completed`);
            return;
        }

        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        saveProgress(newIndex, finishedLessonId);
    };

    const handlePrev = () => {
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        saveProgress(newIndex, lessons[newIndex]._id);
    };

    const handleJump = (index) => {
        setCurrentIndex(index);
        saveProgress(index, lessons[index]._id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070913] flex flex-col items-center justify-center gap-4 text-white">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium">Chargement de votre leçon...</p>
            </div>
        );
    }

    if (lessons.length === 0) {
        return (
            <div className="min-h-screen bg-[#070913] flex flex-col items-center justify-center p-6 text-center text-slate-200">
                <div className="w-16 h-16 bg-[#111327] border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-xl">
                    <HiPlay size={32} />
                </div>
                <h2 className="text-xl font-bold text-white">Aucune leçon disponible</h2>
                <p className="text-slate-400 text-sm mt-1 max-w-xs">Ce cours n'a pas encore de contenu publié.</p>
                <Link to="/student/cours" className="mt-6 text-xs font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors uppercase tracking-wider bg-[#111327] px-4 py-2.5 rounded-xl border border-slate-800">
                    <HiChevronLeft size={16} /> Retour aux cours
                </Link>
            </div>
        );
    }

    const currentLesson = lessons[currentIndex];
    const progressPercent = Math.round(((currentIndex) / lessons.length) * 100);

    return (
        <div className="min-h-screen bg-[#070913] flex flex-col lg:flex-row antialiased font-sans text-slate-200">

            <div className="flex-1 flex flex-col min-w-0 relative">

                <header className="bg-[#0b0d1b] border-b border-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-md">
                    <div className="flex items-center gap-4 min-w-0">
                        <Link
                            to="/student/cours"
                            className="p-2.5 text-slate-400 hover:text-white bg-[#111327] border border-slate-800/60 rounded-xl transition-all"
                            title="Retour aux cours"
                        >
                            <HiChevronLeft size={18} />
                        </Link>
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold text-[#a582ff] uppercase tracking-widest block mb-0.5">
                                Leçon {currentIndex + 1} sur {lessons.length}
                            </span>
                            <h1 className="text-base font-bold text-white tracking-tight truncate">
                                {currentLesson.title}
                            </h1>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 bg-[#111327] px-4 py-2 rounded-xl border border-slate-800/40">
                        <span className="text-[11px] font-bold tracking-wide text-slate-400">{progressPercent}% complété</span>
                        <div className="w-20 bg-[#1a1d36] h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-linear-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-6 py-10 md:px-12 lg:px-16 max-w-4xl mx-auto w-full pb-32">
                    <article className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-strong:text-white prose-img:rounded-2xl border border-transparent">
                        <div
                            className="space-y-4 text-slate-300 selection:bg-indigo-500/30"
                            dangerouslySetInnerHTML={{ __html: currentLesson.htmlContent }}
                        />
                    </article>
                </main>

                <footer className="bg-[#0b0d1b] border-t border-slate-900 p-4 fixed bottom-0 left-0 right-0 lg:right-80 shadow-2xl z-20 flex items-center justify-between transition-all">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-800 bg-[#111327] text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-20 disabled:hover:bg-[#111327] disabled:hover:text-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        <HiArrowLeft size={14} />
                        Précédent
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
                    >
                        {currentIndex === lessons.length - 1 ? "Terminer le cours" : "Leçon suivante"}
                        <HiArrowRight size={14} />
                    </button>
                </footer>
            </div>

            <aside className="w-full lg:w-80 bg-[#111327] border-t lg:border-t-0 lg:border-l border-slate-900 flex flex-col h-auto lg:h-screen sticky top-0 overflow-y-auto z-10 shadow-2xl">
                <div className="p-6 border-b border-slate-900 bg-[#0d0f1f]">
                    <h3 className="font-bold text-white text-sm tracking-tight">Sommaire du cours</h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-1">{lessons.length} chapitres au total</p>
                </div>

                <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
                    {lessons.map((lesson, index) => {
                        const isActive = index === currentIndex;
                        const isCompleted = index < currentIndex;

                        return (
                            <button
                                key={lesson._id || index}
                                onClick={() => handleJump(index)}
                                className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all border ${isActive
                                    ? "bg-[#171a33] text-white font-semibold border-indigo-500/20 shadow-inner"
                                    : "hover:bg-[#151730]/40 text-slate-400 hover:text-slate-200 border-transparent"
                                    }`}
                            >
                                <div className="shrink-0 flex items-center justify-center">
                                    {isCompleted ? (
                                        <HiCheckCircle size={18} className="text-emerald-500" />
                                    ) : isActive ? (
                                        <div className="w-4.5 h-4.5 rounded-full border-2 border-indigo-500 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                        </div>
                                    ) : (
                                        <div className="w-4.5 h-4.5 rounded-full border border-slate-800 bg-[#0d0f1f] flex items-center justify-center text-[9px] text-slate-500 font-bold">
                                            {index + 1}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className={`text-xs leading-snug line-clamp-2 ${isActive ? "text-white font-bold" : "text-slate-400 font-medium"}`}>
                                        {lesson.title}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {quizPending && !activeQuiz && (
                <div className="fixed inset-0 bg-[#070913]/90 z-50 flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-[#111327] rounded-2xl p-8 text-center space-y-6 border border-indigo-500/20">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto">
                            <span className="text-3xl">📝</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-white">Quiz à venir</h2>
                            <p className="text-slate-400 text-sm">
                                La prochaine étape est un quiz — <span className="text-indigo-400 font-semibold">{quizPending.title}</span>.
                                Vous devez obtenir au moins <span className="text-indigo-400 font-semibold">{quizPending.passingScore}%</span> pour continuer.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setQuizPending(null)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400 border border-slate-800 hover:bg-slate-800 transition">
                                Relire la leçon
                            </button>
                            <button onClick={() => { setActiveQuiz(quizPending); setQuizPending(null); }}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition">
                                Commencer le quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeQuiz && !quizResult && (
                <div className="fixed inset-0 bg-[#070913] z-50 overflow-y-auto p-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h2 className="text-xl font-bold text-white">{activeQuiz.title}</h2>
                        {activeQuiz.questions.map((q, i) => (
                            <div key={i} className="bg-[#111327] rounded-xl p-6 space-y-3">
                                <p className="text-sm font-semibold text-white">{q.question}</p>
                                {q.options.map((opt, j) => (
                                    <button key={j}
                                        onClick={() => setQuizAnswers(prev => ({ ...prev, [i]: opt }))}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all ${quizAnswers[i] === opt ? "border-indigo-500 bg-indigo-500/10 text-white" : "border-slate-800 text-slate-400 hover:border-slate-600"}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ))}
                        <button onClick={submitQuiz}
                            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition">
                            Soumettre le quiz
                        </button>
                    </div>
                </div>
            )}

            {quizResult && (
                <div className="fixed inset-0 bg-[#070913] z-50 flex flex-col items-center justify-center p-8">
                    <div className="max-w-md w-full bg-[#111327] rounded-2xl p-8 text-center space-y-4 border border-slate-800">
                        <p className="text-4xl font-black text-white">{quizResult.score}%</p>
                        <p className={`text-sm font-bold ${quizResult.passed ? "text-emerald-400" : "text-rose-400"}`}>
                            {quizResult.passed ? "Quiz réussi ✓" : `Échec — minimum requis : ${quizResult.passingScore}%`}
                        </p>
                        <button onClick={() => {
                            setActiveQuiz(null);
                            setQuizResult(null);
                            setQuizAnswers({});
                            if (quizResult.passed) {
                                const finishedLessonId = lessons[currentIndex]._id;
                                if (currentIndex === lessons.length - 1) {
                                    saveProgress(currentIndex, finishedLessonId);
                                    navigate(`/student/cours/${courseId}/completed`);
                                } else {
                                    const newIndex = currentIndex + 1;
                                    setCurrentIndex(newIndex);
                                    saveProgress(newIndex, finishedLessonId);
                                }
                            }
                        }}
                            className={`w-full py-3 rounded-xl text-sm font-bold text-white transition ${quizResult.passed ? "bg-emerald-600 hover:bg-emerald-500" : "bg-rose-600 hover:bg-rose-500"}`}>
                            {quizResult.passed ? "Continuer" : "Réessayer"}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}