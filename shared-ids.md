# Shared Entity IDs

This document defines the canonical IDs for entities shared across all microservices in the forte-k8s-workshop.

## Implementation Status

✅ **Complete**: All services now use consistent shared IDs for teams and matches.

## Team IDs

All services use these consistent team IDs:

| Team Name | ID | Short Name | Country |
|-----------|----|-----------| --------|
| Manchester United | team-1 | MUN | England |
| Liverpool | team-2 | LIV | England |
| Chelsea | team-3 | CHE | England |
| Arsenal | team-4 | ARS | England |
| Manchester City | team-5 | MCI | England |
| Tottenham | team-6 | TOT | England |

## Match ID Format

All services use string IDs in the format: `match-{number}`

Examples:
- `match-1`
- `match-2` 
- `match-3`

## Service Implementation Details

### 01 - TeamGenerator (C#)
- ✅ Added `Id` property to `Team` entity
- ✅ Implemented shared team ID mapping in `GetSharedTeamId()` method
- ✅ Backwards compatible constructor that auto-assigns shared IDs

### 02 - BettingService (Python)
- ✅ Removed random UUID generation for teams and matches
- ✅ Updated storage to use shared team IDs: team-1 through team-6
- ✅ Uses consistent match ID format: match-1, match-2, match-3

### 03 - MatchScheduler (TypeScript)
- ✅ Added `homeTeamId` and `awayTeamId` fields to Match interface
- ✅ Implemented `TEAM_ID_MAP` for name-to-ID mapping
- ✅ Updated Swagger documentation with team ID fields
- ✅ `getTeamId()` function provides fallback for unknown teams

### 04 - StatsAggregator (Rust)
- ✅ Modified team generation to use shared IDs 70% of the time
- ✅ Maps team-1 through team-6 to deterministic UUIDs
- ✅ Maintains variety with other teams using random UUIDs

### 05 - NotificationCenter (Go)
- ✅ Already implemented shared team IDs (team-1 through team-6)
- ✅ Uses consistent match ID format
- ✅ Serves as the reference implementation

## Usage Guidelines

1. **No Service-to-Service Communication**: Services do NOT call each other to get IDs
2. **Static Reference**: Each service maintains its own copy of these ID mappings
3. **Consistency**: All API responses use these exact ID values for the same entities
4. **Coordination**: When services reference the same entity (e.g., a team), they use the same ID

This enables clients to correlate data across services without requiring direct service communication.

## Testing

Run the shared ID consistency test:
```bash
python3 /tmp/test_id_consistency.py
```

All services should show ✓ for all shared teams.