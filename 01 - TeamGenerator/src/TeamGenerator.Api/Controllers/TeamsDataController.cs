using Microsoft.AspNetCore.Mvc;
using TeamGenerator.Domain.Repositories;

namespace TeamGenerator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsDataController : ControllerBase
{
    private readonly ITeamRepository _teamRepository;
    private readonly ILogger<TeamsDataController> _logger;

    public TeamsDataController(ITeamRepository teamRepository, ILogger<TeamsDataController> logger)
    {
        _teamRepository = teamRepository ?? throw new ArgumentNullException(nameof(teamRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets all teams with their IDs and names
    /// </summary>
    /// <returns>List of all teams</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllTeams()
    {
        try
        {
            var teams = await _teamRepository.GetAllTeamsAsync();
            
            var response = teams.Select(t => new
            {
                t.Id,
                t.Name
            });

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving teams");
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }

    /// <summary>
    /// Gets a specific team by ID
    /// </summary>
    /// <param name="id">The team ID</param>
    /// <returns>Team details if found</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTeamById(string id)
    {
        try
        {
            var team = await _teamRepository.GetTeamByIdAsync(id);
            
            if (team == null)
            {
                return NotFound(new { error = $"Team with ID {id} not found" });
            }

            var response = new
            {
                team.Id,
                team.Name
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving team {TeamId}", id);
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }
}