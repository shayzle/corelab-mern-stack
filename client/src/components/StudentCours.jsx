import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarStudent from "./SidebarStudent";
import { HiAcademicCap, HiClock, HiArrowRight, HiMagnifyingGlass, HiBell } from "react-icons/hi2";
import { SiN8N } from "react-icons/si";

export default function StudentCours() {
  const user = JSON.parse(localStorage.getItem("user")) || { firstname: "Étudiant" };
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [lessonsCount, setLessonsCount] = useState({});
  const navigate = useNavigate();

  const handleClick = (courseId) => {
    navigate(`/student/cours/${courseId}/lessons`);
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
      console.error("Eurreur lors de la récuperation de la progression");
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

  return (
    <div className="flex min-h-screen bg-[#070913] font-sans antialiased relative text-slate-200">
      <SidebarStudent />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                ESPACE APPRENANT · MON CATALOGUE
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Mes <span className="text-[#a582ff]">Cours</span>
              </h1>
            </div>

            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between h-32 relative overflow-hidden group col-span-1 md:col-span-1">
              <div className="absolute -right-4 -bottom-4 text-indigo-500/5 group-hover:scale-110 transition-transform duration-300">
                <HiAcademicCap size={90} />
              </div>
              <div className="text-indigo-400 bg-indigo-500/10 w-7 h-7 rounded-lg flex items-center justify-center">
                <HiAcademicCap size={16} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {courses.filter((course) => (courseProgress[course._id] ?? 0) < 100).length}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Cours Actifs</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-t border-slate-900 pt-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse"></span>
            <h2 className="text-sm font-bold tracking-wide text-slate-200 uppercase">
              Liste des cours disponibles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter((course) => (courseProgress[course._id] ?? 0) < 100)
              .sort((a, b) => {
                if (a.category !== b.category) {
                  return a.category.localeCompare(b.category);
                }
                return (courseProgress[b._id] ?? 0) - (courseProgress[a._id] ?? 0);
              })
              .map((course) => {
                const progress = courseProgress[course._id] ?? 0;
                return (
                  <div
                    key={course._id}
                    className="group bg-linear-to-b from-[#111327] to-[#0d0f1f] border border-slate-800/70 rounded-2xl p-6 flex flex-col justify-between min-h-60 hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/30 to-transparent"></div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md px-2.5 py-1">
                          {course.category || "FORMATION"}
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
                          <div
                            className="bg-[#6366f1] h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleClick(course._id)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold bg-[#171a33] text-slate-300 hover:bg-[#202449] hover:text-white border border-slate-800/80 transition-all duration-200"
                      >
                        {progress === 0 ? "Commencer" : "Continuer"}
                        <HiArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      </main>
    </div>
  );
}