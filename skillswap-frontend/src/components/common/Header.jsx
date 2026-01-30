import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import React from 'react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const styles = {
    header: {
      backgroundColor: 'var(--bg-primary)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.5rem 0',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 0',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'var(--primary-color)',
      textDecoration: 'none',
    },
    navLinks: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center',
    },
    navLink: {
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '0.95rem',
      padding: '0.5rem 0',
      position: 'relative',
    },
    navLinkActive: {
      color: 'var(--primary-color)',
    },
    userDropdown: {
      position: 'relative',
    },
    userBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: 'none',
      border: '1px solid var(--border-color)',
      borderRadius: '2rem',
      cursor: 'pointer',
      fontSize: '0.95rem',
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: '0.9rem',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '0.125rem', // keep it very close to avoid a gap that causes flicker
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      boxShadow: 'var(--shadow-lg)',
      minWidth: '180px',
      zIndex: 1000
    },
    dropdownItem: {
      display: 'block',
      padding: '0.75rem 1rem',
      color: 'var(--text-primary)',
      textDecoration: 'none',
      fontSize: '0.9rem',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
    },
    themeToggle: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
      color: 'var(--text-secondary)',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '0.5rem',
    },
  };

  // dropdown visibility + short hide-delay to prevent flicker/gap issues
  const [showDropdown, setShowDropdown] = React.useState(false);
  const hideTimeoutRef = React.useRef(null);

  const handleMouseEnter = () => {
    // cancel any pending hide
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    // add slight delay before hiding so user can move mouse to dropdown and click
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
      hideTimeoutRef.current = null;
    }, 180); // 180ms works well — adjust if you want it shorter/longer
  };

  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <header style={styles.header}>
      <div className="container" style={styles.headerContainer}>
        <Link to="/" style={styles.logo}>
          SkillSwap
        </Link>

        <nav style={styles.navLinks}>
          <Link 
            to="/" 
            style={{
              ...styles.navLink,
              ...(isActive('/') ? styles.navLinkActive : {})
            }}
          >
            Dashboard
          </Link>
          <Link 
            to="/skills" 
            style={{
              ...styles.navLink,
              ...(isActive('/skills') ? styles.navLinkActive : {})
            }}
          >
            My Skills
          </Link>
          <Link 
            to="/matches" 
            style={{
              ...styles.navLink,
              ...(isActive('/matches') ? styles.navLinkActive : {})
            }}
          >
            Matches
          </Link>
          <Link 
            to="/requests" 
            style={{
              ...styles.navLink,
              ...(isActive('/requests') ? styles.navLinkActive : {})
            }}
          >
            Requests
          </Link>
          <Link 
            to="/sessions" 
            style={{
              ...styles.navLink,
              ...(isActive('/sessions') ? styles.navLinkActive : {})
            }}
          >
            Sessions
          </Link>

          <button
            onClick={toggleTheme}
            style={styles.themeToggle}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          {/* User Dropdown */}
          <div
            style={styles.userDropdown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              style={styles.userBtn}
              // also keep it open if the user focuses via keyboard
              onFocus={handleMouseEnter}
              onBlur={handleMouseLeave}
            >
              <div style={styles.userAvatar}>
                {user?.firstName?.[0] || 'U'}
              </div>
              <span>{user?.firstName || 'User'}</span>
            </button>

            <div
              style={{
                ...styles.dropdownMenu,
                display: showDropdown ? 'block' : 'none'
              }}
              // ensure hovering over the menu keeps it open
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link to="/profile" style={styles.dropdownItem}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  ...styles.dropdownItem,
                  color: '#ef4444',
                  borderTop: '1px solid var(--border-color)'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;