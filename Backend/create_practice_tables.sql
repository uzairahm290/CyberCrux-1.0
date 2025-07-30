 -- Create practice_categories table
CREATE TABLE IF NOT EXISTS practice_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    description TEXT,
    color_gradient VARCHAR(100) DEFAULT 'from-blue-500 to-cyan-500',
    count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create practice scenarios table
CREATE TABLE IF NOT EXISTS practice_scenarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    time_estimate VARCHAR(20) NOT NULL,
    questions_count INT NOT NULL DEFAULT 0,
    points INT NOT NULL DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    likes INT DEFAULT 0,
    views INT DEFAULT 0,
    description TEXT NOT NULL,
    tags JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create practice questions table
CREATE TABLE IF NOT EXISTS practice_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scenario_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple-choice', 'coding', 'scenario', 'practical') NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    points INT NOT NULL DEFAULT 0,
    time_limit INT DEFAULT 0, -- in minutes
    options JSON, -- for multiple choice questions
    correct_answer TEXT, -- for coding/scenario/practical questions
    explanation TEXT,
    code_template TEXT, -- for coding questions
    code_snippet TEXT, -- for practical questions
    scenario_context TEXT, -- for scenario questions
    expected_output TEXT, -- for coding questions
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scenario_id) REFERENCES practice_scenarios(id) ON DELETE CASCADE
);

-- Create user practice progress table
CREATE TABLE IF NOT EXISTS user_practice_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scenario_id INT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0.00,
    time_taken INT DEFAULT 0, -- in seconds
    completed_at TIMESTAMP NULL,
    answers JSON, -- store user answers
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scenario_id) REFERENCES practice_scenarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_scenario (user_id, scenario_id)
);

-- Create user practice bookmarks table
CREATE TABLE IF NOT EXISTS user_practice_bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    scenario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scenario_id) REFERENCES practice_scenarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_bookmark (user_id, scenario_id)
);

-- Insert default categories
INSERT INTO practice_categories (key_name, label, description, color_gradient, count) VALUES
('all', 'All Categories', 'Complete collection of cybersecurity scenarios', 'from-blue-500 to-cyan-500', 0),
('web', 'Web Security', 'OWASP Top 10, XSS, SQL Injection, CSRF', 'from-green-500 to-emerald-500', 0),
('forensics', 'Digital Forensics', 'Memory analysis, disk forensics, network forensics', 'from-purple-500 to-pink-500', 0),
('crypto', 'Cryptography', 'Encryption, hashing, digital signatures, PKI', 'from-yellow-500 to-orange-500', 0),
('reverse', 'Reverse Engineering', 'Malware analysis, binary exploitation, debugging', 'from-red-500 to-pink-500', 0),
('network', 'Network Security', 'Network protocols, firewalls, IDS/IPS, VPN', 'from-indigo-500 to-purple-500', 0),
('osint', 'OSINT', 'Open source intelligence gathering', 'from-teal-500 to-cyan-500', 0);

-- Insert sample practice scenarios
INSERT INTO practice_scenarios (title, category, difficulty, time_estimate, questions_count, points, completion_rate, likes, views, description, tags, is_featured) VALUES
('Advanced SQL Injection', 'web', 'Hard', '15 min', 8, 150, 87.5, 234, 1247, 'Master advanced SQL injection techniques including blind, time-based, and union-based attacks.', '["SQL Injection", "Web Security", "Database"]', TRUE),
('Memory Forensics Analysis', 'forensics', 'Medium', '20 min', 12, 200, 92.0, 189, 892, 'Analyze memory dumps to identify malicious processes and extract artifacts.', '["Memory Analysis", "Volatility", "Malware"]', FALSE),
('RSA Cryptography Challenge', 'crypto', 'Easy', '10 min', 6, 100, 95.0, 156, 567, 'Understand RSA encryption, key generation, and digital signatures.', '["RSA", "Public Key", "Digital Signatures"]', FALSE),
('Malware Reverse Engineering', 'reverse', 'Hard', '25 min', 15, 300, 78.0, 312, 1456, 'Reverse engineer a malicious binary to understand its behavior and capabilities.', '["Malware", "IDA Pro", "Assembly"]', TRUE),
('Network Traffic Analysis', 'network', 'Medium', '18 min', 10, 175, 89.0, 201, 934, 'Analyze network packets to identify suspicious activities and protocols.', '["Wireshark", "Network", "Protocols"]', FALSE),
('Social Media OSINT', 'osint', 'Easy', '12 min', 7, 125, 91.0, 134, 678, 'Gather intelligence from social media platforms and public sources.', '["OSINT", "Social Media", "Information Gathering"]', FALSE);

