namespace TeamGenerator.Domain.Entities;

public class Match
{
    public string Id { get; private set; }
    public string HomeTeamId { get; private set; }
    public string AwayTeamId { get; private set; }
    public DateTime ScheduledDate { get; private set; }
    public string Venue { get; private set; }
    public MatchStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public string? Notes { get; private set; }

    public Match(string homeTeamId, string awayTeamId, DateTime scheduledDate, string venue) 
        : this(Guid.NewGuid().ToString(), homeTeamId, awayTeamId, scheduledDate, venue, MatchStatus.Scheduled, DateTime.UtcNow, null)
    {
    }

    public Match(string id, string homeTeamId, string awayTeamId, DateTime scheduledDate, string venue, MatchStatus status, DateTime createdAt, string? notes)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Match ID cannot be null or empty.", nameof(id));
        if (string.IsNullOrWhiteSpace(homeTeamId))
            throw new ArgumentException("Home team ID cannot be null or empty.", nameof(homeTeamId));
        if (string.IsNullOrWhiteSpace(awayTeamId))
            throw new ArgumentException("Away team ID cannot be null or empty.", nameof(awayTeamId));
        if (string.IsNullOrWhiteSpace(venue))
            throw new ArgumentException("Venue cannot be null or empty.", nameof(venue));
        if (homeTeamId.Equals(awayTeamId, StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException("Home team and away team cannot be the same.", nameof(awayTeamId));

        Id = id.Trim();
        HomeTeamId = homeTeamId.Trim();
        AwayTeamId = awayTeamId.Trim();
        ScheduledDate = scheduledDate;
        Venue = venue.Trim();
        Status = status;
        CreatedAt = createdAt;
        Notes = notes?.Trim();
    }

    public void UpdateStatus(MatchStatus newStatus)
    {
        Status = newStatus;
    }

    public void UpdateNotes(string? notes)
    {
        Notes = notes?.Trim();
    }
}

public enum MatchStatus
{
    Scheduled,
    InProgress,
    Completed,
    Cancelled,
    Postponed
}