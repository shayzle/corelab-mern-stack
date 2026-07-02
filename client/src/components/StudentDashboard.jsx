import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SidebarStudent from "./SidebarStudent";
import ChangePasswordModal from "./ChangePasswordModal";
import { HiAcademicCap, HiClock, HiArrowRight, HiCheckCircle, HiPlay, HiMagnifyingGlass, HiBell } from "react-icons/hi2";
import { SiN8N } from "react-icons/si";

export default function StudentDashboard() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || {});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [lessonsCount, setLessonsCount] = useState({});

  const handleClick = (courseId) => {
    navigate(`/student/cours/${courseId}/lessons`);
  };

  const handlePasswordChanged = () => {
    const updatedUser = { ...user, isFirstLogin: false };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const fetchProgress = async (courseId) => {
    try {
      const res = await axios.get(`/api/progress/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourseProgress(prev => ({
        ...prev,
        [courseId]: res.data.progress
          ? Math.round((res.data.progress.completedLessons.length / res.data.progress.totalLessons) * 100)
          : 0
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération de la progression", error);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      const res = await axios.get(`/api/courses/${courseId}/lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLessonsCount(prev => ({
        ...prev,
        [courseId]: res.data.lessons.length
      }));
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get('/api/courses/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedCourses = res.data.courses;
      setCourses(fetchedCourses);

      fetchedCourses.forEach(course => {
        fetchProgress(course._id);
        fetchLessons(course._id);
      });
    };

    fetchCourses();
  }, []);

  const activeCourses = courses.filter(course => {
    const progress = courseProgress[course._id] ?? 0;
    return progress > 0 && progress < 100;
  });

  const completedCourses = courses.filter(course => {
    const progress = courseProgress[course._id] ?? 100;
    return progress === 100;
  });

  const totalCoursesCount = courses.length;
  const completedCoursesCount = completedCourses.length;
  const notStartedCount = totalCoursesCount - (activeCourses.length + completedCoursesCount);

  // Date
  const today = new Date();

  const formattedDate = today.toLocaleDateString('fr-FR', {
    weekday: 'long',  
    day: 'numeric',   
    month: 'long'     
  });

  const finalDateStr = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="flex min-h-screen bg-[#070913] font-sans antialiased relative text-slate-200">
      <ChangePasswordModal
        user={user}
        token={token}
        onPasswordChanged={handlePasswordChanged}
      />

      <SidebarStudent />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                ESPACE APPRENANT · {finalDateStr}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Bonjour, <span className="text-[#a582ff]">{user.firstname}</span>.
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-emerald-500/5 group-hover:scale-110 transition-transform duration-300">
                <HiCheckCircle size={90} />
              </div>
              <div className="text-emerald-400 bg-emerald-500/10 w-7 h-7 rounded-lg flex items-center justify-center">
                <HiCheckCircle size={16} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{completedCoursesCount}/{courses.length}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Terminés</p>
              </div>
            </div>

            <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-amber-500/5 group-hover:scale-110 transition-transform duration-300">
                <HiPlay size={90} />
              </div>
              <div className="text-amber-400 bg-amber-500/10 w-7 h-7 rounded-lg flex items-center justify-center">
                <HiPlay size={16} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{activeCourses.length}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">En cours</p>
              </div>
            </div>

            <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-indigo-500/5 group-hover:scale-110 transition-transform duration-300">
                <HiAcademicCap size={90} />
              </div>
              <div className="text-indigo-400 bg-indigo-500/10 w-7 h-7 rounded-lg flex items-center justify-center">
                <HiAcademicCap size={16} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{notStartedCount}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">À débuter</p>
              </div>
            </div>

          </div>


          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse"></span>
              <h2 className="text-sm font-bold tracking-wide text-slate-200 uppercase">
                En cours d'apprentissage
                <span className="ml-2 px-2 py-0.5 text-[10px] bg-[#1a1d35] text-indigo-400 rounded-md border border-indigo-500/20">
                  {activeCourses.length}
                </span>
              </h2>
            </div>

            {activeCourses.length === 0 ? (
              <div className="text-center py-16 bg-[#111327]/30 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                Aucun cours en cours actuellement. Lancez un nouveau cours pour le voir apparaître ici !
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCourses.map((course) => {
                  const progress = courseProgress[course._id] ?? 0;
                  return (
                    <div key={course._id} className="group bg-linear-to-b from-[#111327] to-[#0d0f1f] border border-slate-800/70 rounded-2xl p-6 flex flex-col justify-between min-h-60 hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/30 to-transparent"></div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md px-2.5 py-1">
                            {course.category || "AUTOMATISATION"}
                          </span>
                          <div className="w-8 h-8 rounded-xl bg-[#171a35] border border-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                            {course.isSpecial ? <SiN8N size={14} /> : <HiAcademicCap size={16} />}
                          </div>
                        </div>

                        <h3 className="font-bold text-white text-[15px] leading-snug tracking-tight line-clamp-2 pr-2">
                          {course.title}
                        </h3>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <HiAcademicCap size={14} className="text-slate-600" />
                            {lessonsCount[course._id] ?? 0} leçons
                          </span>
                          <span className="flex items-center gap-1">
                            <HiClock size={13} className="text-slate-600" />
                            8 h
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold tracking-wide">
                            <span className="text-slate-500 uppercase">Progression</span>
                            <span className="text-indigo-400">{progress}%</span>
                          </div>
                          <div className="w-full bg-[#171a33] h-1.25 rounded-full overflow-hidden border border-slate-900">
                            <div className="bg-[#6366f1] h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                          </div>
                        </div>

                        <button
                          onClick={() => handleClick(course._id)}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold bg-[#171a33] text-slate-300 hover:bg-[#202449] hover:text-white border border-slate-800/80 transition-all duration-200"
                        >
                          Continuer
                          <HiArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-5 pt-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
              <h2 className="text-sm font-bold tracking-wide text-slate-200 uppercase">
                Cours terminés
                <span className="ml-2 px-2 py-0.5 text-[10px] bg-[#0f2425] text-emerald-400 rounded-md border border-emerald-500/20">
                  {completedCoursesCount}
                </span>
              </h2>
            </div>

            {completedCoursesCount === 0 ? (
              <div className="text-center py-16 bg-[#111327]/30 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                Vos cours complétés à 100% s'afficheront ici. Donnez le meilleur de vous-même ! 💪
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <div key={course._id} className="group bg-linear-to-b from-[#111327] to-[#0d0f1f] border border-slate-800/70 rounded-2xl p-6 flex flex-col justify-between min-h-60 hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-emerald-500/30 to-transparent"></div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md px-2.5 py-1">
                          {course.category || "DEVELOPPEMENT WEB"}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-[#0f2425] flex items-center justify-center text-emerald-400">
                          <HiCheckCircle size={16} />
                        </div>
                      </div>

                      <h3 className="font-bold text-white text-[15px] leading-snug tracking-tight line-clamp-2 pr-2">
                        {course.title}
                      </h3>
                    </div>

                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <HiAcademicCap size={14} className="text-slate-600" />
                          {lessonsCount[course._id] ?? 0} leçons
                        </span>
                        <span className="flex items-center gap-1">
                          <HiClock size={13} className="text-slate-600" />
                          12 h
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold tracking-wide">
                          <span className="text-slate-500 uppercase">Terminé</span>
                          <span className="text-emerald-400">100%</span>
                        </div>
                        <div className="w-full bg-[#0f2425]/40 h-1.25 rounded-full overflow-hidden border border-slate-900">
                          <div className="bg-[#10b981] h-full rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>

                      <button
                        onClick={() => handleClick(course._id)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold bg-[#0f2425]/40 text-emerald-400 hover:bg-[#0f2425] hover:text-emerald-300 border border-emerald-500/20 transition-all duration-200"
                      >
                        Revoir
                        <HiArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}