import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Clock, Play, Users, Trophy, X, Map } from 'lucide-react';
import { useMatches, useScheduleMatch, useStartMatch } from '../hooks/useApi';
import { TEAMS, ScheduleMatchRequest } from '../types';
import { formatDate, getTimeFromNow, getMatchStatusColor, cn } from '../utils';
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Unable to load matches</h3>
            <p className="text-red-700 mt-1">
              {error.message || 'Network Error - Please check if the backend services are running'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold mb-2">Match Center</h2>
            <p className="text-blue-100 text-lg">
              Manage and schedule football matches across top stadiums
            </p>
            <div className="mt-4 flex items-center space-x-6 text-blue-100">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                <span>{matches.length} Matches</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{TEAMS.length} Teams</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowScheduleForm(true)}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Match
          </button>
        </div>
      </div>

      {/* Enhanced Schedule Match Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Schedule New Match</h3>
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleScheduleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Home Team
                    </label>
                    <select
                      required
                      value={scheduleForm.homeTeamName}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, homeTeamName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select home team</option>
                      {TEAMS.map(team => (
                        <option key={team.id} value={team.name}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Away Team
                    </label>
                    <select
                      required
                      value={scheduleForm.awayTeamName}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, awayTeamName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select away team</option>
                      {TEAMS.filter(team => team.name !== scheduleForm.homeTeamName).map(team => (
                        <option key={team.id} value={team.name}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Match Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={scheduleForm.scheduledDate}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stadium
                    </label>
                    <select
                      required
                      value={scheduleForm.venue}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select stadium</option>
                      {getStadiumNames().map(stadium => (
                        <option key={stadium} value={stadium}>{stadium}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Match Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Add any additional match details or special arrangements..."
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduleMatchMutation.isPending}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {scheduleMatchMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Scheduling...
                      </>
                    ) : (
                      'Schedule Match'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Matches List */}
      <div className="grid gap-6">
        {matches.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No matches scheduled</h3>
            <p className="text-gray-600 text-lg mb-6">Get started by scheduling your first match</p>
            <button
              onClick={() => setShowScheduleForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Schedule Your First Match
            </button>
          </div>
        ) : (
          matches.map((match) => {
            const stadiumInfo = getStadiumInfo(match.venue);
            return (
              <div key={match.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Match Details */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {match.homeTeamName} vs {match.awayTeamName}
                          </h3>
                          <span className={cn(
                            'px-3 py-1 rounded-full text-sm font-semibold',
                            getMatchStatusColor(match.status)
                          )}>
                            {match.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        {canStartMatch(match) && (
                          <button
                            onClick={() => handleStartMatch(match.id)}
                            disabled={startMatchMutation.isPending}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl"
                          >
                            <Play className="h-5 w-5 mr-2" />
                            Start Match
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="flex items-center bg-gray-50 rounded-xl p-4">
                          <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Match Date</p>
                            <p className="text-gray-900 font-semibold">{formatDate(match.scheduledDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-gray-50 rounded-xl p-4">
                          <MapPin className="h-6 w-6 text-red-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Stadium</p>
                            <p className="text-gray-900 font-semibold">{match.venue}</p>
                            {stadiumInfo && (
                              <p className="text-xs text-gray-500">{stadiumInfo.city}, {stadiumInfo.country}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center bg-gray-50 rounded-xl p-4">
                          <Clock className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Time Remaining</p>
                            <p className="text-gray-900 font-semibold">{getTimeFromNow(match.scheduledDate)}</p>
                          </div>
                        </div>
                      </div>
                      
                      {stadiumInfo && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                          <div className="flex items-center mb-2">
                            <Trophy className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="font-semibold text-blue-900">Stadium Information</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700 font-medium">Capacity:</span>
                              <span className="text-blue-900 ml-2">{stadiumInfo.capacity.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-blue-700 font-medium">Location:</span>
                              <span className="text-blue-900 ml-2">{stadiumInfo.city}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {match.notes && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-4">
                          <p className="text-yellow-800 font-medium">Match Notes:</p>
                          <p className="text-yellow-700 mt-1">{match.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-6">
                        <button
                          onClick={() => setSelectedMatch(match)}
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                        >
                          <Map className="h-4 w-4 mr-2" />
                          View Stadium Location
                        </button>
                      </div>
                    </div>
                    
                    {/* Stadium Map Preview */}
                    {stadiumInfo && (
                      <div className="lg:w-80">
                        <div className="bg-gray-100 rounded-xl p-1">
                          <StadiumMap 
                            stadium={stadiumInfo} 
                            className="w-full h-48 rounded-lg"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          {stadiumInfo.address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stadium Detail Modal */}
      {selectedMatch && getStadiumInfo(selectedMatch.venue) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedMatch.venue}</h3>
                  <p className="text-gray-600">
                    {selectedMatch.homeTeamName} vs {selectedMatch.awayTeamName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <StadiumMap 
                    stadium={getStadiumInfo(selectedMatch.venue)!} 
                    className="w-full h-96 rounded-xl"
                  />
                </div>
                <div className="space-y-6">
                  {(() => {
                    const info = getStadiumInfo(selectedMatch.venue)!;
                    return (
                      <>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Stadium Details</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Capacity:</span>
                              <span className="font-semibold">{info.capacity.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">City:</span>
                              <span className="font-semibold">{info.city}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Country:</span>
                              <span className="font-semibold">{info.country}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Address</h4>
                          <p className="text-gray-600">{info.address}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Match Information</h4>
                          <div className="space-y-2">
                            <p><span className="text-gray-600">Date:</span> <span className="font-semibold">{formatDate(selectedMatch.scheduledDate)}</span></p>
                            <p><span className="text-gray-600">Status:</span> <span className="font-semibold">{selectedMatch.status.replace('_', ' ').toUpperCase()}</span></p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesTab;