import { NavLink, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { HiAcademicCap, HiArrowLeftOnRectangle } from "react-icons/hi2";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#070913] border-r border-slate-900 text-slate-400 min-h-screen flex flex-col justify-between font-sans antialiased">
      <div>
        <div className="flex items-center gap-3 px-6 py-7 select-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/30">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.174L10.74 3.7a1.665 1.665 0 012.52 0l6.48 6.474m-16.48 0L10.74 16.65a1.665 1.665 0 002.52 0l6.48-6.474M4.26 10.174h15.48" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Alt<span className="text-[#a582ff]">Learn</span>
          </span>
        </div>

        <nav className="px-3 space-y-1">
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#111327] text-white border border-slate-800/60 shadow-md shadow-indigo-500/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`
            }
          >
            <MdDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/student/cours"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#111327] text-white border border-slate-800/60 shadow-md shadow-indigo-500/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`
            }
          >
            <HiAcademicCap size={20} />
            <span>Mes cours</span>
          </NavLink>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-500/80 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all duration-200 text-left"
          >
            <HiArrowLeftOnRectangle size={20} />
            <span>Se déconnecter</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;