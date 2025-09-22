import React, { useState } from 'react';
import { Users, Plus, Trophy } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Teams</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Team
        </button>
      </div>

      {/* Create Team Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Team
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAMS.map((team) => (
          <div key={team.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{team.shortName}</span>
                  <span>•</span>
                  <span>{team.country}</span>
                </div>
                <div className="text-xs text-blue-600 mt-1">ID: {team.id}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Users className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Available Teams</h4>
            <p className="text-sm text-blue-700 mt-1">
              These are the pre-configured teams available across all microservices. 
              Team creation would integrate with the TeamGenerator service to add new teams with generated players.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsTab;