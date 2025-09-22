import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Add as PlusIcon,
  CalendarToday as CalendarIcon,
  LocationOn as MapPinIcon,
  AccessTime as ClockIcon,
  PlayArrow as PlayIcon,
  EmojiEvents as TrophyIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useMatches, useScheduleMatch, useStartMatch } from '../hooks/useApi';
import { TEAMS, ScheduleMatchRequest } from '../types';
import { formatDate, getTimeFromNow } from '../utils';
import { getStadiumInfo, getStadiumNames } from '../data/stadiums';
import StadiumMap from './StadiumMap';

const MatchesTab: React.FC = () => {
  const { data: matches = [], isLoading, error } = useMatches();
  const scheduleMatchMutation = useScheduleMatch();
  const startMatchMutation = useStartMatch();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  
  const [scheduleForm, setScheduleForm] = useState<ScheduleMatchRequest>({
    homeTeamName: '',
    awayTeamName: '',
    scheduledDate: '',
    venue: '',
    notes: '',
  });

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await scheduleMatchMutation.mutateAsync(scheduleForm);
      setShowScheduleForm(false);
      setScheduleForm({
        homeTeamName: '',
        awayTeamName: '',
        scheduledDate: '',
        venue: '',
        notes: '',
      });
    } catch (error) {
      console.error('Failed to schedule match:', error);
    }
  };

  const handleStartMatch = async (matchId: string) => {
    try {
      await startMatchMutation.mutateAsync(matchId);
    } catch (error) {
      console.error('Failed to start match:', error);
    }
  };

  const canStartMatch = (match: any) => {
    return match.status === 'scheduled' && new Date(match.scheduledDate) <= new Date();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'in_progress':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'postponed':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress size={64} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading matches...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6">Unable to load matches</Typography>
        <Typography>
          {error.message || 'Network Error - Please check if the backend services are running'}
        </Typography>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Enhanced Header */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          color: 'white',
          mb: 4,
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Match Center
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                Manage and schedule football matches across top stadiums
              </Typography>
              <Stack direction="row" spacing={3} sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrophyIcon />
                  <Typography>{matches.length} Matches</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <TrophyIcon />
                  <Typography>{TEAMS.length} Teams</Typography>
                </Box>
              </Stack>
            </Box>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => setShowScheduleForm(true)}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                },
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                boxShadow: 3,
              }}
            >
              Schedule Match
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Schedule Match Dialog */}
      <Dialog
        open={showScheduleForm}
        onClose={() => setShowScheduleForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h3" fontWeight="bold">
              Schedule New Match
            </Typography>
            <IconButton onClick={() => setShowScheduleForm(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleScheduleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  select
                  fullWidth
                  label="Home Team"
                  value={scheduleForm.homeTeamName}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, homeTeamName: e.target.value })}
                  required
                >
                  <MenuItem value="">Select home team</MenuItem>
                  {TEAMS.map(team => (
                    <MenuItem key={team.id} value={team.name}>{team.name}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Away Team"
                  value={scheduleForm.awayTeamName}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, awayTeamName: e.target.value })}
                  required
                >
                  <MenuItem value="">Select away team</MenuItem>
                  {TEAMS.filter(team => team.name !== scheduleForm.homeTeamName).map(team => (
                    <MenuItem key={team.id} value={team.name}>{team.name}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  fullWidth
                  label="Match Date & Time"
                  type="datetime-local"
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  fullWidth
                  label="Stadium"
                  value={scheduleForm.venue}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })}
                  required
                >
                  <MenuItem value="">Select stadium</MenuItem>
                  {getStadiumNames().map(stadium => (
                    <MenuItem key={stadium} value={stadium}>{stadium}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <TextField
                fullWidth
                label="Match Notes (Optional)"
                multiline
                rows={3}
                placeholder="Add any additional match details or special arrangements..."
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={() => setShowScheduleForm(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={scheduleMatchMutation.isPending}
              startIcon={scheduleMatchMutation.isPending ? <CircularProgress size={20} /> : undefined}
            >
              {scheduleMatchMutation.isPending ? 'Scheduling...' : 'Schedule Match'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Matches List */}
      <Box>
        {matches.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8, background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)' }}>
            <CardContent>
              <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
              <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                No matches scheduled
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Get started by scheduling your first match
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlusIcon />}
                onClick={() => setShowScheduleForm(true)}
                sx={{ mt: 3, borderRadius: 3 }}
              >
                Schedule Your First Match
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {matches.map((match) => {
              const stadiumInfo = getStadiumInfo(match.venue);
              return (
                <Card key={match.id} sx={{ overflow: 'visible' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: stadiumInfo ? '2fr 1fr' : '1fr' }, gap: 4 }}>
                      {/* Match Details */}
                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h5" component="h3" fontWeight="bold">
                              {match.homeTeamName} vs {match.awayTeamName}
                            </Typography>
                            <Chip
                              label={match.status.replace('_', ' ').toUpperCase()}
                              color={getStatusColor(match.status) as any}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          {canStartMatch(match) && (
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<PlayIcon />}
                              onClick={() => handleStartMatch(match.id)}
                              disabled={startMatchMutation.isPending}
                              sx={{ borderRadius: 3, fontWeight: 600 }}
                            >
                              Start Match
                            </Button>
                          )}
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 3 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <CalendarIcon color="primary" />
                              <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                                Match Date
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="600">
                              {formatDate(match.scheduledDate)}
                            </Typography>
                          </Paper>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 3 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <MapPinIcon color="error" />
                              <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                                Stadium
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="600">
                              {match.venue}
                            </Typography>
                            {stadiumInfo && (
                              <Typography variant="caption" color="text.secondary">
                                {stadiumInfo.city}, {stadiumInfo.country}
                              </Typography>
                            )}
                          </Paper>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 3 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <ClockIcon color="success" />
                              <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                                Time Remaining
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="600">
                              {getTimeFromNow(match.scheduledDate)}
                            </Typography>
                          </Paper>
                        </Box>

                        {stadiumInfo && (
                          <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 3, mb: 2 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <TrophyIcon color="primary" />
                              <Typography variant="subtitle1" color="primary.main" fontWeight="600">
                                Stadium Information
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                              <Typography variant="body2" color="primary.dark">
                                <strong>Capacity:</strong> {stadiumInfo.capacity.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" color="primary.dark">
                                <strong>Location:</strong> {stadiumInfo.city}
                              </Typography>
                            </Box>
                          </Paper>
                        )}

                        {match.notes && (
                          <Alert severity="info" sx={{ borderRadius: 3 }}>
                            <Typography variant="subtitle2" fontWeight="600">Match Notes:</Typography>
                            <Typography variant="body2">{match.notes}</Typography>
                          </Alert>
                        )}
                      </Box>

                      {/* Stadium Map Preview */}
                      {stadiumInfo && (
                        <Box>
                          <Paper elevation={1} sx={{ p: 1, borderRadius: 3 }}>
                            <StadiumMap stadium={stadiumInfo} className="w-full h-48 rounded-lg" />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                              {stadiumInfo.address}
                            </Typography>
                          </Paper>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 4, pb: 2 }}>
                    <Button
                      variant="text"
                      startIcon={<MapPinIcon />}
                      onClick={() => setSelectedMatch(match)}
                      sx={{ borderRadius: 2 }}
                    >
                      View Stadium Location
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Stadium Detail Dialog */}
      {selectedMatch && getStadiumInfo(selectedMatch.venue) && (
        <Dialog
          open={true}
          onClose={() => setSelectedMatch(null)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 4 }
          }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h5" component="h3" fontWeight="bold">
                  {selectedMatch.venue}
                </Typography>
                <Typography color="text.secondary">
                  {selectedMatch.homeTeamName} vs {selectedMatch.awayTeamName}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedMatch(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
              <Box>
                <StadiumMap stadium={getStadiumInfo(selectedMatch.venue)!} className="w-full h-96 rounded-xl" />
              </Box>
              <Box>
                {(() => {
                  const info = getStadiumInfo(selectedMatch.venue)!;
                  return (
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                          Stadium Details
                        </Typography>
                        <Stack spacing={1}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary">Capacity:</Typography>
                            <Typography fontWeight="600">{info.capacity.toLocaleString()}</Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary">City:</Typography>
                            <Typography fontWeight="600">{info.city}</Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary">Country:</Typography>
                            <Typography fontWeight="600">{info.country}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                          Address
                        </Typography>
                        <Typography color="text.secondary">{info.address}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                          Match Information
                        </Typography>
                        <Stack spacing={1}>
                          <Box>
                            <Typography component="span" color="text.secondary">Date: </Typography>
                            <Typography component="span" fontWeight="600">{formatDate(selectedMatch.scheduledDate)}</Typography>
                          </Box>
                          <Box>
                            <Typography component="span" color="text.secondary">Status: </Typography>
                            <Typography component="span" fontWeight="600">{selectedMatch.status.replace('_', ' ').toUpperCase()}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  );
                })()}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default MatchesTab;