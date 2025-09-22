import React, { useState } from 'react';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import { useMatchOdds, useBettingMatches, usePlaceBet } from '../hooks/useApi';
import { formatOdds, calculatePayout, formatDate, cn } from '../utils';

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Betting</h2>
        <div className="flex items-center text-sm text-gray-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          Live Odds
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Matches */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Available Matches</h3>
          
          {bettingMatches.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No matches available</h4>
              <p className="text-gray-500">Check back later for betting opportunities.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bettingMatches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match.id)}
                  className={cn(
                    'bg-white p-4 rounded-lg border cursor-pointer transition-all',
                    selectedMatch === match.id
                      ? 'border-blue-500 shadow-md bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {match.homeTeamName} vs {match.awayTeamName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(match.scheduledDate)} • {match.venue}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">
                        Click to bet
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Betting Form */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Place Bet</h3>
          
          {!selectedMatch ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a match to place a bet</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              {oddsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <form onSubmit={handlePlaceBet} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bet Type
                    </label>
                    <select
                      value={betForm.bet_type}
                      onChange={(e) => setBetForm({ ...betForm, bet_type: e.target.value, option: '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {odds.map((oddItem) => (
                        <option key={oddItem.bet_type} value={oddItem.bet_type}>
                          {oddItem.bet_type.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selection
                    </label>
                    <div className="space-y-2">
                      {odds
                        .find(o => o.bet_type === betForm.bet_type)
                        ?.options &&
                        Object.entries(odds.find(o => o.bet_type === betForm.bet_type)!.options)
                          .map(([option, oddsValue]) => (
                            <label key={option} className="flex items-center">
                              <input
                                type="radio"
                                name="option"
                                value={option}
                                checked={betForm.option === option}
                                onChange={(e) => setBetForm({ ...betForm, option: e.target.value })}
                                className="mr-3 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="flex-1">
                                {option.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className="font-semibold text-blue-600">
                                {formatOdds(oddsValue)} ({oddsValue.toFixed(2)})
                              </span>
                            </label>
                          ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stake ($)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={betForm.stake}
                      onChange={(e) => setBetForm({ ...betForm, stake: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {betForm.option && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-900">
                          Potential Payout:
                        </span>
                        <span className="text-lg font-bold text-blue-900">
                          ${getPayout().toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-blue-700 mt-1">
                        Stake: ${betForm.stake} • Odds: {getSelectedOdds().toFixed(2)}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!betForm.option || placeBetMutation.isPending}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {placeBetMutation.isPending ? 'Placing Bet...' : 'Place Bet'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900">Betting Integration</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Odds are fetched from the BettingService microservice. When a match is scheduled, 
              odds are automatically generated for various betting markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingTab;