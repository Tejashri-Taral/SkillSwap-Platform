const RequestCard = ({ request, type, onAccept, onReject, onCancel }) => {
  const isPending = request.status === 'PENDING';
  const isSent = type === 'sent';

  const styles = {
    card: {
      backgroundColor: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      border: isPending ? '2px solid #f59e0b' : '2px solid var(--border-color)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1rem',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    userName: {
      fontSize: '1rem',
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
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
    statusAccepted: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
    },
    statusRejected: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    },
    statusCancelled: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    },
    exchangeInfo: {
      backgroundColor: 'var(--bg-secondary)',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
    },
    exchangeRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },
    arrow: {
      fontSize: '1.5rem',
      color: 'var(--text-secondary)',
      margin: '0 1rem',
    },
    skillCard: {
      flex: 1,
      backgroundColor: 'white',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      textAlign: 'center',
      border: '1px solid var(--border-color)',
    },
    skillName: {
      fontSize: '1rem',
      fontWeight: 600,
      color: 'var(--text-primary)',
      margin: 0,
    },
    skillType: {
      fontSize: '0.75rem',
      color: 'var(--text-secondary)',
      margin: 0,
    },
    message: {
      backgroundColor: '#f0f9ff',
      padding: '1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      marginBottom: '1rem',
      borderLeft: '3px solid var(--primary-color)',
    },
    footer: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'flex-end',
    },
    acceptButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
    },
    rejectButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
    },
    cancelButton: {
      backgroundColor: '#f3f4f6',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
    },
    viewButton: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 500,
    },
  };

  const getStatusStyle = () => {
    switch (request.status) {
      case 'PENDING': return styles.statusPending;
      case 'ACCEPTED': return styles.statusAccepted;
      case 'REJECTED': return styles.statusRejected;
      case 'CANCELLED': return styles.statusCancelled;
      default: return {};
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {isSent ? request.receiver.firstName?.[0] : request.sender.firstName?.[0] || 'U'}
          </div>
          <div>
            <h3 style={styles.userName}>
              {isSent ? request.receiver.firstName : request.sender.firstName}{' '}
              {isSent ? request.receiver.lastName : request.sender.lastName}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
              {isSent ? 'To' : 'From'}: {isSent ? request.receiver.email : request.sender.email}
            </p>
          </div>
        </div>
        <span style={{ ...styles.status, ...getStatusStyle() }}>
          {request.status}
        </span>
      </div>

      <div style={styles.exchangeInfo}>
        <div style={styles.exchangeRow}>
          <div style={styles.skillCard}>
            <p style={styles.skillType}>You Teach</p>
            <h4 style={styles.skillName}>{request.teachSkill.name}</h4>
          </div>
          <span style={styles.arrow}>↔</span>
          <div style={styles.skillCard}>
            <p style={styles.skillType}>You Learn</p>
            <h4 style={styles.skillName}>{request.learnSkill.name}</h4>
          </div>
        </div>
      </div>

      {request.message && (
        <div style={styles.message}>
          <p style={{ margin: 0 }}>{request.message}</p>
        </div>
      )}

      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Sent: {new Date(request.createdAt).toLocaleDateString()}
      </div>

      {isPending && (
        <div style={styles.footer}>
          {isSent ? (
            <button
              style={styles.cancelButton}
              onClick={() => onCancel(request.id)}
            >
              Cancel Request
            </button>
          ) : (
            <>
              <button
                style={styles.acceptButton}
                onClick={() => onAccept(request.id)}
              >
                Accept
              </button>
              <button
                style={styles.rejectButton}
                onClick={() => onReject(request.id)}
              >
                Reject
              </button>
            </>
          )}
        </div>
      )}

      {!isPending && request.status === 'ACCEPTED' && (
        <div style={styles.footer}>
          <button
            style={styles.viewButton}
            onClick={() => window.location.href = '/sessions'}
          >
            View Session
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;