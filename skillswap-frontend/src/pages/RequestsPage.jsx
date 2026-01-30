import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { swapRequestsAPI } from '../api/swapRequests';
import RequestCard from '../components/swapRequests/RequestCard';

const RequestsPage = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'sent' or 'received'

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [sentData, receivedData] = await Promise.all([
        swapRequestsAPI.getSentRequests(),
        swapRequestsAPI.getReceivedRequests()
      ]);
      setSentRequests(sentData);
      setReceivedRequests(receivedData);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await swapRequestsAPI.acceptRequest(requestId);
      toast.success('Request accepted');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await swapRequestsAPI.rejectRequest(requestId);
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  // In your Requests page, add this to each accepted request:
<button onClick={() => handleCreateSession(request.id)}>
  Create Session
</button>

// And this handler:
const handleCreateSession = async (requestId) => {
  try {
    await sessionsAPI.createSessionFromRequest(requestId);
    toast.success('Session created!');
  } catch (error) {
    toast.error('Failed to create session');
  }
};
  const handleCancelRequest = async (requestId) => {
    try {
      await swapRequestsAPI.cancelRequest(requestId);
      toast.success('Request cancelled');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to cancel request');
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
    tabs: {
      display: 'flex',
      borderBottom: '1px solid var(--border-color)',
      marginBottom: '2rem',
    },
    tab: {
      padding: '1rem 1.5rem',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 500,
      position: 'relative',
    },
    activeTab: {
      color: 'var(--primary-color)',
    },
    activeTabIndicator: {
      position: 'absolute',
      bottom: '-1px',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: 'var(--primary-color)',
    },
    tabBadge: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      borderRadius: '9999px',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      marginLeft: '0.5rem',
    },
    requestsGrid: {
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
  };

  const currentRequests = activeTab === 'sent' ? sentRequests : receivedRequests;
  const pendingCount = receivedRequests.filter(r => r.status === 'PENDING').length;

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
        <h1 style={styles.title}>Swap Requests</h1>
        <p>Manage your skill swap requests</p>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'received' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('received')}
        >
          Received Requests
          {pendingCount > 0 && (
            <span style={styles.tabBadge}>{pendingCount}</span>
          )}
          {activeTab === 'received' && <div style={styles.activeTabIndicator} />}
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'sent' ? styles.activeTab : {})
          }}
          onClick={() => setActiveTab('sent')}
        >
          Sent Requests
          {activeTab === 'sent' && <div style={styles.activeTabIndicator} />}
        </button>
      </div>

      {currentRequests.length > 0 ? (
        <div style={styles.requestsGrid}>
          {currentRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              type={activeTab}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              onCancel={handleCancelRequest}
            />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <h3>No {activeTab} requests</h3>
          <p>
            {activeTab === 'sent'
              ? "You haven't sent any requests yet"
              : "You haven't received any requests yet"}
          </p>
          {activeTab === 'sent' && (
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
              onClick={() => window.location.href = '/matches'}
            >
              Find Matches
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;