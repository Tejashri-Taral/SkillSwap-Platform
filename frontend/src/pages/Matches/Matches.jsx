import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Send as SendIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { matchAPI, swapRequestAPI, skillAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Matches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [filterScore, setFilterScore] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadMatches();
    loadUserSkills();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [matches, filterScore, filterCategory]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await matchAPI.getMatches();
      setMatches(response.data);
      setFilteredMatches(response.data);
    } catch (error) {
      toast.error('Failed to load matches');
      console.error('Matches error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSkills = async () => {
    try {
      const [teachRes, learnRes] = await Promise.all([
        skillAPI.getTeachSkills(),
        skillAPI.getLearnSkills(),
      ]);
      setTeachSkills(teachRes.data);
      setLearnSkills(learnRes.data);
    } catch (error) {
      console.error('Failed to load user skills:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...matches];

    if (filterScore > 0) {
      filtered = filtered.filter(match => match.matchScore >= filterScore);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(match => {
        const teachSkillCategory = match.mutualTeachSkill?.category;
        const learnSkillCategory = match.mutualLearnSkill?.category;
        return teachSkillCategory === filterCategory || learnSkillCategory === filterCategory;
      });
    }

    setFilteredMatches(filtered);
  };

  const handleOpenRequestDialog = (match) => {
    setSelectedMatch(match);
    
    // Find matching teach/learn skills
    const userTeachSkill = teachSkills.find(ts => 
      ts.skill.name === match.mutualLearnSkill?.name
    );
    const userLearnSkill = learnSkills.find(ls => 
      ls.skill.name === match.mutualTeachSkill?.name
    );

    if (userTeachSkill && userLearnSkill) {
      setRequestMessage(
        `Hi ${match.user.firstName}! I can teach you ${match.mutualLearnSkill?.name} and would love to learn ${match.mutualTeachSkill?.name} from you. Let's swap skills!`
      );
    } else {
      setRequestMessage(
        `Hi ${match.user.firstName}! I think we could be great skill swap partners. Let's connect!`
      );
    }
    
    setOpenRequestDialog(true);
  };

  const handleCloseRequestDialog = () => {
    setOpenRequestDialog(false);
    setSelectedMatch(null);
    setRequestMessage('');
  };

  const handleSendRequest = async () => {
    if (!selectedMatch) return;

    try {
      setSendingRequest(true);

      // Find the skill IDs
      const teachSkill = teachSkills.find(ts => 
        ts.skill.name === selectedMatch.mutualLearnSkill?.name
      );
      const learnSkill = learnSkills.find(ls => 
        ls.skill.name === selectedMatch.mutualTeachSkill?.name
      );

      if (!teachSkill || !learnSkill) {
        toast.error('Please add the corresponding skills to your profile first');
        return;
      }

      const requestData = {
        receiverId: selectedMatch.user.id,
        teachSkillId: teachSkill.skill.id,
        learnSkillId: learnSkill.skill.id,
        message: requestMessage,
      };

      await swapRequestAPI.createSwapRequest(requestData);
      
      toast.success('Swap request sent successfully!');
      handleCloseRequestDialog();
      
      // Update matches to show pending status
      setMatches(matches.map(match => 
        match.user.id === selectedMatch.user.id 
          ? { ...match, hasPendingRequest: true }
          : match
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setSendingRequest(false);
    }
  };

  const getCategories = () => {
    const categories = new Set();
    matches.forEach(match => {
      if (match.mutualTeachSkill?.category) {
        categories.add(match.mutualTeachSkill.category);
      }
      if (match.mutualLearnSkill?.category) {
        categories.add(match.mutualLearnSkill.category);
      }
    });
    return ['all', ...Array.from(categories)];
  };

  const MatchCard = ({ match }) => {
    const matchStrength = match.matchScore > 4 ? 'Strong' : match.matchScore > 2 ? 'Good' : 'Fair';
    const strengthColor = match.matchScore > 4 ? 'success' : match.matchScore > 2 ? 'primary' : 'warning';

    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Match Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {match.user.firstName[0]}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {match.user.firstName} {match.user.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Match Score: <strong>{match.matchScore}</strong>
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={matchStrength} 
              color={strengthColor} 
              size="small" 
              icon={<StarIcon />}
            />
          </Box>

          {/* Match Details */}
          <Typography variant="body2" color="textSecondary" paragraph>
            {match.matchDescription}
          </Typography>

          {/* Skills Section */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {match.mutualTeachSkill && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#e8f5e9' }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    They can teach you:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={match.mutualTeachSkill.name} 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {match.mutualTeachSkill.category}
                    </Typography>
                  </Box>
                  {match.mutualTeachSkill.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {match.mutualTeachSkill.description}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}

            {match.mutualLearnSkill && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    You can teach them:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={match.mutualLearnSkill.name} 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {match.mutualLearnSkill.category}
                    </Typography>
                  </Box>
                  {match.mutualLearnSkill.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {match.mutualLearnSkill.description}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>

          {/* User Rating */}
          {match.user.rating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                User Rating:
              </Typography>
              <Box sx={{ display: 'flex' }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    sx={{ 
                      fontSize: 16, 
                      color: i < Math.floor(match.user.rating) ? '#ffb400' : '#ddd' 
                    }} 
                  />
                ))}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  ({match.user.rating.toFixed(1)})
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>

        <CardActions>
          <Button
            fullWidth
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => handleOpenRequestDialog(match)}
            disabled={match.hasPendingRequest}
          >
            {match.hasPendingRequest ? 'Request Sent' : 'Send Swap Request'}
          </Button>
        </CardActions>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Find Matches
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Discover users with complementary skills for perfect skill swaps.
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <FilterIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Minimum Match Score"
              value={filterScore}
              onChange={(e) => setFilterScore(parseInt(e.target.value))}
              size="small"
            >
              <MenuItem value={0}>All Scores</MenuItem>
              <MenuItem value={2}>2+ (Fair)</MenuItem>
              <MenuItem value={3}>3+ (Good)</MenuItem>
              <MenuItem value={4}>4+ (Strong)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Skill Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              size="small"
            >
              {getCategories().map((category) => (
                <MenuItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Typography variant="body2" color="textSecondary">
                Showing {filteredMatches.length} of {matches.length} matches
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <Grid container spacing={3}>
          {filteredMatches.map((match) => (
            <Grid item xs={12} sm={6} md={4} key={match.user.id}>
              <MatchCard match={match} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          {matches.length === 0 
            ? "No matches found yet. Add more skills to your profile to find compatible users!"
            : "No matches match your current filters. Try adjusting your filter criteria."}
        </Alert>
      )}

      {/* Send Request Dialog */}
      <Dialog 
        open={openRequestDialog} 
        onClose={handleCloseRequestDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Send Swap Request to {selectedMatch?.user?.firstName}
        </DialogTitle>
        <DialogContent>
          {selectedMatch && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  You're requesting to swap:
                  <br />
                  • You teach: <strong>{selectedMatch.mutualLearnSkill?.name}</strong>
                  <br />
                  • You learn: <strong>{selectedMatch.mutualTeachSkill?.name}</strong>
                </Typography>
              </Alert>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Personal Message"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Add a personal message to introduce yourself and suggest how you'd like to swap skills..."
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestDialog}>Cancel</Button>
          <Button 
            onClick={handleSendRequest} 
            variant="contained"
            disabled={sendingRequest || !requestMessage.trim()}
          >
            {sendingRequest ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Matches;