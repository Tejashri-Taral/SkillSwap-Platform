const SessionCard = ({ session, onStartMeeting, onCompleteSession, onViewDetails }) => {
  const getStatusStyle = () => {
    switch (session.status) {
      case 'CREATED': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'SCHEDULED': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'IN_PROGRESS': return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'COMPLETED': return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'CANCELLED': return { backgroundColor: '#f3f4f6', color: '#374151' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const canJoinMeeting = () => {
    return session.meetingUrl && 
           (session.status === 'CREATED' || 
            session.status === 'SCHEDULED' || 
            session.status === 'IN_PROGRESS');
  };

  const canCompleteSession = () => {
    return session.status !== 'COMPLETED' && session.status !== 'CANCELLED';
  };

  const styles = {
    card: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'var(--text-primary)',
      margin: 0,
    },
    status: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    details: {
      marginBottom: '1rem',
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: '1px solid var(--border-color)',
    },
    detailLabel: {
      color: 'var(--text-secondary)',
      fontSize: '0.875rem',
    },
    detailValue: {
      color: 'var(--text-primary)',
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    notes: {
      backgroundColor: '#f8fafc',
      padding: '1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      marginBottom: '1rem',
      minHeight: '60px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    joinButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
      flex: 1,
    },
    completeButton: {
      backgroundColor: '#f59e0b',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
      flex: 1,
    },
    detailsButton: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
      flex: 1,
    },
    disabledButton: {
      backgroundColor: '#f3f4f6',
      color: '#9ca3af',
      cursor: 'not-allowed',
    },
    meetingLink: {
      color: '#3b82f6',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: '0.875rem',
    },
  };

  const statusStyle = getStatusStyle();

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{session.title || 'Skill Swap Session'}</h3>
        <span style={{ ...styles.status, ...statusStyle }}>
          {session.status}
        </span>
      </div>

      <div style={styles.details}>
        {session.scheduledDate && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Scheduled Date:</span>
            <span style={styles.detailValue}>
              {new Date(session.scheduledDate).toLocaleString()}
            </span>
          </div>
        )}
        
        {session.duration && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Duration:</span>
            <span style={styles.detailValue}>{session.duration} minutes</span>
          </div>
        )}

        {session.meetingPlatform && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Platform:</span>
            <span style={styles.detailValue}>{session.meetingPlatform}</span>
          </div>
        )}

        {session.meetingUrl && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Meeting:</span>
            <span style={styles.detailValue}>
              <span 
                style={styles.meetingLink}
                onClick={() => window.open(session.meetingUrl, '_blank')}
              >
                Join now
              </span>
            </span>
          </div>
        )}
      </div>

      {session.sessionNotes ? (
        <div style={styles.notes}>
          <strong>Notes:</strong> {session.sessionNotes}
        </div>
      ) : (
        <div style={styles.notes}>
          <em>No notes added yet</em>
        </div>
      )}

      <div style={styles.buttonGroup}>
        {canJoinMeeting() ? (
          <button
            style={styles.joinButton}
            onClick={onStartMeeting}
          >
            {session.status === 'CREATED' ? 'Start Session' : 'Join Session'}
          </button>
        ) : (
          <button style={{ ...styles.joinButton, ...styles.disabledButton }} disabled>
            Join Session
          </button>
        )}
        
        {canCompleteSession() && (
          <button
            style={styles.completeButton}
            onClick={onCompleteSession}
          >
            Complete Session
          </button>
        )}

        <button
          style={styles.detailsButton}
          onClick={onViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default SessionCard;