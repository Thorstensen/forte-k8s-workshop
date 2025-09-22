using TeamGenerator.Domain.Entities;
using TeamGenerator.Domain.Repositories;

namespace TeamGenerator.Infrastructure.Repositories;

public class InMemoryTeamRepository : ITeamRepository
{
    private readonly Dictionary<string, Team> _teams = new();

    public InMemoryTeamRepository()
    {
        InitializeSampleTeams();
    }

    public Task<IEnumerable<Team>> GetAllTeamsAsync()
    {
        return Task.FromResult(_teams.Values.AsEnumerable());
    }

    public Task<Team?> GetTeamByIdAsync(string id)
    {
        _teams.TryGetValue(id, out var team);
        return Task.FromResult(team);
    }

    public Task<Team> SaveTeamAsync(Team team)
    {
        _teams[team.Id] = team;
        return Task.FromResult(team);
    }

    public Task<bool> DeleteTeamAsync(string id)
    {
        return Task.FromResult(_teams.Remove(id));
    }

    private void InitializeSampleTeams()
    {
        var teams = new[]
        {
            new Team("team-1", "Manchester United"),
            new Team("team-2", "Liverpool"),
            new Team("team-3", "Arsenal"),
            new Team("team-4", "Chelsea"),
            new Team("team-5", "Manchester City"),
            new Team("team-6", "Tottenham"),
            new Team("team-7", "Newcastle United"),
            new Team("team-8", "West Ham United")
        };

        foreach (var team in teams)
        {
            _teams[team.Id] = team;
        }
    }
}