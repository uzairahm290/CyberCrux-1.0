# Practice Database Setup

This guide will help you set up the practice scenarios database for CyberCrux.

## Prerequisites

- MySQL database server running
- Node.js installed
- Access to the CyberCrux database

## Setup Instructions

### 1. Database Configuration

Make sure your database configuration is correct in the `server.js` file or set the following environment variables:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=cybercrux
```

### 2. Run the Setup Script

Navigate to the Backend directory and run the setup script:

```bash
cd Backend
node setup_practice_db.js
```

This script will:
- Create the practice scenarios table
- Create the practice questions table
- Create user progress tracking tables
- Create bookmark tables
- Insert sample practice scenarios and questions
- Create necessary indexes for performance

### 3. Verify Setup

The script will output the following information:
- Number of scenarios created
- Number of questions created
- List of tables created

### 4. API Endpoints

Once the database is set up, the following API endpoints will be available:

#### Get All Scenarios
```
GET /api/practice/scenarios
Query parameters:
- category: Filter by category (web, forensics, crypto, etc.)
- difficulty: Filter by difficulty (Easy, Medium, Hard)
- search: Search in title, description, or tags
- sortBy: Sort by (popular, newest, difficulty, points)
- limit: Number of results (default: 50)
- offset: Pagination offset (default: 0)
```

#### Get Scenario by ID
```
GET /api/practice/scenarios/:id
Returns scenario details with all questions
```

#### Get User Progress
```
GET /api/practice/progress
Requires authentication
Returns user's progress for all scenarios
```

#### Save Progress
```
POST /api/practice/progress
Requires authentication
Body: { scenarioId, score, timeTaken, answers, isCompleted }
```

#### Toggle Bookmark
```
POST /api/practice/bookmark/:scenarioId
Requires authentication
Toggles bookmark status for a scenario
```

#### Get Bookmarks
```
GET /api/practice/bookmarks
Requires authentication
Returns user's bookmarked scenarios
```

#### Get Statistics
```
GET /api/practice/stats
Requires authentication
Returns user's practice statistics
```

## Database Schema

### practice_scenarios
- id: Primary key
- title: Scenario title
- category: Category (web, forensics, crypto, etc.)
- difficulty: Difficulty level (Easy, Medium, Hard)
- time_estimate: Estimated completion time
- questions_count: Number of questions
- points: Total points available
- completion_rate: Average completion rate
- likes: Number of likes
- views: Number of views
- description: Scenario description
- tags: JSON array of tags
- is_featured: Whether scenario is featured
- is_active: Whether scenario is active

### practice_questions
- id: Primary key
- scenario_id: Foreign key to practice_scenarios
- question_text: The question text
- question_type: Type (multiple-choice, coding, scenario, practical)
- difficulty: Question difficulty
- points: Points for this question
- time_limit: Time limit in minutes
- options: JSON array for multiple choice questions
- correct_answer: Correct answer text
- explanation: Explanation of the answer
- code_template: Code template for coding questions
- code_snippet: Code snippet for practical questions
- scenario_context: Context for scenario questions
- expected_output: Expected output for coding questions
- order_index: Question order

### user_practice_progress
- id: Primary key
- user_id: Foreign key to users
- scenario_id: Foreign key to practice_scenarios
- score: User's score
- time_taken: Time taken in seconds
- completed_at: Completion timestamp
- answers: JSON object of user answers
- is_completed: Whether scenario is completed

### user_practice_bookmarks
- id: Primary key
- user_id: Foreign key to users
- scenario_id: Foreign key to practice_scenarios
- created_at: Bookmark creation timestamp

## Sample Data

The setup script includes sample practice scenarios for:
- Advanced SQL Injection (Web Security)
- Memory Forensics Analysis (Digital Forensics)
- RSA Cryptography Challenge (Cryptography)
- Malware Reverse Engineering (Reverse Engineering)
- Network Traffic Analysis (Network Security)
- Social Media OSINT (OSINT)

Each scenario includes multiple questions of different types (multiple-choice, coding, scenario-based, practical).

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your database credentials
   - Ensure MySQL server is running
   - Verify database exists

2. **Permission Errors**
   - Ensure your database user has CREATE, INSERT, UPDATE permissions
   - Check if tables already exist (script will skip existing tables)

3. **JSON Column Issues**
   - Ensure MySQL version supports JSON columns (5.7+)
   - Check if JSON functions are available

### Verification Commands

After setup, you can verify the installation:

```sql
-- Check tables
SHOW TABLES LIKE 'practice_%';

-- Check scenarios
SELECT COUNT(*) FROM practice_scenarios;

-- Check questions
SELECT COUNT(*) FROM practice_questions;

-- Check sample data
SELECT title, category, difficulty FROM practice_scenarios LIMIT 5;
```

## Next Steps

After setting up the database:

1. Restart your backend server
2. Test the API endpoints
3. Update the frontend to use the new API endpoints
4. Add more practice scenarios as needed

The practice system is now ready to use with dynamic data from the database! 