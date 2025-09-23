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
  CircularProgress,
} from '@mui/material';
import {
  Add as PlusIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { TEAMS } from '../types';
import { teamService } from '../services/teamService';

const TeamsTab: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const teamData = await teamService.generateTeam(newTeamName);
      console.log('Team created successfully:', teamData);
      
      setSuccessMessage(`Team "${newTeamName}" created successfully with ${teamData.TotalPlayers} players!`);
      setNewTeamName('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create team:', err);
      setError(err instanceof Error ? err.message : 'Failed to create team. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
      <Dialog open={showCreateForm} onClose={() => !isCreating && setShowCreateForm(false)} maxWidth="sm" fullWidth>
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
              disabled={isCreating}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setShowCreateForm(false)} 
              color="inherit"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isCreating || !newTeamName.trim()}
              startIcon={isCreating ? <CircularProgress size={20} /> : undefined}
            >
              {isCreating ? 'Creating...' : 'Create Team'}
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