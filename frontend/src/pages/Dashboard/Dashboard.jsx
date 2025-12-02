import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { skillAPI, matchAPI, swapRequestAPI, sessionAPI } from '../../services/api';
import { Link as RouterLink } from 'react-router-dom';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    teachSkills: 0,
    learnSkills: 0,
    matches: 0,
    pendingRequests: 0,
    upcomingSessions: 0,
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        teachSkillsRes,
        learnSkillsRes,
        matchesRes,
        receivedRequestsRes,
        sessionsRes,
      ] = await Promise.all([
        skillAPI.getTeachSkills(),
        skillAPI.getLearnSkills(),
        matchAPI.getMatches(),
        swapRequestAPI.getReceivedRequests(),
        sessionAPI.getSessions(),
      ]);

      const pendingRequests = receivedRequestsRes.data.filter(
        req => req.status === 'PENDING'
      );

      const upcomingSessions = sessionsRes.data.filter(
        session => session.status === 'SCHEDULED' || session.status === 'CREATED'
      );

      setStats({
        teachSkills: teachSkillsRes.data.length,
        learnSkills: learnSkillsRes.data.length,
        matches: matchesRes.data.length,
        pendingRequests: pendingRequests.length,
        upcomingSessions: upcomingSessions.length,
      });

      // Get top 3 matches
      setRecentMatches(matchesRes.data.slice(0, 3));
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Icon sx={{ color, mr: 1 }} />
          <Typography color="textSecondary" variant="body2">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );

  const QuickAction = ({ title, description, buttonText, to, color }) => (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        {description}
      </Typography>
      <Button
        component={RouterLink}
        to={to}
        variant="contained"
        size="small"
        sx={{ bgcolor: color, '&:hover': { bgcolor: color } }}
      >
        {buttonText}
      </Button>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Here's what's happening with your skill swaps.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            icon={SchoolIcon}
            title="Skills to Teach"
            value={stats.teachSkills}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            icon={SchoolIcon}
            title="Skills to Learn"
            value={stats.learnSkills}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            icon={GroupIcon}
            title="Matches"
            value={stats.matches}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            icon={PersonIcon}
            title="Pending Requests"
            value={stats.pendingRequests}
            color="#F44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            icon={ScheduleIcon}
            title="Upcoming Sessions"
            value={stats.upcomingSessions}
            color="#9C27B0"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Quick Actions */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <QuickAction
                title="Add Skills"
                description="Add skills you can teach or want to learn"
                buttonText="Manage Skills"
                to="/skills"
                color="#4CAF50"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuickAction
                title="Find Matches"
                description="Discover users with complementary skills"
                buttonText="View Matches"
                to="/matches"
                color="#2196F3"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuickAction
                title="Swap Requests"
                description="View and manage your swap requests"
                buttonText="Manage Requests"
                to="/requests"
                color="#FF9800"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuickAction
                title="Sessions"
                description="View and manage your learning sessions"
                buttonText="View Sessions"
                to="/sessions"
                color="#9C27B0"
              />
            </Grid>
          </Grid>

          {/* Recent Matches */}
          {recentMatches.length > 0 && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Matches
              </Typography>
              <List>
                {recentMatches.map((match, index) => (
                  <React.Fragment key={match.user.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1">
                              {match.user.firstName} {match.user.lastName}
                            </Typography>
                            <Chip
                              label={`Score: ${match.matchScore}`}
                              size="small"
                              color="primary"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary">
                              {match.matchDescription}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {match.mutualTeachSkill && (
                                <Chip
                                  label={`Teaches: ${match.mutualTeachSkill.name}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                              )}
                              {match.mutualLearnSkill && (
                                <Chip
                                  label={`Learns: ${match.mutualLearnSkill.name}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentMatches.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              {stats.matches > 3 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button component={RouterLink} to="/matches" variant="outlined">
                    View All Matches ({stats.matches})
                  </Button>
                </Box>
              )}
            </Paper>
          )}
        </Grid>

        {/* Right Column - Profile & Tips */}
        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Profile
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="subtitle1">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user?.email}
                </Typography>
                {user?.rating && (
                  <Typography variant="body2">
                    Rating: ⭐ {user.rating.toFixed(1)}
                  </Typography>
                )}
              </Box>
            </Box>
            {!user?.bio && (
              <Button
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                Add Bio
              </Button>
            )}
          </Paper>

          {/* Tips Card */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tips for Success
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="🎯 Be specific about what you can teach" />
              </ListItem>
              <ListItem>
                <ListItemText primary="💬 Send personalized swap requests" />
              </ListItem>
              <ListItem>
                <ListItemText primary="⏰ Schedule sessions in advance" />
              </ListItem>
              <ListItem>
                <ListItemText primary="⭐ Leave feedback after sessions" />
              </ListItem>
              <ListItem>
                <ListItemText primary="🔄 Keep your skill list updated" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;