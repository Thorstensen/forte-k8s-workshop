namespace TeamGenerator.Domain.Entities;

public class Player
{
    public string Id { get; private set; }
    public string Name { get; private set; }
    public Position Position { get; private set; }
    public int SkillLevel { get; private set; }

    public Player(string name, Position position, int skillLevel) : this(Guid.NewGuid().ToString(), name, position, skillLevel)
    {
    }

    public Player(string id, string name, Position position, int skillLevel)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Player ID cannot be null or empty.", nameof(id));
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Player name cannot be null or empty.", nameof(name));
        
        if (skillLevel < 1 || skillLevel > 100)
            throw new ArgumentException("Skill level must be between 1 and 100.", nameof(skillLevel));

        Id = id.Trim();
        Name = name.Trim();
        Position = position;
        SkillLevel = skillLevel;
    }
}
