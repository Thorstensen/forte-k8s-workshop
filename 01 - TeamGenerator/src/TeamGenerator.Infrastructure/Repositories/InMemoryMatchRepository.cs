using TeamGenerator.Domain.Entities;
using TeamGenerator.Domain.Repositories;

namespace TeamGenerator.Infrastructure.Repositories;

public class InMemoryMatchRepository : IMatchRepository
{
    private readonly Dictionary<string, Match> _matches = new();
    private readonly ITeamRepository _teamRepository;

    public InMemoryMatchRepository(ITeamRepository teamRepository)
    {
        _teamRepository = teamRepository ?? throw new ArgumentNullException(nameof(teamRepository));
        InitializeSampleMatches();
    }

    public Task<IEnumerable<Match>> GetAllMatchesAsync()
    {
        return Task.FromResult(_matches.Values.AsEnumerable());
    }

    public Task<Match?> GetMatchByIdAsync(string id)
    {
        _matches.TryGetValue(id, out var match);
        return Task.FromResult(match);
    }

    public Task<IEnumerable<Match>> GetMatchesForTeamAsync(string teamId)
    {
        var matches = _matches.Values.Where(m => 
            m.HomeTeamId.Equals(teamId, StringComparison.OrdinalIgnoreCase) ||
            m.AwayTeamId.Equals(teamId, StringComparison.OrdinalIgnoreCase));
        return Task.FromResult(matches);
    }

    public Task<Match> SaveMatchAsync(Match match)
    {
        _matches[match.Id] = match;
        return Task.FromResult(match);
    }

    public Task<bool> DeleteMatchAsync(string id)
    {
        return Task.FromResult(_matches.Remove(id));
    }

    private void InitializeSampleMatches()
    {
        var now = DateTime.UtcNow;
        var matches = new[]
        {
            new Match("match-1", "team-1", "team-2", now.AddDays(1), "Old Trafford", MatchStatus.Scheduled, now, "Premier League match"),
            new Match("match-2", "team-3", "team-4", now.AddDays(2), "Emirates Stadium", MatchStatus.Scheduled, now, "Premier League match"),
            new Match("match-3", "team-5", "team-6", now.AddDays(3), "Etihad Stadium", MatchStatus.Scheduled, now, "Premier League match"),
            new Match("match-4", "team-7", "team-8", now.AddDays(4), "St. James' Park", MatchStatus.Scheduled, now, "Premier League match"),
            new Match("match-5", "team-2", "team-5", now.AddDays(7), "Anfield", MatchStatus.Scheduled, now, "Premier League match"),
            new Match("match-6", "team-4", "team-1", now.AddDays(8), "Stamford Bridge", MatchStatus.Scheduled, now, "Premier League match")
        };

        foreach (var match in matches)
        {
            _matches[match.Id] = match;
        }
    }
}