namespace TeamGenerator.Domain.Entities;

public class Team
{
    private readonly List<Player> _startingPlayers = new();
    private readonly List<Player> _benchPlayers = new();

    public string Name { get; private set; }
    public IReadOnlyList<Player> StartingPlayers => _startingPlayers.AsReadOnly();
    public IReadOnlyList<Player> BenchPlayers => _benchPlayers.AsReadOnly();
    public IReadOnlyList<Player> AllPlayers => _startingPlayers.Concat(_benchPlayers).ToList().AsReadOnly();

    public Team(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Team name cannot be null or empty.", nameof(name));
        
        Name = name.Trim();
    }

    public void AddStartingPlayer(Player player)
    {
        if (player == null)
            throw new ArgumentNullException(nameof(player));
        
        if (_startingPlayers.Count >= 11)
            throw new InvalidOperationException("Starting lineup cannot have more than 11 players.");
        
        if (_startingPlayers.Any(p => p.Name.Equals(player.Name, StringComparison.OrdinalIgnoreCase)) ||
            _benchPlayers.Any(p => p.Name.Equals(player.Name, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException($"Player {player.Name} is already in the team.");

        _startingPlayers.Add(player);
    }

    public void AddBenchPlayer(Player player)
    {
        if (player == null)
            throw new ArgumentNullException(nameof(player));
        
        if (_benchPlayers.Count >= 7)
            throw new InvalidOperationException("Bench cannot have more than 7 players.");
        
        if (_startingPlayers.Any(p => p.Name.Equals(player.Name, StringComparison.OrdinalIgnoreCase)) ||
            _benchPlayers.Any(p => p.Name.Equals(player.Name, StringComparison.OrdinalIgnoreCase)))
            throw new InvalidOperationException($"Player {player.Name} is already in the team.");

        _benchPlayers.Add(player);
    }

    public bool IsComplete => _startingPlayers.Count == 11 && _benchPlayers.Count == 7;
}