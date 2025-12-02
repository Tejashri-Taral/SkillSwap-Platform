import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { skillsAPI } from '../api/skills';
import SkillCard from '../components/skills/SkillCard';
import AddSkillModal from '../components/skills/AddSkillModal';

const SkillsPage = () => {
  const { user } = useAuth();
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('teach'); // 'teach' or 'learn'

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const [teachData, learnData] = await Promise.all([
        skillsAPI.getTeachSkills(),
        skillsAPI.getLearnSkills()
      ]);
      setTeachSkills(teachData);
      setLearnSkills(learnData);
    } catch (error) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (skillData, type) => {
    try {
      if (type === 'teach') {
        await skillsAPI.addTeachSkill(skillData);
        toast.success('Skill added to teach list');
      } else {
        await skillsAPI.addLearnSkill(skillData);
        toast.success('Skill added to learn list');
      }
      fetchSkills();
      setShowAddModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId, type) => {
    try {
      if (type === 'teach') {
        await skillsAPI.removeTeachSkill(skillId);
        toast.success('Skill removed from teach list');
      } else {
        await skillsAPI.removeLearnSkill(skillId);
        toast.success('Skill removed from learn list');
      }
      fetchSkills();
    } catch (error) {
      toast.error('Failed to remove skill');
    }
  };

  const styles = {
    page: {
      padding: '2rem 0',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: 'var(--text-primary)',
    },
    section: {
      marginBottom: '3rem',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: 'var(--text-primary)',
    },
    addButton: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    skillsGrid: {
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
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '3rem',
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
        <h1 style={styles.title}>My Skills</h1>
        <p>Manage skills you can teach and want to learn</p>
      </div>

      {/* Teach Skills Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Skills I Can Teach</h2>
          <button
            style={styles.addButton}
            onClick={() => {
              setModalType('teach');
              setShowAddModal(true);
            }}
          >
            + Add Teaching Skill
          </button>
        </div>
        
        {teachSkills.length > 0 ? (
          <div style={styles.skillsGrid}>
            {teachSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                type="teach"
                onRemove={() => handleRemoveSkill(skill.skill.id, 'teach')}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <h3>No teaching skills added yet</h3>
            <p>Add skills you can teach to start matching with others</p>
            <button
              style={styles.addButton}
              onClick={() => {
                setModalType('teach');
                setShowAddModal(true);
              }}
            >
              Add Your First Teaching Skill
            </button>
          </div>
        )}
      </div>

      {/* Learn Skills Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Skills I Want to Learn</h2>
          <button
            style={styles.addButton}
            onClick={() => {
              setModalType('learn');
              setShowAddModal(true);
            }}
          >
            + Add Learning Skill
          </button>
        </div>
        
        {learnSkills.length > 0 ? (
          <div style={styles.skillsGrid}>
            {learnSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                type="learn"
                onRemove={() => handleRemoveSkill(skill.skill.id, 'learn')}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <h3>No learning skills added yet</h3>
            <p>Add skills you want to learn to find teachers</p>
            <button
              style={styles.addButton}
              onClick={() => {
                setModalType('learn');
                setShowAddModal(true);
              }}
            >
              Add Your First Learning Skill
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddSkillModal
          type={modalType}
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => handleAddSkill(data, modalType)}
        />
      )}
    </div>
  );
};

export default SkillsPage;