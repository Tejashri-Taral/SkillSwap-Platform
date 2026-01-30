import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { sessionsAPI } from '../api/sessions';
import SessionCard from '../components/sessions/SessionCard';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionsAPI.getSessions();
      console.log('Sessions received:', data); // Debug log
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'upcoming') {
      return session.status === 'CREATED' || 
             session.status === 'SCHEDULED' || 
             session.status === 'IN_PROGRESS';
    }
    if (filter === 'completed') {
      return session.status === 'COMPLETED';
    }
    return true;
  });

  // Handle start meeting - DIRECT approach
  const handleStartMeeting = (session) => {
    console.log('Starting meeting for session:', session);
    
    if (session.meetingUrl) {
      window.open(session.meetingUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('No meeting link available');
    }
  };

  // Handle complete session - SIMPLE approach
  const handleCompleteSession = async (sessionId) => {
    try {
      const confirmComplete = window.confirm('Mark this session as completed?');
      if (!confirmComplete) return;

      // Try the completeSession API if it exists
      try {
        await sessionsAPI.completeSession(sessionId);
        toast.success('Session marked as completed!');
      } catch (apiError) {
        console.warn('Complete API failed, updating locally:', apiError);
        
        // Update locally if API fails
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session.id === sessionId 
              ? { ...session, status: 'COMPLETED', completedAt: new Date().toISOString() }
              : session
          )
        );
        toast.success('Session marked as completed locally!');
      }
      
      fetchSessions(); // Refresh
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Failed to complete session');
    }
  };

  // Handle view details
  const handleViewDetails = (session) => {
    const details = `
Session ID: ${session.id}
Title: ${session.title || 'Untitled'}
Status: ${session.status}
Meeting URL: ${session.meetingUrl || 'None'}
Platform: ${session.meetingPlatform || 'None'}
Scheduled: ${session.scheduledDate ? new Date(session.scheduledDate).toLocaleString() : 'Not scheduled'}
Duration: ${session.duration || 'None'} minutes
Created: ${new Date(session.createdAt).toLocaleString()}
${session.completedAt ? `Completed: ${new Date(session.completedAt).toLocaleString()}` : ''}
Notes: ${session.sessionNotes || 'None'}
    `.trim();
    
    alert(details);
  };

  // Handle create session from request
  const handleCreateSession = async (requestId) => {
    try {
      const response = await sessionsAPI.createSessionFromRequest(requestId);
      toast.success('Session created successfully!');
      fetchSessions(); // Refresh
      return response;
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
      throw error;
    }
  };

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
    sessionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
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
    sessionCount: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
      marginTop: '0.5rem',
    },
    debugInfo: {
      backgroundColor: '#f0f0f0',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
      fontSize: '0.75rem',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
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
        <h1 style={styles.title}>Skill Swap Sessions</h1>
        <p>Manage your scheduled skill exchange sessions</p>
        <div style={styles.sessionCount}>
          Showing {filteredSessions.length} of {sessions.length} sessions
        </div>
      </div>

      <div style={styles.filters}>
        <button
          style={{
            ...styles.filterButton,
            ...(filter === 'upcoming' ? styles.activeFilter : {})
          }}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming Sessions
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filter === 'completed' ? styles.activeFilter : {})
          }}
          onClick={() => setFilter('completed')}
        >
          Completed Sessions
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filter === 'all' ? styles.activeFilter : {})
          }}
          onClick={() => setFilter('all')}
        >
          All Sessions
        </button>
      </div>

      {filteredSessions.length > 0 ? (
        <div style={styles.sessionsGrid}>
          {filteredSessions.map((session) => (
            <SessionCard 
              key={session.id} 
              session={session}
              onStartMeeting={() => handleStartMeeting(session)}
              onCompleteSession={() => handleCompleteSession(session.id)}
              onViewDetails={() => handleViewDetails(session)}
            />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <h3>No {filter} sessions</h3>
          <p>
            {filter === 'upcoming'
              ? "You don't have any upcoming sessions. Accept a swap request to schedule one!"
              : "You haven't completed any sessions yet"}
          </p>
          {filter === 'upcoming' && (
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
              onClick={() => window.location.href = '/requests'}
            >
              View Requests
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;