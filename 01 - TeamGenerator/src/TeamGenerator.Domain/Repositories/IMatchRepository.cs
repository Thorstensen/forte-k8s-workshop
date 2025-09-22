using TeamGenerator.Domain.Entities;

namespace TeamGenerator.Domain.Repositories;

public interface IMatchRepository
{
    Task<IEnumerable<Match>> GetAllMatchesAsync();
    Task<Match?> GetMatchByIdAsync(string id);
    Task<IEnumerable<Match>> GetMatchesForTeamAsync(string teamId);
    Task<Match> SaveMatchAsync(Match match);
    Task<bool> DeleteMatchAsync(string id);
}