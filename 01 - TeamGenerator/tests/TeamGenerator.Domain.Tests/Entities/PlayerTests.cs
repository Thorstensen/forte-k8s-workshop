using TeamGenerator.Domain.Entities;

namespace TeamGenerator.Domain.Tests.Entities;

public class PlayerTests
{
    [Fact]
    public void Constructor_WithValidParameters_CreatesPlayer()
    {
        // Arrange
        var name = "Lionel Messi";
        var position = Position.Forward;
        var skillLevel = 95;

        // Act
        var player = new Player(name, position, skillLevel);

        // Assert
        Assert.Equal(name, player.Name);
        Assert.Equal(position, player.Position);
        Assert.Equal(skillLevel, player.SkillLevel);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_WithInvalidName_ThrowsArgumentException(string? invalidName)
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Player(invalidName!, Position.Forward, 85));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(101)]
    public void Constructor_WithInvalidSkillLevel_ThrowsArgumentException(int invalidSkillLevel)
    {
        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Player("Test Player", Position.Forward, invalidSkillLevel));
    }

    [Fact]
    public void Constructor_TrimsPlayerName()
    {
        // Arrange
        var nameWithSpaces = "  Cristiano Ronaldo  ";
        var expectedName = "Cristiano Ronaldo";

        // Act
        var player = new Player(nameWithSpaces, Position.Forward, 94);

        // Assert
        Assert.Equal(expectedName, player.Name);
    }
}