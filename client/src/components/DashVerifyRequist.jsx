import axios from "axios";
import {useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import {HiUserPlus, HiAcademicCap, HiUserCircle} from "react-icons/hi2";
import {MdOutlinePendingActions, MdDashboard} from "react-icons/md";

function DashVerifyRequist() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");
  const authHeader = {headers: {Authorization: `Bearer ${token}`}};

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4242/api/admin/pending-users",
          authHeader,
        );
        setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
      } catch (error) {
        console.error(error);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const approveUser = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4242/api/admin/approve/${id}`,
        {},
        authHeader,
      );
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const rejectUser = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4242/api/admin/reject/${id}`,
        {},
        authHeader,
      );
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const students = users.filter((user) => user.role === "student");
  const educationals = users.filter((user) => user.role === "admin");

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
                Demandes d'<span className="text-[#a582ff]">Inscription</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-start md:justify-end gap-4 md:gap-6">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 bg-[#121425] px-3.5 py-2 rounded-xl border border-slate-800/80 uppercase">
                {finalDateStr}
              </span>
            </div>
          </div>

          <div className="space-y-5 border-t border-slate-900 pt-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50 animate-pulse"></span>
              <h2 className="text-sm font-bold tracking-wide text-slate-200 uppercase">
                Demandes à traiter
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((user) => (
                <div
                  key={user._id}
                  className="group bg-linear-to-b from-[#111327] to-[#0d0f1f] border border-slate-800/70 rounded-2xl p-6 flex flex-col justify-between min-h-50 hover:border-slate-700/80 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent"></div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md px-2.5 py-1">
                        {user.role}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-[#171a35] border border-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <HiUserPlus size={16} />
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-[15px] tracking-tight">
                      {user.firstname} {user.lastname.toUpperCase()}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5">
                    <button
                      onClick={() => approveUser(user._id)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-[#171a33] text-emerald-400 hover:bg-emerald-600/10 border border-slate-800/80 transition-all duration-200"
                    >
                      Approuver
                    </button>

                    <button
                      onClick={() => rejectUser(user._id)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 border border-rose-500/10 transition-all duration-200"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="text-center py-12 bg-linear-to-b from-[#111327] to-[#0d0f1f] rounded-2xl border border-slate-800/60">
                <p className="text-sm text-slate-500">
                  Aucune demande d'inscription en attente.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashVerifyRequist;
