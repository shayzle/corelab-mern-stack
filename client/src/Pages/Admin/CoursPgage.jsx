import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { HiArrowLeft, HiTrash, HiPencil, HiAcademicCap } from "react-icons/hi2";
import { IoCreateOutline } from "react-icons/io5";

export default function CoursPage() {
    const { courseId } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    const [editLesson, setEditLesson] = useState(null);
    const [editLessonForm, setEditLessonForm] = useState({ title: "", htmlContent: "", availableFrom: "", order: 0 });

    const [editQuiz, setEditQuiz] = useState(null);
    const [editQuizForm, setEditQuizForm] = useState({ title: "", passingScore: 80 });

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
        try {
            const [courseRes, lessonsRes] = await Promise.all([
                axios.get(`/api/courses/${courseId}`, authHeader),
                axios.get(`/api/courses/${courseId}/lessons`, authHeader),
            ]);
            setCourse(courseRes.data.cours);
            const fetchedLessons = lessonsRes.data.lessons;
            setLessons(fetchedLessons);

            const quizResults = await Promise.all(
                fetchedLessons.map(l => axios.get(`/api/quizzes/lesson/${l._id}`, authHeader).catch(() => ({ data: { quizzes: [] } })))
            );
            setQuizzes(quizResults.flatMap(r => r.data.quizzes || []));
        } catch (err) {
            setError("Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [courseId]);

    // Delete lesson
    const deleteLesson = async (id) => {
        if (!window.confirm("Supprimer cette leçon ?")) return;
        try {
            await axios.delete(`/api/lessons/${id}`, authHeader);
            setLessons(prev => prev.filter(l => l._id !== id));
            setStatus("Leçon supprimée");
        } catch (err) {
            setError("Erreur lors de la suppression");
        }
    };

    // Save lesson edit
    const saveLessonEdit = async () => {
        try {
            const res = await axios.patch(`/api/lessons/${editLesson._id}`, editLessonForm, authHeader);
            setLessons(prev => prev.map(l => l._id === editLesson._id ? res.data.lesson : l));
            setEditLesson(null);
            setStatus("Leçon mise à jour");
        } catch (err) {
            setError("Erreur lors de la mise à jour");
        }
    };

    // Delete quiz
    const deleteQuiz = async (id) => {
        if (!window.confirm("Supprimer ce quiz ?")) return;
        try {
            await axios.delete(`/api/quizzes/${id}`, authHeader);
            setQuizzes(prev => prev.filter(q => q._id !== id));
            setStatus("Quiz supprimé");
        } catch (err) {
            setError("Erreur lors de la suppression");
        }
    };

    // Save quiz edit (passingScore only)
    const saveQuizEdit = async () => {
        try {
            const res = await axios.put(`/api/quizzes/${editQuiz._id}`, editQuizForm, authHeader);
            setQuizzes(prev => prev.map(q => q._id === editQuiz._id ? res.data.quiz : q));
            setEditQuiz(null);
            setStatus("Quiz mis à jour");
        } catch (err) {
            setError("Erreur lors de la mise à jour");
        }
    };

    const getQuizzesForLesson = (lessonId) => quizzes.filter(q => q.lessonId === lessonId);

    if (loading) return (
        <div className="flex min-h-screen bg-[#070913]">
            {/* <Sidebar /> */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#070913] font-sans antialiased text-slate-200">
            {/* <Sidebar /> */}

            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/admin/courses")}
                            className="p-2 text-slate-400 hover:text-white bg-[#111327] border border-slate-800 rounded-xl transition-all">
                            <HiArrowLeft size={18} />
                        </button>
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Gestion du cours</span>
                            <h1 className="text-2xl font-bold text-white tracking-tight">{course?.title}</h1>
                        </div>
                    </div>

                    {status && <p className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">{status}</p>}
                    {error && <p className="text-rose-400 text-xs font-medium bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/20">{error}</p>}

                    {/* Lessons */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Leçons ({lessons.length})</h2>
                            <button onClick={() => navigate(`/admin/courses/${courseId}/lessons`)}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all">
                                <IoCreateOutline size={14} />
                                Ajouter une leçon
                            </button>
                        </div>

                        {lessons.length === 0 && (
                            <p className="text-sm text-slate-500 bg-[#111327] rounded-xl p-6 border border-slate-800">Aucune leçon pour ce cours.</p>
                        )}

                        {lessons.map((lesson, index) => {
                            const lessonQuizzes = getQuizzesForLesson(lesson._id);
                            return (
                                <div key={lesson._id} className="bg-[#111327] border border-slate-800/70 rounded-2xl overflow-hidden">

                                    {/* Lesson header */}
                                    <div className="flex items-center justify-between p-5">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-white truncate">{lesson.title}</p>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    {lesson.availableFrom ? `Disponible le ${new Date(lesson.availableFrom).toLocaleDateString("fr-FR")}` : "Disponible immédiatement"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => { setEditLesson(lesson); setEditLessonForm({ title: lesson.title, htmlContent: lesson.htmlContent, availableFrom: lesson.availableFrom || "", order: lesson.order }); }}
                                                className="p-2 text-slate-400 hover:text-white bg-[#171a33] border border-slate-800 rounded-xl transition-all">
                                                <HiPencil size={14} />
                                            </button>
                                            <button onClick={() => deleteLesson(lesson._id)}
                                                className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/5 border border-rose-500/20 rounded-xl transition-all">
                                                <HiTrash size={14} />
                                            </button>
                                            <button onClick={() => navigate(`/admin/courses/${courseId}/lessons/${lesson._id}/manage-quiz`)}
                                                className="px-3 py-2 text-xs font-bold text-indigo-400 hover:text-white hover:bg-indigo-600 bg-indigo-500/10 border border-indigo-500/20 rounded-xl transition-all">
                                                + Quiz
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quizzes for this lesson */}
                                    {lessonQuizzes.length > 0 && (
                                        <div className="border-t border-slate-800/60 px-5 py-4 space-y-3">
                                            {lessonQuizzes.map(quiz => (
                                                <div key={quiz._id} className="flex items-center justify-between bg-[#0d0f1f] rounded-xl px-4 py-3 border border-slate-800/40">
                                                    <div>
                                                        <p className="text-xs font-bold text-white">{quiz.title}</p>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                                            Score minimum : <span className="text-indigo-400 font-bold">{quiz.passingScore}%</span> · {quiz.questions?.length ?? 0} questions
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => { setEditQuiz(quiz); setEditQuizForm({ title: quiz.title, passingScore: quiz.passingScore }); }}
                                                            className="p-2 text-slate-400 hover:text-white bg-[#171a33] border border-slate-800 rounded-xl transition-all">
                                                            <HiPencil size={13} />
                                                        </button>
                                                        <button onClick={() => deleteQuiz(quiz._id)}
                                                            className="p-2 text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/5 border border-rose-500/20 rounded-xl transition-all">
                                                            <HiTrash size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Edit Lesson Modal */}
            {editLesson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-[#111327] border border-slate-800 rounded-2xl w-full max-w-lg mx-4 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <h2 className="font-bold text-white text-sm">Modifier la leçon</h2>
                            <button onClick={() => setEditLesson(null)} className="text-slate-400 hover:text-white text-xl">&times;</button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <input type="text" value={editLessonForm.title}
                                onChange={e => setEditLessonForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Titre"
                                className="w-full bg-[#0d0f1f] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50" />
                            <textarea value={editLessonForm.htmlContent}
                                onChange={e => setEditLessonForm(prev => ({ ...prev, htmlContent: e.target.value }))}
                                placeholder="Contenu HTML"
                                rows={5}
                                className="w-full bg-[#0d0f1f] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none" />
                            <input type="datetime-local" value={editLessonForm.availableFrom}
                                onChange={e => setEditLessonForm(prev => ({ ...prev, availableFrom: e.target.value }))}
                                className="w-full bg-[#0d0f1f] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                            <input type="number" value={editLessonForm.order}
                                onChange={e => setEditLessonForm(prev => ({ ...prev, order: e.target.value }))}
                                placeholder="Ordre"
                                className="w-full bg-[#0d0f1f] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50" />
                        </div>
                        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-2">
                            <button onClick={() => setEditLesson(null)} className="px-4 py-2 text-sm text-slate-400 border border-slate-800 rounded-xl hover:bg-slate-800 transition">Annuler</button>
                            <button onClick={saveLessonEdit} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Quiz Modal */}
            {editQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-[#111327] border border-slate-800 rounded-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <h2 className="font-bold text-white text-sm">Modifier le quiz</h2>
                            <button onClick={() => setEditQuiz(null)} className="text-slate-400 hover:text-white text-xl">&times;</button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <input type="text" value={editQuizForm.title}
                                onChange={e => setEditQuizForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Titre du quiz"
                                className="w-full bg-[#0d0f1f] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50" />
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Score minimum pour réussir (%)</label>
                                <input type="number" min="0" max="100" value={editQuizForm.passingScore}
                                    onChange={e => setEditQuizForm(prev => ({ ...prev, passingScore: Number(e.target.value) }))}
                                    className="w-full bg-[#0d0f1f] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-800 flex justify-end gap-2">
                            <button onClick={() => setEditQuiz(null)} className="px-4 py-2 text-sm text-slate-400 border border-slate-800 rounded-xl hover:bg-slate-800 transition">Annuler</button>
                            <button onClick={saveQuizEdit} className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}