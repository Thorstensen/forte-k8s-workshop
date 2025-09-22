import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Clock, Play } from 'lucide-react';
import { useMatches, useScheduleMatch, useStartMatch } from '../hooks/useApi';
import { TEAMS, ScheduleMatchRequest } from '../types';
import { formatDate, getTimeFromNow, getMatchStatusColor, cn } from '../utils';

const MatchesTab: React.FC = () => {
  const { data: matches = [], isLoading, error } = useMatches();
  const scheduleMatchMutation = useScheduleMatch();
  const startMatchMutation = useStartMatch();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">
          Error loading matches: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Matches</h2>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Schedule Match
        </button>
      </div>

      {/* Schedule Match Form */}
      {showScheduleForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Schedule New Match</h3>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home Team
                </label>
                <select
                  required
                  value={scheduleForm.homeTeamName}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, homeTeamName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select home team</option>
                  {TEAMS.map(team => (
                    <option key={team.id} value={team.name}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Away Team
                </label>
                <select
                  required
                  value={scheduleForm.awayTeamName}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, awayTeamName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select away team</option>
                  {TEAMS.filter(team => team.name !== scheduleForm.homeTeamName).map(team => (
                    <option key={team.id} value={team.name}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  required
                  placeholder="Stadium name"
                  value={scheduleForm.venue}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                placeholder="Additional match details"
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={scheduleMatchMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {scheduleMatchMutation.isPending ? 'Scheduling...' : 'Schedule Match'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Matches List */}
      <div className="grid gap-4">
        {matches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches scheduled</h3>
            <p className="text-gray-500">Schedule your first match to get started.</p>
          </div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {match.homeTeamName} vs {match.awayTeamName}
                    </h3>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      getMatchStatusColor(match.status)
                    )}>
                      {match.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(match.scheduledDate)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {match.venue}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getTimeFromNow(match.scheduledDate)}
                    </div>
                  </div>
                  
                  {match.notes && (
                    <p className="mt-2 text-sm text-gray-600">{match.notes}</p>
                  )}
                </div>
                
                {canStartMatch(match) && (
                  <button
                    onClick={() => handleStartMatch(match.id)}
                    disabled={startMatchMutation.isPending}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Match Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchesTab;