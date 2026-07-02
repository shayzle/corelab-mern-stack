import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdGroups, MdDashboard } from "react-icons/md"; 
import { SiN8N } from "react-icons/si";
import { HiAcademicCap, HiShieldCheck, HiArrowLeftStartOnRectangle } from "react-icons/hi2";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#070913] border-r border-slate-900 flex flex-col justify-between min-h-screen font-sans antialiased text-slate-400 select-none">
      
      <div>
        <div className="flex flex-col items-center justify-center py-8 px-6 border-b border-slate-950">
          <div className="flex items-center gap-2 tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.174L10.74 3.7a1.665 1.665 0 012.52 0l6.48 6.474m-16.48 0L10.74 16.65a1.665 1.665 0 002.52 0l6.48-6.474M4.26 10.174h15.48" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Alt<span className="text-[#a582ff] ml-0.5">Learn</span>
            </span>
          </div>
          <span className="mt-2 text-[8px] font-bold tracking-[0.25em] text-slate-600 uppercase">
            Learn Modern, Future Modern
          </span>
        </div>

        <div className="px-4 py-6">
          <span className="px-3 text-[10px] font-bold tracking-[0.2em] text-slate-600 uppercase block mb-4">
            Menu principal
          </span>
          
          <nav className="space-y-1.5">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                isActive("/admin/dashboard")
                  ? "bg-[#171a33] text-white border border-indigo-500/20"
                  : "hover:bg-[#111327]/60 hover:text-slate-200 border border-transparent"
              }`}
            >
              <MdDashboard size={18} className={isActive("/admin/dashboard") ? "text-[#a582ff]" : "text-slate-500 group-hover:text-slate-400"} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/dashverifyrequist"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                isActive("/admin/dashverifyrequist")
                  ? "bg-[#171a33] text-white border border-indigo-500/20"
                  : "hover:bg-[#111327]/60 hover:text-slate-200 border border-transparent"
              }`}
            >
              <MdGroups size={18} className={isActive("/admin/dashverifyrequist") ? "text-[#a582ff]" : "text-slate-500 group-hover:text-slate-400"} />
              <span>Système de validation</span>
            </Link>

            <Link
              to="/admin/courses"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                isActive("/admin/courses")
                  ? "bg-[#171a33] text-white border border-indigo-500/20"
                  : "hover:bg-[#111327]/60 hover:text-slate-200 border border-transparent"
              }`}
            >
              <SiN8N size={16} className={isActive("/admin/courses") ? "text-[#a582ff]" : "text-slate-500 group-hover:text-slate-400"} />
              <span>Gestion des cours</span>
            </Link>

            <Link
              to="/admin/students"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                isActive("/admin/students")
                  ? "bg-[#171a33] text-white border border-indigo-500/20"
                  : "hover:bg-[#111327]/60 hover:text-slate-200 border border-transparent"
              }`}
            >
              <HiAcademicCap size={18} className={isActive("/admin/students") ? "text-[#a582ff]" : "text-slate-500 group-hover:text-slate-400"} />
              <span>Liste des élèves</span>
            </Link>

            <Link
              to="/admin/admins"
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                isActive("/admin/admins")
                  ? "bg-[#171a33] text-white border border-indigo-500/20"
                  : "hover:bg-[#111327]/60 hover:text-slate-200 border border-transparent"
              }`}
            >
              <HiShieldCheck size={18} className={isActive("/admin/admins") ? "text-[#a582ff]" : "text-slate-500 group-hover:text-slate-400"} />
              <span>Administrateurs</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-950">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold text-rose-400/90 hover:bg-rose-500/5 hover:text-rose-400 border border-transparent hover:border-rose-500/10 transition-all duration-200 cursor-pointer group"
        >
          <HiArrowLeftStartOnRectangle size={18} className="text-rose-400/60 group-hover:text-rose-400 transition-colors" />
          <span>Se déconnecter</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;