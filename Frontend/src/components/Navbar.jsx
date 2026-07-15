import { useState } from "react";
import { HeartPulse, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = user?.role?.toLowerCase().trim();
  const isLoggedIn = Boolean(user);

  const closeMenu = () => setMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  const navItems = !isLoggedIn
    ? [
        { to: "/", label: "Home" },
        { to: "/#care-model", label: "How it works" },
      ]
    : role === "user"
      ? [
          { to: "/user/dashboard", label: "Overview" },
          { to: "/user/appointments", label: "Care access" },
          { to: "/user/files", label: "Records" },
          { to: "/user/uploads", label: "Upload" },
          { to: "/user/access-history", label: "Activity" },
        ]
      : role === "doctor"
        ? [
            { to: "/doctor/dashboard", label: "Profile" },
            { to: "/doctor/appointments", label: "Appointments" },
          ]
        : [
            { to: "/diagnostic/dashboard", label: "Centre profile" },
            { to: "/diagnostic/orders", label: "Assigned orders" },
          ];

  return (
    <header className="app-navbar">
      <div className="app-navbar-inner">
        <Link to="/" className="app-brand" onClick={closeMenu}>
          <span className="app-brand-mark"><HeartPulse size={19} strokeWidth={2.4} /></span>
          <span>HealthVault</span>
        </Link>

        <button
          className="app-nav-toggle"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`app-nav-content ${menuOpen ? "open" : ""}`}>
          <nav className="app-nav-links" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} onClick={closeMenu} className={isActive(item.to) ? "active" : ""}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="app-nav-actions">
            {isLoggedIn ? (
              <button className="app-logout" onClick={handleLogout}>
                <LogOut size={16} /> Sign out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="app-login-link">Sign in</Link>
                <Link to="/register" onClick={closeMenu} className="btn btn-primary">Create account</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
