-- Check if google_id column exists
DESCRIBE users;

-- Show current users (if any)
SELECT id, username, email, google_id FROM users LIMIT 5;

-- Check if google_id column exists (alternative method)
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'cybercrux' 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'google_id'; 