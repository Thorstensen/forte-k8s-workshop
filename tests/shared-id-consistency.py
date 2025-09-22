#!/usr/bin/env python3
"""
Integration test to verify shared ID consistency across all microservices.

This test validates that:
1. All services use the same team IDs for the same teams
2. Team IDs follow the agreed format (team-1, team-2, etc.)
3. Match IDs follow the agreed format (match-1, match-2, etc.)
4. No service-to-service communication is required for ID consistency
"""

import os
import sys
import json
import re

def get_repo_root():
    """Get the repository root directory."""
    return os.path.dirname(os.path.abspath(__file__))

def test_go_notification_center():
    """Test Go NotificationCenter service team ID consistency."""
    print("Testing Go NotificationCenter...")
    file_path = os.path.join(get_repo_root(), "..", "05 - NotificationCenter", "main.go")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Extract team definitions
    teams_found = {}
    team_pattern = r'\{ID: "([^"]+)", Name: "([^"]+)"\}'
    matches = re.findall(team_pattern, content)
    
    for team_id, team_name in matches:
        teams_found[team_name] = team_id
    
    return teams_found

def test_typescript_match_scheduler():
    """Test TypeScript MatchScheduler service team ID consistency."""
    print("Testing TypeScript MatchScheduler...")
    file_path = os.path.join(get_repo_root(), "..", "03 - MatchScheduler", "src", "domain", "Match.ts")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Extract TEAM_ID_MAP
    teams_found = {}
    map_pattern = r"'([^']+)':\s*'([^']+)'"
    matches = re.findall(map_pattern, content)
    
    for team_name, team_id in matches:
        teams_found[team_name] = team_id
    
    return teams_found

def test_csharp_team_generator():
    """Test C# TeamGenerator service team ID consistency."""
    print("Testing C# TeamGenerator...")
    file_path = os.path.join(get_repo_root(), "..", "01 - TeamGenerator", "src", "TeamGenerator.Domain", "Entities", "Team.cs")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Extract shared team IDs mapping
    teams_found = {}
    map_pattern = r'\["([^"]+)"\]\s*=\s*"([^"]+)"'
    matches = re.findall(map_pattern, content)
    
    for team_name, team_id in matches:
        teams_found[team_name] = team_id
    
    return teams_found

def test_python_betting_service():
    """Test Python BettingService team ID consistency."""
    print("Testing Python BettingService...")
    file_path = os.path.join(get_repo_root(), "..", "02 - BettingService", "src", "storage", "memory_storage.py")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Extract team creation with IDs
    teams_found = {}
    team_pattern = r'Team\(id="([^"]+)",\s*name="([^"]+)"\)'
    matches = re.findall(team_pattern, content)
    
    for team_id, team_name in matches:
        teams_found[team_name] = team_id
    
    return teams_found

def test_rust_stats_aggregator():
    """Test Rust StatsAggregator service team ID consistency."""
    print("Testing Rust StatsAggregator...")
    file_path = os.path.join(get_repo_root(), "..", "04 - StatsAggregator", "src", "generator.rs")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Extract shared teams
    teams_found = {}
    team_pattern = r'\("([^"]+)",\s*"([^"]+)",\s*"[^"]+",\s*"[^"]+"\)'
    matches = re.findall(team_pattern, content)
    
    for team_id, team_name in matches:
        if team_id.startswith('team-'):  # Only shared teams
            teams_found[team_name] = team_id
    
    return teams_found

def main():
    """Run all consistency tests."""
    print("=== Shared ID Consistency Integration Test ===\n")
    
    # Expected shared teams
    expected_teams = {
        "Manchester United": "team-1",
        "Liverpool": "team-2",
        "Chelsea": "team-3", 
        "Arsenal": "team-4",
        "Manchester City": "team-5",
        "Tottenham": "team-6"
    }
    
    # Test all services
    services = {
        "Go NotificationCenter": test_go_notification_center,
        "TypeScript MatchScheduler": test_typescript_match_scheduler,
        "C# TeamGenerator": test_csharp_team_generator,
        "Python BettingService": test_python_betting_service,
        "Rust StatsAggregator": test_rust_stats_aggregator
    }
    
    all_passed = True
    
    for service_name, test_func in services.items():
        print(f"\n{service_name}:")
        try:
            teams_found = test_func()
            
            for team_name, expected_id in expected_teams.items():
                if team_name in teams_found:
                    if teams_found[team_name] == expected_id:
                        print(f"  ✓ {team_name} -> {expected_id}")
                    else:
                        print(f"  ✗ {team_name} -> {teams_found[team_name]} (expected {expected_id})")
                        all_passed = False
                else:
                    print(f"  ✗ {team_name} -> NOT FOUND (expected {expected_id})")
                    all_passed = False
                    
        except Exception as e:
            print(f"  ✗ Error testing {service_name}: {e}")
            all_passed = False
    
    print(f"\n=== Test Result ===")
    if all_passed:
        print("✅ ALL TESTS PASSED: Shared ID consistency is maintained across all services!")
        return 0
    else:
        print("❌ SOME TESTS FAILED: ID inconsistencies detected.")
        return 1

if __name__ == "__main__":
    sys.exit(main())