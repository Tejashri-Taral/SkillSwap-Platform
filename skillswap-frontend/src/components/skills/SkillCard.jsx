import React from 'react';

const SkillCard = ({ skill, type, onRemove }) => {
  const styles = {
    card: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.3s ease',
      border: type === 'teach' ? '2px solid #10b981' : '2px solid #3b82f6',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
    },
    skillName: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'var(--text-primary)',
    },
    badge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    teachBadge: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
    },
    learnBadge: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    },
    category: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-secondary)',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      display: 'inline-block',
      marginBottom: '1rem',
    },
    description: {
      color: 'var(--text-secondary)',
      marginBottom: '1rem',
      fontSize: '0.875rem',
    },
    level: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    levelLabel: {
      color: 'var(--text-secondary)',
      fontSize: '0.875rem',
    },
    stars: {
      color: '#f59e0b',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '1rem',
    },
    removeButton: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.skillName}>{skill.skill.name}</h3>
        <span style={{
          ...styles.badge,
          ...(type === 'teach' ? styles.teachBadge : styles.learnBadge)
        }}>
          {type === 'teach' ? 'Teaching' : 'Learning'}
        </span>
      </div>
      
      {skill.skill.category && (
        <span style={styles.category}>{skill.skill.category}</span>
      )}
      
      {skill.skill.description && (
        <p style={styles.description}>{skill.skill.description}</p>
      )}
      
      <div style={styles.level}>
        <span style={styles.levelLabel}>
          {type === 'teach' ? 'Proficiency:' : 'Current Level:'}
        </span>
        <span style={styles.stars}>
          {'★'.repeat(skill.level || 1)}
          {'☆'.repeat(5 - (skill.level || 1))}
        </span>
      </div>
      
      {skill.goal && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <strong>Goal:</strong> {skill.goal}
        </p>
      )}
      
      <div style={styles.footer}>
        <button style={styles.removeButton} onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default SkillCard;