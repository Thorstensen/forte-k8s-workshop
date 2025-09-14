using TeamGenerator.Domain.Entities;
using TeamGenerator.Domain.Repositories;
using TeamGenerator.Domain.Services;

namespace TeamGenerator.Application.Services;

public class TeamGeneratorService : ITeamGeneratorService
{
    private readonly IPlayerRepository _playerRepository;

    public TeamGeneratorService(IPlayerRepository playerRepository)
    {
        _playerRepository = playerRepository ?? throw new ArgumentNullException(nameof(playerRepository));
    }

    public async Task<Team> GenerateTeamAsync(string teamName)
    {
        if (string.IsNullOrWhiteSpace(teamName))
            throw new ArgumentException("Team name cannot be null or empty.", nameof(teamName));

        var availablePlayers = await _playerRepository.GetAvailablePlayersAsync();
        var playersList = availablePlayers.ToList();

        if (playersList.Count < 18)
            throw new InvalidOperationException("Not enough players available to generate a team.");

        var team = new Team(teamName);
        
        // Generate starting lineup (11 players)
        var startingPlayers = SelectPlayersForStartingLineup(playersList);
        foreach (var player in startingPlayers)
        {
            team.AddStartingPlayer(player);
        }

        // Generate bench (7 players)
        var remainingPlayers = playersList.Except(startingPlayers).ToList();
        var benchPlayers = SelectPlayersForBench(remainingPlayers);
        foreach (var player in benchPlayers)
        {
            team.AddBenchPlayer(player);
        }

        return team;
    }

    private static List<Player> SelectPlayersForStartingLineup(List<Player> availablePlayers)
    {
        var selectedPlayers = new List<Player>();
        var random = new Random();

        // Ensure we have at least one goalkeeper
        var goalkeepers = availablePlayers.Where(p => p.Position == Position.Goalkeeper).ToList();
        if (goalkeepers.Count > 0)
        {
            selectedPlayers.Add(goalkeepers[random.Next(goalkeepers.Count)]);
        }

        // Add remaining players, prioritizing by skill level and position diversity
        var remainingPositions = new[] { Position.Defender, Position.Midfielder, Position.Forward };
        var playersToSelect = availablePlayers.Except(selectedPlayers).ToList();

        // Try to get balanced formation (4-4-2 or similar)
        AddPlayersByPosition(selectedPlayers, playersToSelect, Position.Defender, 4, random);
        AddPlayersByPosition(selectedPlayers, playersToSelect, Position.Midfielder, 4, random);
        AddPlayersByPosition(selectedPlayers, playersToSelect, Position.Forward, 2, random);

        // Fill remaining spots with best available players
        while (selectedPlayers.Count < 11 && playersToSelect.Count > 0)
        {
            var bestPlayer = playersToSelect.OrderByDescending(p => p.SkillLevel).First();
            selectedPlayers.Add(bestPlayer);
            playersToSelect.Remove(bestPlayer);
        }

        return selectedPlayers;
    }

    private static void AddPlayersByPosition(List<Player> selectedPlayers, List<Player> availablePlayers, 
        Position position, int targetCount, Random random)
    {
        var positionPlayers = availablePlayers
            .Where(p => p.Position == position && !selectedPlayers.Contains(p))
            .OrderByDescending(p => p.SkillLevel)
            .ToList();

        var playersToAdd = Math.Min(targetCount, positionPlayers.Count);
        for (int i = 0; i < playersToAdd && selectedPlayers.Count < 11; i++)
        {
            selectedPlayers.Add(positionPlayers[i]);
        }
    }

    private static List<Player> SelectPlayersForBench(List<Player> availablePlayers)
    {
        var random = new Random();
        return availablePlayers
            .OrderByDescending(p => p.SkillLevel)
            .Take(7)
            .ToList();
    }
}
