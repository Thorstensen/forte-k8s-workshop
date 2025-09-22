using Microsoft.AspNetCore.Mvc;
using TeamGenerator.Domain.Services;

namespace TeamGenerator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly ITeamGeneratorService _teamGeneratorService;
    private readonly ILogger<TeamsController> _logger;

    public TeamsController(ITeamGeneratorService teamGeneratorService, ILogger<TeamsController> logger)
    {
        _teamGeneratorService = teamGeneratorService ?? throw new ArgumentNullException(nameof(teamGeneratorService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Generates a soccer team with 11 starting players and 7 bench players
    /// </summary>
    /// <param name="teamName">The name for the generated team (optional, defaults to "Generated Team")</param>
    /// <returns>A complete soccer team with starting lineup and bench</returns>
    [HttpGet]
    public async Task<IActionResult> GenerateTeam([FromQuery] string? teamName = null)
    {
        try
        {
            var name = string.IsNullOrWhiteSpace(teamName) ? "Generated Team" : teamName;
            
            _logger.LogInformation("Generating team with name: {TeamName}", name);
            
            var team = await _teamGeneratorService.GenerateTeamAsync(name);
            
            var response = new
            {
                Team = new
                {
                    team.Id,
                    team.Name
                },
                StartingLineup = team.StartingPlayers.Select(p => new
                {
                    p.Id,
                    p.Name,
                    Position = p.Position.ToString(),
                    p.SkillLevel
                }),
                Bench = team.BenchPlayers.Select(p => new
                {
                    p.Id,
                    p.Name,
                    Position = p.Position.ToString(),
                    p.SkillLevel
                }),
                TotalPlayers = team.AllPlayers.Count,
                IsComplete = team.IsComplete
            };

            _logger.LogInformation("Successfully generated team: {TeamName} with {TotalPlayers} players", 
                team.Name, team.AllPlayers.Count);

            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Invalid argument: {Message}", ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Invalid operation: {Message}", ex.Message);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred while generating team");
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }
}