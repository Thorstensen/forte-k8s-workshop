using TeamGenerator.Domain.Entities;
using TeamGenerator.Domain.Repositories;

namespace TeamGenerator.Infrastructure.Repositories;

public class InMemoryPlayerRepository : IPlayerRepository
{
    private static readonly List<Player> _players = GenerateMockPlayers();

    public Task<IEnumerable<Player>> GetAvailablePlayersAsync()
    {
        return Task.FromResult<IEnumerable<Player>>(_players);
    }

    private static List<Player> GenerateMockPlayers()
    {
        var players = new List<Player>();
        var random = new Random(42); // Fixed seed for consistent results

        // Goalkeepers
        var goalkeepers = new[]
        {
            "Manuel Neuer", "Alisson Becker", "Jan Oblak", "Ederson Moraes", "Thibaut Courtois"
        };
        foreach (var name in goalkeepers)
        {
            players.Add(new Player(name, Position.Goalkeeper, random.Next(75, 95)));
        }

        // Defenders
        var defenders = new[]
        {
            "Virgil van Dijk", "Sergio Ramos", "Kalidou Koulibaly", "Raphael Varane", "Ruben Dias",
            "Alessandro Bastoni", "Joao Cancelo", "Achraf Hakimi", "Theo Hernandez", "Kyle Walker",
            "Marquinhos", "Milan Skriniar", "Antonio Rudiger", "Jules Kounde", "William Saliba"
        };
        foreach (var name in defenders)
        {
            players.Add(new Player(name, Position.Defender, random.Next(70, 92)));
        }

        // Midfielders
        var midfielders = new[]
        {
            "Kevin De Bruyne", "Luka Modric", "N'Golo Kante", "Joshua Kimmich", "Pedri",
            "Bruno Fernandes", "Casemiro", "Frenkie de Jong", "Mason Mount", "Declan Rice",
            "Federico Valverde", "Jude Bellingham", "Gavi", "Jamal Musiala", "Phil Foden",
            "Marco Verratti", "Nicolo Barella", "Tyler Adams", "Yunus Musah", "Weston McKennie"
        };
        foreach (var name in midfielders)
        {
            players.Add(new Player(name, Position.Midfielder, random.Next(72, 94)));
        }

        // Forwards
        var forwards = new[]
        {
            "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappe", "Erling Haaland", "Robert Lewandowski",
            "Neymar Jr", "Mohamed Salah", "Sadio Mane", "Karim Benzema", "Harry Kane",
            "Vinicius Jr", "Raheem Sterling", "Jadon Sancho", "Marcus Rashford", "Gabriel Jesus",
            "Lautaro Martinez", "Romelu Lukaku", "Darwin Nunez", "Christian Pulisic", "Folarin Balogun"
        };
        foreach (var name in forwards)
        {
            players.Add(new Player(name, Position.Forward, random.Next(75, 96)));
        }

        return players;
    }
}
