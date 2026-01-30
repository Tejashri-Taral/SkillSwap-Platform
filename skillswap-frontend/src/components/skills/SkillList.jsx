import React from 'react';
import SkillCard from './SkillCard';

const SkillList = ({ skills, type, onRemove }) => {
  const styles = {
    container: {
      width: '100%',
    },
    header: {
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: 'var(--text-primary)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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

  if (!skills || skills.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h3>No {type} skills added yet</h3>
        <p>
          {type === 'teach' 
            ? 'Add skills you can teach to start matching with others'
            : 'Add skills you want to learn to find teachers'}
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {type === 'teach' ? 'Skills I Can Teach' : 'Skills I Want to Learn'}
        </h2>
      </div>
      
      <div style={styles.grid}>
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            type={type}
            onRemove={() => onRemove(skill.skill.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SkillList;