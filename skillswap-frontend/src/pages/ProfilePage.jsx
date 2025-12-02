import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This would call an API endpoint to update user
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({
        ...user,
        ...formData,
      });
      
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      padding: '2rem 0',
    },
    header: {
      marginBottom: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: 'var(--text-primary)',
    },
    profileContainer: {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '3rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
      },
    },
    profileSidebar: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: 'var(--shadow-sm)',
    },
    avatar: {
      width: '120px',
      height: '120px',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3rem',
      fontWeight: 'bold',
      margin: '0 auto 1.5rem',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    star: {
      color: '#f59e0b',
    },
    joinDate: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      marginTop: '0.5rem',
    },
    profileContent: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: 'var(--shadow-sm)',
    },
    section: {
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid var(--border-color)',
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
      transition: 'border-color 0.2s ease',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      minHeight: '120px',
      resize: 'vertical',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
    },
    saveButton: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
    },
    cancelButton: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
    },
    editButton: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.75rem 0',
      borderBottom: '1px solid var(--border-color)',
    },
    infoLabel: {
      fontWeight: 500,
      color: 'var(--text-secondary)',
    },
    infoValue: {
      color: 'var(--text-primary)',
    },
  };

  if (!user) {
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
        <h1 style={styles.title}>My Profile</h1>
        {!editMode && (
          <button
            style={styles.editButton}
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div style={styles.profileContainer}>
        {/* Sidebar */}
        <div style={styles.profileSidebar}>
          <div style={styles.avatar}>
            {user.firstName?.[0] || 'U'}
          </div>
          <h2>{user.firstName} {user.lastName}</h2>
          <div style={styles.rating}>
            {'★'.repeat(Math.floor(user.rating || 0))}
            {'☆'.repeat(5 - Math.floor(user.rating || 0))}
            <span>({user.rating || 0})</span>
          </div>
          <p>{user.bio || 'No bio provided'}</p>
          <div style={styles.joinDate}>
            Member since {new Date().getFullYear()}
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.profileContent}>
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Personal Information</h2>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    disabled
                  />
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Email cannot be changed
                  </small>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="Tell others about yourself and your interests..."
                    maxLength={500}
                  />
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  style={styles.saveButton}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || '',
                      bio: user.bio || '',
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Personal Information</h2>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>First Name:</span>
                  <span style={styles.infoValue}>{user.firstName}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Last Name:</span>
                  <span style={styles.infoValue}>{user.lastName}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Email:</span>
                  <span style={styles.infoValue}>{user.email}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Bio:</span>
                  <span style={styles.infoValue}>{user.bio || 'Not provided'}</span>
                </div>
              </div>

              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Account Information</h2>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Member Since:</span>
                  <span style={styles.infoValue}>{new Date().getFullYear()}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>User Rating:</span>
                  <span style={styles.infoValue}>
                    {user.rating || 0} / 5.0
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;