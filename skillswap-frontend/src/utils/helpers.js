// Format date to readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calculate match score color
export const getMatchScoreColor = (score) => {
  if (score >= 8) return '#10b981'; // green
  if (score >= 5) return '#f59e0b'; // orange
  return '#ef4444'; // red
};

// Get skill category color
export const getCategoryColor = (category) => {
  const colors = {
    'Programming': '#3b82f6',
    'Design': '#8b5cf6',
    'Music': '#10b981',
    'Language': '#f59e0b',
    'Business': '#ef4444',
    'Other': '#6b7280'
  };
  return colors[category] || '#6b7280';
};