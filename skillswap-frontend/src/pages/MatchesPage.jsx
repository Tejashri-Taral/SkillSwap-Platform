import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { matchesAPI } from '../api/matches';
import MatchCard from '../components/matches/MatchCard';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'perfect', 'good'

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await matchesAPI.getMatches();
      setMatches(data);
    } catch (error) {
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'perfect') return match.matchScore >= 8;
    if (filter === 'good') return match.matchScore >= 5 && match.matchScore < 8;
    return true;
  });

  const styles = {
    page: {
      padding: '2rem 0',
    },
    header: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: 'var(--text-primary)',
      marginBottom: '0.5rem',
    },
    filters: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
    },
    filterButton: {
      padding: '0.5rem 1rem',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    activeFilter: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      borderColor: 'var(--primary-color)',
    },
    matchesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '1rem',
      border: '2px dashed var(--border-color)',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '3rem',
    },
    matchCount: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      marginTop: '0.5rem',
    },
  };

  if (loading) {
    return (
      <div className="container" style={styles.page}>
        <div style={styles.loadingContainer}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Potential Matches</h1>
        <p>Find users with complementary skills</p>
        <div style={styles.matchCount}>
          Showing {filteredMatches.length} of {matches.length} matches
        </div>
      </div>

      <div style={styles.filters}>
        <button
          style={{
            ...styles.filterButton,
            ...(filter === 'all' ? styles.activeFilter : {})
          }}
          onClick={() => setFilter('all')}
        >
          All Matches
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filter === 'perfect' ? styles.activeFilter : {})
          }}
          onClick={() => setFilter('perfect')}
        >
          Perfect Matches
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filter === 'good' ? styles.activeFilter : {})
          }}
          onClick={() => setFilter('good')}
        >
          Good Matches
        </button>
      </div>

      {filteredMatches.length > 0 ? (
        <div style={styles.matchesGrid}>
          {filteredMatches.map((match) => (
            <MatchCard key={match.user.id} match={match} />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <h3>No matches found</h3>
          <p>Add more skills to your profile to find better matches</p>
          <button
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginTop: '1rem',
            }}
            onClick={() => window.location.href = '/skills'}
          >
            Add Skills
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;