-- Insert sample questions for the first scenario (Advanced SQL Injection)
INSERT INTO practice_questions (scenario_id, question_text, question_type, difficulty, points, time_limit, options, correct_answer, explanation, order_index) VALUES
(1, 'What is the primary goal of a SQL injection attack?', 'multiple-choice', 'Medium', 20, 2, '["To steal user credentials", "To execute arbitrary SQL commands", "To bypass authentication", "All of the above"]', '3', 'SQL injection attacks aim to execute arbitrary SQL commands, which can lead to data theft, authentication bypass, and other malicious activities.', 1),
(1, 'Write a SQL query to safely retrieve user data using parameterized queries. The table name is "users" and you need to get users by their email.', 'coding', 'Hard', 25, 5, NULL, 'SELECT * FROM users WHERE email = ?', 'Parameterized queries separate SQL logic from data, preventing injection attacks.', 2),
(1, 'You discover a login form vulnerable to SQL injection. The query is: SELECT * FROM users WHERE username="$username" AND password="$password". How would you exploit this?', 'scenario', 'Hard', 30, 5, NULL, "Use ' OR '1'='1' -- as username to bypass authentication", 'This payload closes the username field and adds a condition that is always true, bypassing the password check.', 3),
(1, 'Which of the following is NOT a type of SQL injection?', 'multiple-choice', 'Easy', 15, 2, '["Union-based injection", "Boolean-based blind injection", "Time-based blind injection", "Cross-site scripting injection"]', '3', 'Cross-site scripting (XSS) is a different type of attack. The other options are all types of SQL injection.', 4),
(1, 'Analyze this code snippet and identify the SQL injection vulnerability:', 'practical', 'Medium', 20, 3, NULL, 'Direct concatenation of user input without sanitization', 'The code directly concatenates user input into the SQL query, making it vulnerable to injection attacks.', 5);

-- Insert sample questions for the second scenario (Memory Forensics Analysis)
INSERT INTO practice_questions (scenario_id, question_text, question_type, difficulty, points, time_limit, options, correct_answer, explanation, order_index) VALUES
(2, 'What is the primary purpose of memory forensics?', 'multiple-choice', 'Easy', 15, 2, '["To recover deleted files", "To analyze running processes and system state", "To decrypt encrypted data", "To repair corrupted memory"]', '1', 'Memory forensics focuses on analyzing the current state of system memory, including running processes, network connections, and system artifacts.', 1),
(2, 'Using Volatility Framework, what command would you use to list all running processes?', 'practical', 'Medium', 20, 3, NULL, 'pslist', 'The "pslist" command in Volatility lists all running processes in the memory dump.', 2),
(2, 'You are analyzing a memory dump and find a suspicious process with no parent process. What does this indicate?', 'scenario', 'Hard', 25, 4, NULL, 'Potential malware or process injection', 'Processes without parent processes often indicate malware or process injection techniques used to hide malicious activity.', 3);

-- Insert sample questions for the third scenario (RSA Cryptography Challenge)
INSERT INTO practice_questions (scenario_id, question_text, question_type, difficulty, points, time_limit, options, correct_answer, explanation, order_index) VALUES
(3, 'What does RSA stand for?', 'multiple-choice', 'Easy', 10, 1, '["Rivest-Shamir-Adleman", "Random Secure Algorithm", "Rapid Security Authentication", "Robust Security Architecture"]', '0', 'RSA stands for Rivest-Shamir-Adleman, named after its creators.', 1),
(3, 'Implement a simple RSA key generation function in Python.', 'coding', 'Medium', 30, 8, NULL, 'def generate_rsa_keys(bits=1024):\n    # Implementation here\n    pass', 'RSA key generation involves finding two large prime numbers and calculating the public/private key pair.', 2);

-- Update category counts
UPDATE practice_categories SET count = (
    SELECT COUNT(*) FROM practice_scenarios WHERE category_key = practice_categories.key_name AND is_active = TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_scenarios_category ON practice_scenarios(category);
CREATE INDEX idx_scenarios_difficulty ON practice_scenarios(difficulty);
CREATE INDEX idx_scenarios_featured ON practice_scenarios(is_featured);
CREATE INDEX idx_questions_scenario ON practice_questions(scenario_id);
CREATE INDEX idx_questions_type ON practice_questions(question_type);
CREATE INDEX idx_progress_user ON user_practice_progress(user_id);
CREATE INDEX idx_progress_scenario ON user_practice_progress(scenario_id);
CREATE INDEX idx_bookmarks_user ON user_practice_bookmarks(user_id);