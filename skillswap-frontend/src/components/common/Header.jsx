import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 0',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'var(--primary-color)',
      textDecoration: 'none',
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
    },
    navLink: {
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'color 0.2s ease',
    },
    navLinkActive: {
      color: 'var(--primary-color)',
    },
    userDropdown: {
      position: 'relative',
      marginLeft: '1rem',
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
      transition: 'all 0.2s ease',
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
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '0.5rem',
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      boxShadow: 'var(--shadow-lg)',
      minWidth: '200px',
      display: 'none',
      zIndex: 1000,
    },
    dropdownItem: {
      display: 'block',
      padding: '0.75rem 1rem',
      color: 'var(--text-primary)',
      textDecoration: 'none',
      transition: 'background-color 0.2s ease',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
    },
    logoutItem: {
      color: '#ef4444',
      borderTop: '1px solid var(--border-color)',
    }
  };

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
          
          <div 
            style={styles.userDropdown}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('.dropdown-menu').style.display = 'block';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector('.dropdown-menu').style.display = 'none';
            }}
          >
            <button style={styles.userBtn}>
              <div style={styles.userAvatar}>
                {user?.firstName?.[0] || 'U'}
              </div>
              <span>{user?.firstName || 'User'}</span>
            </button>
            <div className="dropdown-menu" style={styles.dropdownMenu}>
              <Link to="/profile" style={styles.dropdownItem}>
                Profile
              </Link>
              <button onClick={handleLogout} style={{...styles.dropdownItem, ...styles.logoutItem}}>
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