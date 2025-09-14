using TeamGenerator.Domain.Entities;

namespace TeamGenerator.Domain.Services;

public interface ITeamGeneratorService
{
    Task<Team> GenerateTeamAsync(string teamName);
}