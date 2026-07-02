import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  HiUserPlus,
  HiDocumentArrowDown,
  HiPencilSquare,
  HiTrash,
  HiAcademicCap,
} from "react-icons/hi2";

const API = "http://localhost:4242/api/user";

const emptyForm = {firstname: "", lastname: "", email: ""};

function RegisterModal({title, onClose, onSave, form, onChange, saveLabel}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111327] rounded-2xl shadow-xl w-full max-w-md mx-4 border border-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <h2 className="font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Prenom
            </label>
            <input
              autoFocus
              value={form.firstname}
              onChange={(e) => onChange({...form, firstname: e.target.value})}
              className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Nom de Famille
            </label>
            <input
              value={form.lastname}
              onChange={(e) => onChange({...form, lastname: e.target.value})}
              className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Mail
            </label>
            <input
              value={form.email}
              type="email"
              onChange={(e) => onChange({...form, email: e.target.value})}
              className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-800/60 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 bg-[#121425] border border-slate-800/80 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={!form.firstname.trim() || !form.email.trim()}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:opacity-40 transition-colors"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({title, onClose, onSave, form, onChange, saveLabel}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111327] rounded-2xl shadow-xl w-full max-w-md mx-4 border border-slate-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <h2 className="font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Prenom
            </label>
            <input
              autoFocus
              value={form.firstname}
              onChange={(e) => onChange({...form, firstname: e.target.value})}
              className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Nom de Famille
            </label>
            <input
              value={form.lastname}
              onChange={(e) => onChange({...form, lastname: e.target.value})}
              className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Mail
            </label>
            <input
              value={form.email}
              type="email"
              onChange={(e) => onChange({...form, email: e.target.value})}
              className="w-full bg-[#121425] border border-slate-800/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-800/60 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 bg-[#121425] border border-slate-800/80 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={!form.firstname.trim() || !form.email.trim()}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:opacity-40 transition-colors"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({name, onClose, onConfirm}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111327] rounded-2xl shadow-xl w-full max-w-sm mx-4 border border-slate-800">
        <div className="px-6 py-5">
          <h2 className="font-semibold text-white mb-2">
            Supprimer l'Utilisateur
          </h2>
          <p className="text-sm text-slate-400">
            Êtes-vous sûr de vouloir supprimer ?{" "}
            <span className="font-medium text-slate-200">{name}</span>? Cette
            action est irréversible !
          </p>
        </div>
        <div className="px-6 py-4 border-t border-slate-800/60 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-300 bg-[#121425] border border-slate-800/80 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-rose-600 rounded-xl hover:bg-rose-500 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [registerForm, setRegisterForm] = useState(emptyForm);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [importMessage, setImportMessage] = useState("");

  const [assignTarget, setAssignTarget] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeader = {headers: {Authorization: `Bearer ${token}`}};

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API, authHeader);
      const approvedStudents = res.data.users.filter(
        (u) => u.status === "approved" && u.role === "student",
      );
      setUsers(approvedStudents);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4242/api/courses",
        authHeader,
      );
      setAllCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const handleCSVImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setImportMessage(res.data.message + " (" + res.data.count + ")");
      fetchUsers();
    } catch (err) {
      setImportMessage("Import failed !");
    }
  };

  const openEdit = (u) => {
    setEditTarget(u);
    setEditForm({firstname: u.firstname, lastname: u.lastname, email: u.email});
  };

  const saveEdit = async () => {
    try {
      await axios.patch(`${API}/${editTarget._id}`, editForm, authHeader);
      setEditTarget(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteTarget._id}`, authHeader);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const openAssign = (student) => {
    setAssignTarget(student);
    setSelectedCourses(student.cours || []);
  };

  const toggleCourse = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const saveAssign = async () => {
    try {
      for (const courseId of selectedCourses) {
        await axios.patch(
          `http://localhost:4242/api/courses/${courseId}/assign`,
          {studentIds: [assignTarget._id]},
          authHeader,
        );
      }
      setAssignTarget(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:4242/api/auth/register", {
        ...registerForm,
        password: "password",
        role: "student",
      });

      const newUserId = res.data.user.id;

      await axios.patch(
        `http://localhost:4242/api/admin/approve/${newUserId}`,
        {},
        authHeader,
      );

      setRegisterForm(emptyForm);
      setShowRegisterModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
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
                Liste des <span className="text-[#a582ff]">Étudiants</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-start md:justify-end gap-4 md:gap-6">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 bg-[#121425] px-3.5 py-2 rounded-xl border border-slate-800/80 uppercase">
                {finalDateStr}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
            >
              <HiUserPlus size={16} />
              Ajouter un étudiant
            </button>

            <label className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-200 bg-[#111327] border border-slate-800/70 rounded-xl hover:bg-[#1c1f3f] transition-colors shadow-sm cursor-pointer">
              <HiDocumentArrowDown size={16} />
              Importer JSON/CSV
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleCSVImport}
                className="hidden"
              />
            </label>
          </div>

          {importMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-400">
              {importMessage}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-2" />
              Loading users...
            </div>
          ) : (
            <div className="bg-[#111327] border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-[#151730] border-b border-slate-800 text-slate-300 font-semibold">
                      <th className="px-6 py-4">Prénom</th>
                      <th className="px-6 py-4">Nom de Famille</th>
                      <th className="px-6 py-4">Mail</th>
                      <th className="px-6 py-4 text-center">Modifications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-slate-500"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                    {users
                      .sort((a, b) => a.lastname.localeCompare(b.lastname))
                      .map((u) => (
                        <tr
                          key={u._id}
                          className="hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="px-6 py-3.5 font-medium text-white">
                            {u.firstname}
                          </td>
                          <td className="px-6 py-3.5 text-slate-300">
                            {u.lastname}
                          </td>
                          <td className="px-6 py-3.5 text-slate-400">
                            {u.email}
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEdit(u)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                              >
                                <HiPencilSquare size={14} />
                                Modifier
                              </button>
                              <button
                                onClick={() => setDeleteTarget(u)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                              >
                                <HiTrash size={14} />
                                Supprimer
                              </button>
                              <button
                                onClick={() => openAssign(u)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                              >
                                <HiAcademicCap size={14} />
                                Cours
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {showRegisterModal && (
        <RegisterModal
          title="Inscrivez Un Étudiant"
          form={registerForm}
          onChange={setRegisterForm}
          onClose={() => setShowRegisterModal(false)}
          onSave={handleRegister}
          saveLabel="Enregistrer"
        />
      )}

      {editTarget && (
        <EditModal
          title="Modifier l'Utilisateur"
          form={editForm}
          onChange={setEditForm}
          onClose={() => setEditTarget(null)}
          onSave={saveEdit}
          saveLabel="Sauvegarder"
        />
      )}

      {deleteTarget && (
        <DeleteModal
          name={`${deleteTarget.firstname} ${deleteTarget.lastname}`}
          onClose={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111327] rounded-2xl shadow-xl w-full max-w-md mx-4 border border-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
              <h2 className="font-semibold text-white">
                Assignez des Cours à {assignTarget.firstname}{" "}
                {assignTarget.lastname}
              </h2>
              <button
                onClick={() => setAssignTarget(null)}
                className="text-slate-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>
            <div className="px-6 py-5 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {allCourses.length === 0 && (
                <p className="text-sm text-slate-500">No courses available.</p>
              )}
              {allCourses.map((course) => (
                <label
                  key={course._id}
                  className="flex items-center gap-3 text-sm text-slate-300 bg-[#121425] p-3 rounded-xl border border-slate-800/80 cursor-pointer hover:border-indigo-500/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course._id)}
                    onChange={() => toggleCourse(course._id)}
                    className="accent-indigo-500 rounded w-4 h-4"
                  />
                  {course.title}
                </label>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-800/60 flex justify-end gap-2">
              <button
                onClick={() => setAssignTarget(null)}
                className="px-4 py-2 text-sm text-slate-300 bg-[#121425] border border-slate-800/80 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveAssign}
                className="px-4 py-2 text-sm text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors"
              >
                S'Inscrire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
