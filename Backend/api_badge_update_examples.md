# Badge Update API Examples

## 1. Get All Badges
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/badges" -Method GET

# curl (if available)
curl -X GET "http://localhost:5000/api/badges"
```

## 2. Get User's Badges
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:5000/api/badges/user/10" -Method GET

# curl
curl -X GET "http://localhost:5000/api/badges/user/10"
```

## 3. Manually Trigger Badge Check
```bash
# PowerShell
$body = '{"eventType":"login","eventData":{"timestamp":"2025-01-01"}}'
Invoke-WebRequest -Uri "http://localhost:5000/api/badges/check/10" -Method POST -ContentType "application/json" -Body $body

# curl
curl -X POST "http://localhost:5000/api/badges/check/10" \
     -H "Content-Type: application/json" \
     -d '{"eventType":"practice_complete","eventData":{"score":100,"time_taken":120}}'
```

## 4. Direct Database Updates (Advanced)

### Update Badge Icon URL
```sql
UPDATE badges 
SET icon = 'https://your-new-cdn.com/badges/first-day.png' 
WHERE name = 'First Day';
```

### Update Badge Criteria
```sql
UPDATE badges 
SET criteria = '{"type": "streak_days", "days": 5, "description": "Achieve a 5 day streak"}' 
WHERE name = '7 Day Streak';
```

### Update Badge Points/Rarity
```sql
UPDATE badges 
SET points_reward = 150, rarity = 'epic' 
WHERE name = 'Perfect Score';
```

## 5. Add New Badge
```sql
INSERT INTO badges (name, description, icon, badge_type, criteria, points_reward, rarity, is_active) 
VALUES (
  'Code Reviewer',
  'Help improve the platform by reporting bugs!',
  'https://your-cdn.com/badges/code-reviewer.png',
  'special',
  '{"type": "bug_report", "count": 1, "description": "Report your first bug"}',
  100,
  'rare',
  TRUE
);
```

## 6. Badge Event Types for Checking

- `login` - User login events
- `practice_complete` - Scenario completion
- `streak` - Streak-related events  
- `manual` - Manual badge checking

## 7. Event Data Examples

### Practice Completion
```json
{
  "eventType": "practice_complete",
  "eventData": {
    "score": 95,
    "time_taken": 180,
    "scenario_id": 5,
    "category": "web",
    "tags": ["sql-injection"]
  }
}
```

### Login Event
```json
{
  "eventType": "login",
  "eventData": {
    "timestamp": "2025-01-01T10:00:00Z"
  }
}
```
