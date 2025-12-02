import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teachSkills: 0,
    learnSkills: 0,
    matches: 0,
    pendingRequests: 0,
    upcomingSessions: 0
  });

  useEffect(() => {
    // This will be populated from API calls later
    // For now, show placeholder stats
    setStats({
      teachSkills: 3,
      learnSkills: 2,
      matches: 5,
      pendingRequests: 2,
      upcomingSessions: 1
    });
  }, []);

  const styles = {
    dashboard: {
      padding: '2rem 0',
    },
    welcomeCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      marginBottom: '2rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '1.5rem',
      textAlign: 'center',
      boxShadow: 'var(--shadow-sm)',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: 'var(--primary-color)',
      marginBottom: '0.5rem',
    },
    statLabel: {
      color: 'var(--text-secondary)',
      fontSize: '0.875rem',
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    actionCard: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '1.5rem',
      textAlign: 'center',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
    }
  };

  return (
    <div className="container" style={styles.dashboard}>
      <div style={styles.welcomeCard}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          Welcome back, {user?.firstName}!
        </h1>
        <p>Ready to swap some skills today?</p>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Your Stats</h2>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.teachSkills}</div>
          <div style={styles.statLabel}>Skills to Teach</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.learnSkills}</div>
          <div style={styles.statLabel}>Skills to Learn</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.matches}</div>
          <div style={styles.statLabel}>Potential Matches</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.pendingRequests}</div>
          <div style={styles.statLabel}>Pending Requests</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.upcomingSessions}</div>
          <div style={styles.statLabel}>Upcoming Sessions</div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={styles.quickActions}>
        <div 
          style={styles.actionCard}
          onClick={() => window.location.href = '/skills'}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--primary-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <h3>Add Skills</h3>
          <p>Add skills you can teach or want to learn</p>
        </div>
        <div 
          style={styles.actionCard}
          onClick={() => window.location.href = '/matches'}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--primary-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <h3>Find Matches</h3>
          <p>Discover users with matching skills</p>
        </div>
        <div 
          style={styles.actionCard}
          onClick={() => window.location.href = '/sessions'}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--primary-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <h3>View Sessions</h3>
          <p>Check your upcoming skill swap sessions</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;