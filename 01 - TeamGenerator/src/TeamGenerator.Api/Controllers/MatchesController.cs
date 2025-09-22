using Microsoft.AspNetCore.Mvc;
using TeamGenerator.Domain.Repositories;

namespace TeamGenerator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MatchesController : ControllerBase
{
    private readonly IMatchRepository _matchRepository;
    private readonly ITeamRepository _teamRepository;
    private readonly ILogger<MatchesController> _logger;

    public MatchesController(IMatchRepository matchRepository, ITeamRepository teamRepository, ILogger<MatchesController> logger)
    {
        _matchRepository = matchRepository ?? throw new ArgumentNullException(nameof(matchRepository));
        _teamRepository = teamRepository ?? throw new ArgumentNullException(nameof(teamRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Gets all matches
    /// </summary>
    /// <returns>List of all matches with team IDs</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllMatches()
    {
        try
        {
            var matches = await _matchRepository.GetAllMatchesAsync();
            
            var response = matches.Select(m => new
            {
                m.Id,
                m.HomeTeamId,
                m.AwayTeamId,
                m.ScheduledDate,
                m.Venue,
                Status = m.Status.ToString(),
                m.CreatedAt,
                m.Notes
            });

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving matches");
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }

    /// <summary>
    /// Gets a specific match by ID
    /// </summary>
    /// <param name="id">The match ID</param>
    /// <returns>Match details if found</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMatchById(string id)
    {
        try
        {
            var match = await _matchRepository.GetMatchByIdAsync(id);
            
            if (match == null)
            {
                return NotFound(new { error = $"Match with ID {id} not found" });
            }

            var response = new
            {
                match.Id,
                match.HomeTeamId,
                match.AwayTeamId,
                match.ScheduledDate,
                match.Venue,
                Status = match.Status.ToString(),
                match.CreatedAt,
                match.Notes
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving match {MatchId}", id);
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }

    /// <summary>
    /// Gets all matches for a specific team
    /// </summary>
    /// <param name="teamId">The team ID</param>
    /// <returns>List of matches involving the specified team</returns>
    [HttpGet("team/{teamId}")]
    public async Task<IActionResult> GetMatchesForTeam(string teamId)
    {
        try
        {
            // Verify team exists
            var team = await _teamRepository.GetTeamByIdAsync(teamId);
            if (team == null)
            {
                return NotFound(new { error = $"Team with ID {teamId} not found" });
            }

            var matches = await _matchRepository.GetMatchesForTeamAsync(teamId);
            
            var response = matches.Select(m => new
            {
                m.Id,
                m.HomeTeamId,
                m.AwayTeamId,
                m.ScheduledDate,
                m.Venue,
                Status = m.Status.ToString(),
                m.CreatedAt,
                m.Notes
            });

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving matches for team {TeamId}", teamId);
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }
}