import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as PlusIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { TEAMS } from '../types';

const TeamsTab: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just show an alert since team creation would require backend implementation
    alert(`Team "${newTeamName}" would be created via TeamGenerator service`);
    setNewTeamName('');
    setShowCreateForm(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Teams
        </Typography>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{ borderRadius: 3 }}
        >
          Create Team
        </Button>
      </Box>

      {/* Create Team Dialog */}
      <Dialog open={showCreateForm} onClose={() => setShowCreateForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Team</DialogTitle>
        <form onSubmit={handleCreateTeam}>
          <DialogContent>
            <TextField
              autoFocus
              required
              fullWidth
              label="Team Name"
              placeholder="Enter team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setShowCreateForm(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create Team
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Teams Grid */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          }, 
          gap: 3, 
          mb: 4 
        }}
      >
        {TEAMS.map((team) => (
          <Card 
            key={team.id}
            sx={{ 
              height: '100%',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.3s ease',
              },
            }}
          >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      mr: 2, 
                      width: 56, 
                      height: 56 
                    }}
                  >
                    <TrophyIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {team.name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {team.shortName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        •
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {team.country}
                      </Typography>
                    </Stack>
                    <Chip 
                      label={`ID: ${team.id}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
        ))}
      </Box>

      {/* Info Section */}
      <Alert severity="info" sx={{ borderRadius: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Available Teams
        </Typography>
        <Typography variant="body2">
          These are the pre-configured teams available across all microservices. 
          Team creation would integrate with the TeamGenerator service to add new teams with generated players.
        </Typography>
      </Alert>
    </Box>
  );
};

export default TeamsTab;