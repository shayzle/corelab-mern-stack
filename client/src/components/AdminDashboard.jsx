import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { HiUserGroup, HiChevronDown, HiChevronUp, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { SiN8N } from "react-icons/si";
import { MdOutlinePendingActions } from "react-icons/md";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, pending: 0, courses: 0 });
  const [students, setStudents] = useState([]);
  const [progresses, setProgresses] = useState({});
  const [attempts, setAttempts] = useState({});
  const [expanded, setExpanded] = useState({});

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, coursesRes, pendingRes, studentsRes] = await Promise.all([
          axios.get("http://localhost:4242/api/user", authHeader),
          axios.get("http://localhost:4242/api/courses", authHeader),
          axios.get("http://localhost:4242/api/admin/pending-users", authHeader),
          axios.get("http://localhost:4242/api/user/students", authHeader),
        ]);

        setStats({
          students: usersRes.data.users.filter(u => u.status === "approved" && u.role === "student").length,
          pending: pendingRes.data.length,
          courses: coursesRes.data.courses.length,
        });

        const fetchedStudents = studentsRes.data.users;
        setStudents(fetchedStudents);

        const progressMap = {};
        const attemptsMap = {};

        await Promise.all(fetchedStudents.map(async (s) => {
          try {
            const res = await axios.get(`http://localhost:4242/api/progress/student/${s._id}`, authHeader);
            const studentProgresses = res.data.progresses;
            progressMap[s._id] = studentProgresses;

            const courseAttempts = {};
            await Promise.all(studentProgresses.map(async (p) => {
              if (!p.courseId?._id) return;
              try {
                const aRes = await axios.get(
                  `http://localhost:4242/api/attempts/student/${s._id}/course/${p.courseId._id}`,
                  authHeader
                );
                courseAttempts[p.courseId._id] = aRes.data.attempts;
              } catch {
                courseAttempts[p.courseId._id] = [];
              }
            }));
            attemptsMap[s._id] = courseAttempts;
          } catch {
            progressMap[s._id] = [];
            attemptsMap[s._id] = {};
          }
        }));

        setProgresses(progressMap);
        setAttempts(attemptsMap);

      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const finalDateStr = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex min-h-screen bg-[#070913] font-sans antialiased relative text-slate-200">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">ESPACE ADMINISTRATION</span>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Tableau de <span className="text-[#a582ff]">Bord</span>
              </h1>
            </div>
            <span className="text-[11px] font-bold tracking-wider text-slate-400 bg-[#121425] px-3.5 py-2 rounded-xl border border-slate-800/80 uppercase">
              {finalDateStr}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-indigo-500/5 group-hover:scale-110 transition-transform duration-300"><HiUserGroup size={90} /></div>
              <div className="text-indigo-400 bg-indigo-500/10 w-7 h-7 rounded-lg flex items-center justify-center"><HiUserGroup size={16} /></div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{stats.students}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Étudiants Approuvés</p>
              </div>
            </div>

            <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-amber-500/5 group-hover:scale-110 transition-transform duration-300"><MdOutlinePendingActions size={90} /></div>
              <div className="text-amber-400 bg-amber-500/10 w-7 h-7 rounded-lg flex items-center justify-center"><MdOutlinePendingActions size={16} /></div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{stats.pending}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Demandes en Attente</p>
              </div>
            </div>

            <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-emerald-500/5 group-hover:scale-110 transition-transform duration-300"><SiN8N size={90} /></div>
              <div className="text-emerald-400 bg-emerald-500/10 w-7 h-7 rounded-lg flex items-center justify-center"><SiN8N size={14} /></div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{stats.courses}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Total des Cours</p>
              </div>
            </div>
          </div>

          {/* Student progress */}
          <div className="space-y-5 border-t border-slate-900 pt-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse"></span>
              <h2 className="text-sm font-bold tracking-wide text-slate-200 uppercase">Progression des étudiants</h2>
            </div>

            {students.length === 0 && (
              <p className="text-sm text-slate-500">Aucun étudiant approuvé.</p>
            )}

            <div className="space-y-3">
              {students.map((student) => {
                const studentProgresses = progresses[student._id] || [];
                const studentAttempts = attempts[student._id] || {};
                const isOpen = expanded[student._id];
                const completedCourses = studentProgresses.filter(p => p.completed).length;

                return (
                  <div key={student._id} className="bg-linear-to-b from-[#111327] to-[#0d0f1f] border border-slate-800/70 rounded-2xl overflow-hidden">

                    {/* Student header */}
                    <button
                      onClick={() => toggleExpand(student._id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/2 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                          {student.firstname?.[0]}{student.lastname?.[0]}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white">{student.firstname} {student.lastname}</p>
                          <p className="text-[11px] text-slate-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs font-bold text-white">{completedCourses}/{studentProgresses.length}</p>
                          <p className="text-[11px] text-slate-500">cours terminés</p>
                        </div>
                        {isOpen ? <HiChevronUp size={16} className="text-slate-400" /> : <HiChevronDown size={16} className="text-slate-400" />}
                      </div>
                    </button>

                    {/* Courses detail */}
                    {isOpen && (
                      <div className="border-t border-slate-800/60 px-5 py-4 space-y-4">
                        {studentProgresses.length === 0 ? (
                          <p className="text-xs text-slate-500">Aucun cours commencé.</p>
                        ) : (
                          studentProgresses.map((p) => {
                            const courseId = p.courseId?._id;
                            const percent = p.totalLessons > 0
                              ? Math.round((p.completedLessons.length / p.totalLessons) * 100)
                              : 0;
                            const courseAttempts = courseId ? (studentAttempts[courseId] || []) : [];
                            const quizPassed = courseAttempts.filter(a => a.passed).length;
                            const avgScore = courseAttempts.length > 0
                              ? Math.round(courseAttempts.reduce((sum, a) => sum + a.score, 0) / courseAttempts.length)
                              : null;

                            return (
                              <div key={p._id} className="bg-[#0d0f1f] rounded-xl border border-slate-800/40 overflow-hidden">

                                {/* Course header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/40">
                                  <div>
                                    <p className="text-xs font-bold text-white">{p.courseId?.title || "Cours supprimé"}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                      {p.completedLessons.length} / {p.totalLessons} leçons
                                    </p>
                                  </div>
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${p.completed
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : percent > 0
                                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                      : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                                    {p.completed ? "Terminé" : percent > 0 ? "En cours" : "Non commencé"}
                                  </span>
                                </div>

                                {/* Progress bar */}
                                <div className="px-4 py-2">
                                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                    <span>Progression leçons</span>
                                    <span>{percent}%</span>
                                  </div>
                                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${p.completed ? "bg-emerald-500" : "bg-indigo-500"}`}
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Quiz results */}
                                {courseAttempts.length > 0 ? (
                                  <div className="px-4 pb-3 space-y-2">
                                    <div className="flex items-center justify-between pt-1">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quiz</p>
                                      {avgScore !== null && (
                                        <p className="text-[10px] font-bold text-slate-400">
                                          Score moyen : <span className="text-white">{avgScore}%</span>
                                        </p>
                                      )}
                                    </div>
                                    {courseAttempts.map((a) => (
                                      <div key={a._id} className="flex items-center justify-between bg-slate-800/40 rounded-lg px-3 py-2">
                                        <p className="text-[11px] text-slate-300">{a.quizId?.title || "Quiz"}</p>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] text-slate-500">min: {a.quizId?.passingScore}%</span>
                                          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${a.passed
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                                            {a.passed
                                              ? <HiCheckCircle size={10} />
                                              : <HiXCircle size={10} />}
                                            {a.score}%
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="px-4 pb-3 text-[11px] text-slate-500">Aucun quiz passé.</p>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}