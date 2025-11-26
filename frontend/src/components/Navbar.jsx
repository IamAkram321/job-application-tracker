import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, LogOut, Bell, Settings, Menu, X, LayoutDashboard, Briefcase, BarChart3, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const mobileLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applications", label: "Applications", icon: Briefcase },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // Navigate to applications page with search query
      navigate(`/applications?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
    setTimeout(() => {
      const input = document.getElementById("navbar-search-input");
      if (input) input.focus();
    }, 100);
  };

  // Keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => {
          const input = document.getElementById("navbar-search-input");
          if (input) input.focus();
        }, 100);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  return (
    <>
      <nav className="bg-white shadow-md px-4 lg:px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl lg:text-2xl font-bold text-blue-600">JobTrackr</h1>
        </div>
      
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        {searchOpen ? (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-blue-500 shadow-lg">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              id="navbar-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              onBlur={() => {
                if (!searchQuery.trim()) {
                  setTimeout(() => setSearchOpen(false), 200);
                }
              }}
              placeholder="Search applications..."
              className="outline-none text-sm w-64 bg-transparent"
              autoFocus
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div 
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
            onClick={handleSearchClick}
          >
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Search...</span>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">⌘K</span>
          </div>
        )}

        {/* Icons */}
        <button 
          className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          onClick={() => alert('Notifications - No new notifications')}
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button 
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          onClick={() => alert('Settings - Settings page coming soon!')}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-800">
              {user?.name || "Guest User"}
            </span>
            <span className="text-xs text-gray-500">
              {user?.email || "Not signed in"}
            </span>
          </div>
          
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
          </div>

          <button
            onClick={logout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">JobTrackr</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {mobileLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    pathname === to
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user?.name || "Guest User"}</p>
                  <p className="text-sm text-gray-500">{user?.email || "Not signed in"}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
