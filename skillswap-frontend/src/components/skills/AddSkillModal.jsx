import React, { useState } from 'react';

const AddSkillModal = ({ type, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    skillName: '',
    category: '',
    description: '',
    level: 1,
    goal: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '2rem',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto',
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
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: 'var(--text-secondary)',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 500,
      color: 'var(--text-primary)',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      backgroundColor: 'white',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
    },
    submitButton: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      flex: 1,
    },
    cancelButton: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      flex: 1,
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            Add {type === 'teach' ? 'Teaching' : 'Learning'} Skill
          </h2>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Skill Name *</label>
            <input
              type="text"
              name="skillName"
              value={formData.skillName}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., React.js, Photoshop, Guitar"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select category</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Music">Music</option>
              <option value="Language">Language</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Brief description of the skill..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              {type === 'teach' ? 'Proficiency Level' : 'Current Level'} *
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="1">Beginner (1 star)</option>
              <option value="2">Intermediate (2 stars)</option>
              <option value="3">Advanced (3 stars)</option>
              <option value="4">Expert (4 stars)</option>
              <option value="5">Master (5 stars)</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              {type === 'teach' ? 'Teaching Experience' : 'Learning Goal'}
            </label>
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              style={styles.input}
              placeholder={
                type === 'teach'
                  ? 'e.g., Taught 5 students, 2 years experience'
                  : 'e.g., Want to build a portfolio website'
              }
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="button" style={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;