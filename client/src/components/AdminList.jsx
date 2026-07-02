import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar";
import {HiUserPlus, HiPencilSquare, HiTrash} from "react-icons/hi2";

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
            Supprimer Utilisateur
          </h2>
          <p className="text-sm text-slate-400">
            Êtes-vous sûr de vouloir supprimer?{" "}
            <span className="font-medium text-slate-200">{name}</span>? Cela ne
            peut pas être annulé.
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

export default function AdminList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [registerForm, setRegisterForm] = useState(emptyForm);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeader = {headers: {Authorization: `Bearer ${token}`}};

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API, authHeader);
      const approvedStudents = res.data.users.filter(
        (u) => u.status === "approved" && u.role === "admin",
      );
      setUsers(approvedStudents);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:4242/api/auth/register", {
        ...registerForm,
        password: "password",
        role: "admin",
        isFirstLogin: false,
      });

      const newUserId = res.data.user.id;

      await axios.patch(
        `http://localhost:4242/api/admin/approve/${newUserId}`,
        {},
        authHeader,
      );

      await axios.patch(
        `http://localhost:4242/api/user/${newUserId}/firstlogin`,
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
                Liste des{" "}
                <span className="text-[#a582ff]">Administrateurs</span>
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
              Ajouter un administrateur
            </button>
          </div>

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
                      <th className="px-6 py-4">Prenom</th>
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
                          Aucun utilisateur trouvé.
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
          title="Enregistrer Un Nouvel Administrateur"
          form={registerForm}
          onChange={setRegisterForm}
          onClose={() => setShowRegisterModal(false)}
          onSave={handleRegister}
          saveLabel="Sauvegarder"
        />
      )}

      {editTarget && (
        <EditModal
          title="Modifier Utilisateur"
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
    </div>
  );
}
