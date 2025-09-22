# Shared ID Consistency Tests

This directory contains tests to verify that all microservices use consistent shared IDs for common entities.

## Test Files

### `shared-id-consistency.py`
Integration test that validates all services use the same team IDs for the same teams.

**What it tests:**
- Team ID consistency across all 5 services
- Proper ID format (team-1, team-2, etc.)
- No duplicate or conflicting IDs

**How to run:**
```bash
cd /home/runner/work/forte-k8s-workshop/forte-k8s-workshop
python3 tests/shared-id-consistency.py
```

**Expected output:**
```
=== Shared ID Consistency Integration Test ===

Go NotificationCenter:
  ✓ Manchester United -> team-1
  ✓ Liverpool -> team-2
  ... (all teams pass)

=== Test Result ===
✅ ALL TESTS PASSED: Shared ID consistency is maintained across all services!
```

## Test Coverage

The test covers all 5 microservices:

1. **Go NotificationCenter** (`05 - NotificationCenter`)
   - Tests team ID definitions in `main.go`
   
2. **TypeScript MatchScheduler** (`03 - MatchScheduler`) 
   - Tests `TEAM_ID_MAP` in `src/domain/Match.ts`
   
3. **C# TeamGenerator** (`01 - TeamGenerator`)
   - Tests shared ID mapping in `src/TeamGenerator.Domain/Entities/Team.cs`
   
4. **Python BettingService** (`02 - BettingService`)
   - Tests team creation in `src/storage/memory_storage.py`
   
5. **Rust StatsAggregator** (`04 - StatsAggregator`)
   - Tests shared teams in `src/generator.rs`

## Validation Rules

Each service must use these exact team IDs:

| Team | ID |
|------|-----|
| Manchester United | team-1 |
| Liverpool | team-2 |
| Chelsea | team-3 |
| Arsenal | team-4 |
| Manchester City | team-5 |
| Tottenham | team-6 |

## Test Philosophy

These tests validate the **no service-to-service communication** requirement:
- Each service maintains its own static ID mappings
- Services never call each other to get IDs
- Data correlation happens on the client side using shared IDs
- Services remain loosely coupled while data remains coordinated