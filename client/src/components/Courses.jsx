import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import ReadMoreParagraph from "./ReadMoreParagraph";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline, MdDashboard } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { HiUserGroup, HiArrowRight, HiAcademicCap } from "react-icons/hi2";
import { SiN8N } from "react-icons/si";
import { useNavigate } from "react-router-dom";

function Courses() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      await handleClickEdit(editingCourse);
      return;
    } else {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.post(
          "/api/courses",
          {
            title,
            description,
            category,
            imageUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setStatus(res.data.message);

        setCourses((prev) => [...prev, res.data.course]);

        setTitle("");
        setDescription("");
        setCategory("");
        setImageUrl("");
      } catch (error) {
        setError(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(res.data.courses);
        setError("");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load courses");
      }
    };

    fetchCourses();
  }, []);

  const handleClickEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `/api/courses/${id}`,
        {
          title,
          description,
          category,
          imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setStatus("Les cours ont été mis à jour avec succès");
      setCourses((prev) =>
        prev.map((course) => (course._id === id ? res.data.course : course)),
      );
      setEditingCourse(null);
      setTitle("");
      setDescription("");
      setCategory("");
      setImageUrl("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Le cours de mise à jour n'est pas réussi",
      );
    }
  };

  const startEdit = (course) => {
    setEditingCourse(course._id);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setImageUrl(course.imageUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickDelete = async (id) => {
    const adminConfirmed = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!adminConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus("Course deleted successfully");

      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete course");
    }
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const finalDateStr =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="flex min-h-screen bg-[#070913] font-sans antialiased relative text-slate-200">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                ESPACE ADMINISTRATION
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Gestion des <span className="text-[#a582ff]">Cours</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-start md:justify-end gap-4 md:gap-6">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 bg-[#121425] px-3.5 py-2 rounded-xl border border-slate-800/80 uppercase">
                {finalDateStr}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <form
              onSubmit={handleSubmit}
              className="bg-linear-to-b from-[#111327] to-[#0d0f1f] border border-slate-800/70 rounded-2xl p-6 lg:col-span-2 space-y-5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/30 to-transparent"></div>

              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <h2 className="font-bold text-white text-[16px] tracking-tight">
                  {editingCourse
                    ? "Modifier le cours"
                    : "Créer un nouveau cours"}
                </h2>
                <div className="w-8 h-8 rounded-xl bg-[#171a35] border border-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <IoCreateOutline size={16} />
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Titre de la formation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-400 focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  <option value="" className="bg-[#121425] text-slate-500">
                    Sélectionner une catégorie
                  </option>
                  <option value="Tech" className="bg-[#121425] text-slate-300">
                    Tech
                  </option>
                  <option
                    value="Culture"
                    className="bg-[#121425] text-slate-300"
                  >
                    Culture
                  </option>
                  <option
                    value="First Aid"
                    className="bg-[#121425] text-slate-300"
                  >
                    First Aid
                  </option>
                  <option value="Other" className="bg-[#121425] text-slate-300">
                    Other
                  </option>
                </select>

                <textarea
                  placeholder="Description détaillée du programme..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                />

                <div className="flex items-center w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-2">
                  <input
                    type="text"
                    placeholder="URL de l'image (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#171a33] text-slate-300 hover:bg-[#202449] hover:text-white border border-slate-800/80 transition-all duration-200"
                >
                  <span>
                    {editingCourse ? "Mettre à jour" : "Enregistrer le cours"}
                  </span>
                  <IoCreateOutline size={14} />
                </button>
              </div>

              {status && (
                <p className="text-emerald-400 text-xs font-medium pt-2">
                  {status}
                </p>
              )}
              {error && (
                <p className="text-rose-400 text-xs font-medium pt-2">
                  {error}
                </p>
              )}
            </form>

            <div className="bg-linear-to-b from-[#111327] to-[#0d0f1f] p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-indigo-500/5 group-hover:scale-110 transition-transform duration-300">
                <HiAcademicCap size={90} />
              </div>
              <div className="text-indigo-400 bg-indigo-500/10 w-7 h-7 rounded-lg flex items-center justify-center">
                <HiAcademicCap size={16} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {courses.length}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Total des cours créés
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 border-t border-slate-900 pt-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse"></span>
              <h2 className="text-sm font-bold tracking-wide text-slate-200 uppercase">
                Catalogues des formations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="group bg-linear-to-b from-[#111327] to-[#0d0f1f] border border-slate-800/70 rounded-2xl p-5 flex flex-col justify-between min-h-85 hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent"></div>

                  <div className="space-y-4">
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-36 object-cover rounded-xl border border-slate-900"
                      />
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md px-2.5 py-1">
                        {course.category}
                      </span>
                      <div className="w-7 h-7 rounded-xl bg-[#171a35] border border-indigo-500/10 flex items-center justify-center text-indigo-400">
                        {course.category === "Tech" ? (
                          <SiN8N size={12} />
                        ) : (
                          <HiAcademicCap size={14} />
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-white text-[15px] tracking-tight line-clamp-1">
                      {course.title}
                    </h3>

                    <div className="text-xs text-slate-500 leading-relaxed block text-justify line-clamp-3">
                      <ReadMoreParagraph text={course.description} />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-5">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => startEdit(course)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#171a33] text-slate-300 hover:bg-[#202449] hover:text-white border border-slate-800/80 transition-all duration-200"
                      >
                        <CiEdit size={14} />
                        Modifier
                      </button>

                      <button
                        onClick={() => handleClickDelete(course._id)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-rose-500/10 transition-all duration-200"
                      >
                        <MdDeleteOutline size={14} />
                        Supprimer
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/admin/courses/${course._id}`)
                      }
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 transition-all duration-200"
                    >
                      Gérer les leçons
                      <HiArrowRight
                        size={12}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-12 bg-linear-to-b from-[#111327] to-[#0d0f1f] rounded-2xl border border-slate-800/60">
                <p className="text-sm text-slate-500">
                  Aucun cours trouvé dans la base de données.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Courses;
