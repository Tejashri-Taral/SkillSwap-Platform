import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const Skills = () => {
  const [tabValue, setTabValue] = useState(0);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('teach'); // 'teach' or 'learn'
  const [newSkill, setNewSkill] = useState({
    skillName: '',
    category: '',
    description: '',
    level: 3,
    goal: '',
  });

  const categories = [
    'Programming',
    'Design',
    'Business',
    'Music',
    'Language',
    'Arts',
    'Sports',
    'Other',
  ];

  useEffect(() => {
    loadSkills();
    loadAllSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const [teachRes, learnRes] = await Promise.all([
        skillAPI.getTeachSkills(),
        skillAPI.getLearnSkills(),
      ]);
      setTeachSkills(teachRes.data);
      setLearnSkills(learnRes.data);
    } catch (error) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const loadAllSkills = async () => {
    try {
      const response = await skillAPI.getAllSkills();
      setAllSkills(response.data);
    } catch (error) {
      console.error('Failed to load all skills:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewSkill({
      skillName: '',
      category: '',
      description: '',
      level: 3,
      goal: '',
    });
  };

  const handleAddSkill = async () => {
    try {
      setLoading(true);
      const apiCall = dialogType === 'teach' 
        ? skillAPI.addTeachSkill 
        : skillAPI.addLearnSkill;
      
      const response = await apiCall(newSkill);
      
      if (dialogType === 'teach') {
        setTeachSkills([...teachSkills, response.data]);
      } else {
        setLearnSkills([...learnSkills, response.data]);
      }
      
      toast.success(`Skill added to ${dialogType} list`);
      handleCloseDialog();
      loadAllSkills(); // Refresh suggestions
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId, type) => {
    try {
      const apiCall = type === 'teach' 
        ? skillAPI.removeTeachSkill 
        : skillAPI.removeLearnSkill;
      
      await apiCall(skillId);
      
      if (type === 'teach') {
        setTeachSkills(teachSkills.filter(skill => skill.id !== skillId));
      } else {
        setLearnSkills(learnSkills.filter(skill => skill.id !== skillId));
      }
      
      toast.success('Skill removed');
    } catch (error) {
      toast.error('Failed to remove skill');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadAllSkills();
      return;
    }
    
    try {
      const response = await skillAPI.searchSkills(searchQuery);
      setAllSkills(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const SkillCard = ({ skill, type }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" gutterBottom>
            {skill.skill.name}
          </Typography>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleRemoveSkill(skill.skill.id, type)}
            disabled={loading}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        
        {skill.skill.category && (
          <Chip
            label={skill.skill.category}
            size="small"
            sx={{ mb: 1 }}
          />
        )}
        
        {skill.skill.description && (
          <Typography variant="body2" color="textSecondary" paragraph>
            {skill.skill.description}
          </Typography>
        )}
        
        {skill.level && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              Level: {skill.level}/5
            </Typography>
          </Box>
        )}
        
        {skill.goal && (
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            "{skill.goal}"
          </Typography>
        )}
        
        <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 2 }}>
          Added on {new Date(skill.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          color="primary"
          onClick={() => {
            setNewSkill({
              skillName: skill.skill.name,
              category: skill.skill.category,
              description: skill.skill.description,
              level: skill.level,
              goal: skill.goal,
            });
            handleOpenDialog(type === 'teach' ? 'learn' : 'teach');
          }}
        >
          Add to {type === 'teach' ? 'Learn' : 'Teach'} List
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Skills
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Manage skills you can teach and skills you want to learn.
      </Typography>

      {/* Search and Add Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search skills (e.g., 'React', 'Design', 'Guitar')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSearch}
              disabled={loading}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('teach')}
              disabled={loading}
            >
              Add Skill
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1 }} />
                Skills I Can Teach ({teachSkills.length})
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1 }} />
                Skills I Want to Learn ({learnSkills.length})
              </Box>
            } 
          />
        </Tabs>
      </Paper>

      {/* Skills Grid */}
      {tabValue === 0 ? (
        teachSkills.length > 0 ? (
          <Grid container spacing={3}>
            {teachSkills.map((skill) => (
              <Grid item xs={12} sm={6} md={4} key={skill.id}>
                <SkillCard skill={skill} type="teach" />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            You haven't added any skills to teach yet. Click "Add Skill" to get started!
          </Alert>
        )
      ) : learnSkills.length > 0 ? (
        <Grid container spacing={3}>
          {learnSkills.map((skill) => (
            <Grid item xs={12} sm={6} md={4} key={skill.id}>
              <SkillCard skill={skill} type="learn" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          You haven't added any skills to learn yet. Click "Add Skill" to get started!
        </Alert>
      )}

      {/* Add Skill Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Skill to {dialogType === 'teach' ? 'Teach' : 'Learn'} List
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Choose existing skill"
                value={newSkill.skillName}
                onChange={(e) => {
                  const skill = allSkills.find(s => s.name === e.target.value);
                  setNewSkill({
                    ...newSkill,
                    skillName: e.target.value,
                    category: skill?.category || '',
                    description: skill?.description || '',
                  });
                }}
              >
                <MenuItem value="">Or type new skill below</MenuItem>
                {allSkills.map((skill) => (
                  <MenuItem key={skill.id} value={skill.name}>
                    {skill.name} ({skill.category})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skill Name"
                value={newSkill.skillName}
                onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Category"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label={`${dialogType === 'teach' ? 'Proficiency' : 'Current'} Level (1-5)`}
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
                required
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <MenuItem key={level} value={level}>
                    {level} - {level === 1 ? 'Beginner' : level === 3 ? 'Intermediate' : level === 5 ? 'Expert' : ''}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={dialogType === 'teach' ? 'Teaching Experience/Goal' : 'Learning Goal'}
                value={newSkill.goal}
                onChange={(e) => setNewSkill({ ...newSkill, goal: e.target.value })}
                multiline
                rows={2}
                placeholder={
                  dialogType === 'teach' 
                    ? 'e.g., "Can teach basics to intermediate level"' 
                    : 'e.g., "Want to build professional projects"'
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddSkill} 
            variant="contained"
            disabled={!newSkill.skillName || !newSkill.category || loading}
          >
            {loading ? 'Adding...' : 'Add Skill'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Skills;