import React from 'react';
import MatchCard from './MatchCard';

const MatchList = ({ matches, onSendRequest }) => {
  const styles = {
    container: {
      width: '100%',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: 'var(--text-primary)',
    },
    count: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '1rem',
      border: '2px dashed var(--border-color)',
    },
  };

  if (!matches || matches.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h3>No matches found</h3>
        <p>Add more skills to your profile to find better matches</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Potential Matches</h2>
        <span style={styles.count}>{matches.length} matches</span>
      </div>
      
      <div style={styles.grid}>
        {matches.map((match) => (
          <MatchCard key={match.user.id} match={match} />
        ))}
      </div>
    </div>
  );
};

export default MatchList;