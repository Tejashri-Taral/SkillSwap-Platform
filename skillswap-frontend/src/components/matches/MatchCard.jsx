import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { swapRequestsAPI } from '../../api/swapRequests';

const MatchCard = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendRequest = async () => {
    // Updated field names
    if (!match.skillTheyCanTeachYou || !match.skillYouCanTeachThem) {
      toast.error('Cannot send request - no specific skill match found');
      return;
    }

    try {
      setLoading(true);
      await swapRequestsAPI.createRequest({
        receiverId: match.user.id,
        // FIXED: Correct skill mapping
        teachSkillId: match.skillYouCanTeachThem.id, // Skill YOU will teach (You → Them)
        learnSkillId: match.skillTheyCanTeachYou.id, // Skill YOU want to learn (They → You)
        message: message || `Hi! I'd like to teach you ${match.skillYouCanTeachThem.name} in exchange for learning ${match.skillTheyCanTeachYou.name} from you.`
      });
      toast.success('Swap request sent!');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    card: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.3s ease',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
    },
    avatar: {
      width: '50px',
      height: '50px',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '1.25rem',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'var(--text-primary)',
      margin: 0,
    },
    userEmail: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      margin: 0,
    },
    matchScore: {
      backgroundColor: match.matchScore >= 8 ? '#10b981' : match.matchScore >= 5 ? '#f59e0b' : '#ef4444',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: 600,
    },
    skillsSection: {
      marginBottom: '1rem',
    },
    sectionTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      marginBottom: '0.5rem',
    },
    skillList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    skillTag: {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
    },
    matchDescription: {
      backgroundColor: '#f0f9ff',
      color: '#0369a1',
      padding: '1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      marginBottom: '1rem',
      border: '1px solid #bae6fd',
    },
    messageInput: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      marginBottom: '1rem',
      resize: 'vertical',
      minHeight: '60px',
    },
    sendButton: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      width: '100%',
      fontWeight: 500,
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {match.user.firstName?.[0] || 'U'}
        </div>
        <div style={styles.userInfo}>
          <h3 style={styles.userName}>
            {match.user.firstName} {match.user.lastName}
          </h3>
          <p style={styles.userEmail}>{match.user.email}</p>
        </div>
        <div style={styles.matchScore}>
          {match.matchScore}/10
        </div>
      </div>

      <div style={styles.matchDescription}>
        {match.matchDescription}
      </div>

      {/* Updated field names in display */}
      {match.skillYouCanTeachThem && match.skillTheyCanTeachYou && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <strong>Proposed Exchange:</strong>
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            You teach <strong>{match.skillYouCanTeachThem.name}</strong> 
            {' '}↔{' '}
            You learn <strong>{match.skillTheyCanTeachYou.name}</strong>
          </p>
        </div>
      )}

      {/* Updated section titles and content */}
      <div style={styles.skillsSection}>
        <div style={styles.sectionTitle}>Skills they can teach you:</div>
        <div style={styles.skillList}>
          {match.skillTheyCanTeachYou && (
            <span style={styles.skillTag}>{match.skillTheyCanTeachYou.name}</span>
          )}
        </div>
      </div>

      <div style={styles.skillsSection}>
        <div style={styles.sectionTitle}>Skills you can teach them:</div>
        <div style={styles.skillList}>
          {match.skillYouCanTeachThem && (
            <span style={styles.skillTag}>{match.skillYouCanTeachThem.name}</span>
          )}
        </div>
      </div>

      <textarea
        style={styles.messageInput}
        placeholder="Add a personal message (optional)..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        style={{
          ...styles.sendButton,
          ...(loading ? styles.disabledButton : {})
        }}
        onClick={handleSendRequest}
        // Updated field names in disabled condition
        disabled={loading || !match.skillTheyCanTeachYou || !match.skillYouCanTeachThem}
      >
        {loading ? 'Sending...' : 'Send Swap Request'}
      </button>
    </div>
  );
};

export default MatchCard;