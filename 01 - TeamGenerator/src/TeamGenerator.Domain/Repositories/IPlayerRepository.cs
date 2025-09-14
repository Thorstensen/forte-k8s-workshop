using TeamGenerator.Domain.Entities;

namespace TeamGenerator.Domain.Repositories;

public interface IPlayerRepository
{
    Task<IEnumerable<Player>> GetAvailablePlayersAsync();
}