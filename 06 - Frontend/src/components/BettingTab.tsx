import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney as DollarSignIcon,
  GpsFixed as TargetIcon,
} from '@mui/icons-material';
import { useMatchOdds, useBettingMatches, usePlaceBet } from '../hooks/useApi';
import { formatOdds, calculatePayout, formatDate } from '../utils';

const BettingTab: React.FC = () => {
  const { data: bettingMatches = [], isLoading: matchesLoading } = useBettingMatches();
  const placeBetMutation = usePlaceBet();
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [betForm, setBetForm] = useState({
    bet_type: 'match_winner',
    option: '',
    stake: 10,
  });

  const { data: odds = [], isLoading: oddsLoading } = useMatchOdds(selectedMatch);

  const handlePlaceBet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    try {
      await placeBetMutation.mutateAsync({
        match_id: selectedMatch,
        ...betForm,
      });
      
      // Reset form
      setBetForm({
        bet_type: 'match_winner',
        option: '',
        stake: 10,
      });
      setSelectedMatch('');
    } catch (error) {
      console.error('Failed to place bet:', error);
    }
  };

  const getSelectedOdds = () => {
    const selectedOdds = odds.find(o => o.bet_type === betForm.bet_type);
    return selectedOdds?.options[betForm.option] || 0;
  };

  const getPayout = () => {
    const oddsValue = getSelectedOdds();
    return oddsValue ? calculatePayout(betForm.stake, oddsValue) : 0;
  };

  if (matchesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Betting
        </Typography>
        <Chip 
          icon={<TrendingUp />} 
          label="Live Odds" 
          color="primary" 
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Available Matches */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                Available Matches
              </Typography>
              
              {bettingMatches.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TargetIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    No matches available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check back later for betting opportunities.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {bettingMatches.map((match) => (
                    <Card
                      key={match.id}
                      variant={selectedMatch === match.id ? "elevation" : "outlined"}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: selectedMatch === match.id ? 'primary.50' : 'background.paper',
                        border: selectedMatch === match.id ? 2 : 1,
                        borderColor: selectedMatch === match.id ? 'primary.main' : 'divider',
                        '&:hover': {
                          bgcolor: selectedMatch === match.id ? 'primary.100' : 'action.hover',
                        },
                      }}
                      onClick={() => setSelectedMatch(match.id)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {match.homeTeamName} vs {match.awayTeamName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(match.scheduledDate)} • {match.venue}
                            </Typography>
                          </Box>
                          <Chip 
                            label="Click to bet" 
                            color="primary" 
                            size="small"
                            variant={selectedMatch === match.id ? "filled" : "outlined"}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Betting Form */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h5" component="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                Place Bet
              </Typography>
              
              {!selectedMatch ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <DollarSignIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Select a match to place a bet
                  </Typography>
                </Box>
              ) : oddsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box component="form" onSubmit={handlePlaceBet} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Bet Type</InputLabel>
                    <Select
                      value={betForm.bet_type}
                      onChange={(e) => setBetForm({ ...betForm, bet_type: e.target.value, option: '' })}
                      label="Bet Type"
                    >
                      {odds.map((oddItem) => (
                        <MenuItem key={oddItem.bet_type} value={oddItem.bet_type}>
                          {oddItem.bet_type.replace('_', ' ').toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ mb: 1 }}>Selection</FormLabel>
                    <RadioGroup
                      value={betForm.option}
                      onChange={(e) => setBetForm({ ...betForm, option: e.target.value })}
                    >
                      {odds
                        .find(o => o.bet_type === betForm.bet_type)
                        ?.options &&
                        Object.entries(odds.find(o => o.bet_type === betForm.bet_type)!.options)
                          .map(([option, oddsValue]) => (
                            <Box key={option} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <FormControlLabel
                                value={option}
                                control={<Radio />}
                                label={option.replace('_', ' ').toUpperCase()}
                                sx={{ flexGrow: 1 }}
                              />
                              <Chip
                                label={`${formatOdds(oddsValue)} (${oddsValue.toFixed(2)})`}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            </Box>
                          ))}
                    </RadioGroup>
                  </FormControl>

                  <TextField
                    type="number"
                    label="Stake ($)"
                    inputProps={{ min: 1, max: 1000 }}
                    value={betForm.stake}
                    onChange={(e) => setBetForm({ ...betForm, stake: Number(e.target.value) })}
                    fullWidth
                  />

                  {betForm.option && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Potential Payout:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          ${getPayout().toFixed(2)}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Stake: ${betForm.stake} • Odds: {getSelectedOdds().toFixed(2)}
                      </Typography>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!betForm.option || placeBetMutation.isPending}
                    color="success"
                    sx={{ mt: 2, fontWeight: 'bold' }}
                  >
                    {placeBetMutation.isPending ? 'Placing Bet...' : 'Place Bet'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Info */}
      <Alert severity="warning" sx={{ mt: 4, borderRadius: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Betting Integration
        </Typography>
        <Typography variant="body2">
          Odds are fetched from the BettingService microservice. When a match is scheduled, 
          odds are automatically generated for various betting markets.
        </Typography>
      </Alert>
    </Box>
  );
};

export default BettingTab;