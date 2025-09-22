using Microsoft.AspNetCore.Mvc;
using TeamGenerator.Domain.Repositories;

namespace TeamGenerator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly IPlayerRepository _playerRepository;
    private readonly ILogger<PlayersController> _logger;

    public PlayersController(IPlayerRepository playerRepository, ILogger<PlayersController> logger)
    {
        _playerRepository = playerRepository ?? throw new ArgumentNullException(nameof(playerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets all available players
    /// </summary>
    /// <returns>List of all players with their IDs, names, positions, and skill levels</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllPlayers()
    {
        try
        {
            var players = await _playerRepository.GetAvailablePlayersAsync();
            
            var response = players.Select(p => new
            {
                p.Id,
                p.Name,
                Position = p.Position.ToString(),
                p.SkillLevel
            });

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving players");
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }

    /// <summary>
    /// Gets a specific player by ID
    /// </summary>
    /// <param name="id">The player ID</param>
    /// <returns>Player details if found</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPlayerById(string id)
    {
        try
        {
            var players = await _playerRepository.GetAvailablePlayersAsync();
            var player = players.FirstOrDefault(p => p.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            
            if (player == null)
            {
                return NotFound(new { error = $"Player with ID {id} not found" });
            }

            var response = new
            {
                player.Id,
                player.Name,
                Position = player.Position.ToString(),
                player.SkillLevel
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving player {PlayerId}", id);
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }
}