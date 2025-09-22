using Moq;
using TeamGenerator.Application.Services;
using TeamGenerator.Domain.Entities;
using TeamGenerator.Domain.Repositories;

namespace TeamGenerator.Application.Tests.Services;

public class TeamGeneratorServiceTests
{
    private readonly Mock<IPlayerRepository> _mockPlayerRepository;
    private readonly TeamGeneratorService _service;

    public TeamGeneratorServiceTests()
    {
        _mockPlayerRepository = new Mock<IPlayerRepository>();
        _service = new TeamGeneratorService(_mockPlayerRepository.Object);
    }

    [Fact]
    public async Task GenerateTeamAsync_WithValidTeamName_ReturnsCompleteTeam()
    {
        // Arrange
        var teamName = "Test Team";
        var players = CreateMockPlayers(20);
        _mockPlayerRepository.Setup(r => r.GetAvailablePlayersAsync())
            .ReturnsAsync(players);

        // Act
        var result = await _service.GenerateTeamAsync(teamName);

        // Assert
        Assert.Equal(teamName, result.Name);
        Assert.Equal(11, result.StartingPlayers.Count);
        Assert.Equal(7, result.BenchPlayers.Count);
        Assert.True(result.IsComplete);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task GenerateTeamAsync_WithInvalidTeamName_ThrowsArgumentException(string? invalidName)
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.GenerateTeamAsync(invalidName!));
    }

    [Fact]
    public async Task GenerateTeamAsync_WithInsufficientPlayers_ThrowsInvalidOperationException()
    {
        // Arrange
        var players = CreateMockPlayers(10); // Less than 18 required
        _mockPlayerRepository.Setup(r => r.GetAvailablePlayersAsync())
            .ReturnsAsync(players);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.GenerateTeamAsync("Test Team"));
    }

    [Fact]
    public async Task GenerateTeamAsync_EnsuresGoalkeeperInStartingLineup()
    {
        // Arrange
        var players = CreateMockPlayers(20);
        _mockPlayerRepository.Setup(r => r.GetAvailablePlayersAsync())
            .ReturnsAsync(players);

        // Act
        var result = await _service.GenerateTeamAsync("Test Team");

        // Assert
        Assert.Contains(result.StartingPlayers, p => p.Position == Position.Goalkeeper);
    }

    private static List<Player> CreateMockPlayers(int count)
    {
        var players = new List<Player>();
        var positions = new[] { Position.Goalkeeper, Position.Defender, Position.Midfielder, Position.Forward };
        
        for (int i = 0; i < count; i++)
        {
            var position = i == 0 ? Position.Goalkeeper : positions[i % positions.Length];
            players.Add(new Player($"player-{i}", $"Player {i}", position, 70 + (i % 30)));
        }

        return players;
    }
}