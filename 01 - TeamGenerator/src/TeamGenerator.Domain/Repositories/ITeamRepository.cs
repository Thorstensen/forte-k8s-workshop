using TeamGenerator.Domain.Entities;

namespace TeamGenerator.Domain.Repositories;

public interface ITeamRepository
{
    Task<IEnumerable<Team>> GetAllTeamsAsync();
    Task<Team?> GetTeamByIdAsync(string id);
    Task<Team> SaveTeamAsync(Team team);
    Task<bool> DeleteTeamAsync(string id);
}