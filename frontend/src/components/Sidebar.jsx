import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  HelpCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useApplications } from "../contexts/ApplicationContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, // FIXED
  { to: "/applications", label: "Applications", icon: Briefcase },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },

  // NEW AI PAGE
  { to: "/ai-job-match", label: "AI Job Match", icon: Sparkles },
];

const additionalLinks = [
  { to: "/help", label: "Help & Support", icon: HelpCircle },
  { to: "/docs", label: "Documentation", icon: BookOpen },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { stats } = useApplications();

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r shadow-sm flex-col min-h-screen sticky top-0">
      
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center gap-2"> {/* FIXED */}
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">JobTrackr</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              pathname === to
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>

            {to === "/applications" && stats.total > 0 && (
              <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                {stats.total}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Additional Links */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {additionalLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{label}</span>
          </Link>
        ))}
      </div>

      {/* Quick Stats Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-lg m-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{stats.offer}</p>
            <p className="text-xs text-gray-600">Offers</p>
          </div>
        </div>
      </div>

    </aside>
  );
}
