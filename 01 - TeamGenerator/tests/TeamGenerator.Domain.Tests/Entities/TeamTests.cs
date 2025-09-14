using TeamGenerator.Domain.Entities;

namespace TeamGenerator.Domain.Tests.Entities;

public class TeamTests
{
    [Fact]
    public void Constructor_WithValidName_CreatesTeam()
    {
        // Arrange
        var teamName = "Barcelona";

        // Act
        var team = new Team(teamName);

        // Assert
        Assert.Equal(teamName, team.Name);
        Assert.Empty(team.StartingPlayers);
        Assert.Empty(team.BenchPlayers);
        Assert.False(team.IsComplete);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_WithInvalidName_ThrowsArgumentException(string? invalidName)
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Team(invalidName!));
    }

    [Fact]
    public void AddStartingPlayer_WithValidPlayer_AddsToStartingLineup()
    {
        // Arrange
        var team = new Team("Test Team");
        var player = new Player("Test Player", Position.Forward, 85);

        // Act
        team.AddStartingPlayer(player);

        // Assert
        Assert.Single(team.StartingPlayers);
        Assert.Equal(player, team.StartingPlayers.First());
    }

    [Fact]
    public void AddStartingPlayer_WhenStartingLineupFull_ThrowsInvalidOperationException()
    {
        // Arrange
        var team = new Team("Test Team");
        
        // Add 11 players to starting lineup
        for (int i = 0; i < 11; i++)
        {
            team.AddStartingPlayer(new Player($"Player {i}", Position.Forward, 80));
        }

        // Act & Assert
        var extraPlayer = new Player("Extra Player", Position.Forward, 80);
        Assert.Throws<InvalidOperationException>(() => team.AddStartingPlayer(extraPlayer));
    }

    [Fact]
    public void AddBenchPlayer_WithValidPlayer_AddsToBench()
    {
        // Arrange
        var team = new Team("Test Team");
        var player = new Player("Bench Player", Position.Forward, 75);

        // Act
        team.AddBenchPlayer(player);

        // Assert
        Assert.Single(team.BenchPlayers);
        Assert.Equal(player, team.BenchPlayers.First());
    }

    [Fact]
    public void IsComplete_WhenTeamHas11StartingAnd7BenchPlayers_ReturnsTrue()
    {
        // Arrange
        var team = new Team("Complete Team");

        // Add 11 starting players
        for (int i = 0; i < 11; i++)
        {
            team.AddStartingPlayer(new Player($"Starting Player {i}", Position.Forward, 80));
        }

        // Add 7 bench players
        for (int i = 0; i < 7; i++)
        {
            team.AddBenchPlayer(new Player($"Bench Player {i}", Position.Forward, 75));
        }

        // Act & Assert
        Assert.True(team.IsComplete);
        Assert.Equal(18, team.AllPlayers.Count);
    }
}